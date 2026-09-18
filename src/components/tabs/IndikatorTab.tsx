'use client';

import React, { useState } from 'react';
import { StandardSNP, IndikatorMutu, UserRole, UnitKerja } from '@/types/tpmps';
import {
  CheckSquare,
  Search,
  Filter,
  Plus,
  FileText,
  Sliders,
  Sparkles,
  Info,
  ChevronRight,
  X,
  Building,
  Target
} from 'lucide-react';

interface IndikatorTabProps {
  userRole: UserRole;
  standarSnpList: StandardSNP[];
  indikatorList: IndikatorMutu[];
  unitKerjaList: UnitKerja[];
}

export default function IndikatorTab({
  userRole,
  standarSnpList,
  indikatorList,
  unitKerjaList
}: IndikatorTabProps) {
  const [selectedStandardId, setSelectedStandardId] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndikator, setSelectedIndikator] = useState<IndikatorMutu | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filtered indicators
  const filteredIndikators = indikatorList.filter((ind) => {
    if (selectedStandardId !== 'all' && ind.standardId !== selectedStandardId) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        ind.name.toLowerCase().includes(q) ||
        ind.code.toLowerCase().includes(q) ||
        ind.standardName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const canEdit = userRole === 'admin' || userRole === 'ketua_tpmps';

  return (
    <div className="space-y-6">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            Manajemen Indikator & 8 Standar Nasional Pendidikan (SNP)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Daftar acuan mutu standar nasional pendidikan, tolok ukur instrumen, dan bukti fisik yang diwajibkan bagi 18 unit kerja.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Indikator Mutu
          </button>
        )}
      </div>

      {/* 8 SNP Standard Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        <button
          onClick={() => setSelectedStandardId('all')}
          className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
            selectedStandardId === 'all'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-bold">Semua</span>
          <span className="text-[10px] opacity-80 mt-0.5">{indikatorList.length} Indikator</span>
        </button>

        {standarSnpList.map((snp) => (
          <button
            key={snp.id}
            onClick={() => setSelectedStandardId(snp.id)}
            className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
              selectedStandardId === snp.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                selectedStandardId === snp.id ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-blue-600'
              }`}>
                {snp.code}
              </span>
              <span className="text-[10px] opacity-80">{snp.weight}%</span>
            </div>
            <p className="text-[11px] font-bold line-clamp-1 mt-1">{snp.name.replace('Standar ', '')}</p>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode indikator, nama standar, atau kata kunci..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
        </div>
      </div>

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIndikators.map((ind) => (
          <div
            key={ind.id}
            onClick={() => setSelectedIndikator(ind)}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    {ind.code}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    {ind.standardName}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  Bobot: {ind.bobot}%
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {ind.name}
              </h3>

              <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                {ind.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Target Capaian:</span>
                <span className="font-bold text-slate-900">{ind.target} ({ind.skala})</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 font-medium block mb-1">
                  Bukti Fisik Wajib ({ind.evidenceRequired.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {ind.evidenceRequired.slice(0, 3).map((doc, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md truncate max-w-[220px]"
                    >
                      • {doc}
                    </span>
                  ))}
                  {ind.evidenceRequired.length > 3 && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                      +{ind.evidenceRequired.length - 3} lagi
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-blue-600 font-semibold group-hover:underline">
                <span>Rincian Instrumen Mutu</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail Indikator */}
      {selectedIndikator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                    {selectedIndikator.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {selectedIndikator.standardName}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  {selectedIndikator.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIndikator(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Deskripsi & Tolok Ukur Penilaian
                </h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl leading-relaxed border border-slate-200/60">
                  {selectedIndikator.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="text-[11px] text-slate-500 font-medium block">Bobot Evaluasi</span>
                  <span className="text-base font-bold text-slate-900">{selectedIndikator.bobot}%</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="text-[11px] text-slate-500 font-medium block">Target Standar Mutu</span>
                  <span className="text-base font-bold text-emerald-600">
                    {selectedIndikator.target} ({selectedIndikator.skala})
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Bukti Dokumen Fisik Wajib
                </h4>
                <div className="space-y-1.5">
                  {selectedIndikator.evidenceRequired.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-200/60"
                    >
                      <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Unit Kerja Penanggung Jawab Terkait
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedIndikator.unitResponsible.map((uId) => {
                    const unit = unitKerjaList.find((u) => u.id === uId);
                    return (
                      <span
                        key={uId}
                        className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg font-medium"
                      >
                        {unit ? unit.name : uId}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedIndikator(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Indikator Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Tambah Indikator Mutu Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Indikator mutu baru berhasil didaftarkan ke sistem TPMPS!');
                setShowAddModal(false);
              }}
              className="space-y-3 mt-4 text-xs"
            >
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Standar SNP</label>
                <select className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  {standarSnpList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kode</label>
                  <input
                    type="text"
                    placeholder="mis. SKL-1.4"
                    required
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Bobot (%)</label>
                  <input
                    type="number"
                    defaultValue={25}
                    required
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target</label>
                  <input
                    type="number"
                    defaultValue={90}
                    required
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Indikator Mutu</label>
                <input
                  type="text"
                  placeholder="Nama indikator..."
                  required
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Deskripsi & Tolok Ukur</label>
                <textarea
                  rows={3}
                  placeholder="Kriteria dan instrumen penilaian..."
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                >
                  Simpan Indikator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
