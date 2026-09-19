'use client';

import React, { useState } from 'react';
import {
  UnitKerja,
  StandardSNP,
  EvaluasiMutu,
  ProgramMutuRTL,
  AuditLogItem,
  UserRole
} from '@/types/tpmps';
import {
  TrendingUp,
  Award,
  Building2,
  FileCheck2,
  Target,
  AlertCircle,
  ArrowUpRight,
  Filter,
  Download,
  ChevronRight,
  ShieldCheck,
  Zap,
  CheckCircle,
  Clock,
  Printer
} from 'lucide-react';

interface DashboardTabProps {
  userRole: UserRole;
  unitKerjaList: UnitKerja[];
  standarSnpList: StandardSNP[];
  evaluasiList: EvaluasiMutu[];
  programRtlList: ProgramMutuRTL[];
  auditLogs: AuditLogItem[];
  onNavigateTab: (tab: any) => void;
}

export default function DashboardTab({
  userRole,
  unitKerjaList,
  standarSnpList,
  evaluasiList,
  programRtlList,
  auditLogs,
  onNavigateTab
}: DashboardTabProps) {
  const [selectedUnitCategory, setSelectedUnitCategory] = useState<string>('Semua');
  const [filterUnitId, setFilterUnitId] = useState<string>('all');

  // Overall Score Calculation
  const totalScoreWeight = standarSnpList.reduce(
    (acc, std) => acc + (std.currentScore * std.weight) / 100,
    0
  );
  const averageScore = Number(totalScoreWeight.toFixed(1));

  // Filtered unit list
  const filteredUnits = unitKerjaList.filter((unit) => {
    if (selectedUnitCategory !== 'Semua' && unit.category !== selectedUnitCategory) return false;
    if (filterUnitId !== 'all' && unit.id !== filterUnitId) return false;
    return true;
  });

  // Count pending reviews
  const pendingReviews = evaluasiList.filter(
    (e) => e.status === 'Diajukan' || e.status === 'Direview'
  ).length;
  const needRevision = evaluasiList.filter((e) => e.status === 'Perlu Revisi').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Notice if Action is Needed */}
      {(pendingReviews > 0 || needRevision > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start justify-between gap-3 text-amber-900 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold">
                Tindakan Penjaminan Mutu Diperlukan ({pendingReviews + needRevision} Agenda)
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Terdapat <strong>{pendingReviews} evaluasi</strong> menunggu verifikasi TPMPS dan{' '}
                <strong>{needRevision} dokumen/evaluasi</strong> memerlukan revisi perbaikan oleh unit kerja.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('evaluasi')}
            className="shrink-0 text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold px-3 py-1.5 rounded-lg transition"
          >
            Buka Evaluasi
          </button>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Indeks Mutu Keseluruhan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Indeks Mutu Sekolah
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{averageScore}%</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +2.4%
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 font-medium text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Kategori A (Unggul)
            </span>
            <span>Target: 88.0%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${averageScore}%` }}
            />
          </div>
        </div>

        {/* Card 2: 18 Unit Kerja Terintegrasi */}
        <div
          onClick={() => onNavigateTab('lemari')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer hover:border-indigo-400 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
              Lemari Arsip 18 Unit
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">18 / 18</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Laci Aktif
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Isolasi Privasi Aktif</span>
            <span className="font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Buka Lemari →
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Card 3: Dokumen Bukti Fisik */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Bukti Terverifikasi
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">28 / 31</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              90.3%
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>2 Menunggu Review</span>
            <span className="text-rose-600 font-medium">1 Revisi</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '90.3%' }} />
          </div>
        </div>

        {/* Card 4: Program Mutu RTL */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tindak Lanjut (RTL)
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {programRtlList.length} Program
            </span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              Siklus I
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>3 Sedang Berjalan</span>
            <span className="text-emerald-600 font-medium">1 Tuntas</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '65%' }} />
          </div>
        </div>
      </div>

      {/* 8 Standar Nasional Pendidikan (SNP) Section */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Capaian 8 Standar Nasional Pendidikan (SNP) SMK</span>
              <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Bobot Total 100%
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluasi komparatif antara target mutu sekolah dengan realisasi data verifikasi TPMPS
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('indikator')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              Lihat Rincian Indikator <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 8 SNP Progress Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {standarSnpList.map((snp) => {
            const isTargetMet = snp.currentScore >= snp.targetScore;
            return (
              <div
                key={snp.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {snp.code}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      Bobot: {snp.weight}%
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                    {snp.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                    {snp.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-600">Skor Mutu</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-extrabold text-slate-900">
                        {snp.currentScore}%
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                          isTargetMet
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {isTargetMet ? 'Tercapai' : 'Proses'}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden relative">
                    {/* Target marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
                      style={{ left: `${snp.targetScore}%` }}
                      title={`Target: ${snp.targetScore}%`}
                    />
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isTargetMet ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${snp.currentScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Realisasi: {snp.currentScore}%</span>
                    <span>Target: {snp.targetScore}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Unit Kerja Progress & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Unit Kerja Progress Table */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Kinerja Mutu per Unit Kerja ({unitKerjaList.length} Unit)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring penyelesaian evaluasi mandiri dan capaian per unit
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              {['Semua', 'Manajemen', 'Kejuruan', 'Layanan', 'Pengawasan'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedUnitCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                    selectedUnitCategory === cat
                      ? 'bg-white text-blue-600 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Unit Kerja</th>
                  <th className="py-2.5 px-3">Penanggung Jawab (PIC)</th>
                  <th className="py-2.5 px-3 text-center">Kelengkapan</th>
                  <th className="py-2.5 px-3 text-center">Skor Mutu</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUnits.slice(0, 8).map((unit) => (
                  <tr key={unit.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{unit.name}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{unit.code}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <div>{unit.pic}</div>
                      <div className="text-[10px] text-slate-400">{unit.email}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-semibold text-slate-700">
                        {unit.completedIndicators}/{unit.totalIndicators}
                      </span>
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 mx-auto mt-1 overflow-hidden">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{
                            width: `${(unit.completedIndicators / unit.totalIndicators) * 100}%`
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">
                      {unit.score}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          unit.status === 'Unggul'
                            ? 'bg-emerald-100 text-emerald-800'
                            : unit.status === 'Baik'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {unit.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Menampilkan 8 dari {filteredUnits.length} unit terpilih</span>
            <button
              onClick={() => onNavigateTab('user_management')}
              className="text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Lihat Seluruh 18 Unit Kerja <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Audit & RTL Quick Widget */}
        <div className="space-y-6">
          {/* Quick RTL Monitor Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                RTL Prioritas
              </h4>
              <button
                onClick={() => onNavigateTab('program_rtl')}
                className="text-[11px] text-blue-600 font-semibold hover:underline"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {programRtlList.slice(0, 3).map((rtl) => (
                <div
                  key={rtl.id}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200/70 transition"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                    <span className="text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                      {rtl.unitName.split(' ')[0]} {rtl.unitName.split(' ')[1]}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded ${
                        rtl.status === 'Selesai'
                          ? 'bg-emerald-100 text-emerald-700'
                          : rtl.status === 'Terlambat'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {rtl.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 leading-snug line-clamp-1">
                    {rtl.title}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Progress: {rtl.progress}%</span>
                    <span className="font-medium text-slate-700">Due: {rtl.deadline}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${rtl.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                Aktivitas Audit Terbaru
              </h4>
              <button
                onClick={() => onNavigateTab('audit_log')}
                className="text-[11px] text-blue-600 font-semibold hover:underline"
              >
                Log Lengkap
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-medium leading-snug">{log.details}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="font-semibold text-slate-600">{log.userName}</span>
                      <span>•</span>
                      <span>{log.timestamp.split(' ')[1]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
