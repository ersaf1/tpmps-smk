'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/ToastFeedback';
import { sintesaService } from '@/lib/services/sintesaDataService';
import { EvaluasiMutu, BuktiDokumen } from '@/types/sintesa';
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
    const timer = window.setTimeout(() => {
      const ev = sintesaService.getEvaluationById(id);
      if (ev) {
        setEvaluation(ev);
        const allDocs = sintesaService.getDocuments();
        const matched = allDocs.filter(
          (d) => d.standardId === ev.standardId || ev.documentIds?.includes(d.id)
        );
        setDocuments(matched);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [id]);

  const handleDelete = () => {
    if (!evaluation) return;
    setIsDeleting(true);
    setTimeout(() => {
      sintesaService.deleteEvaluation(evaluation.id);
      showToast(`Evaluasi ${evaluation.code} telah dihapus.`, 'success');
      router.push('/evaluasi');
    }, 400);
  };

  if (!evaluation) {
    return (
      <AppShell title="Detail Evaluasi Mutu">
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-12 text-center max-w-lg mx-auto">
          <p className="text-sm text-slate-500 font-medium">Data evaluasi tidak ditemukan atau telah dihapus.</p>
          <Link
            href="/evaluasi"
            className="mt-4 inline-flex items-center gap-2 text-xs text-[#0077B6] font-bold hover:underline"
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
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0077B6] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Evaluasi</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/dokumen/upload?evalId=${evaluation.id}`}
              className="btn-enterprise px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0077B6] flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Unggah Bukti</span>
            </Link>

            <Link
              href={`/evaluasi/${evaluation.id}/edit`}
              className="btn-enterprise px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-xs font-semibold text-[#0077B6] flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Edit className="w-4 h-4" />
              <span>Edit / Verifikasi</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-enterprise p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-600 cursor-pointer shadow-2xs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Master Specs Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-mono font-bold text-[#0077B6] px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200">
                  {evaluation.code}
                </span>
                <span className="text-xs font-mono text-amber-700 font-bold">
                  {evaluation.indikatorCode}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-sky-50 border border-sky-200 text-[#0077B6]">
                  {evaluation.status}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-3">
                {evaluation.indikatorName}
              </h2>
            </div>

            {/* Score Showcase */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Skor Efektif Mutu
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#0077B6] font-mono mt-0.5">
                {score.toFixed(1)}%
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold block">
                {score >= 90 ? 'Predikat: Unggul' : score >= 80 ? 'Predikat: Baik' : 'Predikat: Cukup'}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 block mb-1">Unit Kerja:</span>
              <span className="font-bold text-slate-900 block">{evaluation.unitName}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 block mb-1">Standar Nasional:</span>
              <span className="font-bold text-slate-900 block">{evaluation.standardName}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 block mb-1">Periode Penilaian:</span>
              <span className="font-bold text-slate-900 block">{evaluation.periode}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 block mb-1">Auditor / Reviewer:</span>
              <span className="font-bold text-slate-900 block">
                {evaluation.reviewerName || 'Menunggu verifikasi'}
              </span>
            </div>
          </div>

          {/* Narratives Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Unit Notes */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0077B6] mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>Catatan Faktual Unit Kerja</span>
              </h4>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                {evaluation.catatanUnit || 'Tidak ada catatan khusus dari unit kerja.'}
              </p>
            </div>

            {/* TPMPS Reviewer Notes */}
            <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0077B6] mb-2 flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span>Catatan & Rekomendasi Auditor TPMPS</span>
              </h4>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                {evaluation.catatanReviewer || 'Instrumen belum diverifikasi oleh auditor TPMPS.'}
              </p>
            </div>
          </div>
        </div>

        {/* Evidence Documents Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Berkas Bukti Fisik Terkait
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dokumen pendukung validitas penilaian standar mutu ini
              </p>
            </div>

            <Link
              href={`/dokumen/upload?evalId=${evaluation.id}`}
              className="text-xs font-semibold text-[#0077B6] hover:underline flex items-center gap-1"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Unggah Dokumen Baru</span>
            </Link>
          </div>

          {documents.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 text-center text-xs text-slate-400">
              Belum ada berkas bukti fisik yang dilampirkan pada instrumen ini.
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-sky-50/50 border border-slate-200/80 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 truncate">
                    <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-[#0077B6] shrink-0">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <h5 className="text-sm font-bold text-slate-900 truncate">
                        {doc.title}
                      </h5>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-mono text-[#0077B6] font-semibold">{doc.code}</span>
                        <span>•</span>
                        <span>{doc.fileSize}</span>
                        <span>•</span>
                        <span>{doc.version}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                      {doc.status}
                    </span>
                    <Link
                      href={`/dokumen/${doc.id}`}
                      className="btn-enterprise px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs"
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
