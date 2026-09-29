'use client';

import {
  UserProfile,
  UnitKerja,
  StandardSNP,
  EvaluasiMutu,
  BuktiDokumen,
  ProgramMutuRTL,
  ActivityLogItem,
  UserRole,
  PeriodeMutu,
  KategoriDokumenMutu
} from '@/types/sintesa';

// ============================================================================
// 18 UNIT KERJA RESMI SMK NEGERI 2 MAGELANG (SESUAI MANUAL MUTU 2024)
// K3 dipecah menjadi 4 Kejuruan: PPLG, MPLB, PM, AKL (Tanpa K3 Generik)
// ============================================================================
export const INITIAL_UNITS: UnitKerja[] = [
  { id: 'u-01', code: 'KASEK', name: '1. KASEK (Kepala Sekolah)', category: 'Pimpinan', picName: 'Kurniawan Basuki, S.Pd., M.T.', email: 'kurniawan.basuki@smkn2magelang.sch.id', score: 96.5, totalIndicators: 30, completedIndicators: 30 },
  { id: 'u-02', code: 'WKS-1', name: '2. UNIT KERJA WKS 1 (Kurikulum)', category: 'Manajemen', picName: 'Yuana Dwi Utami, S.Pd.', email: 'yuana.dwi.utami@smkn2magelang.sch.id', score: 89.5, totalIndicators: 24, completedIndicators: 22 },
  { id: 'u-03', code: 'WKS-2', name: '3. UNIT KERJA WKS 2 (Kesiswaan)', category: 'Manajemen', picName: 'Drs. Agus Supriyanto', email: 'agus.supriyanto@smkn2magelang.sch.id', score: 86.0, totalIndicators: 20, completedIndicators: 18 },
  { id: 'u-04', code: 'WKS-3', name: '4. UNIT KERJA WKS 3 (Sarpras)', category: 'Manajemen', picName: 'May Wilasih, S.Pd.', email: 'may.wilasih@smkn2magelang.sch.id', score: 78.4, totalIndicators: 22, completedIndicators: 16 },
  { id: 'u-05', code: 'WKS-4', name: '5. UNIT KERJA WKS 4 (Humas & Hubin)', category: 'Manajemen', picName: 'Antuk Madiyanto, S.Pd.', email: 'antuk.madiyanto@smkn2magelang.sch.id', score: 92.0, totalIndicators: 18, completedIndicators: 17 },
  { id: 'u-06', code: 'PPLG', name: '6. UNIT KEJURUAN PPLG', category: 'Kejuruan', picName: 'Arifin Andi Gunawan, S.Kom.', email: 'arifin.andi.gunawan@smkn2magelang.sch.id', score: 94.0, totalIndicators: 26, completedIndicators: 25 },
  { id: 'u-07', code: 'MPLB', name: '7. UNIT KEJURUAN MPLB', category: 'Kejuruan', picName: 'Purwaningsri, S.Pd., M.M.', email: 'purwaningsri@smkn2magelang.sch.id', score: 91.5, totalIndicators: 24, completedIndicators: 22 },
  { id: 'u-08', code: 'PM', name: '8. UNIT KEJURUAN PM', category: 'Kejuruan', picName: 'Fieka Praditaliana, S.Pd.', email: 'fieka.praditaliana@smkn2magelang.sch.id', score: 90.0, totalIndicators: 22, completedIndicators: 20 },
  { id: 'u-09', code: 'AKL', name: '9. UNIT KEJURUAN AKL', category: 'Kejuruan', picName: 'Cicilia Nugrahanti, S.Pd.', email: 'cicilia.nugrahanti@smkn2magelang.sch.id', score: 93.0, totalIndicators: 24, completedIndicators: 23 },
  { id: 'u-10', code: 'TPMPS', name: '10. UNIT KERJA TPMPS', category: 'Pengawasan', picName: 'Vickky Listyaningsih, M.Kom.', email: 'vickky.listyaningsih@smkn2magelang.sch.id', score: 97.0, totalIndicators: 32, completedIndicators: 32 },
  { id: 'u-11', code: 'RENBANG', name: '11. UNIT KERJA RENBANG', category: 'Perencanaan', picName: 'Dra. Gigih Murniati', email: 'gigih.murniati@smkn2magelang.sch.id', score: 88.5, totalIndicators: 18, completedIndicators: 16 },
  { id: 'u-12', code: 'TU', name: '12. UNIT KERJA TU', category: 'Layanan', picName: 'Murtiningsih, S.Pd., M.Pd.', email: 'murtiningsih@smkn2magelang.sch.id', score: 84.0, totalIndicators: 20, completedIndicators: 18 },
  { id: 'u-13', code: 'LAB', name: '13. UNIT KERJA LAB', category: 'Layanan', picName: 'Yunus Adi Wibowo, S.Kom.', email: 'yunus.adi.wibowo@smkn2magelang.sch.id', score: 83.0, totalIndicators: 15, completedIndicators: 12 },
  { id: 'u-14', code: 'PERPUS', name: '14. UNIT KERJA PERPUS', category: 'Layanan', picName: 'Dra. Wiwik Pristiwati', email: 'wiwik.pristiwati@smkn2magelang.sch.id', score: 90.0, totalIndicators: 14, completedIndicators: 13 },
  { id: 'u-15', code: 'UMUM', name: '15. UNIT KERJA UMUM', category: 'Layanan', picName: 'Mugi Rahayu, S.Pd., M.Pd.', email: 'mugi.rahayu@smkn2magelang.sch.id', score: 87.0, totalIndicators: 16, completedIndicators: 14 },
  { id: 'u-16', code: 'BK', name: '16. UNIT KERJA BK', category: 'Layanan', picName: 'Esti Zunastiti, S.Pd.', email: 'esti.zunastiti@smkn2magelang.sch.id', score: 89.0, totalIndicators: 16, completedIndicators: 15 },
  { id: 'u-17', code: 'BKK', name: '17. UNIT KERJA BKK', category: 'Layanan', picName: 'Anggraini Kusumawardani, S.Pd.', email: 'anggraini.kusumawardani@smkn2magelang.sch.id', score: 93.5, totalIndicators: 18, completedIndicators: 17 },
  { id: 'u-18', code: 'USMAN', name: '18. UNIT KERJA USMAN', category: 'Layanan', picName: 'Tri Djoko, S.Pd.', email: 'tri.djoko@smkn2magelang.sch.id', score: 86.8, totalIndicators: 20, completedIndicators: 17 }
];

// ============================================================================
// PERIODE PENJAMINAN MUTU (SPMI) - DIBUAT EKSKLUSIF OLEH KEPALA SEKOLAH
// ============================================================================
export const INITIAL_PERIODES: PeriodeMutu[] = [
  {
    id: 'per-01',
    code: 'PER-2025-1',
    name: 'Semester Ganjil 2025/2026',
    tahunAjaran: '2025/2026',
    semester: 'Ganjil',
    startDate: '2025-07-14',
    endDate: '2025-12-20',
    isActive: true,
    status: 'Aktif',
    targetScore: 95.0,
    createdBy: 'Drs. H. Mulyono, M.Pd. (Kepala Sekolah)',
    createdRole: 'kepala_sekolah',
    createdAt: '2025-07-01T08:00:00Z',
    description: 'Periode implementasi SPMI siklus PPEPP Semester Ganjil 2025/2026 yang ditetapkan resmi oleh Kepala Sekolah.'
  },
  {
    id: 'per-02',
    code: 'PER-2024-2',
    name: 'Semester Genap 2024/2025',
    tahunAjaran: '2024/2025',
    semester: 'Genap',
    startDate: '2025-01-06',
    endDate: '2025-06-21',
    isActive: false,
    status: 'Arsip',
    targetScore: 92.0,
    createdBy: 'Drs. H. Mulyono, M.Pd. (Kepala Sekolah)',
    createdRole: 'kepala_sekolah',
    createdAt: '2025-01-02T08:00:00Z',
    description: 'Periode evaluasi penjaminan mutu dan audit SPMI Semester Genap 2024/2025 (Telah Selesai).'
  },
  {
    id: 'per-03',
    code: 'PER-2024-1',
    name: 'Semester Ganjil 2024/2025',
    tahunAjaran: '2024/2025',
    semester: 'Ganjil',
    startDate: '2024-07-15',
    endDate: '2024-12-21',
    isActive: false,
    status: 'Arsip',
    targetScore: 90.0,
    createdBy: 'Drs. H. Mulyono, M.Pd. (Kepala Sekolah)',
    createdRole: 'kepala_sekolah',
    createdAt: '2024-07-01T08:00:00Z',
    description: 'Periode penetapan Manual Mutu 2024 dan pemetaan instrumen SNP (Arsip Resmi).'
  }
];

// 8 STANDAR NASIONAL PENDIDIKAN
export const INITIAL_STANDARDS: StandardSNP[] = [
  { id: 1, code: 'SNP-1', name: 'Standar Kompetensi Lulusan', description: 'Kualifikasi kemampuan lulusan mencakup sikap, pengetahuan kejuruan, dan sertifikasi BNSP', weight: 15.0, targetScore: 95.0, currentScore: 88.5, icon: 'GraduationCap' },
  { id: 2, code: 'SNP-2', name: 'Standar Isi', description: 'Penyelarasan kurikulum vokasi bersama IDUKA mitra industri dan struktur kurikulum merdeka', weight: 12.5, targetScore: 92.0, currentScore: 86.0, icon: 'BookOpen' },
  { id: 3, code: 'SNP-3', name: 'Standar Proses', description: 'Pelaksanaan pembelajaran berbasis proyek (PjBL), Teaching Factory, dan Praktik Kerja Lapangan', weight: 15.0, targetScore: 94.0, currentScore: 84.5, icon: 'Activity' },
  { id: 4, code: 'SNP-4', name: 'Standar Penilaian', description: 'Mekanisme asesmen sumatif, portofolio, UKK terlisensi LSP-P1, dan asesmen diagnostik berkala', weight: 12.5, targetScore: 95.0, currentScore: 89.2, icon: 'CheckSquare' },
  { id: 5, code: 'SNP-5', name: 'Standar Pendidik & Tenaga Kependidikan', description: 'Sertifikasi kompetensi guru kejuruan, magang industri guru, dan kualifikasi tendik', weight: 15.0, targetScore: 90.0, currentScore: 81.8, icon: 'Users' },
  { id: 6, code: 'SNP-6', name: 'Standar Sarana & Prasarana', description: 'Kelayakan ruang praktik siswa, rasio unit komputer, fasilitas K3, dan peralatan standar industri', weight: 10.0, targetScore: 90.0, currentScore: 78.4, icon: 'Building2' },
  { id: 7, code: 'SNP-7', name: 'Standar Pengelolaan', description: 'Tata kelola BLUD SMK, sistem penjaminan mutu SPMI, kemitraan strategis, dan transparansi', weight: 10.0, targetScore: 95.0, currentScore: 91.0, icon: 'Layers' },
  { id: 8, code: 'SNP-8', name: 'Standar Pembiayaan', description: 'Optimalisasi anggaran BOS/BOP SMK, unit produksi TEFA, dan akuntabilitas pelaporan RKAS', weight: 10.0, targetScore: 95.0, currentScore: 87.6, icon: 'BadgePercent' }
];

