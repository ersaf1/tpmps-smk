'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  Activity,
  CheckSquare,
  Users,
  Building2,
  Layers,
  BadgePercent,
  CheckCircle2,
  ArrowRight,
  FileCheck2,
  FolderArchive,
  Target,
  FileSpreadsheet,
  LogIn,
  ChevronRight
} from 'lucide-react';
import { INITIAL_STANDARDS } from '@/lib/services/sigmaDataService';

export default function LandingPage() {
  const SNP_LIST = INITIAL_STANDARDS;

  const STATS = [
    { label: 'Indeks Capaian Mutu', val: '87.2%', desc: 'Predikat A (Unggul)', color: 'text-[#0077B6]' },
    { label: 'Unit Kerja Terlibat', val: '18 Unit', desc: 'Evaluasi Mandiri Aktif', color: 'text-[#0284C7]' },
    { label: 'Standar Pendidikan', val: '8 Standar', desc: 'Instrumen SNP Terpetakan', color: 'text-[#F59E0B]' },
    { label: 'Sertifikasi Kejuruan', val: '92.5%', desc: 'Uji Kompetensi LSP-P1', color: 'text-emerald-600' }
  ];

  const PPEPP_STEPS = [
    { step: '01', title: 'Penetapan', desc: 'Penyusunan standar mutu sekolah, indikator capaian, dan sasaran mutu tiap unit kerja.' },
    { step: '02', title: 'Pelaksanaan', desc: 'Penerapan standar dalam pembelajaran, praktik kejuruan, Teaching Factory, dan manajemen.' },
    { step: '03', title: 'Evaluasi', desc: 'Pengisian instrumen evaluasi mandiri oleh unit kerja disertai unggahan berkas bukti fisik.' },
    { step: '04', title: 'Pengendalian', desc: 'Verifikasi dokumen oleh auditor TPMPS untuk mengidentifikasi temuan dan ketidaksesuaian.' },
    { step: '05', title: 'Peningkatan', desc: 'Penyusunan Rencana Tindak Lanjut (RTL) untuk perbaikan mutu berkelanjutan.' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-[#0077B6]">
      {/* ------------------------------------------------------------------------
          CLEAN TOP HEADER (White with crisp blue line)
      ------------------------------------------------------------------------ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & School Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Logo SMK Negeri 2 Magelang"
              width={48}
              height={48}
              className="w-12 h-12 object-contain shrink-0 group-hover:scale-105 transition-transform"
              priority
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">SIGMA</span>
                <span className="text-xl font-black tracking-tight text-[#0077B6]">TPMPS</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                SMK NEGERI 2 MAGELANG
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <a href="#tentang" className="hover:text-[#0077B6] transition-colors">Tentang Sistem</a>
            <a href="#snp" className="hover:text-[#0077B6] transition-colors">8 Standar Mutu</a>
            <a href="#ppepp" className="hover:text-[#0077B6] transition-colors">Siklus PPEPP</a>
            <a href="#fitur" className="hover:text-[#0077B6] transition-colors">Fitur</a>
            <Link href="/laporan" className="hover:text-[#0077B6] transition-colors">Rapor Sekolah</Link>
          </nav>

          {/* Single Unified Action Button */}
          <div className="flex items-center">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] hover:brightness-105 text-white text-xs font-bold shadow-sm shadow-blue-500/20 flex items-center gap-2 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Sistem</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------------
          HERO SECTION (Clean White & Institutional Blue)
      ------------------------------------------------------------------------ */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Siklus Mutu PPEPP{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0077B6] to-[#0284C7]">
                  Penjaminan Mutu Internal Sekolah
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Penerapan terpadu Penetapan, Pelaksanaan, Evaluasi, Pengendalian, dan Peningkatan (PPEPP) berbasis bukti fisik digital 18 unit kerja di SMK Negeri 2 Magelang.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] hover:brightness-105 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Sistem</span>
                </Link>
              </div>

              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">Terakreditasi A (Unggul)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0077B6]" />
                  <span className="font-semibold">LSP-P1 Berlisensi BNSP</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F28C28]" />
                  <span className="font-semibold">SMK Pusat Keunggulan</span>
                </div>
              </div>
            </div>

            {/* Right Card: Telemetry Overview */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-7 shadow-lg border border-slate-200 relative space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0077B6]">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Ringkasan Mutu Sekolah</h4>
                      <p className="text-[11px] text-slate-500 font-mono">Tahun Ajaran 2025/2026</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Aktif
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                      Capaian Kumulatif 8 SNP
                    </span>
                    <div className="text-4xl font-black text-[#0077B6] font-mono mt-1">
                      87.2<span className="text-xl text-slate-400 font-sans">%</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 mt-0.5 block">
                      Target Sekolah: 95.0%
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-500 block">Kualifikasi:</span>
                    <span className="text-lg font-black text-slate-900 block">Sangat Baik (A)</span>
                    <span className="text-[11px] text-[#0077B6] font-semibold">18 Unit Kerja</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Standar Kompetensi Lulusan (SKL)</span>
                      <span className="text-[#0077B6] font-mono">88.5%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0077B6] rounded-full" style={{ width: '88.5%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Standar Pengelolaan</span>
                      <span className="text-[#0284C7] font-mono">91.0%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0284C7] rounded-full" style={{ width: '91%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Standar Penilaian Vokasi</span>
                      <span className="text-emerald-600 font-mono">89.2%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '89.2%' }} />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Keamanan Database Supabase RLS</span>
                  <Link href="/login" className="text-[#0077B6] font-bold hover:underline flex items-center gap-1">
                    <span>Masuk Auditor</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------
          SECTION: 4 KPI CARDS
      ------------------------------------------------------------------------ */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 hover:border-blue-300 transition-all hover:shadow-md"
              >
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">
                  {s.label}
                </span>
                <div className={`text-3xl sm:text-4xl font-black font-mono mt-1 ${s.color}`}>
                  {s.val}
                </div>
                <p className="text-xs font-semibold text-slate-600 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------
          SECTION: 8 STANDAR NASIONAL PENDIDIKAN (SNP)
      ------------------------------------------------------------------------ */}
      <section id="snp" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-[#0077B6]">
              8 Standar Nasional Pendidikan
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Pemantauan Berkelanjutan 8 SNP
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Masing-masing standar memiliki bobot persentase terukur dan terhubung langsung ke dokumen bukti fisik dari unit kerja pelaksana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SNP_LIST.map((snp) => (
              <div
                key={snp.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 font-mono text-xs font-bold text-[#0077B6]">
                      {snp.code}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Bobot: {snp.weight}%
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-[#0077B6] transition-colors">
                    {snp.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {snp.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                    <span className="text-slate-500">Realisasi Capaian:</span>
                    <span className="font-bold text-[#0077B6]">{snp.currentScore.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0077B6] to-[#0284C7] rounded-full"
                      style={{ width: `${snp.currentScore}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------
          SECTION: SIKLUS PPEPP
      ------------------------------------------------------------------------ */}
      <section id="ppepp" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Siklus Mutu PPEPP
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Alur kerja terstruktur untuk memastikan standar mutu sekolah dilaksanakan, dievaluasi, dan ditingkatkan secara berkesinambungan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PPEPP_STEPS.map((s) => (
              <div
                key={s.step}
                className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 hover:border-blue-300 transition-all hover:shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#0077B6] text-white text-sm font-black font-mono shadow-sm">
                      {s.step}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#0077B6]">
                      Tahap PPEPP
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">{s.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------
          SECTION: FITUR UTAMA SISTEM
      ------------------------------------------------------------------------ */}
      <section id="fitur" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-[#0077B6]">
              Kemudahan Pengelolaan
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Fitur Utama Sistem
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Dirancang untuk mempermudah tugas penjaminan mutu di sekolah tanpa kerumitan administrasi manual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0077B6]">
                <FolderArchive className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Bank Dokumen Digital</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Penyimpanan terpusat untuk SK, modul ajar, instrumen asesmen, berkas MoU industri, dan dokumentasi sarana prasarana.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0077B6]">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Verifikasi Bertingkat</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Alur verifikasi yang rapi: pengisian oleh unit kerja, peninjauan oleh tim TPMPS, dan persetujuan oleh Kepala Sekolah.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0077B6]">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Rencana Tindak Lanjut (RTL)</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Setiap indikator yang memerlukan perhatian langsung memiliki rencana tindak lanjut terukur beserta target waktu dan alokasi dana.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------
          CALL TO ACTION (Clean White Card on Soft Blue)
      ------------------------------------------------------------------------ */}
      <section className="py-16 bg-gradient-to-b from-[#F8FAFC] to-blue-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-blue-200 shadow-lg text-center space-y-6">
            <Image
              src="/logo.png"
              alt="Logo SMK Negeri 2 Magelang"
              width={80}
              height={80}
              className="w-20 h-20 object-contain mx-auto"
              priority
            />

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              SMK Negeri 2 Magelang
            </h2>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Mewujudkan lulusan vokasi yang kompeten, berkarakter, dan berdaya saing global melalui penjaminan mutu pendidikan yang konsisten.
            </p>

            <div className="flex items-center justify-center pt-2">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 hover:brightness-105 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk ke Sistem</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------
          FOOTER (Clean White Background)
      ------------------------------------------------------------------------ */}
      <footer className="bg-white border-t border-slate-200 py-12 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
              <span className="text-sm font-black text-[#0077B6]">SIGMA TPMPS</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Sistem Informasi Manajemen Penjaminan Mutu Pendidikan Sekolah SMK Negeri 2 Magelang.
            </p>
            <span className="text-[11px] font-bold text-[#F59E0B] block">
              MOTTO: SWADAYA BHINA RAHARJA
            </span>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3">Tautan</h4>
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="hover:text-[#0077B6]">Dashboard Mutu</Link></li>
              <li><Link href="/evaluasi" className="hover:text-[#0077B6]">Evaluasi Mandiri</Link></li>
              <li><Link href="/dokumen" className="hover:text-[#0077B6]">Bank Dokumen</Link></li>
              <li><Link href="/rtl" className="hover:text-[#0077B6]">Rencana Tindak Lanjut</Link></li>
              <li><Link href="/laporan" className="hover:text-[#0077B6]">Laporan Mutu</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3">Standar Pendidikan</h4>
            <ul className="space-y-1.5 text-slate-500">
              <li>• Kompetensi Lulusan</li>
              <li>• Isi & Kurikulum</li>
              <li>• Proses Pembelajaran</li>
              <li>• Penilaian Pendidikan</li>
              <li>• Pendidik & Tenaga Kependidikan</li>
              <li>• Sarana & Prasarana</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3">Alamat</h4>
            <p className="text-slate-500 leading-relaxed">
              SMK Negeri 2 Magelang<br />
              Jl. Perintis Kemerdekaan No. 9, Kota Magelang, Jawa Tengah 56115<br />
              Telepon: (0293) 362577<br />
              Email: info@smkn2magelang.sch.id
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-center sm:text-left">
          <span>&copy; {new Date().getFullYear()} Tim Penjamin Mutu (TPMPS) SMK Negeri 2 Magelang.</span>
          <span>Sistem Penjaminan Mutu Internal (SPMI)</span>
        </div>
      </footer>
    </div>
  );
}
