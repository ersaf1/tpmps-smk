'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/ToastFeedback';
import { sintesaService } from '@/lib/services/sintesaDataService';
import { PeriodeMutu, UserProfile } from '@/types/sintesa';
import {
  Calendar,
  Plus,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Archive,
  Edit2,
  Trash2,
  X,
  Building2,
  Award,
  AlertCircle
} from 'lucide-react';

export default function PeriodeManagementPage() {
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => sintesaService.getActiveUser());
  const [periodes, setPeriodes] = useState<PeriodeMutu[]>([]);
  const [activePeriode, setActivePeriode] = useState<PeriodeMutu | null>(null);

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [targetDelete, setTargetDelete] = useState<PeriodeMutu | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formTahunAjaran, setFormTahunAjaran] = useState('2025/2026');
  const [formSemester, setFormSemester] = useState<'Ganjil' | 'Genap'>('Genap');
  const [formStartDate, setFormStartDate] = useState('2026-01-05');
  const [formEndDate, setFormEndDate] = useState('2026-06-20');
  const [formTargetScore, setFormTargetScore] = useState<number>(95);
  const [formDescription, setFormDescription] = useState('');
  const [formSetAsActive, setFormSetAsActive] = useState(false);

  const loadData = () => {
    const user = sintesaService.getActiveUser();
    setCurrentUser(user);
    const all = sintesaService.getPeriodes();
    setPeriodes(all);
    setActivePeriode(sintesaService.getActivePeriode());
  };

  useEffect(() => {
    loadData();
  }, []);

  // ONLY KEPALA SEKOLAH (and Super Admin) can create or activate a period!
  const isKasek = useMemo(() => {
    if (!currentUser) return false;
    return currentUser.role === 'kepala_sekolah' || currentUser.role === 'admin';
  }, [currentUser]);

  const handleOpenAdd = () => {
    if (!isKasek) {
      showToast('Akses Ditolak: Hanya Kepala Sekolah yang berwenang membuat periode mutu baru.', 'error');
      return;
    }
    setFormName('Semester Genap 2025/2026');
    setFormTahunAjaran('2025/2026');
    setFormSemester('Genap');
    setFormStartDate('2026-01-05');
    setFormEndDate('2026-06-20');
    setFormTargetScore(95);
    setFormDescription('Periode implementasi SPMI siklus PPEPP Semester Genap Tahun Ajaran 2025/2026.');
    setFormSetAsActive(false);
    setIsAddOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formTahunAjaran.trim()) {
      showToast('Mohon lengkapi nama periode dan tahun ajaran.', 'error');
      return;
    }

    const result = sintesaService.createPeriode({
      name: formName.trim(),
      tahunAjaran: formTahunAjaran.trim(),
      semester: formSemester,
      startDate: formStartDate,
      endDate: formEndDate,
      targetScore: formTargetScore,
      description: formDescription.trim(),
      setAsActive: formSetAsActive
    });

    if (result.success) {
      showToast(result.message, 'success');
      setIsAddOpen(false);
      loadData();
    } else {
      showToast(result.message, 'error');
    }
  };

  const handleActivate = (id: string, name: string) => {
    if (!isKasek) {
      showToast('Akses Ditolak: Hanya Kepala Sekolah yang berwenang mengaktifkan periode.', 'error');
      return;
    }
    const result = sintesaService.setActivePeriode(id);
    if (result.success) {
      showToast(`Periode "${name}" berhasil diaktifkan oleh Kepala Sekolah!`, 'success');
      loadData();
    } else {
      showToast(result.message, 'error');
    }
  };

  const handleDeleteConfirm = () => {
    if (!targetDelete) return;
    if (!isKasek) {
      showToast('Akses Ditolak: Hanya Kepala Sekolah yang berwenang menghapus periode.', 'error');
      return;
    }
    sintesaService.deletePeriode(targetDelete.id);
    showToast(`Periode "${targetDelete.name}" telah dihapus.`, 'success');
    setTargetDelete(null);
    loadData();
  };

  return (
    <AppShell
      title="Manajemen Periode Mutu SPMI"
      subtitle="Penetapan & Pengawasan Periode Penjaminan Mutu oleh Kepala Sekolah SMK Negeri 2 Magelang"
    >
      {/* -------------------------------------------------------------
          TOP BAR: Active Periode Banner & Role Authority Notice
      ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs mb-5 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#0077B6] flex items-center justify-center text-white shadow-xs shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0077B6] border border-blue-200">
                  KEWENANGAN KEPALA SEKOLAH
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Siklus PPEPP SPMI
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                Periode Mutu Pendidikan Sekolah
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Berdasarkan Manual Mutu 2024, <strong>Kepala Sekolah adalah satu-satunya otoritas yang berhak membuat dan mengaktifkan Periode Penjaminan Mutu</strong>. Seluruh 18 unit kerja mengisi evaluasi dan dokumen berdasarkan periode aktif yang ditetapkan Kepala Sekolah.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isKasek ? (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="btn-enterprise px-4 py-2.5 rounded-xl bg-[#0077B6] hover:bg-[#0284C7] text-white text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ Buat Periode Baru</span>
              </button>
            ) : (
              <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Hanya Kepala Sekolah yang Dapat Membuat Periode</span>
              </div>
            )}
          </div>
        </div>

        {/* Highlight Card: Periode Aktif Saat Ini */}
        {activePeriode && (
          <div className="p-4 sm:p-5 rounded-xl bg-blue-50/50 border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  PERIODE AKTIF SAAT INI
                </span>
                <span className="text-xs font-mono font-bold text-[#0077B6]">
                  {activePeriode.code}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {activePeriode.name}
              </h2>

              <p className="text-xs text-slate-600">
                Rentang Waktu: <strong className="text-slate-800">{activePeriode.startDate}</strong> s/d{' '}
                <strong className="text-slate-800">{activePeriode.endDate}</strong> &bull; Target Capaian:{' '}
                <strong className="text-[#0077B6]">{activePeriode.targetScore.toFixed(1)}%</strong>
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-600 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Ditetapkan Secara Resmi Oleh:
              </span>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0077B6]" />
                <span>{activePeriode.createdBy}</span>
              </div>
              <span className="text-[11px] text-slate-500 block">
                SMK Negeri 2 Magelang
              </span>
            </div>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------
          CARD GRID: DAFTAR SEMUA PERIODE
      ------------------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0077B6]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Riwayat & Penetapan Periode SPMI ({periodes.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Penetapan Resmi Kepala Sekolah
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {periodes.map((p) => {
            const isActive = p.isActive;
            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between group shadow-xs ${
                  isActive
                    ? 'border-[#0077B6] bg-blue-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-extrabold'
                          : p.status === 'Arsip'
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
                          : 'bg-sky-50 text-[#0077B6] border-sky-200'
                      }`}
                    >
                      {isActive ? '● SEDANG AKTIF' : p.status.toUpperCase()}
                    </span>

                    <span className="font-mono text-[11px] font-bold text-slate-400">
                      {p.code}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 tracking-tight">
                    {p.name}
                  </h4>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {p.description || 'Tidak ada deskripsi tambahan.'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Tahun Ajaran:</span>
                      <strong className="text-slate-900">{p.tahunAjaran} ({p.semester})</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Rentang Waktu:</span>
                      <span className="font-mono text-slate-700">{p.startDate} s/d {p.endDate}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Target Skor:</span>
                      <span className="font-mono font-bold text-[#0077B6]">{p.targetScore.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-100/60">
                      <span>Penetap:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[170px]" title={p.createdBy}>
                        {p.createdBy}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {isKasek ? (
                    <>
                      {!isActive ? (
                        <button
                          type="button"
                          onClick={() => handleActivate(p.id, p.name)}
                          className="btn-enterprise flex-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-[#0077B6] text-center cursor-pointer transition-colors"
                        >
                          Jadikan Periode Aktif
                        </button>
                      ) : (
                        <div className="flex-1 py-2 rounded-xl bg-emerald-50 text-xs font-bold text-emerald-700 text-center border border-emerald-200 flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Periode Berjalan</span>
                        </div>
                      )}

                      {!isActive && (
                        <button
                          type="button"
                          onClick={() => setTargetDelete(p)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Hapus Periode"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="w-full py-2 text-center text-xs font-medium text-slate-400">
                      {isActive ? '✓ Periode SPMI yang sedang berlaku' : 'Periode Arsip'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* -------------------------------------------------------------
          MODAL: FORM BUAT PERIODE MUTU BARU (KHUSUS KEPALA SEKOLAH)
      ------------------------------------------------------------- */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0077B6]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Tetapkan Periode Mutu Baru</h3>
                  <p className="text-xs text-slate-500">Kewenangan Kepala Sekolah SMK Negeri 2 Magelang</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nama Periode Penjaminan Mutu *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Semester Genap 2025/2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs font-semibold text-slate-900 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Tahun Ajaran *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTahunAjaran}
                    onChange={(e) => setFormTahunAjaran(e.target.value)}
                    placeholder="2025/2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs font-mono text-slate-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Semester *
                  </label>
                  <select
                    value={formSemester}
                    onChange={(e) => setFormSemester(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs font-semibold text-slate-900 outline-hidden"
                  >
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Tanggal Mulai *
                  </label>
                  <input
                    type="date"
                    required
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs font-mono text-slate-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Tanggal Selesai *
                  </label>
                  <input
                    type="date"
                    required
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs font-mono text-slate-900 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Target Capaian Skor Sekolah (%)
                </label>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={formTargetScore}
                  onChange={(e) => setFormTargetScore(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs font-mono font-bold text-slate-900 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Deskripsi / Arahan Kebijakan Kepala Sekolah
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Catatan arahan fokus penjaminan mutu pada periode ini..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs text-slate-900 outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="setActiveCheckbox"
                  checked={formSetAsActive}
                  onChange={(e) => setFormSetAsActive(e.target.checked)}
                  className="rounded border-slate-300 text-[#0077B6] focus:ring-[#0077B6]"
                />
                <label htmlFor="setActiveCheckbox" className="text-xs text-slate-700 cursor-pointer font-medium">
                  Langsung jadikan sebagai <strong>Periode Aktif</strong> saat disimpan
                </label>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-[11px] text-[#0077B6] leading-relaxed">
                ℹ️ <strong>Pengesahan:</strong> Periode ini akan dicatat dalam audit trail atas nama <strong>Drs. H. Mulyono, M.Pd. (Kepala Sekolah)</strong>.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0077B6] hover:bg-[#0284C7] text-white font-bold cursor-pointer transition-colors shadow-xs"
                >
                  Tetapkan Periode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(targetDelete)}
        title="Hapus Periode Mutu?"
        message={`Apakah Anda yakin ingin menghapus data periode "${targetDelete?.name}"? Tindakan ini hanya dapat dilakukan oleh Kepala Sekolah.`}
        confirmLabel="Ya, Hapus Periode"
        cancelLabel="Batal"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setTargetDelete(null)}
      />
    </AppShell>
  );
}
