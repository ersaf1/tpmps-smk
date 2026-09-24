import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseKey = () =>
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const configured = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && supabaseKey());

export async function serverClient() {
  if (!configured()) throw new Error('Koneksi Supabase belum dikonfigurasi.');
  const jar = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, supabaseKey()!, { cookies: {
    getAll: () => jar.getAll(),
    setAll: (values) => { try { values.forEach(({name,value,options}) => jar.set(name,value,options)); } catch { /* Refreshed in proxy. */ } },
  }});
}
