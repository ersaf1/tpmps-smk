'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AppShell from '@/components/layout/AppShell';
import { useToast } from '@/components/ui/ToastFeedback';
import { sintesaService } from '@/lib/services/sintesaDataService';
import { StandardSNP, UnitKerja } from '@/types/sintesa';
import {
  Printer,
  Download,
  FileSpreadsheet,
  Award,
  CheckCircle2,
  TrendingUp,
  Building2,
  Calendar,
  ShieldCheck
} from 'lucide-react';

export default function LaporanPage() {
  const { showToast } = useToast();
  const [standards] = useState<StandardSNP[]>(() => sintesaService.getStandards());
  const [units] = useState<UnitKerja[]>(() => sintesaService.getUnits());

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    showToast('Mengunduh rekapitulasi data capaian 8 SNP format CSV...', 'success');
  };

  // Aggregated calculations
  const totalWeight = standards.reduce((acc, s) => acc + s.weight, 0);
  const weightedScore = standards.reduce((acc, s) => acc + (s.currentScore * s.weight) / 100, 0);

  const getPredikat = (score: number) => {
    if (score >= 90) return { label: 'A (Unggul)', color: 'text-[#0077B6]' };
    if (score >= 80) return { label: 'B (Baik)', color: 'text-emerald-600' };
    if (score >= 70) return { label: 'C (Cukup)', color: 'text-amber-600' };
    return { label: 'Perlu Perhatian', color: 'text-orange-600' };
  };

  const finalPredikat = getPredikat(weightedScore);

  return (
    <AppShell
      title="Laporan & Rapor Mutu Pendidikan"
      subtitle="Dokumen Evaluasi Diri Sekolah (EDS) Resmi SMK Negeri 2 Magelang"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Actions Bar (Hidden when printing) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Rapor Capaian Penjaminan Mutu (SPMI)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Dokumen resmi akuntabilitas mutu tahun ajaran 2025/2026
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#0077B6] flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Download className="w-4 h-4 text-[#0077B6]" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] hover:brightness-105 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Dokumen Resmi</span>
            </button>
          </div>
        </div>

        {/* Executive Report Container (Becomes clean white official document when printed) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8 print:p-0 print:border-none print:shadow-none">
          {/* Official Letterhead (Kop Surat Sekolah) */}
          <div className="flex items-center gap-6 pb-6 border-b border-slate-200 print:border-black print:pb-4">
            <div className="w-20 h-20 relative shrink-0">
              <Image
                src="/logo.png"
                alt="Logo SMK"
                width={80}
                height={80}
                className="object-contain"
                priority
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 print:text-black tracking-tight uppercase">
                Pemerintah Provinsi Jawa Tengah
              </h3>
              <h2 className="text-xl sm:text-2xl font-black text-[#0077B6] print:text-black tracking-tight">
                SMK NEGERI 2 MAGELANG
              </h2>
              <p className="text-xs text-slate-600 print:text-gray-700 mt-1">
                Jl. Perintis Kemerdekaan No. 9, Kota Magelang • Telp: (0293) 362577 • Website: smkn2magelang.sch.id
              </p>
              <div className="text-[11px] font-bold text-amber-600 print:text-gray-900 mt-0.5 tracking-wider">
                MOTTO: SWADAYA BHINA RAHARJA
              </div>
            </div>
          </div>

          {/* Report Title */}
          <div className="text-center py-2">
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900 print:text-black">
              Laporan Evaluasi Diri Sekolah (EDS) & Capaian 8 SNP
            </h3>
            <p className="text-xs text-slate-500 print:text-gray-600 mt-0.5">
              Tahun Ajaran 2025/2026 • Siklus Penjaminan Mutu Internal (SPMI)
            </p>
          </div>

          {/* Aggregated Score Highlight Card */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 print:border-black print:bg-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase font-bold text-slate-500 print:text-gray-600 block">
                Indeks Mutu Kumulatif (Agregat 8 SNP)
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl sm:text-5xl font-black font-mono text-[#0077B6] print:text-black">
                  {weightedScore.toFixed(2)}
                </span>
                <span className="text-lg sm:text-xl font-bold font-mono text-slate-400 print:text-gray-700">
                  / 100.00
                </span>
              </div>
              <p className="text-xs text-slate-500 print:text-gray-700 mt-1">
                Akumulasi seluruh indikator mutu tertimbang SMK Negeri 2 Magelang
              </p>
            </div>

            <div className="text-right p-4 rounded-xl bg-sky-50 border border-sky-100 print:border-black print:bg-white shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-500 print:text-gray-600 block">
                Predikat Mutu Sekolah
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#0077B6] print:text-black mt-0.5">
                {finalPredikat.label}
              </div>
              <span className="text-xs text-emerald-700 print:text-black font-semibold">
                Status: Memenuhi Standar Industri
              </span>
            </div>
          </div>

          {/* 8 SNP Standard Breakdown Table */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 print:text-black mb-3">
              Rincian Capaian 8 Standar Nasional Pendidikan
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 print:border-black">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 print:bg-gray-200 text-slate-600 print:text-black border-b border-slate-200 print:border-black text-[11px] uppercase font-bold">
                    <th className="py-3 px-4">Kode</th>
                    <th className="py-3 px-4">Standar Nasional Pendidikan</th>
                    <th className="py-3 px-4 text-center">Bobot</th>
                    <th className="py-3 px-4 text-center">Target</th>
                    <th className="py-3 px-4 text-center">Realisasi</th>
                    <th className="py-3 px-4 text-center">Predikat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 print:divide-black">
                  {standards.map((snp) => {
                    const p = getPredikat(snp.currentScore);
                    return (
                      <tr key={snp.id} className="hover:bg-sky-50/40 print:text-black transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#0077B6] print:text-black">
                          {snp.code}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900 print:text-black">
                          {snp.name}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-slate-600 print:text-black">
                          {snp.weight}%
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-amber-600 print:text-black font-bold">
                          {snp.targetScore}%
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-slate-900 print:text-black font-bold">
                          {snp.currentScore.toFixed(1)}%
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          <span className={`${p.color} print:text-black text-xs`}>
                            {p.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Unit Kerja Summary Grid */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 print:text-black mb-3">
              Kinerja 18 Unit Kerja SMK
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {units.slice(0, 9).map((u) => (
                <div
                  key={u.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 print:border-black print:bg-white flex justify-between items-center"
                >
                  <div className="truncate">
                    <span className="font-bold text-slate-900 print:text-black block truncate">
                      {u.name}
                    </span>
                    <span className="text-[10px] text-slate-500 print:text-gray-600 block truncate">
                      PIC: {u.picName.split(',')[0]}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#0077B6] print:text-black shrink-0 ml-2">
                    {u.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Endorsement Signatures (Tanda Tangan Pengesahan) */}
          <div className="pt-8 mt-8 border-t border-slate-200 print:border-black grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <p className="text-slate-500 print:text-black">Mengetahui,</p>
              <p className="font-bold text-slate-900 print:text-black mt-0.5">
                Ketua Tim Penjamin Mutu (TPMPS)
              </p>
              <div className="h-20" />
              <p className="font-bold text-slate-900 print:text-black underline">
                Dra. Hj. Siti Fatimah, M.M.
              </p>
              <p className="text-[11px] text-slate-500 print:text-gray-700 font-mono">
                NIP. 197509182002122001
              </p>
            </div>

            <div>
              <p className="text-slate-500 print:text-black">Magelang, September 2025</p>
              <p className="font-bold text-slate-900 print:text-black mt-0.5">
                Kepala SMK Negeri 2 Magelang
              </p>
              <div className="h-20" />
              <p className="font-bold text-slate-900 print:text-black underline">
                Drs. H. Mulyono, M.Pd.
              </p>
              <p className="text-[11px] text-slate-500 print:text-gray-700 font-mono">
                NIP. 196803121992031004
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
