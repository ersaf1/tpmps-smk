'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import CustomDropdown from '@/components/ui/CustomDropdown';
import { useToast } from '@/components/ui/ToastFeedback';
import { sigmaService, INITIAL_UNITS, INITIAL_STANDARDS } from '@/lib/services/sigmaDataService';
import { ArrowLeft, UploadCloud, FileText, CheckCircle2, Shield } from 'lucide-react';

function UploadDokumenForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const prefillEvalId = searchParams.get('evalId');
  const prefillStandardId = searchParams.get('standardId');

  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [fileType, setFileType] = useState<'pdf' | 'excel' | 'word' | 'image'>('pdf');
  const [unitId, setUnitId] = useState(INITIAL_UNITS[0].id);
  const [standardId, setStandardId] = useState(prefillStandardId || INITIAL_STANDARDS[0].id.toString());
  const [version, setVersion] = useState('v1.0');
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const unitOptions = INITIAL_UNITS.map((u) => ({
    value: u.id,
    label: `${u.code} - ${u.name}`,
    badge: u.category
  }));

  const standardOptions = INITIAL_STANDARDS.map((s) => ({
    value: s.id.toString(),
    label: `${s.code} - ${s.name}`,
    badge: `Bobot ${s.weight}%`
  }));

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) setFileType('excel');
      else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) setFileType('word');
      else if (file.name.match(/\.(png|jpe?g|webp)$/)) setFileType('image');
      else setFileType('pdf');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) setFileType('excel');
      else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) setFileType('word');
      else if (file.name.match(/\.(png|jpe?g|webp)$/)) setFileType('image');
      else setFileType('pdf');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName && !title) {
      showToast('Harap pilih berkas atau isi judul dokumen.', 'warning');
      return;
    }

    setIsUploading(true);
    const currentUser = sigmaService.getActiveUser();
    const selectedUnit = INITIAL_UNITS.find((u) => u.id === unitId);
    const selectedStandard = INITIAL_STANDARDS.find((s) => s.id.toString() === standardId);

    const code = `DOC-${selectedStandard?.code.replace('SNP-', '') || 'MUT'}-${Math.floor(100 + Math.random() * 900)}`;

    setTimeout(() => {
      sigmaService.createDocument({
        code,
        title: title.trim() || fileName,
        fileName: fileName || `${title.replace(/\s+/g, '_')}.${fileType === 'excel' ? 'xlsx' : fileType === 'word' ? 'docx' : 'pdf'}`,
        fileUrl: `/storage/documents/${code.toLowerCase()}.pdf`,
        fileSize,
        fileType,
        standardId: Number(standardId),
        standardName: selectedStandard?.name,
        unitId,
        unitName: selectedUnit?.name || 'Unit Kerja',
        version,
        status: 'Menunggu Review',
        notes: notes.trim(),
        uploadedBy: currentUser.id,
        uploadedByName: currentUser.fullName
      });

      showToast(`Berkas "${title}" berhasil diunggah ke repositori mutu!`, 'success');
      router.push('/dokumen');
    }, 600);
  };

  return (
    <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight">
            Upload Dokumen Bukti Fisik
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Berkas akan dienkripsi dan diarsipkan dalam Supabase Storage dengan akses terproteksi.
          </p>
        </div>
        <div className="p-3 rounded-2xl bg-[#0077B6]/20 border border-[#22D3EE]/30 text-[#22D3EE]">
          <UploadCloud className="w-6 h-6" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Dropzone Area */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className="p-8 rounded-3xl border-2 border-dashed border-[#22D3EE]/30 hover:border-[#22D3EE] bg-[#0E1726]/60 hover:bg-[#0E1726] transition-all text-center flex flex-col items-center justify-center cursor-pointer relative group"
        >
          <input
            type="file"
            onChange={handleFileSelect}
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept=".pdf,.xlsx,.xls,.docx,.doc,.png,.jpg,.jpeg"
          />
          <div className="w-16 h-16 rounded-2xl bg-[#0077B6]/20 border border-[#22D3EE]/30 text-[#22D3EE] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h4 className="text-sm font-bold text-[#F8FAFC]">
            {fileName ? fileName : 'Tarik & Letakkan Berkas di Sini'}
          </h4>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-sm">
            Mendukung PDF, Excel (.xlsx), Word (.docx), dan Foto Bukti (.png, .jpg) hingga 50 MB
          </p>
          {fileName && (
            <div className="mt-3 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
              ✓ Berkas terpilih: {fileName} ({fileSize})
            </div>
          )}
        </div>

        {/* Judul Dokumen */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
            Judul Resmi Dokumen
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: SK Penetapan Kurikulum Operasional Sekolah 2025/2026"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#0E1726]/90 border border-white/10 focus:border-[#22D3EE] text-sm text-[#F8FAFC] outline-hidden"
          />
        </div>

        {/* Unit & Standard Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <CustomDropdown
              label="Unit Kerja Pengunggah"
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

        {/* Versi & Format */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
              Versi Dokumen
            </label>
            <input
              type="text"
              required
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="v1.0"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#0E1726]/90 border border-white/10 focus:border-[#22D3EE] font-mono text-sm text-[#F8FAFC] outline-hidden"
            />
          </div>

          <div>
            <CustomDropdown
              label="Kategori / Tipe Berkas"
              value={fileType}
              onChange={(val) => setFileType(val as any)}
              options={[
                { value: 'pdf', label: 'PDF Document (.pdf)' },
                { value: 'excel', label: 'Excel Spreadsheet (.xlsx)' },
                { value: 'word', label: 'Word Document (.docx)' },
                { value: 'image', label: 'Gambar / Foto Bukti (.png, .jpg)' }
              ]}
            />
          </div>
        </div>

        {/* Catatan Tambahan */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
            Keterangan & Catatan Berkas
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Rincian nomor surat, tanggal pengesahan, atau konteks instrumen..."
            className="w-full p-3.5 rounded-xl bg-[#0E1726]/90 border border-white/10 focus:border-[#22D3EE] text-sm text-[#F8FAFC] outline-hidden leading-relaxed"
          />
        </div>

        {/* Action buttons */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3">
          <Link
            href="/dokumen"
            className="w-full sm:w-auto btn-enterprise px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 cursor-pointer text-center"
          >
            Batal
          </Link>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full sm:w-auto btn-enterprise px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] via-[#0096c7] to-[#22D3EE] hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(34,211,238,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isUploading ? 'Mengunggah ke Storage...' : 'Simpan & Unggah Dokumen'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function UploadDokumenPage() {
  return (
    <AppShell
      title="Upload Berkas Bukti Mutu"
      subtitle="Pengunggahan Dokumen Pendukung Instrumen Penjaminan Mutu Pendidikan Sekolah"
    >
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dokumen"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#94A3B8] hover:text-[#22D3EE] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Bank Bukti</span>
        </Link>

        <Suspense
          fallback={
            <div className="glass-panel p-12 text-center rounded-3xl">
              <div className="w-8 h-8 border-2 border-[#22D3EE] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span className="text-xs text-[#94A3B8]">Memuat formulir unggah...</span>
            </div>
          }
        >
          <UploadDokumenForm />
        </Suspense>
      </div>
    </AppShell>
  );
}
