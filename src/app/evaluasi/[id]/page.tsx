'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/ToastFeedback';
import { sigmaService } from '@/lib/services/sigmaDataService';
import { EvaluasiMutu, BuktiDokumen } from '@/types/sigma';
import {
  ArrowLeft,
  Edit,
  Trash2,
  UploadCloud,
  FileCheck2,
  Shield,
  Clock,
  Building,
  Target,
  FileText,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function EvaluasiDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params.id as string;

  const [evaluation, setEvaluation] = useState<EvaluasiMutu | null>(null);
  const [documents, setDocuments] = useState<BuktiDokumen[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!id) return;
    const ev = sigmaService.getEvaluationById(id);
    if (ev) {
      setEvaluation(ev);
      // Fetch associated documents
      const allDocs = sigmaService.getDocuments();
      const matched = allDocs.filter(
        (d) => d.standardId === ev.standardId || ev.documentIds?.includes(d.id)
      );
      setDocuments(matched);
    }
  }, [id]);

  const handleDelete = () => {
    if (!evaluation) return;
    setIsDeleting(true);
    setTimeout(() => {
      sigmaService.deleteEvaluation(evaluation.id);
      showToast(`Evaluasi ${evaluation.code} telah dihapus.`, 'success');
      router.push('/evaluasi');
    }, 400);
  };

  if (!evaluation) {
    return (
      <AppShell title="Detail Evaluasi Mutu">
        <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto">
          <p className="text-sm text-[#94A3B8]">Data evaluasi tidak ditemukan atau telah dihapus.</p>
          <Link
            href="/evaluasi"
            className="mt-4 inline-flex items-center gap-2 text-xs text-[#22D3EE] font-bold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar</span>
          </Link>
        </div>
      </AppShell>
    );
  }

  const score = evaluation.nilaiVerifikasi ?? evaluation.nilaiMandiri;

  return (
    <AppShell
      title={`Detail Evaluasi ${evaluation.code}`}
      subtitle={`${evaluation.unitName} • ${evaluation.standardName}`}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/evaluasi"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#94A3B8] hover:text-[#22D3EE] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Evaluasi</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/dokumen/upload?evalId=${evaluation.id}`}
              className="btn-enterprise px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#22D3EE] flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Unggah Bukti</span>
            </Link>

            <Link
              href={`/evaluasi/${evaluation.id}/edit`}
              className="btn-enterprise px-4 py-2 rounded-xl bg-[#0077B6]/30 hover:bg-[#0077B6]/50 border border-[#22D3EE]/30 text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5 cursor-pointer"
            >
              <Edit className="w-4 h-4 text-[#22D3EE]" />
              <span>Edit / Verifikasi</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-enterprise p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold text-rose-400 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Master Specs Card */}
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-mono font-bold text-[#22D3EE] px-2.5 py-1 rounded-lg bg-[#0077B6]/30 border border-[#22D3EE]/30">
                  {evaluation.code}
                </span>
                <span className="text-xs font-mono text-[#F6B73C] font-bold">
                  {evaluation.indikatorCode}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#22D3EE]/15 border border-[#22D3EE]/40 text-[#22D3EE]">
                  {evaluation.status}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight mt-3">
                {evaluation.indikatorName}
              </h2>
            </div>

            {/* Score Showcase */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                Skor Efektif Mutu
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#22D3EE] font-mono mt-0.5">
                {score.toFixed(1)}%
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold block">
                {score >= 90 ? 'Predikat: Unggul' : score >= 80 ? 'Predikat: Baik' : 'Predikat: Cukup'}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[#94A3B8] block mb-1">Unit Kerja:</span>
              <span className="font-bold text-[#F8FAFC] block">{evaluation.unitName}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[#94A3B8] block mb-1">Standar Nasional:</span>
              <span className="font-bold text-[#F8FAFC] block">{evaluation.standardName}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[#94A3B8] block mb-1">Periode Penilaian:</span>
              <span className="font-bold text-[#F8FAFC] block">{evaluation.periode}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[#94A3B8] block mb-1">Auditor / Reviewer:</span>
              <span className="font-bold text-[#F8FAFC] block">
                {evaluation.reviewerName || 'Menunggu verifikasi'}
              </span>
            </div>
          </div>

          {/* Narratives Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            {/* Unit Notes */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#22D3EE] mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>Catatan Faktual Unit Kerja</span>
              </h4>
              <p className="text-sm text-[#F8FAFC] leading-relaxed font-medium">
                {evaluation.catatanUnit || 'Tidak ada catatan khusus dari unit kerja.'}
              </p>
            </div>

            {/* TPMPS Reviewer Notes */}
            <div className="p-5 rounded-2xl bg-[#0077B6]/10 border border-[#22D3EE]/25">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F6B73C] mb-2 flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span>Catatan & Rekomendasi Auditor TPMPS</span>
              </h4>
              <p className="text-sm text-[#F8FAFC] leading-relaxed font-medium">
                {evaluation.catatanReviewer || 'Instrumen belum diverifikasi oleh auditor TPMPS.'}
              </p>
            </div>
          </div>
        </div>

        {/* Evidence Documents Section */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC] tracking-tight">
                Berkas Bukti Fisik Terkait
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Dokumen pendukung validitas penilaian standar mutu ini
              </p>
            </div>

            <Link
              href={`/dokumen/upload?evalId=${evaluation.id}`}
              className="text-xs font-semibold text-[#22D3EE] hover:underline flex items-center gap-1"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Unggah Dokumen Baru</span>
            </Link>
          </div>

          {documents.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-[#94A3B8]">
              Belum ada berkas bukti fisik yang dilampirkan pada instrumen ini.
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 truncate">
                    <div className="p-2.5 rounded-xl bg-[#0077B6]/20 border border-[#22D3EE]/30 text-[#22D3EE] shrink-0">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <h5 className="text-sm font-bold text-[#F8FAFC] truncate">
                        {doc.title}
                      </h5>
                      <div className="flex items-center gap-2 text-xs text-[#94A3B8] mt-0.5">
                        <span className="font-mono text-[#22D3EE]">{doc.code}</span>
                        <span>•</span>
                        <span>{doc.fileSize}</span>
                        <span>•</span>
                        <span>{doc.version}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      {doc.status}
                    </span>
                    <Link
                      href={`/dokumen/${doc.id}`}
                      className="btn-enterprise px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#0077B6]/40 text-xs font-semibold text-white"
                    >
                      Buka
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirmation Delete Dialog */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Konfirmasi Hapus Evaluasi"
          message={`Apakah Anda yakin ingin menghapus instrumen ${evaluation.code}? Seluruh jejak audit penghapusan akan disimpan ke basis data.`}
          confirmLabel="Hapus Permanen"
          cancelLabel="Batalkan"
          isDestructive={true}
          isLoading={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      </div>
    </AppShell>
  );
}
