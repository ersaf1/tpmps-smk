'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { serverClient, configured } from '@/lib/supabase/server';
import { getCurrentProfile } from '@/lib/auth';
import { UserProfile, UserRole } from '@/types/sintesa';

// Schema Validasi Login Ketat
export const LoginSchema = z.object({
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

export interface LoginState {
  error?: string;
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
 * Server Action: Autentikasi Pengguna via Form Action
 */
export async function loginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!configured()) return { error: 'Layanan autentikasi belum dikonfigurasi.' };
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 1) {
    return { error: 'Masukkan email dan kata sandi yang valid.' };
  }

  try {
    const supabase = await serverClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return { error: 'Email atau kata sandi tidak valid.' };

    const { data: profile } = await supabase.from('profiles').select('id, is_active').eq('id', data.user.id).single();
    if (!profile?.is_active) {
      await supabase.auth.signOut();
      return { error: 'Akun tidak aktif atau belum terdaftar pada sistem.' };
    }

    await supabase.from('audit_logs').insert({ actor_id: data.user.id, action: 'LOGIN', entity_type: 'auth', entity_id: data.user.id });
  } catch {
    return { error: 'Gagal menghubungi server autentikasi.' };
  }
  redirect('/dashboard');
}

/**
 * Server Action: Autentikasi Pengguna Produksi (Typed Login Input)
 */
export async function loginApiAction(rawData: LoginInput): Promise<AuthResponse> {
  try {
    const headerList = await headers();
    const clientIp =
      headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headerList.get('x-real-ip') ||
      '127.0.0.1';

    if (!checkRateLimit(clientIp)) {
      return {
        success: false,
        message: 'Terlalu banyak percobaan masuk yang gagal. Silakan tunggu 5 menit sebelum mencoba kembali.'
      };
    }

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

    let authenticatedUser: UserProfile | null = null;
    let authErrorMsg = '';

    if (configured()) {
      try {
        const supabase = await serverClient();
        let targetEmail = cleanId;

        if (!cleanId.includes('@')) {
          const { data: resolvedEmail } = await supabase.rpc('get_email_by_identifier', {
            p_identifier: cleanId
          });

          if (resolvedEmail) {
            targetEmail = resolvedEmail;
          } else {
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

    if (!authenticatedUser) {
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

    resetRateLimit(clientIp);

    const maxAgeSeconds = rememberMe ? 86400 * 7 : 86400;
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
      httpOnly: false
    });

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
        // Non-blocking
      }
    }

    return {
      success: true,
      message: 'Autentikasi berhasil. Mengarahkan ke Dashboard...',
      user: authenticatedUser
    };
  } catch (error: unknown) {
    console.error('Server error in loginApiAction:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan pada server saat memproses login. Silakan coba kembali.'
    };
  }
}

/**
 * Server Action: Logout Pengguna
 */
export async function logoutAction(): Promise<void> {
  try {
    if (configured()) {
      const supabase = await serverClient();
      await supabase.auth.signOut();
    }
  } catch {
    // Ignore network issues on sign out
  }

  try {
    const cookieStore = await cookies();
    cookieStore.delete('sintesa_session');
  } catch {
    // Ignore
  }

  redirect('/login');
}

/**
 * Server Action: Ganti Kata Sandi (Password Change)
 */
export async function changePasswordAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const profile = await getCurrentProfile();
  if (!profile) return { error: 'Sesi berakhir. Silakan login kembali.' };

  const password = String(formData.get('password') ?? '');
  const confirmation = String(formData.get('confirmation') ?? '');
  if (password !== confirmation) return { error: 'Konfirmasi kata sandi tidak sama.' };
  if (password.length < 10 || !/[A-Za-z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    return { error: 'Gunakan minimal 10 karakter yang memuat huruf, angka, dan simbol.' };
  }

  const supabase = await serverClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: 'Kata sandi gagal diperbarui. Coba kembali.' };
  const { error: profileError } = await supabase.rpc('mark_password_changed');
  if (profileError) return { error: 'Kata sandi berubah, tetapi status akun gagal diperbarui. Hubungi administrator.' };
  redirect('/dashboard');
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