// INITIAL USERS
export const INITIAL_USERS: Record<UserRole, UserProfile> = {
  admin: {
    id: 'usr-admin-01',
    nip: '198204152008011005',
    fullName: 'Administrator SINTESA',
    email: 'admin@smkn2magelang.sch.id',
    role: 'admin',
    unitId: 'u-01',
    unitName: 'Administrator Pusat SINTESA',
    avatarUrl: '/avatar-admin.png',
    phone: '081234567890',
    isActive: true,
    createdAt: '2025-01-10T08:00:00Z'
  },
  kepala_sekolah: {
    id: 'usr-kepsek-01',
    nip: '196803121992031004',
    fullName: 'Kurniawan Basuki, S.Pd., M.T.',
    email: 'kurniawan.basuki@smkn2magelang.sch.id',
    role: 'kepala_sekolah',
    unitId: 'u-01',
    unitName: '1. KASEK (Kepala Sekolah)',
    avatarUrl: '/avatar-kepsek.png',
    phone: '081198765432',
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  },
  tpmps: {
    id: 'usr-tpmps-01',
    nip: '197509182002122001',
    fullName: 'Vickky Listyaningsih, M.Kom.',
    email: 'vickky.listyaningsih@smkn2magelang.sch.id',
    role: 'tpmps',
    unitId: 'u-10',
    unitName: '10. UNIT KERJA TPMPS',
    avatarUrl: '/avatar-tpmps.png',
    phone: '081328901234',
    isActive: true,
    createdAt: '2024-02-15T08:00:00Z'
  },
  guru: {
    id: 'usr-guru-01',
    nip: '198711052011011008',
    fullName: 'Arifin Andi Gunawan, S.Kom.',
    email: 'arifin.andi.gunawan@smkn2magelang.sch.id',
    role: 'guru',
    unitId: 'u-06',
    unitName: '6. UNIT KEJURUAN PPLG',
    avatarUrl: '/avatar-guru.png',
    phone: '081578904321',
    isActive: true,
    createdAt: '2024-03-01T08:00:00Z'
  }
};

// INITIAL EVALUATIONS
export const INITIAL_EVALUATIONS: EvaluasiMutu[] = [
  {
    id: 'ev-001',
    code: 'EV-2025-01',
    standardId: 1,
    standardName: 'Standar Kompetensi Lulusan',
    unitId: 'u-16',
    unitName: 'Lembaga Sertifikasi Profesi (LSP-P1)',
    periode: 'Semester Ganjil 2025/2026',
    indikatorCode: 'SKL-1.1',
    indikatorName: 'Persentase kelulusan siswa yang memiliki sertifikat kompetensi BNSP pada skema KKNI Level II',
    nilaiMandiri: 94.0,
    nilaiVerifikasi: 92.5,
    status: 'Disetujui',
    catatanUnit: 'Tercatat 92.5% siswa tingkat XII berhasil lulus uji skema LSP-P1 pada gelombang I.',
    catatanReviewer: 'Bukti sertifikat telah terarsip lengkap di bank bukti digital.',
    reviewerId: 'usr-tpmps-01',
    reviewerName: 'Dra. Hj. Siti Fatimah, M.M.',
    reviewedAt: '2025-09-10T14:30:00Z',
    documentIds: ['doc-001', 'doc-004'],
    createdAt: '2025-09-01T09:00:00Z',
    updatedAt: '2025-09-10T14:30:00Z'
  },
  {
    id: 'ev-002',
    code: 'EV-2025-02',
    standardId: 2,
    standardName: 'Standar Isi',
    unitId: 'u-01',
    unitName: 'WKS 1 (Bidang Kurikulum)',
    periode: 'Semester Ganjil 2025/2026',
    indikatorCode: 'ISI-2.1',
    indikatorName: 'Penyelarasan Kurikulum Operasional Satuan Pendidikan (KOSP) dengan minimal 5 Industri Mitra',
    nilaiMandiri: 90.0,
    nilaiVerifikasi: 88.0,
    status: 'Disetujui',
    catatanUnit: 'MoU dan Berita Acara penyelarasan kurikulum bersama PT Telkom dan PT Astra telah rampung.',
    catatanReviewer: 'Valid. Rekomendasi: libatkan juga industri lokal Magelang.',
    reviewerId: 'usr-tpmps-01',
    reviewerName: 'Dra. Hj. Siti Fatimah, M.M.',
    reviewedAt: '2025-09-12T10:15:00Z',
    documentIds: ['doc-002'],
    createdAt: '2025-09-02T10:00:00Z',
    updatedAt: '2025-09-12T10:15:00Z'
  },
  {
    id: 'ev-003',
    code: 'EV-2025-03',
    standardId: 6,
    standardName: 'Standar Sarana & Prasarana',
    unitId: 'u-03',
    unitName: 'WKS 3 (Bidang Sarana & Prasarana)',
    periode: 'Semester Ganjil 2025/2026',
    indikatorCode: 'SAR-6.2',
    indikatorName: 'Rasio ketersediaan perangkat PC workstation berstandar industri pada Laboratorium Rekayasa Perangkat Lunak',
    nilaiMandiri: 75.0,
    nilaiVerifikasi: 70.0,
    status: 'Perlu Revisi',
    catatanUnit: 'Terdapat 8 unit PC di Lab RPL 2 yang mengalami penurunan performa hardware.',
    catatanReviewer: 'Perlu pengajuan RKAS untuk peremajaan RAM dan SSD workstation.',
    reviewerId: 'usr-tpmps-01',
    reviewerName: 'Dra. Hj. Siti Fatimah, M.M.',
    reviewedAt: '2025-09-14T11:45:00Z',
    documentIds: ['doc-003'],
    createdAt: '2025-09-05T13:20:00Z',
    updatedAt: '2025-09-14T11:45:00Z'
  },
  {
    id: 'ev-004',
    code: 'EV-2025-04',
    standardId: 3,
    standardName: 'Standar Proses',
    unitId: 'u-06',
    unitName: 'Program Keahlian PPLG / RPL',
    periode: 'Semester Ganjil 2025/2026',
    indikatorCode: 'PRO-3.3',
    indikatorName: 'Penerapan model pembelajaran Teaching Factory berbasis order pesanan aplikasi riil dari masyarakat/DUDI',
    nilaiMandiri: 88.0,
    status: 'Diajukan',
    catatanUnit: 'Siswa kelas XI telah menyelesaikan 4 aplikasi web pesanan UMKM Magelang.',
    createdAt: '2025-09-15T08:30:00Z',
    updatedAt: '2025-09-15T08:30:00Z'
  },
  {
    id: 'ev-005',
    code: 'EV-2025-05',
    standardId: 5,
    standardName: 'Standar Pendidik & Tenaga Kependidikan',
    unitId: 'u-05',
    unitName: 'Bidang Ketenagaan & SDM',
    periode: 'Semester Ganjil 2025/2026',
    indikatorCode: 'PTK-5.1',
    indikatorName: 'Persentase guru produktif kejuruan yang telah memiliki sertifikat kompetensi asesor atau magang industri',
    nilaiMandiri: 82.0,
    status: 'Direview',
    catatanUnit: '6 guru kejuruan dijadwalkan mengikuti uji kompetensi asesor bulan depan.',
    createdAt: '2025-09-16T10:00:00Z',
    updatedAt: '2025-09-16T10:00:00Z'
  }
];

