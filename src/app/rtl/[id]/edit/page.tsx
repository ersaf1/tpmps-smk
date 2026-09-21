'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import CustomDropdown from '@/components/ui/CustomDropdown';
import { useToast } from '@/components/ui/ToastFeedback';
import { sintesaService } from '@/lib/services/sintesaDataService';
import { ProgramMutuRTL, StatusRTL, PrioritasRTL } from '@/types/sintesa';
import { ArrowLeft, Save, Target } from 'lucide-react';

export default function EditRtlPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params.id as string;

  const [rtl, setRtl] = useState<ProgramMutuRTL | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [programName, setProgramName] = useState('');
  const [targetKinerja, setTargetKinerja] = useState('');
  const [anggaran, setAnggaran] = useState('0');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<StatusRTL>('Direncanakan');
  const [priority, setPriority] = useState<PrioritasRTL>('Sedang');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (!id) return;
    const timer = window.setTimeout(() => {
      const item = sintesaService.getRtlById(id);
      if (item) {
        setRtl(item);
        setProgramName(item.programName);
        setTargetKinerja(item.targetKinerja);
        setAnggaran(item.anggaran.toString());
        setProgress(item.progress);
        setStatus(item.status);
        setPriority(item.priority);
        setDeadline(item.deadline);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rtl) return;

    setIsSubmitting(true);

    setTimeout(() => {
      sintesaService.updateRtl(rtl.id, {
        programName: programName.trim(),
        targetKinerja: targetKinerja.trim(),
        anggaran: Number(anggaran) || 0,
        progress: Number(progress),
        status,
        priority,
        deadline
      });

      showToast(`Program RTL "${programName}" berhasil diperbarui!`, 'success');
      router.push(`/rtl/${rtl.id}`);
    }, 400);
  };

  if (!rtl) {
    return (
      <AppShell title="Edit Program RTL">
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Program RTL tidak ditemukan.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={`Edit RTL: ${rtl.code}`}
      subtitle="Pembaruan Progres Pelaksanaan & Alokasi Anggaran Mutu"
    >
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/rtl/${rtl.id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0077B6] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail RTL</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100">
            <div>
              <span className="font-mono text-xs font-bold text-[#0077B6] block mb-1">
                {rtl.code} • {rtl.unitName}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {rtl.programName}
              </h2>
            </div>
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100 text-[#0077B6]">
              <Target className="w-6 h-6" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <CustomDropdown
                  label="Status Pelaksanaan"
                  value={status}
                  onChange={(val) => setStatus(val as StatusRTL)}
                  options={[
                    { value: 'Direncanakan', label: 'Direncanakan' },
                    { value: 'Sedang Berjalan', label: 'Sedang Berjalan' },
                    { value: 'Selesai', label: 'Selesai (100% Tercapai)' },
                    { value: 'Dievaluasi', label: 'Dievaluasi Audit' },
                    { value: 'Tertunda', label: 'Tertunda' }
                  ]}
                />
              </div>

              <div>
                <CustomDropdown
                  label="Tingkat Prioritas"
                  value={priority}
                  onChange={(val) => setPriority(val as PrioritasRTL)}
                  options={[
                    { value: 'Tinggi', label: 'Tinggi (Krusial Akreditasi)' },
                    { value: 'Sedang', label: 'Sedang' },
                    { value: 'Rendah', label: 'Rendah' }
                  ]}
                />
              </div>
            </div>

            {/* Progres Slider (0 - 100%) */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase text-slate-700">
                  Progres Pelaksanaan ({progress}%)
                </label>
                <span className="text-xl font-mono font-black text-[#0077B6]">
                  {progress}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                className="w-full accent-[#0077B6] h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Target Kinerja */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Target Kinerja & Capaian Output
              </label>
              <textarea
                required
                rows={2}
                value={targetKinerja}
                onChange={(e) => setTargetKinerja(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-sm text-slate-900 outline-hidden leading-relaxed transition-colors"
              />
            </div>

            {/* Anggaran & Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Alokasi Anggaran RKAS (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={anggaran}
                  onChange={(e) => setAnggaran(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] font-mono text-sm text-slate-900 outline-hidden transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Tenggat Waktu Selesai
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-sm text-slate-900 outline-hidden transition-colors"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
              <Link
                href={`/rtl/${rtl.id}`}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer text-center transition-colors"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] hover:brightness-105 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Menyimpan...' : 'Perbarui Program RTL'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
