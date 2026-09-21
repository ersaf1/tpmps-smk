'use client';

import React, { useState, useEffect } from 'react';

import {
  LemariUnit,
  LaciUnit,
  BerkasLaci,
  UserProfile,
  UserRole,
  TahunAjaranRoom
} from '@/types/tpmps';
import { DEFAULT_ROOM_LIST } from '@/data/mockData';
import {
  Archive,
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderLock,
  Upload,
  ExternalLink,
  Search,
  Eye,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Link as LinkIcon,
  ChevronRight,
  ChevronDown,
  X,
  Plus,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  FileCheck2,
  Table,
  Pencil,
  Building2,
  Trash2,
  UserCheck,
  Zap,
  SlidersHorizontal,
  RefreshCw,
  Calendar,
  History,
  FolderArchive,
  Filter,
  Copy
} from 'lucide-react';

interface LemariTabProps {
  userRole: UserRole;
  currentUser: UserProfile;
  lemariList: LemariUnit[];
  laciList: LaciUnit[];
  selectedPeriode?: string;
  onPeriodeChange?: (p: string) => void;
  onUploadBerkas: (laciId: string, berkas: Omit<BerkasLaci, 'id' | 'laciId' | 'uploadedAt'>) => void;
  onVerifikasiLaci: (laciId: string, status: 'disetujui' | 'revisi', catatanAdmin: string) => void;
  onTambahLaci?: (lemariId: string, laciData: Partial<LaciUnit>) => void;
  onUpdateUnit?: (
    unitId: string,
    updatedData: {
      name: string;
      code?: string;
      pic?: string;
      category?: 'Manajemen' | 'Kejuruan' | 'Layanan' | 'Pengawasan';
      deskripsiJob?: string;
    }
  ) => void;
  onDeleteBerkas?: (laciId: string, berkasId: string) => void;
  onEditLaci?: (laciId: string, updatedData: Partial<LaciUnit>) => void;
  onDeleteLaci?: (laciId: string) => void;
  onBulkApproveAll?: () => void;
  onTambahLemariUnit?: (data: {
    name: string;
    code: string;
    category: 'Manajemen' | 'Kejuruan' | 'Layanan' | 'Pengawasan';
    pic: string;
    email: string;
    deskripsiJob: string;
  }) => void;
  onDeleteLemariUnit?: (unitId: string) => void;
  onOverrideStatusLaci?: (laciId: string, status: string) => void;
  onImpersonateUnit?: (unitId: string | null) => void;
}

