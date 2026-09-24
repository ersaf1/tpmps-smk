import Image from 'next/image';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import { getCurrentProfile } from '@/lib/auth';

export default async function LoginPage() {
  if (await getCurrentProfile()) redirect('/dashboard');

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-10">
          <div className="mb-8 text-center">
            <Image src="/logo.png" alt="Logo SMK Negeri 2 Magelang" width={72} height={72} className="mx-auto mb-5 h-18 w-18 object-contain" priority />
            <h1 className="text-2xl font-black tracking-tight text-slate-950">SINTESA <span className="text-[#0077B6]">TPMPS</span></h1>
            <p className="mt-2 text-sm text-slate-500">Arsip Dokumen Mutu SMK Negeri 2 Magelang</p>
          </div>
          <LoginForm />
        </div>
        <p className="mt-5 text-center text-xs text-slate-500">Gunakan akun resmi yang diberikan administrator.</p>
      </div>
    </main>
  );
}
