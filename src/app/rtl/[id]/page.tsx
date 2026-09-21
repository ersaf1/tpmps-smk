'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/ToastFeedback';
import { sintesaService } from '@/lib/services/sintesaDataService';
import { ProgramMutuRTL } from '@/types/sintesa';
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
    const item = sintesaService.getRtlById(id);
    if (item) setRtl(item);
  }, [id]);

  const handleDelete = () => {
    if (!rtl) return;
    setIsDeleting(true);
    setTimeout(() => {
      sintesaService.deleteRtl(rtl.id);
      showToast(`Program RTL "${rtl.programName}" telah dihapus.`, 'success');
      router.push('/rtl');
    }, 400);
  };

  if (!rtl) {
    return (
      <AppShell title="Detail Program RTL">
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-12 text-center max-w-lg mx-auto">
          <p className="text-sm text-slate-500 font-medium">Program RTL tidak ditemukan.</p>
          <Link
            href="/rtl"
            className="mt-4 inline-flex items-center gap-2 text-xs text-[#0077B6] font-bold hover:underline"
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
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0077B6] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar RTL</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/rtl/${rtl.id}/edit`}
              className="btn-enterprise px-4 py-2 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] hover:brightness-105 text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition-all cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              <span>Perbarui Progres & Anggaran</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-enterprise p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-600 cursor-pointer shadow-2xs transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Master RTL Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-2">
                <span className="font-mono text-xs font-bold text-[#0077B6] px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200">
                  {rtl.code}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700">
                  Prioritas {rtl.priority}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-[#0077B6]">
                  {rtl.status}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {rtl.programName}
              </h2>
            </div>

            {/* Progress Showcase */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Progres Pelaksanaan
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#0077B6] font-mono mt-0.5">
                {rtl.progress}%
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0077B6] to-[#0284C7] transition-all duration-500"
                style={{ width: `${rtl.progress}%` }}
              />
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 block mb-1">Unit Pelaksana:</span>
              <span className="font-bold text-slate-900 block">{rtl.unitName}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 block mb-1">Standar SNP:</span>
              <span className="font-bold text-slate-900 block">{rtl.standardName}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 block mb-1">Alokasi Anggaran:</span>
              <span className="font-mono font-bold text-amber-700 block">
                Rp {rtl.anggaran.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 block mb-1">Tenggat Waktu:</span>
              <span className="font-mono font-bold text-slate-900 block">{rtl.deadline}</span>
            </div>
          </div>

          {/* Narratives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0077B6] mb-2 flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                <span>Target Kinerja & Output Terukur</span>
              </h4>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                {rtl.targetKinerja}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Latar Belakang & Akar Masalah</span>
              </h4>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
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
