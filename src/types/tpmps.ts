export type UserRole =
  | 'kepala_sekolah'
  | 'ketua_tpmps'
  | 'anggota_tpmps'
  | 'unit_kerja'
  | 'guru'
  | 'admin';

export interface UserProfile {
  id: string; // Primary Key
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  unitId?: string; // Foreign Key -> UnitKerja.id
  unitName?: string;
  avatar?: string;
  nip?: string;
  phone?: string;
}

export interface UnitKerja {
  id: string; // Primary Key
  code: string;
  name: string;
  category: 'Manajemen' | 'Kejuruan' | 'Layanan' | 'Pengawasan';
  picUserId: string; // Foreign Key -> UserProfile.id
  pic: string;
  email: string;
  score: number;
  totalIndicators: number;
  completedIndicators: number;
  status: 'Unggul' | 'Baik' | 'Cukup' | 'Perlu Perhatian';
}

export interface StandardSNP {
  id: number; // Primary Key (1 - 8)
  code: string;
  name: string;
  description: string;
  weight: number; // percentage
  targetScore: number;
  currentScore: number;
  iconName: string;
}

export interface IndikatorMutu {
  id: string; // Primary Key
  code: string;
  standardId: number; // Foreign Key -> StandardSNP.id
  standardName: string;
  name: string;
  description: string;
  unitResponsible: string[]; // Foreign Keys -> UnitKerja.id[]
  bobot: number;
  target: number;
  skala: string;
  evidenceRequired: string[];
}

export type StatusEvaluasi = 'Draft' | 'Diajukan' | 'Direview' | 'Disetujui' | 'Perlu Revisi';

export interface EvaluasiMutu {
  id: string; // Primary Key
  indikatorId: string; // Foreign Key -> IndikatorMutu.id
  indikatorCode: string;
  indikatorName: string;
  standardId: number; // Foreign Key -> StandardSNP.id
  standardName: string;
  unitId: string; // Foreign Key -> UnitKerja.id
  unitName: string;
  periode: string;
  nilaiMandiri: number; // 0-100
  nilaiVerifikasi?: number; // 0-100
  status: StatusEvaluasi;
  dokumenCount: number;
  catatanUnit?: string;
  catatanReviewer?: string;
  reviewerId?: string; // Foreign Key -> UserProfile.id
  reviewedBy?: string;
  reviewedAt?: string;
  updatedAt: string;
  // Computed / Relational link arrays
  documentIds?: string[]; // Foreign Keys -> BuktiDokumen.id[]
  rtlProgramIds?: string[]; // Foreign Keys -> ProgramMutuRTL.id[]
}

export interface BuktiDokumen {
  id: string; // Primary Key
  title: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'excel' | 'word' | 'image';
  evaluasiId: string; // Foreign Key -> EvaluasiMutu.id (CRITICAL RELATION)
  indikatorId: string; // Foreign Key -> IndikatorMutu.id
  indikatorCode: string;
  standardId: number; // Foreign Key -> StandardSNP.id
  unitId: string; // Foreign Key -> UnitKerja.id
  unitName: string;
  version: string;
  uploadedByUserId: string; // Foreign Key -> UserProfile.id
  uploadedBy: string;
  uploadedAt: string;
  status: 'Terverifikasi' | 'Menunggu Verifikasi' | 'Ditolak';
  verifiedByUserId?: string; // Foreign Key -> UserProfile.id
  verifiedBy?: string;
  notes?: string;
}

export type StatusRTL = 'Belum Mulai' | 'Sedang Berjalan' | 'Selesai' | 'Terlambat';
export type PriorityLevel = 'Tinggi' | 'Sedang' | 'Rendah';

