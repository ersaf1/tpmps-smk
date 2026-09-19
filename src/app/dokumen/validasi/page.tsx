'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { useToast } from '@/components/ui/ToastFeedback';
import { sigmaService } from '@/lib/services/sigmaDataService';
import { BuktiDokumen } from '@/types/sigma';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileText,
  Eye,
  ExternalLink
} from 'lucide-react';

export default function DokumenValidasiPage() {
  const { showToast } = useToast();
  const [pendingDocs, setPendingDocs] = useState<BuktiDokumen[]>([]);
  const [totalDocsCount, setTotalDocsCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const all = sigmaService.getDocuments();
    setTotalDocsCount(all.length);
    setPendingDocs(all.filter((d) => d.status === 'Menunggu Review' || d.status === 'Perlu Revisi'));
  };

  const handleValidate = (id: string, status: 'Terverifikasi' | 'Ditolak' | 'Perlu Revisi') => {
    const user = sigmaService.getActiveUser();
    sigmaService.updateDocument(id, {
      status,
      verifiedBy: user.id,
      verifiedByName: user.fullName,
      verifiedAt: new Date().toISOString()
    });

    showToast(`Status dokumen berhasil diperbarui menjadi ${status}.`, 'success');
    loadData();
  };

  const verifiedCount = totalDocsCount - pendingDocs.length;
  const auditProgress = totalDocsCount > 0 ? Math.round((verifiedCount / totalDocsCount) * 100) : 100;

  return (
    <AppShell
      title="Validasi & Verifikasi Dokumen Mutu"
      subtitle="Antrean Pemeriksaan Keabsahan Berkas Bukti Fisik oleh Tim Auditor TPMPS"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Stats Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/dokumen"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#94A3B8] hover:text-[#22D3EE] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Bank Bukti</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#94A3B8]">
              Progres Audit: <strong className="text-[#22D3EE] font-mono">{auditProgress}%</strong> ({verifiedCount}/{totalDocsCount} Berkas)
            </span>
          </div>
        </div>

        {/* Audit Progress Bar */}
        <div className="glass-panel-glow rounded-3xl p-6 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#22D3EE]" />
              <h3 className="text-sm font-bold text-[#F8FAFC]">
                Status Antrean Verifikasi TPMPS
              </h3>
            </div>
            <span className="text-xs font-bold text-[#F28C28]">
              {pendingDocs.length} Berkas Menunggu Peninjauan
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0077B6] via-[#22D3EE] to-emerald-400 transition-all duration-500"
              style={{ width: `${auditProgress}%` }}
            />
          </div>
        </div>

        {/* Pending Queue List */}
        <div className="space-y-4">
          {pendingDocs.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-[#F8FAFC]">
                Semua Dokumen Telah Diverifikasi
              </h4>
              <p className="text-xs text-[#94A3B8] mt-1">
                Tidak ada berkas bukti fisik yang tertunda dalam antrean validasi hari ini.
              </p>
              <Link
                href="/dokumen"
                className="mt-5 inline-block btn-enterprise px-5 py-2.5 rounded-xl bg-white/10 text-xs font-semibold text-white"
              >
                Lihat Bank Bukti
              </Link>
            </div>
          ) : (
            pendingDocs.map((doc) => (
              <div
                key={doc.id}
                className="glass-panel rounded-3xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-[#0077B6]/20 border border-[#22D3EE]/30 text-[#22D3EE] shrink-0 mt-1">
                    <FileText className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs font-bold text-[#22D3EE]">
                        {doc.code}
                      </span>
                      <span className="text-xs font-medium text-[#94A3B8]">• {doc.unitName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          doc.status === 'Perlu Revisi'
                            ? 'bg-[#F28C28]/15 border-[#F28C28]/40 text-[#F28C28]'
                            : 'bg-[#22D3EE]/15 border-[#22D3EE]/40 text-[#22D3EE]'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#F8FAFC]">
                      {doc.title}
                    </h4>

                    <p className="text-xs text-[#94A3B8] mt-1 font-medium">
                      {doc.notes || 'Berkas diunggah oleh unit untuk pemenuhan instrumen evaluasi.'}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-[#94A3B8] mt-2 font-mono">
                      <span>{doc.fileName}</span>
                      <span>•</span>
                      <span>{doc.fileSize}</span>
                      <span>•</span>
                      <span>Versi {doc.version}</span>
                    </div>
                  </div>
                </div>

                {/* Validation Actions */}
                <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
                  <Link
                    href={`/dokumen/${doc.id}`}
                    className="btn-enterprise px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Pratinjau</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleValidate(doc.id, 'Perlu Revisi')}
                    className="btn-enterprise px-3.5 py-2 rounded-xl bg-[#F28C28]/15 hover:bg-[#F28C28]/25 border border-[#F28C28]/30 text-xs font-bold text-[#F28C28] cursor-pointer"
                  >
                    Revisi
                  </button>

                  <button
                    type="button"
                    onClick={() => handleValidate(doc.id, 'Terverifikasi')}
                    className="btn-enterprise px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold text-emerald-400 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Sahkan Dokumen</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
