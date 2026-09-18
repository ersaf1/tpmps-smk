'use client';

import React, { useState } from 'react';
import {
  UnitKerja,
  StandardSNP,
  IndikatorMutu,
  EvaluasiMutu,
  BuktiDokumen,
  ProgramMutuRTL,
  UserProfile,
  UserRole
} from '@/types/tpmps';
import {
  AppDatabaseState,
  getEvaluasiRelations,
  getUnitRelations,
  getRtlRelations
} from '@/lib/relationalHelpers';
import { formatRupiah } from '@/lib/utils';
import {
  Network,
  Database,
  ArrowRight,
  Link as LinkIcon,
  Building,
  FileCheck,
  FolderArchive,
  Target,
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Search,
  Layers
} from 'lucide-react';

interface RelasiDataTabProps {
  userRole: UserRole;
  state: AppDatabaseState;
  onNavigateTab: (tab: any) => void;
}

export default function RelasiDataTab({
  userRole,
  state,
  onNavigateTab
}: RelasiDataTabProps) {
  const [selectedUnitId, setSelectedUnitId] = useState<string>('unit-kurikulum');
  const [selectedEvalId, setSelectedEvalId] = useState<string>('eval-02');
  const [activeView, setActiveView] = useState<'erd' | 'explorer'>('erd');

  // Relational lookups
  const currentUnitRel = getUnitRelations(selectedUnitId, state);
  const currentEvalRel = getEvaluasiRelations(selectedEvalId, state);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-600" />
            Skema Relasi Basis Data & Keterhubungan Data Mutu (Relational Architecture)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Seluruh data saling terhubung (*relational integrity*) menggunakan Primary Key (PK) dan Foreign Key (FK) antara Pengguna, 18 Unit Kerja, 8 SNP, Evaluasi, Bukti Fisik, dan RTL.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveView('erd')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeView === 'erd' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> Skema ERD
          </button>
          <button
            onClick={() => setActiveView('explorer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeView === 'explorer' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Penelusur Relasi Aktif
          </button>
        </div>
      </div>

      {/* ERD View */}
      {activeView === 'erd' && (
        <div className="space-y-6">
          {/* Visual Architecture Summary */}
          <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-slate-50 text-slate-900 p-6 rounded-2xl border border-blue-200 shadow-xs relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Integritas Relasional Penuh (3NF Normalized)
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  Peta Relasi Entity-Relationship (ERD Model)
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Setiap dokumen bukti fisik terikat langsung ke satu catatan evaluasi (<code className="text-blue-700 font-mono bg-blue-100/60 px-1 py-0.5 rounded">evaluasi_id</code>), 
                  evaluasi terikat ke unit kerja dan indikator (<code className="text-blue-700 font-mono bg-blue-100/60 px-1 py-0.5 rounded">unit_id, indikator_id</code>), 
                  dan setiap temuan audit melahirkan program RTL (<code className="text-blue-700 font-mono bg-blue-100/60 px-1 py-0.5 rounded">evaluasi_id</code>) dengan PIC pengguna (<code className="text-blue-700 font-mono bg-blue-100/60 px-1 py-0.5 rounded">pic_user_id</code>).
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 text-xs shadow-xs">
                <div className="text-center px-2">
                  <span className="text-slate-500 block text-[10px] font-semibold">Entitas Utama</span>
                  <span className="font-extrabold text-blue-700 text-base">7 Tabel</span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-center px-2">
                  <span className="text-slate-500 block text-[10px] font-semibold">Relasi FK Aktif</span>
                  <span className="font-extrabold text-emerald-600 text-base">14 Relasi</span>
                </div>
              </div>
            </div>
          </div>

          {/* ERD Entity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Entity 1: UserProfile */}
            <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-xs overflow-hidden">
              <div className="bg-purple-50 p-3 border-b border-purple-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-700" />
                  <span className="font-mono font-bold text-xs text-purple-900">User / Pengguna</span>
                </div>
                <span className="text-[10px] font-mono bg-purple-200 text-purple-800 px-1.5 py-0.2 rounded font-bold">
                  users
                </span>
              </div>
              <div className="p-3.5 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                  <span>PK id</span>
                  <span className="text-[10px] text-slate-500 font-sans font-normal">VARCHAR(36)</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 px-2">
                  <span>name</span>
                  <span className="text-[10px] text-slate-400 font-sans">VARCHAR(100)</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 px-2">
                  <span>email</span>
                  <span className="text-[10px] text-slate-400 font-sans">VARCHAR(100)</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 px-2">
                  <span>role</span>
                  <span className="text-[10px] text-slate-400 font-sans">ENUM</span>
                </div>
                <div className="flex items-center justify-between text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                  <span>FK unit_id</span>
                  <span className="text-[10px] text-blue-600 font-sans">➔ unit_kerja.id</span>
                </div>
              </div>
            </div>

            {/* Entity 2: UnitKerja */}
            <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-xs overflow-hidden">
              <div className="bg-indigo-50 p-3 border-b border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-indigo-700" />
                  <span className="font-mono font-bold text-xs text-indigo-900">Unit Kerja (18)</span>
                </div>
                <span className="text-[10px] font-mono bg-indigo-200 text-indigo-800 px-1.5 py-0.2 rounded font-bold">
                  unit_kerja
                </span>
              </div>
              <div className="p-3.5 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                  <span>PK id</span>
                  <span className="text-[10px] text-slate-500 font-sans font-normal">VARCHAR(36)</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 px-2">
                  <span>code, name</span>
                  <span className="text-[10px] text-slate-400 font-sans">VARCHAR(100)</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 px-2">
                  <span>category</span>
                  <span className="text-[10px] text-slate-400 font-sans">ENUM</span>
                </div>
                <div className="flex items-center justify-between text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                  <span>FK pic_user_id</span>
                  <span className="text-[10px] text-blue-600 font-sans">➔ users.id</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 px-2">
                  <span>score, status</span>
                  <span className="text-[10px] text-slate-400 font-sans">DECIMAL</span>
                </div>
              </div>
            </div>

            {/* Entity 3: StandardSNP */}
            <div className="bg-white rounded-2xl border-2 border-emerald-200 shadow-xs overflow-hidden">
              <div className="bg-emerald-50 p-3 border-b border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span className="font-mono font-bold text-xs text-emerald-900">Standar SNP (8)</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-200 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                  standar_snp
                </span>
              </div>
              <div className="p-3.5 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                  <span>PK id</span>
                  <span className="text-[10px] text-slate-500 font-sans font-normal">INT (1-8)</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 px-2">
                  <span>code, name</span>
                  <span className="text-[10px] text-slate-400 font-sans">VARCHAR</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 px-2">
                  <span>weight (%)</span>
                  <span className="text-[10px] text-slate-400 font-sans">INT</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 px-2">
                  <span>target_score</span>
                  <span className="text-[10px] text-slate-400 font-sans">DECIMAL</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 px-2">
                  <span>current_score</span>
                  <span className="text-[10px] text-slate-400 font-sans">DECIMAL</span>
                </div>
              </div>
            </div>

            {/* Entity 4: IndikatorMutu */}
            <div className="bg-white rounded-2xl border-2 border-sky-200 shadow-xs overflow-hidden">
              <div className="bg-sky-50 p-3 border-b border-sky-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-sky-700" />
                  <span className="font-mono font-bold text-xs text-sky-900">Indikator Mutu</span>
                </div>
                <span className="text-[10px] font-mono bg-sky-200 text-sky-800 px-1.5 py-0.2 rounded font-bold">
                  indikator_mutu
                </span>
              </div>
              <div className="p-3.5 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                  <span>PK id</span>
                  <span className="text-[10px] text-slate-500 font-sans font-normal">VARCHAR(36)</span>
                </div>
                <div className="flex items-center justify-between text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                  <span>FK standard_id</span>
                  <span className="text-[10px] text-blue-600 font-sans">➔ standar_snp.id</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 px-2">
                  <span>code, name</span>
                  <span className="text-[10px] text-slate-400 font-sans">VARCHAR</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 px-2">
                  <span>bobot, target</span>
                  <span className="text-[10px] text-slate-400 font-sans">INT / DECIMAL</span>
                </div>
                <div className="flex items-center justify-between text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                  <span>FK unit_responsible</span>
                  <span className="text-[10px] text-blue-600 font-sans">➔ unit_kerja.id[]</span>
                </div>
              </div>
            </div>

            {/* Entity 5: EvaluasiMutu (CENTRAL HUB) */}
            <div className="bg-white rounded-2xl border-2 border-blue-400 shadow-md overflow-hidden relative">
              <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-white" />
                  <span className="font-mono font-bold text-xs">Evaluasi Mutu (Hub Inti)</span>
                </div>
                <span className="text-[10px] font-mono bg-blue-800 text-white px-2 py-0.5 rounded font-bold">
                  evaluasi_mutu
                </span>
              </div>
              <div className="p-3.5 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                  <span>PK id</span>
                  <span className="text-[10px] text-slate-500 font-sans font-normal">VARCHAR(36)</span>
                </div>
                <div className="flex items-center justify-between text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                  <span>FK indikator_id</span>
                  <span className="text-[10px] text-blue-600 font-sans">➔ indikator_mutu.id</span>
                </div>
                <div className="flex items-center justify-between text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                  <span>FK unit_id</span>
                  <span className="text-[10px] text-blue-600 font-sans">➔ unit_kerja.id</span>
                </div>
                <div className="flex items-center justify-between text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                  <span>FK reviewer_id</span>
                  <span className="text-[10px] text-blue-600 font-sans">➔ users.id</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 px-2">
                  <span>nilai_mandiri, verifikasi</span>
                  <span className="text-[10px] text-slate-400 font-sans">DECIMAL</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 px-2">
                  <span>status (Draft..Disetujui)</span>
                  <span className="text-[10px] text-slate-400 font-sans">ENUM</span>
                </div>
              </div>
            </div>

            {/* Entity 6: BuktiDokumen */}
            <div className="bg-white rounded-2xl border-2 border-teal-200 shadow-xs overflow-hidden">
              <div className="bg-teal-50 p-3 border-b border-teal-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderArchive className="w-4 h-4 text-teal-700" />
                  <span className="font-mono font-bold text-xs text-teal-900">Bukti Dokumen</span>
                </div>
                <span className="text-[10px] font-mono bg-teal-200 text-teal-800 px-1.5 py-0.2 rounded font-bold">
                  bukti_dokumen
                </span>
              </div>
              <div className="p-3.5 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                  <span>PK id</span>
                  <span className="text-[10px] text-slate-500 font-sans font-normal">VARCHAR(36)</span>
                </div>
                <div className="flex items-center justify-between text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                  <span>FK evaluasi_id</span>
                  <span className="text-[10px] text-blue-600 font-sans">➔ evaluasi_mutu.id</span>
                </div>
                <div className="flex items-center justify-between text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                  <span>FK unit_id</span>
                  <span className="text-[10px] text-blue-600 font-sans">➔ unit_kerja.id</span>
                </div>
                <div className="flex items-center justify-between text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                  <span>FK uploaded_by_user_id</span>
                  <span className="text-[10px] text-blue-600 font-sans">➔ users.id</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 px-2">
                  <span>title, file_name, size</span>
                  <span className="text-[10px] text-slate-400 font-sans">VARCHAR</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 px-2">
                  <span>status, version</span>
                  <span className="text-[10px] text-slate-400 font-sans">ENUM / VARCHAR</span>
                </div>
              </div>
            </div>

            {/* Entity 7: ProgramMutuRTL */}
            <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-xs overflow-hidden">
              <div className="bg-amber-50 p-3 border-b border-amber-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-700" />
                  <span className="font-mono font-bold text-xs text-amber-900">Program RTL</span>
                </div>
                <span className="text-[10px] font-mono bg-amber-200 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                  program_rtl
                </span>
              </div>
              <div className="p-3.5 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                  <span>PK id</span>
                  <span className="text-[10px] text-slate-500 font-sans font-normal">VARCHAR(36)</span>
                </div>
                <div className="flex items-center justify-between text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                  <span>FK evaluasi_id</span>
                  <span className="text-[10px] text-blue-600 font-sans">➔ evaluasi_mutu.id</span>
                </div>
                <div className="flex items-center justify-between text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                  <span>FK unit_id</span>
                  <span className="text-[10px] text-blue-600 font-sans">➔ unit_kerja.id</span>
                </div>
                <div className="flex items-center justify-between text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                  <span>FK pic_user_id</span>
                  <span className="text-[10px] text-blue-600 font-sans">➔ users.id</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 px-2">
                  <span>anggaran, progress</span>
                  <span className="text-[10px] text-slate-400 font-sans">BIGINT / INT</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 px-2">
                  <span>deadline, status</span>
                  <span className="text-[10px] text-slate-400 font-sans">DATE / ENUM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Relational Explorer View */}
      {activeView === 'explorer' && (
        <div className="space-y-6">
          {/* Selector Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Pilih Unit Kerja:</span>
              <select
                value={selectedUnitId}
                onChange={(e) => {
                  setSelectedUnitId(e.target.value);
                  const firstEval = state.evaluasiList.find((ev) => ev.unitId === e.target.value);
                  if (firstEval) setSelectedEvalId(firstEval.id);
                }}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-800 focus:outline-none"
              >
                {state.unitKerjaList.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.code} - {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
              Menampilkan seluruh data yang berelasi dengan unit ini
            </div>
          </div>

          {currentUnitRel && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Unit Dossier Info Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-indigo-600" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{currentUnitRel.name}</h3>
                      <span className="font-mono text-[10px] text-blue-600 font-bold">
                        PK: {currentUnitRel.id}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                    {currentUnitRel.category}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] text-slate-500 font-medium block">
                      Relasi PIC Pengguna (FK pic_user_id):
                    </span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {currentUnitRel.picUser ? currentUnitRel.picUser.name : currentUnitRel.pic}
                    </p>
                    <p className="text-[11px] text-slate-500">{currentUnitRel.email}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2.5 bg-blue-50 text-blue-900 rounded-xl border border-blue-100">
                      <span className="text-[10px] block text-blue-600">Skor Mutu</span>
                      <span className="text-base font-extrabold">{currentUnitRel.score}%</span>
                    </div>
                    <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-100">
                      <span className="text-[10px] block text-emerald-600">Indikator Terisi</span>
                      <span className="text-base font-extrabold">
                        {currentUnitRel.completedIndicators}/{currentUnitRel.totalIndicators}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Staf terafiliasi */}
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 mb-2">
                    Akun Terafiliasi Unit Ini ({currentUnitRel.staffUsers.length}):
                  </h4>
                  <div className="space-y-1.5">
                    {currentUnitRel.staffUsers.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs"
                      >
                        <span className="font-medium text-slate-800">{u.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">{u.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Related Evaluations & Documents */}
              <div className="lg:col-span-2 space-y-6">
                {/* Related Evaluasi */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-blue-600" />
                      Evaluasi Mutu Terhubung ({currentUnitRel.evaluations.length} Data)
                    </h4>
                    <button
                      onClick={() => onNavigateTab('evaluasi')}
                      className="text-[11px] text-blue-600 font-semibold hover:underline"
                    >
                      Buka di Tab Evaluasi
                    </button>
                  </div>

                  <div className="space-y-2.5 mt-3">
                    {currentUnitRel.evaluations.map((ev) => {
                      const docs = state.dokumenList.filter((d) => d.evaluasiId === ev.id);
                      const rtls = state.programRtlList.filter((r) => r.evaluasiId === ev.id);
                      return (
                        <div
                          key={ev.id}
                          className="p-3 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-slate-200/80 transition"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
                                {ev.indikatorCode}
                              </span>
                              <span className="font-bold text-xs text-slate-900">
                                {ev.indikatorName}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full">
                              Status: {ev.status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                            <span>
                              Nilai Mandiri: <strong>{ev.nilaiMandiri}%</strong> | Verifikasi:{' '}
                              <strong>{ev.nilaiVerifikasi ?? '-'}%</strong>
                            </span>
                            <div className="flex items-center gap-2 font-semibold">
                              <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                                📎 {docs.length} Bukti Dokumen
                              </span>
                              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                                🎯 {rtls.length} Program RTL
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {currentUnitRel.evaluations.length === 0 && (
                      <p className="text-xs text-slate-400 py-4 text-center italic">
                        Belum ada catatan evaluasi untuk unit ini.
                      </p>
                    )}
                  </div>
                </div>

                {/* Related Programs RTL */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-amber-600" />
                      Program Tindak Lanjut Mutu Terhubung ({currentUnitRel.programs.length} RTL)
                    </h4>
                    <button
                      onClick={() => onNavigateTab('program_rtl')}
                      className="text-[11px] text-blue-600 font-semibold hover:underline"
                    >
                      Buka di Tab RTL
                    </button>
                  </div>

                  <div className="space-y-2.5 mt-3">
                    {currentUnitRel.programs.map((prog) => (
                      <div
                        key={prog.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900">{prog.title}</span>
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                              {prog.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {prog.temuanTerkait}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1.5">
                            <span>Anggaran: {formatRupiah(prog.anggaran)}</span>
                            <span>•</span>
                            <span>Tenggat: {prog.deadline}</span>
                            <span>•</span>
                            <span className="font-mono text-blue-600">
                              FK evaluasi_id: {prog.evaluasiId}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-extrabold text-sm text-slate-900">
                            {prog.progress}%
                          </span>
                        </div>
                      </div>
                    ))}

                    {currentUnitRel.programs.length === 0 && (
                      <p className="text-xs text-slate-400 py-4 text-center italic">
                        Tidak ada program RTL aktif untuk unit ini.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
