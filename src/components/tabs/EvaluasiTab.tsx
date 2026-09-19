'use client';

import React, { useState } from 'react';
import {
  EvaluasiMutu,
  StatusEvaluasi,
  UserRole,
  UserProfile,
  UnitKerja,
  StandardSNP,
  BuktiDokumen,
  ProgramMutuRTL
} from '@/types/tpmps';
import {
  FileCheck,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileEdit,
  ArrowRight,
  MessageSquare,
  Paperclip,
  Check,
  X,
  Send,
  Building,
  Sparkles,
  ShieldCheck,
  Link as LinkIcon,
  Target,
  Plus,
  FileText,
  Download,
  ChevronDown
} from 'lucide-react';

interface EvaluasiTabProps {
  userRole: UserRole;
  currentUser: UserProfile;
  evaluasiList: EvaluasiMutu[];
  unitKerjaList: UnitKerja[];
  standarSnpList: StandardSNP[];
  dokumenList: BuktiDokumen[];
  programRtlList: ProgramMutuRTL[];
  onUpdateEvaluasi: (updated: EvaluasiMutu) => void;
  onCreateRtlFromEval?: (evaluasi: EvaluasiMutu) => void;
}

export default function EvaluasiTab({
  userRole,
  currentUser,
  evaluasiList,
  unitKerjaList,
  standarSnpList,
  dokumenList,
  programRtlList,
  onUpdateEvaluasi,
  onCreateRtlFromEval
}: EvaluasiTabProps) {
  const [activeStatusFilter, setActiveStatusFilter] = useState<StatusEvaluasi | 'Semua'>('Semua');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingEval, setEditingEval] = useState<EvaluasiMutu | null>(null);

  // Form states for modal
  const [inputNilaiMandiri, setInputNilaiMandiri] = useState<number>(0);
  const [inputNilaiVerifikasi, setInputNilaiVerifikasi] = useState<number>(0);
  const [inputCatatanUnit, setInputCatatanUnit] = useState<string>('');
  const [inputCatatanReviewer, setInputCatatanReviewer] = useState<string>('');

  const statusList: (StatusEvaluasi | 'Semua')[] = [
    'Semua',
    'Draft',
    'Diajukan',
    'Direview',
    'Disetujui',
    'Perlu Revisi'
  ];

  // Permissions
  const isTPMPS = userRole === 'ketua_tpmps' || userRole === 'anggota_tpmps' || userRole === 'admin';
  const isUnitKerja = userRole === 'unit_kerja';

  // Filter evaluations
  const filteredEvaluations = evaluasiList.filter((item) => {
    if (activeStatusFilter !== 'Semua' && item.status !== activeStatusFilter) return false;
    if (selectedUnitFilter !== 'all' && item.unitId !== selectedUnitFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        item.indikatorName.toLowerCase().includes(q) ||
        item.indikatorCode.toLowerCase().includes(q) ||
        item.unitName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenModal = (item: EvaluasiMutu) => {
    setEditingEval(item);
    setInputNilaiMandiri(item.nilaiMandiri);
    setInputNilaiVerifikasi(item.nilaiVerifikasi || item.nilaiMandiri);
    setInputCatatanUnit(item.catatanUnit || '');
    setInputCatatanReviewer(item.catatanReviewer || '');
  };

  const handleSaveEvaluation = (newStatus: StatusEvaluasi) => {
    if (!editingEval) return;

    const updated: EvaluasiMutu = {
      ...editingEval,
      nilaiMandiri: Number(inputNilaiMandiri),
      nilaiVerifikasi: isTPMPS ? Number(inputNilaiVerifikasi) : editingEval.nilaiVerifikasi,
      status: newStatus,
      catatanUnit: inputCatatanUnit,
      catatanReviewer: isTPMPS ? inputCatatanReviewer : editingEval.catatanReviewer,
      reviewedBy: isTPMPS ? currentUser.name : editingEval.reviewedBy,
      reviewedAt: isTPMPS ? new Date().toISOString().replace('T', ' ').substring(0, 16) : editingEval.reviewedAt,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    onUpdateEvaluasi(updated);
    setEditingEval(null);
  };

  const getStatusBadge = (status: StatusEvaluasi) => {
    switch (status) {
      case 'Draft':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Diajukan':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Direview':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Disetujui':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Perlu Revisi':
        return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  // Find linked data for editingEval
  const linkedDocs = editingEval
    ? dokumenList.filter((d) => d.evaluasiId === editingEval.id)
    : [];
  const linkedRtls = editingEval
    ? programRtlList.filter((p) => p.evaluasiId === editingEval.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Title & Info Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            Alur Evaluasi & Penilaian Mutu Terintegrasi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Data penilaian mandiri unit kerja, validasi bukti fisik relasional, dan penghubung langsung ke Rencana Tindak Lanjut (RTL).
          </p>
        </div>

        {/* Workflow Pipeline Legend */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
          <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700">1. Draft</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">2. Diajukan</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700">3. Direview</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">4. Disetujui</span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
          {statusList.map((st) => {
            const count =
              st === 'Semua'
                ? evaluasiList.length
                : evaluasiList.filter((e) => e.status === st).length;
            const isActive = activeStatusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setActiveStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{st}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Unit Filter & Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedUnitFilter}
              onChange={(e) => setSelectedUnitFilter(e.target.value)}
              className="appearance-none text-xs bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl pl-3 pr-8 py-2 text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none shadow-2xs transition-all cursor-pointer"
            >
              <option value="all">Semua Unit Kerja (18)</option>
              {unitKerjaList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari indikator..."
              className="text-xs pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs w-36 sm:w-48"
            />
          </div>
        </div>
      </div>

      {/* Evaluations Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Indikator & Standar</th>
                <th className="py-3.5 px-4">Unit Pelaksana (FK)</th>
                <th className="py-3.5 px-3 text-center">Nilai Mandiri</th>
                <th className="py-3.5 px-3 text-center">Verifikasi TPMPS</th>
                <th className="py-3.5 px-3 text-center">Bukti Terkait</th>
                <th className="py-3.5 px-3 text-center">RTL Terkait</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi Penilaian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvaluations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ada data evaluasi yang sesuai dengan filter ini.
                  </td>
                </tr>
              ) : (
                filteredEvaluations.map((item) => {
                  const itemDocs = dokumenList.filter((d) => d.evaluasiId === item.id);
                  const itemRtls = programRtlList.filter((p) => p.evaluasiId === item.id);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[10px] border border-blue-200">
                            {item.indikatorCode}
                          </span>
                          <span className="font-bold text-slate-900 text-xs">
                            {item.indikatorName}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 mt-0.5 block">
                          {item.standardName}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{item.unitName}</div>
                        <span className="text-[10px] font-mono text-slate-400">
                          FK: {item.unitId}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span className="font-extrabold text-sm text-slate-900">
                          {item.nilaiMandiri}%
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {item.nilaiVerifikasi !== undefined ? (
                          <span className="font-extrabold text-sm text-blue-600">
                            {item.nilaiVerifikasi}%
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Belum dinilai</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full text-[11px]">
                          <Paperclip className="w-3 h-3 text-teal-600" />
                          {itemDocs.length} Dokumen
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {itemRtls.length > 0 ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[11px]">
                            <Target className="w-3 h-3 text-amber-600" />
                            {itemRtls.length} RTL
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-lg text-xs font-semibold transition cursor-pointer border border-blue-200"
                        >
                          <FileEdit className="w-3.5 h-3.5" />
                          {isTPMPS ? 'Review / Validasi' : 'Buka Instrumen'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Penilaian / Verifikasi Evaluasi Terintegrasi Relasional */}
      {editingEval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
                    {editingEval.indikatorCode}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getStatusBadge(
                      editingEval.status
                    )}`}
                  >
                    Status: {editingEval.status}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    PK: {editingEval.id}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  {editingEval.indikatorName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Unit Pelaksana: <strong>{editingEval.unitName}</strong> • {editingEval.periode}
                </p>
              </div>
              <button
                onClick={() => setEditingEval(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 my-4 text-xs">
              {/* Score Input Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nilai Mandiri (Unit Kerja) */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <label className="font-bold text-slate-800 block mb-1">
                    Nilai Mandiri (Self-Assessment Unit)
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Skor pengakuan pemenuhan indikator oleh unit kerja (skala 0 - 100).
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={inputNilaiMandiri}
                      disabled={isTPMPS && editingEval.status !== 'Draft'}
                      onChange={(e) => setInputNilaiMandiri(Number(e.target.value))}
                      className="text-lg font-bold w-24 p-2 bg-white border border-slate-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <span className="text-sm font-semibold text-slate-600">% Capaian</span>
                  </div>
                </div>

                {/* Nilai Verifikasi (TPMPS) */}
                <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200">
                  <label className="font-bold text-blue-900 block mb-1">
                    Nilai Hasil Verifikasi Auditor TPMPS
                  </label>
                  <p className="text-[11px] text-blue-700 mb-2">
                    Skor final berdasarkan keabsahan dokumen bukti fisik yang diunggah.
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={inputNilaiVerifikasi}
                      disabled={!isTPMPS}
                      onChange={(e) => setInputNilaiVerifikasi(Number(e.target.value))}
                      className="text-lg font-bold w-24 p-2 bg-white border border-blue-300 rounded-lg text-center text-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <span className="text-sm font-semibold text-blue-800">% Terverifikasi</span>
                  </div>
                </div>
              </div>

              {/* Catatan / Penjelasan Unit */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Catatan Narasi & Penjelasan dari Unit Kerja:
                </label>
                <textarea
                  rows={2}
                  value={inputCatatanUnit}
                  disabled={isTPMPS && editingEval.status !== 'Draft'}
                  onChange={(e) => setInputCatatanUnit(e.target.value)}
                  placeholder="Jelaskan kondisi riil, persentase ketercapaian, kendala yang dihadapi..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Catatan & Rekomendasi Reviewer TPMPS */}
              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center justify-between">
                  <span>Catatan & Rekomendasi Auditor TPMPS:</span>
                  <span className="text-[10px] text-blue-600 font-semibold">
                    {editingEval.reviewedBy ? `Oleh: ${editingEval.reviewedBy}` : 'Belum direview'}
                  </span>
                </label>
                <textarea
                  rows={2}
                  value={inputCatatanReviewer}
                  disabled={!isTPMPS}
                  onChange={(e) => setInputCatatanReviewer(e.target.value)}
                  placeholder="Catatan validasi, dokumen yang kurang, atau rekomendasi program tindak lanjut (RTL)..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Relasi 1: Dokumen Bukti Fisik Terkait (FK evaluasi_id) */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-teal-600" />
                    Dokumen Bukti Terkait Relasional (FK evaluasi_id = {editingEval.id}):
                  </span>
                  <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    {linkedDocs.length} Berkas
                  </span>
                </div>

                <div className="space-y-1.5">
                  {linkedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-blue-500" />
                        <div>
                          <span className="font-semibold text-slate-800">{doc.title}</span>
                          <span className="text-[10px] text-slate-400 block">
                            {doc.fileName} • {doc.fileSize} • Pengunggah: {doc.uploadedBy}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[9px] border ${
                          doc.status === 'Terverifikasi'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  ))}

                  {linkedDocs.length === 0 && (
                    <p className="text-[11px] text-slate-400 italic py-1">
                      Belum ada dokumen yang terikat ke evaluasi ini.
                    </p>
                  )}
                </div>
              </div>

              {/* Relasi 2: Program RTL yang Lahir dari Evaluasi Ini (FK evaluasi_id) */}
              <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-600" />
                    Program RTL Terkait Temuan Ini (FK evaluasi_id = {editingEval.id}):
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    {linkedRtls.length} Program
                  </span>
                </div>

                <div className="space-y-1.5">
                  {linkedRtls.map((rtl) => (
                    <div
                      key={rtl.id}
                      className="p-2 bg-white rounded-lg border border-amber-200 flex items-center justify-between text-[11px]"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{rtl.title}</span>
                        <span className="text-[10px] text-slate-500 block">
                          PIC: {rtl.pic} • Due: {rtl.deadline} • Progres: {rtl.progress}%
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-100 text-amber-800">
                        {rtl.status}
                      </span>
                    </div>
                  ))}

                  {linkedRtls.length === 0 && (
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[11px] text-slate-500 italic">
                        Belum ada program RTL yang ditautkan ke temuan evaluasi ini.
                      </p>
                      {onCreateRtlFromEval && (
                        <button
                          type="button"
                          onClick={() => {
                            onCreateRtlFromEval(editingEval);
                            setEditingEval(null);
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center gap-1 cursor-pointer transition"
                        >
                          <Plus className="w-3 h-3" /> Buat RTL Terkait
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions based on Role */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setEditingEval(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Tutup
              </button>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Unit Kerja Actions */}
                {(isUnitKerja || userRole === 'admin') && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSaveEvaluation('Draft')}
                      className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                    >
                      Simpan Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEvaluation('Diajukan')}
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Ajukan ke TPMPS
                    </button>
                  </>
                )}

                {/* TPMPS Reviewer Actions */}
                {isTPMPS && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSaveEvaluation('Perlu Revisi')}
                      className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition cursor-pointer flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Minta Revisi
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEvaluation('Direview')}
                      className="px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition cursor-pointer"
                    >
                      Tandai Direview
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEvaluation('Disetujui')}
                      className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Setujui & Kunci Skor
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
