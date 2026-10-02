'use client';

import React from 'react';
import Link from 'next/link';
import { X, CheckCircle2, ShieldCheck, FolderGit2, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface RequestDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestDemoModal({ isOpen, onClose }: RequestDemoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#121418] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/20 blur-3xl rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">Demo Eksplorasi</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                SINTESA TPMPS
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Sistem Penjaminan Mutu Internal SMK Negeri 2 Magelang
            </h3>
          </div>
        </div>

        {/* Body content */}
        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          SINTESA (Sistem Informasi Manajemen Penjaminan Mutu Pendidikan Sekolah) dirancang untuk mengintegrasikan bukti fisik digital dari <strong className="text-white">18 Unit Kerja</strong> dengan siklus mutu <strong className="text-blue-400">PPEPP</strong> dan <strong className="text-white">8 Standar Nasional Pendidikan (SNP)</strong>.
        </p>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <Layers className="w-5 h-5 text-blue-400 mb-2" />
            <div className="text-sm font-bold text-white mb-1">18 Unit Kerja</div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Mulai dari Manajemen Mutu, Kurikulum, BKK, hingga seluruh Konsentrasi Keahlian.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
            <div className="text-sm font-bold text-white mb-1">Siklus PPEPP</div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Penetapan, Pelaksanaan, Evaluasi, Pengendalian, dan Peningkatan berkelanjutan.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <BookOpen className="w-5 h-5 text-amber-400 mb-2" />
            <div className="text-sm font-bold text-white mb-1">8 Standar SNP</div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Pemetaan indikator mutu dengan skor capaian dan verifikasi auditor TPMPS.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <Link
            href="/panduan-akses"
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-white underline underline-offset-4 flex items-center gap-1.5"
          >
            <span>Lihat Panduan & Kredensial Akun</span>
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all"
            >
              Tutup
            </button>
            <Link
              href="/login"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <span>Masuk ke Sistem</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
