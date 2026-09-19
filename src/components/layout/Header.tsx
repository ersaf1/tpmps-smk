'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  Calendar,
  Sparkles,
  ExternalLink,
  Shield
} from 'lucide-react';
import { UserProfile, ROLE_DEFINITIONS } from '@/types/sigma';
import { sigmaService } from '@/lib/services/sigmaDataService';

interface HeaderProps {
  user: UserProfile;
  onOpenMobileSidebar: () => void;
  title?: string;
  subtitle?: string;
}

export default function Header({
  user,
  onOpenMobileSidebar,
  title = 'Sistem Penjaminan Mutu',
  subtitle
}: HeaderProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const roleConfig = ROLE_DEFINITIONS[user.role];

  const NOTIFICATIONS = [
    {
      id: 'notif-1',
      title: 'Verifikasi Dokumen Diperlukan',
      desc: 'WKS Kurikulum mengunggah Dokumen KOSP 2025.',
      time: '15 menit lalu',
      unread: true,
      href: '/dokumen/validasi'
    },
    {
      id: 'notif-2',
      title: 'Evaluasi Mutu Diajukan',
      desc: 'Program PPLG mengajukan evaluasi mandiri TEFA.',
      time: '1 jam lalu',
      unread: true,
      href: '/evaluasi'
    },
    {
      id: 'notif-3',
      title: 'Pembaruan Progres RTL',
      desc: 'Peremajaan workstation Lab RPL mencapai 40%.',
      time: '2 jam lalu',
      unread: false,
      href: '/rtl'
    }
  ];

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/evaluasi?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#06162E]/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile trigger & Page title */}
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-[#F8FAFC] tracking-tight truncate">
              {title}
            </h1>
            <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0077B6]/25 border border-[#22D3EE]/30 text-[#22D3EE]">
              TA 2025/2026
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-[#94A3B8] hidden sm:block truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Center: Realtime Global Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Cari indikator, unit kerja, kode SNP, atau dokumen (Tekan Enter)..."
            className="w-full h-10 pl-10 pr-12 rounded-xl bg-[#0E1726]/90 border border-white/10 hover:border-cyan-500/30 focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/20 text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 transition-all outline-hidden"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-[#94A3B8]">
              ↵
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Notification & Profile Avatar with glowing halo */}
      <div className="flex items-center gap-3">
        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#22D3EE]/40 text-[#94A3B8] hover:text-[#F8FAFC] transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl glass-dropdown border border-[#22D3EE]/30 p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                    Pemberitahuan Sistem
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#22D3EE]/20 text-[#22D3EE] font-bold">
                    2 Baru
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-[#94A3B8] hover:text-[#22D3EE]"
                >
                  Tutup
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {NOTIFICATIONS.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      setShowNotifications(false);
                      router.push(notif.href);
                    }}
                    className={`p-3 rounded-xl transition-all cursor-pointer ${
                      notif.unread
                        ? 'bg-[#0077B6]/15 border border-[#22D3EE]/20 hover:bg-[#0077B6]/25'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-[#F8FAFC]">{notif.title}</h4>
                      <span className="text-[10px] text-[#94A3B8]">{notif.time}</span>
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">{notif.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar with Halo Glow from reference/uiux.png */}
        <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-white/10">
          <div className="relative group cursor-pointer">
            {/* Ambient Neon Ring */}
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#0077B6] via-[#22D3EE] to-[#F28C28] opacity-75 blur-xs group-hover:opacity-100 transition duration-300 animate-pulse" />
            <div className="relative w-10 h-10 rounded-full bg-[#06162E] border border-white/20 flex items-center justify-center text-xs font-bold text-white shadow-inner">
              {user.fullName.substring(0, 2).toUpperCase()}
            </div>
          </div>

          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-[#F8FAFC] leading-tight truncate max-w-[140px]">
              {user.fullName.split(',')[0]}
            </div>
            <div className="text-[10px] font-medium text-[#22D3EE] leading-tight">
              {roleConfig.name.split(' ')[0]}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