export interface ProgramMutuRTL {
  id: string; // Primary Key
  evaluasiId: string; // Foreign Key -> EvaluasiMutu.id (CRITICAL RELATION)
  title: string;
  temuanTerkait: string;
  standardId: number; // Foreign Key -> StandardSNP.id
  standardName: string;
  indikatorId: string; // Foreign Key -> IndikatorMutu.id
  unitId: string; // Foreign Key -> UnitKerja.id
  unitName: string;
  picUserId: string; // Foreign Key -> UserProfile.id
  pic: string;
  deadline: string;
  anggaran: number;
  progress: number; // 0 - 100
  status: StatusRTL;
  priority: PriorityLevel;
  outputDiharapkan: string;
}

export interface AuditLogItem {
  id: string; // Primary Key
  userId: string; // Foreign Key -> UserProfile.id
  userName: string;
  role: string;
  action: string;
  entity: string; // 'EvaluasiMutu' | 'BuktiDokumen' | 'ProgramMutuRTL' | 'UserProfile' | 'IndikatorMutu'
  entityId: string; // Foreign Key -> Corresponding Table Primary Key
  timestamp: string;
  ipAddress: string;
  details: string;
}

// Relational view models for UI drill-downs
export interface UnitKerjaRelational extends UnitKerja {
  users: UserProfile[];
  evaluations: EvaluasiMutu[];
  documents: BuktiDokumen[];
  programs: ProgramMutuRTL[];
}

export interface EvaluasiRelational extends EvaluasiMutu {
  indicator?: IndikatorMutu;
  standard?: StandardSNP;
  unit?: UnitKerja;
  reviewer?: UserProfile;
  documents: BuktiDokumen[];
  programs: ProgramMutuRTL[];
}

// ==========================================
// SISTEM LEMARI & LACI DIGITAL (FILING CABINET)
// ==========================================

export type StatusLaci = 'kosong' | 'menunggu_verifikasi' | 'disetujui' | 'revisi';

export interface BerkasLaci {
  id: string;
  laciId: string;
  unitId: string;
  namaFile: string;
  fileUrl?: string;
  linkExternal?: string;
  ukuranFile: string;
  tipeFile: 'pdf' | 'excel' | 'word' | 'image' | 'link';
  versi: string;
  tahunAjaran?: string; // e.g. '2026/2027', '2025/2026', '2024/2025'
  uploadedAt: string;
  uploadedBy: string;
  uploadedByUserId: string;
  catatanPengirim?: string;
}

export interface LaciUnit {
  id: string;
  lemariId: string;
  unitId: string;
  unitName: string;
  kodeLaci: string; // e.g. "LACI-A", "LACI-B", "LACI-C"
  namaLaci: string; // e.g. "Laci A: Kurikulum Operasional Satuan Pendidikan (KOSP)"
  deskripsiTugas: string;
  kategoriJob: string; // e.g. "Perencanaan", "Pelaksanaan", "Evaluasi", "Pelaporan"
  formatWajib: string[]; // e.g. ['pdf', 'docx', 'xlsx', 'link']
  deadline?: string;
  isMandatory: boolean;
  status: StatusLaci;
  tahunAjaran?: string; // e.g. '2026/2027'
  berkasList: BerkasLaci[];
  catatanSuperAdmin?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  updatedAt: string;
}

export interface LemariUnit {
  id: string;
  unitId: string;
  unitCode: string;
  unitName: string;
  unitCategory: 'Manajemen' | 'Kejuruan' | 'Layanan' | 'Pengawasan';
  pic: string;
  tahunAjaran: string; // e.g. '2026/2027', '2025/2026', '2024/2025'
  deskripsiJob: string;
  totalLaci: number;
  laciTerisi: number;
  laciDisetujui: number;
  laciRevisi: number;
  laciKosong: number;
  status: 'Aktif' | 'Arsip';
  lastUpdated: string;
}

export interface TahunAjaranRoom {
  id: string; // e.g. '2026/2027'
  label: string; // e.g. 'Tahun Ajaran 2026/2027'
  shortLabel: string; // e.g. '2026/2027'
  status: 'Aktif' | 'Arsip' | 'Mendatang';
  description: string;
}

