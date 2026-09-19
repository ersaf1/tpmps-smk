// ==========================================================
// SUPABASE CLIENT & REST SERVICE - SIGMA-TPMPS SMK
// ==========================================================

export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qmhtxkhvovajanyookta.supabase.co',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_k8MbyJVhOzoluyZZb4n6Jw_lSM2SWH6'
};

/**
 * Native REST API fetch wrapper for Supabase PostgREST
 * Bekerja langsung menggunakan fetch bawaan Next.js / browser tanpa dependensi eksternal
 */
export async function supabaseRestFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const url = `${SUPABASE_CONFIG.url}/rest/v1/${endpoint}`;
    const headers: Record<string, string> = {
      'apikey': SUPABASE_CONFIG.anonKey,
      'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...(options.headers as Record<string, string> || {})
    };

    const res = await fetch(url, {
      ...options,
      headers
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { data: null, error: `HTTP ${res.status}: ${errorText}` };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Gagal terhubung ke Supabase' };
  }
}

/**
 * Helper untuk menguji koneksi ke server Supabase
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
      }
    });

    if (res.ok || res.status === 200 || res.status === 404) {
      return {
        success: true,
        message: 'Koneksi ke server Supabase (qmhtxkhvovajanyookta) berhasil terhubung!'
      };
    }

    return {
      success: false,
      message: `Status respons Supabase: ${res.status} ${res.statusText}`
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal menjangkau server Supabase: ${err.message}`
    };
  }
}
