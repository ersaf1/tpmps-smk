'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AppShell from '@/components/layout/AppShell';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/ToastFeedback';
import { sintesaService, INITIAL_UNITS, INITIAL_STANDARDS } from '@/lib/services/sintesaDataService';
import { BuktiDokumen, UnitKerja, StatusDokumen, UserProfile } from '@/types/sintesa';
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
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Filter,
  Grid,
  List as ListIcon,
  Info,
  Download,
  Trash2,
  ChevronRight,
  Plus,
  HardDrive,
  Share2,
  ExternalLink,
  ChevronDown,
  Building2,
  Sparkles,
  Eye,
  X,
  FileCheck
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
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'pdf' | 'excel' | 'word' | 'image'>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'all' | 'starred' | 'recent' | 'verified'>('all');

  // Documents State
  const [documents, setDocuments] = useState<BuktiDokumen[]>(() => sintesaService.getDocuments());
  const [customFolders, setCustomFolders] = useState<Record<string, string[]>>({});

  // Selected file for preview / right info drawer
  const [selectedDoc, setSelectedDoc] = useState<BuktiDokumen | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
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

    // If logged-in user is a unit (role === 'guru') and has unitId, default to their unit
    if (user && user.unitId && user.role === 'guru') {
      setSelectedUnitId(user.unitId);
    } else if (loadedUnits.length > 0 && !loadedUnits.find((u) => u.id === selectedUnitId)) {
      setSelectedUnitId(loadedUnits[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeUnit = useMemo(() => {
    return units.find((u) => u.id === selectedUnitId) || units[0] || INITIAL_UNITS[0];
  }, [units, selectedUnitId]);

  // Combined Folders for this unit
  const unitFolders = useMemo(() => {
    const custom = customFolders[selectedUnitId] || [];
    return [...DEFAULT_FOLDERS, ...custom];
  }, [selectedUnitId, customFolders]);

  // Filtered Documents
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
        if (!matchTitle && !matchCode && !matchFolder) return false;
      }

      // Type filter
      if (filterType !== 'ALL' && doc.fileType !== filterType) return false;

      // Status filter
      if (filterStatus !== 'ALL' && doc.status !== filterStatus) return false;

      return true;
    });
  }, [unitDocuments, currentFolder, searchQuery, filterType, filterStatus, activeTab]);

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
        const newCode = `DOC-${activeUnit.code}-${Date.now().toString().slice(-4)}`;

        const newDoc = sintesaService.createDocument({
          code: newCode,
          title: uploadTitle.trim(),
          fileName,
          fileUrl: `/storage/documents/${fileName}`,
          fileSize: `${(Math.random() * 5 + 1.2).toFixed(1)} MB`,
          fileType: uploadFileType,
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
        showToast(`Dokumen "${newDoc.title}" berhasil diunggah ke Google Drive ${activeUnit.name}!`, 'success');
      }, 400);
    }, 400);
  };

  const getFileIcon = (type: string, className = 'w-6 h-6') => {
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
        return 'bg-sky-50 border-sky-200 text-[#0077B6]';
      case 'Perlu Revisi':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'Ditolak':
        return 'bg-rose-50 border-rose-200 text-rose-700';
    }
  };

  return (
    <AppShell
      title="Google Drive Unit Kerja"
      subtitle="Pusat Repositori & Berkas Digital Terpadu Berbasis Unit TPMPS SMK Negeri 2 Magelang"
    >
      {/* -------------------------------------------------------------
          TOP BAR: Google Drive Header Bar
      ------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Brand / Drive Identity */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0077B6] to-[#0284C7] flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                  Google Drive Unit
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0077B6] border border-blue-200">
                  {activeUnit.code}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-sm sm:max-w-md">
                {activeUnit.name} &bull; PIC: {activeUnit.picName}
              </p>
            </div>
          </div>

          {/* Center: Drive Style Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Telusuri di Drive ${activeUnit.name}...`}
                className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] focus:ring-2 focus:ring-blue-500/10 text-xs sm:text-sm text-slate-900 placeholder-slate-400 transition-all outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Actions (+ Baru, Grid/List, Info) */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setUploadFolder(currentFolder || '02. Standar Isi & Kurikulum');
                setIsUploadOpen(true);
              }}
              className="btn-enterprise px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] hover:brightness-105 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Baru</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNewFolderOpen(true)}
              className="btn-enterprise px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-2xs transition-colors"
              title="Buat Folder Baru"
            >
              <FolderPlus className="w-4 h-4 text-[#0077B6]" />
              <span className="hidden sm:inline">Folder Baru</span>
            </button>

            {/* View Mode Switch */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#0077B6] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Tampilan Kisi"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-[#0077B6] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Tampilan Daftar"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Details Panel Toggle */}
            <button
              type="button"
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isDetailsOpen
                  ? 'bg-blue-50 border-blue-200 text-[#0077B6]'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500'
              }`}
              title="Rincian Berkas"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          MAIN 2-COLUMN LAYOUT: Left Unit Switcher & Right Drive Explorer
      ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================================
            LEFT COLUMN: UNIT SWITCHER & DRIVE NAVIGATION (3 Cols)
        ========================================================= */}
        <div className="lg:col-span-3 space-y-5">
          {/* Unit Selector Box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0077B6]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Daftar Unit Kerja
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {units.length} Unit
                </span>
                <Link
                  href="/unit"
                  className="text-[10px] font-bold text-[#0077B6] hover:underline"
                >
                  Kelola &rarr;
                </Link>
              </div>
            </div>

            {/* Unit Dropdown / Selector */}
            <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
              {units.map((u, idx) => {
                const isSelected = u.id === selectedUnitId;
                const unitNumber = idx + 1;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setSelectedUnitId(u.id);
                      setCurrentFolder(null);
                      setSelectedDoc(null);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#0077B6] to-[#0284C7] text-white font-bold shadow-xs shadow-sky-500/20'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-mono font-bold shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {unitNumber}
                      </span>
                      <div className="truncate">
                        <div className="truncate font-semibold">{u.name}</div>
                        <div
                          className={`text-[10px] truncate ${
                            isSelected ? 'text-white/80' : 'text-slate-400'
                          }`}
                        >
                          {u.code} &bull; {u.category}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drive Navigation Filters */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-1">
              Navigasi Drive
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab('all');
                setCurrentFolder(null);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                activeTab === 'all' && !currentFolder
                  ? 'bg-blue-50 text-[#0077B6] border border-blue-200 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-4 h-4 text-[#0077B6]" />
                <span>Drive Unit Saya</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                {unitDocuments.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('starred');
                setCurrentFolder(null);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                activeTab === 'starred'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Dokumen Berbintang</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono">
                {unitDocuments.filter((d) => d.isStarred).length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('verified');
                setCurrentFolder(null);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                activeTab === 'verified'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tervalidasi TPMPS</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                {unitDocuments.filter((d) => d.status === 'Terverifikasi').length}
              </span>
            </button>
          </div>

          {/* Cloud Storage Quota Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#0284C7]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Penyimpanan Unit
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-sky-300">
                28%
              </span>
            </div>

            <div className="text-2xl font-black font-mono">
              4.2 <span className="text-sm font-sans font-normal text-slate-400">GB dari 15 GB</span>
            </div>

            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#0077B6] to-sky-400 rounded-full" style={{ width: '28%' }} />
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-white/10">
              Terintegrasi dengan Google Workspace for Education & Supabase Storage SMK Negeri 2 Magelang.
            </p>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: GOOGLE DRIVE EXPLORER & DETAILS (9 Cols)
        ========================================================= */}
        <div className={`${isDetailsOpen ? 'lg:col-span-6 xl:col-span-6' : 'lg:col-span-9'} space-y-6 transition-all`}>
          {/* Breadcrumbs & Filter Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              {/* Breadcrumb Navigation */}
              <nav className="flex items-center gap-2 text-xs font-semibold text-slate-600 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentFolder(null);
                    setActiveTab('all');
                  }}
                  className="hover:text-[#0077B6] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <HardDrive className="w-3.5 h-3.5 text-[#0077B6]" />
                  <span>Drive Unit</span>
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setCurrentFolder(null)}
                  className={`hover:text-[#0077B6] transition-colors cursor-pointer ${
                    !currentFolder ? 'font-bold text-slate-900' : ''
                  }`}
                >
                  {activeUnit.name}
                </button>
                {currentFolder && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-[#0077B6] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {currentFolder}
                    </span>
                  </>
                )}
              </nav>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 outline-hidden focus:border-[#0077B6]"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="Terverifikasi">Terverifikasi</option>
                  <option value="Menunggu Review">Menunggu Review</option>
                  <option value="Perlu Revisi">Perlu Revisi</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-all ${
                    filterType === chip.val
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Access Cards (Top Recent Files) */}
          {!currentFolder && activeTab === 'all' && !searchQuery && quickAccessDocs.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Disarankan & Sering Diakses
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {quickAccessDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer flex items-start gap-3.5 hover:shadow-md ${
                      selectedDoc?.id === doc.id
                        ? 'border-[#0077B6] ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                      {getFileIcon(doc.fileType, 'w-6 h-6')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono font-bold text-[#0077B6] truncate">
                          {doc.code}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                            doc.status
                          )}`}
                        >
                          {doc.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-1">
                        {doc.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1">
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
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-[#0077B6]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Folder Standar & Unit ({unitFolders.length})
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {unitFolders.map((folderName) => {
                  const count = folderCounts[folderName] || 0;
                  return (
                    <div
                      key={folderName}
                      onClick={() => setCurrentFolder(folderName)}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 group-hover:bg-blue-100/70 border border-blue-100 flex items-center justify-center text-[#0077B6] transition-colors shrink-0">
                          <Folder className="w-5 h-5 fill-sky-200" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#0077B6] transition-colors truncate">
                            {folderName}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium">
                            {count} Berkas Bukti
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
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0077B6]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {currentFolder ? `Berkas dalam: ${currentFolder}` : 'Semua Berkas Unit'} ({displayedDocs.length})
                </h3>
              </div>
            </div>

            {displayedDocs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 space-y-3">
                <Folder className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold">Tidak ada berkas di folder ini.</p>
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-50 text-[#0077B6] text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  Upload Dokumen Sekarang
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {displayedDocs.map((doc) => {
                  const isSelected = selectedDoc?.id === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md ${
                        isSelected
                          ? 'border-[#0077B6] ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div>
                        {/* Top: File Icon, Star, Status */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform">
                            {getFileIcon(doc.fileType, 'w-6 h-6')}
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
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                                doc.status
                              )}`}
                            >
                              {doc.status}
                            </span>
                          </div>
                        </div>

                        {/* Title & Code */}
                        <div className="text-[10px] font-mono font-bold text-[#0077B6]">
                          {doc.code}
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 mt-1 leading-snug group-hover:text-[#0077B6] transition-colors">
                          {doc.title}
                        </h4>

                        {/* Folder & Notes */}
                        <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                          {doc.notes || 'Tidak ada catatan tambahan.'}
                        </p>
                      </div>

                      {/* Footer Info & Quick Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-mono">{doc.fileSize}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewDoc(doc);
                            }}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-[#0077B6] transition-colors"
                            title="Pratinjau"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTargetDelete(doc);
                            }}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Nama Berkas</th>
                        <th className="py-3 px-3">Folder</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Ukuran</th>
                        <th className="py-3 px-3">Diperbarui</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
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
                              isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {getFileIcon(doc.fileType, 'w-5 h-5 shrink-0')}
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-900 truncate max-w-xs sm:max-w-sm">
                                    {doc.title}
                                  </div>
                                  <div className="text-[10px] font-mono text-[#0077B6]">
                                    {doc.code} &bull; {doc.fileName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-slate-600 truncate max-w-[140px]">
                              {doc.folder || '-'}
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                                  doc.status
                                )}`}
                              >
                                {doc.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono text-slate-500">
                              {doc.fileSize}
                            </td>
                            <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                              {doc.updatedAt.substring(0, 10)}
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={(e) => handleToggleStar(doc.id, e)}
                                  className="p-1 rounded-md text-slate-400 hover:text-amber-500"
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      doc.isStarred
                                        ? 'text-amber-500 fill-amber-500'
                                        : 'text-slate-300'
                                    }`}
                                  />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewDoc(doc);
                                  }}
                                  className="p-1 rounded-md text-slate-400 hover:text-[#0077B6]"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setTargetDelete(doc);
                                  }}
                                  className="p-1 rounded-md text-slate-400 hover:text-rose-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: FILE DETAILS DRAWER (Google Drive Style) (3 Cols)
        ========================================================= */}
        {isDetailsOpen && (
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-5 sticky top-24">
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
                  {/* Big Preview / Header */}
                  <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-blue-50/40 border border-slate-200 flex flex-col items-center text-center">
                    {getFileIcon(selectedDoc.fileType, 'w-12 h-12 mb-3')}
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">
                      {selectedDoc.title}
                    </h4>
                    <span className="text-[10px] font-mono text-[#0077B6] mt-1">
                      {selectedDoc.fileName}
                    </span>
                    <span
                      className={`mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        selectedDoc.status
                      )}`}
                    >
                      {selectedDoc.status}
                    </span>
                  </div>

                  {/* Metadata Table */}
                  <div className="space-y-2.5 divide-y divide-slate-100">
                    <div className="flex justify-between pt-2">
                      <span className="text-slate-500">Kode Bukti:</span>
                      <span className="font-mono font-bold text-slate-900">{selectedDoc.code}</span>
                    </div>

                    <div className="flex justify-between pt-2">
                      <span className="text-slate-500">Unit Pengunggah:</span>
                      <span className="font-semibold text-slate-900 text-right truncate max-w-[150px]">
                        {selectedDoc.unitName}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2">
                      <span className="text-slate-500">Standar SNP:</span>
                      <span className="font-semibold text-[#0077B6] text-right truncate max-w-[150px]">
                        {selectedDoc.standardName || 'SNP Terkait'}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2">
                      <span className="text-slate-500">Lokasi Folder:</span>
                      <span className="font-medium text-slate-800">{selectedDoc.folder || 'Utama'}</span>
                    </div>

                    <div className="flex justify-between pt-2">
                      <span className="text-slate-500">Ukuran & Versi:</span>
                      <span className="font-mono font-medium text-slate-800">
                        {selectedDoc.fileSize} &bull; {selectedDoc.version}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2">
                      <span className="text-slate-500">Diunggah Oleh:</span>
                      <span className="font-medium text-slate-800">{selectedDoc.uploadedByName || '-'}</span>
                    </div>

                    <div className="flex justify-between pt-2">
                      <span className="text-slate-500">Waktu Upload:</span>
                      <span className="text-slate-800 font-mono text-[11px]">
                        {selectedDoc.createdAt.substring(0, 16).replace('T', ' ')}
                      </span>
                    </div>

                    {selectedDoc.verifiedByName && (
                      <div className="flex justify-between pt-2">
                        <span className="text-slate-500">Diverifikasi:</span>
                        <span className="font-semibold text-emerald-700 text-right truncate max-w-[150px]">
                          {selectedDoc.verifiedByName}
                        </span>
                      </div>
                    )}
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
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(selectedDoc)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] hover:brightness-105 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Pratinjau Layar Penuh</span>
                    </button>

                    <Link
                      href={`/dokumen/${selectedDoc.id}`}
                      className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <FileCheck className="w-4 h-4 text-[#0077B6]" />
                      <span>Halaman Validasi TPMPS</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setTargetDelete(selectedDoc)}
                      className="w-full py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Hapus dari Drive</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Info className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs">Pilih salah satu berkas di sebelah kiri untuk melihat rincian lengkap.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------
          MODAL: UPLOAD FILE BARU KE GOOGLE DRIVE UNIT
      ------------------------------------------------------------- */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0077B6]">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Upload Berkas ke Drive Unit
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
              {/* Drag & Drop Simulation */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/60 text-center space-y-2 cursor-pointer transition-colors">
                <UploadCloud className="w-8 h-8 text-[#0077B6] mx-auto" />
                <p className="font-bold text-slate-700">Tarik dan lepas berkas ke sini, atau klik untuk memilih</p>
                <p className="text-[11px] text-slate-400">Mendukung format PDF, XLSX, DOCX, JPG (Maks. 25 MB)</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Judul Dokumen Bukti *
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Contoh: Laporan Penyelarasan Kurikulum dengan IDUKA 2025"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs text-slate-900 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Standar SNP Terkait
                  </label>
                  <select
                    value={uploadStandardId}
                    onChange={(e) => setUploadStandardId(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs text-slate-900 outline-hidden"
                  >
                    {INITIAL_STANDARDS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Folder Penyimpanan
                  </label>
                  <select
                    value={uploadFolder}
                    onChange={(e) => setUploadFolder(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs text-slate-900 outline-hidden"
                  >
                    {unitFolders.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Format Berkas
                  </label>
                  <select
                    value={uploadFileType}
                    onChange={(e) => setUploadFileType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs text-slate-900 outline-hidden"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="excel">Excel Spreadsheet (.xlsx)</option>
                    <option value="word">Word Document (.docx)</option>
                    <option value="image">Gambar / Foto Bukti (.jpg/.png)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Nama File (Opsional)
                  </label>
                  <input
                    type="text"
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                    placeholder="nama_berkas.pdf"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs text-slate-900 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Catatan / Keterangan Dokumen
                </label>
                <textarea
                  rows={2}
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="Keterangan singkat tentang isi dokumen bukti ini..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs text-slate-900 outline-hidden"
                />
              </div>

              {/* Progress Bar when uploading */}
              {isUploading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600">
                    <span>Mengunggah ke Cloud Storage...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0077B6] to-[#0284C7] transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] hover:brightness-105 text-white font-bold flex items-center gap-2 shadow-md shadow-sky-500/20 cursor-pointer disabled:opacity-60"
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <FolderPlus className="w-5 h-5 text-[#0077B6]" />
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
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Nama Folder
                </label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Contoh: Rapat Pleno Kurikulum 2025"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs text-slate-900 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewFolderOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0077B6] hover:bg-[#0284C7] text-white font-bold cursor-pointer transition-colors"
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50">
              <div className="flex items-center gap-3 min-w-0">
                {getFileIcon(previewDoc.fileType, 'w-7 h-7 shrink-0')}
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                    {previewDoc.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {previewDoc.code} &bull; {previewDoc.fileName} &bull; {previewDoc.fileSize}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(
                    previewDoc.status
                  )}`}
                >
                  {previewDoc.status}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Body Simulation */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full border border-slate-200 space-y-6">
                {/* Official Header */}
                <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    PEMERINTAH PROVINSI JAWA TENGAH &bull; DINAS PENDIDIKAN DAN KEBUDAYAAN
                  </div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    SMK NEGERI 2 MAGELANG
                  </h2>
                  <p className="text-[11px] text-slate-600">
                    Jl. Perintis Kemerdekaan No. 9, Kota Magelang, Jawa Tengah 56115
                  </p>
                </div>

                {/* Document Body */}
                <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-1.5">
                    <div className="font-bold text-[#0077B6] uppercase tracking-wider text-[10px]">
                      Identitas Bukti Mutu Standar Nasional Pendidikan
                    </div>
                    <div className="text-sm font-black text-slate-900">
                      {previewDoc.title}
                    </div>
                    <div className="text-slate-600">
                      Unit Kerja Pelaksana: <span className="font-bold text-slate-900">{previewDoc.unitName}</span>
                    </div>
                    <div className="text-slate-600">
                      Standar Mutu SNP: <span className="font-bold text-[#0077B6]">{previewDoc.standardName}</span>
                    </div>
                  </div>

                  <p>
                    Dokumen ini merupakan arsip resmi penjaminan mutu yang telah diunggah ke Google Drive Repositori Mutu SMK Negeri 2 Magelang untuk mendukung siklus Penjaminan Mutu Internal (SPMI) berbasis PPEPP.
                  </p>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">Keterangan / Catatan Verifikasi:</span>
                    <p className="text-slate-600 italic">
                      &ldquo;{previewDoc.notes || 'Dokumen telah sesuai dengan instrumen pemenuhan standar mutu.'}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Signature Simulation */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div>
                    <p className="font-semibold">Pengunggah Dokumen:</p>
                    <p className="font-bold text-slate-900 mt-6">{previewDoc.uploadedByName || 'PIC Unit Kerja'}</p>
                    <p className="text-[10px] text-slate-500">{previewDoc.unitName}</p>
                  </div>

                  {previewDoc.verifiedByName && (
                    <div className="text-right">
                      <p className="font-semibold text-emerald-700">Verifikator TPMPS:</p>
                      <p className="font-bold text-slate-900 mt-6">{previewDoc.verifiedByName}</p>
                      <p className="text-[10px] text-slate-500">Tim Penjaminan Mutu Sekolah</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                Keamanan: Supabase Storage &bull; Hash SHA-256 Validated
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Tautan berkas "${previewDoc.title}" disalin ke clipboard!`, 'info');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Salin Tautan</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Mengunduh berkas "${previewDoc.fileName}"...`, 'success');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0077B6] hover:bg-[#0284C7] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
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