// INITIAL DOCUMENTS DENGAN 4 TINGKATAN SPMI (MM, PM, PK, CM/F) + REKAP
export const INITIAL_DOCUMENTS: BuktiDokumen[] = [
  // LEVEL 1: MANUAL MUTU (MM) - DIKELOLA OLEH KETUA TPMPS
  {
    id: 'doc-mm-01',
    code: 'MM-SPMI-2024',
    title: 'Manual Mutu SPMI SMK Negeri 2 Magelang Tahun 2024',
    fileName: 'MANUAL_MUTU_2024.pdf',
    fileUrl: '/storage/documents/manual_mutu_2024.pdf',
    fileSize: '4.8 MB',
    fileType: 'pdf',
    kategoriDokumen: 'MM',
    standardId: 7,
    standardName: 'Standar Pengelolaan',
    unitId: 'u-10',
    unitName: '10. UNIT KERJA TPMPS',
    version: 'v2024.1',
    status: 'Terverifikasi',
    folder: '07. Standar Pengelolaan & SPMI',
    isStarred: true,
    notes: 'Dokumen utama sistem manajemen mutu sekolah yang menjelaskan visi, misi, sasaran, dan kebijakan mutu SMK Negeri 2 Magelang.',
    uploadedBy: 'usr-tpmps-01',
    uploadedByName: 'Dra. Hj. Siti Fatimah, M.M. (Ketua TPMPS)',
    verifiedBy: 'usr-kepsek-01',
    verifiedByName: 'Drs. H. Mulyono, M.Pd.',
    verifiedAt: '2024-07-15T09:00:00Z',
    createdAt: '2024-07-10T08:00:00Z',
    updatedAt: '2024-07-15T09:00:00Z'
  },
  // LEVEL 2: PROSEDUR MUTU (PM) - DIKELOLA OLEH KETUA TPMPS
  {
    id: 'doc-pm-01',
    code: 'PM-01-DOK',
    title: 'Prosedur Mutu Pengendalian Dokumen & Rekaman Mutu Internal',
    fileName: 'PM_01_Pengendalian_Dokumen.pdf',
    fileUrl: '/storage/documents/pm_01_pengendalian_dokumen.pdf',
    fileSize: '2.5 MB',
    fileType: 'pdf',
    kategoriDokumen: 'PM',
    standardId: 7,
    standardName: 'Standar Pengelolaan',
    unitId: 'u-10',
    unitName: '10. UNIT KERJA TPMPS',
    version: 'v2.0',
    status: 'Terverifikasi',
    folder: '07. Standar Pengelolaan & SPMI',
    isStarred: true,
    notes: 'Prosedur penetapan, kodifikasi, revisi, dan pengesahan seluruh dokumen internal SPMI (MM, PM, PK, CM/F).',
    uploadedBy: 'usr-tpmps-01',
    uploadedByName: 'Dra. Hj. Siti Fatimah, M.M. (Ketua TPMPS)',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2024-08-01T10:00:00Z',
    createdAt: '2024-07-20T08:00:00Z',
    updatedAt: '2024-08-01T10:00:00Z'
  },
  {
    id: 'doc-pm-02',
    code: 'PM-02-AUD',
    title: 'Prosedur Mutu Pelaksanaan Audit Internal & Verifikasi Eviden',
    fileName: 'PM_02_Audit_Internal.pdf',
    fileUrl: '/storage/documents/pm_02_audit_internal.pdf',
    fileSize: '3.2 MB',
    fileType: 'pdf',
    kategoriDokumen: 'PM',
    standardId: 7,
    standardName: 'Standar Pengelolaan',
    unitId: 'u-10',
    unitName: '10. UNIT KERJA TPMPS',
    version: 'v2.0',
    status: 'Terverifikasi',
    folder: '07. Standar Pengelolaan & SPMI',
    isStarred: true,
    notes: 'Prosedur operasional audit mutu berkala untuk 18 unit kerja oleh auditor internal TPMPS.',
    uploadedBy: 'usr-tpmps-01',
    uploadedByName: 'Dra. Hj. Siti Fatimah, M.M. (Ketua TPMPS)',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2024-08-10T11:00:00Z',
    createdAt: '2024-08-05T09:00:00Z',
    updatedAt: '2024-08-10T11:00:00Z'
  },
  // LEVEL 3: PETUNJUK KERJA (PK) - UNIT KERJA BIASA
  {
    id: 'doc-pk-01',
    code: 'PK-KUR-01',
    title: 'Petunjuk Kerja (PK) Penyusunan Alur Tujuan Pembelajaran & Modul Ajar',
    fileName: 'PK_Penyusunan_Modul_Ajar.pdf',
    fileUrl: '/storage/documents/pk_modul_ajar.pdf',
    fileSize: '2.1 MB',
    fileType: 'pdf',
    kategoriDokumen: 'PK',
    standardId: 2,
    standardName: 'Standar Isi',
    unitId: 'u-02',
    unitName: '2. UNIT KERJA WKS 1 (Kurikulum)',
    version: 'v1.1',
    status: 'Terverifikasi',
    folder: '02. Standar Isi & Kurikulum',
    isStarred: true,
    notes: 'Petunjuk langkah teknis guru dalam merancang modul ajar berorientasi pembelajaran mendalam.',
    uploadedBy: 'usr-guru-01',
    uploadedByName: 'Dra. Sri Wahyuni, M.Pd.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-05T10:00:00Z',
    createdAt: '2025-09-01T08:00:00Z',
    updatedAt: '2025-09-05T10:00:00Z'
  },
  {
    id: 'doc-pk-02',
    code: 'PK-PPLG-02',
    title: 'Petunjuk Kerja (PK) Pengujian Software & Penjaminan Kualitas TEFA',
    fileName: 'PK_Testing_Aplikasi_PPLG.pdf',
    fileUrl: '/storage/documents/pk_testing_pplg.pdf',
    fileSize: '1.9 MB',
    fileType: 'pdf',
    kategoriDokumen: 'PK',
    standardId: 3,
    standardName: 'Standar Proses',
    unitId: 'u-06',
    unitName: '6. UNIT KEJURUAN PPLG',
    version: 'v1.0',
    status: 'Terverifikasi',
    folder: '03. Standar Proses & PjBL',
    isStarred: false,
    notes: 'Petunjuk kerja pelaksanaan unit test dan QA aplikasi web/mobile pesanan mitra industri.',
    uploadedBy: 'usr-u-06',
    uploadedByName: 'Eko Prasetyo, S.Kom., M.Cs.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-08T14:00:00Z',
    createdAt: '2025-09-02T10:00:00Z',
    updatedAt: '2025-09-08T14:00:00Z'
  },
  // LEVEL 4: CATATAN MUTU (F) - UNIT KERJA BIASA
  {
    id: 'doc-cm-01',
    code: 'F-KUR-01',
    title: 'Catatan Mutu (F): Formulir Telaah Modul Ajar dan Validasi KOSP',
    fileName: 'F_01_Telaah_Modul_Ajar.xlsx',
    fileUrl: '/storage/documents/f_01_telaah_modul.xlsx',
    fileSize: '1.4 MB',
    fileType: 'excel',
    kategoriDokumen: 'CM',
    standardId: 2,
    standardName: 'Standar Isi',
    unitId: 'u-02',
    unitName: '2. UNIT KERJA WKS 1 (Kurikulum)',
    version: 'v1.0',
    status: 'Terverifikasi',
    folder: '02. Standar Isi & Kurikulum',
    isStarred: true,
    notes: 'Catatan Mutu (Formulir F) hasil verifikasi keterpenuhan modul ajar seluruh guru semester ganjil.',
    uploadedBy: 'usr-guru-01',
    uploadedByName: 'Dra. Sri Wahyuni, M.Pd.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-12T10:15:00Z',
    createdAt: '2025-09-03T14:20:00Z',
    updatedAt: '2025-09-12T10:15:00Z'
  },
  {
    id: 'doc-cm-02',
    code: 'F-SAR-02',
    title: 'Catatan Mutu (F): Formulir Kartu Riwayat Pemeliharaan PC Lab Komputer',
    fileName: 'F_02_Maintenance_Log_Lab.xlsx',
    fileUrl: '/storage/documents/f_02_maintenance_log.xlsx',
    fileSize: '1.2 MB',
    fileType: 'excel',
    kategoriDokumen: 'CM',
    standardId: 6,
    standardName: 'Standar Sarana & Prasarana',
    unitId: 'u-04',
    unitName: '4. UNIT KERJA WKS 3 (Sarpras)',
    version: 'v1.0',
    status: 'Terverifikasi',
    folder: '06. Standar Sarpras',
    isStarred: false,
    notes: 'Catatan Mutu (Formulir F) riwayat perawatan dan kalibrasi workstation lab kejuruan.',
    uploadedBy: 'usr-guru-01',
    uploadedByName: 'Ir. Agus Haryanto, M.T.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-14T11:45:00Z',
    createdAt: '2025-09-06T09:10:00Z',
    updatedAt: '2025-09-14T11:45:00Z'
  },
  // LEVEL REKAP: REKAPITULASI UNIT - UNIT KERJA BIASA
  {
    id: 'doc-rek-01',
    code: 'REK-BKK-01',
    title: 'Rekapitulasi Keterserapan Alumni BMW (Bekerja, Melanjutkan, Wirausaha)',
    fileName: 'Rekapitulasi_BMW_2024.xlsx',
    fileUrl: '/storage/documents/rekapitulasi_bmw_2024.xlsx',
    fileSize: '4.5 MB',
    fileType: 'excel',
    kategoriDokumen: 'REKAP',
    standardId: 1,
    standardName: 'Standar Kompetensi Lulusan',
    unitId: 'u-17',
    unitName: '17. UNIT KERJA BKK',
    version: 'v2.1',
    status: 'Terverifikasi',
    folder: '01. Standar SKL',
    isStarred: true,
    notes: 'Rekapitulasi berkala keterserapan alumni 1-3 tahun setelah kelulusan oleh Unit BKK.',
    uploadedBy: 'usr-u-17',
    uploadedByName: 'Wahyu Nugroho, S.Pd.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-10T11:00:00Z',
    createdAt: '2025-09-03T10:00:00Z',
    updatedAt: '2025-09-10T11:00:00Z'
  },
  {
    id: 'doc-rek-02',
    code: 'REK-PPLG-02',
    title: 'Rekapitulasi Capaian Kelulusan Uji Sertifikasi LSP-P1 PPLG 2025',
    fileName: 'Rekapitulasi_LSP_PPLG_2025.pdf',
    fileUrl: '/storage/documents/rekap_lsp_pplg.pdf',
    fileSize: '3.4 MB',
    fileType: 'pdf',
    kategoriDokumen: 'REKAP',
    standardId: 1,
    standardName: 'Standar Kompetensi Lulusan',
    unitId: 'u-06',
    unitName: '6. UNIT KEJURUAN PPLG',
    version: 'v1.0',
    status: 'Terverifikasi',
    folder: '01. Standar SKL',
    isStarred: true,
    notes: 'Rekapitulasi nilai dan sertifikat kompetensi siswa skema Pemrograman Berorientasi Objek.',
    uploadedBy: 'usr-guru-01',
    uploadedByName: 'Eko Prasetyo, S.Kom., M.Cs.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-10T14:30:00Z',
    createdAt: '2025-09-02T11:00:00Z',
    updatedAt: '2025-09-10T14:30:00Z'
  },
  {
    id: 'doc-001',
    code: 'DOC-SKL-001',
    title: 'SK Penetapan Kelulusan Uji Sertifikasi LSP-P1 Tahun 2025',
    fileName: 'SK_LSP_P1_Kelulusan_2025.pdf',
    fileUrl: '/storage/documents/sk_lsp_p1_2025.pdf',
    fileSize: '3.4 MB',
    fileType: 'pdf',
    kategoriDokumen: 'CM',
    standardId: 1,
    standardName: 'Standar Kompetensi Lulusan',
    unitId: 'u-06',
    unitName: '6. UNIT KEJURUAN PPLG',
    version: 'v1.0',
    status: 'Terverifikasi',
    folder: '01. Standar SKL',
    isStarred: true,
    notes: 'SK resmi kelulusan sertifikasi kompetensi ditandatangani Kepala Sekolah.',
    uploadedBy: 'usr-guru-01',
    uploadedByName: 'Eko Prasetyo, S.Kom., M.Cs.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-10T14:30:00Z',
    createdAt: '2025-09-02T11:00:00Z',
    updatedAt: '2025-09-10T14:30:00Z'
  },
  {
    id: 'doc-002',
    code: 'DOC-ISI-002',
    title: 'Dokumen KOSP & Berita Acara Penyelarasan Kurikulum IDUKA',
    fileName: 'KOSP_Penyelarasan_Mitra_2025.pdf',
    fileUrl: '/storage/documents/kosp_2025.pdf',
    fileSize: '8.1 MB',
    fileType: 'pdf',
    kategoriDokumen: 'PK',
    standardId: 2,
    standardName: 'Standar Isi',
    unitId: 'u-02',
    unitName: '2. UNIT KERJA WKS 1 (Kurikulum)',
    version: 'v2.1',
    status: 'Terverifikasi',
    folder: '02. Standar Isi & Kurikulum',
    isStarred: true,
    notes: 'Disertai daftar hadir perwakilan IDUKA.',
    uploadedBy: 'usr-guru-01',
    uploadedByName: 'Dra. Sri Wahyuni, M.Pd.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-12T10:15:00Z',
    createdAt: '2025-09-03T14:20:00Z',
    updatedAt: '2025-09-12T10:15:00Z'
  },
  {
    id: 'doc-003',
    code: 'DOC-SAR-003',
    title: 'Laporan Audit Inventarisasi PC & Jaringan Lab RPL',
    fileName: 'Laporan_Inventaris_Lab_RPL.xlsx',
    fileUrl: '/storage/documents/inventaris_rpl.xlsx',
    fileSize: '1.2 MB',
    fileType: 'excel',
    standardId: 6,
    standardName: 'Standar Sarana & Prasarana',
    unitId: 'u-03',
    unitName: 'WKS 3 (Bidang Sarana & Prasarana)',
    version: 'v1.0',
    status: 'Perlu Revisi',
    folder: '06. Standar Sarpras',
    isStarred: false,
    notes: 'Perlu menambahkan rincian spesifikasi processor dan kartu grafis.',
    uploadedBy: 'usr-guru-01',
    uploadedByName: 'Budi Santoso, S.Pd.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-14T11:45:00Z',
    createdAt: '2025-09-06T09:10:00Z',
    updatedAt: '2025-09-14T11:45:00Z'
  },
  {
    id: 'doc-004',
    code: 'DOC-TEF-004',
    title: 'Portofolio Proyek Teaching Factory Aplikasi Web UMKM',
    fileName: 'Portofolio_TEFA_PPLG_2025.pdf',
    fileUrl: '/storage/documents/tefa_2025.pdf',
    fileSize: '12.5 MB',
    fileType: 'pdf',
    standardId: 3,
    standardName: 'Standar Proses',
    unitId: 'u-06',
    unitName: 'Program Keahlian PPLG / RPL',
    version: 'v1.0',
    status: 'Menunggu Review',
    folder: '03. Standar Proses & PjBL',
    isStarred: true,
    notes: 'Dokumentasi serah terima aplikasi kasir POS dan website katalog.',
    uploadedBy: 'usr-guru-01',
    uploadedByName: 'Budi Santoso, S.Pd.',
    createdAt: '2025-09-16T16:00:00Z',
    updatedAt: '2025-09-16T16:00:00Z'
  },
  {
    id: 'doc-005',
    code: 'DOC-KUR-005',
    title: 'Kalender Akademik & Pembagian Jam Mengajar Semester Ganjil',
    fileName: 'Kalender_Akademik_2025_2026.xlsx',
    fileUrl: '/storage/documents/kalender_akademik.xlsx',
    fileSize: '2.1 MB',
    fileType: 'excel',
    standardId: 2,
    standardName: 'Standar Isi',
    unitId: 'u-01',
    unitName: 'WKS 1 (Bidang Kurikulum)',
    version: 'v1.1',
    status: 'Terverifikasi',
    folder: '02. Standar Isi & Kurikulum',
    isStarred: false,
    notes: 'Distribusi jam guru sesuai beban kerja 24 jam.',
    uploadedBy: 'usr-u-01',
    uploadedByName: 'Dra. Sri Wahyuni, M.Pd.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-08T10:00:00Z',
    createdAt: '2025-09-01T08:00:00Z',
    updatedAt: '2025-09-08T10:00:00Z'
  },
  {
    id: 'doc-006',
    code: 'DOC-KES-006',
    title: 'Rekapitulasi Prestasi Lomba & LKS Vokasi Tingkat Nasional',
    fileName: 'Laporan_Prestasi_LKS_2025.pdf',
    fileUrl: '/storage/documents/prestasi_lks.pdf',
    fileSize: '4.8 MB',
    fileType: 'pdf',
    standardId: 1,
    standardName: 'Standar Kompetensi Lulusan',
    unitId: 'u-02',
    unitName: 'WKS 2 (Bidang Kesiswaan)',
    version: 'v1.0',
    status: 'Terverifikasi',
    folder: '01. Standar SKL',
    isStarred: true,
    notes: 'Perolehan Medali Emas LKS Web Technologies & Cloud Computing.',
    uploadedBy: 'usr-u-02',
    uploadedByName: 'Bambang Sutrisno, S.Pd.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-11T13:10:00Z',
    createdAt: '2025-09-04T09:30:00Z',
    updatedAt: '2025-09-11T13:10:00Z'
  },
  {
    id: 'doc-007',
    code: 'DOC-KES-007',
    title: 'Buku Pedoman Tata Tertib & Penegakan Disiplin Karakter Siswa',
    fileName: 'Tata_Tertib_Siswa_2025.docx',
    fileUrl: '/storage/documents/tatib_siswa.docx',
    fileSize: '1.9 MB',
    fileType: 'word',
    standardId: 7,
    standardName: 'Standar Pengelolaan',
    unitId: 'u-02',
    unitName: 'WKS 2 (Bidang Kesiswaan)',
    version: 'v2.0',
    status: 'Terverifikasi',
    folder: '07. Standar Pengelolaan & SPMI',
    isStarred: false,
    notes: 'Implementasi poin pelanggaran & pembinaan konseling.',
    uploadedBy: 'usr-u-02',
    uploadedByName: 'Bambang Sutrisno, S.Pd.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-12T11:00:00Z',
    createdAt: '2025-09-05T10:00:00Z',
    updatedAt: '2025-09-12T11:00:00Z'
  },
  {
    id: 'doc-008',
    code: 'DOC-SAR-008',
    title: 'Master Plan Pemeliharaan Gedung & Fasilitas Belajar Vokasi',
    fileName: 'Masterplan_Sarpras_2025.pdf',
    fileUrl: '/storage/documents/masterplan_sarpras.pdf',
    fileSize: '6.5 MB',
    fileType: 'pdf',
    standardId: 6,
    standardName: 'Standar Sarana & Prasarana',
    unitId: 'u-03',
    unitName: 'WKS 3 (Bidang Sarana & Prasarana)',
    version: 'v1.0',
    status: 'Terverifikasi',
    folder: '06. Standar Sarpras',
    isStarred: false,
    notes: 'Jadwal pemeliharaan berkala panel listrik, genset, dan AC lab.',
    uploadedBy: 'usr-u-03',
    uploadedByName: 'Ir. Agus Haryanto, M.T.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-13T15:30:00Z',
    createdAt: '2025-09-06T14:00:00Z',
    updatedAt: '2025-09-13T15:30:00Z'
  },
  {
    id: 'doc-009',
    code: 'DOC-HUM-009',
    title: 'Naskah MoU Kemitraan Strategis PT Telkom & PT Astra',
    fileName: 'MoU_Kemitraan_Industri_2025.pdf',
    fileUrl: '/storage/documents/mou_industri.pdf',
    fileSize: '5.2 MB',
    fileType: 'pdf',
    standardId: 7,
    standardName: 'Standar Pengelolaan',
    unitId: 'u-04',
    unitName: 'WKS 4 (Hubungan Industri & Humas)',
    version: 'v1.0',
    status: 'Terverifikasi',
    folder: '07. Standar Pengelolaan & SPMI',
    isStarred: true,
    notes: 'Kerjasama mencakup sinkronisasi kurikulum, magang guru, dan rekrutmen.',
    uploadedBy: 'usr-u-04',
    uploadedByName: 'Drs. Hendro Wibowo',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-09T09:00:00Z',
    createdAt: '2025-09-02T16:00:00Z',
    updatedAt: '2025-09-09T09:00:00Z'
  },
  {
    id: 'doc-010',
    code: 'DOC-HUM-010',
    title: 'Laporan Monitoring & Penempatan PKL Siswa di DUDI',
    fileName: 'Laporan_PKL_DUDI_2025.xlsx',
    fileUrl: '/storage/documents/laporan_pkl.xlsx',
    fileSize: '3.1 MB',
    fileType: 'excel',
    standardId: 3,
    standardName: 'Standar Proses',
    unitId: 'u-04',
    unitName: 'WKS 4 (Hubungan Industri & Humas)',
    version: 'v1.0',
    status: 'Menunggu Review',
    folder: '03. Standar Proses & PjBL',
    isStarred: false,
    notes: 'Rekap kehadiran & jurnal mingguan siswa PKL di 42 perusahaan.',
    uploadedBy: 'usr-u-04',
    uploadedByName: 'Drs. Hendro Wibowo',
    createdAt: '2025-09-17T11:00:00Z',
    updatedAt: '2025-09-17T11:00:00Z'
  },
  {
    id: 'doc-011',
    code: 'DOC-SDM-011',
    title: 'Rekapitulasi Sertifikasi Pendidik & Asesor Kompetensi Guru',
    fileName: 'Data_Sertifikasi_Guru_2025.xlsx',
    fileUrl: '/storage/documents/sertifikasi_guru.xlsx',
    fileSize: '1.7 MB',
    fileType: 'excel',
    standardId: 5,
    standardName: 'Standar Pendidik & Tenaga Kependidikan',
    unitId: 'u-05',
    unitName: 'Bidang Ketenagaan & SDM',
    version: 'v1.2',
    status: 'Terverifikasi',
    folder: '05. Standar Pendidik (PTK)',
    isStarred: false,
    notes: '82% guru kejuruan telah tersertifikasi asesor BNSP.',
    uploadedBy: 'usr-u-05',
    uploadedByName: 'Nurul Hidayati, S.Pd.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-14T08:30:00Z',
    createdAt: '2025-09-07T10:00:00Z',
    updatedAt: '2025-09-14T08:30:00Z'
  },
  {
    id: 'doc-012',
    code: 'DOC-SDM-012',
    title: 'Laporan Evaluasi Kinerja Guru (PKG) & Tendik Tahun 2025',
    fileName: 'Laporan_PKG_Tendik_2025.pdf',
    fileUrl: '/storage/documents/pkg_tendik.pdf',
    fileSize: '4.2 MB',
    fileType: 'pdf',
    standardId: 5,
    standardName: 'Standar Pendidik & Tenaga Kependidikan',
    unitId: 'u-05',
    unitName: 'Bidang Ketenagaan & SDM',
    version: 'v1.0',
    status: 'Terverifikasi',
    folder: '05. Standar Pendidik (PTK)',
    isStarred: false,
    notes: 'Penilaian instrumen supervisi klinis oleh Kepala Sekolah & Pengawas.',
    uploadedBy: 'usr-u-05',
    uploadedByName: 'Nurul Hidayati, S.Pd.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-15T14:20:00Z',
    createdAt: '2025-09-08T11:00:00Z',
    updatedAt: '2025-09-15T14:20:00Z'
  },
  {
    id: 'doc-013',
    code: 'DOC-RPL-013',
    title: 'Modul Ajar Cloud Computing & Git-Flow Berstandar Industri',
    fileName: 'Modul_Ajar_Cloud_PPLG.pdf',
    fileUrl: '/storage/documents/modul_cloud.pdf',
    fileSize: '7.5 MB',
    fileType: 'pdf',
    standardId: 2,
    standardName: 'Standar Isi',
    unitId: 'u-06',
    unitName: 'Program Keahlian PPLG / RPL',
    version: 'v2.0',
    status: 'Terverifikasi',
    folder: '02. Standar Isi & Kurikulum',
    isStarred: true,
    notes: 'Disusun bersama instruktur industri mitra teknologi informasi.',
    uploadedBy: 'usr-u-06',
    uploadedByName: 'Eko Prasetyo, S.Kom., M.Cs.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-10T16:00:00Z',
    createdAt: '2025-09-03T13:00:00Z',
    updatedAt: '2025-09-10T16:00:00Z'
  },
  {
    id: 'doc-014',
    code: 'DOC-TKJ-014',
    title: 'Desain Topologi Jaringan Fiber Optik & Silabus Mikrotik MTCNA',
    fileName: 'Topologi_Fiber_MTCNA_TKJ.pdf',
    fileUrl: '/storage/documents/topologi_fiber.pdf',
    fileSize: '6.8 MB',
    fileType: 'pdf',
    standardId: 6,
    standardName: 'Standar Sarana & Prasarana',
    unitId: 'u-07',
    unitName: 'Program Keahlian TJKT / TKJ',
    version: 'v1.1',
    status: 'Terverifikasi',
    folder: '06. Standar Sarpras',
    isStarred: false,
    notes: 'Peta jaringan backbone antar lab dan ruang server sekolah.',
    uploadedBy: 'usr-u-07',
    uploadedByName: 'Ahmad Fauzi, S.T.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-12T13:00:00Z',
    createdAt: '2025-09-05T09:00:00Z',
    updatedAt: '2025-09-12T13:00:00Z'
  },
  {
    id: 'doc-015',
    code: 'DOC-TKJ-015',
    title: 'Berita Acara Uji Sertifikasi Kompetensi Jaringan Komputer',
    fileName: 'Berita_Acara_UKK_TKJ_2025.docx',
    fileUrl: '/storage/documents/ba_ukk_tkj.docx',
    fileSize: '2.4 MB',
    fileType: 'word',
    standardId: 4,
    standardName: 'Standar Penilaian',
    unitId: 'u-07',
    unitName: 'Program Keahlian TJKT / TKJ',
    version: 'v1.0',
    status: 'Menunggu Review',
    folder: '04. Standar Penilaian',
    isStarred: false,
    notes: 'Hasil asesmen penguji eksternal dari PT Telkom Indonesia.',
    uploadedBy: 'usr-u-07',
    uploadedByName: 'Ahmad Fauzi, S.T.',
    createdAt: '2025-09-16T14:00:00Z',
    updatedAt: '2025-09-16T14:00:00Z'
  },
  {
    id: 'doc-016',
    code: 'DOC-AKL-016',
    title: 'Laporan Neraca Siklus Akuntansi Komputer (MYOB & Accurate)',
    fileName: 'Laporan_Siklus_Akuntansi_AKL.xlsx',
    fileUrl: '/storage/documents/siklus_akl.xlsx',
    fileSize: '3.6 MB',
    fileType: 'excel',
    standardId: 4,
    standardName: 'Standar Penilaian',
    unitId: 'u-08',
    unitName: 'Program Keahlian Akuntansi (AKL)',
    version: 'v1.0',
    status: 'Terverifikasi',
    folder: '04. Standar Penilaian',
    isStarred: false,
    notes: 'Simulasi pembukuan perusahaan dagang dan manufaktur siswa.',
    uploadedBy: 'usr-u-08',
    uploadedByName: 'Siti Rahmawati, S.E., M.Akt.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-11T15:00:00Z',
    createdAt: '2025-09-04T11:00:00Z',
    updatedAt: '2025-09-11T15:00:00Z'
  },
  {
    id: 'doc-017',
    code: 'DOC-AKL-017',
    title: 'Modul Praktik Perpajakan & Spreadsheet Keuangan Vokasi',
    fileName: 'Modul_Pajak_Spreadsheet_AKL.pdf',
    fileUrl: '/storage/documents/modul_pajak.pdf',
    fileSize: '5.4 MB',
    fileType: 'pdf',
    standardId: 2,
    standardName: 'Standar Isi',
    unitId: 'u-08',
    unitName: 'Program Keahlian Akuntansi (AKL)',
    version: 'v2.0',
    status: 'Terverifikasi',
    folder: '02. Standar Isi & Kurikulum',
    isStarred: true,
    notes: 'Sinkronisasi ketentuan PPh Pasal 21 dan PPN terupdate.',
    uploadedBy: 'usr-u-08',
    uploadedByName: 'Siti Rahmawati, S.E., M.Akt.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-13T10:00:00Z',
    createdAt: '2025-09-06T10:30:00Z',
    updatedAt: '2025-09-13T10:00:00Z'
  },
  {
    id: 'doc-018',
    code: 'DOC-MPLB-018',
    title: 'SOP Manajemen Kearsipan Digital & Otomasi Perkantoran',
    fileName: 'SOP_Kearsipan_Digital_MPLB.docx',
    fileUrl: '/storage/documents/sop_kearsipan.docx',
    fileSize: '2.8 MB',
    fileType: 'word',
    standardId: 7,
    standardName: 'Standar Pengelolaan',
    unitId: 'u-09',
    unitName: 'Program Keahlian Manajemen Perkantoran (MPLB)',
    version: 'v1.0',
    status: 'Terverifikasi',
    folder: '07. Standar Pengelolaan & SPMI',
    isStarred: false,
    notes: 'Prosedur pemindaian, pengindeksan, dan penyimpanan dokumen arsip.',
    uploadedBy: 'usr-u-09',
    uploadedByName: 'Dewi Lestari, S.Pd.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-14T16:00:00Z',
    createdAt: '2025-09-07T13:00:00Z',
    updatedAt: '2025-09-14T16:00:00Z'
  },
  {
    id: 'doc-019',
    code: 'DOC-MPLB-019',
    title: 'Portofolio Simulasi Rapat & Korespondensi Bisnis Siswa',
    fileName: 'Portofolio_Simulasi_Kantor_MPLB.pdf',
    fileUrl: '/storage/documents/portofolio_mplb.pdf',
    fileSize: '6.1 MB',
    fileType: 'pdf',
    standardId: 3,
    standardName: 'Standar Proses',
    unitId: 'u-09',
    unitName: 'Program Keahlian Manajemen Perkantoran (MPLB)',
    version: 'v1.0',
    status: 'Terverifikasi',
    folder: '03. Standar Proses & PjBL',
    isStarred: false,
    notes: 'Dokumentasi video & notula rapat bisnis bilingual siswa.',
    uploadedBy: 'usr-u-09',
    uploadedByName: 'Dewi Lestari, S.Pd.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-15T09:30:00Z',
    createdAt: '2025-09-08T15:00:00Z',
    updatedAt: '2025-09-15T09:30:00Z'
  },
  {
    id: 'doc-020',
    code: 'DOC-BDP-020',
    title: 'Laporan Omzet Retail & Analisis Kampanye Digital Marketing',
    fileName: 'Laporan_Omzet_BDP_2025.xlsx',
    fileUrl: '/storage/documents/omzet_bdp.xlsx',
    fileSize: '2.5 MB',
    fileType: 'excel',
    standardId: 3,
    standardName: 'Standar Proses',
    unitId: 'u-10',
    unitName: 'Program Keahlian Pemasaran (BDP)',
    version: 'v1.1',
    status: 'Terverifikasi',
    folder: '03. Standar Proses & PjBL',
    isStarred: true,
    notes: 'Omzet lab bisnis retail siswa melampaui target semester.',
    uploadedBy: 'usr-u-10',
    uploadedByName: 'Rudi Hartono, S.E.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-12T14:40:00Z',
    createdAt: '2025-09-05T16:00:00Z',
    updatedAt: '2025-09-12T14:40:00Z'
  },
  {
    id: 'doc-021',
    code: 'DOC-BDP-021',
    title: 'Portofolio Desain Visual Merchandising & Katalog E-Commerce',
    fileName: 'Desain_Merchandising_BDP.jpg',
    fileUrl: '/storage/documents/desain_bdp.jpg',
    fileSize: '4.7 MB',
    fileType: 'image',
    standardId: 1,
    standardName: 'Standar Kompetensi Lulusan',
    unitId: 'u-10',
    unitName: 'Program Keahlian Pemasaran (BDP)',
    version: 'v1.0',
    status: 'Terverifikasi',
    folder: '01. Standar SKL',
    isStarred: false,
    notes: 'Dokumentasi penataan display barang dagangan di Business Center.',
    uploadedBy: 'usr-u-10',
    uploadedByName: 'Rudi Hartono, S.E.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-13T11:20:00Z',
    createdAt: '2025-09-06T11:00:00Z',
    updatedAt: '2025-09-13T11:20:00Z'
  },
  {
    id: 'doc-022',
    code: 'DOC-LAB-022',
    title: 'Kartu Riwayat Servis PC & Jadwal Pemakaian 6 Lab Komputer',
    fileName: 'Maintenance_Log_Lab_2025.xlsx',
    fileUrl: '/storage/documents/maintenance_lab.xlsx',
    fileSize: '1.8 MB',
    fileType: 'excel',
    standardId: 6,
    standardName: 'Standar Sarana & Prasarana',
    unitId: 'u-11',
    unitName: 'Unit Pengelola Bengkel & Lab Komputer',
    version: 'v2.0',
    status: 'Terverifikasi',
    folder: '06. Standar Sarpras',
    isStarred: false,
    notes: 'Rekap penggantian power supply & thermal paste 120 unit PC.',
    uploadedBy: 'usr-u-11',
    uploadedByName: 'Supriyanto, A.Md.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-15T10:00:00Z',
    createdAt: '2025-09-08T09:00:00Z',
    updatedAt: '2025-09-15T10:00:00Z'
  },
  {
    id: 'doc-023',
    code: 'DOC-PER-023',
    title: 'Laporan Sirkulasi & Statistik Kunjungan Perpustakaan Digital',
    fileName: 'Statistik_Perpustakaan_Digital.pdf',
    fileUrl: '/storage/documents/statistik_perpus.pdf',
    fileSize: '3.3 MB',
    fileType: 'pdf',
    standardId: 6,
    standardName: 'Standar Sarana & Prasarana',
    unitId: 'u-12',
    unitName: 'Unit Perpustakaan Digital',
    version: 'v1.0',
    status: 'Terverifikasi',
    folder: '06. Standar Sarpras',
    isStarred: false,
    notes: 'Kunjungan e-library mencapai rata-rata 340 siswa/hari.',
    uploadedBy: 'usr-u-12',
    uploadedByName: 'Tri Utami, S.I.Pust.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-14T14:00:00Z',
    createdAt: '2025-09-07T14:30:00Z',
    updatedAt: '2025-09-14T14:00:00Z'
  },
  {
    id: 'doc-024',
    code: 'DOC-BKK-024',
    title: 'Laporan Tracer Study Keterserapan Lulusan 2024 (BMW)',
    fileName: 'Tracer_Study_BMW_2024.xlsx',
    fileUrl: '/storage/documents/tracer_study.xlsx',
    fileSize: '4.5 MB',
    fileType: 'excel',
    standardId: 1,
    standardName: 'Standar Kompetensi Lulusan',
    unitId: 'u-13',
    unitName: 'Bursa Kerja Khusus (BKK Magelang)',
    version: 'v2.1',
    status: 'Terverifikasi',
    folder: '01. Standar SKL',
    isStarred: true,
    notes: '87.4% alumni terserap: Bekerja 68%, Kuliah 12%, Wirausaha 7.4%.',
    uploadedBy: 'usr-u-13',
    uploadedByName: 'Wahyu Nugroho, S.Pd.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-10T11:00:00Z',
    createdAt: '2025-09-03T10:00:00Z',
    updatedAt: '2025-09-10T11:00:00Z'
  },
  {
    id: 'doc-025',
    code: 'DOC-BKK-025',
    title: 'Dokumentasi & Berita Acara Rekrutmen Kampus Job Fair SMK',
    fileName: 'Dokumentasi_JobFair_2025.pdf',
    fileUrl: '/storage/documents/jobfair_2025.pdf',
    fileSize: '8.9 MB',
    fileType: 'pdf',
    standardId: 7,
    standardName: 'Standar Pengelolaan',
    unitId: 'u-13',
    unitName: 'Bursa Kerja Khusus (BKK Magelang)',
    version: 'v1.0',
    status: 'Terverifikasi',
    folder: '07. Standar Pengelolaan & SPMI',
    isStarred: false,
    notes: 'Dihadiri 18 perusahaan nasional & daerah dengan 250 kuota kerja.',
    uploadedBy: 'usr-u-13',
    uploadedByName: 'Wahyu Nugroho, S.Pd.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-12T15:30:00Z',
    createdAt: '2025-09-05T14:00:00Z',
    updatedAt: '2025-09-12T15:30:00Z'
  },
  {
    id: 'doc-026',
    code: 'DOC-BK-026',
    title: 'Laporan Asesmen Diagnostik Pemetaan Minat, Bakat, & Karir Siswa',
    fileName: 'Asesmen_Minat_Bakat_BK.pdf',
    fileUrl: '/storage/documents/asesmen_bk.pdf',
    fileSize: '5.7 MB',
    fileType: 'pdf',
    standardId: 3,
    standardName: 'Standar Proses',
    unitId: 'u-14',
    unitName: 'Unit Bimbingan Konseling (BK)',
    version: 'v1.0',
    status: 'Terverifikasi',
    folder: '03. Standar Proses & PjBL',
    isStarred: false,
    notes: 'Pemetaan gaya belajar dan rekomendasi jalur karir kelas X.',
    uploadedBy: 'usr-u-14',
    uploadedByName: 'Dra. Endang Sulastri',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-14T09:00:00Z',
    createdAt: '2025-09-07T08:30:00Z',
    updatedAt: '2025-09-14T09:00:00Z'
  },
  {
    id: 'doc-027',
    code: 'DOC-TEF-027',
    title: 'Laporan Omzet Produksi & Neraca Penjualan Unit Teaching Factory',
    fileName: 'Laporan_Omzet_TEFA_2025.xlsx',
    fileUrl: '/storage/documents/omzet_tefa.xlsx',
    fileSize: '3.9 MB',
    fileType: 'excel',
    standardId: 8,
    standardName: 'Standar Pembiayaan',
    unitId: 'u-15',
    unitName: 'Unit Produksi & Teaching Factory (TEFA)',
    version: 'v1.3',
    status: 'Terverifikasi',
    folder: '08. Standar Pembiayaan & RKAS',
    isStarred: true,
    notes: 'Kontribusi revenue unit produksi ke kas BLUD sekolah.',
    uploadedBy: 'usr-u-15',
    uploadedByName: 'Anwar Sadat, S.T.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-13T16:00:00Z',
    createdAt: '2025-09-06T15:00:00Z',
    updatedAt: '2025-09-13T16:00:00Z'
  },
  {
    id: 'doc-028',
    code: 'DOC-TEF-028',
    title: 'SOP Quality Control & Standar Mutu Produk Barang/Jasa TEFA',
    fileName: 'SOP_QC_Produk_TEFA.docx',
    fileUrl: '/storage/documents/sop_qc_tefa.docx',
    fileSize: '2.2 MB',
    fileType: 'word',
    standardId: 3,
    standardName: 'Standar Proses',
    unitId: 'u-15',
    unitName: 'Unit Produksi & Teaching Factory (TEFA)',
    version: 'v1.0',
    status: 'Terverifikasi',
    folder: '03. Standar Proses & PjBL',
    isStarred: false,
    notes: 'Prosedur pengujian presisi produk sebelum diserahkan ke klien.',
    uploadedBy: 'usr-u-15',
    uploadedByName: 'Anwar Sadat, S.T.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-15T11:30:00Z',
    createdAt: '2025-09-08T13:00:00Z',
    updatedAt: '2025-09-15T11:30:00Z'
  },
  {
    id: 'doc-029',
    code: 'DOC-KEU-029',
    title: 'Dokumen Rencana Kegiatan & Anggaran Sekolah (RKAS) BOS/BOP 2025',
    fileName: 'RKAS_BOS_BOP_2025.xlsx',
    fileUrl: '/storage/documents/rkas_2025.xlsx',
    fileSize: '5.1 MB',
    fileType: 'excel',
    standardId: 8,
    standardName: 'Standar Pembiayaan',
    unitId: 'u-03',
    unitName: 'WKS 3 (Bidang Sarana & Prasarana)',
    version: 'v2.0',
    status: 'Terverifikasi',
    folder: '08. Standar Pembiayaan & RKAS',
    isStarred: false,
    notes: 'Alokasi anggaran terverifikasi Dinas Pendidikan Provinsi Jawa Tengah.',
    uploadedBy: 'usr-u-03',
    uploadedByName: 'Ir. Agus Haryanto, M.T.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-16T10:00:00Z',
    createdAt: '2025-09-09T09:00:00Z',
    updatedAt: '2025-09-16T10:00:00Z'
  },
  {
    id: 'doc-030',
    code: 'DOC-KUR-030',
    title: 'Laporan Hasil Audit Kepatuhan SPMI Triwulan I Tahun 2025',
    fileName: 'Laporan_Audit_SPMI_Triwulan1.pdf',
    fileUrl: '/storage/documents/audit_spmi_triwulan1.pdf',
    fileSize: '6.4 MB',
    fileType: 'pdf',
    standardId: 7,
    standardName: 'Standar Pengelolaan',
    unitId: 'u-01',
    unitName: 'WKS 1 (Bidang Kurikulum)',
    version: 'v1.0',
    status: 'Terverifikasi',
    folder: '07. Standar Pengelolaan & SPMI',
    isStarred: true,
    notes: 'Rekomendasi audit tata kelola dokumen & tindak lanjut 15 unit kerja.',
    uploadedBy: 'usr-u-01',
    uploadedByName: 'Dra. Sri Wahyuni, M.Pd.',
    verifiedBy: 'usr-tpmps-01',
    verifiedByName: 'Dra. Hj. Siti Fatimah, M.M.',
    verifiedAt: '2025-09-17T15:00:00Z',
    createdAt: '2025-09-10T14:00:00Z',
    updatedAt: '2025-09-17T15:00:00Z'
  }
];

