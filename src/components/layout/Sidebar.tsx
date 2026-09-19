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
  BarChart3,
  Target,
  FolderArchive,
  UploadCloud,
  CheckCircle,
  FileSpreadsheet,
  PieChart,
  Download,
  LogOut,
  X,
  ChevronRight
} from 'lucide-react';
import { UserProfile, ROLE_DEFINITIONS } from '@/types/sigma';
import { sigmaService } from '@/lib/services/sigmaDataService';

interface SidebarProps {
  user: UserProfile;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  reviewCount?: number;
  validatingDocCount?: number;
  rtlActiveCount?: number;
}

export default function Sidebar({
  user,
  isOpenMobile,
  onCloseMobile,
  reviewCount = 2,
  validatingDocCount = 1,
  rtlActiveCount = 3
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const roleConfig = ROLE_DEFINITIONS[user.role];

  const handleLogout = () => {
    sigmaService.logout();
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
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Persistent Left Sidebar for Desktop, Drawer for Mobile */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#06162E] border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header Brand */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-white/10 bg-[#050816]/60">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#06162E] to-[#0077B6] p-1.5 border border-[#22D3EE]/30 shadow-[0_0_15px_rgba(34,211,238,0.2)] flex items-center justify-center shrink-0">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" priority />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-[#F8FAFC] tracking-tight">SIGMA</span>
                <span className="text-base font-black text-[#22D3EE] tracking-tight">TPMPS</span>
              </div>
              <div className="text-[10px] font-semibold text-[#F6B73C] tracking-wider uppercase">
                SMK N 2 MAGELANG
              </div>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden text-[#94A3B8] hover:text-[#F8FAFC] p-1 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {/* Main Dashboard */}
          <div>
            <Link
              href="/dashboard"
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                isActive('/dashboard')
                  ? 'bg-gradient-to-r from-[#0077B6]/40 to-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40 shadow-[0_0_16px_rgba(34,211,238,0.15)]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className={`w-4 h-4 ${isActive('/dashboard') ? 'text-[#22D3EE]' : 'text-[#94A3B8] group-hover:text-[#22D3EE]'}`} />
                <span>Dashboard Mutu</span>
              </div>
              {isActive('/dashboard') && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
              )}
            </Link>
          </div>

          {/* 8 Standar Mutu Pendidikan */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              <span>8 Standar Mutu (SNP)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[#22D3EE]">8</span>
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
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'bg-[#0077B6]/30 text-[#22D3EE] border border-[#22D3EE]/30 font-semibold'
                        : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-[#22D3EE]' : 'text-[#94A3B8]'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <span className="text-[9px] font-mono text-[#94A3B8] shrink-0 opacity-75">
                      {item.code}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Evaluasi Mutu & Tindak Lanjut */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Evaluasi & Rapor
            </div>
            <div className="space-y-1">
              <Link
                href="/evaluasi"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive('/evaluasi')
                    ? 'bg-[#0077B6]/30 text-[#22D3EE] border border-[#22D3EE]/30 font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-4 h-4 text-[#22D3EE]" />
                  <span>Evaluasi Mutu</span>
                </div>
                {reviewCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F28C28]/20 text-[#F28C28] border border-[#F28C28]/40 font-bold">
                    {reviewCount} Review
                  </span>
                )}
              </Link>

              <Link
                href="/rtl"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive('/rtl')
                    ? 'bg-[#0077B6]/30 text-[#22D3EE] border border-[#22D3EE]/30 font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Target className="w-4 h-4 text-[#22D3EE]" />
                  <span>RTL (Tindak Lanjut)</span>
                </div>
                {rtlActiveCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                    {rtlActiveCount} Aktif
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Dokumen & Bank Bukti */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Dokumen Mutu
            </div>
            <div className="space-y-1">
              <Link
                href="/dokumen"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive('/dokumen') && pathname === '/dokumen'
                    ? 'bg-[#0077B6]/30 text-[#22D3EE] border border-[#22D3EE]/30 font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderArchive className="w-4 h-4 text-[#22D3EE]" />
                  <span>Bank Bukti</span>
                </div>
              </Link>

              <Link
                href="/dokumen/upload"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive('/dokumen/upload')
                    ? 'bg-[#0077B6]/30 text-[#22D3EE] border border-[#22D3EE]/30 font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UploadCloud className="w-4 h-4 text-[#22D3EE]" />
                  <span>Upload Dokumen</span>
                </div>
              </Link>

              <Link
                href="/dokumen/validasi"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive('/dokumen/validasi')
                    ? 'bg-[#0077B6]/30 text-[#22D3EE] border border-[#22D3EE]/30 font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#22D3EE]" />
                  <span>Validasi Dokumen</span>
                </div>
                {validatingDocCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F28C28]/20 text-[#F28C28] border border-[#F28C28]/40 font-bold">
                    {validatingDocCount} Baru
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Laporan & Analitik */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Laporan Mutu
            </div>
            <div className="space-y-1">
              <Link
                href="/laporan"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive('/laporan')
                    ? 'bg-[#0077B6]/30 text-[#22D3EE] border border-[#22D3EE]/30 font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-[#22D3EE]" />
                  <span>Statistik & Rapor EDS</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Persistent User Profile & Logout (Database Authenticated, NO role switch) */}
        <div className="p-3.5 border-t border-white/10 bg-[#050816]/70">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0077B6] to-[#22D3EE] p-0.5 shadow-[0_0_12px_rgba(34,211,238,0.4)] shrink-0 flex items-center justify-center font-bold text-xs text-white">
                {user.fullName.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#F8FAFC] truncate">
                  {user.fullName}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border ${roleConfig.badgeBg} ${roleConfig.badgeBorder} ${roleConfig.badgeText}`}>
                    {roleConfig.badge}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Keluar dari sesi"
              className="p-2 rounded-xl text-[#94A3B8] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
