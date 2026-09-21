'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/ToastFeedback';
import { sintesaService } from '@/lib/services/sintesaDataService';
import { BuktiDokumen, StatusDokumen } from '@/types/sintesa';
import {
  ArrowLeft,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Building,
  User,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function DokumenDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params.id as string;

  const [document, setDocument] = useState<BuktiDokumen | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const timer = window.setTimeout(() => {
      const doc = sintesaService.getDocumentById(id);
      if (doc) setDocument(doc);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [id]);

  const handleStatusChange = (newStatus: StatusDokumen) => {
    if (!document) return;
    const currentUser = sintesaService.getActiveUser();
    sintesaService.updateDocument(document.id, {
      status: newStatus,
      verifiedBy: currentUser?.id || 'auditor',
      verifiedByName: currentUser?.fullName || 'Auditor TPMPS',
      verifiedAt: new Date().toISOString()
    });

    setDocument((prev) =>
      prev
        ? {
            ...prev,
            status: newStatus,
            verifiedByName: currentUser?.fullName || 'Auditor TPMPS',
            verifiedAt: new Date().toISOString()
          }
        : null
    );

    showToast(`Status dokumen diubah menjadi: ${newStatus}`, 'success');
  };

  const handleDelete = () => {
    if (!document) return;
    setIsDeleting(true);
    setTimeout(() => {
      sintesaService.deleteDocument(document.id);
      showToast(`Dokumen "${document.title}" telah dihapus.`, 'success');
      router.push('/dokumen');
    }, 400);
  };

  if (!document) {
    return (
      <AppShell title="Detail Dokumen">
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-12 text-center max-w-lg mx-auto">
          <p className="text-sm text-slate-500 font-medium">Dokumen tidak ditemukan.</p>
          <Link
            href="/dokumen"
            className="mt-4 inline-flex items-center gap-2 text-xs text-[#0077B6] font-bold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Bank Bukti</span>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={`Detail Dokumen: ${document.code}`}
      subtitle={`${document.title}`}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/dokumen"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0077B6] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Bank Bukti</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => showToast(`Mengunduh berkas ${document.fileName}...`, 'info')}
              className="btn-enterprise px-4 py-2 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] hover:brightness-105 text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-sky-500/20 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Berkas</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-enterprise p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-600 cursor-pointer shadow-2xs transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Master Document Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-xs font-bold text-[#0077B6] px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200">
                  {document.code}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {document.fileName}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
                  {document.status}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-3">
                {document.title}
              </h2>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 block mb-1">Unit Pengunggah:</span>
              <span className="font-bold text-slate-900 block">{document.unitName}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 block mb-1">Ukuran & Format:</span>
              <span className="font-mono font-bold text-[#0077B6] block uppercase">
                {document.fileSize} • {document.fileType}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 block mb-1">Versi Dokumen:</span>
              <span className="font-bold text-slate-900 block">{document.version}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 block mb-1">Diverifikasi Oleh:</span>
              <span className="font-bold text-slate-900 block">
                {document.verifiedByName || 'Belum terverifikasi'}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Catatan & Keterangan Berkas
            </h4>
            <p className="text-sm text-slate-800 font-medium leading-relaxed">
              {document.notes || 'Tidak ada catatan khusus untuk dokumen ini.'}
            </p>
          </div>

          {/* Quick Status Validation Buttons (TPMPS Role Actions) */}
          <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0077B6]">
                Validasi Auditor TPMPS
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Perbarui status verifikasi keabsahan dokumen bukti fisik ini
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStatusChange('Terverifikasi')}
                className="btn-enterprise px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-xs cursor-pointer transition-colors"
              >
                Verifikasi (Sah)
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('Perlu Revisi')}
                className="btn-enterprise px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-xs font-bold text-white shadow-xs cursor-pointer transition-colors"
              >
                Minta Revisi
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('Ditolak')}
                className="btn-enterprise px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs cursor-pointer transition-colors"
              >
                Tolak
              </button>
            </div>
          </div>
        </div>

        {/* File Preview Frame */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Pratinjau Berkas Digital
            </h3>
            <span className="text-xs text-[#0077B6] font-mono font-semibold bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">SUPABASE STORAGE SECURE URL</span>
          </div>

          <div className="h-96 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center mb-3 text-[#0077B6]">
              <FileText className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">{document.fileName}</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Berkas terenkripsi dengan SHA-256. Pratinjau interaktif siap dirender secara aman.
            </p>
            <button
              type="button"
              onClick={() => showToast('Membuka viewer dokumen terenkripsi...', 'info')}
              className="mt-4 btn-enterprise px-5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer shadow-2xs transition-colors"
            >
              Buka di Tab Baru
            </button>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Konfirmasi Hapus Berkas"
          message={`Apakah Anda yakin ingin menghapus berkas "${document.title}"?`}
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
