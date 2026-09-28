'use client';

import { useActionState, useState } from 'react';
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
import { loginAction, type LoginState } from '@/app/actions/authActions';

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form action={action} className="space-y-5">
      {state.error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{state.error}</div>}
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input id="email" name="email" type="email" autoComplete="email" required placeholder="nama@smkn2magelang.sch.id" className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#0077B6] focus:ring-2 focus:ring-sky-100" />
        </div>
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Kata sandi</label>
        <div className="relative">
          <LockKeyhole className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required placeholder="Masukkan kata sandi" className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-white pl-11 pr-12 text-sm outline-none transition focus:border-[#0077B6] focus:ring-2 focus:ring-sky-100" />
          <button type="button" onClick={() => setShowPassword((value) => !value)} aria-pressed={showPassword} aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'} className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-[#0077B6]">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <button type="submit" disabled={pending} className="group flex h-12 w-full items-center justify-between gap-2 rounded-xl bg-[#0077B6] px-4 text-sm font-medium text-white transition hover:bg-[#00679e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0077B6] disabled:cursor-not-allowed disabled:opacity-60">
        {pending ? 'Memeriksa...' : 'Masuk'}{pending ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />}
      </button>
    </form>
  );
}
