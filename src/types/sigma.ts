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
    badgeText: 'text-rose-400',
    description: 'Manajemen pengguna, audit trail lengkap, pengaturan hak akses, dan integritas database.',
    permissions: ['Kelola Semua Akun', 'Konfigurasi Sistem', 'Akses Penuh 18 Unit', 'Hapus & Restore Data']
  },
  kepala_sekolah: {
    code: 'kepala_sekolah',
    name: 'Kepala Sekolah',
    badge: 'Executive Lead',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-400',
    description: 'Pemantauan agregat capaian 8 SNP, persetujuan akhir laporan mutu, dan pengawasan strategi sekolah.',
    permissions: ['Dashboard Mutu Agregat', 'Approval Laporan Akhir', 'Monitoring 18 Unit', 'Review Audit Mutu']
  },
  tpmps: {
    code: 'tpmps',
    name: 'Tim Penjamin Mutu (TPMPS)',
    badge: 'Quality Assurance',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/30',
    badgeText: 'text-cyan-400',
    description: 'Siklus PPEPP, verifikasi dokumen bukti fisik, validasi nilai mandiri unit, dan monitoring RTL.',
    permissions: ['Verifikasi Berkas Dokumen', 'Validasi Evaluasi Mutu', 'Kelola Program RTL', 'Konfigurasi Bobot SNP']
  },
  guru: {
    code: 'guru',
    name: 'Pendidik & Tenaga Kependidikan',
    badge: 'Unit Kerja / Guru',
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/30',
    badgeText: 'text-blue-400',
    description: 'Penginputan penilaian mandiri instrumen unit kerja dan pengunggahan bukti fisik.',
    permissions: ['Input Evaluasi Mandiri Unit', 'Upload Berkas Bukti', 'Update Progres RTL Unit']
  }
};

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
  category: 'Manajemen' | 'Kejuruan' | 'Layanan' | 'Pengawasan';
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
