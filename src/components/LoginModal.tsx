'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types/tpmps';
import { ALL_UNIT_ACCOUNTS, DEMO_USERS } from '@/data/mockData';
import {
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Building2,
  Search,
  ArrowRight,
  UserCheck
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLogin: (user: UserProfile) => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  currentUser,
  onLogin
}: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<'form' | 'quick'>('form');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchUnit, setSearchUnit] = useState('');

  if (!isOpen) return null;

  // Normalize email helper (handles user input like 'unit 1@gmail.com', 'Unit1@gmail.com', etc.)
  const normalizeEmail = (email: string) => {
    return email.trim().toLowerCase().replace(/\s+/g, '');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const normalized = normalizeEmail(emailInput);
    if (!normalized) {
      setErrorMessage('Silakan masukkan alamat email akun.');
      return;
    }

    // Find in ALL_UNIT_ACCOUNTS or DEMO_USERS
    const foundInUnits = ALL_UNIT_ACCOUNTS.find(
      (u) => normalizeEmail(u.email) === normalized
    );

    const foundInDemo = Object.values(DEMO_USERS).find(
      (u) => normalizeEmail(u.email) === normalized
    );

    const targetUser = foundInUnits || foundInDemo;

    if (!targetUser) {
      setErrorMessage(
        `Akun dengan email "${emailInput}" tidak ditemukan. Coba: unit1@gmail.com s/d unit18@gmail.com atau admin@gmail.com`
      );
      return;
    }

    // Check password
    const expectedPassword = targetUser.password || 'smk12345';
    if (passwordInput.trim() !== expectedPassword && passwordInput.trim() !== 'smk12345') {
      setErrorMessage('Password salah! Password default semua unit adalah: smk12345');
      return;
    }

    // Success login
    onLogin(targetUser);
    onClose();
  };

  const handleQuickSelect = (user: UserProfile) => {
    onLogin(user);
    onClose();
  };

  const superAdminAccount = ALL_UNIT_ACCOUNTS[0]; // admin@gmail.com
  const unitAccounts = ALL_UNIT_ACCOUNTS.slice(1); // unit1 to unit18

  const filteredUnitAccounts = unitAccounts.filter((u) => {
    if (!searchUnit.trim()) return true;
    const q = searchUnit.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.unitName && u.unitName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center text-white shadow-inner">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Pusat Login & Autentikasi TPMPS</h3>
                <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  18 Unit + Super Admin
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                Masuk menggunakan akun unit masing-masing (unit1@gmail.com s/d unit18@gmail.com)
              </p>
            </div>
          </div>

          {/* Quick Tabs Switcher */}
          <div className="flex items-center gap-2 mt-4 bg-black/20 p-1 rounded-xl backdrop-blur-xs">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Form Login (Email & Password)
            </button>
            <button
              onClick={() => setActiveTab('quick')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'quick'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Pilih Cepat 18 Unit (1-Click)
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Current Active User Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Sedang Aktif:</span>
                <span className="font-bold text-slate-800">{currentUser.name}</span>{' '}
                <span className="text-slate-500 font-mono">({currentUser.email})</span>
              </div>
            </div>
            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
              {currentUser.role.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* TAB 1: FORM LOGIN */}
          {activeTab === 'form' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-2xl p-3 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">Info Format Akun & Password:</p>
                  <p className="text-[11px] leading-relaxed">
                    • Akun Unit: <strong>unit1@gmail.com</strong> s/d <strong>unit18@gmail.com</strong> (bisa diketik <em>unit 1@gmail.com</em>).
                    <br />
                    • Akun Super Admin: <strong>admin@gmail.com</strong>
                    <br />
                    • Password semua akun: <code className="bg-amber-200/70 px-1 py-0.5 rounded font-mono font-bold">smk12345</code>
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl p-3 flex items-center gap-2 animate-in shake duration-150">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Email Akun
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        setErrorMessage('');
                      }}
                      placeholder="Contoh: unit1@gmail.com atau admin@gmail.com"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Kata Sandi (Password)
                    </label>
                    <button
                      type="button"
                      onClick={() => setPasswordInput('smk12345')}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                    >
                      Isi otomatis &quot;smk12345&quot;
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setErrorMessage('');
                      }}
                      placeholder="Masukkan kata sandi (default: smk12345)"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Quick Autofill chips */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Klik untuk coba cepat:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { email: 'admin@gmail.com', label: '⚡ Super Admin' },
                      { email: 'unit1@gmail.com', label: 'Unit 1 (Kurikulum)' },
                      { email: 'unit2@gmail.com', label: 'Unit 2 (Kesiswaan)' },
                      { email: 'unit3@gmail.com', label: 'Unit 3 (Sarpras)' },
                      { email: 'unit4@gmail.com', label: 'Unit 4 (Hubin)' },
                      { email: 'unit9@gmail.com', label: 'Unit 9 (PPLG)' }
                    ].map((item) => (
                      <button
                        key={item.email}
                        type="button"
                        onClick={() => {
                          setEmailInput(item.email);
                          setPasswordInput('smk12345');
                          setErrorMessage('');
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 transition cursor-pointer font-medium"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Masuk Sekarang <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: QUICK 1-CLICK SWITCHER */}
          {activeTab === 'quick' && (
            <div className="space-y-3.5">
              {/* Super Admin Highlight Card */}
              <div
                onClick={() => handleQuickSelect(superAdminAccount)}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 border-2 border-rose-200 hover:border-rose-400 transition cursor-pointer flex items-center justify-between gap-3 shadow-2xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-rose-700 transition">
                        Super Admin (Otoritas Penuh)
                      </h4>
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                        God Mode ⚡
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Email: <strong className="font-mono text-slate-800">admin@gmail.com</strong> • PW: <span className="font-mono font-bold text-slate-700">smk12345</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-rose-600 group-hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  Masuk Admin
                </button>
              </div>

              {/* Search Bar for 18 Units */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchUnit}
                  onChange={(e) => setSearchUnit(e.target.value)}
                  placeholder="Cari dari 18 unit (misal: kurikulum, pplg, tu)..."
                  className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 18 Units Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                {filteredUnitAccounts.map((user, idx) => {
                  const unitNumber = idx + 1;
                  const isCurrent = currentUser.email === user.email;

                  return (
                    <div
                      key={user.id}
                      onClick={() => handleQuickSelect(user)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between gap-2.5 ${
                        isCurrent
                          ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-300'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-200 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-xs shrink-0">
                          {unitNumber}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {user.unitName || user.name}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1">
                        {isCurrent ? (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Aktif
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                            Masuk
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            Setiap unit terisolasi dalam lemari digital masing-masing.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 font-semibold cursor-pointer transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
