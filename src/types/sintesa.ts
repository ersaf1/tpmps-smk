export type UserRole = 'admin' | 'kepala_sekolah' | 'tpmps' | 'guru';

export interface RoleInfo {
  code: UserRole;
  name: string;
  badge: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  description: string;
  permissions: string[];
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleInfo> = {
  admin: {
    code: 'admin',
    name: 'Administrator Sistem',
    badge: 'Super Admin',
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/30',
    badgeText: 'text-rose-600',
    description: 'Manajemen pengguna, audit trail forensik, integritas basis data, dan konfigurasi sistem.',
    permissions: ['Kelola Semua Akun', 'Konfigurasi Sistem', 'Akses Penuh 18 Unit', 'Hapus & Restore Data']
  },
  kepala_sekolah: {
    code: 'kepala_sekolah',
    name: 'Kepala Sekolah',
    badge: 'Executive Lead',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-700',
    description: 'Pemantauan read-only seluruh 18 unit kerja, hak eksklusif membuat & menetapkan Periode Mutu SPMI, dan pengesahan laporan akhir.',
    permissions: ['Read-Only Cek 18 Unit', 'Hak Eksklusif Buat Periode Mutu', 'Dashboard Mutu Agregat', 'Approval Laporan Akhir']
  },
  tpmps: {
    code: 'tpmps',
    name: 'Tim Penjamin Mutu (TPMPS)',
    badge: 'Ketua TPMPS / QA',
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/30',
    badgeText: 'text-[#0077B6]',
    description: 'Pengelola Dokumen MM (Manual Mutu) & PM (Prosedur Mutu), verifikasi dokumen mutu, validasi nilai evaluasi, dan pemantauan RTL.',
    permissions: ['Kelola Dokumen MM & PM', 'Verifikasi Dokumen PK, CM (F), Rekap', 'Validasi Evaluasi Mutu 18 Unit', 'Penyusunan Rapor Mutu']
  },
  guru: {
    code: 'guru',
    name: 'Unit Kerja / Kejuruan',
    badge: 'Unit Kerja',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/30',
    badgeText: 'text-emerald-700',
    description: 'Unit kerja pelaksana: mengelola dokumen PK (Petunjuk Kerja), CM / F (Catatan Mutu / Bukti), dan Rekapitulasi Unit.',
    permissions: ['Kelola PK (Petunjuk Kerja)', 'Upload CM / F (Catatan Mutu)', 'Unggah Rekapitulasi Unit', 'Input Evaluasi Mandiri']
  }
};

// ==========================================
// 4 LEVEL DOKUMEN MUTU INTERNAL (MANUAL MUTU 2024)
// MM -> PM -> PK -> F / CM (Catatan Mutu) + Rekapitulasi
// ==========================================
export type KategoriDokumenMutu = 'MM' | 'PM' | 'PK' | 'CM' | 'REKAP';

export interface KategoriDokumenInfo {
  code: KategoriDokumenMutu;
  name: string;
  level: string;
  alias: string;
  owner: 'TPMPS' | 'UNIT';
  ownerLabel: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const KATEGORI_DOKUMEN_MUTU: Record<KategoriDokumenMutu, KategoriDokumenInfo> = {
  MM: {
    code: 'MM',
    name: 'Manual Mutu',
    level: 'Level 1',
    alias: 'MM',
    owner: 'TPMPS',
    ownerLabel: 'Ketua TPMPS',
    description: 'Dokumen utama yang menjelaskan sistem dan kebijakan manajemen mutu sekolah secara menyeluruh.',
    badgeBg: 'bg-indigo-50',
    badgeBorder: 'border-indigo-200',
    badgeText: 'text-indigo-700'
  },
  PM: {
    code: 'PM',
    name: 'Prosedur Mutu',
    level: 'Level 2',
    alias: 'PM',
    owner: 'TPMPS',
    ownerLabel: 'Ketua TPMPS',
    description: 'Prosedur operasional yang mengatur bagaimana suatu proses penjaminan mutu dilaksanakan.',
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    badgeText: 'text-[#0077B6]'
  },
  PK: {
    code: 'PK',
    name: 'Petunjuk Kerja',
    level: 'Level 3',
    alias: 'PK',
    owner: 'UNIT',
    ownerLabel: 'Unit Biasa / Kerja',
    description: 'Petunjuk dan langkah kerja teknis operasional untuk menjalankan suatu kegiatan di unit kerja.',
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeText: 'text-emerald-700'
  },
  CM: {
    code: 'CM',
    name: 'Catatan Mutu (F)',
    level: 'Level 4',
    alias: 'CM / Formulir (F)',
    owner: 'UNIT',
    ownerLabel: 'Unit Biasa / Kerja',
    description: 'Catatan mutu / formulir bertanda (F) yang berfungsi sebagai bukti rekaman bahwa kegiatan mutu telah dilaksanakan.',
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200',
    badgeText: 'text-amber-700'
  },
  REKAP: {
    code: 'REKAP',
    name: 'Rekapitulasi Unit',
    level: 'Rekap',
    alias: 'Rekapitulasi Unit',
    owner: 'UNIT',
    ownerLabel: 'Unit Biasa / Kerja',
    description: 'Rekapitulasi capaian, laporan progres, dan ringkasan data evaluasi yang disusun oleh unit kerja.',
    badgeBg: 'bg-purple-50',
    badgeBorder: 'border-purple-200',
    badgeText: 'text-purple-700'
  }
};

// ==========================================
// PERIODE PENJAMINAN MUTU (SPMI)
// HANYA BISA DIBUAT OLEH KEPALA SEKOLAH
// ==========================================
export interface PeriodeMutu {
  id: string;
  code: string;
  name: string;
  tahunAjaran: string;
  semester: 'Ganjil' | 'Genap';
  startDate: string;
  endDate: string;
  isActive: boolean;
  status: 'Aktif' | 'Arsip' | 'Direncanakan';
  targetScore: number;
  createdBy: string;
  createdRole: string;
  createdAt: string;
  description?: string;
}

export interface UserProfile {
  id: string;
  nip: string;
  fullName: string;
  email: string;
  role: UserRole;
  unitId?: string;
  unitName?: string;
  avatarUrl?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface UnitKerja {
  id: string;
  code: string;
  name: string;
  category: 'Pimpinan' | 'Manajemen' | 'Kejuruan' | 'Layanan' | 'Pengawasan' | 'Perencanaan' | 'Kesiswaan';
  picName: string;
  email: string;
  phone?: string;
  score: number;
  totalIndicators?: number;
  completedIndicators?: number;
}

export interface StandardSNP {
  id: number;
  code: string;
  name: string;
  description: string;
  weight: number;
  targetScore: number;
  currentScore: number;
  icon: string;
}

export type StatusEvaluasi = 'Draft' | 'Diajukan' | 'Direview' | 'Disetujui' | 'Perlu Revisi';

export interface EvaluasiMutu {
  id: string;
  code: string;
  standardId: number;
  standardName: string;
  unitId: string;
  unitName: string;
  periode: string;
  indikatorCode: string;
  indikatorName: string;
  nilaiMandiri: number;
  nilaiVerifikasi?: number;
  status: StatusEvaluasi;
  catatanUnit?: string;
  catatanReviewer?: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewedAt?: string;
  documentIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export type StatusDokumen = 'Menunggu Review' | 'Terverifikasi' | 'Perlu Revisi' | 'Ditolak';

export interface BuktiDokumen {
  id: string;
  code: string;
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  fileType: 'pdf' | 'excel' | 'word' | 'image';
  kategoriDokumen?: KategoriDokumenMutu;
  standardId: number;
  standardName?: string;
  unitId: string;
  unitName: string;
  version: string;
  status: StatusDokumen;
  notes?: string;
  uploadedBy: string;
  uploadedByName?: string;
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  folder?: string;
  isStarred?: boolean;
}

export type StatusRTL = 'Direncanakan' | 'Sedang Berjalan' | 'Selesai' | 'Dievaluasi' | 'Tertunda';
export type PrioritasRTL = 'Tinggi' | 'Sedang' | 'Rendah';

export interface ProgramMutuRTL {
  id: string;
  code: string;
  standardId: number;
  standardName: string;
  unitId: string;
  unitName: string;
  evaluationId?: string;
  programName: string;
  latarBelakang: string;
  targetKinerja: string;
  anggaran: number;
  deadline: string;
  progress: number;
  priority: PrioritasRTL;
  status: StatusRTL;
  pjUserId?: string;
  pjUserName?: string;
  evaluasiAkhir?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLogItem {
  id: string;
  userId: string;
  userName: string;
  roleName: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}