// INITIAL RTL PROGRAMS
export const INITIAL_RTL: ProgramMutuRTL[] = [
  {
    id: 'rtl-001',
    code: 'RTL-2025-01',
    standardId: 6,
    standardName: 'Standar Sarana & Prasarana',
    unitId: 'u-03',
    unitName: 'WKS 3 (Bidang Sarana & Prasarana)',
    evaluationId: 'ev-003',
    programName: 'Pengadaan & Peremajaan Hardware Lab Komputer PPLG',
    latarBelakang: 'Penurunan performa 8 workstation siswa saat kompilasi aplikasi mobile.',
    targetKinerja: '100% workstation Lab RPL memenuhi standar minimal RAM 16GB dan SSD NVMe.',
    anggaran: 45000000,
    deadline: '2025-11-30',
    progress: 40,
    priority: 'Tinggi',
    status: 'Sedang Berjalan',
    pjUserName: 'Ir. Agus Haryanto, M.T.',
    createdAt: '2025-09-14T15:00:00Z',
    updatedAt: '2025-09-16T09:00:00Z'
  },
  {
    id: 'rtl-002',
    code: 'RTL-2025-02',
    standardId: 5,
    standardName: 'Standar Pendidik & Tenaga Kependidikan',
    unitId: 'u-05',
    unitName: 'Bidang Ketenagaan & SDM',
    evaluationId: 'ev-005',
    programName: 'Program Magang Industri & Sertifikasi Asesor Kompetensi Guru Produktif',
    latarBelakang: 'Target sekolah: 100% guru produktif mengantongi sertifikat teknis industri.',
    targetKinerja: '6 guru kejuruan tersertifikasi BNSP dan telah magang selama 1 bulan di IDUKA.',
    anggaran: 25000000,
    deadline: '2025-12-15',
    progress: 25,
    priority: 'Sedang',
    status: 'Direncanakan',
    pjUserName: 'Nurul Hidayati, S.Pd.',
    createdAt: '2025-09-15T11:00:00Z',
    updatedAt: '2025-09-15T11:00:00Z'
  },
  {
    id: 'rtl-003',
    code: 'RTL-2025-03',
    standardId: 2,
    standardName: 'Standar Isi',
    unitId: 'u-01',
    unitName: 'WKS 1 (Bidang Kurikulum)',
    evaluationId: 'ev-002',
    programName: 'Ekspansi Kerjasama Penyelarasan Kurikulum dengan 3 Industri Magelang',
    latarBelakang: 'Penguatan keterlibatan industri mikro dan menengah daerah binaan.',
    targetKinerja: 'Terbitnya MoU resmi dan sinkronisasi modul ajar vokasi kejuruan.',
    anggaran: 12000000,
    deadline: '2025-10-31',
    progress: 85,
    priority: 'Sedang',
    status: 'Sedang Berjalan',
    pjUserName: 'Budi Santoso, S.Pd.',
    createdAt: '2025-09-12T16:00:00Z',
    updatedAt: '2025-09-17T14:20:00Z'
  }
];

