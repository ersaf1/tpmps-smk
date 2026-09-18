'use client';

import React, { useState } from 'react';
import {
  ProgramMutuRTL,
  StatusRTL,
  PriorityLevel,
  UserRole,
  UserProfile,
  UnitKerja,
  StandardSNP,
  EvaluasiMutu
} from '@/types/tpmps';
import { formatRupiah } from '@/lib/utils';
import {
  Target,
  Plus,
  Filter,
  Search,
  Kanban,
  List,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  X,
  Building,
  Sparkles,
  Link as LinkIcon,
  FileCheck
} from 'lucide-react';

interface ProgramRtlTabProps {
  userRole: UserRole;
  currentUser: UserProfile;
  programList: ProgramMutuRTL[];
  unitKerjaList: UnitKerja[];
  standarSnpList: StandardSNP[];
  evaluasiList: EvaluasiMutu[];
  onUpdateProgram: (updated: ProgramMutuRTL) => void;
  onAddProgram: (prog: ProgramMutuRTL) => void;
}

export default function ProgramRtlTab({
  userRole,
  currentUser,
  programList,
  unitKerjaList,
  standarSnpList,
  evaluasiList,
  onUpdateProgram,
  onAddProgram
}: ProgramRtlTabProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedStatus, setSelectedStatus] = useState<StatusRTL | 'Semua'>('Semua');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramMutuRTL | null>(null);

  // Form for progress update modal
  const [progressInput, setProgressInput] = useState<number>(0);
  const [statusInput, setStatusInput] = useState<StatusRTL>('Sedang Berjalan');

  // Form for add modal
  const [newTitle, setNewTitle] = useState('');
  const [newEvaluasiId, setNewEvaluasiId] = useState<string>(
    evaluasiList[0]?.id || 'eval-05'
  );
  const [newTemuan, setNewTemuan] = useState('');
  const [newStandardId, setNewStandardId] = useState<number>(1);
  const [newUnitId, setNewUnitId] = useState<string>('unit-kurikulum');
  const [newPic, setNewPic] = useState('');
  const [newDeadline, setNewDeadline] = useState('2026-11-30');
  const [newAnggaran, setNewAnggaran] = useState<number>(25000000);
  const [newPriority, setNewPriority] = useState<PriorityLevel>('Tinggi');
  const [newOutput, setNewOutput] = useState('');

  const kanbanColumns: StatusRTL[] = [
    'Belum Mulai',
    'Sedang Berjalan',
    'Selesai',
    'Terlambat'
  ];

  // Permissions
  const canManage =
    userRole === 'ketua_tpmps' ||
    userRole === 'anggota_tpmps' ||
    userRole === 'admin' ||
    userRole === 'unit_kerja';

  // Metrics
  const totalAnggaran = programList.reduce((acc, p) => acc + p.anggaran, 0);
  const avgProgress = Math.round(
    programList.reduce((acc, p) => acc + p.progress, 0) / (programList.length || 1)
  );
  const completedCount = programList.filter((p) => p.status === 'Selesai').length;

  // Filtered
  const filteredPrograms = programList.filter((p) => {
    if (selectedStatus !== 'Semua' && p.status !== selectedStatus) return false;
    if (selectedUnit !== 'all' && p.unitId !== selectedUnit) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.unitName.toLowerCase().includes(q) ||
        p.pic.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenEdit = (p: ProgramMutuRTL) => {
    setEditingProgram(p);
    setProgressInput(p.progress);
    setStatusInput(p.status);
  };

  const handleSaveProgress = () => {
    if (!editingProgram) return;

    let finalStatus = statusInput;
    if (progressInput === 100) finalStatus = 'Selesai';
    if (progressInput > 0 && progressInput < 100 && finalStatus === 'Belum Mulai') {
      finalStatus = 'Sedang Berjalan';
    }

    const updated: ProgramMutuRTL = {
      ...editingProgram,
      progress: Number(progressInput),
      status: finalStatus
    };

    onUpdateProgram(updated);
    setEditingProgram(null);
  };

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    const linkedEval = evaluasiList.find((ev) => ev.id === newEvaluasiId);
    const unit = unitKerjaList.find((u) => u.id === (linkedEval ? linkedEval.unitId : newUnitId));
    const snp = standarSnpList.find((s) => s.id === (linkedEval ? linkedEval.standardId : Number(newStandardId)));

    const newProg: ProgramMutuRTL = {
      id: `rtl-${Date.now()}`,
      evaluasiId: newEvaluasiId, // FK -> EvaluasiMutu
      title: newTitle,
      temuanTerkait: newTemuan || (linkedEval ? linkedEval.catatanReviewer || linkedEval.catatanUnit || 'Temuan audit mutu' : 'Temuan mutu'),
      standardId: snp ? snp.id : Number(newStandardId),
      standardName: snp ? snp.name : 'Standar Mutu',
      indikatorId: linkedEval ? linkedEval.indikatorId : 'ind-601',
      unitId: unit ? unit.id : newUnitId,
      unitName: unit ? unit.name : 'Unit Kerja',
      picUserId: unit ? unit.picUserId : currentUser.id,
      pic: newPic || (unit ? unit.pic : 'PIC'),
      deadline: newDeadline,
      anggaran: Number(newAnggaran),
      progress: 0,
      status: 'Belum Mulai',
      priority: newPriority,
      outputDiharapkan: newOutput
    };

    onAddProgram(newProg);
    setShowAddModal(false);
    setNewTitle('');
    setNewTemuan('');
  };

  const getPriorityBadge = (lvl: PriorityLevel) => {
    switch (lvl) {
      case 'Tinggi':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Sedang':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Rendah':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Monitoring Program Mutu & Rencana Tindak Lanjut (RTL)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Program peningkatan mutu yang terhubung langsung ke temuan Evaluasi Diri Sekolah (*Foreign Key: evaluasi_id*).
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Program RTL
          </button>
        )}
      </div>

      {/* KPI Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold uppercase">Total Program RTL</span>
            <div className="text-xl font-extrabold text-slate-900">{programList.length} Program</div>
            <span className="text-[11px] text-emerald-600 font-medium">{completedCount} Program Tuntas</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold uppercase">Rata-rata Progres</span>
            <div className="text-xl font-extrabold text-slate-900">{avgProgress}%</div>
            <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${avgProgress}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold uppercase">Alokasi Anggaran Mutu</span>
            <div className="text-lg font-extrabold text-slate-900">{formatRupiah(totalAnggaran)}</div>
            <span className="text-[11px] text-slate-400">Sumber: BOS / BOPD / TeFa</span>
          </div>
        </div>
      </div>

      {/* View Mode Toggle & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" /> Papan Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              <List className="w-3.5 h-3.5" /> Tabel Daftar
            </button>
          </div>

          {/* Unit Filter */}
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="all">Semua Unit Kerja</option>
            {unitKerjaList.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari program RTL..."
            className="w-full sm:w-60 text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {kanbanColumns.map((col) => {
            const colItems = filteredPrograms.filter((p) => p.status === col);
            return (
              <div
                key={col}
                className="bg-slate-100/80 rounded-2xl p-3.5 border border-slate-200/80 min-h-[420px] flex flex-col"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        col === 'Selesai'
                          ? 'bg-emerald-500'
                          : col === 'Sedang Berjalan'
                          ? 'bg-blue-500'
                          : col === 'Terlambat'
                          ? 'bg-rose-500'
                          : 'bg-slate-400'
                      }`}
                    />
                    <h3 className="text-xs font-bold text-slate-800">{col}</h3>
                  </div>
                  <span className="text-[10px] font-bold bg-white text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 shadow-xs">
                    {colItems.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 flex-1">
                  {colItems.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleOpenEdit(p)}
                      className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded truncate max-w-[130px]">
                            {p.unitName.split(' ')[0]} {p.unitName.split(' ')[1]}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getPriorityBadge(
                              p.priority
                            )}`}
                          >
                            {p.priority}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                          {p.title}
                        </h4>

                        <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-tight">
                          {p.temuanTerkait}
                        </p>

                        {/* Foreign Key Badge */}
                        <div className="mt-2 flex items-center gap-1 text-[10px] font-mono text-indigo-700 bg-indigo-50/70 px-2 py-0.5 rounded border border-indigo-100">
                          <LinkIcon className="w-3 h-3 text-indigo-500 shrink-0" />
                          <span className="truncate">FK evaluasi_id: {p.evaluasiId}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                          <span>Progres: {p.progress}%</span>
                          <span className="font-semibold text-slate-700">{p.deadline}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              p.status === 'Selesai'
                                ? 'bg-emerald-500'
                                : p.status === 'Terlambat'
                                ? 'bg-rose-500'
                                : 'bg-blue-600'
                            }`}
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                          <span>PIC: {p.pic.split(',')[0]}</span>
                          <span className="font-semibold text-slate-600 font-mono">
                            {formatRupiah(p.anggaran)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {colItems.length === 0 && (
                    <div className="py-8 text-center text-slate-400 text-xs italic">
                      Tidak ada program
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Program & Temuan</th>
                  <th className="py-3 px-3">Relasi Evaluasi (FK)</th>
                  <th className="py-3 px-3">Unit Pelaksana</th>
                  <th className="py-3 px-3 text-center">Prioritas</th>
                  <th className="py-3 px-3 text-center">Tenggat Waktu</th>
                  <th className="py-3 px-3 text-right">Anggaran</th>
                  <th className="py-3 px-3 text-center">Progres</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPrograms.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900">{p.title}</div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{p.temuanTerkait}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                        {p.evaluasiId}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{p.unitName}</div>
                      <span className="text-[10px] text-slate-400">PIC: {p.pic}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityBadge(
                          p.priority
                        )}`}
                      >
                        {p.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 font-medium">
                      {p.deadline}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                      {formatRupiah(p.anggaran)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-slate-800">{p.progress}%</span>
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 mx-auto mt-1">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'Selesai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'Terlambat'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Update Progres Program RTL */}
      {editingProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  Update RTL
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{editingProgram.title}</h3>
              </div>
              <button
                onClick={() => setEditingProgram(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 my-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Persentase Progres Realisasi ({progressInput}%)
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progressInput}
                  onChange={(e) => setProgressInput(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0% (Belum Mulai)</span>
                  <span>50% (Sedang Jalan)</span>
                  <span>100% (Selesai Tuntas)</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Status Program</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as StatusRTL)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Belum Mulai">Belum Mulai</option>
                  <option value="Sedang Berjalan">Sedang Berjalan</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Terlambat">Terlambat</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Relasi Evaluasi:</span>
                  <span className="font-mono text-indigo-700 font-bold">
                    {editingProgram.evaluasiId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Unit PIC:</span>
                  <span className="font-semibold text-slate-800">{editingProgram.unitName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tenggat Waktu:</span>
                  <span className="text-slate-800">{editingProgram.deadline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Anggaran:</span>
                  <span className="font-mono text-slate-800">
                    {formatRupiah(editingProgram.anggaran)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setEditingProgram(null)}
                className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleSaveProgress}
                className="px-4 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Program RTL Baru Terikat Relasional */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Tambah Rencana Tindak Lanjut (RTL) Baru
                </h3>
                <span className="text-[10px] text-blue-600 font-semibold">
                  Tautkan ke Catatan Evaluasi Mutu
                </span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProgram} className="space-y-3 mt-4 text-xs">
              {/* Evaluasi Relational Selector */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Pilih Temuan Evaluasi Mutu Terkait (Foreign Key: evaluasi_id):
                </label>
                <select
                  value={newEvaluasiId}
                  onChange={(e) => {
                    setNewEvaluasiId(e.target.value);
                    const target = evaluasiList.find((ev) => ev.id === e.target.value);
                    if (target) {
                      setNewStandardId(target.standardId);
                      setNewUnitId(target.unitId);
                      if (target.catatanReviewer) setNewTemuan(target.catatanReviewer);
                    }
                  }}
                  className="w-full p-2 border border-blue-200 bg-blue-50/50 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {evaluasiList.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      [{ev.id}] {ev.indikatorCode} - {ev.unitName} (Status: {ev.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Judul Program RTL</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Pengadaan Alat Praktik Fiber Optik Lab TJKT"
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Temuan Evaluasi / Latar Belakang Masalah
                </label>
                <textarea
                  rows={2}
                  required
                  value={newTemuan}
                  onChange={(e) => setNewTemuan(e.target.value)}
                  placeholder="Deskripsikan temuan gap mutu..."
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Standar SNP</label>
                  <select
                    value={newStandardId}
                    onChange={(e) => setNewStandardId(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {standarSnpList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} - {s.name.substring(0, 20)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Unit Penanggung Jawab</label>
                  <select
                    value={newUnitId}
                    onChange={(e) => setNewUnitId(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {unitKerjaList.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tenggat Waktu</label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Anggaran (Rp)</label>
                  <input
                    type="number"
                    required
                    value={newAnggaran}
                    onChange={(e) => setNewAnggaran(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Prioritas</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Tinggi">Tinggi</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Rendah">Rendah</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Output yang Diharapkan</label>
                <input
                  type="text"
                  value={newOutput}
                  onChange={(e) => setNewOutput(e.target.value)}
                  placeholder="Contoh: 100% siswa kelas XII dapat praktik individu"
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-xs"
                >
                  Simpan Program Terhubung
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
