'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Award,
  BookOpen,
  Activity,
  CheckSquare,
  Users,
  Building2,
  Layers,
  BadgePercent,
  FileCheck2,
  Target,
  FolderArchive,
  UploadCloud,
  CheckCircle,
  FileSpreadsheet,
  LogOut,
  X,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { UserProfile, ROLE_DEFINITIONS } from '@/types/sintesa';
import { sintesaService } from '@/lib/services/sintesaDataService';

interface SidebarProps {
  user: UserProfile;
  isOpenMobile: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  reviewCount?: number;
  validatingDocCount?: number;
  rtlActiveCount?: number;
}

export default function Sidebar({
  user,
  isOpenMobile,
  isCollapsed,
  onToggleCollapse,
  onCloseMobile,
  reviewCount = 2,
  validatingDocCount = 1,
  rtlActiveCount = 3
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const roleConfig = ROLE_DEFINITIONS[user.role];

  const handleLogout = () => {
    sintesaService.logout();
    router.push('/login');
    router.refresh();
  };

  const STANDARDS_MENU = [
    { href: '/mutu/1', label: 'SKL (Kompetensi Lulusan)', code: 'SNP-1', icon: Award },
    { href: '/mutu/2', label: 'Standar Isi', code: 'SNP-2', icon: BookOpen },
    { href: '/mutu/3', label: 'Standar Proses', code: 'SNP-3', icon: Activity },
    { href: '/mutu/4', label: 'Standar Penilaian', code: 'SNP-4', icon: CheckSquare },
    { href: '/mutu/5', label: 'Standar PTK (Pendidik)', code: 'SNP-5', icon: Users },
    { href: '/mutu/6', label: 'Standar Sarpras', code: 'SNP-6', icon: Building2 },
    { href: '/mutu/7', label: 'Standar Pengelolaan', code: 'SNP-7', icon: Layers },
    { href: '/mutu/8', label: 'Standar Pembiayaan', code: 'SNP-8', icon: BadgePercent }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') return true;
    if (path !== '/dashboard' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Persistent Left Sidebar (Clean White & Blue) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 ${isCollapsed ? 'lg:w-20' : 'w-72'} bg-white border-r border-slate-200 flex flex-col shadow-xs transition-[width,transform] duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header Brand */}
        <div className={`h-20 px-5 flex items-center ${isCollapsed ? 'lg:justify-center' : 'justify-between'} border-b border-slate-200 bg-white`}>
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <Image src="/logo.png" alt="Logo SMK" width={44} height={44} className="w-11 h-11 object-contain shrink-0 group-hover:scale-105 transition-transform" priority unoptimized />
            <div className={isCollapsed ? 'lg:hidden' : ''}>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-slate-900 tracking-tight">SINTESA</span>
                <span className="text-base font-black text-[#0077B6] tracking-tight">TPMPS</span>
              </div>
              <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                SMK N 2 MAGELANG
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:inline-flex p-2 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            title={isCollapsed ? 'Buka sidebar' : 'Tutup sidebar'}
            aria-label={isCollapsed ? 'Buka sidebar' : 'Tutup sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Scrollable Area */}
        <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'lg:px-2' : 'px-3.5'} py-4 space-y-6`}>
          {/* Main Dashboard */}
          <div>
            <Link
              href="/dashboard"
              onClick={onCloseMobile}
              className={`flex items-center ${isCollapsed ? 'lg:justify-center lg:px-2' : 'justify-between px-3.5'} py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive('/dashboard')
                  ? 'bg-blue-50 text-[#0077B6] border border-blue-200 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className={`w-4 h-4 ${isActive('/dashboard') ? 'text-[#0077B6]' : 'text-slate-500'}`} />
                <span className={isCollapsed ? 'lg:hidden' : ''}>Dashboard Mutu</span>
              </div>
            </Link>
          </div>

          {/* 8 Standar Mutu Pendidikan */}
          <div>
            <div className={`px-3 mb-2 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider ${isCollapsed ? 'lg:hidden' : ''}`}>
              <span>8 Standar Mutu (SNP)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-[#0077B6] font-bold">8</span>
            </div>
            <div className="space-y-1">
              {STANDARDS_MENU.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.code}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center ${isCollapsed ? 'lg:justify-center lg:px-2' : 'justify-between px-3'} py-2 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'bg-blue-50 text-[#0077B6] border border-blue-200 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-[#0077B6]' : 'text-slate-400'}`} />
                      <span className={`truncate ${isCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                    </div>
                    <span className={`text-[9px] font-mono text-slate-400 shrink-0 ${isCollapsed ? 'lg:hidden' : ''}`}>
                      {item.code}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Evaluasi Mutu & Tindak Lanjut */}
          <div>
            <div className={`px-3 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider ${isCollapsed ? 'lg:hidden' : ''}`}>
              Evaluasi & Rapor
            </div>
            <div className="space-y-1">
              <Link
                href="/evaluasi"
                onClick={onCloseMobile}
                className={`flex items-center ${isCollapsed ? 'lg:justify-center lg:px-2' : 'justify-between px-3.5'} py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive('/evaluasi')
                    ? 'bg-blue-50 text-[#0077B6] border border-blue-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className={`w-4 h-4 ${isActive('/evaluasi') ? 'text-[#0077B6]' : 'text-slate-500'}`} />
                  <span className={isCollapsed ? 'lg:hidden' : ''}>Evaluasi Mutu</span>
                </div>
                {reviewCount > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-bold ${isCollapsed ? 'lg:hidden' : ''}`}>
                    {reviewCount} Review
                  </span>
                )}
              </Link>

              <Link
                href="/rtl"
                onClick={onCloseMobile}
                className={`flex items-center ${isCollapsed ? 'lg:justify-center lg:px-2' : 'justify-between px-3.5'} py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive('/rtl')
                    ? 'bg-blue-50 text-[#0077B6] border border-blue-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Target className={`w-4 h-4 ${isActive('/rtl') ? 'text-[#0077B6]' : 'text-slate-500'}`} />
                  <span className={isCollapsed ? 'lg:hidden' : ''}>RTL (Tindak Lanjut)</span>
                </div>
                {rtlActiveCount > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold ${isCollapsed ? 'lg:hidden' : ''}`}>
                    {rtlActiveCount} Aktif
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Dokumen & Bank Bukti */}
          <div>
            <div className={`px-3 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider ${isCollapsed ? 'lg:hidden' : ''}`}>
              Dokumen Mutu
            </div>
            <div className="space-y-1">
              <Link
                href="/dokumen"
                onClick={onCloseMobile}
                className={`flex items-center ${isCollapsed ? 'lg:justify-center lg:px-2' : 'justify-between px-3.5'} py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive('/dokumen') && pathname === '/dokumen'
                    ? 'bg-blue-50 text-[#0077B6] border border-blue-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderArchive className="w-4 h-4 text-slate-500" />
                  <span className={isCollapsed ? 'lg:hidden' : ''}>Bank Dokumen</span>
                </div>
              </Link>

              <Link
                href="/dokumen/upload"
                onClick={onCloseMobile}
                className={`flex items-center ${isCollapsed ? 'lg:justify-center lg:px-2' : 'justify-between px-3.5'} py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive('/dokumen/upload')
                    ? 'bg-blue-50 text-[#0077B6] border border-blue-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UploadCloud className="w-4 h-4 text-slate-500" />
                  <span className={isCollapsed ? 'lg:hidden' : ''}>Upload Dokumen</span>
                </div>
              </Link>

              <Link
                href="/dokumen/validasi"
                onClick={onCloseMobile}
                className={`flex items-center ${isCollapsed ? 'lg:justify-center lg:px-2' : 'justify-between px-3.5'} py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive('/dokumen/validasi')
                    ? 'bg-blue-50 text-[#0077B6] border border-blue-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-slate-500" />
                  <span className={isCollapsed ? 'lg:hidden' : ''}>Validasi Dokumen</span>
                </div>
                {validatingDocCount > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-bold ${isCollapsed ? 'lg:hidden' : ''}`}>
                    {validatingDocCount} Baru
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Laporan & Analitik */}
          <div>
            <div className={`px-3 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider ${isCollapsed ? 'lg:hidden' : ''}`}>
              Laporan Mutu
            </div>
            <div className="space-y-1">
              <Link
                href="/laporan"
                onClick={onCloseMobile}
                className={`flex items-center ${isCollapsed ? 'lg:justify-center lg:px-2' : 'justify-between px-3.5'} py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive('/laporan')
                    ? 'bg-blue-50 text-[#0077B6] border border-blue-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-slate-500" />
                  <span className={isCollapsed ? 'lg:hidden' : ''}>Laporan EDS</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Persistent User Profile & Logout (Clean White/Slate) */}
        <div className={`p-3.5 border-t border-slate-200 bg-slate-50 ${isCollapsed ? 'lg:p-2' : ''}`}>
          <div className={`p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center ${isCollapsed ? 'lg:justify-center lg:p-2' : 'justify-between'} gap-3`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0077B6] to-[#0284C7] p-0.5 shadow-xs shrink-0 flex items-center justify-center font-bold text-xs text-white">
                {user.fullName.substring(0, 2).toUpperCase()}
              </div>
              <div className={`min-w-0 ${isCollapsed ? 'lg:hidden' : ''}`}>
                <div className="text-xs font-bold text-slate-900 truncate">
                  {user.fullName}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-blue-50 text-[#0077B6] border border-blue-200">
                    {roleConfig.badge}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Keluar dari sesi"
              className={`p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0 ${isCollapsed ? 'lg:hidden' : ''}`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