// INITIAL ACTIVITY LOGS
export const INITIAL_LOGS: ActivityLogItem[] = [
  {
    id: 'log-01',
    userId: 'usr-tpmps-01',
    userName: 'Dra. Hj. Siti Fatimah, M.M.',
    roleName: 'Ketua TPMPS',
    action: 'APPROVAL_EVALUASI',
    entity: 'Evaluasi Mutu',
    entityId: 'EV-2025-01',
    details: 'Menyetujui evaluasi ketercapaian sertifikasi kompetensi kejuruan dengan skor verifikasi 92.5%',
    ipAddress: '192.168.10.15',
    createdAt: '2025-09-18 10:14:22'
  },
  {
    id: 'log-02',
    userId: 'usr-guru-01',
    userName: 'Budi Santoso, S.Pd.',
    roleName: 'WKS Kurikulum',
    action: 'UPLOAD_DOKUMEN',
    entity: 'Bukti Dokumen',
    entityId: 'DOC-TEF-004',
    details: 'Mengunggah berkas: Portofolio Proyek Teaching Factory Aplikasi Web UMKM (12.5 MB)',
    ipAddress: '192.168.10.42',
    createdAt: '2025-09-18 08:35:10'
  },
  {
    id: 'log-03',
    userId: 'usr-admin-01',
    userName: 'Rian Prasetyo, S.Kom.',
    roleName: 'Admin Sistem',
    action: 'BACKUP_DATABASE',
    entity: 'Sistem',
    entityId: 'SYS-BAK-2025',
    details: 'Melakukan snapshot backup skema basis data PostgreSQL Supabase dan konfigurasi RLS',
    ipAddress: '192.168.10.2',
    createdAt: '2025-09-17 23:00:00'
  }
];

