'use client';

import React, { useState } from 'react';
import { UnitKerja } from '@/types/sintesa';
import { Search, Building2 } from 'lucide-react';

interface UnitKerjaTableProps {
  units: UnitKerja[];
}

export default function UnitKerjaTable({ units }: UnitKerjaTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUnits = units.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.picName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryBadge = (category: UnitKerja['category']) => {
    switch (category) {
      case 'Manajemen':
        return 'bg-sky-50 text-sky-700 border border-sky-200/60';
      case 'Kejuruan':
        return 'bg-indigo-50 text-indigo-700 border border-indigo-200/60';
      case 'Layanan':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
      case 'Pengawasan':
        return 'bg-amber-50 text-amber-700 border border-amber-200/60';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  const getStatusBadge = (score: number) => {
    if (score >= 90) return { label: 'Tuntas', style: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' };
    if (score >= 80) return { label: 'Optimal', style: 'bg-sky-50 text-sky-700 border border-sky-200/60' };
    if (score >= 70) return { label: 'Proses', style: 'bg-amber-50 text-amber-700 border border-amber-200/60' };
    return { label: 'Perlu Perhatian', style: 'bg-rose-50 text-rose-700 border border-rose-200/60' };
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Ketercapaian Mutu 18 Unit Kerja
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring instrumen pemenuhan standar dan eviden fisik per unit pelaksana
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari unit atau PIC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0077B6] outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Borderless Table with Sticky Header */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-10 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-100">
            <tr>
              <th className="py-3 px-4">Kode</th>
              <th className="py-3 px-4">Unit Kerja</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Penanggung Jawab (PIC)</th>
              <th className="py-3 px-4 w-52">Capaian Indikator</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y-0">
            {filteredUnits.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Tidak ada unit kerja yang sesuai pencarian.
                </td>
              </tr>
            ) : (
              filteredUnits.map((unit) => {
                const status = getStatusBadge(unit.score);
                const completed = unit.completedIndicators ?? Math.round((unit.score / 100) * 12);
                const total = unit.totalIndicators ?? 12;

                return (
                  <tr key={unit.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0077B6]">{unit.code}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{unit.name}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${getCategoryBadge(unit.category)}`}>
                        {unit.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-semibold text-slate-800">{unit.picName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{unit.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex justify-between items-center text-[11px] mb-1">
                        <span className="font-mono font-bold text-slate-900">{unit.score}%</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {completed}/{total} Terpenuhi
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#0077B6] to-[#0284C7] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, unit.score)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${status.style}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
