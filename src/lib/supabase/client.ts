'use client';
import { createBrowserClient } from '@supabase/ssr';
export function browserClient() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !key) {
    throw new Error('Koneksi Supabase belum dikonfigurasi.');
  }
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key);
}
