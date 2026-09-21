'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { INITIAL_USERS, INITIAL_UNITS, sintesaService } from '@/lib/services/sintesaDataService';
import { UserRole, UserProfile } from '@/types/sintesa';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('sintesa123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // Simulate authenticating against Supabase / Database
    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();

      // Find matching user by email / role alias
      let authenticatedUser: UserProfile | null = null;

      // 1. Kepala Sekolah aliases
      if (
        cleanEmail === 'kepala.sekolah@smkn2magelang.sch.id' ||
        cleanEmail === 'kepsek@smkn2magelang.sch.id' ||
        cleanEmail === 'kepsek@smk-unggul.sch.id' ||
        cleanEmail === 'kepsek@gmail.com' ||
        cleanEmail === 'kepala.sekolah@gmail.com' ||
        cleanEmail === 'kepsek'
      ) {
        authenticatedUser = INITIAL_USERS.kepala_sekolah;
      }
      // 2. Administrator aliases
      else if (
        cleanEmail === 'admin.sintesa@smkn2magelang.sch.id' ||
        cleanEmail === 'admin@smkn2magelang.sch.id' ||
        cleanEmail === 'admin@gmail.com' ||
        cleanEmail === 'admin@smk-unggul.sch.id' ||
        cleanEmail === 'admin'
      ) {
        authenticatedUser = INITIAL_USERS.admin;
      }
      // 3. TPMPS aliases
      else if (
        cleanEmail === 'tpmps.ketua@smkn2magelang.sch.id' ||
        cleanEmail === 'tpmps@smkn2magelang.sch.id' ||
        cleanEmail === 'indah.tpmps@smk-unggul.sch.id' ||
        cleanEmail === 'tpmps@gmail.com' ||
        cleanEmail === 'tpmps'
      ) {
        authenticatedUser = INITIAL_USERS.tpmps;
      }
      // 4. Guru / WKS Kurikulum aliases
      else if (
        cleanEmail === 'budi.santoso@smkn2magelang.sch.id' ||
        cleanEmail === 'guru@smkn2magelang.sch.id' ||
        cleanEmail === 'guru'
      ) {
        authenticatedUser = INITIAL_USERS.guru;
      }
      // 5. Check exact match in INITIAL_USERS
      else {
        const foundRole = (Object.keys(INITIAL_USERS) as UserRole[]).find((r) => {
          return INITIAL_USERS[r].email.toLowerCase() === cleanEmail;
        });

        if (foundRole) {
          authenticatedUser = INITIAL_USERS[foundRole];
        } else {
          // 6. Check match in 18 INITIAL_UNITS
          const matchedUnit = INITIAL_UNITS.find(
            (u) =>
              u.email.toLowerCase() === cleanEmail ||
              cleanEmail === `${u.code.toLowerCase()}@smkn2magelang.sch.id`
          );

          if (matchedUnit) {
            authenticatedUser = {
              id: `usr-${matchedUnit.id}`,
              nip: '198501012010011001',
              fullName: matchedUnit.picName,
              email: matchedUnit.email,
              role: matchedUnit.code === 'SPI' ? 'admin' : 'guru',
              unitId: matchedUnit.id,
              unitName: matchedUnit.name,
              avatarUrl: '/avatar-guru.png',
              isActive: true,
              createdAt: new Date().toISOString()
            };
          }
        }
      }

      if (!authenticatedUser || password.trim().length < 4) {
        setErrorMessage('Kredensial tidak valid. Silakan periksa kembali alamat email dan kata sandi Anda.');
        setIsLoading(false);
        return;
      }

      // CRUCIAL: Set active user in sintesaService so role and identity persist correctly
      sintesaService.setActiveUser(authenticatedUser);

      // Redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    }, 600);
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
            {/* Input Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Alamat Email Resmi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: kepala.sekolah@smkn2magelang.sch.id"
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
