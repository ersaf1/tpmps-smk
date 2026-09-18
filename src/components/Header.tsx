'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types/tpmps';
import {
  Bell,
  Calendar,
  Search,
  School,
  Menu,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  selectedPeriode: string;
  onPeriodeChange: (p: string) => void;
  onToggleSidebar: () => void;
}

export default function Header({
  currentUser,
  selectedPeriode,
  onPeriodeChange,
  onToggleSidebar
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Evaluasi Mutu Diajukan',
      desc: 'WKS Hubin mengajukan berkas bukti Keterserapan Lulusan (BMW)',
      time: '10 menit yang lalu',
      icon: FileCheck2,
      color: 'text-blue-500 bg-blue-50'
    },
    {
      id: 2,
      title: 'Tindak Lanjut Mendekati Tenggat',
      desc: 'Pengadaan Switch Cisco Lab TJKT tersisa 12 hari lagi',
      time: '1 jam yang lalu',
      icon: AlertTriangle,
      color: 'text-amber-500 bg-amber-50'
    },
    {
      id: 3,
      title: 'Laporan EDS Semester Disetujui',
      desc: 'Kepala Sekolah telah menandatangani berita acara siklus penjaminan mutu',
      time: 'Kemarin',
      icon: CheckCircle2,
      color: 'text-emerald-500 bg-emerald-50'
    }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-sm sm:text-base leading-tight tracking-tight">
                  SMKN 1 UNGGUL TERPADU
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                  SMK PK
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Sistem Penjaminan Mutu Pendidikan Sekolah (TPMPS)
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search & Academic Period Selector */}
        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari indikator, unit, bukti..."
              className="pl-9 pr-4 py-1.5 text-xs bg-slate-100/80 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white w-48 lg:w-64 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs text-slate-500 font-medium hidden lg:inline">Periode:</span>
            <select
              value={selectedPeriode}
              onChange={(e) => onPeriodeChange(e.target.value)}
              aria-label="Pilih Periode Akademik"
              className="text-xs font-semibold text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer"
            >
              <option value="Semester Ganjil 2025/2026">Ganjil 2025/2026</option>
              <option value="Semester Genap 2025/2026">Genap 2025/2026</option>
              <option value="Tahun Ajaran 2024/2025">TA 2024/2025 (Arsip)</option>
            </select>
          </div>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition"
              title="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900">Notifikasi Sistem</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                      3 Baru
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Tutup
                  </button>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {notifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                      <div key={notif.id} className="p-3.5 hover:bg-slate-50 flex items-start gap-3 transition">
                        <div className={`p-2 rounded-xl shrink-0 ${notif.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 leading-snug">{notif.desc}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{notif.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-2.5 border-t border-slate-100 bg-slate-50 text-center">
                  <span className="text-xs text-slate-600 font-medium">
                    Semua unit kerja terhubung via TPMPS Digital
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .filter((_, i) => i < 2)
                  .join('')}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-900 truncate max-w-[130px] leading-tight">
                  {currentUser.name.split(',')[0]}
                </p>
                <p className="text-[10px] text-slate-500 capitalize">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                  {currentUser.nip && (
                    <p className="text-[10px] text-slate-400 mt-1">NIP: {currentUser.nip}</p>
                  )}
                  {currentUser.unitName && (
                    <span className="inline-block mt-2 text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {currentUser.unitName}
                    </span>
                  )}
                </div>
                <div className="py-1">
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                  >
                    Profil Pengguna
                  </button>
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                  >
                    Panduan TPMPS (Siklus PPEPP)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
