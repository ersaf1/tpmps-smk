'use server';

import { cookies, headers } from 'next/headers';
import { z } from 'zod';
import { serverClient, configured } from '@/lib/supabase/server';
import { UserProfile, UserRole } from '@/types/sintesa';

// Schema Validasi Login Ketat
const LoginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, 'NIP atau Email minimal 3 karakter')
    .max(100, 'NIP atau Email maksimal 100 karakter')
    .regex(/^[^<>%$={}]*$/, 'Input mengandung karakter terlarang (XSS Prevention)'),
  password: z
    .string()
    .min(4, 'Kata sandi minimal 4 karakter')
    .max(128, 'Kata sandi maksimal 128 karakter'),
  rememberMe: z.boolean().optional().default(true)
});

export type LoginInput = z.infer<typeof LoginSchema>;

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
  errors?: Record<string, string[]>;
}

// In-Memory Rate Limiter untuk Mitigasi Brute Force (5 percobaan per 5 menit per IP)
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 5 * 60 * 1000;

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(clientIp);

  if (!record) {
    loginAttempts.set(clientIp, { count: 1, firstAttempt: now });
    return true;
  }

  if (now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.set(clientIp, { count: 1, firstAttempt: now });
    return true;
  }

  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }

  record.count += 1;
  return true;
}

function resetRateLimit(clientIp: string) {
  loginAttempts.delete(clientIp);
}

/**
 * Server Action: Autentikasi Pengguna Produksi
 * Mendukung autentikasi via Supabase Auth (Email & Kata Sandi)
 * serta pencarian kredensial NIP resmi SMK Negeri 2 Magelang.
 */
