'use server';

import { redirect } from 'next/navigation';
import { serverClient, configured } from '@/lib/supabase/server';
import { getCurrentProfile } from '@/lib/auth';

export interface LoginState { error?: string }

export async function loginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!configured()) return { error: 'Layanan autentikasi belum dikonfigurasi.' };
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 1) {
    return { error: 'Masukkan email dan kata sandi yang valid.' };
  }

  const supabase = await serverClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: 'Email atau kata sandi tidak valid.' };

  const { data: profile } = await supabase.from('profiles').select('id, is_active').eq('id', data.user.id).single();
  if (!profile?.is_active) {
    await supabase.auth.signOut();
    return { error: 'Akun tidak aktif atau belum terdaftar pada sistem.' };
  }

  await supabase.from('audit_logs').insert({ actor_id: data.user.id, action: 'LOGIN', entity_type: 'auth', entity_id: data.user.id });
  redirect('/dashboard');
}

export async function logoutAction() {
  if (configured()) {
    const supabase = await serverClient();
    await supabase.auth.signOut();
  }
  redirect('/login');
}

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
