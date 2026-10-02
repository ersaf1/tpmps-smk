'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { useToast } from '@/components/ui/ToastFeedback';
import { sintesaService, INITIAL_UNITS, INITIAL_STANDARDS } from '@/lib/services/sintesaDataService';
import { BuktiDokumen, UnitKerja, StatusDokumen } from '@/types/sintesa';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileText,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  Eye,
  Download,
  Filter,
  Search,
  Building2,
  Folder,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  X,
  RotateCcw,
  Check,
  MessageSquare
} from 'lucide-react';

export default function DokumenValidasiPage() {
  const { showToast } = useToast();
  const [documents, setDocuments] = useState<BuktiDokumen[]>([]);
  const [units, setUnits] = useState<UnitKerja[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');
  const [selectedStandard, setSelectedStandard] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Inspector Modal State
  const [inspectDoc, setInspectDoc] = useState<BuktiDokumen | null>(null);
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const loadData = () => {
    const allDocs = sintesaService.getDocuments();
    setDocuments(allDocs);
    const allUnits = sintesaService.getUnits();
    setUnits(allUnits);
  };

  useEffect(() => {
    const timer = window.setTimeout(loadData, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleValidate = (id: string, status: StatusDokumen, notes?: string) => {
    setIsProcessing(true);
    const user = sintesaService.getActiveUser();
    
    setTimeout(() => {
      sintesaService.updateDocument(id, {
        status,
        notes: notes || inspectDoc?.notes || (status === 'Terverifikasi' ? 'Dokumen telah diperiksa dan disahkan sesuai instrumen SNP.' : 'Perlu revisi sesuai catatan auditor.'),
        verifiedBy: user.id,
        verifiedByName: user.fullName,
        verifiedAt: new Date().toISOString()
      });

      showToast(`Dokumen berhasil ${status === 'Terverifikasi' ? 'disahkan' : status === 'Perlu Revisi' ? 'dikembalikan untuk revisi' : 'ditolak'}.`, 'success');
      setIsProcessing(false);
      setInspectDoc(null);
      loadData();
    }, 400);
  };

  const openInspector = (doc: BuktiDokumen) => {
    setInspectDoc(doc);
    setReviewNotes(doc.notes || '');
  };

  // Filtered Documents
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      // Unit filter
      if (selectedUnit !== 'ALL' && doc.unitId !== selectedUnit) return false;
      // Category / Penempatan filter
      if (selectedCategory !== 'ALL' && doc.kategoriDokumen !== selectedCategory) return false;
      // Standard filter
      if (selectedStandard !== 'ALL' && doc.standardId.toString() !== selectedStandard) return false;
      // Status filter
      if (selectedStatus !== 'ALL' && doc.status !== selectedStatus) return false;
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchCode = doc.code.toLowerCase().includes(q);
        const matchUnit = doc.unitName.toLowerCase().includes(q);
        const matchFile = doc.fileName.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchUnit && !matchFile) return false;
      }
      return true;
    });
  }, [documents, selectedUnit, selectedCategory, selectedStandard, selectedStatus, searchQuery]);

  // Statistics
  const totalCount = documents.length;
  const pendingCount = documents.filter((d) => d.status === 'Menunggu Review').length;
  const verifiedCount = documents.filter((d) => d.status === 'Terverifikasi').length;
  const revisionCount = documents.filter((d) => d.status === 'Perlu Revisi').length;
  const auditProgress = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 100;

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'excel':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
      case 'word':
        return <FileCode className="w-5 h-5 text-blue-500" />;
      default:
        return <ImageIcon className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: StatusDokumen) => {
    switch (status) {
      case 'Terverifikasi':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Disahkan</span>
          </span>
        );
      case 'Menunggu Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Menunggu Validasi</span>
          </span>
        );
      case 'Perlu Revisi':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
            <span>Perlu Revisi</span>
          </span>
        );
      case 'Ditolak':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Ditolak</span>
          </span>
        );
    }
  };

  return (
    <AppShell
      title="Pemeriksaan & Validasi Berkas Unit"
      subtitle="Portal Verifikasi & Pengesahan Dokumen Bukti Fisik oleh Kepala Sekolah & Tim TPMPS"
    >
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* KPI Stats Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Berkas Masuk</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{totalCount}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Dari 15 Unit Kerja Sekolah</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <Folder className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-amber-50/30">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Menunggu Validasi</p>
              <h3 className="text-2xl font-black text-amber-700 mt-1">{pendingCount}</h3>
              <p className="text-[11px] text-amber-600/80 mt-0.5">Perlu ditinjau pimpinan</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-700 flex items-center justify-center">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-emerald-50/30">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Telah Disahkan</p>
              <h3 className="text-2xl font-black text-emerald-700 mt-1">{verifiedCount}</h3>
              <p className="text-[11px] text-emerald-600/80 mt-0.5">Siap untuk Laporan EDS</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-orange-200/80 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-orange-50/30">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-600">Perlu Revisi</p>
              <h3 className="text-2xl font-black text-orange-700 mt-1">{revisionCount}</h3>
              <p className="text-[11px] text-orange-600/80 mt-0.5">Menunggu respon unit</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-100/70 border border-orange-300 text-orange-700 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter & Unit Selection Toolbar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0077B6]/10 text-[#0077B6]">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Filter Pemeriksaan Berkas</h3>
                <p className="text-xs text-slate-500">Pilih unit kerja atau standar untuk menyaring antrean dokumen</p>
              </div>
            </div>

            {/* Quick Unit Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">Unit Kerja:</span>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:bg-white"
              >
                <option value="ALL">Semua {units.length} Unit Kerja</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari judul berkas, nomor kode, atau nama file..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
              />
            </div>

            {/* Standard SNP Filter */}
            <div>
              <select
                value={selectedStandard}
                onChange={(e) => setSelectedStandard(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
              >
                <option value="ALL">Semua Standar Nasional (8 SNP)</option>
                {INITIAL_STANDARDS.map((s) => (
                  <option key={s.id} value={s.id.toString()}>
                    {s.code}: {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Penempatan Dokumen Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
              >
                <option value="ALL">Semua Penempatan Dokumen</option>
                <option value="MM">Level 1: Manual Mutu (MM)</option>
                <option value="PM">Level 2: Prosedur Mutu (PM)</option>
                <option value="PK">Level 3: Petunjuk Kerja (PK)</option>
                <option value="CM">Level 4: Catatan Mutu (CM / F)</option>
                <option value="LAINNYA">Dokumen Lainnya / Pendukung</option>
                <option value="REKAP">Rekapitulasi Capaian Unit</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
              >
                <option value="ALL">Semua Status Validasi</option>
                <option value="Menunggu Review">Menunggu Validasi</option>
                <option value="Terverifikasi">Telah Disahkan</option>
                <option value="Perlu Revisi">Perlu Revisi</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>
          </div>
        </div>

        {/* Document Inspection List */}
        <div className="space-y-3">
          {filteredDocs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Tidak ada berkas yang sesuai kriteria</h4>
              <p className="text-xs text-slate-500 mt-1">Coba ubah filter unit kerja atau kata kunci pencarian Anda.</p>
              <button
                type="button"
                onClick={() => { setSelectedUnit('ALL'); setSelectedStandard('ALL'); setSelectedStatus('ALL'); setSearchQuery(''); }}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#0077B6]/40 hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shrink-0 mt-0.5">
                    {getFileIcon(doc.fileType)}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#0077B6] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        {doc.code}
                      </span>
                      {doc.kategoriDokumen && (
                        <span
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            doc.kategoriDokumen === 'MM'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : doc.kategoriDokumen === 'PM'
                              ? 'bg-blue-50 text-[#0077B6] border-blue-200'
                              : doc.kategoriDokumen === 'PK'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : doc.kategoriDokumen === 'CM'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : doc.kategoriDokumen === 'LAINNYA'
                              ? 'bg-slate-100 text-slate-700 border-slate-300'
                              : 'bg-purple-50 text-purple-700 border-purple-200'
                          }`}
                        >
                          {doc.kategoriDokumen === 'MM'
                            ? 'L1 • MM'
                            : doc.kategoriDokumen === 'PM'
                            ? 'L2 • PM'
                            : doc.kategoriDokumen === 'PK'
                            ? 'L3 • PK'
                            : doc.kategoriDokumen === 'CM'
                            ? 'L4 • CM(F)'
                            : doc.kategoriDokumen === 'LAINNYA'
                            ? 'LAIN • DOKUMEN LAIN'
                            : 'REKAP'}
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {doc.unitName}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        • {doc.standardName}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {doc.title}
                    </h4>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap font-mono">
                      <span>File: <strong className="text-slate-600">{doc.fileName}</strong></span>
                      <span>•</span>
                      <span>Ukuran: {doc.fileSize}</span>
                      <span>•</span>
                      <span>Diunggah oleh: {doc.uploadedByName}</span>
                      <span>•</span>
                      <span>{new Date(doc.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>

                    {doc.notes && (
                      <div className="text-xs text-slate-600 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200/60 mt-2 flex items-start gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>Catatan: {doc.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Action Buttons */}
                <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div>
                    {getStatusBadge(doc.status)}
                  </div>

                  <button
                    type="button"
                    onClick={() => openInspector(doc)}
                    className="px-4 py-2.5 rounded-xl bg-[#0077B6] hover:bg-[#005f92] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Periksa & Sahkan</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* EXECUTIVE DOCUMENT INSPECTOR MODAL */}
        {inspectDoc && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-5xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Top Bar */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 text-[#0077B6]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Panel Inspeksi & Validasi Dokumen Mutu
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Verifikasi keabsahan berkas fisik unggahan {inspectDoc.unitName}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectDoc(null)}
                  className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body: Split Screen */}
              <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
                {/* Left: Document Simulator Viewer (7 cols) */}
                <div className="lg:col-span-7 bg-slate-100 p-5 overflow-y-auto flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Document Letterhead Simulation */}
                      <div className="border-b-2 border-slate-800 pb-4 mb-5 text-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          PEMERINTAH PROVINSI JAWA TENGAH &bull; DINAS PENDIDIKAN DAN KEBUDAYAAN
                        </p>
                        <h4 className="text-sm font-black text-slate-900 uppercase mt-0.5">
                          SMK NEGERI 2 MAGELANG
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          Sistem Penjaminan Mutu Internal (SPMI) &bull; Swadaya Bhina Raharja
                        </p>
                      </div>

                      {/* Document Meta Info */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#0077B6]">{inspectDoc.code}</span>
                            {inspectDoc.kategoriDokumen && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0077B6] border border-blue-200">
                                {inspectDoc.kategoriDokumen === 'CM' ? 'Catatan Mutu (F)' : inspectDoc.kategoriDokumen === 'LAINNYA' ? 'Dokumen Lainnya' : inspectDoc.kategoriDokumen}
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400 font-mono">Versi {inspectDoc.version}</span>
                        </div>

                        <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 text-[#0077B6] flex items-center justify-center mx-auto mb-2">
                            {getFileIcon(inspectDoc.fileType)}
                          </div>
                          <h3 className="text-base font-bold text-slate-900 px-4">
                            {inspectDoc.title}
                          </h3>
                          <p className="text-xs text-slate-500 font-mono mt-1">
                            {inspectDoc.fileName} &bull; {inspectDoc.fileSize}
                          </p>
                        </div>

                        {/* Evidence Checklist Simulation */}
                        <div className="space-y-2 text-xs text-slate-700 bg-sky-50/50 rounded-xl p-4 border border-sky-100">
                          <p className="font-bold text-slate-900 mb-2">Kelengkapan Bukti Fisik:</p>
                          <div className="flex items-center gap-2 text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Dokumen format resmi (.pdf/.xlsx/.docx) terunggah utuh</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Tanda tangan penanggung jawab / kepala unit tertera</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Sesuai butir instrumen {inspectDoc.standardName}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Status: {inspectDoc.status}</span>
                      <span>Diunggah: {new Date(inspectDoc.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Auditor Decision & Feedback (5 cols) */}
                <div className="lg:col-span-5 p-6 bg-white overflow-y-auto flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Keputusan Validasi
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Tentukan apakah dokumen ini telah memenuhi kriteria atau membutuhkan perbaikan dari koordinator unit.
                      </p>
                    </div>

                    {/* Feedback Textarea */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Catatan Evaluasi / Umpan Balik untuk Unit:
                      </label>
                      <textarea
                        rows={4}
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Contoh: Dokumen telah sesuai dan lengkap, disahkan untuk portofolio EDS..."
                        className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077B6] text-slate-800"
                      />
                    </div>

                    {/* Verification Metadata if already verified */}
                    {inspectDoc.verifiedByName && (
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                        <p className="font-bold">Riwayat Validasi Terakhir:</p>
                        <p className="text-[11px] mt-0.5">Diverifikasi oleh: {inspectDoc.verifiedByName}</p>
                        <p className="text-[11px]">Waktu: {new Date(inspectDoc.verifiedAt || '').toLocaleString('id-ID')}</p>
                      </div>
                    )}
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleValidate(inspectDoc.id, 'Terverifikasi', reviewNotes)}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Sahkan Dokumen (Terverifikasi)</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleValidate(inspectDoc.id, 'Perlu Revisi', reviewNotes || 'Perlu perbaikan kelengkapan bukti fisik.')}
                        className="py-2.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Minta Revisi</span>
                      </button>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleValidate(inspectDoc.id, 'Ditolak', reviewNotes || 'Dokumen tidak sesuai dengan butir instrumen.')}
                        className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Tolak Berkas</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
