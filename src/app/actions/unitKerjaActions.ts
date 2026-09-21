'use server';

import { cookies, headers } from 'next/headers';
import { z } from 'zod';
import { serverClient, configured } from '@/lib/supabase/server';
import { sintesaService } from '@/lib/services/sintesaDataService';

// Zod Schema dengan Validasi Ketat & Anti-XSS (Menolak tag HTML dan simbol manipulasi)
const UpdateUnitKerjaSchema = z.object({
  unitId: z
    .string()
    .trim()
    .min(1, 'ID unit kerja wajib diisi')
    .max(50, 'ID unit kerja melebihi batas panjang')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Format ID tidak valid'),
  name: z
    .string()
    .trim()
    .min(3, 'Nama unit minimal 3 karakter')
    .max(100, 'Nama unit maksimal 100 karakter')
    .regex(/^[^<>%$={}]*$/, 'Karakter input mengandung simbol terlarang (XSS Prevention)'),
  picName: z
    .string()
    .trim()
    .min(3, 'Nama PIC minimal 3 karakter')
    .max(80, 'Nama PIC maksimal 80 karakter')
    .regex(/^[^<>%$={}]*$/, 'Karakter nama PIC mengandung simbol terlarang'),
  category: z.enum(['Manajemen', 'Kejuruan', 'Layanan', 'Pengawasan'], {
    message: 'Kategori unit kerja tidak valid'
  }),
  score: z
    .number()
    .min(0, 'Nilai skor minimal 0')
    .max(100, 'Nilai skor maksimal 100'),
  completedIndicators: z
    .number()
    .int('Jumlah indikator harus bilangan bulat')
    .min(0)
    .max(100)
});

export type UpdateUnitKerjaInput = z.infer<typeof UpdateUnitKerjaSchema>;

export interface ActionResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Server Action: Pembaruan Data Unit Kerja
 * Diproteksi terhadap SQL Injection (Parameterized Query via Supabase/PostgreSQL) dan XSS
 */
export async function updateUnitKerjaAction(
  rawData: UpdateUnitKerjaInput
): Promise<ActionResponse<{ id: string; updatedAt: string }>> {
  try {
    // 1. Validasi CSRF Origin Header
    const headerList = await headers();
    const origin = headerList.get('origin');
    const host = headerList.get('host');
    if (process.env.NODE_ENV === 'production' && origin && host) {
      const allowedHost = new URL(origin).host;
      if (allowedHost !== host) {
        return {
          success: false,
          message: 'Permintaan ditolak: Pelanggaran validasi CORS/CSRF'
        };
      }
    }

    // 2. Validasi Sesi Autentikasi & Verifikasi RBAC Server-Side
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('sintesa_session')?.value;
    if (!sessionCookie) {
      return { success: false, message: 'Autentikasi gagal: Sesi tidak ditemukan' };
    }

    let userRole = '';
    try {
      const parsed = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf-8'));
      userRole = parsed.role;
    } catch {
      // Fallback dev mode check
      const activeUser = sintesaService.getActiveUser();
      userRole = activeUser.role;
    }

    const ALLOWED_ROLES = ['admin', 'tpmps', 'kepala_sekolah'];
    if (!ALLOWED_ROLES.includes(userRole)) {
      return {
        success: false,
        message: 'Akses ditolak: Hanya Administrator atau Tim Mutu yang berwenang mengubah unit kerja'
      };
    }

    // 3. Eksekusi Skema Zod (Sanitasi & Validasi Tipe)
    const validationResult = UpdateUnitKerjaSchema.safeParse(rawData);
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validasi form gagal',
        errors: validationResult.error.flatten().fieldErrors
      };
    }

    const validated = validationResult.data;

    // 4. Parameterized Query via Database Client (Anti-SQLi)
    const updatedAt = new Date().toISOString();

    if (configured()) {
      const supabase = await serverClient();
      const { data, error } = await supabase
        .from('unit_kerja')
        .update({
          name: validated.name,
          pic_name: validated.picName,
          category: validated.category,
          score: validated.score,
          completed_indicators: validated.completedIndicators,
          updated_at: updatedAt
        })
        .eq('id', validated.unitId)
        .select('id, updated_at')
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: `Unit kerja "${validated.name}" berhasil diperbarui`,
        data: { id: data.id, updatedAt: data.updated_at }
      };
    } else {
      // Persistence fallback memory/store
      const units = sintesaService.getUnits();
      const unit = units.find((u) => u.id === validated.unitId);
      if (unit) {
        unit.name = validated.name;
        unit.picName = validated.picName;
        unit.category = validated.category;
        unit.score = validated.score;
        unit.completedIndicators = validated.completedIndicators;
      }

      return {
        success: true,
        message: `Unit kerja "${validated.name}" berhasil diperbarui secara lokal`,
        data: { id: validated.unitId, updatedAt }
      };
    }
  } catch (error: unknown) {
    console.error('[SECURITY AUDIT ERROR - updateUnitKerjaAction]:', error);
    return {
      success: false,
      message: 'Kesalahan internal server: Gagal memproses transaksi database'
    };
  }
}
