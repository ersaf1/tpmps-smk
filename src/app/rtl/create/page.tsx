'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import CustomDropdown from '@/components/ui/CustomDropdown';
import { useToast } from '@/components/ui/ToastFeedback';
import { sintesaService, INITIAL_UNITS, INITIAL_STANDARDS } from '@/lib/services/sintesaDataService';
import { PrioritasRTL } from '@/types/sintesa';
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
      sintesaService.createRtl({
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
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0077B6] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar RTL</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Rencana Tindak Lanjut (RTL) Mutu
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Formulir penyusunan program perbaikan indikator SNP yang belum mencapai target mutu.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-[#0077B6]">
              <Target className="w-6 h-6" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Program */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Nama Program Tindak Lanjut
              </label>
              <input
                type="text"
                required
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                placeholder="Contoh: Pengadaan & Peremajaan Hardware Lab Komputer PPLG"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-sm text-slate-900 outline-hidden transition-all shadow-2xs"
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Target Kinerja & Output Terukur
              </label>
              <textarea
                required
                rows={2}
                value={targetKinerja}
                onChange={(e) => setTargetKinerja(e.target.value)}
                placeholder="Contoh: 100% workstation memenuhi spesifikasi RAM 16GB dan SSD NVMe..."
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-sm text-slate-900 outline-hidden leading-relaxed transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Latar Belakang & Identifikasi Akar Masalah
              </label>
              <textarea
                rows={3}
                value={latarBelakang}
                onChange={(e) => setLatarBelakang(e.target.value)}
                placeholder="Jelaskan temuan audit, alasan perlunya perbaikan..."
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-sm text-slate-900 outline-hidden leading-relaxed transition-all shadow-2xs"
              />
            </div>

            {/* Anggaran, Deadline & Prioritas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Estimasi Anggaran (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={anggaran}
                  onChange={(e) => setAnggaran(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] font-mono text-sm text-slate-900 outline-hidden transition-all shadow-2xs"
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
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-sm text-slate-900 outline-hidden transition-all shadow-2xs"
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
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
              <Link
                href="/rtl"
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
                <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Program RTL'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
