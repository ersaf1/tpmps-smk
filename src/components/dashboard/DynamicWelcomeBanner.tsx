'use client';

import React from 'react';
import Link from 'next/link';
import { UserProfile, ROLE_DEFINITIONS } from '@/types/sigma';
import { ArrowUpRight, ShieldCheck, Clock, FileCheck2, AlertCircle } from 'lucide-react';

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

  // Contextual action alert based on user role
  const getActionAlert = () => {
    if (user.role === 'tpmps') {
      return {
        text: `Ada ${pendingDocsCount} dokumen bukti fisik yang menunggu verifikasi & validasi Anda hari ini.`,
        ctaText: 'Verifikasi Dokumen',
        ctaHref: '/dokumen/validasi',
        badge: 'Tindakan Mendesak'
      };
    }
    if (user.role === 'kepala_sekolah') {
      return {
        text: `Capaian 8 SNP SMK saat ini berada pada rata-rata 87.2%. Terdapat ${activeRtlCount} program RTL yang sedang berjalan.`,
        ctaText: 'Lihat Rapor Mutu',
        ctaHref: '/laporan',
        badge: 'Monitoring Eksekutif'
      };
    }
    if (user.role === 'guru') {
      return {
        text: `Instrumen evaluasi mandiri unit ${user.unitName || 'Kerja'} siap diinput untuk Semester Ganjil 2025/2026.`,
        ctaText: 'Input Evaluasi Mutu',
        ctaHref: '/evaluasi/create',
        badge: 'Instrumen Unit'
      };
    }
    // Admin
    return {
      text: `Sistem beroperasi normal dengan ${activeEvalsCount} evaluasi aktif di 18 unit kerja SMK Negeri 2 Magelang.`,
      ctaText: 'Audit Log Sistem',
      ctaHref: '/laporan',
      badge: 'Status Server Optimal'
    };
  };

  const alert = getActionAlert();

  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel-glow p-6 sm:p-8 border border-[#22D3EE]/25 shadow-[0_0_40px_rgba(0,119,182,0.15)] mb-8">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#22D3EE]/15 via-[#0077B6]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#F28C28]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Dynamic Greeting & Real User Role Context */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2.5 mb-2">
            <span className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold border uppercase tracking-wider ${roleConfig.badgeBg} ${roleConfig.badgeBorder} ${roleConfig.badgeText} flex items-center gap-1.5`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              {roleConfig.name}
            </span>
            <span className="text-[10px] text-[#94A3B8] font-mono">
              NIP: {user.nip}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] tracking-tight">
            Selamat datang kembali, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F8FAFC] via-[#22D3EE] to-[#0077B6]">{firstName}</span>.
          </h2>

          <p className="text-sm sm:text-base text-[#94A3B8] mt-2 font-normal leading-relaxed">
            {alert.text}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#94A3B8]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#22D3EE]" />
              <span>Tahun Ajaran 2025/2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Siklus Penjaminan Mutu (PPEPP)</span>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Contextual Action CTA */}
        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href={alert.ctaHref}
            className="btn-enterprise px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0077B6] via-[#0096c7] to-[#22D3EE] hover:brightness-110 text-white text-sm font-bold shadow-[0_0_25px_rgba(34,211,238,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <span>{alert.ctaText}</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <Link
            href="/dokumen"
            className="btn-enterprise px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#F8FAFC] text-sm font-semibold flex items-center justify-center transition-all cursor-pointer"
          >
            Bank Bukti Mutu
          </Link>
        </div>
      </div>
    </div>
  );
}
