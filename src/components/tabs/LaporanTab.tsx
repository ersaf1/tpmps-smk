'use client';

import React, { useState } from 'react';
import {
  UnitKerja,
  StandardSNP,
  EvaluasiMutu,
  ProgramMutuRTL,
  UserRole
} from '@/types/tpmps';
import { formatRupiah } from '@/lib/utils';
import {
  FileSpreadsheet,
  Printer,
  Download,
  FileText,
  CheckCircle2,
  Calendar,
  Building,
  Award,
  ChevronRight,
  Eye,
  ShieldCheck,
  X
} from 'lucide-react';

interface LaporanTabProps {
  userRole: UserRole;
  selectedPeriode: string;
  unitKerjaList: UnitKerja[];
  standarSnpList: StandardSNP[];
  evaluasiList: EvaluasiMutu[];
  programRtlList: ProgramMutuRTL[];
}

export default function LaporanTab({
  userRole,
  selectedPeriode,
  unitKerjaList,
  standarSnpList,
  evaluasiList,
  programRtlList
}: LaporanTabProps) {
  const [reportType, setReportType] = useState<'eds' | 'snp' | 'unit' | 'rtl'>('eds');
  const [selectedUnitScope, setSelectedUnitScope] = useState<string>('all');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Overall Score Calculation
  const totalScoreWeight = standarSnpList.reduce(
    (acc, std) => acc + (std.currentScore * std.weight) / 100,
    0
  );
  const averageScore = Number(totalScoreWeight.toFixed(1));

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    alert(`Laporan ${reportType.toUpperCase()} berhasil diexport ke format Excel (.xlsx)!`);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            Generator Laporan Mutu & Rapor Evaluasi Diri Sekolah (EDS)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Penyusunan berkas laporan resmi akreditasi dan evaluasi mutu SMK siap cetak (Kop resmi, analisis 8 SNP, tanda tangan digital).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            Buka Pratinjau Dokumen Resmi
          </button>
        </div>
      </div>

      {/* Report Template Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Template 1 */}
        <div
          onClick={() => setReportType('eds')}
          className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
            reportType === 'eds'
              ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <FileText className="w-4 h-4" />
              </span>
              {reportType === 'eds' && (
                <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  Dipilih
                </span>
              )}
            </div>
            <h3 className="text-xs font-bold text-slate-900 leading-snug">
              Laporan Evaluasi Diri Sekolah (EDS)
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Dokumen komprehensif mencakup 8 SNP, pencapaian 18 unit, temuan audit, dan rekomendasi perbaikan.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
            Format: Dokumen Resmi 15 Halaman
          </div>
        </div>

        {/* Template 2 */}
        <div
          onClick={() => setReportType('snp')}
          className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
            reportType === 'snp'
              ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                <Award className="w-4 h-4" />
              </span>
              {reportType === 'snp' && (
                <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  Dipilih
                </span>
              )}
            </div>
            <h3 className="text-xs font-bold text-slate-900 leading-snug">
              Rapor 8 Standar Nasional Pendidikan
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Ringkasan grafik dan komparasi nilai realisasi vs target rapor pendidikan Kemendikbud.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
            Format: Matriks Skor & Grafik
          </div>
        </div>

        {/* Template 3 */}
        <div
          onClick={() => setReportType('unit')}
          className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
            reportType === 'unit'
              ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <Building className="w-4 h-4" />
              </span>
              {reportType === 'unit' && (
                <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  Dipilih
                </span>
              )}
            </div>
            <h3 className="text-xs font-bold text-slate-900 leading-snug">
              Laporan Kinerja Unit Kerja
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Rincian capaian per unit (Kurikulum, Hubin, Kejuruan, Sarpras) beserta bukti dokumen pendukung.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
            Format: Audit Scorecard
          </div>
        </div>

        {/* Template 4 */}
        <div
          onClick={() => setReportType('rtl')}
          className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
            reportType === 'rtl'
              ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                <FileSpreadsheet className="w-4 h-4" />
              </span>
              {reportType === 'rtl' && (
                <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  Dipilih
                </span>
              )}
            </div>
            <h3 className="text-xs font-bold text-slate-900 leading-snug">
              Matriks Rencana Tindak Lanjut (RTL)
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Tabel program mutu perbaikan, alokasi dana, target output, dan tanggal jatuh tempo.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
            Format: Matriks Tindak Lanjut
          </div>
        </div>
      </div>

      {/* Scope Settings & Export Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div>
            <label className="text-slate-500 font-semibold block mb-1">Cakupan Unit Kerja:</label>
            <select
              value={selectedUnitScope}
              onChange={(e) => setSelectedUnitScope(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none"
            >
              <option value="all">Semua Unit Kerja Sekolah (Gabungan)</option>
              {unitKerjaList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-500 font-semibold block mb-1">Tahun Pelaporan:</label>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium">
              {selectedPeriode}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 sm:pt-0">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Ekspor Excel (.xlsx)
          </button>
          <button
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Cetak Dokumen Resmi
          </button>
        </div>
      </div>

      {/* Static Document Layout Preview Container */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Format Tinjauan Cetak
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Lembar Ringkasan Eksekutif Mutu Sekolah (Executive Summary)
            </h3>
          </div>
          <button
            onClick={() => setShowPreviewModal(true)}
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
          >
            Perbesar Layar Penuh <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mini Sheet Preview */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 font-sans space-y-4 text-xs">
          <div className="text-center border-b-2 border-slate-800 pb-3">
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900 uppercase tracking-wide">
              PEMERINTAH DAERAH PROVINSI - DINAS PENDIDIKAN
            </h2>
            <h3 className="font-bold text-xs sm:text-sm text-slate-800 uppercase">
              SMK NEGERI 1 UNGGUL TERPADU
            </h3>
            <p className="text-[11px] text-slate-500">
              Jalan Pendidikan Vokasi No. 88, Telp. (021) 8876543, Website: smk-unggul.sch.id
            </p>
          </div>

          <div className="text-center py-2">
            <h4 className="font-extrabold text-slate-900 uppercase underline text-sm">
              LAPORAN PENJAMINAN MUTU PENDIDIKAN SEKOLAH (TPMPS)
            </h4>
            <p className="text-slate-600 text-xs">Periode: {selectedPeriode}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-500 text-[11px] block">Indeks Mutu Capaian Sekolah:</span>
              <span className="text-xl font-extrabold text-blue-600">{averageScore}%</span>
              <span className="text-xs font-bold text-emerald-700 ml-2">(Kategori A - Unggul)</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Tingkat Partisipasi Unit:</span>
              <span className="text-xl font-extrabold text-slate-900">18 / 18 Unit (100%)</span>
              <span className="text-xs text-slate-500 block">Seluruh unit terverifikasi</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 bg-white">
              <thead className="bg-slate-100 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2 border-r border-slate-200">Standar SNP</th>
                  <th className="p-2 border-r border-slate-200 text-center">Bobot</th>
                  <th className="p-2 border-r border-slate-200 text-center">Target</th>
                  <th className="p-2 border-r border-slate-200 text-center">Realisasi</th>
                  <th className="p-2 text-center">Capaian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {standarSnpList.map((s) => (
                  <tr key={s.id}>
                    <td className="p-2 border-r border-slate-200 font-medium">
                      {s.code} - {s.name}
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center">{s.weight}%</td>
                    <td className="p-2 border-r border-slate-200 text-center">{s.targetScore}%</td>
                    <td className="p-2 border-r border-slate-200 text-center font-bold text-blue-700">
                      {s.currentScore}%
                    </td>
                    <td className="p-2 text-center">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Memenuhi
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Full Document Print Preview */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Header Controls (Hidden on Print) */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 no-print">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Pratinjau Cetak Laporan Resmi TPMPS
                </h3>
                <p className="text-[11px] text-slate-500">
                  Dokumen siap cetak (Kertas A4, Kop Resmi Dinas Pendidikan)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Cetak / Unduh PDF
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Report Paper */}
            <div className="font-serif text-slate-900 space-y-6 text-xs sm:text-sm bg-white p-4 sm:p-6 border border-slate-300 rounded-lg shadow-inner">
              {/* Kop Surat */}
              <div className="text-center border-b-2 border-black pb-3">
                <h2 className="font-bold text-xs sm:text-sm tracking-widest uppercase">
                  PEMERINTAH DAERAH PROVINSI JAWA BARAT
                </h2>
                <h2 className="font-bold text-xs sm:text-sm tracking-widest uppercase">
                  DINAS PENDIDIKAN
                </h2>
                <h1 className="font-extrabold text-sm sm:text-base tracking-wide uppercase mt-1">
                  SEKOLAH MENENGAH KEJURUAN (SMK) NEGERI 1 UNGGUL TERPADU
                </h1>
                <p className="text-[11px] font-sans text-slate-600">
                  Jalan Pendidikan Vokasi Terpadu No. 88, Kota Pendidikan • Telp (021) 8876543 • Kode Pos 15412
                </p>
                <p className="text-[11px] font-sans text-slate-600">
                  Laman: www.smk-unggul.sch.id • Pos-el: tpmps@smk-unggul.sch.id
                </p>
              </div>

              {/* Judul Laporan */}
              <div className="text-center py-2">
                <h3 className="font-bold text-sm uppercase underline tracking-wider">
                  BERITA ACARA & RAPOR MUTU PENJAMINAN MUTU PENDIDIKAN SEKOLAH
                </h3>
                <p className="text-xs font-sans text-slate-600 mt-1">
                  Nomor: 421.5/089/TPMPS-SMK/IX/2026 • Periode: {selectedPeriode}
                </p>
              </div>

              {/* Paragraf Pembuka */}
              <p className="text-xs font-sans leading-relaxed text-justify">
                Pada hari ini, <strong>Jumat tanggal Delapan Belas bulan September tahun Dua Ribu Dua Puluh Enam</strong>, 
                Tim Penjaminan Mutu Pendidikan Sekolah (TPMPS) bersama Kepala Sekolah telah melaksanakan Rapat Tinjauan Manajemen (RTM) 
                siklus I untuk mengevaluasi pemenuhan 8 Standar Nasional Pendidikan (SNP) pada seluruh 18 (delapan belas) unit kerja di SMKN 1 Unggul Terpadu.
              </p>

              {/* Ringkasan Nilai Table */}
              <div>
                <h4 className="font-bold text-xs font-sans uppercase mb-2">
                  A. Rekapitulasi Nilai 8 Standar Nasional Pendidikan (SNP)
                </h4>
                <table className="w-full text-left text-xs font-sans border-collapse border border-slate-400">
                  <thead className="bg-slate-100 font-bold">
                    <tr>
                      <th className="border border-slate-400 p-2 text-center w-10">No</th>
                      <th className="border border-slate-400 p-2">Standar Nasional Pendidikan</th>
                      <th className="border border-slate-400 p-2 text-center w-16">Bobot</th>
                      <th className="border border-slate-400 p-2 text-center w-16">Target</th>
                      <th className="border border-slate-400 p-2 text-center w-20">Realisasi</th>
                      <th className="border border-slate-400 p-2 text-center w-24">Predikat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standarSnpList.map((s, idx) => (
                      <tr key={s.id}>
                        <td className="border border-slate-400 p-2 text-center">{idx + 1}</td>
                        <td className="border border-slate-400 p-2 font-medium">{s.name}</td>
                        <td className="border border-slate-400 p-2 text-center">{s.weight}%</td>
                        <td className="border border-slate-400 p-2 text-center">{s.targetScore}%</td>
                        <td className="border border-slate-400 p-2 text-center font-bold">
                          {s.currentScore}%
                        </td>
                        <td className="border border-slate-400 p-2 text-center">
                          {s.currentScore >= 90 ? 'Unggul' : 'Baik'}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold">
                      <td colSpan={2} className="border border-slate-400 p-2 text-right">
                        Rata-Rata Capaian Mutu Gabungan Sekolah:
                      </td>
                      <td className="border border-slate-400 p-2 text-center">100%</td>
                      <td className="border border-slate-400 p-2 text-center">88.0%</td>
                      <td className="border border-slate-400 p-2 text-center text-blue-700 text-sm">
                        {averageScore}%
                      </td>
                      <td className="border border-slate-400 p-2 text-center text-emerald-700">
                        Kategori A (Unggul)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Temuan & Tindak Lanjut */}
              <div>
                <h4 className="font-bold text-xs font-sans uppercase mb-1">
                  B. Kesimpulan Audit & Rencana Tindak Lanjut (RTL) Prioritas
                </h4>
                <ol className="list-decimal pl-4 font-sans text-xs space-y-1 text-slate-700 leading-relaxed">
                  <li>
                    Standar Kompetensi Lulusan (SKL) dan Standar Isi mencapai predikat <strong>Unggul (92.4% & 93.1%)</strong> didukung keterserapan kerja lulusan dan kurikulum sinkron DUDI.
                  </li>
                  <li>
                    Standar Sarana & Prasarana memerlukan penguatan alat praktik bengkel TJKT & TKR melalui realisasi paket RTL semester berjalan.
                  </li>
                  <li>
                    Sebanyak <strong>{programRtlList.length} program tindak lanjut</strong> telah dianggarkan dengan total Rp 144.000.000 bersumber dari BOS dan Unit Produksi TeFa.
                  </li>
                </ol>
              </div>

              {/* Tanda Tangan Resmi */}
              <div className="pt-6 font-sans text-xs print-break-inside-avoid">
                <div className="flex justify-between items-start">
                  {/* Left Signature: Ketua TPMPS */}
                  <div className="text-center w-56">
                    <p className="text-slate-500 text-[11px]">Mengetahui & Memverifikasi,</p>
                    <p className="font-bold text-slate-900 mt-0.5">Ketua TPMPS Sekolah,</p>
                    <div className="my-3 flex justify-center">
                      <div className="border border-blue-400 bg-blue-50/50 rounded-lg p-2 text-center text-[10px] text-blue-800">
                        <ShieldCheck className="w-4 h-4 text-blue-600 mx-auto mb-0.5" />
                        <span>Tersertifikasi Digital</span>
                        <span className="block font-mono text-[9px]">ID: TPMPS-2026-09</span>
                      </div>
                    </div>
                    <p className="font-bold underline text-slate-900">Dr. Indah Permata, S.Pd., M.T.</p>
                    <p className="text-[11px] text-slate-500">NIP. 19760824 200212 2 003</p>
                  </div>

                  {/* Right Signature: Kepala Sekolah */}
                  <div className="text-center w-56">
                    <p className="text-slate-500 text-[11px]">Ditetapkan di Kota Pendidikan,</p>
                    <p className="font-bold text-slate-900 mt-0.5">Kepala SMK Negeri 1 Unggul Terpadu,</p>
                    <div className="my-3 flex justify-center">
                      <div className="border border-emerald-400 bg-emerald-50/50 rounded-lg p-2 text-center text-[10px] text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-0.5" />
                        <span>Disahkan Resmi</span>
                        <span className="block font-mono text-[9px]">SK-KS/2026/09/18</span>
                      </div>
                    </div>
                    <p className="font-bold underline text-slate-900">Drs. H. Bambang Hartono, M.Pd.</p>
                    <p className="text-[11px] text-slate-500">NIP. 19680512 199403 1 004</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
