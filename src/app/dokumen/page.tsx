'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import CustomDropdown from '@/components/ui/CustomDropdown';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/ToastFeedback';
import { sintesaService } from '@/lib/services/sintesaDataService';
import { BuktiDokumen, StatusDokumen } from '@/types/sintesa';
import {
  Search,
  UploadCloud,
  FileText,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Trash2,
  Download,
  Filter,
  ShieldCheck
} from 'lucide-react';

export default function DokumenListPage() {
  const { showToast } = useToast();
  const [documents, setDocuments] = useState<BuktiDokumen[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  const [targetDelete, setTargetDelete] = useState<BuktiDokumen | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setDocuments(sintesaService.getDocuments());
  };

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchCode = doc.code.toLowerCase().includes(q);
        const matchUnit = doc.unitName.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchUnit) return false;
      }
      if (selectedStatus !== 'ALL' && doc.status !== selectedStatus) return false;
      if (selectedType !== 'ALL' && doc.fileType !== selectedType) return false;
      return true;
    });
  }, [documents, searchQuery, selectedStatus, selectedType]);

  const handleDelete = () => {
    if (!targetDelete) return;
    setIsDeleting(true);
    setTimeout(() => {
      sintesaService.deleteDocument(targetDelete.id);
      showToast(`Dokumen "${targetDelete.title}" berhasil dihapus.`, 'success');
      setTargetDelete(null);
      setIsDeleting(false);
      loadData();
    }, 400);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-400" />;
      case 'excel':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case 'word':
        return <FileCode className="w-5 h-5 text-[#0077B6]" />;
      default:
        return <ImageIcon className="w-5 h-5 text-[#F6B73C]" />;
    }
  };

  const getStatusBadge = (status: StatusDokumen) => {
    switch (status) {
      case 'Terverifikasi':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'Menunggu Review':
        return 'bg-sky-50 border-sky-200 text-[#0077B6]';
      case 'Perlu Revisi':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'Ditolak':
        return 'bg-rose-50 border-rose-200 text-rose-700';
    }
  };

  return (
    <AppShell
      title="Bank Bukti Fisik Digital"
      subtitle="Pusat Repositori Bukti Mutu Standar Pendidikan SMK Negeri 2 Magelang"
    >
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Bank Bukti Mutu
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Total {filteredDocs.length} berkas bukti terverifikasi & terarsip digital
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dokumen/validasi"
            className="btn-enterprise px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-[#0077B6] flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Antrean Validasi</span>
          </Link>

          <Link
            href="/dokumen/upload"
            className="btn-enterprise px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] hover:brightness-105 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Berkas Baru</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-3xl p-5 mb-6 border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          <div className="sm:col-span-6 relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Cari Berkas Bukti
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul dokumen, kode, atau unit pengunggah..."
                className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-hidden transition-all shadow-2xs"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <CustomDropdown
              label="Status Validasi"
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={[
                { value: 'ALL', label: 'Semua Status' },
                { value: 'Terverifikasi', label: 'Terverifikasi (Sah)' },
                { value: 'Menunggu Review', label: 'Menunggu Review' },
                { value: 'Perlu Revisi', label: 'Perlu Revisi' },
                { value: 'Ditolak', label: 'Ditolak' }
              ]}
            />
          </div>

          <div className="sm:col-span-3">
            <CustomDropdown
              label="Format Berkas"
              value={selectedType}
              onChange={setSelectedType}
              options={[
                { value: 'ALL', label: 'Semua Format' },
                { value: 'pdf', label: 'PDF Document' },
                { value: 'excel', label: 'Excel Spreadsheet' },
                { value: 'word', label: 'Word Document' },
                { value: 'image', label: 'Gambar / Foto Bukti' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
            Tidak ada dokumen yang sesuai kriteria.
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-sky-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 group-hover:scale-105 transition-transform">
                    {getFileIcon(doc.fileType)}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                      doc.status
                    )}`}
                  >
                    {doc.status}
                  </span>
                </div>

                <div className="font-mono text-[11px] font-bold text-[#0077B6]">
                  {doc.code}
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight mt-1 line-clamp-2 leading-snug">
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                  {doc.notes || 'Tidak ada catatan tambahan.'}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Unit:</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[160px]">
                      {doc.unitName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ukuran & Versi:</span>
                    <span className="font-mono text-[#0077B6] font-semibold">
                      {doc.fileSize} • {doc.version}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/dokumen/${doc.id}`}
                  className="btn-enterprise flex-1 py-2 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#0077B6] text-center shadow-2xs transition-colors"
                >
                  Detail & Pratinjau
                </Link>

                <button
                  type="button"
                  title="Hapus Dokumen"
                  onClick={() => setTargetDelete(doc)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(targetDelete)}
        title="Hapus Berkas Dokumen?"
        message={`Apakah Anda yakin ingin menghapus berkas "${targetDelete?.title}"? Berkas yang sudah dihapus tidak dapat dipulihkan.`}
        confirmLabel="Ya, Hapus Berkas"
        cancelLabel="Batal"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setTargetDelete(null)}
      />
    </AppShell>
  );
}
