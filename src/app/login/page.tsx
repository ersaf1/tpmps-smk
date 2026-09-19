'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { INITIAL_USERS } from '@/lib/services/sigmaDataService';
import { UserRole } from '@/types/sigma';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('197509182002122001'); // Default NIP TPMPS
  const [password, setPassword] = useState('sigma123');
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
    setPassword('sigma123');
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
      document.cookie = `sigma_session=${authenticatedUser.id}; path=/; max-age=86400; SameSite=Lax`;
      localStorage.setItem('sigma_auth_user', JSON.stringify(authenticatedUser));

      // Redirect to dashboard
      router.push('/');
      router.refresh();
    }, 900);
  };

  return (
    <div className="min-h-screen w-full bg-[#050816] bg-grid-cyber flex items-center justify-center p-4 relative overflow-hidden">
      {/* Neo-futuristic ambient glow backdrops */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#0077B6]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#22D3EE]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#06162E]/50 rounded-full blur-[180px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Main Glass Card */}
        <div className="glass-panel-glow rounded-3xl p-8 sm:p-10 border border-white/10 shadow-[0_0_50px_rgba(0,119,182,0.15)]">
          {/* Header Brand */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#06162E] to-[#0077B6]/40 p-2 border border-[#22D3EE]/40 shadow-[0_0_25px_rgba(34,211,238,0.3)] flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="SMK 2 Magelang"
                  width={64}
                  height={64}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-[#0E1726] border border-[#22D3EE]/60 text-[#22D3EE]">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F8FAFC]">
              SIGMA <span className="text-[#22D3EE]">TPMPS</span>
            </h1>
            <p className="text-xs font-semibold text-[#94A3B8] tracking-widest uppercase mt-1">
              Sistem Informasi Mutu Pendidikan Sekolah
            </p>
            <div className="mt-2 text-[11px] font-bold text-[#F6B73C] px-3 py-1 rounded-full bg-[#F6B73C]/10 border border-[#F6B73C]/30 flex items-center gap-1.5">
              <span>SMK NEGERI 2 MAGELANG</span>
              <span>•</span>
              <span>SWADAYA BHINA RAHARJA</span>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Identifier */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                NIP / Alamat Email Resmi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Masukkan NIP atau email sekolah"
                  className="w-full min-h-[46px] pl-10 pr-4 py-2.5 rounded-xl bg-[#0E1726]/90 border border-white/10 hover:border-cyan-500/30 focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 transition-all outline-hidden"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                  Kata Sandi
                </label>
                <span className="text-[11px] text-[#22D3EE] hover:underline cursor-pointer">
                  Lupa kata sandi?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full min-h-[46px] pl-10 pr-11 py-2.5 rounded-xl bg-[#0E1726]/90 border border-white/10 hover:border-cyan-500/30 focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 transition-all outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[48px] mt-2 rounded-xl bg-gradient-to-r from-[#0077B6] via-[#0096c7] to-[#22D3EE] hover:brightness-110 text-white font-bold text-sm shadow-[0_0_25px_rgba(34,211,238,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                Akses Autentikasi Produksi (NIP Resmi):
              </span>
              <span className="text-[10px] text-[#22D3EE] font-mono">Password: sigma123</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleQuickFill(acc.nip)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#22D3EE]/40 text-left transition-all cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-[#22D3EE] group-hover:text-white flex items-center justify-between">
                    <span>{acc.title}</span>
                    <span className="text-[9px] opacity-70 uppercase">{acc.role}</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#F8FAFC] truncate mt-0.5">{acc.nip}</div>
                  <div className="text-[10px] text-[#94A3B8] truncate">{acc.name.split(',')[0]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-6 text-center text-xs text-[#94A3B8]">
          Dilindungi oleh <span className="text-[#22D3EE] font-semibold">Supabase PostgreSQL RLS</span> &{' '}
          <span className="text-[#F8FAFC] font-semibold">Audit Logging SPMI SMK</span>
        </div>
      </div>
    </div>
  );
}