// DATA STORE SINGLETON WITH LOCALSTORAGE PERSISTENCE
class SintesaDataEngine {
  private evaluations: EvaluasiMutu[] = [];
  private documents: BuktiDokumen[] = [];
  private rtlList: ProgramMutuRTL[] = [];
  private logs: ActivityLogItem[] = [];
  private units: UnitKerja[] = [];
  private periodes: PeriodeMutu[] = [];
  private activeUser: UserProfile = INITIAL_USERS.tpmps;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') {
      this.evaluations = [...INITIAL_EVALUATIONS];
      this.documents = [...INITIAL_DOCUMENTS];
      this.rtlList = [...INITIAL_RTL];
      this.logs = [...INITIAL_LOGS];
      this.units = [...INITIAL_UNITS];
      this.periodes = [...INITIAL_PERIODES];
      return;
    }

    try {
      const savedEvals = localStorage.getItem('sintesa_evaluations');
      this.evaluations = savedEvals ? JSON.parse(savedEvals) : [...INITIAL_EVALUATIONS];

      const savedDocs = localStorage.getItem('sintesa_documents');
      let loadedDocs = savedDocs ? JSON.parse(savedDocs) : null;
      if (!loadedDocs || !loadedDocs.some((d: BuktiDokumen) => d.kategoriDokumen === 'MM')) {
        loadedDocs = [...INITIAL_DOCUMENTS];
        this.persist('sintesa_documents', loadedDocs);
      }
      this.documents = loadedDocs;

      const savedRtl = localStorage.getItem('sintesa_rtl');
      this.rtlList = savedRtl ? JSON.parse(savedRtl) : [...INITIAL_RTL];

      const savedLogs = localStorage.getItem('sintesa_logs');
      this.logs = savedLogs ? JSON.parse(savedLogs) : [...INITIAL_LOGS];

      const savedUnits = localStorage.getItem('sintesa_units');
      let loadedUnits = savedUnits ? JSON.parse(savedUnits) : null;
      // Auto-migrate to official 18 units (PPLG, MPLB, PM, AKL without generic K3)
      if (!loadedUnits || loadedUnits.length !== 18 || loadedUnits.some((u: UnitKerja) => u.code === 'K3')) {
        loadedUnits = [...INITIAL_UNITS];
        this.persist('sintesa_units', loadedUnits);
      }
      this.units = loadedUnits;

      const savedPeriodes = localStorage.getItem('sintesa_periodes');
      this.periodes = savedPeriodes ? JSON.parse(savedPeriodes) : [...INITIAL_PERIODES];

      const savedUser = localStorage.getItem('sintesa_auth_user');
      if (savedUser) {
        this.activeUser = JSON.parse(savedUser);
      } else {
        this.activeUser = null;
      }
    } catch {
      this.evaluations = [...INITIAL_EVALUATIONS];
      this.documents = [...INITIAL_DOCUMENTS];
      this.rtlList = [...INITIAL_RTL];
      this.logs = [...INITIAL_LOGS];
      this.units = [...INITIAL_UNITS];
      this.periodes = [...INITIAL_PERIODES];
    }
  }

  private persist(key: string, data: unknown) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (err) {
        console.error('Storage quota exceeded or private mode:', err);
      }
    }
  }

  // --- AUTHENTICATION ---
  public getActiveUser(): UserProfile {
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('sintesa_auth_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.id && parsed.role) {
            this.activeUser = parsed;
          }
        }
      } catch {
        // use current activeUser
      }
    }
    return this.activeUser;
  }

  public setActiveUser(user: UserProfile | null) {
    this.activeUser = user;
    this.persist('sintesa_auth_user', user);
    if (typeof window !== 'undefined') {
      const sessionPayload = {
        userId: user.id,
        nip: user.nip,
        role: user.role,
        name: user.fullName,
        exp: Math.floor(Date.now() / 1000) + 86400
      };
      let encoded = '';
      try {
        encoded = btoa(unescape(encodeURIComponent(JSON.stringify(sessionPayload))));
      } catch {
        encoded = btoa(JSON.stringify(sessionPayload));
      }
      document.cookie = `sintesa_session=${encoded}; path=/; max-age=86400; SameSite=Lax`;
    }
  }

  public logout() {
    this.activeUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sintesa_auth_user');
      document.cookie = 'sintesa_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax';
    }
  }

  // --- STANDARDS & UNITS ---
  public getStandards(): StandardSNP[] {
    return INITIAL_STANDARDS;
  }

  public getStandardById(id: number): StandardSNP | undefined {
    return INITIAL_STANDARDS.find((s) => s.id === id);
  }

  public getUnits(): UnitKerja[] {
    return this.units;
  }

  public getUnitById(id: string): UnitKerja | undefined {
    return this.units.find((u) => u.id === id);
  }

  public createUnit(data: Omit<UnitKerja, 'id'>): UnitKerja {
    const newId = `u-${Date.now().toString().slice(-4)}`;
    const newUnit: UnitKerja = {
      ...data,
      id: newId,
      score: data.score || 85.0,
      totalIndicators: data.totalIndicators || 20,
      completedIndicators: data.completedIndicators || 0
    };
    this.units = [...this.units, newUnit];
    this.persist('sintesa_units', this.units);
    this.addLog('CREATE_UNIT', 'Unit Kerja', newUnit.code, `Menambahkan unit kerja baru: "${newUnit.name}" (${newUnit.code})`);
    return newUnit;
  }

  public updateUnit(id: string, updates: Partial<UnitKerja>): UnitKerja | null {
    const idx = this.units.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    const updated = {
      ...this.units[idx],
      ...updates
    };
    this.units[idx] = updated;
    this.persist('sintesa_units', this.units);
    this.addLog('UPDATE_UNIT', 'Unit Kerja', updated.code, `Memperbarui data unit kerja "${updated.name}"`);
    return updated;
  }

  public deleteUnit(id: string): boolean {
    const target = this.units.find((u) => u.id === id);
    if (!target) return false;

    this.units = this.units.filter((u) => u.id !== id);
    this.persist('sintesa_units', this.units);
    this.addLog('DELETE_UNIT', 'Unit Kerja', target.code, `Menghapus unit kerja "${target.name}" (${target.code})`);
    return true;
  }

  // --- EVALUATIONS ---
  public getEvaluations(): EvaluasiMutu[] {
    return this.evaluations;
  }

  public getEvaluationById(id: string): EvaluasiMutu | undefined {
    return this.evaluations.find((e) => e.id === id);
  }

  public createEvaluation(data: Omit<EvaluasiMutu, 'id' | 'createdAt' | 'updatedAt'>): EvaluasiMutu {
    const newId = `ev-${Date.now()}`;
    const newEval: EvaluasiMutu = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.evaluations = [newEval, ...this.evaluations];
    this.persist('sintesa_evaluations', this.evaluations);

    this.addLog('CREATE_EVALUASI', 'Evaluasi Mutu', newEval.code, `Membuat evaluasi indikator: ${newEval.indikatorCode} (${newEval.unitName})`);
    return newEval;
  }

  public updateEvaluation(id: string, updates: Partial<EvaluasiMutu>): EvaluasiMutu | null {
    const idx = this.evaluations.findIndex((e) => e.id === id);
    if (idx === -1) return null;

    const updated = {
      ...this.evaluations[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.evaluations[idx] = updated;
    this.persist('sintesa_evaluations', this.evaluations);

    this.addLog('UPDATE_EVALUASI', 'Evaluasi Mutu', updated.code, `Memperbarui data evaluasi ${updated.code} status: ${updated.status}`);
    return updated;
  }

  public deleteEvaluation(id: string): boolean {
    const target = this.evaluations.find((e) => e.id === id);
    if (!target) return false;

    this.evaluations = this.evaluations.filter((e) => e.id !== id);
    this.persist('sintesa_evaluations', this.evaluations);

    this.addLog('DELETE_EVALUASI', 'Evaluasi Mutu', target.code, `Menghapus evaluasi ${target.code}`);
    return true;
  }

  // --- DOCUMENTS ---
  public getDocuments(): BuktiDokumen[] {
    return this.documents;
  }

  public getDocumentById(id: string): BuktiDokumen | undefined {
    return this.documents.find((d) => d.id === id);
  }

  public createDocument(data: Omit<BuktiDokumen, 'id' | 'createdAt' | 'updatedAt'>): BuktiDokumen {
    const newId = `doc-${Date.now()}`;
    const newDoc: BuktiDokumen = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.documents = [newDoc, ...this.documents];
    this.persist('sintesa_documents', this.documents);

    this.addLog('UPLOAD_DOKUMEN', 'Bukti Dokumen', newDoc.code, `Mengunggah berkas bukti baru: "${newDoc.title}"`);
    return newDoc;
  }

  public updateDocument(id: string, updates: Partial<BuktiDokumen>): BuktiDokumen | null {
    const idx = this.documents.findIndex((d) => d.id === id);
    if (idx === -1) return null;

    const updated = {
      ...this.documents[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.documents[idx] = updated;
    this.persist('sintesa_documents', this.documents);

    this.addLog('UPDATE_DOKUMEN', 'Bukti Dokumen', updated.code, `Status dokumen "${updated.title}" diubah menjadi: ${updated.status}`);
    return updated;
  }

  public deleteDocument(id: string): boolean {
    const target = this.documents.find((d) => d.id === id);
    if (!target) return false;

    this.documents = this.documents.filter((d) => d.id !== id);
    this.persist('sintesa_documents', this.documents);

    this.addLog('DELETE_DOKUMEN', 'Bukti Dokumen', target.code, `Menghapus dokumen "${target.title}"`);
    return true;
  }

  public toggleStarDocument(id: string): BuktiDokumen | null {
    const idx = this.documents.findIndex((d) => d.id === id);
    if (idx === -1) return null;

    const currentVal = !!this.documents[idx].isStarred;
    this.documents[idx] = {
      ...this.documents[idx],
      isStarred: !currentVal,
      updatedAt: new Date().toISOString()
    };
    this.persist('sintesa_documents', this.documents);
    return this.documents[idx];
  }

  public getDocumentsByUnit(unitId: string): BuktiDokumen[] {
    return this.documents.filter((d) => d.unitId === unitId);
  }

  // --- RTL PROGRAMS ---
  public getRtlList(): ProgramMutuRTL[] {
    return this.rtlList;
  }

  public getRtlById(id: string): ProgramMutuRTL | undefined {
    return this.rtlList.find((r) => r.id === id);
  }

  public createRtl(data: Omit<ProgramMutuRTL, 'id' | 'createdAt' | 'updatedAt'>): ProgramMutuRTL {
    const newId = `rtl-${Date.now()}`;
    const newRtl: ProgramMutuRTL = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.rtlList = [newRtl, ...this.rtlList];
    this.persist('sintesa_rtl', this.rtlList);

    this.addLog('CREATE_RTL', 'Program RTL', newRtl.code, `Menyusun program RTL: "${newRtl.programName}" (Unit: ${newRtl.unitName})`);
    return newRtl;
  }

  public updateRtl(id: string, updates: Partial<ProgramMutuRTL>): ProgramMutuRTL | null {
    const idx = this.rtlList.findIndex((r) => r.id === id);
    if (idx === -1) return null;

    const updated = {
      ...this.rtlList[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.rtlList[idx] = updated;
    this.persist('sintesa_rtl', this.rtlList);

    this.addLog('UPDATE_RTL', 'Program RTL', updated.code, `Memperbarui progres RTL "${updated.programName}" (${updated.progress}%)`);
    return updated;
  }

  public deleteRtl(id: string): boolean {
    const target = this.rtlList.find((r) => r.id === id);
    if (!target) return false;

    this.rtlList = this.rtlList.filter((r) => r.id !== id);
    this.persist('sintesa_rtl', this.rtlList);

    this.addLog('DELETE_RTL', 'Program RTL', target.code, `Menghapus program RTL "${target.programName}"`);
    return true;
  }

  // --- PERIODE PENJAMINAN MUTU (SPMI) ---
  // ATURAN RESMI: HANYA KEPALA SEKOLAH YANG DAPAT MEMBUAT & MENGAKTIFKAN PERIODE MUTU
  public getPeriodes(): PeriodeMutu[] {
    return this.periodes;
  }

  public getActivePeriode(): PeriodeMutu {
    const active = this.periodes.find((p) => p.isActive);
    return active || this.periodes[0] || INITIAL_PERIODES[0];
  }

  public canUserCreatePeriode(): boolean {
    const user = this.getActiveUser();
    return user.role === 'kepala_sekolah' || user.role === 'admin';
  }

  public createPeriode(data: {
    name: string;
    tahunAjaran: string;
    semester: 'Ganjil' | 'Genap';
    startDate: string;
    endDate: string;
    targetScore?: number;
    description?: string;
    setAsActive?: boolean;
  }): { success: boolean; message: string; periode?: PeriodeMutu } {
    const user = this.getActiveUser();
    // ATURAN KETAT DARI MANUAL MUTU: Hanya Kepala Sekolah yang berhak membuat Periode
    if (user.role !== 'kepala_sekolah' && user.role !== 'admin') {
      return {
        success: false,
        message: 'Akses Ditolak: Hanya Kepala Sekolah yang memiliki wewenang untuk membuat Periode Mutu SPMI baru.'
      };
    }

    const newId = `per-${Date.now().toString().slice(-4)}`;
    const newCode = `PER-${data.tahunAjaran.replace('/', '-')}-${data.semester === 'Ganjil' ? '1' : '2'}`;

    if (data.setAsActive) {
      this.periodes = this.periodes.map((p) => ({ ...p, isActive: false, status: 'Arsip' }));
    }

    const newPeriode: PeriodeMutu = {
      id: newId,
      code: newCode,
      name: data.name.trim(),
      tahunAjaran: data.tahunAjaran.trim(),
      semester: data.semester,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: data.setAsActive ?? true,
      status: data.setAsActive ? 'Aktif' : 'Direncanakan',
      targetScore: data.targetScore || 95.0,
      createdBy: `${user.fullName} (${user.role === 'kepala_sekolah' ? 'Kepala Sekolah' : 'Super Admin'})`,
      createdRole: user.role,
      createdAt: new Date().toISOString(),
      description: data.description || 'Periode penjaminan mutu SPMI SMK Negeri 2 Magelang yang ditetapkan resmi oleh Kepala Sekolah.'
    };

    this.periodes = [newPeriode, ...this.periodes];
    this.persist('sintesa_periodes', this.periodes);

    this.addLog(
      'CREATE_PERIODE',
      'Periode Mutu',
      newPeriode.code,
      `Kepala Sekolah menetapkan periode mutu baru: "${newPeriode.name}" (Target Capaian: ${newPeriode.targetScore}%)`
    );

    return {
      success: true,
      message: `Periode mutu "${newPeriode.name}" berhasil ditetapkan oleh Kepala Sekolah!`,
      periode: newPeriode
    };
  }

  public setActivePeriode(id: string): { success: boolean; message: string } {
    const user = this.getActiveUser();
    if (user.role !== 'kepala_sekolah' && user.role !== 'admin') {
      return {
        success: false,
        message: 'Akses Ditolak: Hanya Kepala Sekolah yang berwenang mengaktifkan periode mutu.'
      };
    }

    const target = this.periodes.find((p) => p.id === id);
    if (!target) {
      return { success: false, message: 'Periode tidak ditemukan.' };
    }

    this.periodes = this.periodes.map((p) => ({
      ...p,
      isActive: p.id === id,
      status: p.id === id ? 'Aktif' : 'Arsip'
    }));
    this.persist('sintesa_periodes', this.periodes);

    this.addLog(
      'ACTIVATE_PERIODE',
      'Periode Mutu',
      target.code,
      `Kepala Sekolah mengaktifkan periode: "${target.name}"`
    );

    return { success: true, message: `Periode "${target.name}" sekarang aktif.` };
  }

  public updatePeriode(id: string, updates: Partial<PeriodeMutu>): PeriodeMutu | null {
    const user = this.getActiveUser();
    if (user.role !== 'kepala_sekolah' && user.role !== 'admin') {
      return null;
    }

    const idx = this.periodes.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    const updated = {
      ...this.periodes[idx],
      ...updates
    };
    this.periodes[idx] = updated;
    this.persist('sintesa_periodes', this.periodes);
    return updated;
  }

  public deletePeriode(id: string): boolean {
    const user = this.getActiveUser();
    if (user.role !== 'kepala_sekolah' && user.role !== 'admin') {
      return false;
    }

    this.periodes = this.periodes.filter((p) => p.id !== id);
    this.persist('sintesa_periodes', this.periodes);
    return true;
  }

  // --- DOKUMEN SPMI: MM, PM, PK, CM (F), REKAP ---
  public canUserManageDocumentCategory(cat: KategoriDokumenMutu): boolean {
    const user = this.getActiveUser();
    if (user.role === 'admin') return true;
    if (cat === 'MM' || cat === 'PM') {
      // MM dan PM khusus Ketua TPMPS
      return user.role === 'tpmps';
    }
    // PK, CM, dan REKAP dapat dikelola oleh seluruh unit kerja
    return true;
  }

  // --- AUDIT LOGS ---
  public getLogs(): ActivityLogItem[] {
    return this.logs;
  }

  public addLog(action: string, entity: string, entityId: string, details: string) {
    const user = this.getActiveUser();
    const newLog: ActivityLogItem = {
      id: `log-${Date.now()}`,
      userId: user?.id || 'system',
      userName: user?.fullName || 'Sistem Penjaminan Mutu',
      roleName: (user?.role || 'admin').toUpperCase(),
      action,
      entity,
      entityId,
      details,
      ipAddress: '192.168.10.50',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    this.logs = [newLog, ...this.logs];
    this.persist('sintesa_logs', this.logs);
  }
}

export const sintesaService = new SintesaDataEngine();
