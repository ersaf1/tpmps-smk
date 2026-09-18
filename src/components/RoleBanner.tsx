'use client';

import React from 'react';
import { UserRole } from '@/types/tpmps';
import { Shield, CheckCircle2, UserCheck, Eye, Sparkles } from 'lucide-react';

interface RoleBannerProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const ROLE_DETAILS: Record<
  UserRole,
  {
    title: string;
    badge: string;
    color: string;
    description: string;
    permissions: string[];
  }
> = {
  kepala_sekolah: {
    title: 'Kepala Sekolah',
    badge: 'Executive',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'Akses eksekutif read-only seluruh 18 unit kerja, memantau capaian 8 SNP, KPI sekolah, dan review persetujuan laporan akhir.',
    permissions: ['Dashboard Mutu Agregat', 'Review Capaian 18 Unit', 'Download Laporan EDS', 'Audit Log Mutu']
  },
  ketua_tpmps: {
    title: 'Ketua TPMPS',
    badge: 'Quality Lead',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Akses penuh siklus PPEPP, validasi & verifikasi evaluasi unit, persetujuan bukti dokumen, dan manajemen RTL program mutu.',
    permissions: ['Validasi & Approval Mutu', 'Konfigurasi 8 SNP', 'Kelola Program Mutu (RTL)', 'Rapat Tinjauan Manajemen']
  },
  anggota_tpmps: {
    title: 'Anggota TPMPS / Auditor',
    badge: 'Auditor Internal',
    color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    description: 'Mengumpulkan & menganalisis data 18 unit, verifikasi berkas bukti fisik, dan menyusun draft rekomendasi perbaikan mutu.',
    permissions: ['Verifikasi Berkas Dokumen', 'Draft Rekomendasi Audit', 'Monitoring RTL', 'Analisis Data SNP']
  },
  unit_kerja: {
    title: 'WKS / Unit Kerja (Kurikulum)',
    badge: 'Unit Kerja',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Menginput data evaluasi mandiri scoped ke unit sendiri, mengunggah dokumen bukti pendukung, dan menindaklanjuti RTL.',
    permissions: ['Input Penilaian Mandiri', 'Unggah Bukti Dokumen', 'Lihat Status Approval', 'Progres RTL Unit']
  },
  guru: {
    title: 'Guru & Tenaga Pendidik',
    badge: 'Tenaga Pendidik',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'Mengunggah bukti pendukung pembelajaran (Modul ajar, bukti asesmen, portofolio siswa) tanpa akses dashboard manajerial.',
    permissions: ['Unggah Bukti Dokumen', 'Lihat Panduan Mutu', 'Riwayat Berkas']
  },
  admin: {
    title: 'Admin Sistem',
    badge: 'Super Admin',
    color: 'bg-rose-100 text-rose-800 border-rose-200',
    description: 'Manajemen pengguna, pengaturan hak akses, penyesuaian bobot indikator mutu, dan pemeliharaan jejak audit.',
    permissions: ['Manajemen 18 Unit & Akun', 'Pengaturan Bobot 8 SNP', 'Audit Trail Lengkap', 'Konfigurasi Sistem']
  }
};

export default function RoleBanner({ currentRole, onRoleChange }: RoleBannerProps) {
  const currentDetail = ROLE_DETAILS[currentRole];

  return (
    <div className="bg-white text-slate-900 p-5 rounded-2xl shadow-xs mb-6 border border-slate-200/90 relative overflow-hidden">
      {/* Soft pastel light background accent */}
      <div className="absolute -right-10 -top-10 w-52 h-52 bg-blue-50/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-40 -bottom-10 w-40 h-40 bg-indigo-50/70 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Current Role Info */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-600 shadow-xs">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Simulasi Peran RBAC (Role-Based Access)
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${currentDetail.color}`}>
                {currentDetail.badge}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
              <span>{currentDetail.title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
              {currentDetail.description}
            </p>
          </div>
        </div>

        {/* Right Side: Quick Role Switcher Buttons */}
        <div className="flex flex-col sm:items-end gap-2 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            Beralih perspektif peran:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(ROLE_DETAILS) as UserRole[]).map((roleKey) => {
              const info = ROLE_DETAILS[roleKey];
              const isActive = currentRole === roleKey;
              return (
                <button
                  key={roleKey}
                  onClick={() => onRoleChange(roleKey)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/80'
                  }`}
                  title={info.description}
                >
                  {isActive && <CheckCircle2 className="w-3 h-3 text-white" />}
                  {info.title.split(' ')[0]} {roleKey === 'ketua_tpmps' ? 'TPMPS' : roleKey === 'unit_kerja' ? '(WKS)' : ''}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Allowed permissions pills */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs text-slate-600">
        <span className="font-bold text-slate-700 flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-blue-600" />
          Izin Akses Aktif:
        </span>
        {currentDetail.permissions.map((perm, idx) => (
          <span
            key={idx}
            className="bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-md text-[11px] font-medium"
          >
            ✓ {perm}
          </span>
        ))}
      </div>
    </div>
  );
}
