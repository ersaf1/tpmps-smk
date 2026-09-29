import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const getSupabaseKey = () =>
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

export const configured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && getSupabaseKey());

export async function serverClient() {
  if (!configured()) throw new Error('Koneksi Supabase belum dikonfigurasi.');
  const jar = await cookies();
  const key = getSupabaseKey();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (values) => {
        try {
          values.forEach(({ name, value, options }) => jar.set(name, value, options));
        } catch {
          /* Refreshed in proxy */
        }
      }
    }
  });
}
