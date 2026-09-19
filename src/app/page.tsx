'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Shield,
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
  Sparkles,
  FileCheck2,
  FolderArchive,
  Target,
  FileSpreadsheet,
  Lock,
  ChevronRight,
  ExternalLink,
  School
} from 'lucide-react';
import { INITIAL_STANDARDS } from '@/lib/services/sigmaDataService';

export default function LandingPage() {
  const SNP_LIST = INITIAL_STANDARDS;

  const STATS = [
    { label: 'Indeks Mutu Kumulatif', val: '87.2%', desc: 'Predikat A (Unggul Akreditasi)', color: 'text-[#0077B6]' },
    { label: 'Unit Kerja & Jurusan', val: '18 Unit', desc: 'Terintegrasi Siklus PPEPP', color: 'text-[#22D3EE]' },
    { label: 'Standar Nasional (SNP)', val: '8 Standar', desc: '100% Terpetakan & Berbobot', color: 'text-[#F6B73C]' },
    { label: 'Kelulusan Sertifikasi', val: '92.5%', desc: 'Sertifikat BNSP LSP-P1', color: 'text-emerald-600' }
  ];

  const PPEPP_STEPS = [
    { step: '01', title: 'Penetapan (P)', desc: 'Penetapan standar mutu internal, indikator kunci kinerja, dan target capaian mutu sekolah.' },
    { step: '02', title: 'Pelaksanaan (P)', desc: 'Implementasi pembelajaran PjBL, TEFA, kurikulum industri, dan layanan penunjang vokasi.' },
    { step: '03', title: 'Evaluasi (E)', desc: 'Evaluasi diri berkala oleh 18 unit kerja dan verifikasi berkas bukti fisik oleh auditor TPMPS.' },
    { step: '04', title: 'Pengendalian (P)', desc: 'Analisis gap capaian mutu dan audit kepatuhan terhadap standar akreditasi BAP-S/M.' },
    { step: '05', title: 'Peningkatan (P)', desc: 'Penyusunan Rencana Tindak Lanjut (RTL) dan alokasi anggaran RKAS untuk peningkatan berkelanjutan.' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#0077B6]/20 selection:text-[#0077B6]">
      {/* ------------------------------------------------------------------------
          TOP NOTIFICATION BAR (OFFICIAL SCHOOL BANNER)
      ------------------------------------------------------------------------ */}
      <div className="bg-[#06162E] text-white text-xs py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#22D3EE]/20 text-[#22D3EE] font-bold text-[10px] tracking-wider uppercase">
              Resmi SPMI
            </span>
            <span>Sistem Informasi Manajemen Penjaminan Mutu SMK Negeri 2 Magelang</span>
          </div>
          <div className="text-[11px] text-[#94A3B8] font-medium flex items-center gap-3">
            <span>Motto: <strong className="text-[#F6B73C]">Swadaya Bhina Raharja</strong></span>
            <span>•</span>
            <span>TA 2025/2026</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------------
          PUBLIC NAVIGATION HEADER (White with crisp navy borders)
      ------------------------------------------------------------------------ */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#06162E] to-[#0077B6] p-1.5 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="Logo SMK Negeri 2 Magelang"
                width={38}
                height={38}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-[#06162E]">SIGMA</span>
                <span className="text-xl font-black tracking-tight text-[#0077B6]">TPMPS</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                SMK NEGERI 2 MAGELANG
              </p>
            </div>
          </Link>

          {/* Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <a href="#tentang" className="hover:text-[#0077B6] transition-colors">Tentang SPMI</a>
            <a href="#snp" className="hover:text-[#0077B6] transition-colors">8 Standar Mutu</a>
            <a href="#ppepp" className="hover:text-[#0077B6] transition-colors">Siklus PPEPP</a>
            <a href="#keunggulan" className="hover:text-[#0077B6] transition-colors">Fitur Sistem</a>
            <Link href="/laporan" className="hover:text-[#0077B6] transition-colors">Rapor Publik</Link>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-[#0077B6] text-xs font-bold text-slate-700 hover:text-[#0077B6] hover:bg-slate-50 transition-all flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Masuk Akun</span>
            </Link>

            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#06162E] hover:from-[#0096c7] hover:to-[#0077B6] text-white text-xs font-bold shadow-md shadow-[#0077B6]/20 flex items-center gap-1.5 transition-all group"
            >
              <span>Dashboard Mutu</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------------
          HERO SECTION (Blended White with Soft Blue Ambient)
      ------------------------------------------------------------------------ */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-white via-[#F0F7FF] to-[#F8FAFC]">
        {/* Soft Background Accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0077B6]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#22D3EE]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200 shadow-xs text-xs font-bold text-[#0077B6]">
                <Shield className="w-4 h-4 text-[#0077B6]" />
                <span>Portal Resmi SPMI • Standar Akreditasi Unggul</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#06162E] tracking-tight leading-[1.15]">
                Sistem Penjaminan Mutu Internal Berbasis{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0077B6] to-[#22D3EE]">
                  Bukti Nyata & Akuntabilitas
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Mendukung <strong>SMK Negeri 2 Magelang</strong> dalam siklus PPEPP, pemantauan 8 Standar Nasional Pendidikan, bank bukti fisik digital, evaluasi 18 unit kerja, dan rencana tindak lanjut terukur.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#0077B6] to-[#06162E] hover:brightness-110 text-white font-bold text-sm shadow-lg shadow-[#0077B6]/30 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Buka Dashboard Mutu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/laporan"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#0077B6]" />
                  <span>Lihat Rapor EDS Resmi</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-700">Terakreditasi A (Unggul)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0077B6]" />
                  <span className="font-semibold text-slate-700">LSP-P1 Berlisensi BNSP</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F28C28]" />
                  <span className="font-semibold text-slate-700">SMK Pusat Keunggulan</span>
                </div>
              </div>
            </div>

            {/* Hero Right: Live Telemetry Showcase Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-7 shadow-xl border border-slate-200/80 relative space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0077B6]">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#06162E]">Ringkasan Mutu Sekolah</h4>
                      <p className="text-[11px] text-slate-500 font-mono">Periode Ganjil 2025/2026</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Aktif & Valid
                  </span>
                </div>

                {/* Score Dial */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-blue-50/50 border border-blue-100/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                      Skor Kumulatif SPMI
                    </span>
                    <div className="text-4xl font-black text-[#0077B6] font-mono mt-1">
                      87.2<span className="text-xl text-slate-400 font-sans">%</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 mt-0.5 block">
                      Target Akreditasi: 95.0%
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-500 block">Kualifikasi:</span>
                    <span className="text-lg font-black text-[#06162E] block">Sangat Baik (A)</span>
                    <span className="text-[11px] text-[#0077B6] font-semibold">18 Unit Terpetakan</span>
                  </div>
                </div>

                {/* Mini Metric Bars */}
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
                      <span>Standar Pengelolaan Sekolah</span>
                      <span className="text-[#22D3EE] font-mono">91.0%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#22D3EE] rounded-full" style={{ width: '91%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Standar Penilaian Vokasi & LSP</span>
                      <span className="text-emerald-600 font-mono">89.2%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '89.2%' }} />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Dilindungi Supabase PostgreSQL RLS</span>
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
          SECTION: 4 KPI CARDS (Clean White with Vibrant Accents)
      ------------------------------------------------------------------------ */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 hover:border-blue-300 transition-all hover:shadow-md"
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
            <span className="text-xs font-bold uppercase tracking-widest text-[#0077B6] px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
              Acuan Mutu Baku
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#06162E] tracking-tight">
              8 Standar Nasional Pendidikan (SNP)
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Instrumen penjaminan mutu SMK Negeri 2 Magelang mengacu penuh pada 8 SNP Kemendikbudristek dengan pembobotan proporsional dan bukti dokumen fisik digital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SNP_LIST.map((snp) => (
              <div
                key={snp.id}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between group"
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

                  <h3 className="text-base font-bold text-[#06162E] tracking-tight group-hover:text-[#0077B6] transition-colors">
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
                      className="h-full bg-gradient-to-r from-[#0077B6] to-[#22D3EE] rounded-full"
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
          SECTION: SIKLUS PPEPP (MUTU BERKELANJUTAN)
      ------------------------------------------------------------------------ */}
      <section id="ppepp" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F28C28] px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
              Siklus Mutu Formal
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#06162E] tracking-tight">
              Siklus Penjaminan Mutu PPEPP
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Mekanisme formal SPMI yang dilaksanakan secara berkelanjutan untuk memastikan mutu lulusan, sarana praktik, dan tata kelola vokasi tetap unggul.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PPEPP_STEPS.map((s) => (
              <div
                key={s.step}
                className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 hover:border-[#0077B6] transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black font-mono text-[#0077B6]/30 block mb-2">
                    {s.step}
                  </span>
                  <h4 className="text-sm font-bold text-[#06162E] mb-2">{s.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------
          SECTION: FITUR UTAMA SISTEM SIGMA TPMPS
      ------------------------------------------------------------------------ */}
      <section id="keunggulan" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              Arsitektur Enterprise
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#06162E] tracking-tight">
              Fitur Produksi SIGMA TPMPS
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Dibuat tanpa data dummy, menggunakan PostgreSQL, autentikasi berbasis sesi resmi, dan isolasi hak akses database level (RLS).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0077B6]">
                <FolderArchive className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#06162E]">Bank Bukti Digital</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Penyimpanan berkas SK, modul ajar, dokumen MoU industri, dan foto sarana prasarana terenkripsi di Supabase Storage.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[#0077B6]">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#06162E]">Audit & Verifikasi Bertingkat</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Unit kerja menginput penilaian mandiri, tim auditor TPMPS melakukan verifikasi bukti fisik, dan Kepala Sekolah menyetujui laporan akhir.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F28C28]">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#06162E]">Rencana Tindak Lanjut (RTL)</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Setiap indikator mutu yang belum mencapai target langsung terhubung ke program RTL dengan alokasi dana RKAS dan target waktu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------
          CALL TO ACTION (CTA BANNER - Dark Navy & White Blend)
      ------------------------------------------------------------------------ */}
      <section className="py-16 bg-[#06162E] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-[#22D3EE]">
            <School className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Wujudkan Penjaminan Mutu Berkelanjutan di SMK Negeri 2 Magelang
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Akses instrumen evaluasi mutu internal dan bank bukti fisik digital melalui portal SIGMA TPMPS sekarang.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#0077B6] to-[#22D3EE] text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all"
            >
              <span>Masuk Portal SPMI</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm flex items-center justify-center transition-all"
            >
              <span>Buka Dashboard Mutu</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------
          OFFICIAL FOOTER
      ------------------------------------------------------------------------ */}
      <footer className="bg-white border-t border-slate-200 py-12 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
              <span className="text-sm font-black text-[#06162E]">SIGMA TPMPS</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Sistem Informasi Manajemen Penjaminan Mutu Pendidikan Sekolah SMK Negeri 2 Magelang.
            </p>
            <span className="text-[11px] font-bold text-[#F6B73C] block">
              MOTTO: SWADAYA BHINA RAHARJA
            </span>
          </div>

          <div>
            <h4 className="font-bold text-[#06162E] uppercase tracking-wider mb-3">Tautan Cepat</h4>
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="hover:text-[#0077B6]">Dashboard Mutu</Link></li>
              <li><Link href="/evaluasi" className="hover:text-[#0077B6]">Evaluasi Mandiri</Link></li>
              <li><Link href="/dokumen" className="hover:text-[#0077B6]">Bank Bukti Fisik</Link></li>
              <li><Link href="/rtl" className="hover:text-[#0077B6]">Rencana Tindak Lanjut</Link></li>
              <li><Link href="/laporan" className="hover:text-[#0077B6]">Laporan Mutu EDS</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#06162E] uppercase tracking-wider mb-3">8 Standar SNP</h4>
            <ul className="space-y-1.5 text-slate-500">
              <li>• Standar Kompetensi Lulusan</li>
              <li>• Standar Isi & Kurikulum</li>
              <li>• Standar Proses & TEFA</li>
              <li>• Standar Penilaian & LSP</li>
              <li>• Standar Pendidik & Tendik</li>
              <li>• Standar Sarana & Prasarana</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#06162E] uppercase tracking-wider mb-3">Kontak Institusi</h4>
            <p className="text-slate-500 leading-relaxed">
              SMK Negeri 2 Magelang<br />
              Jl. Perintis Kemerdekaan No. 9, Kota Magelang, Jawa Tengah 56115<br />
              Telepon: (0293) 362577<br />
              Email: info@smkn2magelang.sch.id
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-center sm:text-left">
          <span>&copy; {new Date().getFullYear()} Tim Penjamin Mutu (TPMPS) SMK Negeri 2 Magelang. Hak cipta dilindungi.</span>
          <span>Ditenagai oleh Supabase PostgreSQL RLS & Next.js Enterprise Framework</span>
        </div>
      </footer>
    </div>
  );
}
