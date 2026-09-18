'use client';

import React, { useState } from 'react';
import { UnitKerja, UserProfile, UserRole } from '@/types/tpmps';
import { DEMO_USERS } from '@/data/mockData';
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
  Sliders
} from 'lucide-react';

interface UserManagementTabProps {
  userRole: UserRole;
  unitKerjaList: UnitKerja[];
}

export default function UserManagementTab({
  userRole,
  unitKerjaList
}: UserManagementTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'units' | 'users'>('units');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // User list based on mock data
  const [userList, setUserList] = useState<UserProfile[]>(Object.values(DEMO_USERS));

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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users & Roles Table */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Nama Pengguna</th>
                  <th className="py-3 px-3">Peran (Role)</th>
                  <th className="py-3 px-3">Unit Afiliasi</th>
                  <th className="py-3 px-3">Email Resmi</th>
                  <th className="py-3 px-3 text-center">Status Akun</th>
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
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {user.unitName || 'Semua Unit (Manajerial)'}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{user.email}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Aktif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  );
}
