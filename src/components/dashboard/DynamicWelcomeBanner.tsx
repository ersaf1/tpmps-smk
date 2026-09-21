'use client';

import React from 'react';
import Link from 'next/link';
import { UserProfile, ROLE_DEFINITIONS } from '@/types/sintesa';
import { ArrowUpRight, ShieldCheck, Clock, FileCheck2 } from 'lucide-react';

interface DynamicWelcomeBannerProps {
  user: UserProfile;
  pendingDocsCount: number;
  activeEvalsCount: number;
  activeRtlCount: number;
}

export default function DynamicWelcomeBanner({
  user,
  pendingDocsCount,
  activeEvalsCount,
  activeRtlCount
}: DynamicWelcomeBannerProps) {
  const roleConfig = ROLE_DEFINITIONS[user.role];
  const firstName = user.fullName.split(' ')[0] || user.fullName;

  const getActionAlert = () => {
    if (user.role === 'tpmps') {
      return {
        text: `Ada ${pendingDocsCount} dokumen bukti fisik yang menunggu verifikasi Anda hari ini.`,
        ctaText: 'Verifikasi Dokumen',
        ctaHref: '/dokumen/validasi'
      };
    }
    if (user.role === 'kepala_sekolah') {
      return {
        text: `Capaian 8 SNP sekolah saat ini rata-rata 87.2%. Terdapat ${activeRtlCount} program RTL yang sedang berjalan.`,
        ctaText: 'Lihat Rapor Mutu',
        ctaHref: '/laporan'
      };
    }
    if (user.role === 'guru') {
      return {
        text: `Instrumen evaluasi mandiri unit ${user.unitName || 'Kerja'} siap diinput untuk Semester Ganjil 2025/2026.`,
        ctaText: 'Input Evaluasi',
        ctaHref: '/evaluasi/create'
      };
    }
    // Admin
    return {
      text: `Sistem berjalan dengan ${activeEvalsCount} evaluasi terdata pada 18 unit kerja SMK Negeri 2 Magelang.`,
      ctaText: 'Audit Log Sistem',
      ctaHref: '/laporan'
    };
  };

  const alert = getActionAlert();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
      {/* Soft Blue Ambient Gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/60 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Greeting */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-[#0077B6] border border-blue-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {roleConfig.name}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              NIP: {user.nip}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Selamat datang kembali, <span className="text-[#0077B6]">{firstName}</span>.
          </h2>

          <p className="text-sm sm:text-base text-slate-600 mt-2 font-normal leading-relaxed">
            {alert.text}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#0077B6]" />
              <span>Semester Ganjil 2025/2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>Siklus Penjaminan Mutu PPEPP</span>
            </div>
          </div>
        </div>

        {/* Right Side: Action CTA */}
        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href={alert.ctaHref}
            className="btn-enterprise px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] hover:brightness-110 text-white text-sm font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <span>{alert.ctaText}</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <Link
            href="/dokumen"
            className="btn-enterprise px-4 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold flex items-center justify-center transition-all cursor-pointer"
          >
            Bank Dokumen
          </Link>
        </div>
      </div>
    </div>
  );
}
