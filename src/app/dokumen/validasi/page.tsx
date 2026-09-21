'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { useToast } from '@/components/ui/ToastFeedback';
import { sintesaService } from '@/lib/services/sintesaDataService';
import { BuktiDokumen } from '@/types/sintesa';
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

  const loadData = () => {
    const all = sintesaService.getDocuments();
    setTotalDocsCount(all.length);
    setPendingDocs(all.filter((d) => d.status === 'Menunggu Review' || d.status === 'Perlu Revisi'));
  };

  useEffect(() => {
    const timer = window.setTimeout(loadData, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleValidate = (id: string, status: 'Terverifikasi' | 'Ditolak' | 'Perlu Revisi') => {
    const user = sintesaService.getActiveUser();
    sintesaService.updateDocument(id, {
      status,
      verifiedBy: user?.id || 'auditor',
      verifiedByName: user?.fullName || 'Auditor TPMPS',
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
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0077B6] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Bank Bukti</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              Progres Audit: <strong className="text-[#0077B6] font-mono">{auditProgress}%</strong> ({verifiedCount}/{totalDocsCount} Berkas)
            </span>
          </div>
        </div>

        {/* Audit Progress Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0077B6]" />
              <h3 className="text-sm font-bold text-slate-900">
                Status Antrean Verifikasi TPMPS
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-600">
              {pendingDocs.length} Berkas Menunggu Peninjauan
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0077B6] via-[#0284C7] to-emerald-500 transition-all duration-500"
              style={{ width: `${auditProgress}%` }}
            />
          </div>
        </div>

        {/* Pending Queue List */}
        <div className="space-y-4">
          {pendingDocs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Semua Dokumen Telah Diverifikasi
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Tidak ada berkas bukti fisik yang tertunda dalam antrean validasi hari ini.
              </p>
              <Link
                href="/dokumen"
                className="mt-5 inline-block btn-enterprise px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
              >
                Lihat Bank Bukti
              </Link>
            </div>
          ) : (
            pendingDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-sky-300 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-[#0077B6] shrink-0 mt-1">
                    <FileText className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs font-bold text-[#0077B6]">
                        {doc.code}
                      </span>
                      <span className="text-xs font-medium text-slate-500">• {doc.unitName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          doc.status === 'Perlu Revisi'
                            ? 'bg-orange-50 border-orange-200 text-orange-700'
                            : 'bg-sky-50 border-sky-200 text-[#0077B6]'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">
                      {doc.title}
                    </h4>

                    <p className="text-xs text-slate-600 mt-1 font-medium">
                      {doc.notes || 'Berkas diunggah oleh unit untuk pemenuhan instrumen evaluasi.'}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 font-mono">
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
                    className="btn-enterprise px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Pratinjau</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleValidate(doc.id, 'Perlu Revisi')}
                    className="btn-enterprise px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs font-bold text-orange-700 cursor-pointer shadow-2xs transition-colors"
                  >
                    Revisi
                  </button>

                  <button
                    type="button"
                    onClick={() => handleValidate(doc.id, 'Terverifikasi')}
                    className="btn-enterprise px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
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