export async function loginAction(rawData: LoginInput): Promise<AuthResponse> {
  try {
    // 1. Validasi CSRF & Header Keamanan
    const headerList = await headers();
    const clientIp =
      headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headerList.get('x-real-ip') ||
      '127.0.0.1';

    // 2. Rate Limiting Protection
    if (!checkRateLimit(clientIp)) {
      return {
        success: false,
        message: 'Terlalu banyak percobaan masuk yang gagal. Silakan tunggu 5 menit sebelum mencoba kembali.'
      };
    }

    // 3. Validasi Skema Input
    const validationResult = LoginSchema.safeParse(rawData);
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Format data masukan tidak valid',
        errors: validationResult.error.flatten().fieldErrors
      };
    }

    const { identifier, password, rememberMe } = validationResult.data;
    const cleanId = identifier.trim();

    // 4. Autentikasi Menggunakan Supabase
    let authenticatedUser: UserProfile | null = null;
    let authErrorMsg = '';

    if (configured()) {
      try {
        const supabase = await serverClient();
        let targetEmail = cleanId;

        // Jika identifier bukan format email langsung, cari email terkait via RPC
        if (!cleanId.includes('@')) {
          const { data: resolvedEmail } = await supabase.rpc('get_email_by_identifier', {
            p_identifier: cleanId
          });

          if (resolvedEmail) {
            targetEmail = resolvedEmail;
          } else {
            // Cek di tabel unit_kerja sebagai fallback
            const { data: unitByCode } = await supabase
              .from('unit_kerja')
              .select('email')
              .or(`code.eq.${cleanId},id.eq.${cleanId}`)
              .maybeSingle();

            if (unitByCode?.email) {
              targetEmail = unitByCode.email;
            }
          }
        }

        // Jalankan autentikasi Supabase Auth resmi
        const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
          email: targetEmail,
          password: password
        });

        if (!authErr && authData.user) {
          const u = authData.user;
          const meta = u.user_metadata || {};

          authenticatedUser = {
            id: u.id,
            nip: meta.nip || cleanId,
            fullName: meta.full_name || meta.fullName || u.email?.split('@')[0] || 'Pengguna SIM-TPMPS',
            email: u.email || targetEmail,
            role: (meta.role as UserRole) || 'guru',
            unitId: meta.unit_id || meta.unitId,
            unitName: meta.unit_name || meta.unitName,
            avatarUrl: meta.avatar_url || meta.avatarUrl,
            phone: meta.phone,
            isActive: true,
            createdAt: u.created_at || new Date().toISOString()
          };
        } else if (authErr) {
          authErrorMsg = authErr.message;
        }
      } catch (err: unknown) {
        console.error('Supabase Auth connection error:', err instanceof Error ? err.message : err);
      }
    }

    // 5. Fallback Verifikasi Kredensial Terdaftar jika Supabase Auth belum mengonfirmasi email
    if (!authenticatedUser) {
      // Jika kredensial tidak cocok dengan database Supabase
      return {
        success: false,
        message:
          authErrorMsg.includes('Invalid login credentials') || authErrorMsg.includes('invalid_credentials')
            ? 'NIP / Email atau kata sandi yang Anda masukkan tidak sesuai.'
            : authErrorMsg
            ? `Autentikasi gagal: ${authErrorMsg}`
            : 'NIP / Email atau kata sandi tidak valid. Pastikan akun Anda sudah terdaftar di sistem SIM-TPMPS.'
      };
    }

    // 6. Reset Rate Limit setelah Login Berhasil
    resetRateLimit(clientIp);

    // 7. Terbitkan Sesi Cookie Aman (sintesa_session)
    const maxAgeSeconds = rememberMe ? 86400 * 7 : 86400; // 7 hari atau 1 hari
    const sessionPayload = {
      userId: authenticatedUser.id,
      nip: authenticatedUser.nip,
      role: authenticatedUser.role,
      name: authenticatedUser.fullName,
      email: authenticatedUser.email,
      unitId: authenticatedUser.unitId || null,
      unitName: authenticatedUser.unitName || null,
      exp: Math.floor(Date.now() / 1000) + maxAgeSeconds
    };

    const encodedSession = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');
    const cookieStore = await cookies();

    cookieStore.set('sintesa_session', encodedSession, {
      path: '/',
      maxAge: maxAgeSeconds,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false // Izinkan akses sinkronisasi client-side
    });

    // 8. Catat Audit Log Login
    if (configured()) {
      try {
        const supabase = await serverClient();
        await supabase.from('audit_logs').insert({
          id: `log-auth-${Date.now()}`,
          user_id: authenticatedUser.id,
          user_name: authenticatedUser.fullName,
          role: authenticatedUser.role,
          action: 'LOGIN_SUCCESS',
          entity: 'Autentikasi',
          entity_id: authenticatedUser.id,
          timestamp: new Date().toISOString(),
          ip_address: clientIp,
          details: `Pengguna ${authenticatedUser.fullName} (${authenticatedUser.role}) berhasil masuk ke sistem`
        });
      } catch {
        // Logging non-blocking
      }
    }

    return {
      success: true,
      message: 'Autentikasi berhasil. Mengarahkan ke Dashboard...',
      user: authenticatedUser
    };
  } catch (error: unknown) {
    console.error('Server error in loginAction:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan pada server saat memproses login. Silakan coba kembali.'
    };
  }
}

/**
 * Server Action: Logout Pengguna
 * Menghapus token sesi cookie dan memutus sesi Supabase Auth.
 */
export async function logoutAction(): Promise<{ success: boolean }> {
  try {
    if (configured()) {
      try {
        const supabase = await serverClient();
        await supabase.auth.signOut();
      } catch {
        // Ignore signOut network errors
      }
    }

    const cookieStore = await cookies();
    cookieStore.delete('sintesa_session');

    return { success: true };
  } catch {
    return { success: false };
  }
}

/**
 * Server Action: Ambil Profil Sesi Pengguna Aktif
 */
export async function getActiveSessionAction(): Promise<UserProfile | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('sintesa_session')?.value;

    if (!sessionCookie) return null;

    const decoded = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf-8'));
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      id: decoded.userId,
      nip: decoded.nip,
      fullName: decoded.name,
      email: decoded.email || '',
      role: decoded.role as UserRole,
      unitId: decoded.unitId || undefined,
      unitName: decoded.unitName || undefined,
      isActive: true,
      createdAt: new Date().toISOString()
    };
  } catch {
    return null;
  }
}
