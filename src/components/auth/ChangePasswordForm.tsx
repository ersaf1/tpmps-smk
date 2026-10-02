'use client';

import { useActionState, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { changePasswordAction, type LoginState } from '@/app/actions/authActions';

const initialState: LoginState = {};

export default function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  return (
    <form action={action} className="space-y-4">
      {state.error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{state.error}</div>}
      <div><label htmlFor="password" className="mb-2 block text-sm font-semibold">Kata sandi baru</label><div className="relative"><input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required minLength={10} className="h-12 w-full rounded-xl border border-slate-300 px-4 pr-12 outline-none focus:border-[#0077B6] focus:ring-4 focus:ring-sky-100" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Sembunyikan kata sandi baru' : 'Tampilkan kata sandi baru'} aria-pressed={showPassword} className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#0077B6]">{showPassword ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}</button></div></div>
      <div><label htmlFor="confirmation" className="mb-2 block text-sm font-semibold">Ulangi kata sandi baru</label><div className="relative"><input id="confirmation" name="confirmation" type={showConfirmation ? 'text' : 'password'} autoComplete="new-password" required minLength={10} className="h-12 w-full rounded-xl border border-slate-300 px-4 pr-12 outline-none focus:border-[#0077B6] focus:ring-4 focus:ring-sky-100" /><button type="button" onClick={() => setShowConfirmation((value) => !value)} aria-label={showConfirmation ? 'Sembunyikan konfirmasi kata sandi' : 'Tampilkan konfirmasi kata sandi'} aria-pressed={showConfirmation} className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#0077B6]">{showConfirmation ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}</button></div></div>
      <p className="text-xs leading-relaxed text-slate-500">Minimal 10 karakter serta memuat huruf, angka, dan simbol.</p>
      <button disabled={pending} className="h-12 w-full rounded-xl bg-[#0077B6] text-sm font-bold text-white disabled:opacity-60">{pending ? 'Menyimpan...' : 'Simpan kata sandi'}</button>
    </form>
  );
}
