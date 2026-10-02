'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/ToastFeedback';
import { sintesaService, INITIAL_UNITS, INITIAL_STANDARDS } from '@/lib/services/sintesaDataService';
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
  AlertCircle,
  Grid,
  List as ListIcon,
  Info,
  Download,
  Trash2,
  ChevronRight,
  Plus,
  HardDrive,
  Share2,
  Building2,
  Sparkles,
  Eye,
  X,
  FileCheck,
  ShieldCheck,
  Calendar,
  MoreVertical,
  Check,
  ArrowUpRight
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
  const [activeTab, setActiveTab] = useState<'all' | 'starred' | 'recent' | 'verified'>('all');

  // Documents State
  const [documents, setDocuments] = useState<BuktiDokumen[]>(() => sintesaService.getDocuments());
  const [customFolders, setCustomFolders] = useState<Record<string, string[]>>({});

  // Selected file for preview / right info drawer
  const [selectedDoc, setSelectedDoc] = useState<BuktiDokumen | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [previewDoc, setPreviewDoc] = useState<BuktiDokumen | null>(null);

  // Modals & Popovers
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
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

  const newMenuRef = useRef<HTMLDivElement>(null);

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

  // Close "+ Baru" menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (newMenuRef.current && !newMenuRef.current.contains(event.target as Node)) {
        setIsNewMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isKasek = useMemo(() => {
    return currentUser?.role === 'kepala_sekolah';
  }, [currentUser]);

  const activeUnit = useMemo(() => {
    return units.find((u) => u.id === selectedUnitId) || units[0] || INITIAL_UNITS[0];
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
        { value: 'ALL', label: 'Semua Penempatan Dokumen' },
        { value: 'MM', label: 'Level 1: Manual Mutu (MM)' },
        { value: 'PM', label: 'Level 2: Prosedur Mutu (PM)' },
        { value: 'PK', label: 'Level 3: Petunjuk Kerja (PK)' },
        { value: 'CM', label: 'Level 4: Catatan Mutu (CM / F)' },
        { value: 'LAINNYA', label: 'Dokumen Lainnya / Pendukung' },
        { value: 'REKAP', label: 'Rekapitulasi Capaian Unit' }
      ];
    }
    return [
      { value: 'ALL', label: 'Semua Penempatan Unit' },
      { value: 'PK', label: 'Petunjuk Kerja (PK)' },
      { value: 'CM', label: 'Catatan Mutu / Bukti Fisik (F)' },
      { value: 'LAINNYA', label: 'Dokumen Lainnya / Pendukung' },
      { value: 'REKAP', label: 'Rekapitulasi Unit' }
    ];
  }, [isTPMPSUnit]);

  const uploadCategoryOptions = useMemo(() => {
    if (isTPMPSUnit) {
      return [
        { value: 'MM' as KategoriDokumenMutu, label: 'Level 1: Manual Mutu (MM)', desc: 'Kebijakan utama SPMI sekolah (TPMPS)' },
        { value: 'PM' as KategoriDokumenMutu, label: 'Level 2: Prosedur Mutu (PM)', desc: 'SOP & mekanisme pelaksanaan (TPMPS)' },
        { value: 'PK' as KategoriDokumenMutu, label: 'Level 3: Petunjuk Kerja (PK)', desc: 'Petunjuk teknis operasional kegiatan' },
        { value: 'CM' as KategoriDokumenMutu, label: 'Level 4: Catatan Mutu / Formulir (F)', desc: 'Bukti fisik rekaman mutu unit' },
        { value: 'LAINNYA' as KategoriDokumenMutu, label: 'Dokumen Lainnya / Pendukung', desc: 'SK unit, sertifikat & lampiran' },
        { value: 'REKAP' as KategoriDokumenMutu, label: 'Rekapitulasi Capaian Unit', desc: 'Laporan ringkasan & capaian berkala' }
      ];
    }
    return [
      { value: 'PK' as KategoriDokumenMutu, label: 'Level 3: Petunjuk Kerja (PK)', desc: 'Petunjuk teknis operasional pelaksanaan unit' },
      { value: 'CM' as KategoriDokumenMutu, label: 'Level 4: Catatan Mutu / Formulir (F)', desc: 'Formulir bukti fisik rekaman pelaksanaan mutu' },
      { value: 'LAINNYA' as KategoriDokumenMutu, label: 'Dokumen Lainnya / Pendukung', desc: 'SK unit, portofolio kerja & dokumen lain' },
      { value: 'REKAP' as KategoriDokumenMutu, label: 'Rekapitulasi Capaian Unit', desc: 'Laporan ringkasan capaian mutu unit' }
    ];
  }, [isTPMPSUnit]);

  // Reset category filter and upload category if switching to regular unit
  useEffect(() => {
    if (!isTPMPSUnit) {
      if (filterCategory === 'MM' || filterCategory === 'PM') {
        setFilterCategory('ALL');
      }
      if (uploadKategori === 'MM' || uploadKategori === 'PM') {
        setUploadKategori('CM');
      }
    }
  }, [isTPMPSUnit, filterCategory, uploadKategori]);

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
      // Tab filter
      if (activeTab === 'starred' && !doc.isStarred) return false;
      if (activeTab === 'verified' && doc.status !== 'Terverifikasi') return false;

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
  }, [unitDocuments, currentFolder, searchQuery, filterType, filterStatus, filterCategory, activeTab]);

  // Folder Counts
  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    unitFolders.forEach((f) => {
      counts[f] = unitDocuments.filter((d) => d.folder === f).length;
    });
    return counts;
  }, [unitFolders, unitDocuments]);

  // Recent files for Quick Access (Top 4)
  const quickAccessDocs = useMemo(() => {
    return [...unitDocuments].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 4);
  }, [unitDocuments]);

  // Handlers
  const handleToggleStar = (docId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = sintesaService.toggleStarDocument(docId);
    if (updated) {
      setDocuments(sintesaService.getDocuments());
      if (selectedDoc && selectedDoc.id === docId) {
        setSelectedDoc(updated);
      }
      showToast(updated.isStarred ? 'Ditambahkan ke dokumen berbintang' : 'Dihapus dari berbintang', 'info');
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
    setUploadProgress(25);

    setTimeout(() => {
      setUploadProgress(70);
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
        showToast(`Dokumen [${uploadKategori === 'CM' ? 'CM (F)' : uploadKategori}] "${newDoc.title}" berhasil diunggah ke Google Drive ${activeUnit.name}!`, 'success');
      }, 400);
    }, 400);
  };

  const getFileIcon = (type: string, className = 'w-5 h-5') => {
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
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'Menunggu Review':
        return 'bg-blue-50 border-blue-200 text-[#0077B6]';
      case 'Perlu Revisi':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'Ditolak':
        return 'bg-rose-50 border-rose-200 text-rose-700';
    }
  };

  return (
    <AppShell
      title="Google Drive Unit Kerja"
      subtitle="Pusat Repositori & Bukti Fisik SPMI SMK Negeri 2 Magelang"
    >
      {/* -------------------------------------------------------------
          1. GOOGLE DRIVE TOP COMMAND BAR (Soft, Defined & Clean)
      ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs mb-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          {/* Left: Brand & Active Unit Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0077B6] shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 tracking-tight">
                  Drive {isViewingAllUnits ? '18 Unit Kerja' : activeUnit.name}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#0077B6] border border-blue-200">
                  {isViewingAllUnits ? '18 Unit' : activeUnit.code}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">
                {isViewingAllUnits
                  ? 'Koleksi folder resmi 18 unit kerja SPMI SMK Negeri 2 Magelang'
                  : `PIC: ${activeUnit.picName} &bull; ${activeUnit.category}`}
              </p>
            </div>
          </div>

          {/* Center: Google Drive Pill Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isViewingAllUnits ? "Telusuri nama berkas, unit, atau kode..." : `Telusuri di Drive ${activeUnit.name}...`}
                className="w-full h-10 pl-10 pr-9 rounded-full bg-slate-100 hover:bg-slate-200/60 focus:bg-white border border-transparent focus:border-[#0077B6] focus:ring-2 focus:ring-blue-500/10 text-xs sm:text-sm text-slate-900 placeholder-slate-400 transition-all outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Quick Action Buttons & View Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {!isKasek && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setUploadFolder(currentFolder || '02. Standar Isi & Kurikulum');
                    setIsUploadOpen(true);
                  }}
                  className="h-9 px-3.5 rounded-xl bg-[#0077B6] hover:bg-[#0284C7] text-white text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Berkas</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsNewFolderOpen(true)}
                  className="h-9 px-3 rounded-xl bg-white hover:bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Buat folder baru"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Folder Baru</span>
                </button>
              </>
            )}

            {/* View Mode Toggle (Grid / List) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-[#0077B6] shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Tampilan Daftar (Google Drive)"
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#0077B6] shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Tampilan Kisi"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>

            {/* Details Panel Toggle */}
            <button
              type="button"
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDetailsOpen
                  ? 'bg-blue-50 border-blue-200 text-[#0077B6]'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500'
              }`}
              title="Panel Rincian Berkas"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          2. KEPALA SEKOLAH AUDIT MODE BANNER (Clean, Soft & Defined)
      ------------------------------------------------------------- */}
      {isKasek && (
        <div className="bg-white border border-orange-200 rounded-2xl p-4 mb-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  Mode Audit Eksekutif Kepala Sekolah (Read-Only)
                </h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-mono">
                  Audit Eksklusif
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Anda memiliki wewenang penuh untuk memeriksa seluruh folder dan berkas dari 18 unit kerja sekolah. Untuk membuat dan menetapkan periode SPMI baru, silakan gunakan menu Periode.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/periode"
              className="h-9 px-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>Kelola Periode SPMI &rarr;</span>
            </Link>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          3. MAIN LAYOUT: Left Unit & Drive Navigation + Right Explorer
      ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* =========================================================
            LEFT COLUMN: + BARU BUTTON & UNIT/FOLDER DIRECTORY (3 Cols)
        ========================================================= */}
        <div className="lg:col-span-3 space-y-4">
          {/* Google Drive Signature "+ Baru" Button with Dropdown (Non-Kasek) */}
          {!isKasek && (
            <div className="relative" ref={newMenuRef}>
              <button
                type="button"
                onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 shadow-sm hover:shadow-md flex items-center gap-3.5 text-slate-800 text-sm font-bold cursor-pointer transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0077B6] flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <span>Baru</span>
              </button>

              {isNewMenuOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-60 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-30 animate-in fade-in duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewMenuOpen(false);
                      setUploadFolder(currentFolder || '02. Standar Isi & Kurikulum');
                      setIsUploadOpen(true);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4 text-[#0077B6]" />
                    <span>Upload Berkas</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewMenuOpen(false);
                      setIsNewFolderOpen(true);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                  >
                    <FolderPlus className="w-4 h-4 text-orange-500" />
                    <span>Folder Baru</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Drive Navigation Pills */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs space-y-1">
            <button
              type="button"
              onClick={() => {
                setIsViewingAllUnits(true);
                setCurrentFolder(null);
                setSelectedDoc(null);
                setActiveTab('all');
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                isViewingAllUnits
                  ? 'bg-blue-50 text-[#0077B6] border border-blue-200'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Folder className={`w-4 h-4 ${isViewingAllUnits ? 'text-[#0077B6] fill-blue-100' : 'text-slate-400'}`} />
                <span>Semua 18 Folder Unit</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-semibold ${
                isViewingAllUnits ? 'bg-blue-100 text-[#0077B6]' : 'bg-slate-100 text-slate-600'
              }`}>
                18 Unit
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsViewingAllUnits(false);
                setCurrentFolder(null);
                setActiveTab('all');
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                !isViewingAllUnits && activeTab === 'all' && !currentFolder
                  ? 'bg-blue-50 text-[#0077B6] border border-blue-200'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-4 h-4 text-[#0077B6]" />
                <span className="truncate">{activeUnit.name}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                {unitDocuments.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('starred');
                setIsViewingAllUnits(false);
                setCurrentFolder(null);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                activeTab === 'starred'
                  ? 'bg-amber-50 text-amber-900 border border-amber-200'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Dokumen Berbintang</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-mono">
                {unitDocuments.filter((d) => d.isStarred).length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('verified');
                setIsViewingAllUnits(false);
                setCurrentFolder(null);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                activeTab === 'verified'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tervalidasi TPMPS</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono">
                {unitDocuments.filter((d) => d.status === 'Terverifikasi').length}
              </span>
            </button>
          </div>

          {/* Unit Kerja Directory Box */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0077B6]" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Daftar 18 Unit Kerja
                </span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                {units.length} Unit
              </span>
            </div>

            <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
              {units.map((u, idx) => {
                const isSelected = !isViewingAllUnits && u.id === selectedUnitId;
                const unitNumber = idx + 1;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setSelectedUnitId(u.id);
                      setIsViewingAllUnits(false);
                      setCurrentFolder(null);
                      setSelectedDoc(null);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs transition-colors flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-[#0077B6] text-white font-semibold shadow-xs'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-mono font-bold shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {unitNumber}
                      </span>
                      <div className="truncate">
                        <div className="truncate">{u.name}</div>
                        <div
                          className={`text-[10px] truncate ${
                            isSelected ? 'text-white/80' : 'text-slate-400'
                          }`}
                        >
                          {u.code}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cloud Storage Usage Card (Clean, Soft & Defined) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#0077B6]" />
                <span className="text-xs font-bold text-slate-800">
                  Penyimpanan Mutu
                </span>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#0077B6] border border-blue-200">
                28% Terpakai
              </span>
            </div>

            <div className="text-lg font-bold text-slate-900 font-mono">
              4.2 <span className="text-xs font-normal text-slate-500 font-sans">GB dari 15 GB</span>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#0077B6] rounded-full" style={{ width: '28%' }} />
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-100">
              Terintegrasi dengan Google Workspace for Education & Supabase Storage SMK Negeri 2 Magelang.
            </p>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: GOOGLE DRIVE EXPLORER & DETAILS (9 Cols)
        ========================================================= */}
        <div className={`${isDetailsOpen ? 'lg:col-span-6 xl:col-span-6' : 'lg:col-span-9'} space-y-5 transition-all`}>
          {isViewingAllUnits ? (
            /* =========================================================
               VIEW 1: REPOSITORI 18 UNIT KERJA (Folder Bentuk Visual)
            ========================================================= */
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0077B6] shrink-0">
                      <Folder className="w-5 h-5 fill-blue-100" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 tracking-tight">
                        Folder Repositori 18 Unit Kerja
                      </h2>
                      <p className="text-xs text-slate-500">
                        {isKasek
                          ? 'Pilih folder unit kerja untuk memeriksa berkas bukti fisik pemenuhan mutu.'
                          : 'Pilih folder unit kerja di bawah untuk membuka dan mengunggah berkas.'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-[#0077B6] border border-blue-200 self-start sm:self-auto font-mono">
                    {units.length} Folder Unit
                  </span>
                </div>
              </div>

              {/* Visual 18 Folders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
                {units.map((u, idx) => {
                  const unitDocs = documents.filter((d) => d.unitId === u.id);
                  const verifiedCount = unitDocs.filter((d) => d.status === 'Terverifikasi').length;
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
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#0077B6] hover:bg-slate-50/50 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0077B6] group-hover:scale-105 transition-transform">
                            <Folder className="w-5 h-5 fill-blue-100" />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              Unit {String(unitNumber).padStart(2, '0')}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-[#0077B6] border border-blue-200">
                              {u.code}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0077B6] transition-colors line-clamp-2">
                          {u.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                          PIC: {u.picName}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-700">
                            {unitDocs.length} Berkas
                          </span>
                          {verifiedCount > 0 && (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              {verifiedCount} Sah
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-[#0077B6] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Buka Folder &rarr;
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* =========================================================
               VIEW 2: DALAM UNIT (Sub-Folders & Dokumen)
            ========================================================= */
            <div className="space-y-4">
              {/* Breadcrumb Path & Filters */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Breadcrumb Navigation */}
                  <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setIsViewingAllUnits(true);
                        setCurrentFolder(null);
                        setActiveTab('all');
                      }}
                      className="hover:text-[#0077B6] transition-colors cursor-pointer flex items-center gap-1 text-[#0077B6]"
                    >
                      <Folder className="w-3.5 h-3.5 fill-blue-100" />
                      <span>Semua 18 Unit</span>
                    </button>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setCurrentFolder(null)}
                      className={`hover:text-[#0077B6] transition-colors cursor-pointer ${
                        !currentFolder ? 'text-slate-900 font-bold' : ''
                      }`}
                    >
                      {activeUnit.name}
                    </button>
                    {currentFolder && (
                      <>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[#0077B6] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 font-bold">
                          {currentFolder}
                        </span>
                      </>
                    )}
                  </nav>

                  {/* Filter Status & Penempatan */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 outline-hidden focus:border-[#0077B6]"
                      title="Filter Penempatan Dokumen Mutu"
                    >
                      {availableCategoriesForUnit.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 outline-hidden focus:border-[#0077B6]"
                    >
                      <option value="ALL">Semua Status</option>
                      <option value="Terverifikasi">Terverifikasi</option>
                      <option value="Menunggu Review">Menunggu Review</option>
                      <option value="Perlu Revisi">Perlu Revisi</option>
                    </select>
                  </div>
                </div>

                {/* Quick Format Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1 border-t border-slate-100">
                  {[
                    { label: 'Semua Format', val: 'ALL' },
                    { label: 'PDF Document', val: 'pdf' },
                    { label: 'Spreadsheet Excel', val: 'excel' },
                    { label: 'Word Document', val: 'word' },
                    { label: 'Foto / Gambar', val: 'image' }
                  ].map((chip) => (
                    <button
                      key={chip.val}
                      type="button"
                      onClick={() => setFilterType(chip.val as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 cursor-pointer transition-colors ${
                        filterType === chip.val
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Access Cards (Top 4 recent files) */}
              {!currentFolder && activeTab === 'all' && !searchQuery && quickAccessDocs.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2.5 px-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Disarankan & Sering Diakses
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quickAccessDocs.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className={`p-3.5 rounded-xl bg-white border transition-all cursor-pointer flex items-start gap-3 hover:shadow-xs ${
                          selectedDoc?.id === doc.id
                            ? 'border-[#0077B6] bg-blue-50/50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                          {getFileIcon(doc.fileType, 'w-5 h-5')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-mono font-semibold text-[#0077B6] truncate">
                              {doc.code}
                            </span>
                            <span
                              className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(
                                doc.status
                              )}`}
                            >
                              {doc.status}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 truncate mt-1">
                            {doc.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {doc.fileSize} &bull; {doc.folder || 'Root'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Folders Section */}
              {!currentFolder && activeTab === 'all' && !searchQuery && (
                <div>
                  <div className="flex items-center justify-between mb-2.5 px-1">
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4 text-[#0077B6]" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Folder ({unitFolders.length})
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
                    {unitFolders.map((folderName) => {
                      const count = folderCounts[folderName] || 0;
                      return (
                        <div
                          key={folderName}
                          onClick={() => setCurrentFolder(folderName)}
                          className="p-3 rounded-xl bg-white border border-slate-200 hover:border-[#0077B6] hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0077B6] shrink-0">
                              <Folder className="w-4 h-4 fill-blue-100" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-slate-900 group-hover:text-[#0077B6] transition-colors truncate">
                                {folderName}
                              </div>
                              <div className="text-[10px] text-slate-500 font-medium">
                                {count} berkas
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Files Section */}
              <div>
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0077B6]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {currentFolder ? `Berkas dalam: ${currentFolder}` : 'Semua Berkas'} ({displayedDocs.length})
                    </h3>
                  </div>
                </div>

                {displayedDocs.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 text-slate-400 space-y-2.5">
                    <Folder className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-700">Tidak ada berkas di folder ini.</p>
                    <p className="text-xs text-slate-400">Unggah berkas bukti fisik untuk melengkapi folder mutu unit ini.</p>
                    {!isKasek && (
                      <button
                        type="button"
                        onClick={() => setIsUploadOpen(true)}
                        className="mt-2 px-4 py-2 rounded-xl bg-[#0077B6] text-white text-xs font-semibold hover:bg-[#0284C7] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>Upload Berkas Sekarang</span>
                      </button>
                    )}
                  </div>
                ) : viewMode === 'list' ? (
                  /* GOOGLE DRIVE SIGNATURE LIST VIEW */
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="py-3 px-4 font-bold">Nama Berkas</th>
                            <th className="py-3 px-3 font-bold">Pemilik / Unit</th>
                            <th className="py-3 px-3 font-bold">Penempatan</th>
                            <th className="py-3 px-3 font-bold">Terakhir Diubah</th>
                            <th className="py-3 px-3 font-bold">Ukuran</th>
                            <th className="py-3 px-4 text-right font-bold">Aksi</th>
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
                                  isSelected
                                    ? 'bg-[#E8F0FE] text-blue-950 font-medium'
                                    : 'hover:bg-slate-50 text-slate-800'
                                }`}
                              >
                                <td className="py-2.5 px-4">
                                  <div className="flex items-center gap-3">
                                    {getFileIcon(doc.fileType, 'w-5 h-5 shrink-0')}
                                    <div className="min-w-0">
                                      <div className="font-semibold text-slate-900 truncate max-w-xs sm:max-w-sm">
                                        {doc.title}
                                      </div>
                                      <div className="text-[10px] font-mono text-[#0077B6] flex items-center gap-1.5 flex-wrap">
                                        <span>{doc.code}</span>
                                        <span>&bull; {doc.fileName}</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 text-slate-600 truncate max-w-[120px]">
                                  {doc.unitName}
                                </td>
                                <td className="py-2.5 px-3">
                                  {doc.kategoriDokumen && (
                                    <span
                                      className={`text-[9px] font-semibold px-2 py-0.5 rounded-md border ${
                                        doc.kategoriDokumen === 'MM'
                                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                          : doc.kategoriDokumen === 'PM'
                                          ? 'bg-blue-50 text-[#0077B6] border-blue-200'
                                          : doc.kategoriDokumen === 'PK'
                                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                          : doc.kategoriDokumen === 'CM'
                                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                                          : doc.kategoriDokumen === 'LAINNYA'
                                          ? 'bg-slate-100 text-slate-700 border-slate-200'
                                          : 'bg-purple-50 text-purple-700 border-purple-200'
                                      }`}
                                    >
                                      {doc.kategoriDokumen === 'CM' ? 'CM (F)' : doc.kategoriDokumen}
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                                  {doc.updatedAt.substring(0, 10)}
                                </td>
                                <td className="py-2.5 px-3 font-mono text-slate-500">
                                  {doc.fileSize}
                                </td>
                                <td className="py-2.5 px-4 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      type="button"
                                      onClick={(e) => handleToggleStar(doc.id, e)}
                                      className="p-1.5 rounded-md text-slate-400 hover:text-amber-500 hover:bg-slate-100 cursor-pointer"
                                      title={doc.isStarred ? 'Hapus bintang' : 'Beri bintang'}
                                    >
                                      <Star
                                        className={`w-3.5 h-3.5 ${
                                          doc.isStarred
                                            ? 'text-amber-500 fill-amber-500'
                                            : 'text-slate-400'
                                        }`}
                                      />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setPreviewDoc(doc);
                                      }}
                                      className="p-1.5 rounded-md text-slate-400 hover:text-[#0077B6] hover:bg-slate-100 cursor-pointer"
                                      title="Pratinjau berkas"
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
                                        title="Hapus berkas"
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
                  /* GRID VIEW */
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
                    {displayedDocs.map((doc) => {
                      const isSelected = selectedDoc?.id === doc.id;
                      return (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDoc(doc)}
                          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-xs ${
                            isSelected
                              ? 'border-[#0077B6] bg-blue-50/40'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform">
                                {getFileIcon(doc.fileType, 'w-5 h-5')}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={(e) => handleToggleStar(doc.id, e)}
                                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-amber-500 transition-colors"
                                  title={doc.isStarred ? 'Hapus bintang' : 'Beri bintang'}
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      doc.isStarred
                                        ? 'text-amber-500 fill-amber-500'
                                        : 'text-slate-300'
                                    }`}
                                  />
                                </button>
                                <span
                                  className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(
                                    doc.status
                                  )}`}
                                >
                                  {doc.status}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-mono font-semibold text-[#0077B6]">
                                {doc.code}
                              </span>
                              {doc.kategoriDokumen && (
                                <span
                                  className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md border ${
                                    doc.kategoriDokumen === 'MM'
                                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                      : doc.kategoriDokumen === 'PM'
                                      ? 'bg-blue-50 text-[#0077B6] border-blue-200'
                                      : doc.kategoriDokumen === 'PK'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : doc.kategoriDokumen === 'CM'
                                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : doc.kategoriDokumen === 'LAINNYA'
                                      ? 'bg-slate-100 text-slate-700 border-slate-200'
                                      : 'bg-purple-50 text-purple-700 border-purple-200'
                                  }`}
                                >
                                  {doc.kategoriDokumen === 'CM' ? 'CM (F)' : doc.kategoriDokumen}
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 mt-1 leading-snug group-hover:text-[#0077B6] transition-colors">
                              {doc.title}
                            </h4>

                            <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                              {doc.notes || 'Tidak ada catatan khusus.'}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                            <span className="font-mono">{doc.fileSize}</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewDoc(doc);
                                }}
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#0077B6] transition-colors"
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
                                  className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                                  title="Hapus berkas"
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
            RIGHT COLUMN: FILE DETAILS DRAWER (Google Drive Style) (3 Cols)
        ========================================================= */}
        {isDetailsOpen && (
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4 sticky top-20">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#0077B6]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Rincian Berkas
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDetailsOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedDoc ? (
                <div className="space-y-4 text-xs">
                  {/* File Preview Thumbnail */}
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
                    {getFileIcon(selectedDoc.fileType, 'w-10 h-10 mb-2')}
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">
                      {selectedDoc.title}
                    </h4>
                    <span className="text-[10px] font-mono text-[#0077B6] mt-1">
                      {selectedDoc.fileName}
                    </span>
                    <span
                      className={`mt-2 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        selectedDoc.status
                      )}`}
                    >
                      {selectedDoc.status}
                    </span>
                  </div>

                  {/* Metadata Table */}
                  <div className="space-y-2 divide-y divide-slate-100">
                    <div className="flex justify-between pt-1.5">
                      <span className="text-slate-500">Kode Bukti:</span>
                      <span className="font-mono font-bold text-slate-900">{selectedDoc.code}</span>
                    </div>

                    <div className="flex justify-between pt-1.5">
                      <span className="text-slate-500">Penempatan:</span>
                      <span className="font-semibold text-slate-900 text-right">
                        {selectedDoc.kategoriDokumen
                          ? selectedDoc.kategoriDokumen === 'CM'
                            ? 'Catatan Mutu (CM / F)'
                            : selectedDoc.kategoriDokumen === 'LAINNYA'
                            ? 'Dokumen Pendukung'
                            : selectedDoc.kategoriDokumen
                          : 'Dokumen Unit'}
                      </span>
                    </div>

                    <div className="flex justify-between pt-1.5">
                      <span className="text-slate-500">Unit Kerja:</span>
                      <span className="font-semibold text-slate-900 text-right truncate max-w-[140px]">
                        {selectedDoc.unitName}
                      </span>
                    </div>

                    <div className="flex justify-between pt-1.5">
                      <span className="text-slate-500">Standar SNP:</span>
                      <span className="font-semibold text-[#0077B6] text-right truncate max-w-[140px]">
                        {selectedDoc.standardName || 'SNP Terkait'}
                      </span>
                    </div>

                    <div className="flex justify-between pt-1.5">
                      <span className="text-slate-500">Folder:</span>
                      <span className="font-medium text-slate-800 text-right truncate max-w-[140px]">{selectedDoc.folder || 'Root'}</span>
                    </div>

                    <div className="flex justify-between pt-1.5">
                      <span className="text-slate-500">Ukuran:</span>
                      <span className="font-mono font-medium text-slate-800">
                        {selectedDoc.fileSize}
                      </span>
                    </div>

                    <div className="flex justify-between pt-1.5">
                      <span className="text-slate-500">Diunggah Oleh:</span>
                      <span className="font-medium text-slate-800 text-right truncate max-w-[140px]">{selectedDoc.uploadedByName || '-'}</span>
                    </div>

                    <div className="flex justify-between pt-1.5">
                      <span className="text-slate-500">Waktu Upload:</span>
                      <span className="text-slate-800 font-mono text-[11px]">
                        {selectedDoc.createdAt.substring(0, 16).replace('T', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Notes Box */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Catatan Berkas:
                    </span>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      {selectedDoc.notes || 'Tidak ada catatan khusus.'}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(selectedDoc)}
                      className="w-full py-2.5 rounded-xl bg-[#0077B6] hover:bg-[#0284C7] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Pratinjau Layar Penuh</span>
                    </button>

                    <Link
                      href={`/dokumen/${selectedDoc.id}`}
                      className="w-full py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <FileCheck className="w-4 h-4 text-[#0077B6]" />
                      <span>Halaman Validasi TPMPS</span>
                    </Link>

                    {!isKasek && (
                      <button
                        type="button"
                        onClick={() => setTargetDelete(selectedDoc)}
                        className="w-full py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Hapus dari Drive</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center text-slate-400 space-y-2">
                  <Info className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs">Pilih salah satu berkas di sebelah kiri untuk melihat rincian.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------
          MODAL: UPLOAD BERKAS KE GOOGLE DRIVE UNIT
      ------------------------------------------------------------- */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0077B6]">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Upload Berkas ke Drive
                  </h3>
                  <p className="text-xs text-slate-500">
                    Unit: <span className="font-semibold text-[#0077B6]">{activeUnit.name}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              {/* Clean Solid Dropzone */}
              <div className="p-5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-center space-y-1.5 cursor-pointer transition-colors">
                <UploadCloud className="w-7 h-7 text-[#0077B6] mx-auto" />
                <p className="font-bold text-slate-800">Pilih berkas dari perangkat Anda</p>
                <p className="text-[11px] text-slate-500">Format yang didukung: PDF, Excel (.xlsx), Word (.docx), Foto (Maks. 25 MB)</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Judul Dokumen Bukti *
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Contoh: Laporan Penyelarasan Kurikulum dengan IDUKA 2025"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 focus:border-[#0077B6] focus:ring-2 focus:ring-blue-500/10 text-xs text-slate-900 outline-hidden transition-all"
                />
              </div>

              {/* Penempatan Dokumen Mutu */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Penempatan Dokumen Mutu *</span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {isTPMPSUnit ? 'Wewenang Penuh TPMPS' : 'Penempatan Khusus Unit Kerja'}
                  </span>
                </label>
                <div className={`grid grid-cols-1 ${uploadCategoryOptions.length > 4 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-2`}>
                  {uploadCategoryOptions.map((opt) => {
                    const isSelected = uploadKategori === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setUploadKategori(opt.value)}
                        className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[#0077B6] bg-blue-50 text-[#0077B6]'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold">
                            {opt.value === 'CM' ? 'CM (F)' : opt.value}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#0077B6]" />}
                        </div>
                        <div className="text-xs font-semibold text-slate-900 mt-0.5">{opt.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{opt.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Visual Folder Picker (Bukan Dropdown) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Folder className="w-3.5 h-3.5 text-[#0077B6]" />
                    <span>Pilih Folder Tujuan Penyimpanan *</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {unitFolders.length} Folder
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50">
                  {unitFolders.map((f) => {
                    const isSelected = uploadFolder === f;
                    const count = folderCounts[f] || 0;
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setUploadFolder(f)}
                        className={`p-2 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between group ${
                          isSelected
                            ? 'border-[#0077B6] bg-blue-50 text-[#0077B6]'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-blue-100 text-[#0077B6]'
                                : 'bg-slate-100 text-slate-500 group-hover:text-[#0077B6]'
                            }`}
                          >
                            <Folder className={`w-3.5 h-3.5 ${isSelected ? 'fill-blue-200' : ''}`} />
                          </div>
                          <div className="min-w-0">
                            <div
                              className={`text-xs font-semibold truncate ${
                                isSelected ? 'text-[#0077B6]' : 'text-slate-800'
                              }`}
                            >
                              {f}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">
                              {count} berkas
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0077B6] shrink-0 ml-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Standar SNP Terkait
                  </label>
                  <select
                    value={uploadStandardId}
                    onChange={(e) => setUploadStandardId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 focus:border-[#0077B6] text-xs text-slate-900 outline-hidden"
                  >
                    {INITIAL_STANDARDS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Format Berkas
                  </label>
                  <select
                    value={uploadFileType}
                    onChange={(e) => setUploadFileType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 focus:border-[#0077B6] text-xs text-slate-900 outline-hidden"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="excel">Excel Spreadsheet (.xlsx)</option>
                    <option value="word">Word Document (.docx)</option>
                    <option value="image">Gambar / Foto Bukti (.jpg/.png)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Nama File (Opsional)
                </label>
                <input
                  type="text"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="nama_berkas.pdf"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 focus:border-[#0077B6] text-xs text-slate-900 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Catatan / Keterangan Dokumen
                </label>
                <textarea
                  rows={2}
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="Keterangan singkat tentang isi berkas bukti..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 focus:border-[#0077B6] text-xs text-slate-900 outline-hidden"
                />
              </div>

              {/* Progress Bar when uploading */}
              {isUploading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                    <span>Mengunggah ke Cloud Storage...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0077B6] transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-[#0077B6] hover:bg-[#0284C7] text-white font-semibold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isUploading ? 'Sedang Mengunggah...' : 'Upload Dokumen'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: BUAT FOLDER BARU
      ------------------------------------------------------------- */}
      {isNewFolderOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Folder Baru</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewFolderOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Nama Folder
                </label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Contoh: Rapat Pleno Kurikulum 2025"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 focus:border-[#0077B6] text-xs text-slate-900 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewFolderOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0077B6] hover:bg-[#0284C7] text-white font-semibold cursor-pointer transition-colors"
                >
                  Buat Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: PREVIEW BERKAS LAYAR PENUH (Lightbox)
      ------------------------------------------------------------- */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50">
              <div className="flex items-center gap-3 min-w-0">
                {getFileIcon(previewDoc.fileType, 'w-6 h-6 shrink-0')}
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {previewDoc.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {previewDoc.code} &bull; {previewDoc.fileName} &bull; {previewDoc.fileSize}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${getStatusBadge(
                    previewDoc.status
                  )}`}
                >
                  {previewDoc.status}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Body Simulation */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-100 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 max-w-2xl w-full border border-slate-200 space-y-5">
                {/* Official Header */}
                <div className="border-b-2 border-slate-900 pb-3 text-center space-y-0.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    PEMERINTAH PROVINSI JAWA TENGAH &bull; DINAS PENDIDIKAN DAN KEBUDAYAAN
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    SMK NEGERI 2 MAGELANG
                  </h2>
                  <p className="text-[10px] text-slate-600">
                    Jl. Perintis Kemerdekaan No. 9, Kota Magelang, Jawa Tengah 56115
                  </p>
                </div>

                {/* Document Body */}
                <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed">
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                    <div className="font-bold text-[#0077B6] uppercase tracking-wider text-[10px]">
                      Identitas Bukti Mutu Standar Nasional Pendidikan
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {previewDoc.title}
                    </div>
                    <div className="text-slate-600">
                      Unit Kerja: <span className="font-bold text-slate-900">{previewDoc.unitName}</span>
                    </div>
                    <div className="text-slate-600">
                      Standar Mutu: <span className="font-bold text-[#0077B6]">{previewDoc.standardName}</span>
                    </div>
                  </div>

                  <p>
                    Dokumen ini merupakan arsip resmi penjaminan mutu yang telah diunggah ke Google Drive Repositori Mutu SMK Negeri 2 Magelang untuk mendukung siklus Penjaminan Mutu Internal (SPMI) berbasis PPEPP.
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">Keterangan / Catatan Verifikasi:</span>
                    <p className="text-slate-600 italic">
                      &ldquo;{previewDoc.notes || 'Dokumen telah sesuai dengan instrumen pemenuhan standar mutu.'}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Signature Simulation */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div>
                    <p className="font-semibold">Pengunggah Dokumen:</p>
                    <p className="font-bold text-slate-900 mt-5">{previewDoc.uploadedByName || 'PIC Unit Kerja'}</p>
                    <p className="text-[10px] text-slate-500">{previewDoc.unitName}</p>
                  </div>

                  {previewDoc.verifiedByName && (
                    <div className="text-right">
                      <p className="font-semibold text-emerald-700">Verifikator TPMPS:</p>
                      <p className="font-bold text-slate-900 mt-5">{previewDoc.verifiedByName}</p>
                      <p className="text-[10px] text-slate-500">Tim Penjaminan Mutu Sekolah</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3.5 border-t border-slate-200 bg-white flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                Keamanan: Supabase Storage &bull; Hash SHA-256 Validated
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Tautan berkas "${previewDoc.title}" disalin ke clipboard!`, 'info');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Salin Tautan</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Mengunduh berkas "${previewDoc.fileName}"...`, 'success');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-[#0077B6] hover:bg-[#0284C7] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Berkas</span>
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
        message={`Apakah Anda yakin ingin menghapus berkas "${targetDelete?.title}" dari Google Drive ${activeUnit.name}?`}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setTargetDelete(null)}
      />
    </AppShell>
  );
}
