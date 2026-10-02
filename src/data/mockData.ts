import {
  UserProfile,
  UnitKerja,
  StandardSNP,
  IndikatorMutu,
  EvaluasiMutu,
  BuktiDokumen,
  ProgramMutuRTL,
  AuditLogItem
} from '@/types/tpmps';

export const ALL_UNIT_ACCOUNTS: UserProfile[] = [
  {
    id: 'u-admin-01',
    name: 'Super Admin (Otoritas Penuh)',
    email: 'admin@gmail.com',
    password: 'smk12345',
    role: 'admin',
    nip: '19900219 201503 1 002',
    phone: '0819-9988-7766'
  },
  {
    id: 'u-unit-01',
    name: 'Rudi Wijaya, S.Pd., M.M.',
    email: 'unit1@gmail.com',
    password: 'smk12345',
    role: 'unit_kerja',
    unitId: 'unit-kurikulum',
    unitName: 'WKS 1 Bidang Kurikulum',
    nip: '19791104 200501 1 009',
    phone: '0815-6677-8899'
  },
  {
    id: 'u-unit-02',
    name: 'Haryanto, S.Pd.',
    email: 'unit2@gmail.com',
    password: 'smk12345',
    role: 'unit_kerja',
    unitId: 'unit-kesiswaan',
    unitName: 'WKS 2 Bidang Kesiswaan',
    nip: '19800315 200604 1 012',
    phone: '0812-4455-8899'
  },
  {
    id: 'u-unit-03',
    name: 'Ir. Agus Santoso',
    email: 'unit3@gmail.com',
    password: 'smk12345',
    role: 'unit_kerja',
    unitId: 'unit-sarpras',
    unitName: 'WKS 3 Bidang Sarana & Prasarana',
    nip: '19740620 200003 1 005',
    phone: '0818-5566-7788'
  },
  {
    id: 'u-unit-04',
    name: 'Dewi Sartika, S.T., M.Eng.',
    email: 'unit4@gmail.com',
    password: 'smk12345',
    role: 'unit_kerja',
    unitId: 'unit-hubin',
    unitName: 'WKS 4 Hubungan Industri & BKK',
    nip: '19820412 200801 2 015',
    phone: '0817-4455-6677'
  },
  {
    id: 'u-unit-05',
    name: 'Sri Rahayu, S.Sos.',
    email: 'unit5@gmail.com',
    password: 'smk12345',
    role: 'unit_kerja',
    unitId: 'unit-tu',
    unitName: 'Tata Usaha & Kepegawaian',
    nip: '19840210 200901 2 008',
    phone: '0813-2211-9988'
  },
  {
    id: 'u-unit-06',
    name: 'Dra. Nurhayati, M.Si.',
    email: 'unit6@gmail.com',
    password: 'smk12345',
    role: 'unit_kerja',
    unitId: 'unit-bk',
    unitName: 'Bimbingan Konseling (BK)',
    nip: '19710814 199702 2 001',
    phone: '0852-7788-1122'
  },
  {
    id: 'u-unit-07',
    name: 'Endang Setiawati, S.I.Pust.',
    email: 'unit7@gmail.com',
    password: 'smk12345',
    role: 'unit_kerja',
    unitId: 'unit-perpustakaan',
    unitName: 'Perpustakaan Digital Sekolah',
    nip: '19870503 201101 2 014',
    phone: '0856-4433-2211'
  },
  {
    id: 'u-unit-08',
    name: 'Kurniawan, S.T.',
    email: 'unit8@gmail.com',
    password: 'smk12345',
    role: 'unit_kerja',
    unitId: 'unit-lab',
    unitName: 'Laboratorium & Bengkel Komputer',
    nip: '19890919 201402 1 003',
    phone: '0878-1122-4455'
  },
  {
    id: 'u-unit-09',
    name: 'Eko Prasetyo, M.Kom.',
    email: 'unit9@gmail.com',
    password: 'smk12345',
    role: 'unit_kerja',
    unitId: 'unit-pplg',
    unitName: 'Kaprodi PPLG (RPL / Software)',
    nip: '19860128 201001 1 018',
    phone: '0812-9900-1122'
  },
  {
    id: 'u-unit-10',
    name: 'Wahyu Nugroho, S.T.',
    email: 'unit10@gmail.com',
    password: 'smk12345',
    role: 'unit_kerja',
    unitId: 'unit-tjkt',
    unitName: 'Kaprodi TJKT (Jaringan & Telco)',
    nip: '19830711 200803 1 006',
    phone: '0813-8877-6655'
  },
  {
    id: 'u-unit-11',
    name: 'Maya Safitri, M.Ds.',
    email: 'unit11@gmail.com',
    password: 'smk12345',
    role: 'unit_kerja',
    unitId: 'unit-dkv',
    unitName: 'Kaprodi Desain Komunikasi Visual',
    nip: '19910419 201903 2 021',
    phone: '0857-3322-1144'
  },
  {
    id: 'u-unit-12',
    name: 'Tri Wahyuni, S.Pd.',
    email: 'unit12@gmail.com',
    password: 'smk12345',
    role: 'unit_kerja',
    unitId: 'unit-mplb',
    unitName: 'Kaprodi Manajemen Perkantoran (MPLB)',
    nip: '19881205 201201 2 009',
    phone: '0812-3344-5566'
  },
  {
    id: 'u-unit-13',
    name: 'Retno Wulandari, S.E., Ak.',
    email: 'unit13@gmail.com',
    password: 'smk12345',
    role: 'unit_kerja',
    unitId: 'unit-akl',
    unitName: 'Kaprodi Akuntansi & Keuangan (AKL)',
    nip: '19850614 201001 2 011',
    phone: '0815-7788-9900'
  },
  {
    id: 'u-unit-14',
    name: 'Budi Darmawan, S.Pd., M.T.',
    email: 'unit14@gmail.com',
    password: 'smk12345',
    role: 'unit_kerja',
    unitId: 'unit-tkr',
    unitName: 'Kaprodi Teknik Kendaraan Ringan (TKR)',
    nip: '19780322 200312 1 004',
    phone: '0818-9900-1133'
  },
  {
    id: 'u-unit-15',
    name: 'Farhan Maulana, S.T.',
    email: 'unit15@gmail.com',
    password: 'smk12345',
    role: 'unit_kerja',
    unitId: 'unit-tefa',
    unitName: 'Unit Produksi & Teaching Factory (TeFa)',
    nip: '19930217 202012 1 005',
    phone: '0877-6655-4433'
  },
  {
    id: 'u-unit-16',
    name: 'Dr. Surya Adi, M.Pd.',
    email: 'unit16@gmail.com',
    password: 'smk12345',
    role: 'unit_kerja',
    unitId: 'unit-lsp',
    unitName: 'Lembaga Sertifikasi Profesi (LSP P-1)',
    nip: '19750912 200112 1 002',
    phone: '0812-6677-8899'
  },
  {
    id: 'u-unit-17',
    name: 'Drs. H. Mulyadi, M.M.',
    email: 'unit17@gmail.com',
    password: 'smk12345',
    role: 'unit_kerja',
    unitId: 'unit-spi',
    unitName: 'Satuan Pengawas Internal (SPI)',
    nip: '19690410 199503 1 003',
    phone: '0811-3344-5566'
  },
  {
    id: 'u-unit-18',
    name: 'Dr. Indah Permata, M.T.',
    email: 'unit18@gmail.com',
    password: 'smk12345',
    role: 'unit_kerja',
    unitId: 'unit-tpmps-int',
    unitName: 'Sekretariat TPMPS Internal',
    nip: '19760824 200212 2 003',
    phone: '0813-9876-5432'
  }
];

