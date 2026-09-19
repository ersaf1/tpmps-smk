'use client';

import React from 'react';
import Link from 'next/link';
import { Award, FolderCheck, FileText, Target, ArrowUpRight } from 'lucide-react';

interface MetricCardsGridProps {
  totalStandards: number;
  validDocsCount: number;
  activeEvalsCount: number;
  activeRtlCount: number;
}

export default function MetricCardsGrid({
  totalStandards,
  validDocsCount,
  activeEvalsCount,
  activeRtlCount
}: MetricCardsGridProps) {
  const METRICS = [
    {
      title: 'Total Standar SNP',
      value: totalStandards.toString(),
      subtext: '8 Standar Nasional Pendidikan',
      delta: '100% Terpetakan',
      deltaColor: 'text-[#22D3EE]',
      icon: Award,
      href: '/mutu/1',
      glow: 'hover:border-[#22D3EE]/40',
      accent: 'bg-[#22D3EE]/10 text-[#22D3EE] border-[#22D3EE]/30'
    },
    {
      title: 'Dokumen Valid',
      value: validDocsCount.toString(),
      subtext: 'Berkas bukti terverifikasi TPMPS',
      delta: 'Terarsip Digital',
      deltaColor: 'text-emerald-400',
      icon: FolderCheck,
      href: '/dokumen',
      glow: 'hover:border-emerald-500/40',
      accent: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    },
    {
      title: 'Evaluasi Mutu',
      value: activeEvalsCount.toString(),
      subtext: 'Instrumen evaluasi berjalan',
      delta: 'Semester Ganjil',
      deltaColor: 'text-[#0077B6]',
      icon: FileText,
      href: '/evaluasi',
      glow: 'hover:border-[#0077B6]/40',
      accent: 'bg-[#0077B6]/10 text-[#0077B6] border-[#0077B6]/30'
    },
    {
      title: 'RTL Aktif',
      value: activeRtlCount.toString(),
      subtext: 'Program perbaikan mutu',
      delta: 'Prioritas Tinggi & Sedang',
      deltaColor: 'text-[#F28C28]',
      icon: Target,
      href: '/rtl',
      glow: 'hover:border-[#F28C28]/40',
      accent: 'bg-[#F28C28]/10 text-[#F28C28] border-[#F28C28]/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {METRICS.map((m) => {
        const Icon = m.icon;
        return (
          <Link
            key={m.title}
            href={m.href}
            className={`glass-panel rounded-3xl p-6 border border-white/10 ${m.glow} transition-all duration-200 group flex flex-col justify-between cursor-pointer relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                {m.title}
              </span>
              <div className={`p-2.5 rounded-2xl border ${m.accent} transition-transform group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-black text-[#F8FAFC] tracking-tight">
                {m.value}
              </div>
              <p className="text-xs text-[#94A3B8] mt-1 font-medium">{m.subtext}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className={`font-semibold ${m.deltaColor}`}>{m.delta}</span>
              <ArrowUpRight className="w-4 h-4 text-[#94A3B8] group-hover:text-white transition-colors" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