export default function LemariTab({
  userRole,
  currentUser,
  lemariList,
  laciList,
  selectedPeriode,
  onPeriodeChange,
  onUploadBerkas,
  onVerifikasiLaci,
  onTambahLaci,
  onUpdateUnit,
  onDeleteBerkas,
  onEditLaci,
  onDeleteLaci,
  onBulkApproveAll,
  onTambahLemariUnit,
  onDeleteLemariUnit,
  onOverrideStatusLaci,
  onImpersonateUnit
}: LemariTabProps) {
  // Super Admin Check
  const isSuperAdmin =
    userRole === 'kepala_sekolah' ||
    userRole === 'ketua_tpmps' ||
    userRole === 'anggota_tpmps' ||
    userRole === 'admin';

  // Room Tahun Ajaran States
  const [roomList, setRoomList] = useState<TahunAjaranRoom[]>(DEFAULT_ROOM_LIST);
  const [activeRoomId, setActiveRoomId] = useState<string>(() => {
    const match = selectedPeriode?.match(/\d{4}\/\d{4}/)?.[0];
    return match || '2026/2027';
  });

  // Keep activeRoomId in sync when selectedPeriode changes
  const [prevPeriode, setPrevPeriode] = useState(selectedPeriode);
  if (selectedPeriode !== prevPeriode) {
    setPrevPeriode(selectedPeriode);
    const match = selectedPeriode?.match(/\d{4}\/\d{4}/)?.[0];
    if (match && match !== activeRoomId) {
      setActiveRoomId(match);
    }
  }

  const activeRoom = roomList.find((r) => r.id === activeRoomId) || roomList[0];

  const handleSelectRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    if (onPeriodeChange) {
      onPeriodeChange(`Semester Ganjil ${roomId}`);
    }
  };

  // Add Room Modal State (Super Admin)
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [newRoomYear, setNewRoomYear] = useState('2027/2028');
  const [newRoomLabel, setNewRoomLabel] = useState('Tahun Ajaran 2027/2028');
  const [newRoomDesc, setNewRoomDesc] = useState('Room Dokumen Mutu Tahun Ajaran Baru');
  const [newRoomStatus, setNewRoomStatus] = useState<'Aktif' | 'Arsip' | 'Mendatang'>('Mendatang');

  const handleSaveNewRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomYear.trim()) return;

    const newRoom: TahunAjaranRoom = {
      id: newRoomYear.trim(),
      label: newRoomLabel.trim() || `Tahun Ajaran ${newRoomYear.trim()}`,
      shortLabel: newRoomYear.trim(),
      status: newRoomStatus,
      description: newRoomDesc.trim() || `Room Arsip & Dokumen Siklus ${newRoomYear.trim()}`
    };

    setRoomList((prev) => [newRoom, ...prev]);
    setActiveRoomId(newRoom.id);
    if (onPeriodeChange) {
      onPeriodeChange(`Semester Ganjil ${newRoom.id}`);
    }
    setShowAddRoomModal(false);
  };

  // Primary View Mode: Rak Lemari (Shelf), Ruang Arsip Room Ini, OR Inspeksi Berkas Super Admin
  const [mainViewMode, setMainViewMode] = useState<'rak_lemari' | 'ruang_arsip' | 'inspeksi_berkas'>('rak_lemari');

  // Filters for Ruang Arsip (Room Upload History)
  const [roomUnitFilter, setRoomUnitFilter] = useState<string>('all');
  const [roomStatusFilter, setRoomStatusFilter] = useState<string>('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>('all');
  const [roomSearchQuery, setRoomSearchQuery] = useState<string>('');

  // Filters for Rak Lemari View
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterView, setFilterView] = useState<'all' | 'my_cabinet' | 'pending_verification' | 'needs_revision'>('all');

  // Filters for Inspeksi Berkas View (Super Admin)
  const [inspectUnitFilter, setInspectUnitFilter] = useState<string>('all');
  const [inspectStatusFilter, setInspectStatusFilter] = useState<string>('all');
  const [inspectTypeFilter, setInspectTypeFilter] = useState<string>('all');
  const [inspectSearch, setInspectSearch] = useState<string>('');

  // Selected Lemari & Laci for Modal / Drawer View
  const [activeLemariId, setActiveLemariId] = useState<string | null>(null);
  const activeLemari = lemariList.find((l) => l.id === activeLemariId) || null;
  const setActiveLemari = (lemari: LemariUnit | null) => setActiveLemariId(lemari ? lemari.id : null);
  const [activeLaci, setActiveLaci] = useState<LaciUnit | null>(null);

  // Privacy Alert Modal State
  const [lockedTargetUnit, setLockedTargetUnit] = useState<LemariUnit | null>(null);

  // Upload Form State
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'link'>('file');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileSize, setUploadFileSize] = useState('2.4 MB');
  const [uploadFileType, setUploadFileType] = useState<'pdf' | 'excel' | 'word' | 'image' | 'link'>('pdf');
  const [uploadExternalLink, setUploadExternalLink] = useState('');
  const [uploadNotes, setUploadNotes] = useState('');

  // Super Admin Verification State
  const [adminNotes, setAdminNotes] = useState('');
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [verifyAction, setVerifyAction] = useState<'disetujui' | 'revisi'>('disetujui');

  // New Drawer Modal (Super Admin feature)
  const [showAddDrawerModal, setShowAddDrawerModal] = useState(false);
  const [newDrawerCode, setNewDrawerCode] = useState('LACI-E');
  const [newDrawerName, setNewDrawerName] = useState('');
  const [newDrawerTask, setNewDrawerTask] = useState('');
  const [newDrawerCategory, setNewDrawerCategory] = useState('Pelaksanaan');

  // Edit Unit Modal State (Super Admin feature)
  const [showEditUnitModal, setShowEditUnitModal] = useState(false);
  const [unitToEdit, setUnitToEdit] = useState<LemariUnit | null>(null);
  const [editUnitName, setEditUnitName] = useState('');
  const [editUnitCode, setEditUnitCode] = useState('');
  const [editUnitCategory, setEditUnitCategory] = useState<'Manajemen' | 'Kejuruan' | 'Layanan' | 'Pengawasan'>('Manajemen');
  const [editUnitPic, setEditUnitPic] = useState('');
  const [editUnitDeskripsi, setEditUnitDeskripsi] = useState('');

  const handleOpenEditUnitModal = (lemari: LemariUnit) => {
    setUnitToEdit(lemari);
    setEditUnitName(lemari.unitName);
    setEditUnitCode(lemari.unitCode);
    setEditUnitCategory((lemari.unitCategory as 'Manajemen' | 'Kejuruan' | 'Layanan' | 'Pengawasan') || 'Manajemen');
    setEditUnitPic(lemari.pic);
    setEditUnitDeskripsi(lemari.deskripsiJob || '');
    setShowEditUnitModal(true);
  };

  const handleSaveEditUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitToEdit || !onUpdateUnit) return;
    if (!editUnitName.trim()) return;

    onUpdateUnit(unitToEdit.unitId, {
      name: editUnitName.trim(),
      code: editUnitCode.trim() || unitToEdit.unitCode,
      pic: editUnitPic.trim() || unitToEdit.pic,
      category: editUnitCategory,
      deskripsiJob: editUnitDeskripsi.trim() || unitToEdit.deskripsiJob
    });

    setShowEditUnitModal(false);
    setUnitToEdit(null);
  };

  // Edit Laci Modal State (Super Admin)
  const [showEditLaciModal, setShowEditLaciModal] = useState(false);
  const [laciToEdit, setLaciToEdit] = useState<LaciUnit | null>(null);
  const [editLaciNama, setEditLaciNama] = useState('');
  const [editLaciKode, setEditLaciKode] = useState('');
  const [editLaciDeskripsi, setEditLaciDeskripsi] = useState('');
  const [editLaciKategori, setEditLaciKategori] = useState('Pelaksanaan');
  const [editLaciDeadline, setEditLaciDeadline] = useState('');
  const [editLaciMandatory, setEditLaciMandatory] = useState(true);

  const handleOpenEditLaciModal = (laci: LaciUnit) => {
    setLaciToEdit(laci);
    setEditLaciNama(laci.namaLaci);
    setEditLaciKode(laci.kodeLaci);
    setEditLaciDeskripsi(laci.deskripsiTugas);
    setEditLaciKategori(laci.kategoriJob);
    setEditLaciDeadline(laci.deadline || '');
    setEditLaciMandatory(laci.isMandatory);
    setShowEditLaciModal(true);
  };

  const handleSaveEditLaci = (e: React.FormEvent) => {
    e.preventDefault();
    if (!laciToEdit || !onEditLaci) return;

    onEditLaci(laciToEdit.id, {
      namaLaci: editLaciNama.trim() || laciToEdit.namaLaci,
      kodeLaci: editLaciKode.trim() || laciToEdit.kodeLaci,
      deskripsiTugas: editLaciDeskripsi.trim() || laciToEdit.deskripsiTugas,
      kategoriJob: editLaciKategori,
      deadline: editLaciDeadline || undefined,
      isMandatory: editLaciMandatory
    });

    setShowEditLaciModal(false);
    setLaciToEdit(null);
  };

  // Tambah Lemari Unit Modal State (Super Admin)
  const [showAddLemariModal, setShowAddLemariModal] = useState(false);
  const [newLemariName, setNewLemariName] = useState('');
  const [newLemariCode, setNewLemariCode] = useState('');
  const [newLemariCategory, setNewLemariCategory] = useState<'Manajemen' | 'Kejuruan' | 'Layanan' | 'Pengawasan'>('Manajemen');
  const [newLemariPic, setNewLemariPic] = useState('');
  const [newLemariEmail, setNewLemariEmail] = useState('');
  const [newLemariDeskripsi, setNewLemariDeskripsi] = useState('');

  const handleSaveAddLemari = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onTambahLemariUnit || !newLemariName.trim()) return;

    onTambahLemariUnit({
      name: newLemariName.trim(),
      code: newLemariCode.trim() || `UNIT-${Date.now().toString().slice(-3)}`,
      category: newLemariCategory,
      pic: newLemariPic.trim() || 'Koordinator Unit',
      email: newLemariEmail.trim() || `${newLemariCode.toLowerCase() || 'unit'}@smk.sch.id`,
      deskripsiJob: newLemariDeskripsi.trim() || 'Tupoksi dan pelaksanaan program penjaminan mutu unit.'
    });

    setNewLemariName('');
    setNewLemariCode('');
    setNewLemariPic('');
    setNewLemariEmail('');
    setNewLemariDeskripsi('');
    setShowAddLemariModal(false);
  };

  // Check if current user has access to a given Lemari
  const checkHasAccess = (lemari: LemariUnit) => {
    if (isSuperAdmin) return true;
    if (currentUser.unitId && currentUser.unitId === lemari.unitId) return true;
    return false;
  };

  // Open Lemari Handler
  const handleOpenLemari = (lemari: LemariUnit) => {
    if (checkHasAccess(lemari)) {
      setActiveLemari(lemari);
    } else {
      setLockedTargetUnit(lemari);
    }
  };

  // Filtered Lemari list for Shelf View
  const filteredLemari = lemariList.filter((lemari) => {
    if (selectedCategory !== 'all' && lemari.unitCategory !== selectedCategory) return false;

    if (filterView === 'my_cabinet') {
      if (!currentUser.unitId || lemari.unitId !== currentUser.unitId) return false;
    } else if (filterView === 'pending_verification') {
      const pendingLaci = laciList.some(
        (l) => l.lemariId === lemari.id && l.status === 'menunggu_verifikasi'
      );
      if (!pendingLaci) return false;
    } else if (filterView === 'needs_revision') {
      const revisionLaci = laciList.some(
        (l) => l.lemariId === lemari.id && l.status === 'revisi'
      );
      if (!revisionLaci) return false;
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = lemari.unitName.toLowerCase().includes(q);
      const matchCode = lemari.unitCode.toLowerCase().includes(q);
      const matchPic = lemari.pic.toLowerCase().includes(q);
      const matchJob = lemari.deskripsiJob.toLowerCase().includes(q);
      return matchName || matchCode || matchPic || matchJob;
    }

    return true;
  });

  // Aggregated Stats
  const totalLemariCount = lemariList.length;
  const totalLaciCount = laciList.length;
  const totalLaciDisetujui = laciList.filter((l) => l.status === 'disetujui').length;
  const totalLaciMenunggu = laciList.filter((l) => l.status === 'menunggu_verifikasi').length;
  const totalLaciRevisi = laciList.filter((l) => l.status === 'revisi').length;
  const overallPercentage = totalLaciCount > 0 ? Math.round((totalLaciDisetujui / totalLaciCount) * 100) : 0;

  // Flatten all files from all drawers for Super Admin Inspection Hub & Room Archive
  const allUploadedFiles = laciList.flatMap((laci) => {
    const parentLemari = lemariList.find((lem) => lem.id === laci.lemariId);
    return laci.berkasList.map((berkas) => ({
      ...berkas,
      tahunAjaran: berkas.tahunAjaran || parentLemari?.tahunAjaran || '2025/2026',
      laciObj: laci,
      lemariObj: parentLemari
    }));
  });

  // Files in the currently active Room
  const filesInActiveRoom = allUploadedFiles.filter((item) => {
    const fileYear = item.tahunAjaran || '2025/2026';
    return fileYear === activeRoomId;
  });

  // Filtered files for Ruang Arsip / Room History View
  const filteredRoomFiles = filesInActiveRoom.filter((item) => {
    // Privacy check: Non-admin can only inspect their own unit's files
    if (!isSuperAdmin && currentUser.unitId && item.unitId !== currentUser.unitId) {
      return false;
    }

    if (roomUnitFilter !== 'all' && item.unitId !== roomUnitFilter) return false;
    if (roomStatusFilter !== 'all' && item.laciObj.status !== roomStatusFilter) return false;
    if (roomTypeFilter !== 'all') {
      if (roomTypeFilter === 'link' && item.tipeFile !== 'link') return false;
      if (roomTypeFilter === 'file' && item.tipeFile === 'link') return false;
    }
    if (roomSearchQuery.trim() !== '') {
      const q = roomSearchQuery.toLowerCase();
      const matchFile = item.namaFile.toLowerCase().includes(q);
      const matchUnit = item.laciObj.unitName.toLowerCase().includes(q);
      const matchUploader = item.uploadedBy.toLowerCase().includes(q);
      const matchLaci = item.laciObj.namaLaci.toLowerCase().includes(q);
      return matchFile || matchUnit || matchUploader || matchLaci;
    }
    return true;
  });

  // Filtered files for Super Admin Inspection Hub
  const filteredInspectionFiles = allUploadedFiles.filter((item) => {
    // If not super admin, only allow seeing own unit's files
    if (!isSuperAdmin && currentUser.unitId && item.unitId !== currentUser.unitId) {
      return false;
    }

    if (inspectUnitFilter !== 'all' && item.unitId !== inspectUnitFilter) return false;
    if (inspectStatusFilter !== 'all' && item.laciObj.status !== inspectStatusFilter) return false;
    if (inspectTypeFilter !== 'all') {
      if (inspectTypeFilter === 'link' && item.tipeFile !== 'link') return false;
      if (inspectTypeFilter === 'file' && item.tipeFile === 'link') return false;
    }
    if (inspectSearch.trim() !== '') {
      const q = inspectSearch.toLowerCase();
      const matchFile = item.namaFile.toLowerCase().includes(q);
      const matchUnit = item.laciObj.unitName.toLowerCase().includes(q);
      const matchUploader = item.uploadedBy.toLowerCase().includes(q);
      const matchLaci = item.laciObj.namaLaci.toLowerCase().includes(q);
      return matchFile || matchUnit || matchUploader || matchLaci;
    }
    return true;
  });

  // Laci for currently active Lemari
  const activeLaciList = activeLemari
    ? laciList.filter((l) => l.lemariId === activeLemari.id)
    : [];

  // Submit Upload Form
  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLaci) return;

    const fileTitle = uploadFileName.trim() || (uploadMode === 'link' ? 'Tautan Berkas Google Drive' : 'Dokumen_Bukti_Tugas.pdf');

    onUploadBerkas(activeLaci.id, {
      unitId: activeLaci.unitId,
      namaFile: fileTitle,
      linkExternal: uploadMode === 'link' ? uploadExternalLink : undefined,
      fileUrl: uploadMode === 'file' ? '#' : uploadExternalLink,
      ukuranFile: uploadMode === 'link' ? 'Cloud Link' : uploadFileSize,
      tipeFile: uploadMode === 'link' ? 'link' : uploadFileType,
      versi: `v${(activeLaci.berkasList.length + 1).toFixed(1)}`,
      uploadedBy: currentUser.name,
      uploadedByUserId: currentUser.id,
      catatanPengirim: uploadNotes.trim() || undefined,
      tahunAjaran: activeRoomId
    });

    setUploadFileName('');
    setUploadExternalLink('');
    setUploadNotes('');
    setShowUploadModal(false);
  };

  // Submit Verification Form (Super Admin)
  const handleSubmitVerification = () => {
    if (!activeLaci) return;
    onVerifikasiLaci(activeLaci.id, verifyAction, adminNotes.trim());
    setAdminNotes('');
    setShowVerifyModal(false);
  };

  // Submit Add Drawer
  const handleSubmitAddDrawer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLemari || !onTambahLaci) return;

    onTambahLaci(activeLemari.id, {
      kodeLaci: newDrawerCode,
      namaLaci: newDrawerName,
      deskripsiTugas: newDrawerTask,
      kategoriJob: newDrawerCategory,
      unitId: activeLemari.unitId,
      unitName: activeLemari.unitName,
      formatWajib: ['pdf', 'link'],
      isMandatory: true,
      status: 'kosong',
      berkasList: []
    });

    setNewDrawerName('');
    setNewDrawerTask('');
    setShowAddDrawerModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Access & Navigation Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1.5">
                <Archive className="w-3.5 h-3.5" />
                Filing Cabinet Digital 18 Unit
              </span>

              {isSuperAdmin ? (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                  <Unlock className="w-3.5 h-3.5 text-rose-600" />
                  Super Admin Master Key (Inspeksi Seluruh Unit)
                </span>
              ) : (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  Isolasi Privasi Aktif (Anti-Nyontek)
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Sistem Lemari & Laci Digital Sekolah
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Sistem penyimpanan terisolasi 1 lemari per unit. 
              {isSuperAdmin ? (
                <span> Anda masuk sebagai <strong>Super Admin</strong>. Anda dapat menginspeksi seluruh berkas yang diunggah oleh 18 unit kerja, memberikan pengesahan (Acc), atau mengirim arahan revisi.</span>
              ) : (
                <span> Anda dapat mengunggah berkas ke lemari unit Anda sendiri, sedangkan lemari unit lain <strong>terkunci anti-nyontek</strong>.</span>
              )}
            </p>
          </div>

          {/* Mode Switcher: Rak Lemari vs Ruang Arsip Room vs Inspeksi Berkas */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start lg:self-center shrink-0 border border-slate-200/80 flex-wrap">
            <button
              onClick={() => setMainViewMode('rak_lemari')}
              className={`text-xs px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mainViewMode === 'rak_lemari'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Rak 18 Lemari
            </button>

            <button
              onClick={() => setMainViewMode('ruang_arsip')}
              className={`text-xs px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mainViewMode === 'ruang_arsip'
                  ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-indigo-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5 text-indigo-600" />
              <span>Room Upload {activeRoom.shortLabel}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                mainViewMode === 'ruang_arsip' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {filesInActiveRoom.length}
              </span>
            </button>

            <button
              onClick={() => setMainViewMode('inspeksi_berkas')}
              className={`text-xs px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mainViewMode === 'inspeksi_berkas'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />
              <span>Inspeksi Berkas</span>
              {totalLaciMenunggu > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-extrabold bg-amber-500 text-white">
                  {totalLaciMenunggu}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 block">Total Lemari Unit</span>
            <span className="text-xl font-bold text-slate-900 mt-0.5 block">{totalLemariCount} Lemari</span>
            <span className="text-[10px] text-slate-500">100% Terdaftar</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 block">Total Berkas Diunggah</span>
            <span className="text-xl font-bold text-slate-900 mt-0.5 block">{allUploadedFiles.length} Berkas</span>
            <span className="text-[10px] text-blue-600 font-semibold">{totalLaciCount} Laci Tersedia</span>
          </div>

          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/70">
            <span className="text-[11px] font-semibold text-emerald-700 block flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Disetujui (Acc)
            </span>
            <span className="text-xl font-bold text-emerald-800 mt-0.5 block">{totalLaciDisetujui} Laci</span>
            <span className="text-[10px] text-emerald-600 font-medium">Valid & Terverifikasi</span>
          </div>

          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/70">
            <span className="text-[11px] font-semibold text-amber-700 block flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600" /> Menunggu Review
            </span>
            <span className="text-xl font-bold text-amber-800 mt-0.5 block">{totalLaciMenunggu} Laci</span>
            <span className="text-[10px] text-amber-600 font-medium">Perlu Cek Super Admin</span>
          </div>

          <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200/70">
            <span className="text-[11px] font-semibold text-rose-700 block flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-600" /> Perlu Revisi
            </span>
            <span className="text-xl font-bold text-rose-800 mt-0.5 block">{totalLaciRevisi} Laci</span>
            <span className="text-[10px] text-rose-600 font-medium">Catatan Perbaikan</span>
          </div>

          <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200/70">
            <span className="text-[11px] font-semibold text-blue-700 block">Progres Sekolah</span>
            <span className="text-xl font-bold text-blue-800 mt-0.5 block">{overallPercentage}%</span>
            <div className="w-full bg-blue-200/60 rounded-full h-1.5 mt-1">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Super Admin Omnipotent Control Center (God Mode Toolbar) */}
        {isSuperAdmin && (
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-purple-50/80 via-indigo-50/50 to-blue-50/70 p-3.5 rounded-2xl border border-purple-200/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-purple-950 uppercase tracking-wide">
                    Pusat Kendali Penuh Super Admin (God Mode)
                  </span>
                  <span className="text-[10px] bg-purple-200 text-purple-900 font-extrabold px-2 py-0.2 rounded-full">
                    Akses Tanpa Batas
                  </span>
                </div>
                <p className="text-[11px] text-purple-700/80">
                  Otoritas tertinggi: Setujui massal, hapus berkas, kelola & hapus laci, buat unit/lemari baru, dan impersonasi unit.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {totalLaciMenunggu > 0 && onBulkApproveAll && (
                <button
                  type="button"
                  onClick={onBulkApproveAll}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Acc Semua Menunggu ({totalLaciMenunggu})</span>
                </button>
              )}

              {onTambahLemariUnit && (
                <button
                  type="button"
                  onClick={() => setShowAddLemariModal(true)}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Unit & Lemari Baru</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. Room Periode / Tahun Ajaran Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Ruang Periode Arsip (Room Tahun Ajaran)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                Multi-Room Arsip
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Pilih Room Tahun Ajaran untuk memeriksa riwayat berkas yang pernah diunggah pada siklus tersebut.
            </p>
          </div>
        </div>

        {/* Room Pills & Quick Add */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 max-w-full">
          {roomList.map((room) => {
            const isActive = activeRoomId === room.id;
            let dotColor = 'bg-slate-400';
            let badgeStyle = 'bg-slate-100 text-slate-700';
            let badgeText = 'Arsip';
            if (room.status === 'Aktif') {
              dotColor = 'bg-emerald-500';
              badgeStyle = isActive ? 'bg-indigo-700 text-white' : 'bg-emerald-100 text-emerald-800';
              badgeText = 'Aktif';
            } else if (room.status === 'Mendatang') {
              dotColor = 'bg-blue-500';
              badgeStyle = isActive ? 'bg-indigo-700 text-white' : 'bg-blue-100 text-blue-800';
              badgeText = 'Mendatang';
            }

            return (
              <button
                key={room.id}
                type="button"
                onClick={() => handleSelectRoom(room.id)}
                className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 ring-2 ring-indigo-600/30'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : dotColor}`} />
                <span>Room {room.shortLabel}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${badgeStyle}`}>
                  {badgeText}
                </span>
              </button>
            );
          })}

          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => setShowAddRoomModal(true)}
              className="text-xs px-3 py-2 rounded-xl font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap shrink-0"
              title="Buka Ruang Tahun Ajaran Baru (Super Admin)"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buka Room Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: RAK 18 LEMARI UNIT (Shelf / Filing Cabinet Grid) */}
      {/* ======================================================== */}
      {mainViewMode === 'rak_lemari' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Filter Bar with Beautiful Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {[
                { id: 'all', label: 'Semua Bidang (18)' },
                { id: 'Manajemen', label: 'WKS Manajemen (4)' },
                { id: 'Kejuruan', label: 'Prodi & TeFa (7)' },
                { id: 'Layanan', label: 'Layanan & Sarana (5)' },
                { id: 'Pengawasan', label: 'Pengawasan / SPI (2)' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Quick Perspective Filter & Search */}
            <div className="flex items-center gap-2">
              {currentUser.unitId && (
                <button
                  onClick={() => setFilterView(filterView === 'my_cabinet' ? 'all' : 'my_cabinet')}
                  className={`text-xs px-3 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    filterView === 'my_cabinet'
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Lemari Saya
                </button>
              )}

              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari unit atau tupoksi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* The 18 Filing Cabinets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLemari.map((lemari) => {
              const hasAccess = checkHasAccess(lemari);
              const isMyUnit = currentUser.unitId === lemari.unitId;

              const drawers = laciList.filter((l) => l.lemariId === lemari.id);
              const approvedCount = drawers.filter((l) => l.status === 'disetujui').length;
              const pendingCount = drawers.filter((l) => l.status === 'menunggu_verifikasi').length;
              const revisionCount = drawers.filter((l) => l.status === 'revisi').length;
              const emptyCount = drawers.filter((l) => l.status === 'kosong').length;
              const completionPct = drawers.length > 0 ? Math.round((approvedCount / drawers.length) * 100) : 0;

              return (
                <div
                  key={lemari.id}
                  onClick={() => handleOpenLemari(lemari)}
                  className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md cursor-pointer flex flex-col ${
                    isMyUnit
                      ? 'border-emerald-300 ring-2 ring-emerald-500/20'
                      : hasAccess
                      ? 'border-slate-200/90 hover:border-blue-400'
                      : 'border-slate-200/80 bg-slate-50/40 hover:border-slate-300'
                  }`}
                >
                  {/* Cabinet Top Header Bar */}
                  <div
                    className={`p-4 border-b flex items-start justify-between gap-2 ${
                      isMyUnit
                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50/40 border-emerald-100'
                        : hasAccess
                        ? 'bg-slate-50/80 border-slate-100'
                        : 'bg-slate-100/70 border-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                          isMyUnit
                            ? 'bg-emerald-600 text-white'
                            : hasAccess
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-400 text-white'
                        }`}
                      >
                        <Archive className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                            {lemari.unitCode}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-200/70 text-slate-700">
                            {lemari.unitCategory}
                          </span>
                          {isMyUnit && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Unit Anda
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {lemari.unitName}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isSuperAdmin && (
                        <>
                          {onImpersonateUnit && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onImpersonateUnit(lemari.unitId);
                              }}
                              title="Masuk & Nyamar sebagai Unit Ini (God Mode)"
                              className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors cursor-pointer shadow-2xs flex items-center gap-1 text-[11px] font-bold"
                            >
                              <UserCheck className="w-3 h-3 text-amber-600" />
                              <span className="hidden xl:inline text-[10px]">Nyamar</span>
                            </button>
                          )}

                          {onUpdateUnit && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditUnitModal(lemari);
                              }}
                              title="Ubah Nama & Pengaturan Unit (Super Admin)"
                              className="px-2 py-1 rounded-lg bg-white/90 hover:bg-purple-100 text-purple-700 border border-slate-200 hover:border-purple-300 transition-colors cursor-pointer shadow-2xs flex items-center gap-1 text-[11px] font-bold"
                            >
                              <Pencil className="w-3 h-3 text-purple-600" />
                              <span className="hidden sm:inline text-[10px]">Ubah</span>
                            </button>
                          )}

                          {onDeleteLemariUnit && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Hapus lemari unit "${lemari.unitName}" beserta seluruh laci tugas dan berkasnya?`)) {
                                  onDeleteLemariUnit(lemari.unitId);
                                }
                              }}
                              title="Hapus Lemari Unit Ini (God Mode)"
                              className="p-1 rounded-lg bg-white hover:bg-rose-50 text-rose-500 hover:text-rose-700 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer shadow-2xs"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </>
                      )}

                      {hasAccess ? (
                        <span
                          title={isSuperAdmin ? 'Master Key Super Admin Aktif' : 'Akses Terbuka untuk Unit Sendiri'}
                          className="p-1.5 rounded-lg bg-emerald-100/80 text-emerald-700 inline-flex items-center text-[10px] font-bold"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span
                          title="Terkunci Anti-Nyontek"
                          className="p-1.5 rounded-lg bg-slate-200/80 text-slate-600 inline-flex items-center text-[10px] font-bold"
                        >
                          <Lock className="w-3.5 h-3.5 text-slate-700" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cabinet Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[11px] text-slate-500 flex items-center justify-between mb-1">
                        <span>Penanggung Jawab:</span>
                        <strong className="text-slate-700 font-semibold">{lemari.pic.split(',')[0]}</strong>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {lemari.deskripsiJob}
                      </p>
                    </div>

                    {/* Drawers Preview Strip */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                        <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-slate-500">
                          <Layers className="w-3 h-3 text-slate-400" />
                          Susunan Laci ({drawers.length})
                        </span>
                        <span className="text-[11px] font-bold text-blue-600">{completionPct}% Selesai</span>
                      </div>

                      <div className="space-y-1">
                        {drawers.map((drawer) => {
                          let statusBg = 'bg-slate-100 border-slate-200 text-slate-600';
                          let statusText = 'Kosong';

                          if (drawer.status === 'disetujui') {
                            statusBg = 'bg-emerald-50 border-emerald-200 text-emerald-700';
                            statusText = 'Disetujui';
                          } else if (drawer.status === 'menunggu_verifikasi') {
                            statusBg = 'bg-amber-50 border-amber-200 text-amber-700';
                            statusText = 'Menunggu Review';
                          } else if (drawer.status === 'revisi') {
                            statusBg = 'bg-rose-50 border-rose-200 text-rose-700';
                            statusText = 'Perlu Revisi';
                          }

                          return (
                            <div
                              key={drawer.id}
                              className={`px-2.5 py-1.5 rounded-lg border text-[11px] flex items-center justify-between gap-2 font-medium transition-colors ${statusBg}`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="font-bold shrink-0">{drawer.kodeLaci}:</span>
                                <span className="truncate">{drawer.namaLaci}</span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {hasAccess ? (
                                  <span className="text-[10px] font-semibold">{statusText}</span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                    <Lock className="w-2.5 h-2.5" /> Privat
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Progress Bar & Status Pill */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        {pendingCount > 0 && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                            {pendingCount} Verifikasi
                          </span>
                        )}
                        {revisionCount > 0 && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800">
                            {revisionCount} Revisi
                          </span>
                        )}
                        {pendingCount === 0 && revisionCount === 0 && emptyCount === 0 && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Lengkap 100%
                          </span>
                        )}
                      </div>

                      <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 text-xs">
                        {hasAccess ? 'Buka Lemari' : 'Lihat Info'}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: PUSAT INSPEKSI BERKAS MASUK (Super Admin Feed)  */}
      {/* ======================================================== */}
      {mainViewMode === 'inspeksi_berkas' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Filter Bar with Beautiful Styled Dropdowns */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Filter Audit Berkas yang Diunggah Tiap Unit
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Menampilkan <strong>{filteredInspectionFiles.length}</strong> dari {allUploadedFiles.length} berkas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* Dropdown 1: Unit Kerja Filter */}
              <div className="relative">
                <select
                  value={inspectUnitFilter}
                  onChange={(e) => setInspectUnitFilter(e.target.value)}
                  className="w-full appearance-none text-xs bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 rounded-xl pl-3 pr-8 py-2.5 text-slate-800 font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none cursor-pointer shadow-2xs transition-all"
                >
                  <option value="all">Semua 18 Unit Kerja</option>
                  {lemariList.map((lem) => (
                    <option key={lem.unitId} value={lem.unitId}>
                      {lem.unitCode} - {lem.unitName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Dropdown 2: Status Verifikasi Filter */}
              <div className="relative">
                <select
                  value={inspectStatusFilter}
                  onChange={(e) => setInspectStatusFilter(e.target.value)}
                  className="w-full appearance-none text-xs bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 rounded-xl pl-3 pr-8 py-2.5 text-slate-800 font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none cursor-pointer shadow-2xs transition-all"
                >
                  <option value="all">Semua Status Verifikasi</option>
                  <option value="menunggu_verifikasi">Menunggu Verifikasi Super Admin</option>
                  <option value="disetujui">Disetujui (Acc)</option>
                  <option value="revisi">Perlu Revisi</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Dropdown 3: Tipe Berkas Filter */}
              <div className="relative">
                <select
                  value={inspectTypeFilter}
                  onChange={(e) => setInspectTypeFilter(e.target.value)}
                  className="w-full appearance-none text-xs bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 rounded-xl pl-3 pr-8 py-2.5 text-slate-800 font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none cursor-pointer shadow-2xs transition-all"
                >
                  <option value="all">Semua Tipe Berkas</option>
                  <option value="file">Dokumen Fisik (PDF / Office / Gambar)</option>
                  <option value="link">Tautan Google Drive / Cloud</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari file, unit, pengunggah..."
                  value={inspectSearch}
                  onChange={(e) => setInspectSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Inspection Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Unit Kerja & PIC</th>
                    <th className="py-3 px-4">Laci Tugas</th>
                    <th className="py-3 px-4">Nama Dokumen & Format</th>
                    <th className="py-3 px-4">Waktu & Pengunggah</th>
                    <th className="py-3 px-4">Status & Review</th>
                    <th className="py-3 px-4 text-right">Tindakan Super Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInspectionFiles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Tidak ada berkas yang cocok dengan filter yang dipilih.
                      </td>
                    </tr>
                  ) : (
                    filteredInspectionFiles.map((file) => {
                      const laci = file.laciObj;
                      let FileIcon = FileText;
                      if (file.tipeFile === 'excel') FileIcon = FileSpreadsheet;
                      if (file.tipeFile === 'image') FileIcon = ImageIcon;
                      if (file.tipeFile === 'link') FileIcon = LinkIcon;

                      let statusBadge = 'bg-slate-100 text-slate-700 border-slate-200';
                      let statusText = 'Belum Diisi';
                      if (laci.status === 'disetujui') {
                        statusBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                        statusText = 'Disetujui (Acc)';
                      } else if (laci.status === 'menunggu_verifikasi') {
                        statusBadge = 'bg-amber-100 text-amber-800 border-amber-200';
                        statusText = 'Menunggu Review';
                      } else if (laci.status === 'revisi') {
                        statusBadge = 'bg-rose-100 text-rose-800 border-rose-200';
                        statusText = 'Perlu Revisi';
                      }

                      return (
                        <tr key={file.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Unit info */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{laci.unitName}</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] px-1.5 rounded bg-slate-100 font-semibold text-slate-600">
                                  {file.lemariObj?.unitCode || 'UNIT'}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  PIC: {file.lemariObj?.pic.split(',')[0]}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Laci info */}
                          <td className="py-3.5 px-4 max-w-[200px]">
                            <span className="font-bold text-slate-800 block truncate">
                              {laci.kodeLaci}: {laci.namaLaci}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {laci.kategoriJob}
                            </span>
                          </td>

                          {/* File info */}
                          <td className="py-3.5 px-4 max-w-[240px]">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <FileIcon className="w-3.5 h-3.5" />
                              </div>
                              <div className="truncate">
                                <span className="font-bold text-slate-900 block truncate" title={file.namaFile}>
                                  {file.namaFile}
                                </span>
                                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                  <span>{file.versi}</span>
                                  <span>•</span>
                                  <span>{file.ukuranFile}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Uploader info */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-semibold text-slate-700 block">
                              {file.uploadedBy}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {file.uploadedAt}
                            </span>
                          </td>

                          {/* Status & Review */}
                          <td className="py-3.5 px-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block ${statusBadge}`}>
                              {statusText}
                            </span>
                            {laci.catatanSuperAdmin && (
                              <p className="text-[10px] text-slate-500 mt-1 line-clamp-1 max-w-[180px]" title={laci.catatanSuperAdmin}>
                                Catatan: {laci.catatanSuperAdmin}
                              </p>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {file.linkExternal ? (
                                <a
                                  href={file.linkExternal}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 inline-flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Link Drive
                                </a>
                              ) : (
                                <button
                                  onClick={() => alert(`Simulasi: Membuka berkas ${file.namaFile}`)}
                                  className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" />
                                  Lihat
                                </button>
                              )}

                              {isSuperAdmin && (
                                <>
                                  <button
                                    onClick={() => {
                                      setActiveLaci(laci);
                                      setVerifyAction('revisi');
                                      setAdminNotes(laci.catatanSuperAdmin || '');
                                      setShowVerifyModal(true);
                                    }}
                                    title="Minta Revisi Dokumen"
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      setActiveLaci(laci);
                                      setVerifyAction('disetujui');
                                      setAdminNotes('Dokumen telah diperiksa dan disetujui sesuai standar penjaminan mutu.');
                                      setShowVerifyModal(true);
                                    }}
                                    title="Setujui Dokumen (Acc)"
                                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>

                                  {onDeleteBerkas && (
                                    <button
                                      onClick={() => {
                                        if (window.confirm(`Hapus berkas "${file.namaFile}" dari laci ${laci.namaLaci}?`)) {
                                          onDeleteBerkas(laci.id, file.id);
                                        }
                                      }}
                                      title="Hapus Berkas Ini (Super Admin)"
                                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 cursor-pointer transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 3: RUANG ARSIP & RIWAYAT UNGGAHAN (Room Tahun Ajaran) */}
      {/* ======================================================== */}
      {mainViewMode === 'ruang_arsip' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Room Banner & Overview */}
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-5 sm:p-6 rounded-2xl border border-indigo-700/40 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 bg-indigo-800/80 px-3 py-1 rounded-full border border-indigo-600/50 flex items-center gap-1.5">
                    <FolderArchive className="w-3.5 h-3.5 text-indigo-300" />
                    Ruang Arsip Siklus: {activeRoom.label}
                  </span>
                  {activeRoom.status === 'Aktif' ? (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Tahun Ajaran Berjalan (Aktif)
                    </span>
                  ) : activeRoom.status === 'Mendatang' ? (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      Tahun Ajaran Mendatang (2026/2027)
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/40 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      Arsip Digital Terkunci (Lampau)
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Riwayat Dokumen yang Pernah Diunggah — {activeRoom.shortLabel}
                </h2>
                <p className="text-xs sm:text-sm text-indigo-200/90 max-w-3xl leading-relaxed">
                  {activeRoom.description || `Seluruh rekam jejak berkas dan bukti fisik yang pernah diunggah oleh 18 unit kerja pada siklus tahun ajaran ${activeRoom.id}.`}
                </p>
              </div>

              {/* Quick Info Box */}
              <div className="bg-indigo-950/70 border border-indigo-700/60 p-3.5 rounded-xl shrink-0 self-start lg:self-center">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isSuperAdmin ? 'Akses Super Admin (Semua 18 Unit)' : 'Privasi Unit Anda Terjaga (Anti-Nyontek)'}</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  {isSuperAdmin
                    ? 'Anda dapat mengunduh, mengaudit, dan memvalidasi riwayat seluruh unit.'
                    : `Hanya menampilkan rekam jejak ${currentUser.unitName || 'Unit Anda'}. Berkas unit lain disembunyikan.`}
                </p>
              </div>
            </div>

            {/* Room Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-indigo-800/60">
              <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-700/30">
                <span className="text-[11px] text-indigo-300 block">Total Berkas Diunggah</span>
                <span className="text-xl font-bold text-white mt-0.5 block">{filesInActiveRoom.length} Berkas</span>
                <span className="text-[10px] text-indigo-400">Tahun {activeRoom.shortLabel}</span>
              </div>
              <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-700/30">
                <span className="text-[11px] text-emerald-300 block">Berkas Disetujui (Acc)</span>
                <span className="text-xl font-bold text-emerald-400 mt-0.5 block">
                  {filesInActiveRoom.filter((f) => f.laciObj.status === 'disetujui').length} Berkas
                </span>
                <span className="text-[10px] text-emerald-400/80">Sesuai Standar Mutu</span>
              </div>
              <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-700/30">
                <span className="text-[11px] text-amber-300 block">Menunggu Verifikasi</span>
                <span className="text-xl font-bold text-amber-400 mt-0.5 block">
                  {filesInActiveRoom.filter((f) => f.laciObj.status === 'menunggu_verifikasi').length} Berkas
                </span>
                <span className="text-[10px] text-amber-400/80">Butuh Review Admin</span>
              </div>
              <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-700/30">
                <span className="text-[11px] text-rose-300 block">Perlu Perbaikan (Revisi)</span>
                <span className="text-xl font-bold text-rose-400 mt-0.5 block">
                  {filesInActiveRoom.filter((f) => f.laciObj.status === 'revisi').length} Berkas
                </span>
                <span className="text-[10px] text-rose-400/80">Catatan Revisi Terlampir</span>
              </div>
            </div>
          </div>

          {/* Unit Quick Filter Badges for Active Room (Who uploaded in this year) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                Rekap Pengunggahan Tiap Unit di Room {activeRoom.shortLabel}:
              </span>
              <button
                type="button"
                onClick={() => setRoomUnitFilter('all')}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-lg cursor-pointer transition ${
                  roomUnitFilter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                Lihat Semua ({filesInActiveRoom.length})
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {lemariList.map((lem) => {
                const countForUnit = filesInActiveRoom.filter((f) => f.unitId === lem.unitId).length;
                const isSelected = roomUnitFilter === lem.unitId;
                const isMyUnit = currentUser.unitId === lem.unitId;

                return (
                  <button
                    key={lem.unitId}
                    type="button"
                    onClick={() => setRoomUnitFilter(isSelected ? 'all' : lem.unitId)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-500/30'
                        : isMyUnit
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{lem.unitCode}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        isSelected
                          ? 'bg-indigo-700 text-white'
                          : countForUnit > 0
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {countForUnit}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Bar with Beautiful Styled Dropdowns */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Filter Berkas Room {activeRoom.shortLabel}
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Menampilkan <strong>{filteredRoomFiles.length}</strong> dari {filesInActiveRoom.length} berkas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* Dropdown 1: Unit Kerja Filter */}
              <div className="relative">
                <select
                  value={roomUnitFilter}
                  onChange={(e) => setRoomUnitFilter(e.target.value)}
                  disabled={!isSuperAdmin && !!currentUser.unitId}
                  className="w-full appearance-none text-xs bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 rounded-xl pl-3 pr-8 py-2.5 text-slate-800 font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none cursor-pointer shadow-2xs transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="all">Semua Unit ({filesInActiveRoom.length} berkas)</option>
                  {lemariList.map((lem) => (
                    <option key={lem.unitId} value={lem.unitId}>
                      {lem.unitCode} - {lem.unitName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Dropdown 2: Status Verifikasi Filter */}
              <div className="relative">
                <select
                  value={roomStatusFilter}
                  onChange={(e) => setRoomStatusFilter(e.target.value)}
                  className="w-full appearance-none text-xs bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 rounded-xl pl-3 pr-8 py-2.5 text-slate-800 font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none cursor-pointer shadow-2xs transition-all"
                >
                  <option value="all">Semua Status Verifikasi</option>
                  <option value="disetujui">Disetujui (Acc)</option>
                  <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
                  <option value="revisi">Perlu Revisi</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Dropdown 3: Tipe Berkas Filter */}
              <div className="relative">
                <select
                  value={roomTypeFilter}
                  onChange={(e) => setRoomTypeFilter(e.target.value)}
                  className="w-full appearance-none text-xs bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 rounded-xl pl-3 pr-8 py-2.5 text-slate-800 font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none cursor-pointer shadow-2xs transition-all"
                >
                  <option value="all">Semua Format Unggahan</option>
                  <option value="file">Dokumen PDF / File Fisik</option>
                  <option value="link">Tautan Cloud / Google Drive</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Search Box */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari nama berkas, uploader, laci..."
                  value={roomSearchQuery}
                  onChange={(e) => setRoomSearchQuery(e.target.value)}
                  className="w-full text-xs bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Berkas List / Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Nama Dokumen / Berkas</th>
                    <th className="py-3 px-4">Unit Kerja & PIC</th>
                    <th className="py-3 px-4">Laci Penugasan</th>
                    <th className="py-3 px-4">Waktu & Pengunggah</th>
                    <th className="py-3 px-4 text-center">Status Verifikasi</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredRoomFiles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        <div className="max-w-sm mx-auto flex flex-col items-center">
                          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 shadow-inner">
                            <FolderArchive className="w-7 h-7" />
                          </div>
                          <p className="font-bold text-slate-800 text-sm">
                            Belum Ada Berkas di Room {activeRoom.shortLabel}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {roomSearchQuery || roomUnitFilter !== 'all' || roomStatusFilter !== 'all'
                              ? 'Tidak ada berkas yang sesuai dengan kriteria filter yang Anda pilih.'
                              : `Belum ada unit yang mengunggah dokumen pada periode ${activeRoom.id}. Silakan buka lemari unit untuk mulai mengunggah.`}
                          </p>

                          <button
                            type="button"
                            onClick={() => {
                              setMainViewMode('rak_lemari');
                              if (currentUser.unitId) {
                                const myLem = lemariList.find((l) => l.unitId === currentUser.unitId);
                                if (myLem) setActiveLemari(myLem);
                              }
                            }}
                            className="mt-4 text-xs font-bold px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Buka Lemari & Unggah Berkas Baru</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRoomFiles.map((file) => {
                      const laci = file.laciObj;
                      const lemari = file.lemariObj;

                      return (
                        <tr key={file.id} className="hover:bg-indigo-50/20 transition-colors">
                          {/* Nama File */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100">
                                {file.tipeFile === 'link' ? (
                                  <LinkIcon className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <FileText className="w-4 h-4 text-rose-600" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                                    {file.namaFile}
                                  </span>
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                    {file.versi}
                                  </span>
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 font-semibold">
                                    {file.tahunAjaran}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                                  <span>{file.ukuranFile}</span>
                                  {file.catatanPengirim && (
                                    <span className="italic text-slate-400 truncate max-w-xs">
                                      — &quot;{file.catatanPengirim}&quot;
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Unit Kerja & PIC */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">
                              {laci.unitName}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <UserCheck className="w-3 h-3 text-slate-400" />
                              <span>{lemari?.pic || 'PIC Unit'}</span>
                            </div>
                          </td>

                          {/* Laci Penugasan */}
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-800 block">
                              {laci.kodeLaci}: {laci.namaLaci}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Kategori: {laci.kategoriJob}
                            </span>
                          </td>

                          {/* Waktu & Pengunggah */}
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-900">
                              {file.uploadedBy}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{file.uploadedAt}</span>
                            </div>
                          </td>

                          {/* Status Verifikasi */}
                          <td className="py-3.5 px-4 text-center">
                            {laci.status === 'disetujui' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Disetujui (Acc)
                              </span>
                            ) : laci.status === 'revisi' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                <AlertTriangle className="w-3 h-3 text-rose-600" /> Perlu Revisi
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                <Clock className="w-3 h-3 text-amber-600" /> Menunggu Review
                              </span>
                            )}
                          </td>

                          {/* Aksi */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {file.linkExternal ? (
                                <a
                                  href={file.linkExternal}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 cursor-pointer transition-colors"
                                  title="Buka Tautan Google Drive"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              ) : (
                                <a
                                  href={file.fileUrl || '#'}
                                  download={file.namaFile}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
                                  title="Unduh Berkas"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </a>
                              )}

                              {/* Super Admin Actions */}
                              {isSuperAdmin && (
                                <>
                                  <button
                                    onClick={() => {
                                      setActiveLaci(laci);
                                      setVerifyAction('disetujui');
                                      setAdminNotes('Dokumen telah diperiksa dan disetujui sesuai standar penjaminan mutu.');
                                      setShowVerifyModal(true);
                                    }}
                                    title="Setujui Dokumen (Acc)"
                                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>

                                  {onDeleteBerkas && (
                                    <button
                                      onClick={() => {
                                        if (window.confirm(`Hapus berkas "${file.namaFile}" dari laci ${laci.namaLaci}?`)) {
                                          onDeleteBerkas(laci.id, file.id);
                                        }
                                      }}
                                      title="Hapus Berkas Ini (Super Admin)"
                                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 cursor-pointer transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MODAL DRAWER VIEW (Isi Lemari & Laci Unit yang Terbuka) */}
      {/* ======================================================== */}
      {activeLemari && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/60 rounded-t-2xl">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                  <Archive className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {activeLemari.unitCode}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      Tahun Ajaran {activeLemari.tahunAjaran}
                    </span>
                    {isSuperAdmin && (
                      <span className="text-[11px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-600" /> Mode Super Admin
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">
                      {activeLemari.unitName}
                    </h2>
                    {isSuperAdmin && onUpdateUnit && (
                      <button
                        onClick={() => handleOpenEditUnitModal(activeLemari)}
                        className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
                        title="Ubah Nama & Informasi Unit Ini (Super Admin)"
                      >
                        <Pencil className="w-3.5 h-3.5 text-purple-600" />
                        <span>Ubah Nama Unit</span>
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
                    <strong>Tupoksi:</strong> {activeLemari.deskripsiJob}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveLemari(null);
                  setActiveLaci(null);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Daftar Laci */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Daftar Laci Tugas Unit ({activeLaciList.length} Laci)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Pilih salah satu laci untuk melihat berkas bukti fisik atau mengunggah laporan tugas.
                  </p>
                </div>

                {isSuperAdmin && onTambahLaci && (
                  <button
                    onClick={() => setShowAddDrawerModal(true)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah Laci Tugas Baru
                  </button>
                )}
              </div>

              {/* Laci Cards Stack */}
              <div className="space-y-3">
                {activeLaciList.map((laci) => {
                  const isSelected = activeLaci?.id === laci.id;

                  let badgeColor = 'bg-slate-100 text-slate-600 border-slate-200';
                  let statusLabel = 'Belum Diisi';
                  if (laci.status === 'disetujui') {
                    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                    statusLabel = 'Disetujui (Acc)';
                  } else if (laci.status === 'menunggu_verifikasi') {
                    badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
                    statusLabel = 'Menunggu Verifikasi Admin';
                  } else if (laci.status === 'revisi') {
                    badgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
                    statusLabel = 'Perlu Revisi';
                  }

                  return (
                    <div
                      key={laci.id}
                      className={`rounded-2xl border transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {/* Laci Summary Header */}
                      <div
                        onClick={() => setActiveLaci(isSelected ? null : laci)}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                              laci.status === 'disetujui'
                                ? 'bg-emerald-600 text-white'
                                : laci.status === 'menunggu_verifikasi'
                                ? 'bg-amber-500 text-white'
                                : laci.status === 'revisi'
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {laci.kodeLaci.replace('LACI-', '')}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-slate-900">
                                {laci.kodeLaci}: {laci.namaLaci}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.2 rounded-md border ${badgeColor}`}>
                                {statusLabel}
                              </span>
                              {laci.isMandatory && (
                                <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                                  Wajib
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {laci.deskripsiTugas}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          {isSuperAdmin && onOverrideStatusLaci && (
                            <div onClick={(e) => e.stopPropagation()} className="relative">
                              <select
                                value={laci.status}
                                onChange={(e) => onOverrideStatusLaci(laci.id, e.target.value)}
                                className="text-[10px] font-bold py-1 pl-2 pr-6 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer appearance-none shadow-2xs"
                                title="Ubah Status Seketika (God Mode)"
                              >
                                <option value="kosong">Status: Kosong</option>
                                <option value="menunggu_verifikasi">Status: Menunggu</option>
                                <option value="disetujui">Status: Disetujui (Acc)</option>
                                <option value="revisi">Status: Perlu Revisi</option>
                              </select>
                              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          )}

                          {isSuperAdmin && onEditLaci && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditLaciModal(laci);
                              }}
                              title="Edit Pengaturan Laci (Super Admin)"
                              className="p-1 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 border border-transparent hover:border-purple-200 transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {isSuperAdmin && onDeleteLaci && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Hapus laci "${laci.namaLaci}" beserta seluruh berkas di dalamnya?`)) {
                                  onDeleteLaci(laci.id);
                                }
                              }}
                              title="Hapus Laci Tugas (Super Admin)"
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {laci.berkasList.length > 0 && (
                            <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2 py-1 rounded-md">
                              {laci.berkasList.length} Berkas
                            </span>
                          )}
                          <ChevronRight
                            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                              isSelected ? 'rotate-90 text-blue-600' : ''
                            }`}
                          />
                        </div>
                      </div>

                      {/* Laci Detail Accordion Content */}
                      {isSelected && (
                        <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl space-y-4">
                          {/* Super Admin Feedback Banner */}
                          {laci.catatanSuperAdmin && (
                            <div
                              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                                laci.status === 'revisi'
                                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              }`}
                            >
                              {laci.status === 'revisi' ? (
                                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              )}
                              <div className="text-xs">
                                <div className="font-bold flex items-center gap-1.5">
                                  <span>Catatan Reviewer Super Admin ({laci.verifiedBy || 'Tim TPMPS'}):</span>
                                  {laci.verifiedAt && <span className="text-[10px] text-slate-500">[{laci.verifiedAt}]</span>}
                                </div>
                                <p className="mt-0.5 leading-relaxed">{laci.catatanSuperAdmin}</p>
                              </div>
                            </div>
                          )}

                          {/* Info Format & Deadline */}
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200/70">
                            <div className="flex items-center gap-2">
                              <span>Format yang diterima:</span>
                              <div className="flex gap-1">
                                {laci.formatWajib.map((fmt) => (
                                  <span key={fmt} className="uppercase bg-slate-100 px-1.5 py-0.2 rounded font-bold text-[10px] text-slate-700">
                                    {fmt}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {laci.deadline && (
                              <div className="flex items-center gap-1 text-slate-600">
                                <Clock className="w-3.5 h-3.5 text-amber-500" />
                                <span>Batas Waktu: <strong>{laci.deadline}</strong></span>
                              </div>
                            )}
                          </div>

                          {/* List of Files in this Drawer */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-700">
                                Berkas Bukti di Laci Ini:
                              </span>

                              <button
                                onClick={() => {
                                  setActiveLaci(laci);
                                  setShowUploadModal(true);
                                }}
                                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                {laci.berkasList.length === 0 ? 'Isi Laci Ini (Unggah Berkas)' : 'Unggah Versi Baru'}
                              </button>
                            </div>

                            {laci.berkasList.length === 0 ? (
                              <div className="p-6 bg-white rounded-xl border border-dashed border-slate-300 text-center">
                                <Archive className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs text-slate-500 font-medium">
                                  Laci ini masih kosong. Silakan unggah dokumen bukti atau lampirkan link Google Drive.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {laci.berkasList.map((berkas) => {
                                  let FileIcon = FileText;
                                  if (berkas.tipeFile === 'excel') FileIcon = FileSpreadsheet;
                                  if (berkas.tipeFile === 'image') FileIcon = ImageIcon;
                                  if (berkas.tipeFile === 'link') FileIcon = LinkIcon;

                                  return (
                                    <div
                                      key={berkas.id}
                                      className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3"
                                    >
                                      <div className="flex items-center gap-2.5 truncate">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                                          <FileIcon className="w-4 h-4" />
                                        </div>
                                        <div className="truncate">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-bold text-slate-900 truncate">
                                              {berkas.namaFile}
                                            </span>
                                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 rounded">
                                              {berkas.versi}
                                            </span>
                                            <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-1.5 rounded border border-indigo-200">
                                              {berkas.tahunAjaran || activeLemari.tahunAjaran || '2025/2026'}
                                            </span>
                                          </div>
                                          <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                            <span>{berkas.ukuranFile}</span>
                                            <span>•</span>
                                            <span>Diunggah oleh: {berkas.uploadedBy}</span>
                                            <span>•</span>
                                            <span>{berkas.uploadedAt}</span>
                                          </div>
                                          {berkas.catatanPengirim && (
                                            <p className="text-[11px] text-slate-600 mt-1 italic">
                                              &quot;{berkas.catatanPengirim}&quot;
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                       <div className="flex items-center gap-1.5 shrink-0">
                                        {berkas.linkExternal ? (
                                          <a
                                            href={berkas.linkExternal}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-colors"
                                          >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            Buka Link
                                          </a>
                                        ) : (
                                          <button
                                            onClick={() => alert(`Simulasi: Mengunduh berkas ${berkas.namaFile}`)}
                                            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                                          >
                                            <Eye className="w-3.5 h-3.5" />
                                            Lihat Dokumen
                                          </button>
                                        )}

                                        {isSuperAdmin && onDeleteBerkas && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (window.confirm(`Hapus berkas "${berkas.namaFile}" dari laci ini?`)) {
                                                onDeleteBerkas(laci.id, berkas.id);
                                              }
                                            }}
                                            title="Hapus Berkas Ini (Super Admin)"
                                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer shadow-2xs"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Super Admin Inspection Toolbar */}
                          {isSuperAdmin && laci.berkasList.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50/60 p-3.5 rounded-xl border border-purple-100">
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-purple-600" />
                                <span className="text-xs font-bold text-purple-950">
                                  Tindakan Inspeksi Super Admin:
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setActiveLaci(laci);
                                    setVerifyAction('revisi');
                                    setAdminNotes(laci.catatanSuperAdmin || '');
                                    setShowVerifyModal(true);
                                  }}
                                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  Minta Revisi
                                </button>

                                <button
                                  onClick={() => {
                                    setActiveLaci(laci);
                                    setVerifyAction('disetujui');
                                    setAdminNotes(laci.catatanSuperAdmin || 'Dokumen telah diperiksa dan disetujui sesuai standar penjaminan mutu.');
                                    setShowVerifyModal(true);
                                  }}
                                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Setujui Dokumen (Acc)
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-2xl">
              <div className="text-xs text-slate-500">
                Unit Kerja: <strong>{activeLemari.unitName}</strong> • PIC: <strong>{activeLemari.pic}</strong>
              </div>
              <button
                onClick={() => {
                  setActiveLemari(null);
                  setActiveLaci(null);
                }}
                className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
              >
                Tutup Lemari
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. PRIVACY SHIELD MODAL (Peringatan Lemari Terkunci Anti-Nyontek) */}
      {/* ======================================================== */}
      {lockedTargetUnit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <FolderLock className="w-7 h-7 text-amber-600" />
            </div>

            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                Akses Terkunci • Anti-Nyontek
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">
                Lemari {lockedTargetUnit.unitName} Bersifat Privat
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Untuk menjaga <strong>orisinalitas berkas mutu</strong> dan mencegah peniruan/penyalinan (anti-contek) antar unit, berkas dan isi laci unit ini hanya dapat dibuka oleh:
              </p>

              <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-700 text-left space-y-1 border border-slate-200/80">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Staf & PIC Resmi Unit: <strong>{lockedTargetUnit.pic}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Super Admin (Kepala Sekolah, Ketua TPMPS, Auditor)</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 mt-3 italic">
                Anda saat ini login sebagai: <strong>{currentUser.name}</strong> ({currentUser.unitName || currentUser.role})
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <button
                onClick={() => setLockedTargetUnit(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Mengerti & Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. UPLOAD / ATTACH LINK MODAL (Form Pengisian Laci) */}
      {/* ======================================================== */}
      {showUploadModal && activeLaci && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3 border-b pb-3 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {activeLaci.kodeLaci}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Unggah Berkas ke {activeLaci.namaLaci}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Unit: <strong>{activeLaci.unitName}</strong>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Room {activeRoom.shortLabel}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  uploadMode === 'file'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Unggah File Dokumen
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('link')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  uploadMode === 'link'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tautan Google Drive
              </button>
            </div>

            <form onSubmit={handleSubmitUpload} className="space-y-4">
              {uploadMode === 'file' ? (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Judul / Nama File
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dokumen_KOSP_Tahun_2025_Final.pdf"
                      value={uploadFileName}
                      onChange={(e) => setUploadFileName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Tipe Dokumen
                      </label>
                      <div className="relative">
                        <select
                          value={uploadFileType}
                          onChange={(e) => setUploadFileType(e.target.value as 'pdf' | 'excel' | 'word' | 'image' | 'link')}
                          className="w-full appearance-none px-3 pr-8 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                        >
                          <option value="pdf">PDF Document (.pdf)</option>
                          <option value="word">Microsoft Word (.docx)</option>
                          <option value="excel">Microsoft Excel (.xlsx)</option>
                          <option value="image">Gambar / Foto Fisik (.jpg/.png)</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Estimasi Ukuran
                      </label>
                      <input
                        type="text"
                        value={uploadFileSize}
                        onChange={(e) => setUploadFileSize(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Judul Dokumen Link
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Folder Arsip Portofolio Siswa (Google Drive)"
                      value={uploadFileName}
                      onChange={(e) => setUploadFileName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      URL / Tautan Link Google Drive / Cloud
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/drive/folders/..."
                      value={uploadExternalLink}
                      onChange={(e) => setUploadExternalLink(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Pastikan hak akses tautan diset &quot;Anyone with the link can view&quot; agar Super Admin dapat memeriksa.
                    </span>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Catatan untuk Super Admin / Auditor (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan tambahan mengenai kelengkapan dokumen..."
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors cursor-pointer"
                >
                  Serahkan Berkas ke Laci
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. SUPER ADMIN VERIFY / REVISE MODAL */}
      {/* ======================================================== */}
      {showVerifyModal && activeLaci && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0 ${
                  verifyAction === 'disetujui' ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              >
                {verifyAction === 'disetujui' ? <Check className="w-5 h-5" /> : <RotateCcw className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {verifyAction === 'disetujui' ? 'Persetujuan Dokumen (Acc)' : 'Permintaan Revisi Dokumen'}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeLaci.kodeLaci}: {activeLaci.namaLaci}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Catatan Evaluasi Super Admin / TPMPS
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={
                    verifyAction === 'disetujui'
                      ? 'Berikan catatan pengesahan dokumen...'
                      : 'Jelaskan kekurangan berkas dan bagian mana yang perlu diperbaiki oleh unit...'
                  }
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                <span>Verifikator: <strong>{currentUser.name}</strong> ({currentUser.role})</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowVerifyModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmitVerification}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-colors cursor-pointer ${
                  verifyAction === 'disetujui'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                }`}
              >
                {verifyAction === 'disetujui' ? 'Sahkan & Setujui Dokumen' : 'Kirim Arahan Revisi ke Unit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. SUPER ADMIN TAMBAH LACI BARU MODAL */}
      {/* ======================================================== */}
      {showAddDrawerModal && activeLemari && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3 border-b pb-3 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {activeLemari.unitCode}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Tambah Laci Tugas Baru
                </h3>
              </div>
              <button
                onClick={() => setShowAddDrawerModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAddDrawer} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Kode Laci
                  </label>
                  <input
                    type="text"
                    required
                    value={newDrawerCode}
                    onChange={(e) => setNewDrawerCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Kategori Tugas
                  </label>
                  <div className="relative">
                    <select
                      value={newDrawerCategory}
                      onChange={(e) => setNewDrawerCategory(e.target.value)}
                      className="w-full appearance-none px-3 pr-8 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Perencanaan">Perencanaan</option>
                      <option value="Pelaksanaan">Pelaksanaan</option>
                      <option value="Evaluasi">Evaluasi</option>
                      <option value="Pelaporan">Pelaporan</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Laci Tugas
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laporan Hasil ANBK Sekolah"
                  value={newDrawerName}
                  onChange={(e) => setNewDrawerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Instruksi & Deskripsi Tugas
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan berkas apa yang wajib diunggah oleh unit terkait..."
                  value={newDrawerTask}
                  onChange={(e) => setNewDrawerTask(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 resize-none"
                />
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDrawerModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer"
                >
                  Pasang Laci Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. MODAL UBAH NAMA & INFORMASI UNIT KERJA (Super Admin)  */}
      {/* ======================================================== */}
      {showEditUnitModal && unitToEdit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Ubah Nama & Pengaturan Lemari Unit
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mode Super Admin • Perubahan nama berlaku langsung ke seluruh sistem
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowEditUnitModal(false);
                  setUnitToEdit(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUnit} className="mt-4 space-y-3.5">
              {/* Nama Unit Kerja */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Unit Kerja <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editUnitName}
                  onChange={(e) => setEditUnitName(e.target.value)}
                  placeholder="Misal: Tata Usaha, WKS 1 Kurikulum, dll."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white shadow-2xs"
                />
                
                {/* Saran Nama Cepat */}
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  <span className="text-[10px] text-slate-400 font-medium">Contoh cepat:</span>
                  {[
                    'Tata Usaha (TU)',
                    'WKS 1 Bidang Kurikulum',
                    'WKS 2 Bidang Kesiswaan',
                    'Unit Produksi (TeFa)'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setEditUnitName(preset)}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-800 transition cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Kode Unit */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kode Singkat Unit
                  </label>
                  <input
                    type="text"
                    value={editUnitCode}
                    onChange={(e) => setEditUnitCode(e.target.value)}
                    placeholder="e.g. TU, WKS-1, DKV"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  />
                </div>

                {/* Kategori Unit */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Unit
                  </label>
                  <div className="relative">
                    <select
                      value={editUnitCategory}
                      onChange={(e) => setEditUnitCategory(e.target.value as 'Manajemen' | 'Kejuruan' | 'Layanan' | 'Pengawasan')}
                      className="w-full appearance-none px-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white cursor-pointer"
                    >
                      <option value="Manajemen">Manajemen</option>
                      <option value="Kejuruan">Kejuruan</option>
                      <option value="Layanan">Layanan</option>
                      <option value="Pengawasan">Pengawasan</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Nama PIC */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Penanggung Jawab (PIC / Pejabat)
                </label>
                <input
                  type="text"
                  value={editUnitPic}
                  onChange={(e) => setEditUnitPic(e.target.value)}
                  placeholder="Nama Pejabat Unit"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                />
              </div>

              {/* Deskripsi Job / Tupoksi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi Tugas / Tupoksi Lemari
                </label>
                <textarea
                  rows={2}
                  value={editUnitDeskripsi}
                  onChange={(e) => setEditUnitDeskripsi(e.target.value)}
                  placeholder="Ringkasan tugas pokok dan fungsi unit kerja..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditUnitModal(false);
                    setUnitToEdit(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Simpan Perubahan Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. MODAL EDIT PENGATURAN LACI TUGAS (Super Admin)         */}
      {/* ======================================================== */}
      {showEditLaciModal && laciToEdit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shadow-xs">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Edit Pengaturan Laci Tugas
                  </h3>
                  <p className="text-xs text-slate-500">
                    {laciToEdit.kodeLaci} • Unit: {laciToEdit.unitName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowEditLaciModal(false);
                  setLaciToEdit(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditLaci} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Laci Tugas <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editLaciNama}
                  onChange={(e) => setEditLaciNama(e.target.value)}
                  placeholder="Misal: Modul Ajar dan RPP Merdeka"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kode Laci
                  </label>
                  <input
                    type="text"
                    value={editLaciKode}
                    onChange={(e) => setEditLaciKode(e.target.value)}
                    placeholder="e.g. LACI-A"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Tugas
                  </label>
                  <div className="relative">
                    <select
                      value={editLaciKategori}
                      onChange={(e) => setEditLaciKategori(e.target.value)}
                      className="w-full appearance-none px-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
                    >
                      <option value="Perencanaan">Perencanaan</option>
                      <option value="Pelaksanaan">Pelaksanaan</option>
                      <option value="Evaluasi">Evaluasi</option>
                      <option value="Pelaporan">Pelaporan</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Batas Waktu (Deadline)
                  </label>
                  <input
                    type="date"
                    value={editLaciDeadline}
                    onChange={(e) => setEditLaciDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editLaciMandatory}
                      onChange={(e) => setEditLaciMandatory(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-700">Tugas Wajib</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instruksi Kerja / Deskripsi Tugas
                </label>
                <textarea
                  rows={2}
                  value={editLaciDeskripsi}
                  onChange={(e) => setEditLaciDeskripsi(e.target.value)}
                  placeholder="Jelaskan spesifikasi berkas atau panduan untuk unit pengunggah..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditLaciModal(false);
                    setLaciToEdit(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Simpan Perubahan Laci
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. MODAL TAMBAH LEMARI & UNIT KERJA BARU (Super Admin)    */}
      {/* ======================================================== */}
      {showAddLemariModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shadow-xs">
                  <Archive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Tambah Unit Kerja & Lemari Baru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Daftarkan unit baru ke dalam rak sekolah beserta lemari & laci tugasnya
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddLemariModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddLemari} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Unit Kerja Baru <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Bursa Kerja Khusus (BKK), Hubin, TeFa..."
                  value={newLemariName}
                  onChange={(e) => setNewLemariName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kode Singkat Unit <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BKK, HUBIN, LSP"
                    value={newLemariCode}
                    onChange={(e) => setNewLemariCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Unit
                  </label>
                  <div className="relative">
                    <select
                      value={newLemariCategory}
                      onChange={(e) => setNewLemariCategory(e.target.value as 'Manajemen' | 'Kejuruan' | 'Layanan' | 'Pengawasan')}
                      className="w-full appearance-none px-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white cursor-pointer"
                    >
                      <option value="Manajemen">Manajemen</option>
                      <option value="Kejuruan">Kejuruan</option>
                      <option value="Layanan">Layanan</option>
                      <option value="Pengawasan">Pengawasan</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Penanggung Jawab (PIC)
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Koordinator / Pejabat"
                    value={newLemariPic}
                    onChange={(e) => setNewLemariPic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Resmi
                  </label>
                  <input
                    type="email"
                    placeholder="unit@smk.sch.id"
                    value={newLemariEmail}
                    onChange={(e) => setNewLemariEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi Tupoksi & Lingkup Kerja Lemari
                </label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan tugas pokok dan dokumen mutu yang dikelola unit ini..."
                  value={newLemariDeskripsi}
                  onChange={(e) => setNewLemariDeskripsi(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white resize-none"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-[11px] text-purple-800">
                ⚡ <strong>Otomatis:</strong> Sistem akan langsung membuat lemari baru dengan 2 laci awal (<em>Laci A: Perencanaan</em> dan <em>Laci B: Pelaksanaan</em>).
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddLemariModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Daftarkan Unit & Lemari Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 9. MODAL BUKA ROOM BARU (Super Admin)                    */}
      {/* ======================================================== */}
      {showAddRoomModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Buka Room Tahun Ajaran Baru
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Tambahkan ruang arsip untuk siklus tahun ajaran mendatang atau lampau
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddRoomModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewRoom} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Format Tahun Ajaran (Contoh: 2027/2028)
                </label>
                <input
                  type="text"
                  placeholder="2027/2028"
                  value={newRoomYear}
                  onChange={(e) => {
                    setNewRoomYear(e.target.value);
                    setNewRoomLabel(`Tahun Ajaran ${e.target.value}`);
                  }}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Label Lengkap Room
                </label>
                <input
                  type="text"
                  placeholder="Tahun Ajaran 2027/2028"
                  value={newRoomLabel}
                  onChange={(e) => setNewRoomLabel(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Status Room Periode
                </label>
                <div className="relative">
                  <select
                    value={newRoomStatus}
                    onChange={(e) => setNewRoomStatus(e.target.value as 'Mendatang' | 'Aktif' | 'Arsip')}
                    className="w-full appearance-none px-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    <option value="Mendatang">Mendatang (Periode Persiapan)</option>
                    <option value="Aktif">Aktif (Tahun Berjalan)</option>
                    <option value="Arsip">Arsip (Tahun Lampau)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keterangan Singkat
                </label>
                <textarea
                  rows={2}
                  placeholder="Deskripsi ruang arsip dan dokumen siklus penjaminan mutu..."
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Buka Room Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
