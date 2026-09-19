'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/ToastFeedback';
import { sigmaService } from '@/lib/services/sigmaDataService';
import { BuktiDokumen, StatusDokumen } from '@/types/sigma';
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
    const doc = sigmaService.getDocumentById(id);
    if (doc) setDocument(doc);
  }, [id]);

  const handleStatusChange = (newStatus: StatusDokumen) => {
    if (!document) return;
    const currentUser = sigmaService.getActiveUser();
    sigmaService.updateDocument(document.id, {
      status: newStatus,
      verifiedBy: currentUser.id,
      verifiedByName: currentUser.fullName,
      verifiedAt: new Date().toISOString()
    });

    setDocument((prev) =>
      prev
        ? {
            ...prev,
            status: newStatus,
            verifiedByName: currentUser.fullName,
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
      sigmaService.deleteDocument(document.id);
      showToast(`Dokumen "${document.title}" telah dihapus.`, 'success');
      router.push('/dokumen');
    }, 400);
  };

  if (!document) {
    return (
      <AppShell title="Detail Dokumen">
        <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto">
          <p className="text-sm text-[#94A3B8]">Dokumen tidak ditemukan.</p>
          <Link
            href="/dokumen"
            className="mt-4 inline-flex items-center gap-2 text-xs text-[#22D3EE] font-bold hover:underline"
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
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#94A3B8] hover:text-[#22D3EE] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Bank Bukti</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => showToast(`Mengunduh berkas ${document.fileName}...`, 'info')}
              className="btn-enterprise px-4 py-2 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#22D3EE] text-xs font-bold text-white flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Berkas</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-enterprise p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-400 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Master Document Info */}
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-xs font-bold text-[#22D3EE] px-2.5 py-1 rounded-lg bg-[#0077B6]/30 border border-[#22D3EE]/30">
                  {document.code}
                </span>
                <span className="text-xs font-mono text-[#94A3B8]">
                  {document.fileName}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
                  {document.status}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight mt-3">
                {document.title}
              </h2>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[#94A3B8] block mb-1">Unit Pengunggah:</span>
              <span className="font-bold text-[#F8FAFC] block">{document.unitName}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[#94A3B8] block mb-1">Ukuran & Format:</span>
              <span className="font-mono font-bold text-[#22D3EE] block uppercase">
                {document.fileSize} • {document.fileType}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[#94A3B8] block mb-1">Versi Dokumen:</span>
              <span className="font-bold text-[#F8FAFC] block">{document.version}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[#94A3B8] block mb-1">Diverifikasi Oleh:</span>
              <span className="font-bold text-[#F8FAFC] block">
                {document.verifiedByName || 'Belum terverifikasi'}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">
              Catatan & Keterangan Berkas
            </h4>
            <p className="text-sm text-[#F8FAFC] font-medium leading-relaxed">
              {document.notes || 'Tidak ada catatan khusus untuk dokumen ini.'}
            </p>
          </div>

          {/* Quick Status Validation Buttons (TPMPS Role Actions) */}
          <div className="p-5 rounded-2xl bg-[#06162E]/60 border border-[#22D3EE]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#22D3EE]">
                Validasi Auditor TPMPS
              </h4>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Perbarui status verifikasi keabsahan dokumen bukti fisik ini
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStatusChange('Terverifikasi')}
                className="btn-enterprise px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold text-emerald-400 cursor-pointer"
              >
                Verifikasi (Sah)
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('Perlu Revisi')}
                className="btn-enterprise px-4 py-2 rounded-xl bg-[#F28C28]/20 hover:bg-[#F28C28]/30 border border-[#F28C28]/40 text-xs font-bold text-[#F28C28] cursor-pointer"
              >
                Minta Revisi
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('Ditolak')}
                className="btn-enterprise px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-bold text-rose-400 cursor-pointer"
              >
                Tolak
              </button>
            </div>
          </div>
        </div>

        {/* File Preview Frame */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#F8FAFC]">
              Pratinjau Berkas Digital
            </h3>
            <span className="text-xs text-[#22D3EE] font-mono">SUPABASE STORAGE SECURE URL</span>
          </div>

          <div className="h-96 rounded-2xl bg-[#0E1726] border border-white/10 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-[#22D3EE]">
              <FileText className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-[#F8FAFC]">{document.fileName}</h4>
            <p className="text-xs text-[#94A3B8] mt-1 max-w-sm">
              Berkas terenkripsi dengan SHA-256. Pratinjau interaktif siap dirender secara aman.
            </p>
            <button
              type="button"
              onClick={() => showToast('Membuka viewer dokumen terenkripsi...', 'info')}
              className="mt-4 btn-enterprise px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-[#F8FAFC] cursor-pointer"
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
