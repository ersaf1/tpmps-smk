'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/ToastFeedback';
import { sintesaService, INITIAL_STANDARDS } from '@/lib/services/sintesaDataService';
import { BuktiDokumen, UnitKerja, StatusDokumen, UserProfile, KategoriDokumenMutu } from '@/types/sintesa';
import {
  Search,
  Folder,
  FolderPlus,
  UploadCloud,
  FileText,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  Star,
  CheckCircle2,
  Grid,
  List as ListIcon,
  Info,
  Download,
  Trash2,
  ChevronRight,
  ArrowLeft,
  HardDrive,
  Share2,
  Eye,
  X,
  FileCheck,
  ShieldCheck,
  Calendar,
  Building2,
  Filter
} from 'lucide-react';

const DEFAULT_FOLDERS = [
  '01. Standar SKL',
  '02. Standar Isi & Kurikulum',
  '03. Standar Proses & PjBL',
  '04. Standar Penilaian',
  '05. Standar Pendidik (PTK)',
  '06. Standar Sarpras',
  '07. Standar Pengelolaan & SPMI',
  '08. Standar Pembiayaan & RKAS',
  '09. SK & Regulasi Unit',
  '10. Portofolio & Dokumentasi'
];

export default function GoogleDriveUnitPage() {
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => sintesaService.getActiveUser());
  const [units, setUnits] = useState<UnitKerja[]>(() => sintesaService.getUnits());
  const [selectedUnitId, setSelectedUnitId] = useState<string>('u-01');
  const [isViewingAllUnits, setIsViewingAllUnits] = useState<boolean>(() => currentUser?.role === 'kepala_sekolah');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'pdf' | 'excel' | 'word' | 'image'>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Documents State
  const [documents, setDocuments] = useState<BuktiDokumen[]>(() => sintesaService.getDocuments());
  const [customFolders, setCustomFolders] = useState<Record<string, string[]>>({});

  // Selected file for preview / right info drawer (closed by default)
  const [selectedDoc, setSelectedDoc] = useState<BuktiDokumen | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<BuktiDokumen | null>(null);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [targetDelete, setTargetDelete] = useState<BuktiDokumen | null>(null);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadStandardId, setUploadStandardId] = useState<number>(2);
  const [uploadFolder, setUploadFolder] = useState<string>('02. Standar Isi & Kurikulum');
  const [uploadFileType, setUploadFileType] = useState<'pdf' | 'excel' | 'word' | 'image'>('pdf');
  const [uploadKategori, setUploadKategori] = useState<KategoriDokumenMutu>('CM');
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const loadData = () => {
    const user = sintesaService.getActiveUser();
    setCurrentUser(user);
    const docs = sintesaService.getDocuments();
    setDocuments(docs);
    const loadedUnits = sintesaService.getUnits();
    setUnits(loadedUnits);

    if (user && user.unitId && user.role === 'guru') {
      setSelectedUnitId(user.unitId);
      setIsViewingAllUnits(false);
    } else if (user && user.role === 'kepala_sekolah') {
      setIsViewingAllUnits(true);
    } else if (loadedUnits.length > 0 && !loadedUnits.find((u) => u.id === selectedUnitId)) {
      setSelectedUnitId(loadedUnits[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isKasek = useMemo(() => {
    return currentUser?.role === 'kepala_sekolah';
  }, [currentUser]);

  const activeUnit = useMemo(() => {
    return units.find((u) => u.id === selectedUnitId) || units[0];
  }, [units, selectedUnitId]);

  const isTPMPSUnit = useMemo(() => {
    return (
      activeUnit?.code === 'TPMPS' ||
      activeUnit?.id === 'u-10' ||
      currentUser?.role === 'admin' ||
      currentUser?.role === 'tpmps'
    );
  }, [activeUnit, currentUser]);

  const availableCategoriesForUnit = useMemo(() => {
    if (isTPMPSUnit) {
      return [
        { value: 'ALL', label: 'Semua Penempatan Mutu' },
        { value: 'MM', label: 'Level 1: Manual Mutu (MM)' },
        { value: 'PM', label: 'Level 2: Prosedur Mutu (PM)' },
        { value: 'PK', label: 'Level 3: Petunjuk Kerja (PK)' },
        { value: 'CM', label: 'Level 4: Catatan Mutu (CM / F)' },
        { value: 'LAINNYA', label: 'Dokumen Pendukung' },
        { value: 'REKAP', label: 'Rekapitulasi Unit' }
      ];
    }
    return [
      { value: 'ALL', label: 'Semua Penempatan Mutu' },
      { value: 'PK', label: 'Petunjuk Kerja (PK)' },
      { value: 'CM', label: 'Catatan Mutu / Bukti Fisik (F)' },
      { value: 'LAINNYA', label: 'Dokumen Pendukung' },
      { value: 'REKAP', label: 'Rekapitulasi Unit' }
    ];
  }, [isTPMPSUnit]);

  const uploadCategoryOptions = useMemo(() => {
    if (isTPMPSUnit) {
      return [
        { value: 'MM' as KategoriDokumenMutu, label: 'Level 1: Manual Mutu (MM)', desc: 'Kebijakan utama SPMI sekolah' },
        { value: 'PM' as KategoriDokumenMutu, label: 'Level 2: Prosedur Mutu (PM)', desc: 'SOP & mekanisme pelaksanaan' },
        { value: 'PK' as KategoriDokumenMutu, label: 'Level 3: Petunjuk Kerja (PK)', desc: 'Petunjuk teknis operasional kegiatan' },
        { value: 'CM' as KategoriDokumenMutu, label: 'Level 4: Catatan Mutu (CM / F)', desc: 'Bukti fisik rekaman mutu unit' },
        { value: 'LAINNYA' as KategoriDokumenMutu, label: 'Dokumen Lainnya', desc: 'SK unit, sertifikat, lampiran' },
        { value: 'REKAP' as KategoriDokumenMutu, label: 'Rekapitulasi Capaian', desc: 'Laporan ringkasan & capaian berkala' }
      ];
    }
    return [
      { value: 'PK' as KategoriDokumenMutu, label: 'Level 3: Petunjuk Kerja (PK)', desc: 'Petunjuk teknis operasional pelaksanaan unit' },
      { value: 'CM' as KategoriDokumenMutu, label: 'Level 4: Catatan Mutu / Formulir (F)', desc: 'Formulir bukti fisik rekaman pelaksanaan mutu' },
      { value: 'LAINNYA' as KategoriDokumenMutu, label: 'Dokumen Pendukung', desc: 'SK unit, portofolio kerja & dokumen lain' },
      { value: 'REKAP' as KategoriDokumenMutu, label: 'Rekapitulasi Unit', desc: 'Laporan ringkasan capaian mutu unit' }
    ];
  }, [isTPMPSUnit]);

  // Combined Folders for this unit
  const unitFolders = useMemo(() => {
    const custom = customFolders[selectedUnitId] || [];
    return [...DEFAULT_FOLDERS, ...custom];
  }, [selectedUnitId, customFolders]);

  // Filtered Documents for selected unit
  const unitDocuments = useMemo(() => {
    return documents.filter((d) => d.unitId === selectedUnitId);
  }, [documents, selectedUnitId]);

  const displayedDocs = useMemo(() => {
    return unitDocuments.filter((doc) => {
      // Folder filter
      if (currentFolder && doc.folder !== currentFolder) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchCode = doc.code.toLowerCase().includes(q);
        const matchFolder = doc.folder?.toLowerCase().includes(q);
        const matchCat = doc.kategoriDokumen?.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchFolder && !matchCat) return false;
      }

      // Type filter
      if (filterType !== 'ALL' && doc.fileType !== filterType) return false;

      // Status filter
      if (filterStatus !== 'ALL' && doc.status !== filterStatus) return false;

      // Category / Penempatan filter
      if (filterCategory !== 'ALL' && doc.kategoriDokumen !== filterCategory) return false;

      return true;
    });
  }, [unitDocuments, currentFolder, searchQuery, filterType, filterStatus, filterCategory]);

  // Folder Counts
  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    unitFolders.forEach((f) => {
      counts[f] = unitDocuments.filter((d) => d.folder === f).length;
    });
    return counts;
  }, [unitFolders, unitDocuments]);

  // Handlers
  const handleToggleStar = (docId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = sintesaService.toggleStarDocument(docId);
    if (updated) {
      setDocuments(sintesaService.getDocuments());
      if (selectedDoc && selectedDoc.id === docId) {
        setSelectedDoc(updated);
      }
      showToast(updated.isStarred ? 'Ditambahkan ke berbintang' : 'Dihapus dari berbintang', 'info');
    }
  };

  const handleDelete = () => {
    if (!targetDelete) return;
    sintesaService.deleteDocument(targetDelete.id);
    showToast(`Berkas "${targetDelete.title}" berhasil dihapus.`, 'success');
    if (selectedDoc?.id === targetDelete.id) {
      setSelectedDoc(null);
    }
    setTargetDelete(null);
    setDocuments(sintesaService.getDocuments());
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setCustomFolders((prev) => {
      const current = prev[selectedUnitId] || [];
      if (current.includes(newFolderName.trim()) || DEFAULT_FOLDERS.includes(newFolderName.trim())) {
        showToast('Folder dengan nama ini sudah ada.', 'error');
        return prev;
      }
      return {
        ...prev,
        [selectedUnitId]: [...current, newFolderName.trim()]
      };
    });

    showToast(`Folder "${newFolderName.trim()}" berhasil dibuat.`, 'success');
    setNewFolderName('');
    setIsNewFolderOpen(false);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      showToast('Judul dokumen wajib diisi.', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(30);

    setTimeout(() => {
      setUploadProgress(75);
      setTimeout(() => {
        setUploadProgress(100);

        const standard = INITIAL_STANDARDS.find((s) => s.id === uploadStandardId);
        const fileName = uploadFileName.trim() || `${uploadTitle.replace(/\s+/g, '_')}.${uploadFileType === 'excel' ? 'xlsx' : uploadFileType === 'word' ? 'docx' : uploadFileType === 'image' ? 'jpg' : 'pdf'}`;
        const prefix = uploadKategori === 'CM' ? 'F' : (uploadKategori === 'LAINNYA' ? 'DOK' : uploadKategori);
        const newCode = `DOC-${prefix}-${activeUnit.code}-${Date.now().toString().slice(-4)}`;

        const newDoc = sintesaService.createDocument({
          code: newCode,
          title: uploadTitle.trim(),
          fileName,
          fileUrl: `/storage/documents/${fileName}`,
          fileSize: `${(Math.random() * 5 + 1.2).toFixed(1)} MB`,
          fileType: uploadFileType,
          kategoriDokumen: uploadKategori,
          standardId: uploadStandardId,
          standardName: standard?.name || 'Standar Nasional Pendidikan',
          unitId: activeUnit.id,
          unitName: activeUnit.name,
          version: 'v1.0',
          status: 'Menunggu Review',
          folder: uploadFolder || currentFolder || '01. Standar SKL',
          notes: uploadNotes.trim() || 'Diunggah melalui Google Drive Unit',
          uploadedBy: currentUser?.id || 'usr-unit',
          uploadedByName: currentUser?.fullName || activeUnit.picName,
          isStarred: false
        });

        setIsUploading(false);
        setUploadProgress(0);
        setIsUploadOpen(false);
        setUploadTitle('');
        setUploadNotes('');
        setUploadFileName('');
        setDocuments(sintesaService.getDocuments());
        setSelectedDoc(newDoc);
        showToast(`Berkas "${newDoc.title}" berhasil diunggah!`, 'success');
      }, 350);
    }, 350);
  };

  const getFileIcon = (type: string, className = 'w-4 h-4') => {
    switch (type) {
      case 'pdf':
        return <FileText className={`${className} text-rose-500`} />;
      case 'excel':
        return <FileSpreadsheet className={`${className} text-emerald-600`} />;
      case 'word':
        return <FileCode className={`${className} text-blue-600`} />;
      default:
        return <ImageIcon className={`${className} text-amber-500`} />;
    }
  };

  const getStatusBadge = (status: StatusDokumen) => {
    switch (status) {
      case 'Terverifikasi':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Menunggu Review':
        return 'bg-blue-50 text-[#0077B6] border-blue-200';
      case 'Perlu Revisi':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Ditolak':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <AppShell
      title="Google Drive Unit Kerja"
      subtitle="Pusat Repositori & Bukti Fisik SPMI SMK Negeri 2 Magelang"
    >
      <div className="space-y-4">
        {/* =========================================================
            HEADER BAR (Simple, Clean, Spacious)
        ========================================================= */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0077B6] shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Google Drive Mutu Unit
                </h1>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-[#0077B6] border border-blue-200">
                  18 Unit Kerja
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pilih folder unit kerja di bawah untuk memeriksa bukti fisik mutu sekolah.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berkas atau dokumen..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0077B6] outline-hidden transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Kasek link to Periode */}
            {isKasek && (
              <Link
                href="/periode"
                className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Kelola Periode &rarr;</span>
              </Link>
            )}

            {/* Non-Kasek: Upload & Folder Baru */}
            {!isKasek && !isViewingAllUnits && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setUploadFolder(currentFolder || '02. Standar Isi & Kurikulum');
                    setIsUploadOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0077B6] hover:bg-[#0284C7] text-white text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 shadow-xs cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Berkas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewFolderOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-orange-500" />
                  <span className="hidden sm:inline">Folder Baru</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* =========================================================
            VIEW A: 18 UNIT KERJA ROOT GRID (Pilih Unit untuk Dicek)
        ========================================================= */}
        {isViewingAllUnits ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  Daftar Folder 18 Unit Kerja
                </h2>
                <p className="text-xs text-slate-500">
                  Klik pada unit kerja di bawah untuk membuka dan memeriksa berkas bukti fisiknya.
                </p>
              </div>
              <span className="text-xs font-medium text-slate-500">
                Total {units.length} Unit
              </span>
            </div>

            {/* 18 Clean Unit Cards (3 columns on desktop, uncluttered) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {units.map((u, idx) => {
                const unitDocs = documents.filter((d) => d.unitId === u.id);
                const verifiedDocs = unitDocs.filter((d) => d.status === 'Terverifikasi');
                const unitNumber = idx + 1;

                return (
                  <div
                    key={u.id}
                    onClick={() => {
                      setSelectedUnitId(u.id);
                      setIsViewingAllUnits(false);
                      setCurrentFolder(null);
                      setSelectedDoc(null);
                    }}
                    className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-[#0077B6] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0077B6] group-hover:scale-105 transition-transform">
                          <Folder className="w-4 h-4 fill-blue-100" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            Unit {String(unitNumber).padStart(2, '0')}
                          </span>
                          <span className="text-[10px] font-semibold text-[#0077B6] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                            {u.code}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-[#0077B6] transition-colors leading-snug">
                        {u.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        PIC: {u.picName}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-600">
                          {unitDocs.length} Berkas
                        </span>
                        {verifiedDocs.length > 0 && (
                          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {verifiedDocs.length} Sah
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-[#0077B6] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Buka &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* =========================================================
              VIEW B: DALAM UNIT KERJA (Pemeriksaan Folder & Dokumen)
          ========================================================= */
          <div className="space-y-4">
            {/* Top Navigation & Unit Switcher Bar */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setIsViewingAllUnits(true);
                    setCurrentFolder(null);
                    setSelectedDoc(null);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Semua 18 Unit</span>
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-900">
                  {activeUnit.name}
                </span>
                {currentFolder && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-[#0077B6] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {currentFolder}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentFolder(null)}
                      className="text-slate-400 hover:text-slate-600 ml-1 p-0.5"
                      title="Tampilkan semua folder"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>

              {/* Quick Unit Switcher & Filter Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Switch to any unit in 1 click */}
                <select
                  value={selectedUnitId}
                  onChange={(e) => {
                    setSelectedUnitId(e.target.value);
                    setCurrentFolder(null);
                    setSelectedDoc(null);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 outline-hidden focus:border-[#0077B6]"
                  title="Pindah ke unit kerja lain"
                >
                  {units.map((u, i) => (
                    <option key={u.id} value={u.id}>
                      Unit {i + 1}: {u.name} ({u.code})
                    </option>
                  ))}
                </select>

                {/* Filter Penempatan */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 outline-hidden focus:border-[#0077B6]"
                >
                  {availableCategoriesForUnit.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* Filter Status */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 outline-hidden focus:border-[#0077B6]"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="Terverifikasi">Terverifikasi</option>
                  <option value="Menunggu Review">Menunggu Review</option>
                  <option value="Perlu Revisi">Perlu Revisi</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-[#0077B6] shadow-xs font-semibold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Tampilan Tabel"
                  >
                    <ListIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white text-[#0077B6] shadow-xs font-semibold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Tampilan Kisi"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Folder Standar Mutu (Clean Horizontal Grid) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Folder Standar ({unitFolders.length})
                </span>
                {currentFolder && (
                  <button
                    type="button"
                    onClick={() => setCurrentFolder(null)}
                    className="text-xs text-[#0077B6] hover:underline font-medium cursor-pointer"
                  >
                    Tampilkan Semua Berkas
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {unitFolders.map((folderName) => {
                  const count = folderCounts[folderName] || 0;
                  const isSelected = currentFolder === folderName;

                  return (
                    <button
                      key={folderName}
                      type="button"
                      onClick={() => setCurrentFolder(isSelected ? null : folderName)}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? 'border-[#0077B6] bg-blue-50 text-[#0077B6]'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Folder className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#0077B6] fill-blue-200' : 'text-slate-400 group-hover:text-[#0077B6]'}`} />
                        <div className="min-w-0">
                          <div className={`text-xs font-medium truncate ${isSelected ? 'text-[#0077B6] font-semibold' : 'text-slate-800'}`}>
                            {folderName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {count} berkas
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Daftar Berkas Bukti Dokumen */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {currentFolder ? `Berkas: ${currentFolder}` : 'Daftar Berkas Dokumen'} ({displayedDocs.length})
                </span>
                {selectedDoc && (
                  <button
                    type="button"
                    onClick={() => setIsDetailsOpen(true)}
                    className="text-xs text-[#0077B6] hover:underline font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Lihat Rincian: {selectedDoc.title.slice(0, 25)}...</span>
                  </button>
                )}
              </div>

              {displayedDocs.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 text-slate-400 space-y-2">
                  <Folder className="w-9 h-9 text-slate-300 mx-auto" />
                  <p className="text-xs font-medium text-slate-600">Tidak ada berkas di folder ini.</p>
                  {!isKasek && (
                    <button
                      type="button"
                      onClick={() => setIsUploadOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0077B6] text-white text-xs font-medium hover:bg-[#0284C7] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload Berkas Pertama</span>
                    </button>
                  )}
                </div>
              ) : viewMode === 'list' ? (
                /* CLEAN LIST VIEW (EASY TO AUDIT FOR KEPALA SEKOLAH) */
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-2.5 px-4">Nama Dokumen</th>
                          <th className="py-2.5 px-3">Folder</th>
                          <th className="py-2.5 px-3">Penempatan</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Ukuran</th>
                          <th className="py-2.5 px-3">Diubah</th>
                          <th className="py-2.5 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {displayedDocs.map((doc) => {
                          const isSelected = selectedDoc?.id === doc.id;
                          return (
                            <tr
                              key={doc.id}
                              onClick={() => setSelectedDoc(doc)}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50/80 text-slate-700'
                              }`}
                            >
                              <td className="py-2.5 px-4">
                                <div className="flex items-center gap-2.5">
                                  {getFileIcon(doc.fileType, 'w-4 h-4 shrink-0')}
                                  <div className="min-w-0">
                                    <div className="font-medium text-slate-900 truncate max-w-xs sm:max-w-md">
                                      {doc.title}
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-400">
                                      {doc.code} &bull; {doc.fileName}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 truncate max-w-[140px]">
                                {doc.folder || 'Root'}
                              </td>
                              <td className="py-2.5 px-3">
                                {doc.kategoriDokumen && (
                                  <span className="text-[9px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                                    {doc.kategoriDokumen === 'CM' ? 'CM (F)' : doc.kategoriDokumen}
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full border ${getStatusBadge(doc.status)}`}>
                                  {doc.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                                {doc.fileSize}
                              </td>
                              <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                                {doc.updatedAt.substring(0, 10)}
                              </td>
                              <td className="py-2.5 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    type="button"
                                    onClick={(e) => handleToggleStar(doc.id, e)}
                                    className="p-1.5 rounded-md text-slate-400 hover:text-amber-500 hover:bg-slate-100 cursor-pointer"
                                    title="Beri bintang"
                                  >
                                    <Star className={`w-3.5 h-3.5 ${doc.isStarred ? 'text-amber-500 fill-amber-500' : ''}`} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPreviewDoc(doc);
                                    }}
                                    className="p-1.5 rounded-md text-slate-400 hover:text-[#0077B6] hover:bg-slate-100 cursor-pointer"
                                    title="Pratinjau Dokumen"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  {!isKasek && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setTargetDelete(doc);
                                      }}
                                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                      title="Hapus"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* CLEAN GRID VIEW */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {displayedDocs.map((doc) => {
                    const isSelected = selectedDoc?.id === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between group ${
                          isSelected ? 'border-[#0077B6] bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                              {getFileIcon(doc.fileType, 'w-4 h-4')}
                            </div>
                            <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full border ${getStatusBadge(doc.status)}`}>
                              {doc.status}
                            </span>
                          </div>

                          <span className="text-[10px] font-mono text-slate-400">
                            {doc.code}
                          </span>
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-[#0077B6] transition-colors line-clamp-2 mt-0.5">
                            {doc.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                            {doc.folder || 'Root'}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <span className="font-mono">{doc.fileSize}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewDoc(doc);
                              }}
                              className="p-1 rounded-md text-slate-400 hover:text-[#0077B6] hover:bg-slate-100"
                              title="Pratinjau"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {!isKasek && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTargetDelete(doc);
                                }}
                                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                title="Hapus"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          SLIDE-OVER FILE DETAILS DRAWER (Optional on Demand)
      ========================================================= */}
      {isDetailsOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex justify-end">
          <div className="bg-white max-w-sm w-full h-full shadow-2xl border-l border-slate-200 p-5 overflow-y-auto space-y-4 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                Rincian Dokumen
              </span>
              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
              {getFileIcon(selectedDoc.fileType, 'w-8 h-8 mx-auto')}
              <h4 className="text-xs font-semibold text-slate-900 mt-2">
                {selectedDoc.title}
              </h4>
              <p className="text-[10px] font-mono text-slate-400">
                {selectedDoc.fileName}
              </p>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-500">Kode Bukti:</span>
                <span className="font-mono font-medium text-slate-900">{selectedDoc.code}</span>
              </div>
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-500">Unit:</span>
                <span className="font-medium text-slate-900">{selectedDoc.unitName}</span>
              </div>
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-500">Folder:</span>
                <span className="font-medium text-slate-800">{selectedDoc.folder}</span>
              </div>
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-500">Ukuran:</span>
                <span className="font-mono text-slate-800">{selectedDoc.fileSize}</span>
              </div>
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-500">Status:</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusBadge(selectedDoc.status)}`}>
                  {selectedDoc.status}
                </span>
              </div>
              <div className="flex justify-between pt-1.5">
                <span className="text-slate-500">Pengunggah:</span>
                <span className="text-slate-800">{selectedDoc.uploadedByName || '-'}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => setPreviewDoc(selectedDoc)}
                className="w-full py-2 rounded-xl bg-[#0077B6] hover:bg-[#0284C7] text-white font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Buka Pratinjau</span>
              </button>

              <Link
                href={`/dokumen/${selectedDoc.id}`}
                className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <FileCheck className="w-3.5 h-3.5 text-[#0077B6]" />
                <span>Verifikasi TPMPS</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: UPLOAD FILE KE FOLDER UNIT
      ========================================================= */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0077B6]">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Upload Berkas ke Drive
                  </h3>
                  <p className="text-xs text-slate-500">
                    Unit: {activeUnit.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-1">
                <UploadCloud className="w-6 h-6 text-[#0077B6] mx-auto" />
                <p className="font-medium text-slate-700">Pilih berkas dokumen dari komputer</p>
                <p className="text-[10px] text-slate-400">PDF, Excel, Word, Foto (Maks. 25 MB)</p>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Judul Dokumen Bukti *
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Contoh: Laporan Penyelarasan Kurikulum dengan IDUKA"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 focus:border-[#0077B6] text-xs text-slate-900 outline-hidden"
                />
              </div>

              {/* Folder Selector (Visual Cards) */}
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Folder Penyimpanan *
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50">
                  {unitFolders.map((f) => {
                    const isSelected = uploadFolder === f;
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setUploadFolder(f)}
                        className={`p-2 rounded-lg border text-left text-[11px] transition-colors cursor-pointer truncate ${
                          isSelected
                            ? 'border-[#0077B6] bg-blue-50 text-[#0077B6] font-semibold'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Standar Mutu (SNP)
                  </label>
                  <select
                    value={uploadStandardId}
                    onChange={(e) => setUploadStandardId(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900"
                  >
                    {INITIAL_STANDARDS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Format File
                  </label>
                  <select
                    value={uploadFileType}
                    onChange={(e) => setUploadFileType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="excel">Excel (.xlsx)</option>
                    <option value="word">Word (.docx)</option>
                    <option value="image">Gambar (.jpg/.png)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={2}
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="Keterangan singkat..."
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 outline-hidden"
                />
              </div>

              {isUploading && (
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0077B6] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-1.5 rounded-xl bg-[#0077B6] hover:bg-[#0284C7] text-white font-medium cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? 'Mengunggah...' : 'Upload Dokumen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: BUAT FOLDER BARU
      ========================================================= */}
      {isNewFolderOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-xl space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-semibold text-slate-900">Folder Baru</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewFolderOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Nama Folder
                </label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Contoh: Rapat Pleno Kurikulum 2025"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewFolderOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#0077B6] hover:bg-[#0284C7] text-white font-medium cursor-pointer"
                >
                  Buat Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: PRATINJAU DOKUMEN LAYAR PENUH (Lightbox)
      ========================================================= */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50">
              <div className="flex items-center gap-2.5 min-w-0">
                {getFileIcon(previewDoc.fileType, 'w-5 h-5 shrink-0')}
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                    {previewDoc.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {previewDoc.code} &bull; {previewDoc.fileName} &bull; {previewDoc.fileSize}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusBadge(previewDoc.status)}`}>
                  {previewDoc.status}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-100 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-xs p-6 max-w-xl w-full border border-slate-200 space-y-4">
                <div className="border-b border-slate-900 pb-2 text-center space-y-0.5">
                  <div className="text-[9px] uppercase tracking-wider text-slate-500">
                    PEMERINTAH PROVINSI JAWA TENGAH &bull; DINAS PENDIDIKAN DAN KEBUDAYAAN
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    SMK NEGERI 2 MAGELANG
                  </h2>
                  <p className="text-[9px] text-slate-500">
                    Jl. Perintis Kemerdekaan No. 9, Kota Magelang
                  </p>
                </div>

                <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 space-y-0.5">
                    <span className="text-[9px] text-[#0077B6] font-semibold uppercase tracking-wider">
                      Dokumen Bukti Fisik Mutu
                    </span>
                    <div className="text-xs font-semibold text-slate-900">
                      {previewDoc.title}
                    </div>
                    <div className="text-slate-600 text-[11px]">
                      Unit: {previewDoc.unitName} &bull; Standar: {previewDoc.standardName}
                    </div>
                  </div>

                  <p className="text-xs">
                    Arsip resmi bukti mutu Penjaminan Mutu Internal (SPMI) SMK Negeri 2 Magelang berbasis siklus PPEPP.
                  </p>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-medium text-slate-800">Catatan:</span>{' '}
                    <span className="text-slate-600 italic">&ldquo;{previewDoc.notes || 'Dokumen memenuhi standar.'}&rdquo;</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Pengunggah:</span>
                    <span className="font-semibold text-slate-800">{previewDoc.uploadedByName || 'PIC Unit'}</span>
                  </div>
                  {previewDoc.verifiedByName && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Verifikator TPMPS:</span>
                      <span className="font-semibold text-emerald-700">{previewDoc.verifiedByName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                Storage: Supabase &bull; SHA-256 Validated
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showToast('Tautan dokumen disalin!', 'info')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Salin Tautan</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast(`Mengunduh ${previewDoc.fileName}...`, 'success')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0077B6] hover:bg-[#0284C7] text-white text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(targetDelete)}
        title="Hapus Berkas dari Drive?"
        message={`Apakah Anda yakin ingin menghapus berkas "${targetDelete?.title}" dari Google Drive ${activeUnit?.name}?`}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setTargetDelete(null)}
      />
    </AppShell>
  );
}
