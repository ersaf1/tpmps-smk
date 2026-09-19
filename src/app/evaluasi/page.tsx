'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import CustomDropdown from '@/components/ui/CustomDropdown';
import FuturisticCalendar from '@/components/ui/FuturisticCalendar';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/ToastFeedback';
import { sigmaService } from '@/lib/services/sigmaDataService';
import { EvaluasiMutu, StatusEvaluasi } from '@/types/sigma';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  UploadCloud,
  FileCheck2,
  Building,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function EvaluasiListPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [evaluations, setEvaluations] = useState<EvaluasiMutu[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPredikat, setSelectedPredikat] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('');

  // Delete Dialog state
  const [targetDelete, setTargetDelete] = useState<EvaluasiMutu | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    const data = sigmaService.getEvaluations();
    setEvaluations(data);
    setIsLoading(false);
  };

  // Filter and Search logic
  const filteredData = useMemo(() => {
    return evaluations.filter((item) => {
      // Realtime Search by unit, kode, or PIC/Indikator
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = item.code.toLowerCase().includes(q) || item.indikatorCode.toLowerCase().includes(q);
        const matchUnit = item.unitName.toLowerCase().includes(q);
        const matchIndikator = item.indikatorName.toLowerCase().includes(q);
        const matchReviewer = item.reviewerName?.toLowerCase().includes(q);
        if (!matchCode && !matchUnit && !matchIndikator && !matchReviewer) {
          return false;
        }
      }

      // Filter by Status
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) {
        return false;
      }

      // Filter by Predikat
      if (selectedPredikat !== 'ALL') {
        const score = item.nilaiVerifikasi ?? item.nilaiMandiri;
        if (selectedPredikat === 'UNGGUL' && score < 90) return false;
        if (selectedPredikat === 'BAIK' && (score < 80 || score >= 90)) return false;
        if (selectedPredikat === 'CUKUP' && (score < 70 || score >= 80)) return false;
        if (selectedPredikat === 'PERHATIAN' && score >= 70) return false;
      }

      // Filter by Date
      if (selectedDate && !item.createdAt.startsWith(selectedDate)) {
        return false;
      }

      return true;
    });
  }, [evaluations, searchQuery, selectedStatus, selectedPredikat, selectedDate]);

  const handleConfirmDelete = () => {
    if (!targetDelete) return;
    setIsDeleting(true);
    setTimeout(() => {
      sigmaService.deleteEvaluation(targetDelete.id);
      showToast(`Evaluasi ${targetDelete.code} berhasil dihapus dari sistem.`, 'success');
      setTargetDelete(null);
      setIsDeleting(false);
      loadData();
    }, 400);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedKategori('ALL');
    setSelectedStatus('ALL');
    setSelectedPredikat('ALL');
    setSelectedDate('');
  };

  const getStatusBadge = (status: StatusEvaluasi) => {
    switch (status) {
      case 'Disetujui':
        return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400';
      case 'Diajukan':
        return 'bg-[#22D3EE]/15 border-[#22D3EE]/40 text-[#22D3EE]';
      case 'Direview':
        return 'bg-amber-500/15 border-amber-500/40 text-amber-400';
      case 'Perlu Revisi':
        return 'bg-[#F28C28]/15 border-[#F28C28]/40 text-[#F28C28]';
      default:
        return 'bg-white/10 border-white/20 text-[#94A3B8]';
    }
  };

  const getPredikat = (score: number) => {
    if (score >= 90) return { label: 'Unggul', color: 'text-[#22D3EE]' };
    if (score >= 80) return { label: 'Baik', color: 'text-emerald-400' };
    if (score >= 70) return { label: 'Cukup', color: 'text-[#F6B73C]' };
    return { label: 'Perlu Perhatian', color: 'text-[#F28C28]' };
  };

  return (
    <AppShell
      title="Evaluasi Mutu Internal"
      subtitle="Instrumen Pengukuran dan Verifikasi Capaian Standar Nasional Pendidikan"
    >
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight">
            Daftar Instrumen Evaluasi Mutu
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Total {filteredData.length} evaluasi terdata pada periode ini
          </p>
        </div>

        {/* Dedicated Create Page Link (NO POPUP MODAL) */}
        <Link
          href="/evaluasi/create"
          className="btn-enterprise px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] via-[#0096c7] to-[#22D3EE] hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(34,211,238,0.35)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Input Evaluasi Baru</span>
        </Link>
      </div>

      {/* Filter and Realtime Search Panel */}
      <div className="glass-panel rounded-3xl p-5 mb-6 border border-white/10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5">
          {/* Realtime Search: unit, kode, PIC */}
          <div className="lg:col-span-4 relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">
              Pencarian Cepat
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari unit, kode instrumen, atau PIC..."
                className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-[#0E1726]/90 border border-white/10 hover:border-cyan-500/30 focus:border-[#22D3EE] text-xs sm:text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Filter: Status */}
          <div className="lg:col-span-3">
            <CustomDropdown
              label="Status Verifikasi"
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={[
                { value: 'ALL', label: 'Semua Status' },
                { value: 'Draft', label: 'Draft Mandiri' },
                { value: 'Diajukan', label: 'Diajukan Unit' },
                { value: 'Direview', label: 'Sedang Direview' },
                { value: 'Disetujui', label: 'Disetujui TPMPS' },
                { value: 'Perlu Revisi', label: 'Perlu Revisi' }
              ]}
            />
          </div>

          {/* Filter: Predikat */}
          <div className="lg:col-span-3">
            <CustomDropdown
              label="Predikat Mutu"
              value={selectedPredikat}
              onChange={setSelectedPredikat}
              options={[
                { value: 'ALL', label: 'Semua Predikat' },
                { value: 'UNGGUL', label: 'Unggul (>= 90%)' },
                { value: 'BAIK', label: 'Baik (80 - 89%)' },
                { value: 'CUKUP', label: 'Cukup (70 - 79%)' },
                { value: 'PERHATIAN', label: 'Perlu Perhatian (< 70%)' }
              ]}
            />
          </div>

          {/* Filter: Tanggal (Custom Futuristic Calendar) */}
          <div className="lg:col-span-2">
            <FuturisticCalendar
              label="Tanggal Input"
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </div>
        </div>

        {/* Reset Filter Action */}
        {(searchQuery || selectedStatus !== 'ALL' || selectedPredikat !== 'ALL' || selectedDate) && (
          <div className="flex justify-end pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-[#22D3EE] hover:text-white flex items-center gap-1.5 cursor-pointer font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Semua Filter</span>
            </button>
          </div>
        )}
      </div>

      {/* DESKTOP TABLE VIEW (1920, 1440, 1366, 1024) */}
      <div className="hidden md:block glass-panel rounded-3xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-[#06162E]/70 text-[#94A3B8] uppercase text-[11px] font-bold tracking-wider">
                <th className="py-4 px-4 font-bold">Kode</th>
                <th className="py-4 px-4 font-bold">Unit Kerja</th>
                <th className="py-4 px-4 font-bold">Standar SNP</th>
                <th className="py-4 px-4 font-bold">Status</th>
                <th className="py-4 px-4 font-bold">Nilai & Predikat</th>
                <th className="py-4 px-4 font-bold">Reviewer</th>
                <th className="py-4 px-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#94A3B8]">
                    Tidak ada instrumen evaluasi yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const score = item.nilaiVerifikasi ?? item.nilaiMandiri;
                  const predikat = getPredikat(score);
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      {/* Kode */}
                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-[#22D3EE] block">
                          {item.code}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] font-mono">
                          {item.indikatorCode}
                        </span>
                      </td>

                      {/* Unit Kerja */}
                      <td className="py-4 px-4 max-w-[200px]">
                        <span className="font-bold text-[#F8FAFC] block truncate">
                          {item.unitName}
                        </span>
                        <span className="text-[11px] text-[#94A3B8] block truncate">
                          {item.indikatorName}
                        </span>
                      </td>

                      {/* Standar SNP */}
                      <td className="py-4 px-4">
                        <span className="text-xs font-medium text-[#F8FAFC] block">
                          {item.standardName}
                        </span>
                        <span className="text-[10px] text-[#94A3B8]">
                          {item.periode}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border inline-block ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Nilai & Predikat */}
                      <td className="py-4 px-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-black text-[#F8FAFC] font-mono">
                            {score.toFixed(1)}%
                          </span>
                          <span className={`text-[11px] font-bold ${predikat.color}`}>
                            ({predikat.label})
                          </span>
                        </div>
                        <span className="text-[10px] text-[#94A3B8] block">
                          {item.nilaiVerifikasi !== undefined ? 'Nilai Verifikasi' : 'Nilai Mandiri'}
                        </span>
                      </td>

                      {/* Reviewer */}
                      <td className="py-4 px-4 text-xs">
                        <span className="font-medium text-[#F8FAFC] block truncate max-w-[140px]">
                          {item.reviewerName || <span className="text-[#94A3B8] italic">Belum ditugaskan</span>}
                        </span>
                        {item.reviewedAt && (
                          <span className="text-[10px] text-[#94A3B8] font-mono">
                            {item.reviewedAt.substring(0, 10)}
                          </span>
                        )}
                      </td>

                      {/* Actions: Detail, Edit, Upload Bukti, Delete */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/evaluasi/${item.id}`}
                            title="Detail Evaluasi"
                            className="p-2 rounded-xl bg-white/5 hover:bg-[#0077B6]/30 text-[#94A3B8] hover:text-[#22D3EE] transition-all cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/evaluasi/${item.id}/edit`}
                            title="Edit Evaluasi"
                            className="p-2 rounded-xl bg-white/5 hover:bg-[#0077B6]/30 text-[#94A3B8] hover:text-amber-400 transition-all cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/dokumen/upload?evalId=${item.id}`}
                            title="Upload Bukti Fisik"
                            className="p-2 rounded-xl bg-white/5 hover:bg-[#0077B6]/30 text-[#94A3B8] hover:text-emerald-400 transition-all cursor-pointer"
                          >
                            <UploadCloud className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            title="Hapus"
                            onClick={() => setTargetDelete(item)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-[#94A3B8] hover:text-rose-400 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARD LIST VIEW (430, 390, 320 px) */}
      <div className="md:hidden space-y-4">
        {filteredData.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-xs text-[#94A3B8]">
            Tidak ada instrumen evaluasi yang cocok.
          </div>
        ) : (
          filteredData.map((item) => {
            const score = item.nilaiVerifikasi ?? item.nilaiMandiri;
            const predikat = getPredikat(score);
            return (
              <div
                key={item.id}
                className="glass-panel rounded-2xl p-4 border border-white/10 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#22D3EE] block">
                      {item.code} • {item.indikatorCode}
                    </span>
                    <h4 className="text-sm font-bold text-[#F8FAFC] mt-0.5">
                      {item.unitName}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${getStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-[#94A3B8] line-clamp-2">
                  {item.indikatorName}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">Capaian Mutu:</span>
                    <span className="text-sm font-black text-[#F8FAFC] font-mono">
                      {score.toFixed(1)}%{' '}
                      <span className={`text-xs ${predikat.color}`}>({predikat.label})</span>
                    </span>
                  </div>

                  {/* Actions Grid on Mobile (Minimum touch target 44px) */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/evaluasi/${item.id}`}
                      className="min-h-[44px] px-3.5 rounded-xl bg-white/10 text-xs font-semibold text-[#22D3EE] flex items-center justify-center cursor-pointer"
                    >
                      Detail
                    </Link>

                    <Link
                      href={`/evaluasi/${item.id}/edit`}
                      className="min-h-[44px] px-3.5 rounded-xl bg-white/10 text-xs font-semibold text-amber-400 flex items-center justify-center cursor-pointer"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => setTargetDelete(item)}
                      className="min-h-[44px] px-3 rounded-xl bg-rose-500/15 text-xs text-rose-400 flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(targetDelete)}
        title="Hapus Instrumen Evaluasi?"
        message={`Apakah Anda yakin ingin menghapus data evaluasi "${targetDelete?.code}" (${targetDelete?.unitName})? Tindakan ini akan dicatat dalam audit trail.`}
        confirmLabel="Ya, Hapus Data"
        cancelLabel="Batal"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTargetDelete(null)}
      />
    </AppShell>
  );
}
