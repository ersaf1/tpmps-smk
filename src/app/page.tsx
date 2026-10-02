'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Folder,
  FolderPlus,
  UploadCloud,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
  HardDrive,
  Users,
  Award,
  Sparkles,
  BookOpen,
  Activity,
  CheckSquare,
  Building2,
  Layers,
  BadgePercent,
  Download,
  Eye,
  Star,
  ChevronRight,
  Archive,
  Lock
} from 'lucide-react';
import { INITIAL_STANDARDS } from '@/lib/services/sintesaDataService';
import RequestDemoModal from '@/components/landing/RequestDemoModal';

export default function LandingPage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const SNP_LIST = INITIAL_STANDARDS;

  const STATS = [
    { label: 'Indeks Capaian Mutu', val: '87.2%', desc: 'Predikat A (Unggul)', accent: 'text-[#0077B6]', bg: 'bg-blue-50 border-blue-200' },
    { label: 'Unit Kerja Terhubung', val: '18 Unit', desc: 'Repositori Folder Aktif', accent: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
    { label: 'Standar Pendidikan', val: '8 Standar', desc: 'Instrumen SNP Terpetakan', accent: 'text-[#0284C7]', bg: 'bg-sky-50 border-sky-200' },
    { label: 'Sertifikasi Kejuruan', val: '92.5%', desc: 'Uji Kompetensi LSP-P1', accent: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' }
  ];

  const PPEPP_STEPS = [
    {
      step: '01',
      title: 'Penetapan',
      desc: 'Penyusunan standar mutu sekolah, indikator capaian, dan sasaran mutu tiap unit kerja.',
      color: 'bg-blue-50 text-[#0077B6] border-blue-200'
    },
    {
      step: '02',
      title: 'Pelaksanaan',
      desc: 'Penerapan standar dalam pembelajaran, praktik kejuruan, Teaching Factory, dan tata kelola.',
      color: 'bg-orange-50 text-orange-600 border-orange-200'
    },
    {
      step: '03',
      title: 'Evaluasi',
      desc: 'Pengisian evaluasi mandiri oleh unit kerja disertai unggahan berkas bukti fisik ke folder unit.',
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      step: '04',
      title: 'Pengendalian',
      desc: 'Audit & verifikasi dokumen bukti oleh TPMPS untuk mengidentifikasi temuan dan ketidaksesuaian.',
      color: 'bg-sky-50 text-sky-600 border-sky-200'
    },
    {
      step: '05',
      title: 'Peningkatan',
      desc: 'Penyusunan Rencana Tindak Lanjut (RTL) untuk perbaikan mutu berkelanjutan (Kaizen SPMI).',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#0077B6]/20 selection:text-[#0077B6]">
      {/* ------------------------------------------------------------------------
          TOP NAVIGATION BAR (Clean White with Blue & Orange Accents)
      ------------------------------------------------------------------------ */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Logo SMK Negeri 2 Magelang"
              width={46}
              height={46}
              className="w-11 h-11 object-contain shrink-0 group-hover:scale-105 transition-transform"
              priority
              unoptimized
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">SINTESA</span>
                <span className="text-xl sm:text-2xl font-black text-[#0077B6] tracking-tight">TPMPS</span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200 ml-1">
                  SMK PK
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                SMK NEGERI 2 MAGELANG
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold text-slate-600">
            <a href="#beranda" className="text-[#0077B6] hover:text-[#0284C7] transition-colors">
              Beranda
            </a>
            <a href="#drive-preview" className="hover:text-[#0077B6] transition-colors">
              Drive 18 Unit
            </a>
            <a href="#ppepp" className="hover:text-[#0077B6] transition-colors">
              Siklus PPEPP
            </a>
            <a href="#snp" className="hover:text-[#0077B6] transition-colors">
              8 Standar SNP
            </a>
            <a href="#keunggulan" className="hover:text-[#0077B6] transition-colors">
              Fitur Unggulan
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/drive"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-xs font-bold text-[#0077B6] transition-all shadow-2xs"
            >
              <HardDrive className="w-4 h-4" />
              <span>Drive Unit</span>
            </Link>

            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] hover:brightness-105 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/20 flex items-center gap-2 transition-all hover:scale-102 active:scale-98"
            >
              <Lock className="w-4 h-4" />
              <span>Masuk Aplikasi</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------------
          HERO SECTION (White, Blue, and Orange Palette)
      ------------------------------------------------------------------------ */}
      <section id="beranda" className="pt-10 sm:pt-16 pb-16 sm:pb-24 overflow-hidden relative">
        {/* Soft background accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/60 via-orange-50/30 to-transparent pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline & Messaging */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span>Sistem Penjaminan Mutu Internal (SPMI) 2026</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Organize Your Files &amp; Keep Them Safe,{' '}
                <span className="bg-gradient-to-r from-[#0077B6] via-[#0284C7] to-orange-500 bg-clip-text text-transparent">
                  Everywhere!
                </span>
              </h1>

              {/* Sub-description */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Repositori digital bukti fisik mutu SMK Negeri 2 Magelang berbasis arsitektur <strong>Google Drive 18 Unit Kerja</strong>, pemenuhan <strong>8 Standar Nasional Pendidikan</strong>, dan siklus penjaminan mutu <strong>PPEPP</strong> terintegrasi.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/drive"
                  className="px-6 py-3 rounded-2xl bg-[#0077B6] hover:bg-[#0284C7] text-white font-bold text-sm shadow-lg shadow-sky-500/25 flex items-center gap-2.5 transition-all hover:scale-102 active:scale-98"
                >
                  <HardDrive className="w-4 h-4" />
                  <span>Buka Drive 18 Unit Kerja</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </Link>

                <Link
                  href="/login"
                  className="px-6 py-3 rounded-2xl bg-white border-2 border-orange-500 hover:bg-orange-50/80 text-orange-600 font-bold text-sm shadow-xs flex items-center gap-2 transition-all hover:scale-102"
                >
                  <Lock className="w-4 h-4 text-orange-500" />
                  <span>Login Pengguna</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsDemoOpen(true)}
                  className="px-4 py-3 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#0077B6] transition-colors cursor-pointer"
                >
                  Panduan Akses &amp; SOP &rarr;
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Terakreditasi A (Unggul)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0077B6]" />
                  <span>SMK Pusat Keunggulan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" />
                  <span>LSP-P1 Berlisensi BNSP</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Google Drive UI Mockup (Bukan Foto Folder Kartun) */}
            <div id="drive-preview" className="lg:col-span-6">
              <div className="relative rounded-3xl bg-white border-2 border-slate-200 shadow-xl overflow-hidden">
                {/* Browser / Drive Window Header */}
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-mono font-bold text-slate-500 ml-2">
                      drive.google.com / SINTESA TPMPS
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-[#0077B6]">
                      Google Workspace Education
                    </span>
                  </div>
                </div>

                {/* Drive App Search Bar */}
                <div className="p-4 sm:p-5 bg-white border-b border-slate-100">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      readOnly
                      value="Dapatkan dokumen bukti dari 18 Unit Kerja..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 outline-hidden select-none cursor-default"
                    />
                  </div>
                </div>

                {/* Drive Toolbar */}
                <div className="px-5 py-3 bg-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <HardDrive className="w-4 h-4 text-[#0077B6]" />
                    <span>Drive Saya</span>
                    <span className="text-slate-400">&gt;</span>
                    <span className="text-[#0077B6]">Unit 07 - TPMPS</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/drive"
                      className="px-3 py-1.5 rounded-lg bg-[#0077B6] hover:bg-[#0284C7] text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>+ Upload Berkas</span>
                    </Link>
                    <span className="px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 font-bold text-[11px]">
                      18 Unit Terhubung
                    </span>
                  </div>
                </div>

                {/* Folder Grid Mockup */}
                <div className="p-5 space-y-4 bg-slate-50/50">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Folder Standar &amp; Unit Kerja
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Folder 1 */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 shadow-2xs flex items-center justify-between transition-all group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0077B6] shrink-0">
                          <Folder className="w-5 h-5 fill-sky-200" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate group-hover:text-[#0077B6]">
                            01. Standar SKL &amp; Prestasi
                          </div>
                          <div className="text-[10px] text-slate-500">14 Berkas Bukti</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>

                    {/* Folder 2 */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-orange-400 shadow-2xs flex items-center justify-between transition-all group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
                          <Folder className="w-5 h-5 fill-orange-200" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate group-hover:text-orange-600">
                            02. Kurikulum &amp; IDUKA
                          </div>
                          <div className="text-[10px] text-slate-500">19 Berkas Bukti</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>

                    {/* Folder 3 */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 shadow-2xs flex items-center justify-between transition-all group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0077B6] shrink-0">
                          <Folder className="w-5 h-5 fill-sky-200" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate group-hover:text-[#0077B6]">
                            03. RPP &amp; Modul Ajar
                          </div>
                          <div className="text-[10px] text-slate-500">28 Berkas Bukti</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>

                    {/* Folder 4 */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-orange-400 shadow-2xs flex items-center justify-between transition-all group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
                          <Folder className="w-5 h-5 fill-orange-200" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate group-hover:text-orange-600">
                            04. Uji Sertifikasi LSP-P1
                          </div>
                          <div className="text-[10px] text-slate-500">12 Berkas Bukti</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Sample File Row */}
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Berkas Unggahan Terverifikasi
                    </div>
                    <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            DOC-F-KUR-204 - Penyelarasan_Kurikulum_IDUKA_2026.pdf
                          </div>
                          <div className="text-[10px] text-slate-500">
                            3.4 MB &bull; Diunggah oleh Unit Kurikulum
                          </div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold shrink-0">
                        Terverifikasi Sah
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Footer Bar */}
                <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Kapasitas: 4.2 GB dari 15 GB Digunakan</span>
                  <Link
                    href="/drive"
                    className="font-bold text-[#0077B6] hover:text-[#0284C7] flex items-center gap-1"
                  >
                    <span>Masuk Google Drive Unit</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------
          STATS SECTION (4 Cards: Blue & Orange Highlights)
      ------------------------------------------------------------------------ */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map((s, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border ${s.bg} flex flex-col justify-between shadow-xs transition-transform hover:-translate-y-1`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    {s.label}
                  </div>
                  <div className={`text-3xl sm:text-4xl font-black ${s.accent} font-mono tracking-tight`}>
                    {s.val}
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-3 pt-3 border-t border-slate-200/60">
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------
          PPEPP CYCLE (Continuous Quality Improvement)
      ------------------------------------------------------------------------ */}
      <section id="ppepp" className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-blue-100 text-[#0077B6] border border-blue-200">
              Siklus Mutu Berkelanjutan
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Implementasi Siklus Mutu PPEPP
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Alur kerja terstruktur untuk memastikan standar mutu sekolah direncanakan, dilaksanakan, dievaluasi, dan ditingkatkan secara berkesinambungan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PPEPP_STEPS.map((step) => (
              <div
                key={step.step}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-[#0077B6] transition-all hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-mono font-black px-2.5 py-1 rounded-xl border ${step.color}`}>
                      Langkah {step.step}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-[#0077B6] transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0077B6] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------
          8 STANDAR NASIONAL PENDIDIKAN (SNP)
      ------------------------------------------------------------------------ */}
      <section id="snp" className="py-16 sm:py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
              Instrumen Penjaminan Mutu
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mt-3">
              8 Standar Nasional Pendidikan (SNP)
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Pemetaan indikator dan bukti fisik mutu pada seluruh komponen operasional sekolah kejuruan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SNP_LIST.map((snp, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={snp.id}
                  className="p-6 rounded-3xl bg-slate-50/60 border border-slate-200 hover:border-[#0077B6] hover:bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg border ${
                        isEven ? 'bg-blue-50 text-[#0077B6] border-blue-200' : 'bg-orange-50 text-orange-600 border-orange-200'
                      }`}>
                        {snp.code}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 font-mono">
                        Bobot {snp.weight}%
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0077B6] transition-colors leading-snug">
                      {snp.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">
                      {snp.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">
                      Target {snp.targetScore}% &bull; Capaian {snp.currentScore}%
                    </span>
                    <Link
                      href={`/mutu/${snp.id}`}
                      className="font-bold text-[#0077B6] group-hover:translate-x-1 transition-transform"
                    >
                      Detail &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------
          KEY FEATURES HIGHLIGHT
      ------------------------------------------------------------------------ */}
      <section id="keunggulan" className="py-16 sm:py-24 bg-gradient-to-b from-blue-50/50 to-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-blue-100 text-[#0077B6] border border-blue-200">
              Inovasi Digital
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Keunggulan Ekosistem SINTESA TPMPS
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Transformasi audit mutu dari arsip kertas menjadi repositori digital terstruktur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs hover:border-[#0077B6] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0077B6] mb-5">
                <HardDrive className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                18 Folder Unit Kerja
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tiap unit kerja (Konsentrasi Keahlian, Bengkel, BKK, Perpustakaan, Sarpras) memiliki repositori folder tersendiri untuk mengunggah dan mengelola bukti fisik.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs hover:border-orange-400 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Hierarki Dokumen SPMI
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pengarsipan berbasis Manual Mutu (MM), Prosedur Mutu (PM), Petunjuk Kerja (PK), Catatan Mutu / Formulir (CM), dan Rekapitulasi Capaian Unit.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Wewenang Terstruktur
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pemisahan wewenang presisi antara Kepala Sekolah (buat periode &amp; audit folder), Ketua TPMPS (validasi bukti &amp; agregat), dan Unit Kerja (evaluasi mandiri).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------
          CALL TO ACTION (CTA BANNER)
      ------------------------------------------------------------------------ */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-orange-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>SMK Negeri 2 Magelang Unggul &amp; Berkarakter</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
            Siap Membangun Ekosistem Penjaminan Mutu Berstandar Industri?
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Masuk ke portal SINTESA TPMPS untuk mengakses folder unit kerja, memeriksa capaian standar, dan mengelola dokumen bukti fisik.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/drive"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] hover:brightness-110 text-white font-bold text-sm shadow-xl shadow-sky-500/30 flex items-center gap-2.5 transition-all hover:scale-105"
            >
              <HardDrive className="w-4 h-4" />
              <span>Buka Google Drive Unit</span>
            </Link>

            <Link
              href="/login"
              className="px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-lg transition-all hover:scale-105"
            >
              <span>Login Akun Pengguna</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------
          FOOTER
      ------------------------------------------------------------------------ */}
      <footer className="bg-white border-t border-slate-200 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="SMK N 2 Magelang"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
                unoptimized
              />
              <div>
                <span className="font-bold text-slate-900 text-sm">SINTESA TPMPS</span>
                <p className="text-[11px] text-slate-500">
                  SMK Negeri 2 Magelang &bull; Jl. Perintis Kemerdekaan No.92 Kota Magelang
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right text-[11px]">
              <p>&copy; {new Date().getFullYear()} Tim Penjaminan Mutu Pendidikan Sekolah (TPMPS).</p>
              <p className="text-slate-400 mt-0.5">Siklus PPEPP &bull; 8 Standar Nasional Pendidikan</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Request Demo / SOP Modal */}
      <RequestDemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
}
