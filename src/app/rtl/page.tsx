'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import CustomDropdown from '@/components/ui/CustomDropdown';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/ToastFeedback';
import { sigmaService } from '@/lib/services/sigmaDataService';
import { ProgramMutuRTL, StatusRTL, PrioritasRTL } from '@/types/sigma';
import {
  Search,
  Plus,
  Target,
  Clock,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export default function RtlListPage() {
  const { showToast } = useToast();
  const [rtlList, setRtlList] = useState<ProgramMutuRTL[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

  const [targetDelete, setTargetDelete] = useState<ProgramMutuRTL | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setRtlList(sigmaService.getRtlList());
  };

  const filteredRtl = useMemo(() => {
    return rtlList.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.programName.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        const matchUnit = item.unitName.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchUnit) return false;
      }
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;
      if (selectedPriority !== 'ALL' && item.priority !== selectedPriority) return false;
      return true;
    });
  }, [rtlList, searchQuery, selectedStatus, selectedPriority]);

  const handleDelete = () => {
    if (!targetDelete) return;
    setIsDeleting(true);
    setTimeout(() => {
      sigmaService.deleteRtl(targetDelete.id);
      showToast(`Program RTL "${targetDelete.programName}" berhasil dihapus.`, 'success');
      setTargetDelete(null);
      setIsDeleting(false);
      loadData();
    }, 400);
  };

  const getPriorityBadge = (p: PrioritasRTL) => {
    switch (p) {
      case 'Tinggi':
        return 'bg-rose-500/15 border-rose-500/40 text-rose-400';
      case 'Sedang':
        return 'bg-[#F6B73C]/15 border-[#F6B73C]/40 text-[#F6B73C]';
      case 'Rendah':
        return 'bg-blue-500/15 border-blue-500/40 text-blue-400';
    }
  };

  const getStatusBadge = (s: StatusRTL) => {
    switch (s) {
      case 'Sedang Berjalan':
        return 'bg-[#22D3EE]/15 border-[#22D3EE]/40 text-[#22D3EE]';
      case 'Selesai':
        return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400';
      case 'Direncanakan':
        return 'bg-white/10 border-white/20 text-[#94A3B8]';
      default:
        return 'bg-[#F28C28]/15 border-[#F28C28]/40 text-[#F28C28]';
    }
  };

  return (
    <AppShell
      title="Rencana Tindak Lanjut (RTL) Mutu"
      subtitle="Monitoring Siklus Pengendalian & Peningkatan Mutu Berkelanjutan (PPEPP)"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight">
            Program Tindak Lanjut Mutu
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Total {filteredRtl.length} program tindak lanjut perbaikan mutu terdata
          </p>
        </div>

        <Link
          href="/rtl/create"
          className="btn-enterprise px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] via-[#0096c7] to-[#22D3EE] hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(34,211,238,0.35)] flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Program RTL Baru</span>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="glass-panel rounded-3xl p-5 mb-6 border border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          <div className="sm:col-span-6 relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">
              Pencarian Program RTL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama program, kode RTL, atau unit kerja..."
                className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-[#0E1726]/90 border border-white/10 hover:border-cyan-500/30 focus:border-[#22D3EE] text-xs sm:text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 outline-hidden transition-all"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <CustomDropdown
              label="Status Pelaksanaan"
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={[
                { value: 'ALL', label: 'Semua Status' },
                { value: 'Direncanakan', label: 'Direncanakan' },
                { value: 'Sedang Berjalan', label: 'Sedang Berjalan' },
                { value: 'Selesai', label: 'Selesai' },
                { value: 'Dievaluasi', label: 'Dievaluasi' },
                { value: 'Tertunda', label: 'Tertunda' }
              ]}
            />
          </div>

          <div className="sm:col-span-3">
            <CustomDropdown
              label="Tingkat Prioritas"
              value={selectedPriority}
              onChange={setSelectedPriority}
              options={[
                { value: 'ALL', label: 'Semua Prioritas' },
                { value: 'Tinggi', label: 'Prioritas Tinggi (Krusial)' },
                { value: 'Sedang', label: 'Prioritas Sedang' },
                { value: 'Rendah', label: 'Prioritas Rendah' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* RTL Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRtl.length === 0 ? (
          <div className="col-span-full glass-panel rounded-3xl p-12 text-center text-[#94A3B8]">
            Tidak ada program RTL yang cocok dengan filter.
          </div>
        ) : (
          filteredRtl.map((rtl) => (
            <div
              key={rtl.id}
              className="glass-panel rounded-3xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#22D3EE]">
                      {rtl.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(
                        rtl.priority
                      )}`}
                    >
                      {rtl.priority}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                      rtl.status
                    )}`}
                  >
                    {rtl.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#F8FAFC] tracking-tight line-clamp-2 leading-snug">
                  {rtl.programName}
                </h3>

                <p className="text-xs text-[#94A3B8] mt-2 line-clamp-2 leading-relaxed">
                  {rtl.targetKinerja}
                </p>

                {/* Progress Bar */}
                <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#94A3B8]">Progres Realisasi</span>
                    <span className="text-[#22D3EE] font-bold">{rtl.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#0077B6] to-[#22D3EE] transition-all duration-500"
                      style={{ width: `${rtl.progress}%` }}
                    />
                  </div>
                </div>

                {/* Metadata */}
                <div className="mt-4 space-y-1 text-xs text-[#94A3B8]">
                  <div className="flex justify-between">
                    <span>Unit Pelaksana:</span>
                    <span className="font-semibold text-[#F8FAFC] truncate max-w-[170px]">
                      {rtl.unitName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Anggaran (RKAS):</span>
                    <span className="font-mono text-[#F6B73C] font-semibold">
                      Rp {rtl.anggaran.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tenggat Waktu:</span>
                    <span className="font-mono text-[#F8FAFC]">{rtl.deadline}</span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <Link
                  href={`/rtl/${rtl.id}`}
                  className="btn-enterprise flex-1 py-2 rounded-xl bg-white/5 hover:bg-[#0077B6]/30 text-xs font-semibold text-[#F8FAFC] hover:text-[#22D3EE] text-center"
                >
                  Detail RTL
                </Link>

                <Link
                  href={`/rtl/${rtl.id}/edit`}
                  className="btn-enterprise p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-amber-400"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  title="Hapus"
                  onClick={() => setTargetDelete(rtl)}
                  className="p-2.5 rounded-xl text-[#94A3B8] hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(targetDelete)}
        title="Hapus Program Tindak Lanjut (RTL)?"
        message={`Apakah Anda yakin ingin menghapus program RTL "${targetDelete?.programName}"?`}
        confirmLabel="Ya, Hapus Program"
        cancelLabel="Batal"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setTargetDelete(null)}
      />
    </AppShell>
  );
}
