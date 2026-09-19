'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import CustomDropdown from '@/components/ui/CustomDropdown';
import { useToast } from '@/components/ui/ToastFeedback';
import { sigmaService, INITIAL_UNITS, INITIAL_STANDARDS } from '@/lib/services/sigmaDataService';
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
      sigmaService.createEvaluation({
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
      subtitle="Pengisian Formulir Penilaian Mandiri Instrumen SPMI SMK Negeri 2 Magelang"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/evaluasi"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#94A3B8] hover:text-[#22D3EE] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Evaluasi</span>
        </Link>

        {/* Dedicated Create Form Card */}
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight">
                Formulir Evaluasi Mandiri Unit
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                Data akan tersimpan secara terstruktur dan terhubung langsung ke siklus PPEPP TPMPS.
              </p>
            </div>
            <div className="hidden sm:flex p-3 rounded-2xl bg-[#0077B6]/20 border border-[#22D3EE]/30 text-[#22D3EE]">
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
                <p className="text-[11px] text-[#94A3B8] mt-1.5">
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
                <p className="text-[11px] text-[#94A3B8] mt-1.5">
                  Standar mutu yang menjadi acuan penilaian instrumen ini.
                </p>
              </div>
            </div>

            {/* Row 2: Periode & Kode Indikator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                  Periode Evaluasi
                </label>
                <input
                  type="text"
                  required
                  value={periode}
                  onChange={(e) => setPeriode(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#0E1726]/90 border border-white/10 focus:border-[#22D3EE] text-sm text-[#F8FAFC] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                  Kode Indikator Mutu
                </label>
                <input
                  type="text"
                  required
                  value={indikatorCode}
                  onChange={(e) => setIndikatorCode(e.target.value)}
                  placeholder="Contoh: SKL-1.2 atau ISI-2.3"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#0E1726]/90 border border-white/10 focus:border-[#22D3EE] font-mono text-sm text-[#F8FAFC] outline-hidden"
                />
              </div>
            </div>

            {/* Row 3: Nama / Bunyi Indikator */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                Rumusan / Nama Indikator Mutu
              </label>
              <textarea
                required
                rows={3}
                value={indikatorName}
                onChange={(e) => setIndikatorName(e.target.value)}
                placeholder="Tuliskan rumusan indikator mutu yang sedang dievaluasi..."
                className="w-full p-3.5 rounded-xl bg-[#0E1726]/90 border border-white/10 focus:border-[#22D3EE] text-sm text-[#F8FAFC] outline-hidden leading-relaxed"
              />
            </div>

            {/* Row 4: Nilai Mandiri (0-100) */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                    Nilai Penilaian Mandiri (0 - 100%)
                  </label>
                  <span className="text-[11px] text-[#94A3B8]">
                    Berdasarkan keterpenuhan eviden dan bukti fisik riil
                  </span>
                </div>
                <div className="text-2xl font-black font-mono text-[#22D3EE]">
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
                className="w-full accent-[#22D3EE] h-2 bg-white/10 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
                <span>0% (Belum Ada)</span>
                <span>70% (Cukup)</span>
                <span>85% (Standar SMK)</span>
                <span>100% (Sempurna)</span>
              </div>
            </div>

            {/* Row 5: Catatan Unit */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                Catatan & Narasi Ketercapaian Unit
              </label>
              <textarea
                rows={3}
                value={catatanUnit}
                onChange={(e) => setCatatanUnit(e.target.value)}
                placeholder="Jelaskan kondisi faktual di lapangan, kendala, atau prestasi yang relevan..."
                className="w-full p-3.5 rounded-xl bg-[#0E1726]/90 border border-white/10 focus:border-[#22D3EE] text-sm text-[#F8FAFC] outline-hidden leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3">
              <Link
                href="/evaluasi"
                className="w-full sm:w-auto btn-enterprise px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 cursor-pointer text-center"
              >
                Batalkan
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto btn-enterprise px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] via-[#0096c7] to-[#22D3EE] hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(34,211,238,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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
