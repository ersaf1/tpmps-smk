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
      subtext: '8 Standar Pendidikan Vokasi',
      delta: '100% Terpetakan',
      deltaColor: 'text-[#0077B6]',
      icon: Award,
      href: '/mutu/1',
      accent: 'bg-blue-50 text-[#0077B6] border-blue-200'
    },
    {
      title: 'Dokumen Terverifikasi',
      value: validDocsCount.toString(),
      subtext: 'Berkas bukti fisik sahih',
      delta: 'Terarsip Digital',
      deltaColor: 'text-emerald-600',
      icon: FolderCheck,
      href: '/dokumen',
      accent: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      title: 'Evaluasi Mutu',
      value: activeEvalsCount.toString(),
      subtext: 'Instrumen penilaian unit',
      delta: 'Semester Ganjil',
      deltaColor: 'text-[#0284C7]',
      icon: FileText,
      href: '/evaluasi',
      accent: 'bg-sky-50 text-[#0284C7] border-sky-200'
    },
    {
      title: 'RTL Aktif',
      value: activeRtlCount.toString(),
      subtext: 'Program tindak lanjut berjalan',
      delta: 'Prioritas Tinggi & Sedang',
      deltaColor: 'text-[#F28C28]',
      icon: Target,
      href: '/rtl',
      accent: 'bg-orange-50 text-[#F28C28] border-orange-200'
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
            className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {m.title}
              </span>
              <div className={`p-2.5 rounded-2xl border ${m.accent} transition-transform group-hover:scale-105`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {m.value}
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">{m.subtext}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className={`font-semibold ${m.deltaColor}`}>{m.delta}</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#0077B6] transition-colors" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
