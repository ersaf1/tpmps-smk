'use client';

import { useActionState } from 'react';
import { changePasswordAction, type LoginState } from '@/app/actions/authActions';

const initialState: LoginState = {};

export default function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, initialState);
  return (
    <form action={action} className="space-y-4">
      {state.error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{state.error}</div>}
      <div><label htmlFor="password" className="mb-2 block text-sm font-semibold">Kata sandi baru</label><input id="password" name="password" type="password" autoComplete="new-password" required minLength={10} className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-[#0077B6] focus:ring-4 focus:ring-sky-100" /></div>
      <div><label htmlFor="confirmation" className="mb-2 block text-sm font-semibold">Ulangi kata sandi baru</label><input id="confirmation" name="confirmation" type="password" autoComplete="new-password" required minLength={10} className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-[#0077B6] focus:ring-4 focus:ring-sky-100" /></div>
      <p className="text-xs leading-relaxed text-slate-500">Minimal 10 karakter serta memuat huruf, angka, dan simbol.</p>
      <button disabled={pending} className="h-12 w-full rounded-xl bg-[#0077B6] text-sm font-bold text-white disabled:opacity-60">{pending ? 'Menyimpan...' : 'Simpan kata sandi'}</button>
    </form>
  );
}
