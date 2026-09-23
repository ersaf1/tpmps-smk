'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/ToastFeedback';
import { sintesaService } from '@/lib/services/sintesaDataService';
import { UnitKerja, UserProfile } from '@/types/sintesa';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  HardDrive,
  CheckCircle2,
  ShieldCheck,
  Users,
  Award,
  Filter,
  X,
  Lock,
  Mail,
  UserCheck
} from 'lucide-react';

export default function UnitManagementPage() {
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [units, setUnits] = useState<UnitKerja[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [targetUnit, setTargetUnit] = useState<UnitKerja | null>(null);
  const [targetDelete, setTargetDelete] = useState<UnitKerja | null>(null);

  // Form State
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'Pimpinan' | 'Manajemen' | 'Kejuruan' | 'Layanan' | 'Pengawasan' | 'Perencanaan' | 'Kesiswaan'>('Kejuruan');
  const [formPicName, setFormPicName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formIndicators, setFormIndicators] = useState<number>(20);

  const loadData = () => {
    const user = sintesaService.getActiveUser();
    setCurrentUser(user);
    setUnits(sintesaService.getUnits());
  };

  useEffect(() => {
    loadData();
  }, []);

  const canManage = useMemo(() => {
    if (!currentUser) return false;
    return (
      currentUser.role === 'admin' ||
      currentUser.role === 'tpmps' ||
      currentUser.role === 'kepala_sekolah'
    );
  }, [currentUser]);

  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = u.name.toLowerCase().includes(q);
        const matchCode = u.code.toLowerCase().includes(q);
        const matchPic = u.picName.toLowerCase().includes(q);
        const matchEmail = u.email.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchPic && !matchEmail) return false;
      }
      if (selectedCategory !== 'ALL' && u.category !== selectedCategory) return false;
      return true;
    });
  }, [units, searchQuery, selectedCategory]);

  const handleOpenAdd = () => {
    setFormCode('');
    setFormName('');
    setFormCategory('Kejuruan');
    setFormPicName('');
    setFormEmail('');
    setFormIndicators(20);
    setIsAddOpen(true);
  };

  const handleOpenEdit = (unit: UnitKerja) => {
    setTargetUnit(unit);
    setFormCode(unit.code);
    setFormName(unit.name);
    setFormCategory(unit.category);
    setFormPicName(unit.picName);
    setFormEmail(unit.email);
    setFormIndicators(unit.totalIndicators || 20);
    setIsEditOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim() || !formEmail.trim()) {
      showToast('Mohon lengkapi kode, nama unit, dan email resmi.', 'error');
      return;
    }

    const created = sintesaService.createUnit({
      code: formCode.trim().toUpperCase(),
      name: formName.trim(),
      category: formCategory,
      picName: formPicName.trim() || 'Penanggung Jawab Unit',
      email: formEmail.trim().toLowerCase(),
      score: 85.0,
      totalIndicators: formIndicators,
      completedIndicators: 0
    });

    setUnits(sintesaService.getUnits());
    setIsAddOpen(false);
    showToast(`Unit kerja "${created.name}" (${created.code}) berhasil ditambahkan!`, 'success');
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUnit) return;

    sintesaService.updateUnit(targetUnit.id, {
      code: formCode.trim().toUpperCase(),
      name: formName.trim(),
      category: formCategory,
      picName: formPicName.trim(),
      email: formEmail.trim().toLowerCase(),
      totalIndicators: formIndicators
    });

    setUnits(sintesaService.getUnits());
    setIsEditOpen(false);
    setTargetUnit(null);
    showToast(`Data unit kerja "${formName.trim()}" berhasil diperbarui!`, 'success');
  };

  const handleDeleteConfirm = () => {
    if (!targetDelete) return;
    sintesaService.deleteUnit(targetDelete.id);
    setUnits(sintesaService.getUnits());
    showToast(`Unit kerja "${targetDelete.name}" berhasil dihapus dari sistem.`, 'success');
    setTargetDelete(null);
  };

  return (
    <AppShell
      title="Manajemen Unit Kerja"
      subtitle="Kelola Unit Kerja (CRUD) & Hak Akses SINTESA TPMPS SMK Negeri 2 Magelang"
    >
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0077B6] to-[#0284C7] flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Unit Kerja Sekolah
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0077B6] border border-blue-200">
                  {units.length} Unit Terdaftar
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Super Admin, Kepala Sekolah, dan Ketua TPMPS memiliki wewenang penuh untuk menambah, mengedit, dan menghapus unit kerja.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/drive"
              className="btn-enterprise px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-2 cursor-pointer shadow-2xs transition-colors"
            >
              <HardDrive className="w-4 h-4 text-[#0077B6]" />
              <span>Buka Google Drive Unit</span>
            </Link>

            {canManage && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="btn-enterprise px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] hover:brightness-105 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Unit Kerja</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari unit kerja, kode, nama penanggung jawab (PIC), atau email..."
              className="w-full min-h-[42px] pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-hidden transition-all"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs sm:text-sm font-semibold text-slate-700 outline-hidden"
            >
              <option value="ALL">Semua Kategori Unit ({units.length})</option>
              <option value="Pimpinan">Pimpinan Sekolah (KASEK)</option>
              <option value="Manajemen">Bidang Manajemen (WKS 1-4)</option>
              <option value="Kejuruan">Kejuruan (PPLG, MPLB, PM, AKL, UPS)</option>
              <option value="Pengawasan">Pengawasan Mutu (TPMPS)</option>
              <option value="Perencanaan">Perencanaan (RENBANG)</option>
              <option value="Layanan">Unit Layanan & Fasilitas (KATU, KALAB, dsb)</option>
              <option value="Kesiswaan">Bidang Kesiswaan (NASWIL)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 18 Official Units Information Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-sky-50/70 border border-sky-200 text-sky-950 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 shrink-0 text-[#0077B6] mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-slate-900">
            Struktur 18 Unit Kerja Resmi Sesuai Manual Mutu 2024 SMKN 2 Magelang:
          </div>
          <p className="text-slate-600 leading-relaxed">
            Unit K3 dipecah menjadi 4 Program Kejuruan: <strong>PPLG</strong> (Pengembangan Perangkat Lunak & Gim), <strong>MPLB</strong> (Manajemen Perkantoran & Layanan Bisnis), <strong>PM</strong> (Pemasaran), dan <strong>AKL</strong> (Akuntansi & Keuangan Lembaga). Kepala Sekolah memiliki hak akses monitoring menyeluruh ke-18 unit (Read-Only) dan wewenang eksklusif penetapan Periode Mutu SPMI.
          </p>
        </div>
      </div>

      {/* Access Permission Notice */}
      {!canManage && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-3">
          <Lock className="w-5 h-5 shrink-0 text-amber-600" />
          <div>
            <strong>Mode Hanya-Lihat:</strong> Anda sedang login sebagai akun unit kerja. Hak untuk menambah, mengedit, atau menghapus unit kerja hanya dimiliki oleh <strong>Super Admin</strong>, <strong>Kepala Sekolah</strong>, dan <strong>Ketua TPMPS</strong>.
          </div>
        </div>
      )}

      {/* Unit List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 text-center">No</th>
                <th className="py-3.5 px-3">Kode</th>
                <th className="py-3.5 px-4">Nama Unit Kerja</th>
                <th className="py-3.5 px-4">Penanggung Jawab (PIC)</th>
                <th className="py-3.5 px-4">Email Resmi</th>
                <th className="py-3.5 px-3">Kategori</th>
                <th className="py-3.5 px-3 text-center">Indikator</th>
                <th className="py-3.5 px-3 text-center">Skor Capaian</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Tidak ada unit kerja yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredUnits.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-[#0077B6]">
                      {u.code}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {u.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {u.picName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {u.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-slate-600">
                      {u.completedIndicators || 0} / {u.totalIndicators || 20}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {u.score.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/drive`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#0077B6] hover:bg-blue-50 transition-colors"
                          title="Buka Google Drive Unit"
                        >
                          <HardDrive className="w-4 h-4" />
                        </Link>

                        {canManage && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(u)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                              title="Edit Unit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setTargetDelete(u)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus Unit"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* -------------------------------------------------------------
          MODAL: TAMBAH UNIT BARU (CREATE)
      ------------------------------------------------------------- */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0077B6]">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Tambah Unit Kerja Baru</h3>
                  <p className="text-xs text-slate-500">Daftarkan unit kerja baru ke dalam sistem SINTESA TPMPS</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Kode Unit *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="Contoh: PROG-DKV"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs font-mono font-bold text-slate-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Kategori Unit *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs font-semibold text-slate-900 outline-hidden"
                  >
                    <option value="Pimpinan">Pimpinan</option>
                    <option value="Manajemen">Manajemen</option>
                    <option value="Kejuruan">Kejuruan</option>
                    <option value="Pengawasan">Pengawasan</option>
                    <option value="Perencanaan">Perencanaan</option>
                    <option value="Layanan">Layanan</option>
                    <option value="Kesiswaan">Kesiswaan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nama Unit Kerja *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Program Keahlian Desain Komunikasi Visual"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs text-slate-900 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nama Penanggung Jawab (PIC)
                </label>
                <input
                  type="text"
                  value={formPicName}
                  onChange={(e) => setFormPicName(e.target.value)}
                  placeholder="Contoh: Bambang Pratama, S.Sn."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs text-slate-900 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Alamat Email Resmi *
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="dkv@smkn2magelang.sch.id"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs font-mono text-slate-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Target Indikator
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={formIndicators}
                    onChange={(e) => setFormIndicators(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs font-mono text-slate-900 outline-hidden"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-[11px] text-[#0077B6] leading-relaxed">
                ℹ️ <strong>Info Kredensial:</strong> Unit baru yang ditambahkan dapat langsung login menggunakan email yang didaftarkan dengan kata sandi bawaan <code>sintesa123</code>.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0077B6] hover:bg-[#0284C7] text-white font-bold cursor-pointer transition-colors shadow-xs"
                >
                  Simpan Unit Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: EDIT UNIT (UPDATE)
      ------------------------------------------------------------- */}
      {isEditOpen && targetUnit && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Data Unit Kerja</h3>
                  <p className="text-xs text-slate-500">Perbarui data identitas unit: {targetUnit.code}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Kode Unit
                  </label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs font-mono font-bold text-slate-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Kategori Unit
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs font-semibold text-slate-900 outline-hidden"
                  >
                    <option value="Pimpinan">Pimpinan</option>
                    <option value="Manajemen">Manajemen</option>
                    <option value="Kejuruan">Kejuruan</option>
                    <option value="Pengawasan">Pengawasan</option>
                    <option value="Perencanaan">Perencanaan</option>
                    <option value="Layanan">Layanan</option>
                    <option value="Kesiswaan">Kesiswaan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nama Unit Kerja
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs text-slate-900 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nama Penanggung Jawab (PIC)
                </label>
                <input
                  type="text"
                  value={formPicName}
                  onChange={(e) => setFormPicName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs text-slate-900 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Alamat Email Resmi
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs font-mono text-slate-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Target Indikator
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={formIndicators}
                    onChange={(e) => setFormIndicators(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs font-mono text-slate-900 outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer transition-colors shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          CONFIRM DIALOG: HAPUS UNIT (DELETE)
      ------------------------------------------------------------- */}
      <ConfirmDialog
        isOpen={Boolean(targetDelete)}
        title="Hapus Unit Kerja?"
        message={`Apakah Anda yakin ingin menghapus unit kerja "${targetDelete?.name}" (${targetDelete?.code})? Seluruh pengaturan terkait unit ini akan dihapus dari sistem.`}
        confirmLabel="Ya, Hapus Unit"
        cancelLabel="Batal"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setTargetDelete(null)}
      />
    </AppShell>
  );
}
