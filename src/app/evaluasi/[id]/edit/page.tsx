'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import CustomDropdown from '@/components/ui/CustomDropdown';
import { useToast } from '@/components/ui/ToastFeedback';
import { sigmaService } from '@/lib/services/sigmaDataService';
import { EvaluasiMutu, StatusEvaluasi } from '@/types/sigma';
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
    const ev = sigmaService.getEvaluationById(id);
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

    const currentUser = sigmaService.getActiveUser();

    setTimeout(() => {
      sigmaService.updateEvaluation(evaluation.id, {
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
        <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto">
          <p className="text-sm text-[#94A3B8]">Data evaluasi tidak ditemukan.</p>
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
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#94A3B8] hover:text-[#22D3EE] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail Evaluasi</span>
        </Link>

        <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-[#22D3EE]">{evaluation.code}</span>
                <span className="text-xs text-[#94A3B8]">• {evaluation.unitName}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight">
                {evaluation.indikatorName}
              </h2>
            </div>
            <div className="p-3 rounded-2xl bg-[#0077B6]/20 border border-[#22D3EE]/30 text-[#22D3EE]">
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
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase text-[#F8FAFC]">
                    Nilai Mandiri Unit
                  </label>
                  <span className="text-xl font-mono font-bold text-[#22D3EE]">
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
                  className="w-full accent-[#22D3EE] h-2 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              {/* Nilai Verifikasi TPMPS */}
              <div className="p-5 rounded-2xl bg-[#0077B6]/10 border border-[#22D3EE]/25 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase text-[#F6B73C]">
                    Nilai Verifikasi Auditor
                  </label>
                  <span className="text-xl font-mono font-bold text-[#F6B73C]">
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
                  className="w-full accent-[#F6B73C] h-2 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Catatan Unit */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                Catatan Faktual Unit Kerja
              </label>
              <textarea
                rows={3}
                value={catatanUnit}
                onChange={(e) => setCatatanUnit(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#0E1726]/90 border border-white/10 focus:border-[#22D3EE] text-sm text-[#F8FAFC] outline-hidden leading-relaxed"
              />
            </div>

            {/* Catatan Reviewer Auditor */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#F6B73C] mb-1.5">
                Catatan & Rekomendasi Auditor TPMPS
              </label>
              <textarea
                rows={3}
                value={catatanReviewer}
                onChange={(e) => setCatatanReviewer(e.target.value)}
                placeholder="Tuliskan temuan audit, alasan revisi, atau rekomendasi tindak lanjut..."
                className="w-full p-3.5 rounded-xl bg-[#0E1726]/90 border border-[#22D3EE]/30 focus:border-[#22D3EE] text-sm text-[#F8FAFC] outline-hidden leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3">
              <Link
                href={`/evaluasi/${evaluation.id}`}
                className="w-full sm:w-auto btn-enterprise px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 cursor-pointer text-center"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto btn-enterprise px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] via-[#0096c7] to-[#22D3EE] hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(34,211,238,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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
