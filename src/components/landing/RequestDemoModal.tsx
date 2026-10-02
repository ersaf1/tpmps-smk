'use client';

import React from 'react';
import Link from 'next/link';
import { X, CheckCircle2, ShieldCheck, HardDrive, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface RequestDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestDemoModal({ isOpen, onClose }: RequestDemoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0077B6]">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0077B6] font-mono">Panduan Akses &amp; Ekosistem</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                SINTESA TPMPS
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Sistem Penjaminan Mutu Internal SMK Negeri 2 Magelang
            </h3>
          </div>
        </div>

        {/* Body content */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          SINTESA (Sistem Informasi Manajemen Penjaminan Mutu Pendidikan Sekolah) dirancang untuk mengintegrasikan bukti fisik digital dari <strong className="text-slate-900">18 Unit Kerja</strong> dengan siklus mutu <strong className="text-[#0077B6]">PPEPP</strong> dan <strong className="text-slate-900">8 Standar Nasional Pendidikan (SNP)</strong>.
        </p>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
            <Layers className="w-5 h-5 text-[#0077B6] mb-2" />
            <div className="text-xs sm:text-sm font-bold text-slate-900 mb-1">18 Unit Kerja</div>
            <div className="text-[11px] text-slate-600 leading-relaxed">
              Repositori folder khusus tiap unit pelaksana pendidikan.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200">
            <ShieldCheck className="w-5 h-5 text-orange-600 mb-2" />
            <div className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Siklus PPEPP</div>
            <div className="text-[11px] text-slate-600 leading-relaxed">
              Penetapan, Pelaksanaan, Evaluasi, Pengendalian, &amp; Peningkatan.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <BookOpen className="w-5 h-5 text-amber-700 mb-2" />
            <div className="text-xs sm:text-sm font-bold text-slate-900 mb-1">8 Standar SNP</div>
            <div className="text-[11px] text-slate-600 leading-relaxed">
              Pemetaan indikator mutu dengan skor capaian terverifikasi.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <Link
            href="/panduan-akses"
            onClick={onClose}
            className="text-xs font-semibold text-[#0077B6] hover:underline flex items-center gap-1.5"
          >
            <span>Lihat Panduan &amp; Kredensial Akun Lengkap &rarr;</span>
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Tutup
            </button>
            <Link
              href="/login"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] hover:brightness-105 text-white text-xs font-bold shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
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
