'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import CustomDropdown from '@/components/ui/CustomDropdown';
import { useToast } from '@/components/ui/ToastFeedback';
import { sintesaService } from '@/lib/services/sintesaDataService';
import { EvaluasiMutu, StatusEvaluasi } from '@/types/sintesa';
import { ArrowLeft, Save, ShieldCheck } from 'lucide-react';

export default function EditEvaluasiPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params.id as string;

  const [evaluation, setEvaluation] = useState<EvaluasiMutu | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [nilaiMandiri, setNilaiMandiri] = useState(0);
  const [nilaiVerifikasi, setNilaiVerifikasi] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<StatusEvaluasi>('Draft');
  const [catatanUnit, setCatatanUnit] = useState('');
  const [catatanReviewer, setCatatanReviewer] = useState('');

  useEffect(() => {
    if (!id) return;
    const ev = sintesaService.getEvaluationById(id);
    if (ev) {
      setEvaluation(ev);
      setNilaiMandiri(ev.nilaiMandiri);
      setNilaiVerifikasi(ev.nilaiVerifikasi);
      setStatus(ev.status);
      setCatatanUnit(ev.catatanUnit || '');
      setCatatanReviewer(ev.catatanReviewer || '');
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluation) return;

    setIsSubmitting(true);

    const currentUser = sintesaService.getActiveUser();

    setTimeout(() => {
      sintesaService.updateEvaluation(evaluation.id, {
        nilaiMandiri: Number(nilaiMandiri),
        nilaiVerifikasi: nilaiVerifikasi !== undefined ? Number(nilaiVerifikasi) : undefined,
        status,
        catatanUnit: catatanUnit.trim(),
        catatanReviewer: catatanReviewer.trim(),
        reviewerName: currentUser.fullName,
        reviewerId: currentUser.id,
        reviewedAt: new Date().toISOString()
      });

      showToast(`Evaluasi ${evaluation.code} berhasil diperbarui!`, 'success');
      router.push(`/evaluasi/${evaluation.id}`);
    }, 400);
  };

  if (!evaluation) {
    return (
      <AppShell title="Edit Evaluasi Mutu">
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-12 text-center max-w-lg mx-auto">
          <p className="text-sm text-slate-500 font-medium">Data evaluasi tidak ditemukan.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={`Edit Evaluasi ${evaluation.code}`}
      subtitle={`Pembaruan Nilai & Verifikasi Audit Mutu Internal`}
    >
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/evaluasi/${evaluation.id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0077B6] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail Evaluasi</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-[#0077B6]">{evaluation.code}</span>
                <span className="text-xs text-slate-500">• {evaluation.unitName}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {evaluation.indikatorName}
              </h2>
            </div>
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-[#0077B6]">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status Selector */}
            <div>
              <CustomDropdown
                label="Status Evaluasi Mutu"
                value={status}
                onChange={(val) => setStatus(val as StatusEvaluasi)}
                options={[
                  { value: 'Draft', label: 'Draft Mandiri (Belum diajukan)' },
                  { value: 'Diajukan', label: 'Diajukan ke Tim TPMPS' },
                  { value: 'Direview', label: 'Sedang Direview Tim Audit' },
                  { value: 'Disetujui', label: 'Disetujui / Valid (Lolos Audit)' },
                  { value: 'Perlu Revisi', label: 'Perlu Revisi Dokumen/Eviden' }
                ]}
              />
            </div>

            {/* Nilai Grid: Mandiri vs Verifikasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nilai Mandiri */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase text-slate-900">
                    Nilai Mandiri Unit
                  </label>
                  <span className="text-xl font-mono font-bold text-[#0077B6]">
                    {Number(nilaiMandiri).toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={nilaiMandiri}
                  onChange={(e) => setNilaiMandiri(parseFloat(e.target.value))}
                  className="w-full accent-[#0077B6] h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Nilai Verifikasi TPMPS */}
              <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase text-[#0077B6]">
                    Nilai Verifikasi Auditor
                  </label>
                  <span className="text-xl font-mono font-bold text-[#0077B6]">
                    {nilaiVerifikasi !== undefined ? `${Number(nilaiVerifikasi).toFixed(1)}%` : 'Belum'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={nilaiVerifikasi ?? nilaiMandiri}
                  onChange={(e) => setNilaiVerifikasi(parseFloat(e.target.value))}
                  className="w-full accent-[#0077B6] h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Catatan Unit */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Catatan Faktual Unit Kerja
              </label>
              <textarea
                rows={3}
                value={catatanUnit}
                onChange={(e) => setCatatanUnit(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-sm text-slate-900 outline-hidden leading-relaxed transition-all shadow-2xs"
              />
            </div>

            {/* Catatan Reviewer Auditor */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Catatan & Rekomendasi Auditor TPMPS
              </label>
              <textarea
                rows={3}
                value={catatanReviewer}
                onChange={(e) => setCatatanReviewer(e.target.value)}
                placeholder="Tuliskan temuan audit, alasan revisi, atau rekomendasi tindak lanjut..."
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-sm text-slate-900 outline-hidden leading-relaxed transition-all shadow-2xs"
              />
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
              <Link
                href={`/evaluasi/${evaluation.id}`}
                className="w-full sm:w-auto btn-enterprise px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer text-center transition-colors"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto btn-enterprise px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] hover:brightness-105 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Menyimpan...' : 'Perbarui Status & Nilai'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
