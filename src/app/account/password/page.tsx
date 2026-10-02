import { redirect } from 'next/navigation';
import ChangePasswordForm from '@/components/auth/ChangePasswordForm';
import { requireProfile } from '@/lib/auth';

export default async function ChangePasswordPage() {
  const profile = await requireProfile();
  if (!profile.mustChangePassword) redirect('/dashboard');
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
        <p className="text-xs font-bold uppercase tracking-wider text-[#0077B6]">Keamanan akun</p>
        <h1 className="mt-2 text-2xl font-black text-slate-950">Buat kata sandi baru</h1>
        <p className="mb-7 mt-2 text-sm leading-relaxed text-slate-500">Halo {profile.fullName}. Ganti kata sandi sementara sebelum membuka arsip dokumen.</p>
        <ChangePasswordForm />
      </div>
    </main>
  );
}
