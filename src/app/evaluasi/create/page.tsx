'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import CustomDropdown from '@/components/ui/CustomDropdown';
import { useToast } from '@/components/ui/ToastFeedback';
import { sintesaService, INITIAL_UNITS, INITIAL_STANDARDS } from '@/lib/services/sintesaDataService';
import { ArrowLeft, Save, Shield, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function CreateEvaluasiPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [unitId, setUnitId] = useState(INITIAL_UNITS[0].id);
  const [standardId, setStandardId] = useState(INITIAL_STANDARDS[0].id.toString());
  const [periode, setPeriode] = useState('Semester Ganjil 2025/2026');
  const [indikatorCode, setIndikatorCode] = useState('SKL-1.2');
  const [indikatorName, setIndikatorName] = useState(
    'Tingkat keterserapan lulusan SMK pada IDUKA mitra, wirausaha, atau studi lanjut minimal 85%'
  );
  const [nilaiMandiri, setNilaiMandiri] = useState(88.0);
  const [catatanUnit, setCatatanUnit] = useState('');

  const unitOptions = INITIAL_UNITS.map((u) => ({
    value: u.id,
    label: `${u.code} - ${u.name}`,
    badge: u.category
  }));

  const standardOptions = INITIAL_STANDARDS.map((s) => ({
    value: s.id.toString(),
    label: `${s.code} - ${s.name}`,
    badge: `Bobot: ${s.weight}%`
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedUnit = INITIAL_UNITS.find((u) => u.id === unitId);
    const selectedStandard = INITIAL_STANDARDS.find((s) => s.id.toString() === standardId);

    const code = `EV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    setTimeout(() => {
      sintesaService.createEvaluation({
        code,
        standardId: Number(standardId),
        standardName: selectedStandard?.name || 'Standar Mutu',
        unitId,
        unitName: selectedUnit?.name || 'Unit Kerja',
        periode,
        indikatorCode: indikatorCode.trim(),
        indikatorName: indikatorName.trim(),
        nilaiMandiri: Number(nilaiMandiri),
        status: 'Diajukan',
        catatanUnit: catatanUnit.trim()
      });

      showToast(`Evaluasi instrumen ${indikatorCode} berhasil disimpan & diajukan ke Tim TPMPS!`, 'success');
      router.push('/evaluasi');
    }, 500);
  };

  return (
    <AppShell
      title="Input Evaluasi Mutu Baru"
      subtitle="Pengisian Formulir Penilaian Mandiri Instrumen Mutu Pendidikan SMK Negeri 2 Magelang"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/evaluasi"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0077B6] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Evaluasi</span>
        </Link>

        {/* Dedicated Create Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Formulir Evaluasi Mandiri Unit
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Data akan tersimpan secara terstruktur dan terhubung langsung ke siklus PPEPP TPMPS.
              </p>
            </div>
            <div className="hidden sm:flex p-3 rounded-2xl bg-sky-50 border border-sky-200 text-[#0077B6]">
              <Shield className="w-6 h-6" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Unit Kerja & Standar SNP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <CustomDropdown
                  label="Unit Kerja Pelaksana"
                  value={unitId}
                  onChange={setUnitId}
                  options={unitOptions}
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Pilih unit kerja atau program keahlian yang bertanggung jawab.
                </p>
              </div>

              <div>
                <CustomDropdown
                  label="Standar Nasional Pendidikan (SNP)"
                  value={standardId}
                  onChange={setStandardId}
                  options={standardOptions}
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Standar mutu yang menjadi acuan penilaian instrumen ini.
                </p>
              </div>
            </div>

            {/* Row 2: Periode & Kode Indikator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Periode Evaluasi
                </label>
                <input
                  type="text"
                  required
                  value={periode}
                  onChange={(e) => setPeriode(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-sm text-slate-900 outline-hidden transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Kode Indikator Mutu
                </label>
                <input
                  type="text"
                  required
                  value={indikatorCode}
                  onChange={(e) => setIndikatorCode(e.target.value)}
                  placeholder="Contoh: SKL-1.2 atau ISI-2.3"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] font-mono text-sm text-slate-900 outline-hidden transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Row 3: Nama / Bunyi Indikator */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Rumusan / Nama Indikator Mutu
              </label>
              <textarea
                required
                rows={3}
                value={indikatorName}
                onChange={(e) => setIndikatorName(e.target.value)}
                placeholder="Tuliskan rumusan indikator mutu yang sedang dievaluasi..."
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-sm text-slate-900 outline-hidden leading-relaxed transition-all shadow-2xs"
              />
            </div>

            {/* Row 4: Nilai Mandiri (0-100) */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-900">
                    Nilai Penilaian Mandiri (0 - 100%)
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Berdasarkan keterpenuhan eviden dan bukti fisik riil
                  </span>
                </div>
                <div className="text-2xl font-black font-mono text-[#0077B6]">
                  {Number(nilaiMandiri).toFixed(1)}%
                </div>
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

              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>0% (Belum Ada)</span>
                <span>70% (Cukup)</span>
                <span>85% (Standar SMK)</span>
                <span>100% (Sempurna)</span>
              </div>
            </div>

            {/* Row 5: Catatan Unit */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Catatan & Narasi Ketercapaian Unit
              </label>
              <textarea
                rows={3}
                value={catatanUnit}
                onChange={(e) => setCatatanUnit(e.target.value)}
                placeholder="Jelaskan kondisi faktual di lapangan, kendala, atau prestasi yang relevan..."
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-sm text-slate-900 outline-hidden leading-relaxed transition-all shadow-2xs"
              />
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
              <Link
                href="/evaluasi"
                className="w-full sm:w-auto btn-enterprise px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer text-center transition-colors"
              >
                Batalkan
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto btn-enterprise px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] hover:brightness-105 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Menyimpan...' : 'Simpan & Ajukan Evaluasi'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
