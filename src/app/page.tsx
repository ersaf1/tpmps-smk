'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Folder,
  UploadCloud,
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HardDrive,
  Users,
  Award,
  Sparkles,
  BookOpen,
  Activity,
  CheckSquare,
  Building2,
  Layers,
  ChevronRight,
  Lock
} from 'lucide-react';
import { INITIAL_STANDARDS } from '@/lib/services/sintesaDataService';
import RequestDemoModal from '@/components/landing/RequestDemoModal';

export default function LandingPage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const SNP_LIST = INITIAL_STANDARDS;

  const STATS = [
    { label: 'Indeks Capaian Mutu', val: '87.2%', desc: 'Predikat A (Unggul)', accent: 'text-[#0077B6]', bg: 'bg-white border-slate-200' },
    { label: 'Unit Kerja Terhubung', val: '18 Unit', desc: 'Repositori Unit Aktif', accent: 'text-orange-600', bg: 'bg-white border-slate-200' },
    { label: 'Standar Pendidikan', val: '8 Standar', desc: 'Instrumen SNP Terpetakan', accent: 'text-[#0284C7]', bg: 'bg-white border-slate-200' },
    { label: 'Sertifikasi Kejuruan', val: '92.5%', desc: 'Uji Kompetensi LSP-P1', accent: 'text-amber-600', bg: 'bg-white border-slate-200' }
  ];

  const PPEPP_STEPS = [
    {
      step: '01',
      title: 'Penetapan',
      desc: 'Penyusunan standar mutu sekolah, indikator capaian, dan sasaran mutu tiap unit kerja.',
      badge: 'text-[#0077B6] bg-blue-50 border-blue-200'
    },
    {
      step: '02',
      title: 'Pelaksanaan',
      desc: 'Penerapan standar dalam pembelajaran, praktik kejuruan, Teaching Factory, dan tata kelola.',
      badge: 'text-orange-600 bg-orange-50 border-orange-200'
    },
    {
      step: '03',
      title: 'Evaluasi',
      desc: 'Pengisian evaluasi mandiri oleh unit kerja disertai pengunggahan berkas bukti fisik.',
      badge: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      step: '04',
      title: 'Pengendalian',
      desc: 'Audit & verifikasi dokumen bukti oleh auditor TPMPS untuk mengidentifikasi temuan audit.',
      badge: 'text-sky-600 bg-sky-50 border-sky-200'
    },
    {
      step: '05',
      title: 'Peningkatan',
      desc: 'Penyusunan Rencana Tindak Lanjut (RTL) untuk perbaikan mutu berkelanjutan sekolah.',
      badge: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#0077B6]/20 selection:text-[#0077B6]">
      {/* ------------------------------------------------------------------------
          TOP NAVIGATION BAR (Clean White with Blue & Orange Accents)
      ------------------------------------------------------------------------ */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Logo SMK Negeri 2 Magelang"
              width={42}
              height={42}
              className="w-10 h-10 object-contain shrink-0 group-hover:scale-105 transition-transform"
              priority
              unoptimized
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-slate-900 tracking-tight">SINTESA</span>
                <span className="text-xl font-bold text-[#0077B6] tracking-tight">TPMPS</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200 ml-1">
                  SMK PK
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                SMK NEGERI 2 MAGELANG
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#beranda" className="text-[#0077B6] hover:text-[#0284C7] transition-colors">
              Beranda
            </a>
            <a href="#ppepp" className="hover:text-[#0077B6] transition-colors">
              Siklus PPEPP
            </a>
            <a href="#snp" className="hover:text-[#0077B6] transition-colors">
              8 Standar SNP
            </a>
            <a href="#keunggulan" className="hover:text-[#0077B6] transition-colors">
              Fitur Sistem
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/drive"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all shadow-xs"
            >
              <HardDrive className="w-4 h-4 text-[#0077B6]" />
              <span>Drive Unit</span>
            </Link>

            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-[#0077B6] hover:bg-[#0284C7] text-white text-xs sm:text-sm font-bold shadow-sm shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-102 active:scale-98"
            >
              <Lock className="w-4 h-4" />
              <span>Masuk Aplikasi</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------------
          HERO SECTION (Centered, Clean, Professional, Tanpa Foto / Mockup Folder)
      ------------------------------------------------------------------------ */}
      <section id="beranda" className="pt-16 sm:pt-24 pb-16 sm:pb-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>Sistem Penjaminan Mutu Internal (SPMI) SMK N 2 Magelang</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.18]">
            Penjaminan Mutu Sekolah &amp; Repositori Digital{' '}
            <span className="text-[#0077B6]">18 Unit Kerja</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Platform terpadu pengelolaan dokumen bukti fisik, evaluasi mandiri mutu, audit internal TPMPS, dan perencanaan tindak lanjut (RTL) berbasis 8 Standar Nasional Pendidikan.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              href="/login"
              className="px-6 py-3 rounded-xl bg-[#0077B6] hover:bg-[#0284C7] text-white font-bold text-sm shadow-md shadow-sky-500/20 flex items-center gap-2 transition-all hover:scale-102"
            >
              <Lock className="w-4 h-4" />
              <span>Masuk Portal Mutu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/drive"
              className="px-6 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-xs flex items-center gap-2 transition-all"
            >
              <HardDrive className="w-4 h-4 text-orange-500" />
              <span>Drive Repositori Unit</span>
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
          <div className="pt-8 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
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
      </section>

      {/* ------------------------------------------------------------------------
          STATS SECTION (4 Clean Solid Cards: White with Subtle Border)
      ------------------------------------------------------------------------ */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map((s, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    {s.label}
                  </div>
                  <div className={`text-2xl sm:text-3xl font-bold ${s.accent} font-mono tracking-tight`}>
                    {s.val}
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 font-medium">
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
      <section id="ppepp" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-[#0077B6] border border-blue-200">
              Siklus Mutu Berkelanjutan
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-3">
              Implementasi Siklus PPEPP
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Alur kerja terstruktur untuk memastikan standar mutu sekolah direncanakan, dilaksanakan, dievaluasi, dan ditingkatkan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PPEPP_STEPS.map((step) => (
              <div
                key={step.step}
                className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200 shadow-2xs hover:bg-white hover:border-[#0077B6] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg border ${step.badge}`}>
                      Langkah {step.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0077B6] transition-colors">
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
      <section id="snp" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
              Instrumen Penjaminan Mutu
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-3">
              8 Standar Nasional Pendidikan (SNP)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Pemetaan indikator dan bukti fisik mutu pada seluruh komponen operasional sekolah kejuruan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SNP_LIST.map((snp, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={snp.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#0077B6] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                        isEven ? 'bg-blue-50 text-[#0077B6] border-blue-200' : 'bg-orange-50 text-orange-600 border-orange-200'
                      }`}>
                        {snp.code}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 font-mono">
                        Bobot {snp.weight}%
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0077B6] transition-colors leading-snug">
                      {snp.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                      {snp.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500 text-[11px]">
                      Target {snp.targetScore}% &bull; Capaian {snp.currentScore}%
                    </span>
                    <Link
                      href={`/mutu/${snp.id}`}
                      className="font-bold text-[#0077B6] hover:underline"
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
      <section id="keunggulan" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-[#0077B6] border border-blue-200">
              Inovasi Digital
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-3">
              Keunggulan Ekosistem SINTESA
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Transformasi pengelolaan mutu dari arsip kertas menjadi repositori terpadu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#0077B6] flex items-center justify-center mb-4">
                <HardDrive className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                18 Folder Unit Kerja
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tiap unit kerja memiliki repositori folder tersendiri untuk mengunggah dan mengarsipkan dokumen bukti fisik.
              </p>
            </div>

            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-orange-100/70 text-orange-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Hierarki Dokumen SPMI
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pengarsipan berbasis Manual Mutu (MM), Prosedur Mutu (PM), Petunjuk Kerja (PK), dan Catatan Mutu / Formulir (CM).
              </p>
            </div>

            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Wewenang Presisi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kepala Sekolah berwenang membuat periode &amp; audit folder unit, TPMPS memvalidasi dokumen, dan unit kerja mengisi evaluasi mandiri.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------
          FOOTER
      ------------------------------------------------------------------------ */}
      <footer className="bg-white py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="SMK N 2 Magelang"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
                unoptimized
              />
              <div>
                <span className="font-bold text-slate-900 text-xs">SINTESA TPMPS</span>
                <p className="text-[11px] text-slate-500">
                  SMK Negeri 2 Magelang &bull; Jl. Perintis Kemerdekaan No.92 Kota Magelang
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right text-[11px]">
              <p>&copy; {new Date().getFullYear()} Tim Penjaminan Mutu Pendidikan Sekolah (TPMPS).</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Request Demo / SOP Modal */}
      <RequestDemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
}