export const DEMO_USERS: Record<string, UserProfile> = {
  kepala_sekolah: {
    id: 'u-ks-01',
    name: 'Drs. H. Bambang Hartono, M.Pd.',
    email: 'kepsek@smk-unggul.sch.id',
    password: 'smk12345',
    role: 'kepala_sekolah',
    nip: '19680512 199403 1 004',
    phone: '0812-3456-7890',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  ketua_tpmps: {
    id: 'u-tpmps-01',
    name: 'Dr. Indah Permata, S.Pd., M.T.',
    email: 'indah.tpmps@smk-unggul.sch.id',
    password: 'smk12345',
    role: 'ketua_tpmps',
    unitId: 'unit-tpmps-int',
    unitName: 'Sekretariat TPMPS Internal',
    nip: '19760824 200212 2 003',
    phone: '0813-9876-5432',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  anggota_tpmps: {
    id: 'u-tpmps-02',
    name: 'Ahmad Fauzi, S.Kom., M.Kom.',
    email: 'fauzi.audit@smk-unggul.sch.id',
    password: 'smk12345',
    role: 'anggota_tpmps',
    unitId: 'unit-tpmps-int',
    unitName: 'Sekretariat TPMPS Internal',
    nip: '19850315 200902 1 007',
    phone: '0811-2233-4455'
  },
  unit_kerja: {
    id: 'u-unit-01',
    name: 'Rudi Wijaya, S.Pd., M.M.',
    email: 'unit1@gmail.com',
    password: 'smk12345',
    role: 'unit_kerja',
    unitId: 'unit-kurikulum',
    unitName: 'WKS 1 Bidang Kurikulum',
    nip: '19791104 200501 1 009',
    phone: '0815-6677-8899'
  },
  guru: {
    id: 'u-guru-01',
    name: 'Siti Nurhaliza, S.Pd.',
    email: 'siti.nur@smk-unggul.sch.id',
    password: 'smk12345',
    role: 'guru',
    unitId: 'unit-kurikulum',
    unitName: 'WKS 1 Bidang Kurikulum',
    nip: '19920110 201802 2 001',
    phone: '0857-1122-3344'
  },
  admin: {
    id: 'u-admin-01',
    name: 'Dimas Prasetyo (Super Admin)',
    email: 'admin@gmail.com',
    password: 'smk12345',
    role: 'admin',
    nip: '19900219 201503 1 002',
    phone: '0819-9988-7766'
  },
  // Mapping unit accounts:
  unit_1: ALL_UNIT_ACCOUNTS[1],
  unit_2: ALL_UNIT_ACCOUNTS[2],
  unit_3: ALL_UNIT_ACCOUNTS[3],
  unit_4: ALL_UNIT_ACCOUNTS[4],
  unit_5: ALL_UNIT_ACCOUNTS[5],
  unit_6: ALL_UNIT_ACCOUNTS[6],
  unit_7: ALL_UNIT_ACCOUNTS[7],
  unit_8: ALL_UNIT_ACCOUNTS[8],
  unit_9: ALL_UNIT_ACCOUNTS[9],
  unit_10: ALL_UNIT_ACCOUNTS[10],
  unit_11: ALL_UNIT_ACCOUNTS[11],
  unit_12: ALL_UNIT_ACCOUNTS[12],
  unit_13: ALL_UNIT_ACCOUNTS[13],
  unit_14: ALL_UNIT_ACCOUNTS[14],
  unit_15: ALL_UNIT_ACCOUNTS[15],
  unit_16: ALL_UNIT_ACCOUNTS[16],
  unit_17: ALL_UNIT_ACCOUNTS[17],
  unit_18: ALL_UNIT_ACCOUNTS[18],
  // Email-based direct lookups:
  'admin@gmail.com': ALL_UNIT_ACCOUNTS[0],
  'unit1@gmail.com': ALL_UNIT_ACCOUNTS[1],
  'unit2@gmail.com': ALL_UNIT_ACCOUNTS[2],
  'unit3@gmail.com': ALL_UNIT_ACCOUNTS[3],
  'unit4@gmail.com': ALL_UNIT_ACCOUNTS[4],
  'unit5@gmail.com': ALL_UNIT_ACCOUNTS[5],
  'unit6@gmail.com': ALL_UNIT_ACCOUNTS[6],
  'unit7@gmail.com': ALL_UNIT_ACCOUNTS[7],
  'unit8@gmail.com': ALL_UNIT_ACCOUNTS[8],
  'unit9@gmail.com': ALL_UNIT_ACCOUNTS[9],
  'unit10@gmail.com': ALL_UNIT_ACCOUNTS[10],
  'unit11@gmail.com': ALL_UNIT_ACCOUNTS[11],
  'unit12@gmail.com': ALL_UNIT_ACCOUNTS[12],
  'unit13@gmail.com': ALL_UNIT_ACCOUNTS[13],
  'unit14@gmail.com': ALL_UNIT_ACCOUNTS[14],
  'unit15@gmail.com': ALL_UNIT_ACCOUNTS[15],
  'unit16@gmail.com': ALL_UNIT_ACCOUNTS[16],
  'unit17@gmail.com': ALL_UNIT_ACCOUNTS[17],
  'unit18@gmail.com': ALL_UNIT_ACCOUNTS[18]
};

export const UNIT_KERJA_LIST: UnitKerja[] = [
  {
    id: 'unit-kurikulum',
    code: 'WKS-KUR',
    name: 'WKS 1 Bidang Kurikulum',
    category: 'Manajemen',
    picUserId: 'u-unit-01',
    pic: 'Rudi Wijaya, S.Pd., M.M.',
    email: 'unit1@gmail.com',
    score: 92.5,
    totalIndicators: 18,
    completedIndicators: 18,
    status: 'Unggul'
  },
  {
    id: 'unit-kesiswaan',
    code: 'WKS-KES',
    name: 'WKS 2 Bidang Kesiswaan',
    category: 'Manajemen',
    picUserId: 'u-unit-02',
    pic: 'Haryanto, S.Pd.',
    email: 'unit2@gmail.com',
    score: 87.2,
    totalIndicators: 15,
    completedIndicators: 14,
    status: 'Unggul'
  },
  {
    id: 'unit-sarpras',
    code: 'WKS-SAR',
    name: 'WKS 3 Bidang Sarana & Prasarana',
    category: 'Manajemen',
    picUserId: 'u-unit-03',
    pic: 'Ir. Agus Santoso',
    email: 'unit3@gmail.com',
    score: 81.4,
    totalIndicators: 16,
    completedIndicators: 13,
    status: 'Baik'
  },
  {
    id: 'unit-hubin',
    code: 'WKS-HUB',
    name: 'WKS 4 Hubungan Industri & BKK',
    category: 'Manajemen',
    picUserId: 'u-unit-04',
    pic: 'Dewi Sartika, S.T., M.Eng.',
    email: 'unit4@gmail.com',
    score: 94.0,
    totalIndicators: 14,
    completedIndicators: 14,
    status: 'Unggul'
  },
  {
    id: 'unit-tu',
    code: 'TU-ADM',
    name: 'Tata Usaha & Kepegawaian',
    category: 'Layanan',
    picUserId: 'u-unit-05',
    pic: 'Sri Rahayu, S.Sos.',
    email: 'unit5@gmail.com',
    score: 86.8,
    totalIndicators: 12,
    completedIndicators: 11,
    status: 'Unggul'
  },
  {
    id: 'unit-bk',
    code: 'BK-KON',
    name: 'Bimbingan Konseling (BK)',
    category: 'Layanan',
    picUserId: 'u-unit-06',
    pic: 'Dra. Nurhayati, M.Si.',
    email: 'unit6@gmail.com',
    score: 89.0,
    totalIndicators: 10,
    completedIndicators: 10,
    status: 'Unggul'
  },
  {
    id: 'unit-perpustakaan',
    code: 'PERPUS',
    name: 'Perpustakaan Digital Sekolah',
    category: 'Layanan',
    picUserId: 'u-unit-07',
    pic: 'Endang Setiawati, S.I.Pust.',
    email: 'unit7@gmail.com',
    score: 79.5,
    totalIndicators: 9,
    completedIndicators: 7,
    status: 'Baik'
  },
  {
    id: 'unit-lab',
    code: 'LAB-KOM',
    name: 'Laboratorium & Bengkel Komputer',
    category: 'Layanan',
    picUserId: 'u-unit-08',
    pic: 'Kurniawan, S.T.',
    email: 'unit8@gmail.com',
    score: 85.0,
    totalIndicators: 11,
    completedIndicators: 10,
    status: 'Baik'
  },
  {
    id: 'unit-pplg',
    code: 'PRODI-PPLG',
    name: 'Kaprodi PPLG (RPL / Software)',
    category: 'Kejuruan',
    picUserId: 'u-unit-09',
    pic: 'Eko Prasetyo, M.Kom.',
    email: 'unit9@gmail.com',
    score: 95.2,
    totalIndicators: 16,
    completedIndicators: 16,
    status: 'Unggul'
  },
  {
    id: 'unit-tjkt',
    code: 'PRODI-TJKT',
    name: 'Kaprodi TJKT (Jaringan & Telco)',
    category: 'Kejuruan',
    picUserId: 'u-unit-10',
    pic: 'Wahyu Nugroho, S.T.',
    email: 'unit10@gmail.com',
    score: 91.0,
    totalIndicators: 16,
    completedIndicators: 15,
    status: 'Unggul'
  },
  {
    id: 'unit-dkv',
    code: 'PRODI-DKV',
    name: 'Kaprodi Desain Komunikasi Visual',
    category: 'Kejuruan',
    picUserId: 'u-unit-11',
    pic: 'Maya Safitri, M.Ds.',
    email: 'unit11@gmail.com',
    score: 88.5,
    totalIndicators: 15,
    completedIndicators: 14,
    status: 'Unggul'
  },
  {
    id: 'unit-mplb',
    code: 'PRODI-MPLB',
    name: 'Kaprodi Manajemen Perkantoran (MPLB)',
    category: 'Kejuruan',
    picUserId: 'u-unit-12',
    pic: 'Tri Wahyuni, S.Pd.',
    email: 'unit12@gmail.com',
    score: 87.0,
    totalIndicators: 14,
    completedIndicators: 13,
    status: 'Unggul'
  },
  {
    id: 'unit-akl',
    code: 'PRODI-AKL',
    name: 'Kaprodi Akuntansi & Keuangan (AKL)',
    category: 'Kejuruan',
    picUserId: 'u-unit-13',
    pic: 'Retno Wulandari, S.E., Ak.',
    email: 'unit13@gmail.com',
    score: 86.4,
    totalIndicators: 14,
    completedIndicators: 13,
    status: 'Unggul'
  },
  {
    id: 'unit-tkr',
    code: 'PRODI-TKR',
    name: 'Kaprodi Teknik Kendaraan Ringan (TKR)',
    category: 'Kejuruan',
    picUserId: 'u-unit-14',
    pic: 'Budi Darmawan, S.Pd., M.T.',
    email: 'unit14@gmail.com',
    score: 83.2,
    totalIndicators: 15,
    completedIndicators: 12,
    status: 'Baik'
  },
  {
    id: 'unit-tefa',
    code: 'UNIT-PROD',
    name: 'Unit Produksi & Teaching Factory (TeFa)',
    category: 'Kejuruan',
    picUserId: 'u-unit-15',
    pic: 'Farhan Maulana, S.T.',
    email: 'unit15@gmail.com',
    score: 88.0,
    totalIndicators: 12,
    completedIndicators: 11,
    status: 'Unggul'
  },
  {
    id: 'unit-lsp',
    code: 'LSP-P1',
    name: 'Lembaga Sertifikasi Profesi (LSP P-1)',
    category: 'Layanan',
    picUserId: 'u-unit-16',
    pic: 'Dr. Surya Adi, M.Pd.',
    email: 'unit16@gmail.com',
    score: 93.0,
    totalIndicators: 10,
    completedIndicators: 10,
    status: 'Unggul'
  },
  {
    id: 'unit-spi',
    code: 'SPI-PEN',
    name: 'Satuan Pengawas Internal (SPI)',
    category: 'Pengawasan',
    picUserId: 'u-unit-17',
    pic: 'Drs. H. Mulyadi, M.M.',
    email: 'unit17@gmail.com',
    score: 89.6,
    totalIndicators: 8,
    completedIndicators: 8,
    status: 'Unggul'
  },
  {
    id: 'unit-tpmps-int',
    code: 'TPMPS-INT',
    name: 'Sekretariat TPMPS Internal',
    category: 'Pengawasan',
    picUserId: 'u-unit-18',
    pic: 'Dr. Indah Permata, M.T.',
    email: 'unit18@gmail.com',
    score: 96.0,
    totalIndicators: 8,
    completedIndicators: 8,
    status: 'Unggul'
  }
];

export const STANDAR_SNP_LIST: StandardSNP[] = [
  {
    id: 1,
    code: 'SNP-1',
    name: 'Standar Kompetensi Lulusan (SKL)',
    description: 'Pencapaian kompetensi sikap, pengetahuan, dan keterampilan kejuruan serta keterserapan kerja (BMW: Bekerja, Melanjutkan, Wirausaha).',
    weight: 15,
    targetScore: 90,
    currentScore: 92.4,
    iconName: 'GraduationCap'
  },
  {
    id: 2,
    code: 'SNP-2',
    name: 'Standar Isi',
    description: 'Penyelarasan kurikulum berbasis industri, muatan kurikulum merdeka, dan silabus kompetensi berbasis KKNI.',
    weight: 12,
    targetScore: 90,
    currentScore: 93.1,
    iconName: 'BookOpen'
  },
  {
    id: 3,
    code: 'SNP-3',
    name: 'Standar Proses',
    description: 'Pelaksanaan pembelajaran berbasis Teaching Factory (TeFa), Project-Based Learning (PjBL), dan Praktik Kerja Lapangan (PKL).',
    weight: 15,
    targetScore: 88,
    currentScore: 87.8,
    iconName: 'Cpu'
  },
  {
    id: 4,
    code: 'SNP-4',
    name: 'Standar Penilaian Pendidikan',
    description: 'Uji Kompetensi Keahlian (UKK) bersertifikat BNSP, asesmen diagnostik, formatif, dan sumatif terintegrasi.',
    weight: 12,
    targetScore: 85,
    currentScore: 89.5,
    iconName: 'CheckSquare'
  },
  {
    id: 5,
    code: 'SNP-5',
    name: 'Standar Pendidik & Tenaga Kependidikan',
    description: 'Sertifikasi kompetensi guru kejuruan, magang industri guru, pemenuhan kualifikasi akademik minimal S1/D4.',
    weight: 14,
    targetScore: 85,
    currentScore: 83.2,
    iconName: 'Users'
  },
  {
    id: 6,
    code: 'SNP-6',
    name: 'Standar Sarana & Prasarana',
    description: 'Kelayakan ruang bengkel/lab industri, rasio alat praktik per siswa, pemeliharaan sarana berkala, K3LH.',
    weight: 12,
    targetScore: 85,
    currentScore: 80.6,
    iconName: 'Building'
  },
  {
    id: 7,
    code: 'SNP-7',
    name: 'Standar Pengelolaan',
    description: 'Rencana Kerja Jangka Menengah (RKJM), RKT, implementasi sistem informasi manajemen mutu digital terpusat.',
    weight: 10,
    targetScore: 90,
    currentScore: 91.0,
    iconName: 'Sliders'
  },
  {
    id: 8,
    code: 'SNP-8',
    name: 'Standar Pembiayaan',
    description: 'Alokasi anggaran peningkatan mutu, efisiensi BOS/BOPD, transparansi pelaporan keuangan, dan dana Teaching Factory.',
    weight: 10,
    targetScore: 85,
    currentScore: 88.0,
    iconName: 'Wallet'
  }
];

export const INDIKATOR_MUTU_LIST: IndikatorMutu[] = [
  {
    id: 'ind-101',
    code: 'SKL-1.1',
    standardId: 1, // FK -> StandardSNP (SKL)
    standardName: 'Standar Kompetensi Lulusan (SKL)',
    name: 'Keterserapan Lulusan SMK (BMW)',
    description: 'Persentase lulusan yang terserap Bekerja, Melanjutkan studi, atau Wirausaha dalam kurun waktu 6 bulan setelah kelulusan (target minimal 85%).',
    unitResponsible: ['unit-hubin', 'unit-pplg', 'unit-tjkt', 'unit-dkv', 'unit-mplb', 'unit-akl', 'unit-tkr'],
    bobot: 40,
    target: 88,
    skala: '0 - 100%',
    evidenceRequired: ['Laporan Tracer Study BKK', 'Rekap MoU & SPK Kerja', 'Data Mahasiswa Lanjutan', 'Portofolio Wirausaha Mandiri']
  },
  {
    id: 'ind-102',
    code: 'SKL-1.2',
    standardId: 1, // FK -> StandardSNP (SKL)
    standardName: 'Standar Kompetensi Lulusan (SKL)',
    name: 'Sertifikasi Kompetensi BNSP / LSP P-1',
    description: 'Proporsi siswa tingkat akhir yang lulus Uji Kompetensi Keahlian (UKK) dan meraih sertifikat kompetensi berlogo Garuda BNSP.',
    unitResponsible: ['unit-lsp', 'unit-kurikulum', 'unit-pplg', 'unit-tjkt', 'unit-tkr'],
    bobot: 35,
    target: 92,
    skala: '0 - 100%',
    evidenceRequired: ['SK Penetapan Asesor LSP', 'Berita Acara UKK', 'Daftar Terbitan Sertifikat BNSP']
  },
  {
    id: 'ind-103',
    code: 'SKL-1.3',
    standardId: 1, // FK -> StandardSNP (SKL)
    standardName: 'Standar Kompetensi Lulusan (SKL)',
    name: 'Prestasi Siswa Tingkat Provinsi / Nasional (LKS & Non-Akademik)',
    description: 'Jumlah capaian juara dalam ajang Lomba Kompetensi Siswa (LKS), O2SN, FLS2N tingkat regional hingga nasional.',
    unitResponsible: ['unit-kesiswaan'],
    bobot: 25,
    target: 10,
    skala: 'Jumlah Penghargaan',
    evidenceRequired: ['Piagam Penghargaan', 'SK Kontingen Siswa', 'Dokumentasi Penyerahan Juara']
  },
  {
    id: 'ind-201',
    code: 'ISI-2.1',
    standardId: 2, // FK -> StandardSNP (Standar Isi)
    standardName: 'Standar Isi',
    name: 'Penyelarasan Kurikulum Bersama Industri (IDUKA)',
    description: 'Tersedianya dokumen kurikulum operasional sekolah (KOSP) yang telah disinkronisasi dan disahkan oleh mitra industri resmi minimal 2 DUDI per jurusan.',
    unitResponsible: ['unit-kurikulum', 'unit-hubin', 'unit-pplg', 'unit-tjkt'],
    bobot: 50,
    target: 100,
    skala: '0 - 100%',
    evidenceRequired: ['Berita Acara Sinkronisasi', 'Naskah Kurikulum Bersama', 'Tanda Tangan Pengesahan Mitra Industri']
  },
  {
    id: 'ind-202',
    code: 'ISI-2.2',
    standardId: 2, // FK -> StandardSNP (Standar Isi)
    standardName: 'Standar Isi',
    name: 'Muatan Soft Skills & Budaya Kerja 5R/K3',
    description: 'Integrasi materi soft skills, etika kerja, budaya 5R (Ringkas, Rapi, Resik, Rawat, Rajin) ke dalam modul ajar seluruh mata pelajaran kejuruan.',
    unitResponsible: ['unit-kurikulum', 'unit-kesiswaan'],
    bobot: 50,
    target: 90,
    skala: '0 - 100%',
    evidenceRequired: ['Modul Ajar Pembiasaan Budaya Kerja', 'Jurnal Penerapan 5R di Bengkel']
  },
  {
    id: 'ind-301',
    code: 'PRO-3.1',
    standardId: 3, // FK -> StandardSNP (Standar Proses)
    standardName: 'Standar Proses',
    name: 'Penerapan Pembelajaran TeFa (Teaching Factory)',
    description: 'Persentase jam praktik kejuruan yang menggunakan model Teaching Factory berorientasi produk/layanan nyata bernilai pasar.',
    unitResponsible: ['unit-tefa', 'unit-pplg', 'unit-tjkt', 'unit-dkv', 'unit-tkr'],
    bobot: 45,
    target: 80,
    skala: '0 - 100%',
    evidenceRequired: ['SOP Teaching Factory', 'Katalog Produk/Jasa TeFa', 'Order Order Kerja Siswa', 'Invoice Penjualan TeFa']
  },
  {
    id: 'ind-302',
    code: 'PRO-3.2',
    standardId: 3, // FK -> StandardSNP (Standar Proses)
    standardName: 'Standar Proses',
    name: 'Kualitas & Durasi Pelaksanaan PKL (Praktik Kerja Lapangan)',
    description: 'Pelaksanaan PKL minimal 6 bulan sesuai standar Permendikbud dengan monitoring terjadwal dan pembimbing industri.',
    unitResponsible: ['unit-hubin', 'unit-kurikulum'],
    bobot: 55,
    target: 95,
    skala: '0 - 100%',
    evidenceRequired: ['Jurnal Digital PKL', 'Lembar Monitoring Berkala', 'Sertifikat PKL dari Industri']
  },
  {
    id: 'ind-501',
    code: 'PTK-5.1',
    standardId: 5, // FK -> StandardSNP (Standar PTK)
    standardName: 'Standar Pendidik & Tenaga Kependidikan',
    name: 'Sertifikasi Kompetensi Kejuruan & Magang Guru di Industri',
    description: 'Persentase guru kejuruan produktif yang bersertifikat asesor kompetensi / sertifikasi teknis industri dan menyelesaikan magang industri minimal 1 bulan.',
    unitResponsible: ['unit-tu', 'unit-kurikulum'],
    bobot: 50,
    target: 85,
    skala: '0 - 100%',
    evidenceRequired: ['Sertifikat Teknis Industri Guru', 'Surat Tugas & Laporan Magang Guru Industri', 'Sertifikat Asesor BNSP']
  },
  {
    id: 'ind-601',
    code: 'SAR-6.1',
    standardId: 6, // FK -> StandardSNP (Standar Sarpras)
    standardName: 'Standar Sarana & Prasarana',
    name: 'Modernisasi Peralatan Praktik Sesuai Standar Industri 4.0',
    description: 'Ketersediaan rasio mesin, workstation, dan perangkat bengkel berbanding jumlah siswa praktik maksimal 1:2 sesuai standar DUDI modern.',
    unitResponsible: ['unit-sarpras', 'unit-lab', 'unit-tkr', 'unit-tjkt', 'unit-pplg'],
    bobot: 60,
    target: 85,
    skala: '0 - 100%',
    evidenceRequired: ['Kartu Inventaris Ruang (KIR)', 'Laporan Kalibrasi Mesin', 'Foto Standar K3 Bengkel/Lab']
  },
  {
    id: 'ind-701',
    code: 'PENG-7.1',
    standardId: 7, // FK -> StandardSNP (Standar Pengelolaan)
    standardName: 'Standar Pengelolaan',
    name: 'Digitalisasi Sistem Penjaminan Mutu & Manajemen Informasi (TPMPS)',
    description: 'Tingkat adopsi platform digital mutu oleh seluruh 18 unit kerja untuk input dokumen, evaluasi berkala, dan tindak lanjut perbaikan.',
    unitResponsible: ['unit-tpmps-int', 'unit-tu'],
    bobot: 50,
    target: 95,
    skala: '0 - 100%',
    evidenceRequired: ['Audit Log Penggunaan Sistem', 'SK Tim TPMPS Sekolah', 'Laporan Rapat Tinjauan Manajemen (RTM)']
  }
];

export const EVALUASI_MUTU_LIST: EvaluasiMutu[] = [
  {
    id: 'eval-01', // PK
    indikatorId: 'ind-101', // FK -> IndikatorMutu
    indikatorCode: 'SKL-1.1',
    indikatorName: 'Keterserapan Lulusan SMK (BMW)',
    standardId: 1, // FK -> StandardSNP
    standardName: 'Standar Kompetensi Lulusan (SKL)',
    unitId: 'unit-hubin', // FK -> UnitKerja
    unitName: 'WKS 4 Hubungan Industri & BKK',
    periode: 'Semester Ganjil 2025/2026',
    nilaiMandiri: 94.0,
    nilaiVerifikasi: 93.5,
    status: 'Disetujui',
    dokumenCount: 1,
    catatanUnit: 'Data tracer study telah terkumpul 91% dari total 450 alumni angkatan 2025. Bekerja 68%, Melanjutkan 18%, Wirausaha 8%.',
    catatanReviewer: 'Validasi dokumen tracer study akurat. Sangat baik dalam kemitraan industri.',
    reviewerId: 'u-tpmps-01', // FK -> UserProfile
    reviewedBy: 'Dr. Indah Permata, S.Pd., M.T.',
    reviewedAt: '2026-09-10 14:30',
    updatedAt: '2026-09-10 14:30',
    documentIds: ['doc-02'],
    rtlProgramIds: ['rtl-04']
  },
  {
    id: 'eval-02', // PK
    indikatorId: 'ind-201', // FK -> IndikatorMutu
    indikatorCode: 'ISI-2.1',
    indikatorName: 'Penyelarasan Kurikulum Bersama Industri (IDUKA)',
    standardId: 2, // FK -> StandardSNP
    standardName: 'Standar Isi',
    unitId: 'unit-kurikulum', // FK -> UnitKerja
    unitName: 'WKS 1 Bidang Kurikulum',
    periode: 'Semester Ganjil 2025/2026',
    nilaiMandiri: 95.0,
    nilaiVerifikasi: 95.0,
    status: 'Disetujui',
    dokumenCount: 2,
    catatanUnit: 'Telah melaksanakan workshop sinkronisasi bersama PT Telkom, PT Astra Honda Motor, dan Metrodata.',
    catatanReviewer: 'Kelengkapan administrasi dan MoU lengkap dengan naskah KOSP terbarui.',
    reviewerId: 'u-tpmps-01', // FK -> UserProfile
    reviewedBy: 'Dr. Indah Permata, S.Pd., M.T.',
    reviewedAt: '2026-09-12 11:15',
    updatedAt: '2026-09-12 11:15',
    documentIds: ['doc-01', 'doc-03'],
    rtlProgramIds: []
  },
  {
    id: 'eval-03', // PK
    indikatorId: 'ind-301', // FK -> IndikatorMutu
    indikatorCode: 'PRO-3.1',
    indikatorName: 'Penerapan Pembelajaran TeFa (Teaching Factory)',
    standardId: 3, // FK -> StandardSNP
    standardName: 'Standar Proses',
    unitId: 'unit-tefa', // FK -> UnitKerja
    unitName: 'Unit Produksi & Teaching Factory (TeFa)',
    periode: 'Semester Ganjil 2025/2026',
    nilaiMandiri: 84.0,
    nilaiVerifikasi: 82.0,
    status: 'Direview',
    dokumenCount: 1,
    catatanUnit: 'Omset TeFa naik 15% dari semester lalu. Namun jadwal rotasi bengkel siswa PPLG dan TKR masih perlu penyesuaian.',
    catatanReviewer: 'Perlu melampirkan laporan kepuasan klien luar atas hasil jasa software & service kendaraan.',
    reviewerId: 'u-tpmps-02', // FK -> UserProfile
    reviewedBy: 'Ahmad Fauzi, S.Kom., M.Kom.',
    reviewedAt: '2026-09-15 09:40',
    updatedAt: '2026-09-15 09:40',
    documentIds: ['doc-04'],
    rtlProgramIds: ['rtl-03']
  },
  {
    id: 'eval-04', // PK
    indikatorId: 'ind-501', // FK -> IndikatorMutu
    indikatorCode: 'PTK-5.1',
    indikatorName: 'Sertifikasi Kompetensi Kejuruan & Magang Guru di Industri',
    standardId: 5, // FK -> StandardSNP
    standardName: 'Standar Pendidik & Tenaga Kependidikan',
    unitId: 'unit-tu', // FK -> UnitKerja
    unitName: 'Tata Usaha & Kepegawaian',
    periode: 'Semester Ganjil 2025/2026',
    nilaiMandiri: 78.0,
    status: 'Diajukan',
    dokumenCount: 1,
    catatanUnit: 'Baru 12 dari 18 guru kejuruan yang menyelesaikan magang industri tahun ini. 6 guru dijadwalkan semester genap.',
    updatedAt: '2026-09-16 16:00',
    documentIds: ['doc-05'],
    rtlProgramIds: ['rtl-02']
  },
  {
    id: 'eval-05', // PK
    indikatorId: 'ind-601', // FK -> IndikatorMutu
    indikatorCode: 'SAR-6.1',
    indikatorName: 'Modernisasi Peralatan Praktik Sesuai Standar Industri 4.0',
    standardId: 6, // FK -> StandardSNP
    standardName: 'Standar Sarana & Prasarana',
    unitId: 'unit-sarpras', // FK -> UnitKerja
    unitName: 'WKS 3 Bidang Sarana & Prasarana',
    periode: 'Semester Ganjil 2025/2026',
    nilaiMandiri: 75.0,
    status: 'Perlu Revisi',
    dokumenCount: 1,
    catatanUnit: 'Rasio PC di Lab TJKT masih 1:1.8. Pengadaan switch cisco dan router mikrotik tambahan masih menunggu pencairan BOS.',
    catatanReviewer: 'Mohon update Kartu Inventaris Ruang dan sertakan surat komitmen pengadaan barang Q4 2026.',
    reviewerId: 'u-tpmps-01', // FK -> UserProfile
    reviewedBy: 'Dr. Indah Permata, S.Pd., M.T.',
    reviewedAt: '2026-09-17 10:20',
    updatedAt: '2026-09-17 10:20',
    documentIds: ['doc-06'],
    rtlProgramIds: ['rtl-01', 'rtl-05']
  },
  {
    id: 'eval-06', // PK
    indikatorId: 'ind-701', // FK -> IndikatorMutu
    indikatorCode: 'PENG-7.1',
    indikatorName: 'Digitalisasi Sistem Penjaminan Mutu & Manajemen Informasi (TPMPS)',
    standardId: 7, // FK -> StandardSNP
    standardName: 'Standar Pengelolaan',
    unitId: 'unit-tpmps-int', // FK -> UnitKerja
    unitName: 'Sekretariat TPMPS Internal',
    periode: 'Semester Ganjil 2025/2026',
    nilaiMandiri: 92.0,
    nilaiVerifikasi: 94.0,
    status: 'Disetujui',
    dokumenCount: 1,
    catatanUnit: 'Seluruh unit kerja telah memiliki akun dan aktif menggunakan platform penjaminan mutu digital.',
    catatanReviewer: 'Implementasi berjalan sangat mulus. Semua SOP dan audit trail terekam dengan baik.',
    reviewerId: 'u-ks-01', // FK -> UserProfile
    reviewedBy: 'Drs. H. Bambang Hartono, M.Pd.',
    reviewedAt: '2026-09-18 13:00',
    updatedAt: '2026-09-18 13:00',
    documentIds: ['doc-07'],
    rtlProgramIds: ['rtl-06']
  },
  {
    id: 'eval-07', // PK
    indikatorId: 'ind-102', // FK -> IndikatorMutu
    indikatorCode: 'SKL-1.2',
    indikatorName: 'Sertifikasi Kompetensi BNSP / LSP P-1',
    standardId: 1, // FK -> StandardSNP
    standardName: 'Standar Kompetensi Lulusan (SKL)',
    unitId: 'unit-lsp', // FK -> UnitKerja
    unitName: 'Lembaga Sertifikasi Profesi (LSP P-1)',
    periode: 'Semester Ganjil 2025/2026',
    nilaiMandiri: 91.5,
    status: 'Draft',
    dokumenCount: 0,
    catatanUnit: 'Sedang menunggu pengesahan klaster sertifikasi DKV dari BNSP Pusat.',
    updatedAt: '2026-09-18 08:30',
    documentIds: [],
    rtlProgramIds: []
  }
];

export const BUKTI_DOKUMEN_LIST: BuktiDokumen[] = [
  {
    id: 'doc-01', // PK
    title: 'MoU Kerjasama Industri PT Astra Honda Motor 2025-2028',
    fileName: 'MoU_AHM_KelasKhusus_2025.pdf',
    fileSize: '3.4 MB',
    fileType: 'pdf',
    evaluasiId: 'eval-02', // FK -> EvaluasiMutu (ISI-2.1)
    standardId: 2, // FK -> StandardSNP
    indikatorId: 'ind-201', // FK -> IndikatorMutu
    indikatorCode: 'ISI-2.1',
    unitId: 'unit-kurikulum', // FK -> UnitKerja
    unitName: 'WKS 1 Bidang Kurikulum',
    version: 'v2.0',
    uploadedByUserId: 'u-unit-01', // FK -> UserProfile
    uploadedBy: 'Rudi Wijaya, S.Pd., M.M.',
    uploadedAt: '2026-09-08 10:14',
    status: 'Terverifikasi',
    verifiedByUserId: 'u-tpmps-01', // FK -> UserProfile
    verifiedBy: 'Dr. Indah Permata, M.T.',
    notes: 'Perjanjian sah bermaterai dan mencakup perekrutan lulusan langsung.'
  },
  {
    id: 'doc-02', // PK
    title: 'Laporan Tracer Study Lulusan Angkatan 2025 (BMW)',
    fileName: 'Tracer_Study_Angkatan_2025_Final.xlsx',
    fileSize: '1.8 MB',
    fileType: 'excel',
    evaluasiId: 'eval-01', // FK -> EvaluasiMutu (SKL-1.1)
    standardId: 1, // FK -> StandardSNP
    indikatorId: 'ind-101', // FK -> IndikatorMutu
    indikatorCode: 'SKL-1.1',
    unitId: 'unit-hubin', // FK -> UnitKerja
    unitName: 'WKS 4 Hubungan Industri & BKK',
    version: 'v1.2',
    uploadedByUserId: 'u-unit-04', // FK -> UserProfile
    uploadedBy: 'Dewi Sartika, S.T., M.Eng.',
    uploadedAt: '2026-09-09 15:20',
    status: 'Terverifikasi',
    verifiedByUserId: 'u-tpmps-01', // FK -> UserProfile
    verifiedBy: 'Dr. Indah Permata, M.T.',
    notes: 'Respon rate mencapai 91.2% siswa.'
  },
  {
    id: 'doc-03', // PK
    title: 'Naskah Kurikulum Operasional Satuan Pendidikan (KOSP) 2025/2026',
    fileName: 'KOSP_SMK_Unggul_Terpadu_2025.pdf',
    fileSize: '8.7 MB',
    fileType: 'pdf',
    evaluasiId: 'eval-02', // FK -> EvaluasiMutu (ISI-2.1)
    standardId: 2, // FK -> StandardSNP
    indikatorId: 'ind-201', // FK -> IndikatorMutu
    indikatorCode: 'ISI-2.1',
    unitId: 'unit-kurikulum', // FK -> UnitKerja
    unitName: 'WKS 1 Bidang Kurikulum',
    version: 'v1.0',
    uploadedByUserId: 'u-unit-01', // FK -> UserProfile
    uploadedBy: 'Rudi Wijaya, S.Pd., M.M.',
    uploadedAt: '2026-09-11 08:30',
    status: 'Terverifikasi',
    verifiedByUserId: 'u-tpmps-01', // FK -> UserProfile
    verifiedBy: 'Dr. Indah Permata, M.T.',
    notes: 'Telah disetujui Pengawas Pembina Cabang Dinas Pendidikan.'
  },
  {
    id: 'doc-04', // PK
    title: 'Katalog Produk & Portofolio Teaching Factory PPLG & DKV',
    fileName: 'Katalog_TeFa_Digital_2026.pdf',
    fileSize: '12.1 MB',
    fileType: 'pdf',
    evaluasiId: 'eval-03', // FK -> EvaluasiMutu (PRO-3.1)
    standardId: 3, // FK -> StandardSNP
    indikatorId: 'ind-301', // FK -> IndikatorMutu
    indikatorCode: 'PRO-3.1',
    unitId: 'unit-tefa', // FK -> UnitKerja
    unitName: 'Unit Produksi & Teaching Factory (TeFa)',
    version: 'v2.1',
    uploadedByUserId: 'u-unit-04', // FK -> UserProfile
    uploadedBy: 'Farhan Maulana, S.T.',
    uploadedAt: '2026-09-14 11:45',
    status: 'Menunggu Verifikasi',
    notes: 'Menunggu review tim auditor mutu bidang standar proses.'
  },
  {
    id: 'doc-05', // PK
    title: 'Rekapitulasi Sertifikasi Asesor Kompetensi & Teknis Guru',
    fileName: 'Data_Sertifikasi_Guru_Kejuruan_2025.docx',
    fileSize: '950 KB',
    fileType: 'word',
    evaluasiId: 'eval-04', // FK -> EvaluasiMutu (PTK-5.1)
    standardId: 5, // FK -> StandardSNP
    indikatorId: 'ind-501', // FK -> IndikatorMutu
    indikatorCode: 'PTK-5.1',
    unitId: 'unit-tu', // FK -> UnitKerja
    unitName: 'Tata Usaha & Kepegawaian',
    version: 'v1.0',
    uploadedByUserId: 'u-unit-01', // FK -> UserProfile
    uploadedBy: 'Sri Rahayu, S.Sos.',
    uploadedAt: '2026-09-16 14:10',
    status: 'Menunggu Verifikasi',
    notes: 'Baru memasukkan 12 sertifikat.'
  },
  {
    id: 'doc-06', // PK
    title: 'Daftar Inventaris Alat Lab Jaringan Komputer & IoT',
    fileName: 'KIR_Lab_Jaringan_2025.pdf',
    fileSize: '4.2 MB',
    fileType: 'pdf',
    evaluasiId: 'eval-05', // FK -> EvaluasiMutu (SAR-6.1)
    standardId: 6, // FK -> StandardSNP
    indikatorId: 'ind-601', // FK -> IndikatorMutu
    indikatorCode: 'SAR-6.1',
    unitId: 'unit-sarpras', // FK -> UnitKerja
    unitName: 'WKS 3 Bidang Sarana & Prasarana',
    version: 'v1.1',
    uploadedByUserId: 'u-unit-03', // FK -> UserProfile
    uploadedBy: 'Ir. Agus Santoso',
    uploadedAt: '2026-09-17 09:15',
    status: 'Ditolak',
    notes: 'Kartu kendali K3 belum dilampirkan, perlu re-upload.'
  },
  {
    id: 'doc-07', // PK
    title: 'Dokumentasi Rapat Tinjauan Manajemen (RTM) Siklus I',
    fileName: 'Notula_Dan_Presensi_RTM_2025.pdf',
    fileSize: '2.5 MB',
    fileType: 'pdf',
    evaluasiId: 'eval-06', // FK -> EvaluasiMutu (PENG-7.1)
    standardId: 7, // FK -> StandardSNP
    indikatorId: 'ind-701', // FK -> IndikatorMutu
    indikatorCode: 'PENG-7.1',
    unitId: 'unit-tpmps-int', // FK -> UnitKerja
    unitName: 'Sekretariat TPMPS Internal',
    version: 'v1.0',
    uploadedByUserId: 'u-tpmps-02', // FK -> UserProfile
    uploadedBy: 'Ahmad Fauzi, S.Kom., M.Kom.',
    uploadedAt: '2026-09-18 10:00',
    status: 'Terverifikasi',
    verifiedByUserId: 'u-ks-01', // FK -> UserProfile
    verifiedBy: 'Drs. H. Bambang Hartono, M.Pd.',
    notes: 'Dihadiri Kepala Sekolah, Seluruh WKS, Kaprodi, dan Komite Sekolah.'
  }
];

export const PROGRAM_MUTU_RTL_LIST: ProgramMutuRTL[] = [
  {
    id: 'rtl-01', // PK
    evaluasiId: 'eval-05', // FK -> EvaluasiMutu (SAR-6.1)
    title: 'Pengadaan Paket Switch & Router Praktik Cisco untuk Lab TJKT',
    temuanTerkait: 'Rasio perangkat praktik pada Standar Sarpras (SAR-6.1) masih 1:1.8, target minimal 1:1.',
    standardId: 6, // FK -> StandardSNP
    standardName: 'Standar Sarana & Prasarana',
    indikatorId: 'ind-601', // FK -> IndikatorMutu
    unitId: 'unit-sarpras', // FK -> UnitKerja
    unitName: 'WKS 3 Bidang Sarana & Prasarana',
    picUserId: 'u-unit-03', // FK -> UserProfile
    pic: 'Ir. Agus Santoso',
    deadline: '2026-10-30',
    anggaran: 48000000,
    progress: 45,
    status: 'Sedang Berjalan',
    priority: 'Tinggi',
    outputDiharapkan: '12 unit Cisco Managed Switch terpasang dan siap digunakan Uji Sertifikasi CCNA.'
  },
  {
    id: 'rtl-02', // PK
    evaluasiId: 'eval-04', // FK -> EvaluasiMutu (PTK-5.1)
    title: 'Program Magang Industri Bersertifikat bagi 6 Guru Kejuruan',
    temuanTerkait: 'Sebanyak 33% guru produktif belum menuntaskan kewajiban magang industri berkala (PTK-5.1).',
    standardId: 5, // FK -> StandardSNP
    standardName: 'Standar Pendidik & Tenaga Kependidikan',
    indikatorId: 'ind-501', // FK -> IndikatorMutu
    unitId: 'unit-kurikulum', // FK -> UnitKerja
    unitName: 'WKS 1 Bidang Kurikulum',
    picUserId: 'u-unit-01', // FK -> UserProfile
    pic: 'Rudi Wijaya, S.Pd., M.M.',
    deadline: '2026-11-20',
    anggaran: 36000000,
    progress: 25,
    status: 'Sedang Berjalan',
    priority: 'Tinggi',
    outputDiharapkan: '6 Guru menyelesaikan magang industri 1 bulan dan memperoleh sertifikat industri.'
  },
  {
    id: 'rtl-03', // PK
    evaluasiId: 'eval-03', // FK -> EvaluasiMutu (PRO-3.1)
    title: 'Ekspansi Kemitraan Teaching Factory dengan Agensi Software Nasional',
    temuanTerkait: 'Order kerja nyata siswa TeFa Software masih didominasi proyek internal sekolah (PRO-3.1).',
    standardId: 3, // FK -> StandardSNP
    standardName: 'Standar Proses',
    indikatorId: 'ind-301', // FK -> IndikatorMutu
    unitId: 'unit-tefa', // FK -> UnitKerja
    unitName: 'Unit Produksi & Teaching Factory (TeFa)',
    picUserId: 'u-unit-04', // FK -> UserProfile
    pic: 'Farhan Maulana, S.T.',
    deadline: '2026-12-15',
    anggaran: 15000000,
    progress: 10,
    status: 'Belum Mulai',
    priority: 'Sedang',
    outputDiharapkan: 'Minimal 3 kontrak pembuatan aplikasi web/mobile dari klien komersial.'
  },
  {
    id: 'rtl-04', // PK
    evaluasiId: 'eval-01', // FK -> EvaluasiMutu (SKL-1.1)
    title: 'Pelatihan Tracer Study Digital & Coaching Wirausaha Alumni',
    temuanTerkait: 'Persentase alumni berwirausaha mandiri masih di angka 8%, target sekolah adalah 12% (SKL-1.1).',
    standardId: 1, // FK -> StandardSNP
    standardName: 'Standar Kompetensi Lulusan (SKL)',
    indikatorId: 'ind-101', // FK -> IndikatorMutu
    unitId: 'unit-hubin', // FK -> UnitKerja
    unitName: 'WKS 4 Hubungan Industri & BKK',
    picUserId: 'u-unit-04', // FK -> UserProfile
    pic: 'Dewi Sartika, S.T., M.Eng.',
    deadline: '2026-09-30',
    anggaran: 12000000,
    progress: 90,
    status: 'Sedang Berjalan',
    priority: 'Sedang',
    outputDiharapkan: 'Workshop wirausaha startup digital dengan 80 peserta alumni SMK.'
  },
  {
    id: 'rtl-05', // PK
    evaluasiId: 'eval-05', // FK -> EvaluasiMutu (SAR-6.1)
    title: 'Pembaruan Lisensi Perangkat Lunak Desain & Animasi Lab DKV',
    temuanTerkait: 'Versi software lab grafis DKV sudah tertinggal 2 generasi dari kebutuhan industri (SAR-6.1).',
    standardId: 6, // FK -> StandardSNP
    standardName: 'Standar Sarana & Prasarana',
    indikatorId: 'ind-601', // FK -> IndikatorMutu
    unitId: 'unit-dkv', // FK -> UnitKerja
    unitName: 'Kaprodi Desain Komunikasi Visual',
    picUserId: 'u-unit-01', // FK -> UserProfile
    pic: 'Maya Safitri, M.Ds.',
    deadline: '2026-09-05',
    anggaran: 25000000,
    progress: 100,
    status: 'Selesai',
    priority: 'Tinggi',
    outputDiharapkan: 'Lisensi Adobe Creative Cloud for Education aktif untuk 36 workstation.'
  },
  {
    id: 'rtl-06', // PK
    evaluasiId: 'eval-06', // FK -> EvaluasiMutu (PENG-7.1)
    title: 'Integrasi Dashboard Rapor Pendidikan Nasional ke TPMPS Digital',
    temuanTerkait: 'Penyamaan format indikator TPMPS dengan Rapor Pendidikan Kemendikbudristek (PENG-7.1).',
    standardId: 7, // FK -> StandardSNP
    standardName: 'Standar Pengelolaan',
    indikatorId: 'ind-701', // FK -> IndikatorMutu
    unitId: 'unit-tpmps-int', // FK -> UnitKerja
    unitName: 'Sekretariat TPMPS Internal',
    picUserId: 'u-tpmps-02', // FK -> UserProfile
    pic: 'Ahmad Fauzi, S.Kom., M.Kom.',
    deadline: '2026-09-15',
    anggaran: 8000000,
    progress: 60,
    status: 'Terlambat',
    priority: 'Sedang',
    outputDiharapkan: 'Peta keselarasan 8 SNP dengan indikator Rapor Pendidikan 2026.'
  }
];

export const AUDIT_LOGS_LIST: AuditLogItem[] = [
  {
    id: 'log-001', // PK
    userId: 'u-ks-01', // FK -> UserProfile
    userName: 'Drs. H. Bambang Hartono, M.Pd.',
    role: 'Kepala Sekolah',
    action: 'APPROVAL_LAPORAN',
    entity: 'EvaluasiMutu',
    entityId: 'eval-06', // FK -> EvaluasiMutu
    timestamp: '2026-09-18 13:00:24',
    ipAddress: '192.168.10.15',
    details: 'Menyetujui evaluasi Standar Pengelolaan (PENG-7.1) dengan skor verifikasi 94.0'
  },
  {
    id: 'log-002', // PK
    userId: 'u-tpmps-01', // FK -> UserProfile
    userName: 'Dr. Indah Permata, S.Pd., M.T.',
    role: 'Ketua TPMPS',
    action: 'REVIEW_EVALUASI',
    entity: 'EvaluasiMutu',
    entityId: 'eval-05', // FK -> EvaluasiMutu
    timestamp: '2026-09-17 10:20:11',
    ipAddress: '192.168.10.22',
    details: 'Memberikan catatan revisi pada Standar Sarana Prasarana unit WKS Sarpras'
  },
  {
    id: 'log-003', // PK
    userId: 'u-admin-01', // FK -> UserProfile
    userName: 'Dimas Prasetyo',
    role: 'Admin Sistem',
    action: 'CREATE_USER',
    entity: 'UserProfile',
    entityId: 'u-guru-01', // FK -> UserProfile
    timestamp: '2026-09-16 17:02:45',
    ipAddress: '192.168.10.2',
    details: 'Menambahkan akun guru Siti Nurhaliza, S.Pd. pada unit WKS Kurikulum'
  },
  {
    id: 'log-004', // PK
    userId: 'u-unit-01', // FK -> UserProfile
    userName: 'Rudi Wijaya, S.Pd., M.M.',
    role: 'WKS Kurikulum',
    action: 'SUBMIT_EVALUASI',
    entity: 'EvaluasiMutu',
    entityId: 'eval-02', // FK -> EvaluasiMutu
    timestamp: '2026-09-11 16:40:02',
    ipAddress: '192.168.10.35',
    details: 'Mengajukan dokumen penilaian mandiri Standar Isi (ISI-2.1) ke TPMPS'
  },
  {
    id: 'log-005', // PK
    userId: 'u-tpmps-01', // FK -> UserProfile
    userName: 'Dr. Indah Permata, S.Pd., M.T.',
    role: 'Ketua TPMPS',
    action: 'CREATE_RTL',
    entity: 'ProgramMutuRTL',
    entityId: 'rtl-01', // FK -> ProgramMutuRTL
    timestamp: '2026-09-10 11:20:00',
    ipAddress: '192.168.10.22',
    details: 'Membuat Rencana Tindak Lanjut baru: Pengadaan Switch & Router Lab TJKT terkait temuan Evaluasi eval-05'
  },
  {
    id: 'log-006', // PK
    userId: 'u-tpmps-02', // FK -> UserProfile
    userName: 'Ahmad Fauzi, S.Kom., M.Kom.',
    role: 'Anggota TPMPS',
    action: 'VERIFIKASI_DOKUMEN',
    entity: 'BuktiDokumen',
    entityId: 'doc-02', // FK -> BuktiDokumen
    timestamp: '2026-09-09 16:00:15',
    ipAddress: '192.168.10.28',
    details: 'Verifikasi valid dokumen Laporan Tracer Study Lulusan Angkatan 2025 untuk Evaluasi eval-01'
  }
];

// Re-export Sistem Lemari & Laci Digital (18 Unit Kerja) & Room Periode
export { INITIAL_LEMARI_LIST, INITIAL_LACI_LIST, DEFAULT_ROOM_LIST } from './lemariMockData';
