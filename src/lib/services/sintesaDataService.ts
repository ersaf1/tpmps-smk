'use client';

import {
  UserProfile,
  UnitKerja,
  StandardSNP,
  EvaluasiMutu,
  BuktiDokumen,
  ProgramMutuRTL,
  ActivityLogItem,
  UserRole
} from '@/types/sintesa';

// 18 UNIT KERJA SMK NEGERI 2 MAGELANG
export const INITIAL_UNITS: UnitKerja[] = [
  { id: 'u-01', code: 'WKS-1', name: 'WKS 1 (Bidang Kurikulum)', category: 'Manajemen', picName: 'Dra. Sri Wahyuni, M.Pd.', email: 'kurikulum@smkn2magelang.sch.id', score: 89.5, totalIndicators: 24, completedIndicators: 22 },
  { id: 'u-02', code: 'WKS-2', name: 'WKS 2 (Bidang Kesiswaan)', category: 'Manajemen', picName: 'Bambang Sutrisno, S.Pd.', email: 'kesiswaan@smkn2magelang.sch.id', score: 86.0, totalIndicators: 20, completedIndicators: 18 },
  { id: 'u-03', code: 'WKS-3', name: 'WKS 3 (Bidang Sarana & Prasarana)', category: 'Manajemen', picName: 'Ir. Agus Haryanto, M.T.', email: 'sarpras@smkn2magelang.sch.id', score: 78.4, totalIndicators: 22, completedIndicators: 16 },
  { id: 'u-04', code: 'WKS-4', name: 'WKS 4 (Hubungan Industri & Humas)', category: 'Manajemen', picName: 'Drs. Hendro Wibowo', email: 'humas@smkn2magelang.sch.id', score: 92.0, totalIndicators: 18, completedIndicators: 17 },
  { id: 'u-05', code: 'WKS-SDM', name: 'Bidang Ketenagaan & SDM', category: 'Manajemen', picName: 'Nurul Hidayati, S.Pd.', email: 'sdm@smkn2magelang.sch.id', score: 82.5, totalIndicators: 16, completedIndicators: 14 },
  { id: 'u-06', code: 'PROG-RPL', name: 'Program Keahlian PPLG / RPL', category: 'Kejuruan', picName: 'Eko Prasetyo, S.Kom., M.Cs.', email: 'rpl@smkn2magelang.sch.id', score: 94.2, totalIndicators: 28, completedIndicators: 27 },
  { id: 'u-07', code: 'PROG-TKJ', name: 'Program Keahlian TJKT / TKJ', category: 'Kejuruan', picName: 'Ahmad Fauzi, S.T.', email: 'tkj@smkn2magelang.sch.id', score: 91.0, totalIndicators: 26, completedIndicators: 24 },
  { id: 'u-08', code: 'PROG-AKL', name: 'Program Keahlian Akuntansi (AKL)', category: 'Kejuruan', picName: 'Siti Rahmawati, S.E., M.Akt.', email: 'akl@smkn2magelang.sch.id', score: 88.0, totalIndicators: 25, completedIndicators: 22 },
  { id: 'u-09', code: 'PROG-OTKP', name: 'Program Keahlian Manajemen Perkantoran (MPLB)', category: 'Kejuruan', picName: 'Dewi Lestari, S.Pd.', email: 'mplb@smkn2magelang.sch.id', score: 87.5, totalIndicators: 24, completedIndicators: 21 },
  { id: 'u-10', code: 'PROG-BDP', name: 'Program Keahlian Pemasaran (BDP)', category: 'Kejuruan', picName: 'Rudi Hartono, S.E.', email: 'bdp@smkn2magelang.sch.id', score: 85.0, totalIndicators: 22, completedIndicators: 19 },
  { id: 'u-11', code: 'BENGKEL', name: 'Unit Pengelola Bengkel & Lab Komputer', category: 'Layanan', picName: 'Supriyanto, A.Md.', email: 'lab@smkn2magelang.sch.id', score: 83.0, totalIndicators: 15, completedIndicators: 12 },
  { id: 'u-12', code: 'PERPUS', name: 'Unit Perpustakaan Digital', category: 'Layanan', picName: 'Tri Utami, S.I.Pust.', email: 'perpustakaan@smkn2magelang.sch.id', score: 90.0, totalIndicators: 14, completedIndicators: 13 },
  { id: 'u-13', code: 'BKK', name: 'Bursa Kerja Khusus (BKK Magelang)', category: 'Layanan', picName: 'Wahyu Nugroho, S.Pd.', email: 'bkk@smkn2magelang.sch.id', score: 93.5, totalIndicators: 18, completedIndicators: 17 },
  { id: 'u-14', code: 'BK', name: 'Unit Bimbingan Konseling (BK)', category: 'Layanan', picName: 'Dra. Endang Sulastri', email: 'bk@smkn2magelang.sch.id', score: 89.0, totalIndicators: 16, completedIndicators: 15 },
  { id: 'u-15', code: 'TEFA', name: 'Unit Produksi & Teaching Factory (TEFA)', category: 'Kejuruan', picName: 'Anwar Sadat, S.T.', email: 'tefa@smkn2magelang.sch.id', score: 86.8, totalIndicators: 20, completedIndicators: 17 },
  { id: 'u-16', code: 'LSP', name: 'Lembaga Sertifikasi Profesi (LSP-P1)', category: 'Pengawasan', picName: 'Drs. Maryanto, M.M.', email: 'lsp@smkn2magelang.sch.id', score: 95.0, totalIndicators: 22, completedIndicators: 21 },
  { id: 'u-17', code: 'TU-KEU', name: 'Tata Usaha & Keuangan Sekolah', category: 'Layanan', picName: 'Sri Mulyani, S.Ak.', email: 'tu@smkn2magelang.sch.id', score: 87.6, totalIndicators: 18, completedIndicators: 16 },
  { id: 'u-18', code: 'SPI', name: 'Satuan Pengawas Internal (SPI)', category: 'Pengawasan', picName: 'H. Suwandi, S.Pd., M.M.', email: 'spi@smkn2magelang.sch.id', score: 92.5, totalIndicators: 16, completedIndicators: 15 }
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
    fullName: 'Rian Prasetyo, S.Kom. (Admin)',
    email: 'admin.sintesa@smkn2magelang.sch.id',
    role: 'admin',
    unitId: 'u-18',
    unitName: 'Satuan Pengawas Internal (SPI)',
    avatarUrl: '/avatar-admin.png',
    phone: '081234567890',
    isActive: true,
    createdAt: '2025-01-10T08:00:00Z'
  },
  kepala_sekolah: {
    id: 'usr-kepsek-01',
    nip: '196803121992031004',
    fullName: 'Drs. H. Mulyono, M.Pd.',
    email: 'kepala.sekolah@smkn2magelang.sch.id',
    role: 'kepala_sekolah',
    avatarUrl: '/avatar-kepsek.png',
    phone: '081198765432',
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  },
  tpmps: {
    id: 'usr-tpmps-01',
    nip: '197509182002122001',
    fullName: 'Dra. Hj. Siti Fatimah, M.M. (Ketua TPMPS)',
    email: 'tpmps.ketua@smkn2magelang.sch.id',
    role: 'tpmps',
    avatarUrl: '/avatar-tpmps.png',
    phone: '081328901234',
    isActive: true,
    createdAt: '2024-02-15T08:00:00Z'
  },
  guru: {
    id: 'usr-guru-01',
    nip: '198711052011011008',
    fullName: 'Budi Santoso, S.Pd. (WKS Kurikulum)',
    email: 'budi.santoso@smkn2magelang.sch.id',
    role: 'guru',
    unitId: 'u-01',
    unitName: 'WKS 1 (Bidang Kurikulum)',
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

// INITIAL DOCUMENTS
export const INITIAL_DOCUMENTS: BuktiDokumen[] = [
  {
    id: 'doc-001',
    code: 'DOC-SKL-001',
    title: 'SK Penetapan Kelulusan Uji Sertifikasi LSP-P1 Tahun 2025',
    fileName: 'SK_LSP_P1_Kelulusan_2025.pdf',
    fileUrl: '/storage/documents/sk_lsp_p1_2025.pdf',
    fileSize: '3.4 MB',
    fileType: 'pdf',
    standardId: 1,
    standardName: 'Standar Kompetensi Lulusan',
    unitId: 'u-16',
    unitName: 'Lembaga Sertifikasi Profesi (LSP-P1)',
    version: 'v1.0',
    status: 'Terverifikasi',
    notes: 'SK resmi ditandatangani Kepala Sekolah & Ketua LSP.',
    uploadedBy: 'usr-guru-01',
    uploadedByName: 'Budi Santoso, S.Pd.',
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
    standardId: 2,
    standardName: 'Standar Isi',
    unitId: 'u-01',
    unitName: 'WKS 1 (Bidang Kurikulum)',
    version: 'v2.1',
    status: 'Terverifikasi',
    notes: 'Disertai daftar hadir perwakilan IDUKA.',
    uploadedBy: 'usr-guru-01',
    uploadedByName: 'Budi Santoso, S.Pd.',
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
    notes: 'Dokumentasi serah terima aplikasi kasir POS dan website katalog.',
    uploadedBy: 'usr-guru-01',
    uploadedByName: 'Budi Santoso, S.Pd.',
    createdAt: '2025-09-16T16:00:00Z',
    updatedAt: '2025-09-16T16:00:00Z'
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
  private activeUser: UserProfile | null = null;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') {
      this.evaluations = [...INITIAL_EVALUATIONS];
      this.documents = [...INITIAL_DOCUMENTS];
      this.rtlList = [...INITIAL_RTL];
      this.logs = [...INITIAL_LOGS];
      return;
    }

    try {
      const savedEvals = localStorage.getItem('sintesa_evaluations');
      this.evaluations = savedEvals ? JSON.parse(savedEvals) : [...INITIAL_EVALUATIONS];

      const savedDocs = localStorage.getItem('sintesa_documents');
      this.documents = savedDocs ? JSON.parse(savedDocs) : [...INITIAL_DOCUMENTS];

      const savedRtl = localStorage.getItem('sintesa_rtl');
      this.rtlList = savedRtl ? JSON.parse(savedRtl) : [...INITIAL_RTL];

      const savedLogs = localStorage.getItem('sintesa_logs');
      this.logs = savedLogs ? JSON.parse(savedLogs) : [...INITIAL_LOGS];

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
      this.activeUser = null;
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
  public getActiveUser(): UserProfile | null {
    if (!this.activeUser && typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('sintesa_auth_user');
      if (savedUser) {
        try {
          this.activeUser = JSON.parse(savedUser);
        } catch {
          this.activeUser = null;
        }
      }
    }
    return this.activeUser;
  }

  public setActiveUser(user: UserProfile | null) {
    this.activeUser = user;
    if (user) {
      this.persist('sintesa_auth_user', user);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('sintesa_auth_user');
    }
  }

  public logout() {
    this.activeUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sintesa_auth_user');
      document.cookie = 'sintesa_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0';
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
    return INITIAL_UNITS;
  }

  public getUnitById(id: string): UnitKerja | undefined {
    return INITIAL_UNITS.find((u) => u.id === id);
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
