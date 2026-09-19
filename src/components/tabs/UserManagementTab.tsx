'use client';

import React, { useState } from 'react';
import { UnitKerja, UserProfile, UserRole } from '@/types/tpmps';
import { ALL_UNIT_ACCOUNTS, DEMO_USERS } from '@/data/mockData';
import {
  Users2,
  Building2,
  Search,
  Plus,
  Shield,
  CheckCircle2,
  Mail,
  UserCheck,
  X,
  Sliders,
  Pencil,
  Check,
  KeyRound,
  LogIn,
  Lock,
  Sparkles
} from 'lucide-react';

interface UserManagementTabProps {
  userRole: UserRole;
  unitKerjaList: UnitKerja[];
  onLoginAsUser?: (user: UserProfile) => void;
  onUpdateUnit?: (
    unitId: string,
    updatedData: {
      name: string;
      code?: string;
      pic?: string;
      category?: 'Manajemen' | 'Kejuruan' | 'Layanan' | 'Pengawasan';
      deskripsiJob?: string;
    }
  ) => void;
}

export default function UserManagementTab({
  userRole,
  unitKerjaList,
  onLoginAsUser,
  onUpdateUnit
}: UserManagementTabProps) {
  const isSuperAdmin =
    userRole === 'kepala_sekolah' ||
    userRole === 'ketua_tpmps' ||
    userRole === 'anggota_tpmps' ||
    userRole === 'admin';

  const [activeSubTab, setActiveSubTab] = useState<'units' | 'users'>('units');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Edit Unit Modal State (Super Admin)
  const [showEditUnitModal, setShowEditUnitModal] = useState(false);
  const [unitToEdit, setUnitToEdit] = useState<UnitKerja | null>(null);
  const [editUnitName, setEditUnitName] = useState('');
  const [editUnitCode, setEditUnitCode] = useState('');
  const [editUnitCategory, setEditUnitCategory] = useState<'Manajemen' | 'Kejuruan' | 'Layanan' | 'Pengawasan'>('Manajemen');
  const [editUnitPic, setEditUnitPic] = useState('');

  const handleOpenEditModal = (unit: UnitKerja) => {
    setUnitToEdit(unit);
    setEditUnitName(unit.name);
    setEditUnitCode(unit.code);
    setEditUnitCategory((unit.category as any) || 'Manajemen');
    setEditUnitPic(unit.pic);
    setShowEditUnitModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitToEdit || !onUpdateUnit) return;
    if (!editUnitName.trim()) return;

    onUpdateUnit(unitToEdit.id, {
      name: editUnitName.trim(),
      code: editUnitCode.trim() || unitToEdit.code,
      pic: editUnitPic.trim() || unitToEdit.pic,
      category: editUnitCategory
    });

    setShowEditUnitModal(false);
    setUnitToEdit(null);
  };

  // User list based on mock data (18 Unit Accounts + Super Admin + Management)
  const [userList, setUserList] = useState<UserProfile[]>([
    ...ALL_UNIT_ACCOUNTS,
    DEMO_USERS['kepala_sekolah'],
    DEMO_USERS['ketua_tpmps'],
    DEMO_USERS['anggota_tpmps'],
    DEMO_USERS['guru']
  ]);

  const filteredUnits = unitKerjaList.filter((u) => {
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.code.toLowerCase().includes(q) ||
      u.pic.toLowerCase().includes(q) ||
      u.category.toLowerCase().includes(q)
    );
  });

  const filteredUsers = userList.filter((u) => {
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      (u.unitName && u.unitName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users2 className="w-5 h-5 text-blue-600" />
            Manajemen Hak Akses & 18 Unit Kerja Terintegrasi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pengelolaan hak akses pengguna berjenjang (RBAC) dan pemetaan struktur unit kerja penjaminan mutu SMK.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {userRole === 'admin' && (
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Tambah Akun Pengguna
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs Toggle & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveSubTab('units')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeSubTab === 'units' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> 18 Unit Kerja ({unitKerjaList.length})
            </button>
            <button
              onClick={() => setActiveSubTab('users')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                activeSubTab === 'users' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" /> Akun & Peran Pengguna ({userList.length})
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeSubTab === 'units' ? 'Cari unit, kode, atau PIC...' : 'Cari nama, email, peran...'
            }
            className="w-full sm:w-64 text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 18 Unit Kerja Table */}
      {activeSubTab === 'units' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Kode & Unit Kerja</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-4">Penanggung Jawab (PIC)</th>
                  <th className="py-3 px-3 text-center">Kelengkapan Indikator</th>
                  <th className="py-3 px-3 text-center">Skor Mutu</th>
                  <th className="py-3 px-3 text-center">Predikat</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUnits.map((unit) => (
                  <tr key={unit.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[10px] border border-blue-200">
                          {unit.code}
                        </span>
                        <span className="font-bold text-slate-900">{unit.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {unit.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{unit.pic}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" /> {unit.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-bold text-slate-800">
                        {unit.completedIndicators} / {unit.totalIndicators}
                      </span>
                      <div className="w-20 bg-slate-100 rounded-full h-1.5 mx-auto mt-1">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{
                            width: `${(unit.completedIndicators / unit.totalIndicators) * 100}%`
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-extrabold text-sm text-slate-900">
                      {unit.score}%
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          unit.status === 'Unggul'
                            ? 'bg-emerald-100 text-emerald-800'
                            : unit.status === 'Baik'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {unit.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {isSuperAdmin && onUpdateUnit && (
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(unit)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 inline-flex items-center gap-1 cursor-pointer transition shadow-2xs"
                        >
                          <Pencil className="w-3 h-3" />
                          Ubah Nama
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users & Roles Table */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          {/* Credentials Info Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  Format Kredensial Akun Seluruh Unit & Super Admin
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    Siap Pakai
                  </span>
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  • <strong>18 Akun Unit:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono font-bold text-blue-700">unit1@gmail.com</code> s/d <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono font-bold text-blue-700">unit18@gmail.com</code>
                  <br />
                  • <strong>Super Admin:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-rose-200 font-mono font-bold text-rose-700">admin@gmail.com</code> • Password seluruh akun: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono font-extrabold text-slate-900">smk12345</code>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Nama Pengguna</th>
                    <th className="py-3 px-3">Email Login (ID)</th>
                    <th className="py-3 px-3">Password</th>
                    <th className="py-3 px-3">Peran (Role)</th>
                    <th className="py-3 px-3">Unit Afiliasi</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{user.name}</div>
                        {user.nip && <span className="text-[10px] text-slate-400">NIP: {user.nip}</span>}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                          {user.email}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded inline-flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5 text-slate-500" />
                          {user.password || 'smk12345'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">
                        {user.unitName || 'Semua Unit (Manajerial)'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Aktif
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {onLoginAsUser && (
                          <button
                            type="button"
                            onClick={() => onLoginAsUser(user)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 inline-flex items-center gap-1 cursor-pointer transition shadow-2xs"
                          >
                            <LogIn className="w-3 h-3" />
                            Login
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah User */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Tambah Akun Pengguna Baru</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Pengguna baru berhasil ditambahkan!');
                setShowAddUserModal(false);
              }}
              className="space-y-3 mt-4 text-xs"
            >
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Siti Aisyah, S.Pd."
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Alamat Email Sekolah</label>
                <input
                  type="email"
                  required
                  placeholder="nama@smk-unggul.sch.id"
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Peran Akses</label>
                  <select className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option value="unit_kerja">WKS / Unit Kerja</option>
                    <option value="anggota_tpmps">Anggota TPMPS</option>
                    <option value="ketua_tpmps">Ketua TPMPS</option>
                    <option value="kepala_sekolah">Kepala Sekolah</option>
                    <option value="guru">Guru Pengampu</option>
                    <option value="admin">Admin Sistem</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Unit Kerja</label>
                  <select className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    {unitKerjaList.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-xs"
                >
                  Daftarkan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ubah Nama Unit Kerja (Super Admin) */}
      {showEditUnitModal && unitToEdit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Ubah Nama Unit Kerja</h3>
                  <p className="text-[11px] text-slate-500">Super Admin Mode • Perubahan berlaku ke semua modul</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowEditUnitModal(false);
                  setUnitToEdit(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Unit Kerja <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editUnitName}
                  onChange={(e) => setEditUnitName(e.target.value)}
                  placeholder="Misal: Tata Usaha, WKS 1 Kurikulum, dll."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kode Unit
                  </label>
                  <input
                    type="text"
                    value={editUnitCode}
                    onChange={(e) => setEditUnitCode(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={editUnitCategory}
                    onChange={(e) => setEditUnitCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white cursor-pointer"
                  >
                    <option value="Manajemen">Manajemen</option>
                    <option value="Kejuruan">Kejuruan</option>
                    <option value="Layanan">Layanan</option>
                    <option value="Pengawasan">Pengawasan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Penanggung Jawab (PIC)
                </label>
                <input
                  type="text"
                  value={editUnitPic}
                  onChange={(e) => setEditUnitPic(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditUnitModal(false);
                    setUnitToEdit(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
