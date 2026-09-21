'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  PanelLeft,
  Search,
  Bell,
  CheckCircle2,
  Calendar,
  Sparkles,
  ExternalLink,
  Shield
} from 'lucide-react';
import { UserProfile, ROLE_DEFINITIONS } from '@/types/sintesa';
import { sintesaService } from '@/lib/services/sintesaDataService';

interface HeaderProps {
  user: UserProfile;
  onOpenMobileSidebar: () => void;
  onToggleSidebar: () => void;
  title?: string;
  subtitle?: string;
}

export default function Header({
  user,
  onOpenMobileSidebar,
  onToggleSidebar,
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
    <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4 shadow-2xs">
      {/* Left: Mobile trigger & Page title */}
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          title="Buka menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onToggleSidebar}
          className="hidden lg:inline-flex p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          title="Buka atau tutup sidebar"
          aria-label="Buka atau tutup sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
              {title}
            </h1>
            <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-[#0077B6]">
              TA 2025/2026
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 hidden sm:block truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Center: Search Bar (Clean White / Slate) */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Cari indikator, unit kerja, kode SNP, atau dokumen..."
            className="w-full h-10 pl-10 pr-12 rounded-xl bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0077B6] focus:ring-2 focus:ring-[#0077B6]/10 text-xs text-slate-900 placeholder-slate-400 transition-all outline-hidden"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-500">
              ↵
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0077B6]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 p-4 shadow-xl z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Pemberitahuan
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-[#0077B6] font-bold">
                    2 Baru
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-slate-400 hover:text-slate-600"
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
                        ? 'bg-blue-50/70 border border-blue-100 hover:bg-blue-50'
                        : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0077B6] to-[#0284C7] p-0.5 shadow-sm flex items-center justify-center text-xs font-bold text-white">
              {user.fullName.substring(0, 2).toUpperCase()}
            </div>
          </div>

          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[140px]">
              {user.fullName.split(',')[0]}
            </div>
            <div className="text-[10px] font-medium text-[#0077B6] leading-tight">
              {roleConfig.name.split(' ')[0]}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
