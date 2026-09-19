'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/ToastFeedback';
import { sigmaService } from '@/lib/services/sigmaDataService';
import { ProgramMutuRTL } from '@/types/sigma';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Target,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Building,
  User,
  TrendingUp
} from 'lucide-react';

export default function RtlDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params.id as string;

  const [rtl, setRtl] = useState<ProgramMutuRTL | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const item = sigmaService.getRtlById(id);
    if (item) setRtl(item);
  }, [id]);

  const handleDelete = () => {
    if (!rtl) return;
    setIsDeleting(true);
    setTimeout(() => {
      sigmaService.deleteRtl(rtl.id);
      showToast(`Program RTL "${rtl.programName}" telah dihapus.`, 'success');
      router.push('/rtl');
    }, 400);
  };

  if (!rtl) {
    return (
      <AppShell title="Detail Program RTL">
        <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto">
          <p className="text-sm text-[#94A3B8]">Program RTL tidak ditemukan.</p>
          <Link
            href="/rtl"
            className="mt-4 inline-flex items-center gap-2 text-xs text-[#22D3EE] font-bold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar RTL</span>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={`Detail RTL: ${rtl.code}`}
      subtitle={rtl.programName}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/rtl"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#94A3B8] hover:text-[#22D3EE] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar RTL</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/rtl/${rtl.id}/edit`}
              className="btn-enterprise px-4 py-2 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#22D3EE] text-xs font-bold text-white flex items-center gap-1.5 shadow-md"
            >
              <Edit className="w-4 h-4" />
              <span>Perbarui Progres & Anggaran</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-enterprise p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-400 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Master RTL Card */}
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-2">
                <span className="font-mono text-xs font-bold text-[#22D3EE] px-2.5 py-1 rounded-lg bg-[#0077B6]/30 border border-[#22D3EE]/30">
                  {rtl.code}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400">
                  Prioritas {rtl.priority}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#22D3EE]/15 border border-[#22D3EE]/40 text-[#22D3EE]">
                  {rtl.status}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight">
                {rtl.programName}
              </h2>
            </div>

            {/* Progress Showcase */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                Progres Pelaksanaan
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#22D3EE] font-mono mt-0.5">
                {rtl.progress}%
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0077B6] to-[#22D3EE] transition-all duration-500"
                style={{ width: `${rtl.progress}%` }}
              />
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[#94A3B8] block mb-1">Unit Pelaksana:</span>
              <span className="font-bold text-[#F8FAFC] block">{rtl.unitName}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[#94A3B8] block mb-1">Standar SNP:</span>
              <span className="font-bold text-[#F8FAFC] block">{rtl.standardName}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[#94A3B8] block mb-1">Alokasi Anggaran:</span>
              <span className="font-mono font-bold text-[#F6B73C] block">
                Rp {rtl.anggaran.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[#94A3B8] block mb-1">Tenggat Waktu:</span>
              <span className="font-mono font-bold text-[#F8FAFC] block">{rtl.deadline}</span>
            </div>
          </div>

          {/* Narratives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#22D3EE] mb-2 flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                <span>Target Kinerja & Output Terukur</span>
              </h4>
              <p className="text-sm text-[#F8FAFC] leading-relaxed font-medium">
                {rtl.targetKinerja}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F6B73C] mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Latar Belakang & Akar Masalah</span>
              </h4>
              <p className="text-sm text-[#F8FAFC] leading-relaxed font-medium">
                {rtl.latarBelakang || 'Tindak lanjut rekomendasi rapat evaluasi mutu internal.'}
              </p>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Konfirmasi Hapus Program RTL"
          message={`Apakah Anda yakin ingin menghapus program "${rtl.programName}"?`}
          confirmLabel="Hapus Permanen"
          cancelLabel="Batal"
          isDestructive={true}
          isLoading={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      </div>
    </AppShell>
  );
}
