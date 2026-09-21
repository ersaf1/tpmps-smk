'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { loginAction } from '@/app/actions/authActions';
import { sintesaService } from '@/lib/services/sintesaDataService';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();

    if (!cleanIdentifier) {
      setErrorMessage('Silakan masukkan NIP atau Alamat Email resmi.');
      return;
    }

    if (!cleanPassword) {
      setErrorMessage('Silakan masukkan kata sandi akun Anda.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginAction({
        identifier: cleanIdentifier,
        password: cleanPassword,
        rememberMe
      });

      if (!response.success) {
        setErrorMessage(response.message || 'Gagal masuk. Periksa kembali NIP/Email dan kata sandi Anda.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Autentikasi berhasil. Mengarahkan ke Dashboard...');

      if (response.user) {
        // Sinkronisasi status sesi client-side
        sintesaService.setActiveUser(response.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('sintesa_auth_user', JSON.stringify(response.user));
        }
      }

      // Berpindah ke Dashboard
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 400);
    } catch {
      setErrorMessage('Terjadi kendala saat menghubungi server autentikasi. Silakan periksa koneksi internet Anda.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-100/70 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-100/70 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-50/40 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl">
          {/* Logo & Identity */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="mb-4 p-3.5 rounded-2xl bg-white shadow-sm border border-slate-200">
              <Image
                src="/logo.png"
                alt="Logo SMK Negeri 2 Magelang"
                width={56}
                height={56}
                className="object-contain"
                priority
                unoptimized
              />
            </div>

            <div className="flex items-center gap-1.5 justify-center">
              <span className="text-2xl font-black tracking-tight text-slate-900">SINTESA</span>
              <span className="text-2xl font-black tracking-tight text-[#0077B6]">TPMPS</span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mt-1">
              SISTEM PENJAMINAN MUTU PENDIDIKAN SEKOLAH
            </p>
            <p className="text-xs font-semibold text-slate-600 mt-1">
              SMK Negeri 2 Magelang &bull; Swadaya Bhina Raharja
            </p>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span className="font-medium leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Identifier (NIP / Email) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                NIP atau Email Resmi Sekolah <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Masukkan 18 digit NIP atau email dinas..."
                  className="w-full min-h-[46px] pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] focus:ring-2 focus:ring-[#0077B6]/15 text-xs sm:text-sm text-slate-900 placeholder-slate-400 transition-all outline-hidden font-medium"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Kata Sandi <span className="text-rose-500">*</span>
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi akun..."
                  className="w-full min-h-[46px] pl-10 pr-11 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] focus:ring-2 focus:ring-[#0077B6]/15 text-xs sm:text-sm text-slate-900 placeholder-slate-400 transition-all outline-hidden font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0077B6] border-slate-300 focus:ring-[#0077B6] focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-xs text-slate-600 font-medium">Ingat sesi perangkat ini</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[46px] mt-3 rounded-xl bg-gradient-to-r from-[#0077B6] via-[#0284C7] to-[#0077B6] hover:brightness-105 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi Otoritas Akun...</span>
                </div>
              ) : (
                <>
                  <span>Masuk ke Sistem Mutu</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* School Support Notice */}
          <div className="mt-8 pt-5 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Mengalami kendala masuk atau belum memiliki akun? Hubungi{' '}
              <strong className="text-slate-700">Administrator TPMPS</strong> di Ruang Tata Usaha atau kirim email ke{' '}
              <a href="mailto:info@smkn2magelang.sch.id" className="text-[#0077B6] hover:underline font-semibold">
                info@smkn2magelang.sch.id
              </a>.
            </p>
          </div>
        </div>

        {/* Security Badge Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Autentikasi Terenkripsi &bull; Supabase Auth &amp; PostgreSQL RLS</span>
        </div>
      </div>
    </div>
  );
}
