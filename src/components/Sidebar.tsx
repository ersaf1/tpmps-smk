'use client';

import React from 'react';
import { UserRole } from '@/types/tpmps';
import {
  LayoutDashboard,
  CheckSquare,
  FileCheck,
  FolderArchive,
  Target,
  FileSpreadsheet,
  History,
  Users2,
  X,
  Sparkles,
  Network
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'indikator'
  | 'evaluasi'
  | 'dokumen'
  | 'program_rtl'
  | 'laporan'
  | 'relasi'
  | 'audit_log'
  | 'user_management';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  counts: {
    evaluasiReview: number;
    dokumenPending: number;
    rtlAktif: number;
  };
}

export default function Sidebar({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  userRole,
  counts
}: SidebarProps) {
  const menuItems: {
    id: TabType;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
    allowedRoles?: UserRole[];
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard Mutu',
      icon: LayoutDashboard,
      allowedRoles: ['kepala_sekolah', 'ketua_tpmps', 'anggota_tpmps', 'unit_kerja', 'admin']
    },
    {
      id: 'indikator',
      label: '8 Standar & Indikator',
      icon: CheckSquare
    },
    {
      id: 'evaluasi',
      label: 'Evaluasi & Penilaian',
      icon: FileCheck,
      badge: counts.evaluasiReview > 0 ? counts.evaluasiReview : undefined,
      badgeColor: 'bg-amber-500 text-white',
      allowedRoles: ['kepala_sekolah', 'ketua_tpmps', 'anggota_tpmps', 'unit_kerja', 'admin']
    },
    {
      id: 'dokumen',
      label: 'Bank Bukti Dokumen',
      icon: FolderArchive,
      badge: counts.dokumenPending > 0 ? counts.dokumenPending : undefined,
      badgeColor: 'bg-blue-600 text-white'
    },
    {
      id: 'program_rtl',
      label: 'Monitoring RTL Mutu',
      icon: Target,
      badge: counts.rtlAktif > 0 ? counts.rtlAktif : undefined,
      badgeColor: 'bg-emerald-600 text-white',
      allowedRoles: ['kepala_sekolah', 'ketua_tpmps', 'anggota_tpmps', 'unit_kerja', 'admin']
    },
    {
      id: 'laporan',
      label: 'Laporan Mutu & EDS',
      icon: FileSpreadsheet,
      allowedRoles: ['kepala_sekolah', 'ketua_tpmps', 'anggota_tpmps', 'unit_kerja', 'admin']
    },
    {
      id: 'relasi',
      label: 'Skema Relasi Data (ERD)',
      icon: Network
    },
    {
      id: 'audit_log',
      label: 'Audit Trail / Log',
      icon: History,
      allowedRoles: ['kepala_sekolah', 'ketua_tpmps', 'anggota_tpmps', 'admin']
    },
    {
      id: 'user_management',
      label: '18 Unit & Akun',
      icon: Users2,
      allowedRoles: ['kepala_sekolah', 'ketua_tpmps', 'admin']
    }
  ];

  // Filter items based on active role
  const visibleItems = menuItems.filter(
    (item) => !item.allowedRoles || item.allowedRoles.includes(userRole)
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar container (Pure Clean Light Enterprise Theme) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white text-slate-700 border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 shadow-sm ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
              TP
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-base tracking-wider block">
                SIGMA-TPMPS
              </span>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block -mt-0.5">
                SMK Penjamin Mutu
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Utama
          </div>
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${
                      item.badgeColor || 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Siklus PPEPP Card (Bright & Clean) */}
        <div className="p-3 border-t border-slate-100">
          <div className="p-3 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 rounded-xl border border-blue-100/90 shadow-xs">
            <div className="flex items-center gap-1.5 text-blue-700 font-bold text-[11px] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Siklus Penjaminan Mutu</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              <strong>PPEPP:</strong> Penetapan • Pelaksanaan • Evaluasi • Pengendalian • Peningkatan
            </p>
            <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-blue-200/50">
              <span>Siklus I: 2025/2026</span>
              <span className="text-emerald-700 font-bold bg-emerald-100/80 px-1.5 py-0.2 rounded">
                Aktif
              </span>
            </div>
          </div>
        </div>

        {/* User Info footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60">
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Versi Sistem</span>
            <span className="font-mono text-slate-700 font-semibold">v1.0.4-SMK</span>
          </div>
        </div>
      </aside>
    </>
  );
}
