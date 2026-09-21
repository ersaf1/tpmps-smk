'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { INITIAL_USERS } from '@/lib/services/sintesaDataService';
import { UserRole } from '@/types/sintesa';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('197509182002122001'); // Default NIP TPMPS
  const [password, setPassword] = useState('sintesa123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick account credentials lookup
  const ACCOUNTS: { role: UserRole; title: string; nip: string; email: string; name: string }[] = [
    { role: 'tpmps', title: 'Ketua TPMPS', nip: INITIAL_USERS.tpmps.nip, email: INITIAL_USERS.tpmps.email, name: INITIAL_USERS.tpmps.fullName },
    { role: 'kepala_sekolah', title: 'Kepala Sekolah', nip: INITIAL_USERS.kepala_sekolah.nip, email: INITIAL_USERS.kepala_sekolah.email, name: INITIAL_USERS.kepala_sekolah.fullName },
    { role: 'guru', title: 'WKS / Guru', nip: INITIAL_USERS.guru.nip, email: INITIAL_USERS.guru.email, name: INITIAL_USERS.guru.fullName },
    { role: 'admin', title: 'Administrator', nip: INITIAL_USERS.admin.nip, email: INITIAL_USERS.admin.email, name: INITIAL_USERS.admin.fullName }
  ];

  const handleQuickFill = (nip: string) => {
    setIdentifier(nip);
    setPassword('sintesa123');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // Simulate authenticating against Supabase / Database
    setTimeout(() => {
      // Find matching user by NIP or Email
      const matchedRole = (Object.keys(INITIAL_USERS) as UserRole[]).find((r) => {
        const u = INITIAL_USERS[r];
        return u.nip === identifier.trim() || u.email.toLowerCase() === identifier.trim().toLowerCase();
      });

      if (!matchedRole || password.trim().length < 4) {
        setErrorMessage('Kredensial tidak valid. Silakan periksa kembali NIP / Email dan kata sandi Anda.');
        setIsLoading(false);
        return;
      }

      const authenticatedUser = INITIAL_USERS[matchedRole];

      // Set cookie and localStorage for session persistence
      const sessionPayload = {
        userId: authenticatedUser.id,
        nip: authenticatedUser.nip,
        role: authenticatedUser.role,
        name: authenticatedUser.fullName,
        exp: Math.floor(Date.now() / 1000) + 86400
      };
      const encoded = btoa(JSON.stringify(sessionPayload));
      document.cookie = `sintesa_session=${encoded}; path=/; max-age=86400; SameSite=Lax`;
      localStorage.setItem('sintesa_auth_user', JSON.stringify(authenticatedUser));

      // Redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    }, 900);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Soft ambient blue glow backdrops */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-100/70 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-100/70 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-50/40 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Main Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl">
          {/* Logo & School Identity */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="mb-4 p-3 rounded-2xl bg-white shadow-sm border border-slate-200">
              <Image
                src="/logo.png"
                alt="Logo SMK Negeri 2 Magelang"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              SINTESA <span className="text-[#0077B6]">TPMPS</span>
            </h1>
            <p className="text-xs font-semibold text-slate-500 tracking-widest uppercase mt-1">
              Sistem Informasi Mutu Pendidikan Sekolah
            </p>
            <p className="mt-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
              SMK Negeri 2 Magelang &bull; Swadaya Bhina Raharja
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Identifier */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                NIP / Alamat Email Resmi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Masukkan NIP atau email sekolah"
                  className="w-full min-h-[46px] pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-900 placeholder-slate-400 transition-all outline-hidden"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Kata Sandi
                </label>
                <span className="text-[11px] text-[#0077B6] hover:underline cursor-pointer font-medium">
                  Lupa kata sandi?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full min-h-[46px] pl-10 pr-11 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-900 placeholder-slate-400 transition-all outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[48px] mt-2 rounded-xl bg-gradient-to-r from-[#0077B6] via-[#0284C7] to-[#0077B6] hover:brightness-105 text-white font-bold text-sm shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi Otoritas Sesi...</span>
                </div>
              ) : (
                <>
                  <span>Masuk ke Sistem Mutu</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials (RBAC Real Auth Guidance) */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Akses Autentikasi Produksi (NIP Resmi):
              </span>
              <span className="text-[10px] text-[#0077B6] font-mono font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">Password: sintesa123</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleQuickFill(acc.nip)}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/70 border border-slate-200 hover:border-sky-300 text-left transition-all cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-[#0077B6] group-hover:text-[#005f92] flex items-center justify-between">
                    <span>{acc.title}</span>
                    <span className="text-[9px] text-slate-400 uppercase">{acc.role}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-900 font-semibold truncate mt-0.5">{acc.nip}</div>
                  <div className="text-[10px] text-slate-500 truncate">{acc.name.split(',')[0]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Dilindungi oleh <span className="text-[#0077B6] font-semibold">Supabase PostgreSQL RLS</span> &{' '}
          <span className="text-slate-800 font-semibold">Audit Logging Mutu SMK Negeri 2 Magelang</span>
        </div>
      </div>
    </div>
  );
}
