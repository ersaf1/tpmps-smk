'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import CustomDropdown from '@/components/ui/CustomDropdown';
import { useToast } from '@/components/ui/ToastFeedback';
import { sigmaService, INITIAL_UNITS, INITIAL_STANDARDS } from '@/lib/services/sigmaDataService';
import { PrioritasRTL } from '@/types/sigma';
import { ArrowLeft, Save, Target } from 'lucide-react';

export default function CreateRtlPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [programName, setProgramName] = useState('');
  const [unitId, setUnitId] = useState(INITIAL_UNITS[0].id);
  const [standardId, setStandardId] = useState(INITIAL_STANDARDS[0].id.toString());
  const [latarBelakang, setLatarBelakang] = useState('');
  const [targetKinerja, setTargetKinerja] = useState('');
  const [anggaran, setAnggaran] = useState('15000000');
  const [deadline, setDeadline] = useState('2025-12-20');
  const [priority, setPriority] = useState<PrioritasRTL>('Sedang');

  const unitOptions = INITIAL_UNITS.map((u) => ({
    value: u.id,
    label: `${u.code} - ${u.name}`
  }));

  const standardOptions = INITIAL_STANDARDS.map((s) => ({
    value: s.id.toString(),
    label: `${s.code} - ${s.name}`
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!programName.trim()) {
      showToast('Harap isi nama program RTL.', 'warning');
      return;
    }

    setIsSubmitting(true);
    const selectedUnit = INITIAL_UNITS.find((u) => u.id === unitId);
    const selectedStandard = INITIAL_STANDARDS.find((s) => s.id.toString() === standardId);
    const code = `RTL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    setTimeout(() => {
      sigmaService.createRtl({
        code,
        standardId: Number(standardId),
        standardName: selectedStandard?.name || 'Standar Mutu',
        unitId,
        unitName: selectedUnit?.name || 'Unit Kerja',
        programName: programName.trim(),
        latarBelakang: latarBelakang.trim(),
        targetKinerja: targetKinerja.trim(),
        anggaran: Number(anggaran) || 0,
        deadline,
        progress: 0,
        priority,
        status: 'Direncanakan',
        pjUserName: selectedUnit?.picName
      });

      showToast(`Program RTL "${programName}" berhasil disusun!`, 'success');
      router.push('/rtl');
    }, 450);
  };

  return (
    <AppShell
      title="Penyusunan Program RTL Baru"
      subtitle="Perencanaan Tindak Lanjut Pemenuhan dan Peningkatan Mutu Sekolah"
    >
      <div className="max-w-4xl mx-auto">
        <Link
          href="/rtl"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#94A3B8] hover:text-[#22D3EE] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar RTL</span>
        </Link>

        <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight">
                Rencana Tindak Lanjut (RTL) Mutu
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                Formulir penyusunan program perbaikan indikator SNP yang belum mencapai target mutu.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-[#0077B6]/20 border border-[#22D3EE]/30 text-[#22D3EE]">
              <Target className="w-6 h-6" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Program */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                Nama Program Tindak Lanjut
              </label>
              <input
                type="text"
                required
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                placeholder="Contoh: Pengadaan & Peremajaan Hardware Lab Komputer PPLG"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#0E1726]/90 border border-white/10 focus:border-[#22D3EE] text-sm text-[#F8FAFC] outline-hidden"
              />
            </div>

            {/* Unit & Standard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <CustomDropdown
                  label="Unit Kerja Pelaksana"
                  value={unitId}
                  onChange={setUnitId}
                  options={unitOptions}
                />
              </div>

              <div>
                <CustomDropdown
                  label="Terkait Standar SNP"
                  value={standardId}
                  onChange={setStandardId}
                  options={standardOptions}
                />
              </div>
            </div>

            {/* Target Kinerja & Latar Belakang */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                Target Kinerja & Output Terukur
              </label>
              <textarea
                required
                rows={2}
                value={targetKinerja}
                onChange={(e) => setTargetKinerja(e.target.value)}
                placeholder="Contoh: 100% workstation memenuhi spesifikasi RAM 16GB dan SSD NVMe..."
                className="w-full p-3.5 rounded-xl bg-[#0E1726]/90 border border-white/10 focus:border-[#22D3EE] text-sm text-[#F8FAFC] outline-hidden leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                Latar Belakang & Identifikasi Akar Masalah
              </label>
              <textarea
                rows={3}
                value={latarBelakang}
                onChange={(e) => setLatarBelakang(e.target.value)}
                placeholder="Jelaskan temuan audit, alasan perlunya perbaikan..."
                className="w-full p-3.5 rounded-xl bg-[#0E1726]/90 border border-white/10 focus:border-[#22D3EE] text-sm text-[#F8FAFC] outline-hidden leading-relaxed"
              />
            </div>

            {/* Anggaran, Deadline & Prioritas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                  Estimasi Anggaran (Rp)
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

              <div>
                <CustomDropdown
                  label="Tingkat Prioritas"
                  value={priority}
                  onChange={(val) => setPriority(val as PrioritasRTL)}
                  options={[
                    { value: 'Tinggi', label: 'Tinggi (Krusial Akreditasi)' },
                    { value: 'Sedang', label: 'Sedang (Rutin)' },
                    { value: 'Rendah', label: 'Rendah (Jangka Panjang)' }
                  ]}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3">
              <Link
                href="/rtl"
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
                <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Program RTL'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
