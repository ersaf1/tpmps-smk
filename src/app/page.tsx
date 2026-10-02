'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  Folder,
  Cloud,
  Award,
  BookOpen,
  Activity,
  CheckSquare,
  Building2,
  Layers,
  CheckCircle2,
  ArrowRight,
  FileCheck2,
  FolderArchive,
  Target,
  LogIn,
  ChevronRight,
  Archive,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { INITIAL_STANDARDS } from '@/lib/services/sintesaDataService';
import FolderHeroGraphic from '@/components/landing/FolderHeroGraphic';
import RequestDemoModal from '@/components/landing/RequestDemoModal';

export default function LandingPage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const SNP_LIST = INITIAL_STANDARDS;

  const STATS = [
    { label: 'Indeks Capaian Mutu', val: '87.2%', desc: 'Predikat A (Unggul)', color: 'text-blue-400' },
    { label: 'Unit Kerja Terlibat', val: '18 Unit', desc: 'Evaluasi Mandiri Aktif', color: 'text-sky-400' },
    { label: 'Standar Pendidikan', val: '8 Standar', desc: 'Instrumen SNP Terpetakan', color: 'text-amber-400' },
    { label: 'Sertifikasi Kejuruan', val: '92.5%', desc: 'Uji Kompetensi LSP-P1', color: 'text-emerald-400' }
  ];

  const PPEPP_STEPS = [
    { step: '01', title: 'Penetapan', desc: 'Penyusunan standar mutu sekolah, indikator capaian, dan sasaran mutu tiap unit kerja.' },
    { step: '02', title: 'Pelaksanaan', desc: 'Penerapan standar dalam pembelajaran, praktik kejuruan, Teaching Factory, dan manajemen.' },
    { step: '03', title: 'Evaluasi', desc: 'Pengisian instrumen evaluasi mandiri oleh unit kerja disertai unggahan berkas bukti fisik.' },
    { step: '04', title: 'Pengendalian', desc: 'Verifikasi dokumen oleh auditor TPMPS untuk mengidentifikasi temuan dan ketidaksesuaian.' },
    { step: '05', title: 'Peningkatan', desc: 'Penyusunan Rencana Tindak Lanjut (RTL) untuk perbaikan mutu berkelanjutan.' }
  ];

  return (
    <div className="min-h-screen bg-[#0B0D13] text-slate-100 font-sans selection:bg-blue-600/30 selection:text-blue-400 relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-blue-600/10 via-sky-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* ------------------------------------------------------------------------
          MAIN HERO CARD CONTAINER (Matching Reference UI Exactly)
      ------------------------------------------------------------------------ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16 relative z-10">
        <div className="relative rounded-[28px] sm:rounded-[36px] bg-[#121418] border border-white/10 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] p-6 sm:p-10 lg:p-14 overflow-visible">
          
          {/* Floating 'Pro' Badge (Top Right) */}
          <div className="absolute -top-3.5 sm:-top-5 right-6 sm:right-10 z-30">
            <span className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-2xl bg-[#2375FF] hover:bg-blue-500 text-white font-black text-sm sm:text-base tracking-wide shadow-lg shadow-blue-500/40 select-none inline-flex items-center gap-1.5 transition-transform hover:scale-105 cursor-default">
              Pro
            </span>
          </div>

          {/* --------------------------------------------------------------------
              HEADER & NAVBAR INSIDE CARD
          -------------------------------------------------------------------- */}
          <header className="flex items-center justify-between gap-4 pb-8 sm:pb-12 border-b border-white/5">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600/15 border-2 border-[#2375FF] flex items-center justify-center text-[#2375FF] shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Archive className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">SINTESA</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-mono tracking-wider">
                  TPMPS
                </span>
              </div>
            </Link>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
              <a href="#beranda" className="text-white hover:text-[#2375FF] transition-colors">
                Home
              </a>
              <a href="#ppepp" className="hover:text-white transition-colors">
                How it works
              </a>
              <a href="#snp" className="hover:text-white transition-colors">
                FAQ
              </a>
              <a href="#fitur" className="hover:text-white transition-colors">
                Pricing
              </a>
            </nav>

            {/* Login button */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2 rounded-xl text-white text-xs font-bold border border-white/20 hover:border-white/50 hover:bg-white/5 transition-all shadow-sm"
              >
                Login
              </Link>
            </div>
          </header>

          {/* --------------------------------------------------------------------
              HERO GRID (Left: Typography & CTAs | Right: 3D Folder Illustration)
          -------------------------------------------------------------------- */}
          <div id="beranda" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center pt-8 sm:pt-12">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[52px] font-black text-white tracking-tight leading-[1.12]">
                Organize your files<br />
                and keep them safe,<br />
                everywhere!
              </h1>

              {/* Descriptions */}
              <div className="space-y-2 max-w-lg">
                <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
                  We offer secure storage, ensuring all your data is protected from unauthorized access.
                </p>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Sistem Penjaminan Mutu Internal (SPMI) SMK Negeri 2 Magelang berbasis siklus PPEPP & 8 Standar Nasional Pendidikan.
                </p>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-5 pt-3">
                <Link
                  href="/login"
                  className="px-7 py-3 rounded-xl bg-[#2324FE] hover:bg-blue-600 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  Get Started
                </Link>

                <button
                  onClick={() => setIsDemoOpen(true)}
                  className="inline-flex items-center gap-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer group py-2"
                >
                  <span className="w-0 h-0 border-y-5 border-y-transparent border-l-7 border-l-slate-300 group-hover:border-l-blue-400 transition-colors" />
                  <span>Request a demo</span>
                </button>
              </div>

              {/* Bottom Metrics Bar (3 Stats with Line Icons) */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-white/5 mt-4">
                <div>
                  <Users className="w-5 h-5 text-slate-400 mb-2 stroke-[1.5]" />
                  <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">18 Unit</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 font-medium">active users</div>
                </div>

                <div>
                  <Folder className="w-5 h-5 text-slate-400 mb-2 stroke-[1.5]" />
                  <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">8 Standar</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 font-medium">files stored</div>
                </div>

                <div>
                  <Cloud className="w-5 h-5 text-slate-400 mb-2 stroke-[1.5]" />
                  <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">87.2%</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 font-medium">uploaded files</div>
                </div>
              </div>
            </div>

            {/* Right Column: The 3D Electric Blue Folder Illustration */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
              <FolderHeroGraphic />
            </div>

          </div>
        </div>

        {/* --------------------------------------------------------------------
            INSTITUTIONAL RECOGNITION STRIP
        -------------------------------------------------------------------- */}
        <div className="mt-8 px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">Terakreditasi A (Unggul)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-slate-300">LSP-P1 Berlisensi BNSP</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-300">SMK Pusat Keunggulan</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-300">18 Unit Kerja Terhubung</span>
          </div>
        </div>

        {/* --------------------------------------------------------------------
            SECTION: 4 KPI CARDS
        -------------------------------------------------------------------- */}
        <section className="mt-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STATS.map((s, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#121418] border border-white/10 hover:border-blue-500/40 transition-all hover:shadow-xl hover:shadow-blue-500/5 group"
              >
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block">
                  {s.label}
                </span>
                <div className={`text-3xl sm:text-4xl font-black font-mono mt-1 ${s.color}`}>
                  {s.val}
                </div>
                <p className="text-xs font-semibold text-slate-400 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------------------------
            SECTION: SIKLUS MUTU PPEPP
        -------------------------------------------------------------------- */}
        <section id="ppepp" className="mt-20 scroll-mt-10">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-[#2375FF]">
              Siklus Mutu Berkelanjutan
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Siklus Mutu PPEPP
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Alur kerja terstruktur untuk memastikan standar mutu sekolah dilaksanakan, dievaluasi, dan ditingkatkan secara berkesinambungan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PPEPP_STEPS.map((s) => (
              <div
                key={s.step}
                className="p-6 rounded-2xl bg-[#121418] border border-white/10 hover:border-blue-500/40 transition-all hover:shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#2324FE] text-white text-sm font-black font-mono shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
                      {s.step}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                      Tahap
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{s.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------------------------
            SECTION: 8 STANDAR NASIONAL PENDIDIKAN (SNP)
        -------------------------------------------------------------------- */}
        <section id="snp" className="mt-20 scroll-mt-10">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-[#2375FF]">
              8 Standar Nasional Pendidikan
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Pemantauan Berkelanjutan 8 SNP
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Masing-masing standar memiliki bobot persentase terukur dan terhubung langsung ke dokumen bukti fisik dari unit kerja pelaksana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {SNP_LIST.map((snp) => (
              <div
                key={snp.id}
                className="p-6 rounded-2xl bg-[#121418] border border-white/10 hover:border-blue-500/40 transition-all hover:shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 font-mono text-xs font-bold text-blue-400">
                      {snp.code}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      Bobot: {snp.weight}%
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                    {snp.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {snp.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                    <span className="text-slate-400">Realisasi Capaian:</span>
                    <span className="font-bold text-blue-400">{snp.currentScore.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full"
                      style={{ width: `${snp.currentScore}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------------------------
            SECTION: FITUR UTAMA SISTEM
        -------------------------------------------------------------------- */}
        <section id="fitur" className="mt-20 scroll-mt-10">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-[#2375FF]">
              Kemudahan Pengelolaan
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Fitur Utama Sistem
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Dirancang untuk mempermudah tugas penjaminan mutu di sekolah tanpa kerumitan administrasi manual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-[#121418] border border-white/10 hover:border-blue-500/40 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                <FolderArchive className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Bank Dokumen Digital</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Penyimpanan terpusat untuk SK, modul ajar, instrumen asesmen, berkas MoU industri, dan dokumentasi sarana prasarana.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#121418] border border-white/10 hover:border-blue-500/40 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Verifikasi Bertingkat</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Alur verifikasi yang rapi: pengisian oleh unit kerja, peninjauan oleh tim TPMPS, dan persetujuan oleh Kepala Sekolah.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#121418] border border-white/10 hover:border-blue-500/40 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Rencana Tindak Lanjut (RTL)</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Setiap indikator yang memerlukan perhatian langsung memiliki rencana tindak lanjut terukur beserta target waktu dan alokasi dana.
              </p>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------------------
            CALL TO ACTION SECTION
        -------------------------------------------------------------------- */}
        <section className="mt-20">
          <div className="relative rounded-[32px] bg-gradient-to-b from-[#161820] to-[#0E1015] border border-white/10 p-8 sm:p-14 text-center space-y-6 overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/5 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <Image
                src="/logo.png"
                alt="Logo SMK Negeri 2 Magelang"
                width={76}
                height={76}
                className="w-18 h-18 object-contain mx-auto drop-shadow-md"
                priority
                unoptimized
              />

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                SMK Negeri 2 Magelang
              </h2>

              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Mewujudkan lulusan vokasi yang kompeten, berkarakter, dan berdaya saing global melalui penjaminan mutu pendidikan yang konsisten.
              </p>

              <div className="flex items-center justify-center pt-2">
                <Link
                  href="/login"
                  className="px-8 py-3.5 rounded-2xl bg-[#2324FE] hover:bg-blue-600 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Sistem</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ------------------------------------------------------------------------
          FOOTER (Dark Modern Design)
      ------------------------------------------------------------------------ */}
      <footer className="border-t border-white/5 bg-[#0A0C10] py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" unoptimized />
              <span className="text-sm font-black text-white">SINTESA TPMPS</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Sistem Informasi Manajemen Penjaminan Mutu Pendidikan Sekolah SMK Negeri 2 Magelang.
            </p>
            <span className="text-[11px] font-bold text-amber-400 block font-mono">
              MOTTO: SWADAYA BHINA RAHARJA
            </span>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Tautan Sistem</h4>
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard Mutu</Link></li>
              <li><Link href="/drive" className="hover:text-blue-400 transition-colors">Google Drive Unit</Link></li>
              <li><Link href="/evaluasi" className="hover:text-blue-400 transition-colors">Evaluasi Mandiri</Link></li>
              <li><Link href="/dokumen" className="hover:text-blue-400 transition-colors">Bank Dokumen</Link></li>
              <li><Link href="/rtl" className="hover:text-blue-400 transition-colors">Rencana Tindak Lanjut</Link></li>
              <li><Link href="/laporan" className="hover:text-blue-400 transition-colors">Laporan Mutu</Link></li>
              <li><Link href="/panduan-akses" className="hover:text-blue-400 transition-colors">Panduan & Akun Unit</Link></li>
              <li><Link href="/ppt" className="hover:text-blue-400 transition-colors">Presentasi PPT Mutu</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Standar Pendidikan</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Kompetensi Lulusan (SKL)</li>
              <li>• Isi & Kurikulum</li>
              <li>• Proses Pembelajaran</li>
              <li>• Penilaian Pendidikan</li>
              <li>• Pendidik & Tenaga Kependidikan</li>
              <li>• Sarana & Prasarana</li>
              <li>• Pengelolaan Pendidikan</li>
              <li>• Pembiayaan Pendidikan</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Alamat Sekolah</h4>
            <p className="text-slate-400 leading-relaxed">
              SMK Negeri 2 Magelang<br />
              Jl. Perintis Kemerdekaan No. 9, Kota Magelang, Jawa Tengah 56115<br />
              Telepon: (0293) 362577<br />
              Email: info@smkn2magelang.sch.id
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-center sm:text-left">
          <span>&copy; {new Date().getFullYear()} Tim Penjamin Mutu (TPMPS) SMK Negeri 2 Magelang.</span>
          <span>Sistem Penjaminan Mutu Internal (SPMI)</span>
        </div>
      </footer>

      {/* Interactive Request Demo / Exploration Modal */}
      <RequestDemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
}
