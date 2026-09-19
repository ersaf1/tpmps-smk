'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import CustomDropdown from '@/components/ui/CustomDropdown';
import { useToast } from '@/components/ui/ToastFeedback';
import { sigmaService } from '@/lib/services/sigmaDataService';
import { ProgramMutuRTL, StatusRTL, PrioritasRTL } from '@/types/sigma';
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
    const item = sigmaService.getRtlById(id);
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
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rtl) return;

    setIsSubmitting(true);

    setTimeout(() => {
      sigmaService.updateRtl(rtl.id, {
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
        <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto">
          <p className="text-sm text-[#94A3B8]">Program RTL tidak ditemukan.</p>
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
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#94A3B8] hover:text-[#22D3EE] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail RTL</span>
        </Link>

        <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
            <div>
              <span className="font-mono text-xs font-bold text-[#22D3EE] block mb-1">
                {rtl.code} • {rtl.unitName}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight">
                {rtl.programName}
              </h2>
            </div>
            <div className="p-3 rounded-2xl bg-[#0077B6]/20 border border-[#22D3EE]/30 text-[#22D3EE]">
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
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase text-[#F8FAFC]">
                  Progres Pelaksanaan ({progress}%)
                </label>
                <span className="text-xl font-mono font-black text-[#22D3EE]">
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
                className="w-full accent-[#22D3EE] h-2 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Target Kinerja */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                Target Kinerja & Capaian Output
              </label>
              <textarea
                required
                rows={2}
                value={targetKinerja}
                onChange={(e) => setTargetKinerja(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#0E1726]/90 border border-white/10 focus:border-[#22D3EE] text-sm text-[#F8FAFC] outline-hidden leading-relaxed"
              />
            </div>

            {/* Anggaran & Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                  Alokasi Anggaran RKAS (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={anggaran}
                  onChange={(e) => setAnggaran(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#0E1726]/90 border border-white/10 focus:border-[#22D3EE] font-mono text-sm text-[#F8FAFC] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                  Tenggat Waktu Selesai
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#0E1726]/90 border border-white/10 focus:border-[#22D3EE] text-sm text-[#F8FAFC] outline-hidden"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3">
              <Link
                href={`/rtl/${rtl.id}`}
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
                <span>{isSubmitting ? 'Menyimpan...' : 'Perbarui Program RTL'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
