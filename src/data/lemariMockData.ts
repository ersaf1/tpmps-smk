import { LemariUnit, LaciUnit, TahunAjaranRoom, BerkasLaci } from '@/types/tpmps';

export const DEFAULT_ROOM_LIST: TahunAjaranRoom[] = [
  {
    id: '2026/2027',
    label: 'Tahun Ajaran 2026/2027',
    shortLabel: '2026/2027',
    status: 'Mendatang',
    description: 'Room Perencanaan Mutu & Pengunggahan Berkas Baru Siklus 2026/2027'
  },
  {
    id: '2025/2026',
    label: 'Tahun Ajaran 2025/2026',
    shortLabel: '2025/2026',
    status: 'Aktif',
    description: 'Room Berjalan Aktif - Pemenuhan 8 SNP & Pelaksanaan Kurikulum Merdeka'
  },
  {
    id: '2024/2025',
    label: 'Tahun Ajaran 2024/2025',
    shortLabel: '2024/2025',
    status: 'Arsip',
    description: 'Room Arsip Historis - Berkas Kinerja & Akreditasi Tahun 2024/2025'
  },
  {
    id: '2023/2024',
    label: 'Tahun Ajaran 2023/2024',
    shortLabel: '2023/2024',
    status: 'Arsip',
    description: 'Room Arsip Historis - Berkas Evaluasi Diri Sekolah 2023/2024'
  }
];

export const INITIAL_LEMARI_LIST: LemariUnit[] = [
  {
    id: 'lemari-kurikulum',
    unitId: 'unit-kurikulum',
    unitCode: 'WKS-KUR',
    unitName: 'WKS 1 Bidang Kurikulum',
    unitCategory: 'Manajemen',
    pic: 'Rudi Wijaya, S.Pd., M.M.',
    tahunAjaran: '2025/2026',
    deskripsiJob: 'Pengembangan kurikulum merdeka SMK, KOSP, pembagian jam mengajar, modul ajar, asesmen sumatif/formatif, dan kalender pendidikan.',
    totalLaci: 4,
    laciTerisi: 3,
    laciDisetujui: 2,
    laciRevisi: 1,
    laciKosong: 1,
    status: 'Aktif',
    lastUpdated: '2026-09-18 10:30'
  },
  {
    id: 'lemari-kesiswaan',
    unitId: 'unit-kesiswaan',
    unitCode: 'WKS-KES',
    unitName: 'WKS 2 Bidang Kesiswaan',
    unitCategory: 'Manajemen',
    pic: 'Haryanto, S.Pd.',
    tahunAjaran: '2025/2026',
    deskripsiJob: 'Pengelolaan MPLS, OSIS/MPK, ekstrakurikuler, penegakan kedisiplinan dan tata tertib, beasiswa, dan pembinaan karakter profil pelajar pancasila.',
    totalLaci: 4,
    laciTerisi: 3,
    laciDisetujui: 3,
    laciRevisi: 0,
    laciKosong: 1,
    status: 'Aktif',
    lastUpdated: '2026-09-17 14:15'
  },
  {
    id: 'lemari-sarpras',
    unitId: 'unit-sarpras',
    unitCode: 'WKS-SAR',
    unitName: 'WKS 3 Bidang Sarana & Prasarana',
    unitCategory: 'Manajemen',
    pic: 'Ir. Agus Santoso',
    tahunAjaran: '2025/2026',
    deskripsiJob: 'Inventarisasi aset dan gedung, perawatan berkala fasilitas praktik & kelas, standar K3 workshop, dan usulan belanja modal sekolah.',
    totalLaci: 4,
    laciTerisi: 3,
    laciDisetujui: 2,
    laciRevisi: 1,
    laciKosong: 1,
    status: 'Aktif',
    lastUpdated: '2026-09-16 09:45'
  },
  {
    id: 'lemari-hubin',
    unitId: 'unit-hubin',
    unitCode: 'WKS-HUB',
    unitName: 'WKS 4 Hubungan Industri & BKK',
    unitCategory: 'Manajemen',
    pic: 'Dewi Sartika, S.T., M.Eng.',
    tahunAjaran: '2025/2026',
    deskripsiJob: 'Kemitraan dunia kerja (IDUKA), penyelarasan kurikulum industri, pelaksanaan PKL/Prakerin 6 bulan, tracer study, dan bursa kerja khusus (BKK).',
    totalLaci: 4,
    laciTerisi: 4,
    laciDisetujui: 4,
    laciRevisi: 0,
    laciKosong: 0,
    status: 'Aktif',
    lastUpdated: '2026-09-18 16:20'
  },
  {
    id: 'lemari-tu',
    unitId: 'unit-tu',
    unitCode: 'TU-ADM',
    unitName: 'Tata Usaha & Kepegawaian',
    unitCategory: 'Layanan',
    pic: 'Sri Rahayu, S.Sos.',
    tahunAjaran: '2025/2026',
    deskripsiJob: 'Administrasi kepegawaian (KGB, SK, PAK), tata persuratan dinas, arsip dokumen resmi sekolah, dan pengelolaan buku induk siswa.',
    totalLaci: 3,
    laciTerisi: 2,
    laciDisetujui: 2,
    laciRevisi: 0,
    laciKosong: 1,
    status: 'Aktif',
    lastUpdated: '2026-09-15 11:10'
  },
  {
    id: 'lemari-bk',
    unitId: 'unit-bk',
    unitCode: 'BK-KON',
    unitName: 'Bimbingan Konseling (BK)',
    unitCategory: 'Layanan',
    pic: 'Dra. Nurhayati, M.Si.',
    tahunAjaran: '2025/2026',
    deskripsiJob: 'Layanan bimbingan pribadi, sosial, belajar, dan karir siswa; pemetaan sosiometri; penanganan kasus konseling; serta konsultasi wali murid.',
    totalLaci: 3,
    laciTerisi: 3,
    laciDisetujui: 2,
    laciRevisi: 1,
    laciKosong: 0,
    status: 'Aktif',
    lastUpdated: '2026-09-17 13:05'
  },
  {
    id: 'lemari-perpustakaan',
    unitId: 'unit-perpustakaan',
    unitCode: 'PERPUS',
    unitName: 'Perpustakaan Digital Sekolah',
    unitCategory: 'Layanan',
    pic: 'Endang Setiawati, S.I.Pust.',
    tahunAjaran: '2025/2026',
    deskripsiJob: 'Pengelolaan katalog e-library, sirkulasi peminjaman buku paket, pengadaan referensi kejuruan, dan program literasi sekolah.',
    totalLaci: 3,
    laciTerisi: 2,
    laciDisetujui: 1,
    laciRevisi: 0,
    laciKosong: 1,
    status: 'Aktif',
    lastUpdated: '2026-09-14 15:40'
  },
  {
    id: 'lemari-lab',
    unitId: 'unit-lab',
    unitCode: 'LAB-KOM',
    unitName: 'Laboratorium & Bengkel Komputer',
    unitCategory: 'Layanan',
    pic: 'Kurniawan, S.T.',
    tahunAjaran: '2025/2026',
    deskripsiJob: 'Pengaturan jadwal penggunaan 6 lab komputer, logbook pemeliharaan hardware/jaringan, lisensi software, dan SOP keselamatan kerja lab.',
    totalLaci: 3,
    laciTerisi: 2,
    laciDisetujui: 2,
    laciRevisi: 0,
    laciKosong: 1,
    status: 'Aktif',
    lastUpdated: '2026-09-16 11:20'
  },
  {
    id: 'lemari-pplg',
    unitId: 'unit-pplg',
    unitCode: 'PRODI-PPLG',
    unitName: 'Kaprodi PPLG (RPL / Software)',
    unitCategory: 'Kejuruan',
    pic: 'Eko Prasetyo, M.Kom.',
    tahunAjaran: '2025/2026',
    deskripsiJob: 'Penyelarasan kurikulum software house, project-based learning aplikasi web & mobile, sertifikasi BNSP junior programmer, dan UKK RPL.',
    totalLaci: 4,
    laciTerisi: 4,
    laciDisetujui: 4,
    laciRevisi: 0,
    laciKosong: 0,
    status: 'Aktif',
    lastUpdated: '2026-09-18 14:00'
  },
  {
    id: 'lemari-tjkt',
    unitId: 'unit-tjkt',
    unitCode: 'PRODI-TJKT',
    unitName: 'Kaprodi TJKT (Jaringan & Telco)',
    unitCategory: 'Kejuruan',
    pic: 'Wahyu Nugroho, S.T.',
    tahunAjaran: '2025/2026',
    deskripsiJob: 'Penyelarasan kurikulum Mikrotik Academy / Cisco CCNA, job sheet instalasi fiber optic, server linux, dan uji kompetensi jaringan komputer.',
    totalLaci: 4,
    laciTerisi: 3,
    laciDisetujui: 3,
    laciRevisi: 0,
    laciKosong: 1,
    status: 'Aktif',
    lastUpdated: '2026-09-17 16:50'
  },
  {
    id: 'lemari-dkv',
    unitId: 'unit-dkv',
    unitCode: 'PRODI-DKV',
    unitName: 'Kaprodi Desain Komunikasi Visual',
    unitCategory: 'Kejuruan',
    pic: 'Maya Safitri, M.Ds.',
    tahunAjaran: '2025/2026',
    deskripsiJob: 'Pengembangan portofolio branding, animasi 2D/3D, videografi industri, job sheet studio kreatif, dan pameran karya visual siswa tahunan.',
    totalLaci: 3,
    laciTerisi: 3,
    laciDisetujui: 2,
    laciRevisi: 1,
    laciKosong: 0,
    status: 'Aktif',
    lastUpdated: '2026-09-17 11:30'
  },
  {
    id: 'lemari-mplb',
    unitId: 'unit-mplb',
    unitCode: 'PRODI-MPLB',
    unitName: 'Kaprodi Manajemen Perkantoran (MPLB)',
    unitCategory: 'Kejuruan',
    pic: 'Tri Wahyuni, S.Pd.',
    tahunAjaran: '2025/2026',
    deskripsiJob: 'Simulasi kantor modern, kearsipan digital, otomatisasi tata kelola perkantoran, komunikasi bisnis bahasa inggris, dan UKK administrasi perkantoran.',
    totalLaci: 3,
    laciTerisi: 2,
    laciDisetujui: 2,
    laciRevisi: 0,
    laciKosong: 1,
    status: 'Aktif',
    lastUpdated: '2026-09-15 14:10'
  },
  {
    id: 'lemari-akl',
    unitId: 'unit-akl',
    unitCode: 'PRODI-AKL',
    unitName: 'Kaprodi Akuntansi & Keuangan (AKL)',
    unitCategory: 'Kejuruan',
    pic: 'Retno Wulandari, S.E., Ak.',
    tahunAjaran: '2025/2026',
    deskripsiJob: 'Praktikum software akuntansi (MYOB/Accurate), perpajakan digital, pengelolaan bank mini sekolah, dan sertifikasi teknisi akuntansi junior.',
    totalLaci: 3,
    laciTerisi: 2,
    laciDisetujui: 2,
    laciRevisi: 0,
    laciKosong: 1,
    status: 'Aktif',
    lastUpdated: '2026-09-16 15:25'
  },
  {
    id: 'lemari-tkr',
    unitId: 'unit-tkr',
    unitCode: 'PRODI-TKR',
    unitName: 'Kaprodi Teknik Kendaraan Ringan (TKR)',
    unitCategory: 'Kejuruan',
    pic: 'Budi Darmawan, S.Pd., M.T.',
    tahunAjaran: '2025/2026',
    deskripsiJob: 'SOP bengkel otomotif, modul overhaul mesin & transmisi otomatis, EFI / engine scanner scanner, dan uji emisi berkala kendaraan.',
    totalLaci: 3,
    laciTerisi: 2,
    laciDisetujui: 1,
    laciRevisi: 1,
    laciKosong: 1,
    status: 'Aktif',
    lastUpdated: '2026-09-14 10:45'
  },
  {
    id: 'lemari-tefa',
    unitId: 'unit-tefa',
    unitCode: 'UNIT-PROD',
    unitName: 'Unit Produksi & Teaching Factory (TeFa)',
    unitCategory: 'Kejuruan',
    pic: 'Farhan Maulana, S.T.',
    tahunAjaran: '2025/2026',
    deskripsiJob: 'Pembelajaran berbasis pabrik/layanan jasa nyata, standard quality control pesanan pelanggan luar, omzet unit usaha, dan akuntabilitas keuangan TeFa.',
    totalLaci: 3,
    laciTerisi: 2,
    laciDisetujui: 2,
    laciRevisi: 0,
    laciKosong: 1,
    status: 'Aktif',
    lastUpdated: '2026-09-17 08:30'
  },
  {
    id: 'lemari-lsp',
    unitId: 'unit-lsp',
    unitCode: 'LSP-P1',
    unitName: 'Lembaga Sertifikasi Profesi (LSP P-1)',
    unitCategory: 'Layanan',
    pic: 'Dr. Surya Adi, M.Pd.',
    tahunAjaran: '2025/2026',
    deskripsiJob: 'Pemeliharaan lisensi BNSP, verifikasi Tempat Uji Kompetensi (TUK), pembaharuan skema sertifikasi KKNI level II, dan administrasi blanko sertifikat garuda.',
    totalLaci: 3,
    laciTerisi: 3,
    laciDisetujui: 3,
    laciRevisi: 0,
    laciKosong: 0,
    status: 'Aktif',
    lastUpdated: '2026-09-18 11:15'
  },
  {
    id: 'lemari-spi',
    unitId: 'unit-spi',
    unitCode: 'SPI-PEN',
    unitName: 'Satuan Pengawas Internal (SPI)',
    unitCategory: 'Pengawasan',
    pic: 'Drs. H. Mulyadi, M.M.',
    tahunAjaran: '2025/2026',
    deskripsiJob: 'Audit kepatuhan tata kelola sekolah, verifikasi pertanggungjawaban anggaran BOS & BOP, pemeriksaan SOP operasional, dan laporan temuan internal.',
    totalLaci: 3,
    laciTerisi: 3,
    laciDisetujui: 3,
    laciRevisi: 0,
    laciKosong: 0,
    status: 'Aktif',
    lastUpdated: '2026-09-18 09:00'
  },
  {
    id: 'lemari-tpmps-int',
    unitId: 'unit-tpmps-int',
    unitCode: 'TPMPS-INT',
    unitName: 'Sekretariat TPMPS Internal',
    unitCategory: 'Pengawasan',
    pic: 'Dr. Indah Permata, M.T.',
    tahunAjaran: '2025/2026',
    deskripsiJob: 'Penyelenggaraan siklus PPEPP, instrumen evaluasi diri sekolah (EDS), integrasi rapor pendidikan nasional, dan monitoring rencana tindak lanjut mutu.',
    totalLaci: 3,
    laciTerisi: 3,
    laciDisetujui: 3,
    laciRevisi: 0,
    laciKosong: 0,
    status: 'Aktif',
    lastUpdated: '2026-09-18 15:45'
  }
];

export const INITIAL_LACI_LIST: LaciUnit[] = [
  // ==========================================
  // 1. WKS 1 KURIKULUM (unit-kurikulum)
  // ==========================================
  {
    id: 'laci-kur-a',
    lemariId: 'lemari-kurikulum',
    unitId: 'unit-kurikulum',
    unitName: 'WKS 1 Bidang Kurikulum',
    kodeLaci: 'LACI-A',
    namaLaci: 'Dokumen KOSP (Kurikulum Operasional Satuan Pendidikan)',
    deskripsiTugas: 'Unggah dokumen KOSP tahun ajaran berjalan lengkap dengan pengesahan dari Kepala Dinas Pendidikan Provinsi.',
    kategoriJob: 'Perencanaan',
    formatWajib: ['pdf', 'link'],
    deadline: '2026-08-15',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-08-20 10:15',
    catatanSuperAdmin: 'Dokumen KOSP sangat lengkap, struktur kurikulum selaras dengan 6 program keahlian. Telah di-acc.',
    updatedAt: '2026-08-18 14:20',
    berkasList: [
      {
        id: 'file-kur-26-01',
        laciId: 'laci-kur-a',
        unitId: 'unit-kurikulum',
        namaFile: 'Draft_KOSP_SMK_Unggul_2026_2027_Inovasi_AI.pdf',
        ukuranFile: '11.2 MB',
        tipeFile: 'pdf',
        versi: 'v0.2-draft',
        tahunAjaran: '2026/2027',
        uploadedAt: '2026-09-18 16:20',
        uploadedBy: 'Rudi Wijaya, S.Pd., M.M.',
        uploadedByUserId: 'u-unit-01',
        catatanPengirim: 'Draft kurikulum baru 2026/2027 integrasi materi AI Engineering dan Cloud Native bersama IDUKA.'
      },
      {
        id: 'file-kur-01',
        laciId: 'laci-kur-a',
        unitId: 'unit-kurikulum',
        namaFile: 'KOSP_SMK_Unggul_2025_2026_Final_TTE_Dinas.pdf',
        ukuranFile: '14.8 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        tahunAjaran: '2025/2026',
        uploadedAt: '2025-08-18 14:20',
        uploadedBy: 'Rudi Wijaya, S.Pd., M.M.',
        uploadedByUserId: 'u-unit-01',
        catatanPengirim: 'Dokumen KOSP lengkap dengan lampiran capaian pembelajaran dan SK tim pengembang kurikulum.'
      },
      {
        id: 'file-kur-24-01',
        laciId: 'laci-kur-a',
        unitId: 'unit-kurikulum',
        namaFile: 'Arsip_KOSP_Resmi_2024_2025_Disahkan.pdf',
        ukuranFile: '12.4 MB',
        tipeFile: 'pdf',
        versi: 'v1.2-arsip',
        tahunAjaran: '2024/2025',
        uploadedAt: '2024-08-12 09:15',
        uploadedBy: 'Rudi Wijaya, S.Pd., M.M.',
        uploadedByUserId: 'u-unit-01',
        catatanPengirim: 'Dokumen kurikulum tahun ajaran 2024/2025 telah diarsipkan dan selesai diaudit.'
      },
      {
        id: 'file-kur-23-01',
        laciId: 'laci-kur-a',
        unitId: 'unit-kurikulum',
        namaFile: 'KOSP_Kurikulum_Merdeka_Fase_E_2023_2024.pdf',
        ukuranFile: '9.8 MB',
        tipeFile: 'pdf',
        versi: 'v1.0-arsip',
        tahunAjaran: '2023/2024',
        uploadedAt: '2023-08-10 10:00',
        uploadedBy: 'Rudi Wijaya, S.Pd., M.M.',
        uploadedByUserId: 'u-unit-01',
        catatanPengirim: 'Dokumen kurikulum tahun 2023/2024 implementasi perdana Kurikulum Merdeka.'
      }
    ]
  },
  {
    id: 'laci-kur-b',
    lemariId: 'lemari-kurikulum',
    unitId: 'unit-kurikulum',
    unitName: 'WKS 1 Bidang Kurikulum',
    kodeLaci: 'LACI-B',
    namaLaci: 'Modul Ajar & Perangkat Pembelajaran Merdeka',
    deskripsiTugas: 'Sampel modul ajar terintegrasi pembelajaran berdiferensiasi dan asesmen diagnostik untuk semua mata pelajaran umum dan kejuruan.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['pdf', 'docx', 'link'],
    deadline: '2026-09-10',
    isMandatory: true,
    status: 'revisi',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-09-12 11:30',
    catatanSuperAdmin: 'Rubrik asesmen formatif untuk mata pelajaran dasar kejuruan kelas X belum mencantumkan lembar observasi sikap bernalar kritis. Mohon direvisi.',
    updatedAt: '2026-09-11 09:30',
    berkasList: [
      {
        id: 'file-kur-26-02',
        laciId: 'laci-kur-b',
        unitId: 'unit-kurikulum',
        namaFile: 'Rancangan_Modul_Ajar_Digital_2026_2027.pdf',
        ukuranFile: '16.5 MB',
        tipeFile: 'pdf',
        versi: 'v0.1',
        tahunAjaran: '2026/2027',
        uploadedAt: '2026-09-15 10:00',
        uploadedBy: 'Rudi Wijaya, S.Pd., M.M.',
        uploadedByUserId: 'u-unit-01',
        catatanPengirim: 'Rancangan modul ajar digital interaktif untuk persiapan tahun 2026/2027.'
      },
      {
        id: 'file-kur-02',
        laciId: 'laci-kur-b',
        unitId: 'unit-kurikulum',
        namaFile: 'Kompilasi_Modul_Ajar_Semester_Ganjil_2025.pdf',
        ukuranFile: '28.4 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        tahunAjaran: '2025/2026',
        uploadedAt: '2025-09-11 09:30',
        uploadedBy: 'Rudi Wijaya, S.Pd., M.M.',
        uploadedByUserId: 'u-unit-01',
        catatanPengirim: 'Kompilasi 48 modul ajar perwakilan seluruh rumpun mata pelajaran.'
      },
      {
        id: 'file-kur-24-02',
        laciId: 'laci-kur-b',
        unitId: 'unit-kurikulum',
        namaFile: 'Arsip_Modul_Ajar_Lengkap_Tahun_2024_2025.pdf',
        ukuranFile: '22.1 MB',
        tipeFile: 'pdf',
        versi: 'v1.5',
        tahunAjaran: '2024/2025',
        uploadedAt: '2024-09-14 13:20',
        uploadedBy: 'Rudi Wijaya, S.Pd., M.M.',
        uploadedByUserId: 'u-unit-01',
        catatanPengirim: 'Kompilasi modul ajar lengkap tahun ajaran 2024/2025.'
      }
    ]
  },
  {
    id: 'laci-kur-c',
    lemariId: 'lemari-kurikulum',
    unitId: 'unit-kurikulum',
    unitName: 'WKS 1 Bidang Kurikulum',
    kodeLaci: 'LACI-C',
    namaLaci: 'SK Pembagian Tugas Mengajar & Jadwal KBM',
    deskripsiTugas: 'Surat Keputusan Kepala Sekolah tentang pembagian beban jam mengajar guru (minimal 24 JP) dan jadwal pelajaran mingguan.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['pdf', 'xlsx'],
    deadline: '2026-07-25',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Drs. H. Bambang Hartono (Kepala Sekolah)',
    verifiedAt: '2026-07-28 09:00',
    catatanSuperAdmin: 'Beban mengajar guru sudah proporsional dan tidak ada guru yang bentrok jadwal lab.',
    updatedAt: '2026-07-26 13:45',
    berkasList: [
      {
        id: 'file-kur-26-03',
        laciId: 'laci-kur-c',
        unitId: 'unit-kurikulum',
        namaFile: 'Draft_Jadwal_KBM_dan_Distribusi_Jam_2026_2027.xlsx',
        ukuranFile: '2.1 MB',
        tipeFile: 'excel',
        versi: 'v0.1',
        tahunAjaran: '2026/2027',
        uploadedAt: '2026-09-16 11:20',
        uploadedBy: 'Rudi Wijaya, S.Pd., M.M.',
        uploadedByUserId: 'u-unit-01',
        catatanPengirim: 'Simulasi alokasi jam mengajar guru menyambut penambahan rombel 2026/2027.'
      },
      {
        id: 'file-kur-03',
        laciId: 'laci-kur-c',
        unitId: 'unit-kurikulum',
        namaFile: 'SK_Beban_Mengajar_dan_Jadwal_KBM_Ganjil_2025.pdf',
        ukuranFile: '4.2 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        tahunAjaran: '2025/2026',
        uploadedAt: '2025-07-26 13:45',
        uploadedBy: 'Rudi Wijaya, S.Pd., M.M.',
        uploadedByUserId: 'u-unit-01',
        catatanPengirim: 'Sudah diselaraskan dengan ketersediaan lab komputer dan bengkel praktik.'
      },
      {
        id: 'file-kur-24-03',
        laciId: 'laci-kur-c',
        unitId: 'unit-kurikulum',
        namaFile: 'SK_Pembagian_Tugas_Guru_2024_2025_Final.pdf',
        ukuranFile: '3.8 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        tahunAjaran: '2024/2025',
        uploadedAt: '2024-07-24 15:00',
        uploadedBy: 'Rudi Wijaya, S.Pd., M.M.',
        uploadedByUserId: 'u-unit-01'
      }
    ]
  },
  {
    id: 'laci-kur-d',
    lemariId: 'lemari-kurikulum',
    unitId: 'unit-kurikulum',
    unitName: 'WKS 1 Bidang Kurikulum',
    kodeLaci: 'LACI-D',
    namaLaci: 'Laporan Asesmen Sumatif & Analisis Daya Serap',
    deskripsiTugas: 'Rekapitulasi hasil Penilaian Tengah Semester (PTS) dan Sumatif Akhir Semester beserta analisis daya serap siswa per kompetensi.',
    kategoriJob: 'Evaluasi',
    formatWajib: ['excel', 'pdf'],
    deadline: '2026-10-15',
    isMandatory: false,
    status: 'kosong',
    updatedAt: '2026-09-01 08:00',
    berkasList: []
  },

  // ==========================================
  // 2. WKS 2 KESISWAAN (unit-kesiswaan)
  // ==========================================
  {
    id: 'laci-kes-a',
    lemariId: 'lemari-kesiswaan',
    unitId: 'unit-kesiswaan',
    unitName: 'WKS 2 Bidang Kesiswaan',
    kodeLaci: 'LACI-A',
    namaLaci: 'Laporan Pelaksanaan MPLS Ramah Anak',
    deskripsiTugas: 'Laporan lengkap Masa Pengenalan Lingkungan Sekolah (MPLS) bebas perpeloncoan, materi pencegahan kekerasan, dan profil pelajar pancasila.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['pdf'],
    deadline: '2026-07-30',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Drs. H. Bambang Hartono (Kepala Sekolah)',
    verifiedAt: '2026-08-02 14:00',
    catatanSuperAdmin: 'Kegiatan berjalan tertib dan tidak ada indikasi perpeloncoan. Dilengkapi dokumentasi lengkap.',
    updatedAt: '2026-07-29 16:30',
    berkasList: [
      {
        id: 'file-kes-01',
        laciId: 'laci-kes-a',
        unitId: 'unit-kesiswaan',
        namaFile: 'Laporan_MPLS_Ramah_Anak_2025_2026.pdf',
        ukuranFile: '18.5 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-07-29 16:30',
        uploadedBy: 'Haryanto, S.Pd.',
        uploadedByUserId: 'u-ks-01',
        catatanPengirim: 'Disertai daftar hadir 480 siswa baru dan materi narasumber kepolisian.'
      }
    ]
  },
  {
    id: 'laci-kes-b',
    lemariId: 'lemari-kesiswaan',
    unitId: 'unit-kesiswaan',
    unitName: 'WKS 2 Bidang Kesiswaan',
    kodeLaci: 'LACI-B',
    namaLaci: 'SK Pembina & Program Kerja Ekstrakurikuler',
    deskripsiTugas: 'Surat Keputusan Pembina Ekstrakurikuler, jadwal latihan mingguan (Pramuka, Paskibra, PMR, Robotik, Olahraga), dan presensi siswa.',
    kategoriJob: 'Perencanaan',
    formatWajib: ['pdf', 'docx'],
    deadline: '2026-08-20',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-08-25 10:40',
    catatanSuperAdmin: 'Seluruh 14 cabang ekstrakurikuler telah memiliki pembina resmi bersertifikat.',
    updatedAt: '2026-08-22 11:20',
    berkasList: [
      {
        id: 'file-kes-02',
        laciId: 'laci-kes-b',
        unitId: 'unit-kesiswaan',
        namaFile: 'SK_Pembina_dan_Jadwal_Ekskul_2025_2026.pdf',
        ukuranFile: '5.1 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-08-22 11:20',
        uploadedBy: 'Haryanto, S.Pd.',
        uploadedByUserId: 'u-ks-01'
      }
    ]
  },
  {
    id: 'laci-kes-c',
    lemariId: 'lemari-kesiswaan',
    unitId: 'unit-kesiswaan',
    unitName: 'WKS 2 Bidang Kesiswaan',
    kodeLaci: 'LACI-C',
    namaLaci: 'Buku Catatan Kedisiplinan & Poin Pelanggaran',
    deskripsiTugas: 'Sistem pencatatan poin pelanggaran tata tertib, pemanggilan orang tua, serta penanganan kasus preventif bekerja sama dengan BK.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['excel', 'pdf'],
    deadline: '2026-09-15',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-09-17 14:15',
    catatanSuperAdmin: 'Sistem buku poin digital terpantau rapi dan terkoneksi dengan orang tua.',
    updatedAt: '2026-09-16 15:10',
    berkasList: [
      {
        id: 'file-kes-03',
        laciId: 'laci-kes-c',
        unitId: 'unit-kesiswaan',
        namaFile: 'Rekap_Buku_Poin_Kedisiplinan_Bulan_Agustus_2025.xlsx',
        ukuranFile: '1.4 MB',
        tipeFile: 'excel',
        versi: 'v1.0',
        uploadedAt: '2026-09-16 15:10',
        uploadedBy: 'Haryanto, S.Pd.',
        uploadedByUserId: 'u-ks-01'
      }
    ]
  },
  {
    id: 'laci-kes-d',
    lemariId: 'lemari-kesiswaan',
    unitId: 'unit-kesiswaan',
    unitName: 'WKS 2 Bidang Kesiswaan',
    kodeLaci: 'LACI-D',
    namaLaci: 'Data Prestasi LKS & Rekapitulasi Beasiswa PIP',
    deskripsiTugas: 'Piagam juara Lomba Kompetensi Siswa (LKS) tingkat kota/provinsi dan daftar penyaluran Program Indonesia Pintar (PIP).',
    kategoriJob: 'Pelaporan',
    formatWajib: ['pdf', 'excel'],
    deadline: '2026-10-30',
    isMandatory: false,
    status: 'kosong',
    updatedAt: '2026-09-01 08:00',
    berkasList: []
  },

  // ==========================================
  // 3. WKS 3 SARANA PRASARANA (unit-sarpras)
  // ==========================================
  {
    id: 'laci-sar-a',
    lemariId: 'lemari-sarpras',
    unitId: 'unit-sarpras',
    unitName: 'WKS 3 Bidang Sarana & Prasarana',
    kodeLaci: 'LACI-A',
    namaLaci: 'Buku Induk Inventaris Barang & Aset Ruang',
    deskripsiTugas: 'Daftar inventaris sarana dan prasarana per ruangan (KIR), nomor kode barang negara/daerah, dan kondisi kelayakan (Baik, Rusak Ringan, Rusak Berat).',
    kategoriJob: 'Perencanaan',
    formatWajib: ['excel', 'pdf'],
    deadline: '2026-08-30',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Drs. H. Mulyadi (SPI)',
    verifiedAt: '2026-09-02 13:20',
    catatanSuperAdmin: 'Sesuai dengan audit fisik tim SPI. 100% ruang sudah memiliki Kartu Inventaris Ruang (KIR).',
    updatedAt: '2026-08-29 11:00',
    berkasList: [
      {
        id: 'file-sar-01',
        laciId: 'laci-sar-a',
        unitId: 'unit-sarpras',
        namaFile: 'Buku_Induk_Inventaris_Aset_Sekolah_2025.xlsx',
        ukuranFile: '6.8 MB',
        tipeFile: 'excel',
        versi: 'v1.0',
        uploadedAt: '2026-08-29 11:00',
        uploadedBy: 'Ir. Agus Santoso',
        uploadedByUserId: 'u-unit-03'
      }
    ]
  },
  {
    id: 'laci-sar-b',
    lemariId: 'lemari-sarpras',
    unitId: 'unit-sarpras',
    unitName: 'WKS 3 Bidang Sarana & Prasarana',
    kodeLaci: 'LACI-B',
    namaLaci: 'Jadwal Pemeliharaan Gedung & Sanitasi Berkala',
    deskripsiTugas: 'Program pemeliharaan sarana (AC, kelistrikan genset, instalasi air bersih, pengecatan, sanitasi toilet siswa) dan checklist log harian kebersihan.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['pdf'],
    deadline: '2026-09-05',
    isMandatory: true,
    status: 'revisi',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-09-08 14:50',
    catatanSuperAdmin: 'Log perawatan AC lab komputer lantai 2 belum dicantumkan tanda tangan teknisi servis vendor. Harap minta bukti nota servis dan lampirkan.',
    updatedAt: '2026-09-06 10:15',
    berkasList: [
      {
        id: 'file-sar-02',
        laciId: 'laci-sar-b',
        unitId: 'unit-sarpras',
        namaFile: 'Jadwal_dan_Log_Perawatan_Fasilitas_2025.pdf',
        ukuranFile: '3.9 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-06 10:15',
        uploadedBy: 'Ir. Agus Santoso',
        uploadedByUserId: 'u-unit-03'
      }
    ]
  },
  {
    id: 'laci-sar-c',
    lemariId: 'lemari-sarpras',
    unitId: 'unit-sarpras',
    unitName: 'WKS 3 Bidang Sarana & Prasarana',
    kodeLaci: 'LACI-C',
    namaLaci: 'SOP Keselamatan Kerja (K3) & Sertifikat APAR',
    deskripsiTugas: 'Pemasangan rambu K3 di seluruh bengkel/lab, penempatan tabung APAR bersertifikat masa uji aktif, dan jalur evakuasi gempa/kebakaran.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['pdf', 'image'],
    deadline: '2026-09-15',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Ahmad Fauzi (Anggota TPMPS)',
    verifiedAt: '2026-09-16 09:45',
    catatanSuperAdmin: 'Semua 24 tabung APAR telah dilakukan pengisian ulang dan stiker inspeksi Damkar berlaku hingga 2027.',
    updatedAt: '2026-09-15 15:30',
    berkasList: [
      {
        id: 'file-sar-03',
        laciId: 'laci-sar-c',
        unitId: 'unit-sarpras',
        namaFile: 'SOP_K3_Bengkel_dan_Sertifikat_Uji_APAR.pdf',
        ukuranFile: '8.1 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-15 15:30',
        uploadedBy: 'Ir. Agus Santoso',
        uploadedByUserId: 'u-unit-03'
      }
    ]
  },
  {
    id: 'laci-sar-d',
    lemariId: 'lemari-sarpras',
    unitId: 'unit-sarpras',
    unitName: 'WKS 3 Bidang Sarana & Prasarana',
    kodeLaci: 'LACI-D',
    namaLaci: 'Rencana Kebutuhan Sarana (RKAS Modal)',
    deskripsiTugas: 'Daftar prioritas usulan pengadaan alat praktik standar industri untuk tahun anggaran mendatang.',
    kategoriJob: 'Perencanaan',
    formatWajib: ['excel', 'pdf'],
    deadline: '2026-11-15',
    isMandatory: false,
    status: 'kosong',
    updatedAt: '2026-09-01 08:00',
    berkasList: []
  },

  // ==========================================
  // 4. WKS 4 HUBIN & BKK (unit-hubin)
  // ==========================================
  {
    id: 'laci-hub-a',
    lemariId: 'lemari-hubin',
    unitId: 'unit-hubin',
    unitName: 'WKS 4 Hubungan Industri & BKK',
    kodeLaci: 'LACI-A',
    namaLaci: 'Naskah MoU Kemitraan Dunia Kerja (IDUKA)',
    deskripsiTugas: 'Daftar naskah Memorandum of Understanding (MoU) aktif dengan industri skala regional & nasional yang mencakup 8 aspek link and match.',
    kategoriJob: 'Perencanaan',
    formatWajib: ['pdf', 'link'],
    deadline: '2026-08-30',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-09-03 10:00',
    catatanSuperAdmin: 'Memiliki 42 MoU aktif, 100% prodi telah terhubung dengan industri kelas A.',
    updatedAt: '2026-09-01 14:00',
    berkasList: [
      {
        id: 'file-hub-26-01',
        laciId: 'laci-hub-a',
        unitId: 'unit-hubin',
        namaFile: 'MoU_Kerjasama_Baru_PT_Telkom_dan_Metrodata_2026_2027.pdf',
        ukuranFile: '18.4 MB',
        tipeFile: 'pdf',
        versi: 'v1.0-draft',
        tahunAjaran: '2026/2027',
        uploadedAt: '2026-09-17 14:00',
        uploadedBy: 'Dewi Sartika, S.T., M.Eng.',
        uploadedByUserId: 'u-unit-04',
        catatanPengirim: 'Perpanjangan dan ekspansi MoU kelas industri baru periode 2026-2029.'
      },
      {
        id: 'file-hub-01',
        laciId: 'laci-hub-a',
        unitId: 'unit-hubin',
        namaFile: 'Kompilasi_MoU_42_Industri_Mitra_2025_2026.pdf',
        ukuranFile: '34.2 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        tahunAjaran: '2025/2026',
        uploadedAt: '2025-09-01 14:00',
        uploadedBy: 'Dewi Sartika, S.T., M.Eng.',
        uploadedByUserId: 'u-unit-04'
      },
      {
        id: 'file-hub-24-01',
        laciId: 'laci-hub-a',
        unitId: 'unit-hubin',
        namaFile: 'Arsip_Laporan_Kemitraan_Industri_Tahun_2024_2025.pdf',
        ukuranFile: '24.1 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        tahunAjaran: '2024/2025',
        uploadedAt: '2024-08-25 11:30',
        uploadedBy: 'Dewi Sartika, S.T., M.Eng.',
        uploadedByUserId: 'u-unit-04'
      }
    ]
  },
  {
    id: 'laci-hub-b',
    lemariId: 'lemari-hubin',
    unitId: 'unit-hubin',
    unitName: 'WKS 4 Hubungan Industri & BKK',
    kodeLaci: 'LACI-B',
    namaLaci: 'SK Pembimbing & Penempatan PKL 6 Bulan',
    deskripsiTugas: 'Surat tugas guru pembimbing PKL, daftar pemetaan siswa magang di 68 perusahaan mitra, dan buku jurnal monitoring PKL.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['pdf', 'excel'],
    deadline: '2026-09-05',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Drs. H. Bambang Hartono (Kepala Sekolah)',
    verifiedAt: '2026-09-08 11:20',
    catatanSuperAdmin: 'Penempatan PKL periode Juli - Desember 2025 tervalidasi 100% terlindungi BPJS Ketenagakerjaan.',
    updatedAt: '2026-09-07 10:15',
    berkasList: [
      {
        id: 'file-hub-26-02',
        laciId: 'laci-hub-b',
        unitId: 'unit-hubin',
        namaFile: 'Rencana_Penempatan_PKL_Siswa_Angkatan_2026_2027.xlsx',
        ukuranFile: '3.4 MB',
        tipeFile: 'excel',
        versi: 'v0.1',
        tahunAjaran: '2026/2027',
        uploadedAt: '2026-09-15 09:30',
        uploadedBy: 'Dewi Sartika, S.T., M.Eng.',
        uploadedByUserId: 'u-unit-04',
        catatanPengirim: 'Pemetaan kuota magang industri 6 bulan untuk tahun pelajaran 2026/2027.'
      },
      {
        id: 'file-hub-02',
        laciId: 'laci-hub-b',
        unitId: 'unit-hubin',
        namaFile: 'Data_Penempatan_dan_SK_Pembimbing_PKL_2025.pdf',
        ukuranFile: '7.5 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        tahunAjaran: '2025/2026',
        uploadedAt: '2025-09-07 10:15',
        uploadedBy: 'Dewi Sartika, S.T., M.Eng.',
        uploadedByUserId: 'u-unit-04'
      },
      {
        id: 'file-hub-24-02',
        laciId: 'laci-hub-b',
        unitId: 'unit-hubin',
        namaFile: 'Laporan_Tracer_Study_BMW_Kelulusan_2024.xlsx',
        ukuranFile: '5.2 MB',
        tipeFile: 'excel',
        versi: 'v1.0',
        tahunAjaran: '2024/2025',
        uploadedAt: '2024-10-18 16:45',
        uploadedBy: 'Dewi Sartika, S.T., M.Eng.',
        uploadedByUserId: 'u-unit-04',
        catatanPengirim: 'Tracer study keterserapan BMW alumni 2024 mencapai 89.4%.'
      }
    ]
  },
  {
    id: 'laci-hub-c',
    lemariId: 'lemari-hubin',
    unitId: 'unit-hubin',
    unitName: 'WKS 4 Hubungan Industri & BKK',
    kodeLaci: 'LACI-C',
    namaLaci: 'Laporan Tracer Study & Keterserapan Alumni (BMW)',
    deskripsiTugas: 'Hasil survei pelacakan lulusan 1 tahun setelah tamat: persentase Bekerja (minimal UMR), Melanjutkan ke PTN/PTS, dan Wirausaha mandiri.',
    kategoriJob: 'Pelaporan',
    formatWajib: ['pdf', 'excel', 'link'],
    deadline: '2026-09-10',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-09-14 16:10',
    catatanSuperAdmin: 'Tingkat respon tracer study mencapai 91.4% dengan tingkat keterserapan BMW 88.5%. Melampaui target nasional.',
    updatedAt: '2026-09-12 13:40',
    berkasList: [
      {
        id: 'file-hub-03',
        laciId: 'laci-hub-c',
        unitId: 'unit-hubin',
        namaFile: 'Laporan_Analisis_Tracer_Study_Angkatan_2025.pdf',
        ukuranFile: '5.6 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-12 13:40',
        uploadedBy: 'Dewi Sartika, S.T., M.Eng.',
        uploadedByUserId: 'u-unit-04'
      }
    ]
  },
  {
    id: 'laci-hub-d',
    lemariId: 'lemari-hubin',
    unitId: 'unit-hubin',
    unitName: 'WKS 4 Hubungan Industri & BKK',
    kodeLaci: 'LACI-D',
    namaLaci: 'Program Guru Tamu Industri & Job Fair Sekolah',
    deskripsiTugas: 'Laporan kehadiran praktisi industri mengajar minimal 50 JP per semester per program keahlian dan dokumentasi Job Fair tahunan.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['pdf', 'link'],
    deadline: '2026-09-15',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-09-18 16:20',
    catatanSuperAdmin: 'Program guru tamu telah terlaksana di seluruh 6 prodi dengan narasumber bersertifikasi industri.',
    updatedAt: '2026-09-17 15:50',
    berkasList: [
      {
        id: 'file-hub-04',
        laciId: 'laci-hub-d',
        unitId: 'unit-hubin',
        namaFile: 'Laporan_Guru_Tamu_Industri_dan_JobFair_2025.pdf',
        ukuranFile: '12.1 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-17 15:50',
        uploadedBy: 'Dewi Sartika, S.T., M.Eng.',
        uploadedByUserId: 'u-unit-04'
      }
    ]
  },

  // ==========================================
  // 5. TATA USAHA (unit-tu)
  // ==========================================
  {
    id: 'laci-tu-a',
    lemariId: 'lemari-tu',
    unitId: 'unit-tu',
    unitName: 'Tata Usaha & Kepegawaian',
    kodeLaci: 'LACI-A',
    namaLaci: 'Daftar Urut Kepangkatan (DUK) & Berkas ASN/PPPK',
    deskripsiTugas: 'Daftar urut kepangkatan seluruh guru & tendik, SK kenaikan pangkat/gaji berkala, dan rekapitulasi data SIMPEG Dapodik.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['excel', 'pdf'],
    deadline: '2026-08-30',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Drs. H. Bambang Hartono (Kepala Sekolah)',
    verifiedAt: '2026-09-05 10:15',
    catatanSuperAdmin: 'Data kepegawaian sinkron dengan info GTK dan Dapodik Kemendikbud.',
    updatedAt: '2026-09-04 11:30',
    berkasList: [
      {
        id: 'file-tu-01',
        laciId: 'laci-tu-a',
        unitId: 'unit-tu',
        namaFile: 'DUK_dan_Rekap_Kepegawaian_SMK_2025.xlsx',
        ukuranFile: '3.2 MB',
        tipeFile: 'excel',
        versi: 'v1.0',
        uploadedAt: '2026-09-04 11:30',
        uploadedBy: 'Sri Rahayu, S.Sos.',
        uploadedByUserId: 'u-unit-01'
      }
    ]
  },
  {
    id: 'laci-tu-b',
    lemariId: 'lemari-tu',
    unitId: 'unit-tu',
    unitName: 'Tata Usaha & Kepegawaian',
    kodeLaci: 'LACI-B',
    namaLaci: 'Buku Agenda Surat Masuk & Surat Keluar',
    deskripsiTugas: 'Pencatatan persuratan dinas resmi keluar dan masuk lengkap dengan disposisi kepala sekolah dalam format digital.',
    kategoriJob: 'Pelaporan',
    formatWajib: ['excel', 'pdf'],
    deadline: '2026-09-10',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-09-15 11:10',
    catatanSuperAdmin: 'Sistem penomoran surat tertib sesuai tata naskah dinas provinsi.',
    updatedAt: '2026-09-14 09:20',
    berkasList: [
      {
        id: 'file-tu-02',
        laciId: 'laci-tu-b',
        unitId: 'unit-tu',
        namaFile: 'Agenda_Surat_Dinas_Semester_Ganjil_2025.pdf',
        ukuranFile: '4.8 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-14 09:20',
        uploadedBy: 'Sri Rahayu, S.Sos.',
        uploadedByUserId: 'u-unit-01'
      }
    ]
  },
  {
    id: 'laci-tu-c',
    lemariId: 'lemari-tu',
    unitId: 'unit-tu',
    unitName: 'Tata Usaha & Kepegawaian',
    kodeLaci: 'LACI-C',
    namaLaci: 'Laporan Buku Induk Siswa & Mutasi Peserta Didik',
    deskripsiTugas: 'Rekapitulasi nomor induk siswa nasional (NISN), mutasi masuk/keluar, dan arsip ijazah/blanko kelulusan.',
    kategoriJob: 'Evaluasi',
    formatWajib: ['excel', 'pdf'],
    deadline: '2026-10-20',
    isMandatory: false,
    status: 'kosong',
    updatedAt: '2026-09-01 08:00',
    berkasList: []
  },

  // ==========================================
  // 6. BIMBINGAN KONSELING (unit-bk)
  // ==========================================
  {
    id: 'laci-bk-a',
    lemariId: 'lemari-bk',
    unitId: 'unit-bk',
    unitName: 'Bimbingan Konseling (BK)',
    kodeLaci: 'LACI-A',
    namaLaci: 'Program Kerja Pelayanan BK Komprehensif',
    deskripsiTugas: 'Rencana kerja operasional layanan BK (bimbingan klasikal, bimbingan kelompok, konseling individual, dan home visit).',
    kategoriJob: 'Perencanaan',
    formatWajib: ['pdf'],
    deadline: '2026-08-15',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-08-22 13:00',
    catatanSuperAdmin: 'Program layanan selaras dengan pencegahan bullying dan penguatan kesehatan mental siswa.',
    updatedAt: '2026-08-19 10:45',
    berkasList: [
      {
        id: 'file-bk-01',
        laciId: 'laci-bk-a',
        unitId: 'unit-bk',
        namaFile: 'Program_Pelayanan_BK_SMK_2025_2026.pdf',
        ukuranFile: '5.2 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-08-19 10:45',
        uploadedBy: 'Dra. Nurhayati, M.Si.',
        uploadedByUserId: 'u-unit-01'
      }
    ]
  },
  {
    id: 'laci-bk-b',
    lemariId: 'lemari-bk',
    unitId: 'unit-bk',
    unitName: 'Bimbingan Konseling (BK)',
    kodeLaci: 'LACI-B',
    namaLaci: 'Sosiometri & Peta Kerawanan Masalah Siswa',
    deskripsiTugas: 'Analisis sosiometri kelas X & XI untuk mendeteksi potensi konflik antarsiswa, indikasi putus sekolah, serta masalah ekonomi.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['pdf', 'excel'],
    deadline: '2026-09-10',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Drs. H. Bambang Hartono (Kepala Sekolah)',
    verifiedAt: '2026-09-17 13:05',
    catatanSuperAdmin: 'Peta kerawanan sangat detail sehingga tindakan intervensi dini dapat dilakukan secara tepat sasaran.',
    updatedAt: '2026-09-16 14:20',
    berkasList: [
      {
        id: 'file-bk-02',
        laciId: 'laci-bk-b',
        unitId: 'unit-bk',
        namaFile: 'Peta_Kerawanan_dan_Sosiometri_Siswa_2025.pdf',
        ukuranFile: '4.1 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-16 14:20',
        uploadedBy: 'Dra. Nurhayati, M.Si.',
        uploadedByUserId: 'u-unit-01'
      }
    ]
  },
  {
    id: 'laci-bk-c',
    lemariId: 'lemari-bk',
    unitId: 'unit-bk',
    unitName: 'Bimbingan Konseling (BK)',
    kodeLaci: 'LACI-C',
    namaLaci: 'Rekapitulasi Konseling Individual & Home Visit',
    deskripsiTugas: 'Rekap kasus konseling individual yang telah tertangani dengan menjaga kerahasiaan identitas siswa (kode anonim).',
    kategoriJob: 'Pelaporan',
    formatWajib: ['pdf'],
    deadline: '2026-09-15',
    isMandatory: true,
    status: 'revisi',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-09-17 10:10',
    catatanSuperAdmin: 'Beberapa laporan penanganan kasus masih belum mencantumkan tindak lanjut rekomendasi guru wali kelas. Harap lengkapi.',
    updatedAt: '2026-09-15 11:30',
    berkasList: [
      {
        id: 'file-bk-03',
        laciId: 'laci-bk-c',
        unitId: 'unit-bk',
        namaFile: 'Rekap_Konseling_Anonim_Agustus_2025.pdf',
        ukuranFile: '2.7 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-15 11:30',
        uploadedBy: 'Dra. Nurhayati, M.Si.',
        uploadedByUserId: 'u-unit-01'
      }
    ]
  },

  // ==========================================
  // 7. PERPUSTAKAAN (unit-perpustakaan)
  // ==========================================
  {
    id: 'laci-perpus-a',
    lemariId: 'lemari-perpustakaan',
    unitId: 'unit-perpustakaan',
    unitName: 'Perpustakaan Digital Sekolah',
    kodeLaci: 'LACI-A',
    namaLaci: 'Katalog Buku Perpustakaan & Langganan e-Book',
    deskripsiTugas: 'Daftar judul buku teks kurikulum merdeka, referensi kejuruan, dan akun lisensi e-library sekolah.',
    kategoriJob: 'Perencanaan',
    formatWajib: ['excel', 'pdf', 'link'],
    deadline: '2026-08-30',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Ahmad Fauzi (Anggota TPMPS)',
    verifiedAt: '2026-09-05 14:10',
    catatanSuperAdmin: 'Koleksi buku teks wajib sudah mencapai 100% rasio 1 siswa 1 buku.',
    updatedAt: '2026-09-03 09:15',
    berkasList: [
      {
        id: 'file-perpus-01',
        laciId: 'laci-perpus-a',
        unitId: 'unit-perpustakaan',
        namaFile: 'Katalog_Buku_dan_Langganan_eLibrary_2025.xlsx',
        ukuranFile: '5.2 MB',
        tipeFile: 'excel',
        versi: 'v1.0',
        uploadedAt: '2026-09-03 09:15',
        uploadedBy: 'Endang Setiawati, S.I.Pust.',
        uploadedByUserId: 'u-unit-01'
      }
    ]
  },
  {
    id: 'laci-perpus-b',
    lemariId: 'lemari-perpustakaan',
    unitId: 'unit-perpustakaan',
    unitName: 'Perpustakaan Digital Sekolah',
    kodeLaci: 'LACI-B',
    namaLaci: 'Statistik Kunjungan & Sirkulasi Peminjaman',
    deskripsiTugas: 'Grafik bulanan jumlah kunjungan siswa/guru dan buku yang dipinjam baik fisik maupun platform digital.',
    kategoriJob: 'Pelaporan',
    formatWajib: ['pdf', 'excel'],
    deadline: '2026-09-15',
    isMandatory: true,
    status: 'menunggu_verifikasi',
    updatedAt: '2026-09-14 15:40',
    berkasList: [
      {
        id: 'file-perpus-02',
        laciId: 'laci-perpus-b',
        unitId: 'unit-perpustakaan',
        namaFile: 'Statistik_Kunjungan_dan_Peminjaman_Bulan_Agustus.pdf',
        ukuranFile: '3.1 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-14 15:40',
        uploadedBy: 'Endang Setiawati, S.I.Pust.',
        uploadedByUserId: 'u-unit-01',
        catatanPengirim: 'Tingkat peminjaman buku kejuruan PPLG & TJKT meningkat 25% pasca peluncuran e-library.'
      }
    ]
  },
  {
    id: 'laci-perpus-c',
    lemariId: 'lemari-perpustakaan',
    unitId: 'unit-perpustakaan',
    unitName: 'Perpustakaan Digital Sekolah',
    kodeLaci: 'LACI-C',
    namaLaci: 'Program Gerakan Literasi Sekolah (GLS)',
    deskripsiTugas: 'Dokumentasi kegiatan 15 menit membaca sebelum KBM, pojok baca kelas, dan festival bedah buku siswa.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['pdf', 'link'],
    deadline: '2026-10-10',
    isMandatory: false,
    status: 'kosong',
    updatedAt: '2026-09-01 08:00',
    berkasList: []
  },

  // ==========================================
  // 8. LABORATORIUM KOMPUTER (unit-lab)
  // ==========================================
  {
    id: 'laci-lab-a',
    lemariId: 'lemari-lab',
    unitId: 'unit-lab',
    unitName: 'Laboratorium & Bengkel Komputer',
    kodeLaci: 'LACI-A',
    namaLaci: 'Jadwal Pemakaian & SOP Keselamatan Lab Komputer',
    deskripsiTugas: 'Jadwal rotasi 6 lab komputer untuk praktikum, ANBK, dan UKK, dilengkapi tata tertib pemakaian komputer.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['pdf'],
    deadline: '2026-08-20',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-08-28 11:00',
    catatanSuperAdmin: 'Alokasi penggunaan lab sudah optimal, tidak terjadi tabrakan jam.',
    updatedAt: '2026-08-25 14:10',
    berkasList: [
      {
        id: 'file-lab-01',
        laciId: 'laci-lab-a',
        unitId: 'unit-lab',
        namaFile: 'Jadwal_Penggunaan_dan_SOP_6_Lab_Komputer_2025.pdf',
        ukuranFile: '4.5 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-08-25 14:10',
        uploadedBy: 'Kurniawan, S.T.',
        uploadedByUserId: 'u-tpmps-02'
      }
    ]
  },
  {
    id: 'laci-lab-b',
    lemariId: 'lemari-lab',
    unitId: 'unit-lab',
    unitName: 'Laboratorium & Bengkel Komputer',
    kodeLaci: 'LACI-B',
    namaLaci: 'Logbook Perawatan Hardware & Lisensi Software',
    deskripsiTugas: 'Kartu riwayat pemeliharaan berkala 210 unit PC, spesifikasi RAM/SSD, antivirus, dan lisensi OS / aplikasi edukasi.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['excel', 'pdf'],
    deadline: '2026-09-10',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Ahmad Fauzi (Anggota TPMPS)',
    verifiedAt: '2026-09-16 11:20',
    catatanSuperAdmin: 'Pengecekan fisik sesuai logbook. Seluruh PC lab 1 - lab 6 beroperasi normal.',
    updatedAt: '2026-09-15 16:30',
    berkasList: [
      {
        id: 'file-lab-02',
        laciId: 'laci-lab-b',
        unitId: 'unit-lab',
        namaFile: 'Logbook_Perawatan_Hardware_dan_Lisensi_Software_2025.xlsx',
        ukuranFile: '2.9 MB',
        tipeFile: 'excel',
        versi: 'v1.0',
        uploadedAt: '2026-09-15 16:30',
        uploadedBy: 'Kurniawan, S.T.',
        uploadedByUserId: 'u-tpmps-02'
      }
    ]
  },
  {
    id: 'laci-lab-c',
    lemariId: 'lemari-lab',
    unitId: 'unit-lab',
    unitName: 'Laboratorium & Bengkel Komputer',
    kodeLaci: 'LACI-C',
    namaLaci: 'Berita Acara Uji Kesiapan Jaringan ANBK & UKK',
    deskripsiTugas: 'Laporan simulasi bandwidth internet 300 Mbps, stabilitas server lokal, dan genset cadangan darurat.',
    kategoriJob: 'Evaluasi',
    formatWajib: ['pdf'],
    deadline: '2026-10-05',
    isMandatory: false,
    status: 'kosong',
    updatedAt: '2026-09-01 08:00',
    berkasList: []
  },

  // ==========================================
  // 9. PRODI PPLG / RPL (unit-pplg)
  // ==========================================
  {
    id: 'laci-pplg-a',
    lemariId: 'lemari-pplg',
    unitId: 'unit-pplg',
    unitName: 'Kaprodi PPLG (RPL / Software)',
    kodeLaci: 'LACI-A',
    namaLaci: 'Sinkronisasi Kurikulum Berbasis Software House',
    deskripsiTugas: 'Berita acara penyelarasan materi coding modern (Next.js, TypeScript, Flutter, PostgreSQL) bersama PT Telkom & Software House mitra.',
    kategoriJob: 'Perencanaan',
    formatWajib: ['pdf', 'link'],
    deadline: '2026-08-25',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-08-30 09:30',
    catatanSuperAdmin: 'Materi coding sangat up-to-date dengan kebutuhan industri software masa kini.',
    updatedAt: '2026-08-28 15:20',
    berkasList: [
      {
        id: 'file-pplg-01',
        laciId: 'laci-pplg-a',
        unitId: 'unit-pplg',
        namaFile: 'Sinkronisasi_Kurikulum_PPLG_SoftwareHouse_2025.pdf',
        ukuranFile: '9.4 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-08-28 15:20',
        uploadedBy: 'Eko Prasetyo, M.Kom.',
        uploadedByUserId: 'u-tpmps-02'
      }
    ]
  },
  {
    id: 'laci-pplg-b',
    lemariId: 'lemari-pplg',
    unitId: 'unit-pplg',
    unitName: 'Kaprodi PPLG (RPL / Software)',
    kodeLaci: 'LACI-B',
    namaLaci: 'Portofolio Project-Based Learning (PjBL) Siswa',
    deskripsiTugas: 'Kumpulan tautan GitHub repository dan live demo aplikasi web/mobile pesanan klien nyata yang dibuat oleh kelompok siswa.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['pdf', 'link'],
    deadline: '2026-09-10',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Drs. H. Bambang Hartono (Kepala Sekolah)',
    verifiedAt: '2026-09-15 13:00',
    catatanSuperAdmin: 'Kualitas portofolio sangat memuaskan, 5 aplikasi siswa sudah digunakan oleh UMKM lokal.',
    updatedAt: '2026-09-12 11:40',
    berkasList: [
      {
        id: 'file-pplg-02',
        laciId: 'laci-pplg-b',
        unitId: 'unit-pplg',
        namaFile: 'Portofolio_12_Aplikasi_PjBL_Siswa_PPLG_2025.pdf',
        ukuranFile: '16.7 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-12 11:40',
        uploadedBy: 'Eko Prasetyo, M.Kom.',
        uploadedByUserId: 'u-tpmps-02'
      }
    ]
  },
  {
    id: 'laci-pplg-c',
    lemariId: 'lemari-pplg',
    unitId: 'unit-pplg',
    unitName: 'Kaprodi PPLG (RPL / Software)',
    kodeLaci: 'LACI-C',
    namaLaci: 'Perangkat Uji Kompetensi Keahlian (UKK Mandiri/BNSP)',
    deskripsiTugas: 'Soal instrumen UKK, rubrik penilaian asesor industri eksternal, dan jadwal uji sertifikasi junior web programmer.',
    kategoriJob: 'Evaluasi',
    formatWajib: ['pdf', 'docx'],
    deadline: '2026-09-15',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Dr. Surya Adi (LSP P-1)',
    verifiedAt: '2026-09-18 14:00',
    catatanSuperAdmin: 'Skema sertifikasi selaras dengan standar BNSP skema Pemrograman Terstruktur.',
    updatedAt: '2026-09-17 10:20',
    berkasList: [
      {
        id: 'file-pplg-03',
        laciId: 'laci-pplg-c',
        unitId: 'unit-pplg',
        namaFile: 'Instrumen_dan_Rubrik_UKK_BNSP_RPL_2025.pdf',
        ukuranFile: '4.8 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-17 10:20',
        uploadedBy: 'Eko Prasetyo, M.Kom.',
        uploadedByUserId: 'u-tpmps-02'
      }
    ]
  },
  {
    id: 'laci-pplg-d',
    lemariId: 'lemari-pplg',
    unitId: 'unit-pplg',
    unitName: 'Kaprodi PPLG (RPL / Software)',
    kodeLaci: 'LACI-D',
    namaLaci: 'Laporan Kelas Industri & Magang Guru Kejuruan',
    deskripsiTugas: 'Sertifikat magang industri guru selama 1 bulan dan laporan evaluasi kurikulum kelas khusus software engineer.',
    kategoriJob: 'Pelaporan',
    formatWajib: ['pdf'],
    deadline: '2026-09-18',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-09-18 14:00',
    catatanSuperAdmin: '3 guru kejuruan PPLG telah menyelesaikan magang industri dan mengantongi sertifikat kompetensi internasional.',
    updatedAt: '2026-09-18 11:30',
    berkasList: [
      {
        id: 'file-pplg-04',
        laciId: 'laci-pplg-d',
        unitId: 'unit-pplg',
        namaFile: 'Laporan_Magang_Guru_dan_Kelas_Industri_PPLG_2025.pdf',
        ukuranFile: '8.3 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-18 11:30',
        uploadedBy: 'Eko Prasetyo, M.Kom.',
        uploadedByUserId: 'u-tpmps-02'
      }
    ]
  },

  // ==========================================
  // 10. PRODI TJKT (unit-tjkt)
  // ==========================================
  {
    id: 'laci-tjkt-a',
    lemariId: 'lemari-tjkt',
    unitId: 'unit-tjkt',
    unitName: 'Kaprodi TJKT (Jaringan & Telco)',
    kodeLaci: 'LACI-A',
    namaLaci: 'Silabus Mikrotik Academy & Kurikulum Cisco',
    deskripsiTugas: 'Penyelarasan silabus sertifikasi MTCNA / CCNA ke dalam jam pelajaran mata pelajaran konsentrasi keahlian TJKT.',
    kategoriJob: 'Perencanaan',
    formatWajib: ['pdf'],
    deadline: '2026-08-25',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-08-30 11:15',
    catatanSuperAdmin: 'Laboratorium telah terakreditasi sebagai Mikrotik Academy Training Partner.',
    updatedAt: '2026-08-27 13:40',
    berkasList: [
      {
        id: 'file-tjkt-01',
        laciId: 'laci-tjkt-a',
        unitId: 'unit-tjkt',
        namaFile: 'Silabus_Mikrotik_Academy_MTCNA_2025.pdf',
        ukuranFile: '6.2 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-08-27 13:40',
        uploadedBy: 'Wahyu Nugroho, S.T.',
        uploadedByUserId: 'u-unit-03'
      }
    ]
  },
  {
    id: 'laci-tjkt-b',
    lemariId: 'lemari-tjkt',
    unitId: 'unit-tjkt',
    unitName: 'Kaprodi TJKT (Jaringan & Telco)',
    kodeLaci: 'LACI-B',
    namaLaci: 'Job Sheet Praktikum Fiber Optic & Server Linux',
    deskripsiTugas: 'Modul praktikum penyambungan kabel fiber optik (splicer), OTDR, dan konfigurasi server debian/proxmox.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['pdf'],
    deadline: '2026-09-10',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Ahmad Fauzi (Anggota TPMPS)',
    verifiedAt: '2026-09-15 10:20',
    catatanSuperAdmin: 'Lengkap dengan lembar evaluasi K3 pemakaian laser fiber optik.',
    updatedAt: '2026-09-13 14:10',
    berkasList: [
      {
        id: 'file-tjkt-02',
        laciId: 'laci-tjkt-b',
        unitId: 'unit-tjkt',
        namaFile: 'JobSheet_Praktik_FO_dan_Linux_Server_2025.pdf',
        ukuranFile: '11.4 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-13 14:10',
        uploadedBy: 'Wahyu Nugroho, S.T.',
        uploadedByUserId: 'u-unit-03'
      }
    ]
  },
  {
    id: 'laci-tjkt-c',
    lemariId: 'lemari-tjkt',
    unitId: 'unit-tjkt',
    unitName: 'Kaprodi TJKT (Jaringan & Telco)',
    kodeLaci: 'LACI-C',
    namaLaci: 'Data Kelulusan Sertifikasi BNSP Teknisi Jaringan',
    deskripsiTugas: 'Rekapitulasi nomor registrasi sertifikat kompetensi siswa yang lulus asesmen LSP P-1 skema Teknisi Utama Jaringan Komputer.',
    kategoriJob: 'Pelaporan',
    formatWajib: ['excel', 'pdf'],
    deadline: '2026-09-17',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Dr. Surya Adi (LSP P-1)',
    verifiedAt: '2026-09-17 16:50',
    catatanSuperAdmin: '94% siswa kelas XII berhasil lulus sertifikasi BNSP gelombang I.',
    updatedAt: '2026-09-17 09:30',
    berkasList: [
      {
        id: 'file-tjkt-03',
        laciId: 'laci-tjkt-c',
        unitId: 'unit-tjkt',
        namaFile: 'Rekap_Sertifikasi_BNSP_TJKT_Angkatan_2025.xlsx',
        ukuranFile: '1.8 MB',
        tipeFile: 'excel',
        versi: 'v1.0',
        uploadedAt: '2026-09-17 09:30',
        uploadedBy: 'Wahyu Nugroho, S.T.',
        uploadedByUserId: 'u-unit-03'
      }
    ]
  },
  {
    id: 'laci-tjkt-d',
    lemariId: 'lemari-tjkt',
    unitId: 'unit-tjkt',
    unitName: 'Kaprodi TJKT (Jaringan & Telco)',
    kodeLaci: 'LACI-D',
    namaLaci: 'Proposal Pengadaan Switch Managed & Router Core',
    deskripsiTugas: 'Rincian spesifikasi teknis dan RAB pengadaan switch managed 24 port gigabit untuk bengkel praktik.',
    kategoriJob: 'Perencanaan',
    formatWajib: ['excel', 'pdf'],
    deadline: '2026-10-25',
    isMandatory: false,
    status: 'kosong',
    updatedAt: '2026-09-01 08:00',
    berkasList: []
  },

  // ==========================================
  // 11. PRODI DKV (unit-dkv)
  // ==========================================
  {
    id: 'laci-dkv-a',
    lemariId: 'lemari-dkv',
    unitId: 'unit-dkv',
    unitName: 'Kaprodi Desain Komunikasi Visual',
    kodeLaci: 'LACI-A',
    namaLaci: 'Katalog Portofolio Desain Grafis & Motion Komersial',
    deskripsiTugas: 'Kompilasi karya desain identitas visual (logo, packaging produk, maskot) dan video motion grafis siswa untuk UMKM mitra.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['pdf', 'link'],
    deadline: '2026-08-30',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Drs. H. Bambang Hartono (Kepala Sekolah)',
    verifiedAt: '2026-09-04 15:20',
    catatanSuperAdmin: 'Kualitas karya siswa sangat estetis dan memenuhi standar agensi kreatif.',
    updatedAt: '2026-09-02 11:00',
    berkasList: [
      {
        id: 'file-dkv-01',
        laciId: 'laci-dkv-a',
        unitId: 'unit-dkv',
        namaFile: 'Katalog_Portofolio_Karya_DKV_2025.pdf',
        ukuranFile: '42.6 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-02 11:00',
        uploadedBy: 'Maya Safitri, M.Ds.',
        uploadedByUserId: 'u-unit-01'
      }
    ]
  },
  {
    id: 'laci-dkv-b',
    lemariId: 'lemari-dkv',
    unitId: 'unit-dkv',
    unitName: 'Kaprodi Desain Komunikasi Visual',
    kodeLaci: 'LACI-B',
    namaLaci: 'SOP Studio Fotografi, Videografi, & Podcast',
    deskripsiTugas: 'Panduan operasional pemakaian kamera mirrorless, pencahayaan softbox studio, dan alat perekam suara podcast sekolah.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['pdf'],
    deadline: '2026-09-10',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-09-17 11:30',
    catatanSuperAdmin: 'SOP tertata rapi dan menjaga keawetan lensa kamera seharga puluhan juta.',
    updatedAt: '2026-09-16 13:15',
    berkasList: [
      {
        id: 'file-dkv-02',
        laciId: 'laci-dkv-b',
        unitId: 'unit-dkv',
        namaFile: 'SOP_Studio_Foto_dan_Podcast_DKV_2025.pdf',
        ukuranFile: '5.1 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-16 13:15',
        uploadedBy: 'Maya Safitri, M.Ds.',
        uploadedByUserId: 'u-unit-01'
      }
    ]
  },
  {
    id: 'laci-dkv-c',
    lemariId: 'lemari-dkv',
    unitId: 'unit-dkv',
    unitName: 'Kaprodi Desain Komunikasi Visual',
    kodeLaci: 'LACI-C',
    namaLaci: 'Dokumentasi Gelar Karya & Pameran Tahunan Siswa',
    deskripsiTugas: 'Laporan pameran eksibisi karya seni visual, jumlah pengunjung, omzet penjualan merchandise, dan liputan media.',
    kategoriJob: 'Pelaporan',
    formatWajib: ['pdf', 'link'],
    deadline: '2026-09-15',
    isMandatory: true,
    status: 'revisi',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-09-17 11:30',
    catatanSuperAdmin: 'Laporan belum mencantumkan rekap testimoni dari perwakilan asosiasi grafis Indonesia (ADGI). Mohon ditambahkan lembar evaluasi kurator.',
    updatedAt: '2026-09-15 16:45',
    berkasList: [
      {
        id: 'file-dkv-03',
        laciId: 'laci-dkv-c',
        unitId: 'unit-dkv',
        namaFile: 'Laporan_Pameran_Karya_Visual_DKV_2025.pdf',
        ukuranFile: '21.3 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-15 16:45',
        uploadedBy: 'Maya Safitri, M.Ds.',
        uploadedByUserId: 'u-unit-01'
      }
    ]
  },

  // ==========================================
  // 12. PRODI MPLB (unit-mplb)
  // ==========================================
  {
    id: 'laci-mplb-a',
    lemariId: 'lemari-mplb',
    unitId: 'unit-mplb',
    unitName: 'Kaprodi Manajemen Perkantoran (MPLB)',
    kodeLaci: 'LACI-A',
    namaLaci: 'Modul Praktik Simulasi Kantor Modern & e-Arsip',
    deskripsiTugas: 'Job sheet pengelolaan surat dinas digital, sistem kearsipan abjad/kronologis, dan penanganan panggilan telepon bisnis.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['pdf'],
    deadline: '2026-08-30',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-09-06 10:15',
    catatanSuperAdmin: 'Materi selaras dengan standar SKKNI Administrasi Perkantoran level II.',
    updatedAt: '2026-09-04 14:00',
    berkasList: [
      {
        id: 'file-mplb-01',
        laciId: 'laci-mplb-a',
        unitId: 'unit-mplb',
        namaFile: 'Modul_Simulasi_Kantor_Modern_MPLB_2025.pdf',
        ukuranFile: '7.8 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-04 14:00',
        uploadedBy: 'Tri Wahyuni, S.Pd.',
        uploadedByUserId: 'u-unit-01'
      }
    ]
  },
  {
    id: 'laci-mplb-b',
    lemariId: 'lemari-mplb',
    unitId: 'unit-mplb',
    unitName: 'Kaprodi Manajemen Perkantoran (MPLB)',
    kodeLaci: 'LACI-B',
    namaLaci: 'Laporan Praktik Humas & Keprotokolan Acara Sekolah',
    deskripsiTugas: 'Dokumentasi keterlibatan siswa MPLB sebagai master of ceremony (MC), penerima tamu VIP dinas, dan pengatur tata upacara.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['pdf', 'image'],
    deadline: '2026-09-12',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Drs. H. Bambang Hartono (Kepala Sekolah)',
    verifiedAt: '2026-09-15 14:10',
    catatanSuperAdmin: 'Kinerja siswa pada upacara hari kemerdekaan dan penyambutan gubernur sangat profesional.',
    updatedAt: '2026-09-14 11:20',
    berkasList: [
      {
        id: 'file-mplb-02',
        laciId: 'laci-mplb-b',
        unitId: 'unit-mplb',
        namaFile: 'Laporan_Keprotokolan_dan_Humas_MPLB_2025.pdf',
        ukuranFile: '9.5 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-14 11:20',
        uploadedBy: 'Tri Wahyuni, S.Pd.',
        uploadedByUserId: 'u-unit-01'
      }
    ]
  },
  {
    id: 'laci-mplb-c',
    lemariId: 'lemari-mplb',
    unitId: 'unit-mplb',
    unitName: 'Kaprodi Manajemen Perkantoran (MPLB)',
    kodeLaci: 'LACI-C',
    namaLaci: 'Hasil Uji Mengetik Cepat & Kecepatan Stenografi',
    deskripsiTugas: 'Sertifikat kecepatan mengetik 10 jari buta minimal 200 karakter per menit dengan ketelitian 98%.',
    kategoriJob: 'Evaluasi',
    formatWajib: ['excel', 'pdf'],
    deadline: '2026-10-15',
    isMandatory: false,
    status: 'kosong',
    updatedAt: '2026-09-01 08:00',
    berkasList: []
  },

  // ==========================================
  // 13. PRODI AKL (unit-akl)
  // ==========================================
  {
    id: 'laci-akl-a',
    lemariId: 'lemari-akl',
    unitId: 'unit-akl',
    unitName: 'Kaprodi Akuntansi & Keuangan (AKL)',
    kodeLaci: 'LACI-A',
    namaLaci: 'Laporan Operasional Praktik Bank Mini Sekolah',
    deskripsiTugas: 'Laporan pembukuan tabungan siswa harian, buku kas, rekonsiliasi bank, dan sistem pencatatan teller otomatis.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['excel', 'pdf'],
    deadline: '2026-08-30',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Drs. H. Mulyadi (SPI)',
    verifiedAt: '2026-09-07 11:00',
    catatanSuperAdmin: 'Saldo kas fisik klop 100% dengan mutasi rekening penampung.',
    updatedAt: '2026-09-05 13:30',
    berkasList: [
      {
        id: 'file-akl-01',
        laciId: 'laci-akl-a',
        unitId: 'unit-akl',
        namaFile: 'Laporan_Keuangan_Bank_Mini_Sekolah_Agustus_2025.xlsx',
        ukuranFile: '4.7 MB',
        tipeFile: 'excel',
        versi: 'v1.0',
        uploadedAt: '2026-09-05 13:30',
        uploadedBy: 'Retno Wulandari, S.E., Ak.',
        uploadedByUserId: 'u-unit-01'
      }
    ]
  },
  {
    id: 'laci-akl-b',
    lemariId: 'lemari-akl',
    unitId: 'unit-akl',
    unitName: 'Kaprodi Akuntansi & Keuangan (AKL)',
    kodeLaci: 'LACI-B',
    namaLaci: 'Modul Praktikum Komputer Akuntansi (Accurate / MYOB)',
    deskripsiTugas: 'Studi kasus siklus akuntansi perusahaan dagang & manufaktur, setup bagan akun, jurnal penyesuaian, dan laporan laba rugi.',
    kategoriJob: 'Perencanaan',
    formatWajib: ['pdf'],
    deadline: '2026-09-12',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-09-16 15:25',
    catatanSuperAdmin: 'Latihan soal sesuai dengan kisi-kisi UKK teknisi akuntansi yunior nasional.',
    updatedAt: '2026-09-15 10:45',
    berkasList: [
      {
        id: 'file-akl-02',
        laciId: 'laci-akl-b',
        unitId: 'unit-akl',
        namaFile: 'Modul_Komputer_Akuntansi_Accurate_2025.pdf',
        ukuranFile: '8.9 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-15 10:45',
        uploadedBy: 'Retno Wulandari, S.E., Ak.',
        uploadedByUserId: 'u-unit-01'
      }
    ]
  },
  {
    id: 'laci-akl-c',
    lemariId: 'lemari-akl',
    unitId: 'unit-akl',
    unitName: 'Kaprodi Akuntansi & Keuangan (AKL)',
    kodeLaci: 'LACI-C',
    namaLaci: 'Sertifikat Brevet Pajak A/B Siswa & Guru',
    deskripsiTugas: 'Data sertifikat kelulusan pelatihan pengisian e-SPT PPh 21 dan PPN dari konsultan pajak mitra.',
    kategoriJob: 'Pelaporan',
    formatWajib: ['pdf'],
    deadline: '2026-10-30',
    isMandatory: false,
    status: 'kosong',
    updatedAt: '2026-09-01 08:00',
    berkasList: []
  },

  // ==========================================
  // 14. PRODI TKR (unit-tkr)
  // ==========================================
  {
    id: 'laci-tkr-a',
    lemariId: 'lemari-tkr',
    unitId: 'unit-tkr',
    unitName: 'Kaprodi Teknik Kendaraan Ringan (TKR)',
    kodeLaci: 'LACI-A',
    namaLaci: 'SOP Bengkel Otomotif & Standar Lingkungan 5R',
    deskripsiTugas: 'Standard operating procedure pemakaian car lift, penanganan limbah oli bekas (B3), dan penerapan Ringkas Rapi Resik Rawat Rajin.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['pdf'],
    deadline: '2026-08-25',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Ir. Agus Santoso (Sarpras)',
    verifiedAt: '2026-09-01 10:20',
    catatanSuperAdmin: 'Tempat penampungan limbah oli B3 telah terlisensi dan tidak mencemari selokan sekolah.',
    updatedAt: '2026-08-28 16:00',
    berkasList: [
      {
        id: 'file-tkr-01',
        laciId: 'laci-tkr-a',
        unitId: 'unit-tkr',
        namaFile: 'SOP_Bengkel_Otomotif_dan_Pengelolaan_B3_2025.pdf',
        ukuranFile: '5.9 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-08-28 16:00',
        uploadedBy: 'Budi Darmawan, S.Pd., M.T.',
        uploadedByUserId: 'u-unit-03'
      }
    ]
  },
  {
    id: 'laci-tkr-b',
    lemariId: 'lemari-tkr',
    unitId: 'unit-tkr',
    unitName: 'Kaprodi Teknik Kendaraan Ringan (TKR)',
    kodeLaci: 'LACI-B',
    namaLaci: 'Job Sheet EFI Engine Scanner & Tune-Up Mobil',
    deskripsiTugas: 'Lembar kerja praktikum analisis diagnosis kerusakan sensor injeksi mesin mobil menggunakan scanner OBD-II industri.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['pdf'],
    deadline: '2026-09-10',
    isMandatory: true,
    status: 'revisi',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-09-14 10:45',
    catatanSuperAdmin: 'Foto prosedur safety penggunaan kacamata pelindung dan sepatu safety (APD) saat uji starter belum disertakan di lembar job sheet.',
    updatedAt: '2026-09-12 15:10',
    berkasList: [
      {
        id: 'file-tkr-02',
        laciId: 'laci-tkr-b',
        unitId: 'unit-tkr',
        namaFile: 'JobSheet_Diagnosa_EFI_Engine_Scanner_2025.pdf',
        ukuranFile: '7.3 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-12 15:10',
        uploadedBy: 'Budi Darmawan, S.Pd., M.T.',
        uploadedByUserId: 'u-unit-03'
      }
    ]
  },
  {
    id: 'laci-tkr-c',
    lemariId: 'lemari-tkr',
    unitId: 'unit-tkr',
    unitName: 'Kaprodi Teknik Kendaraan Ringan (TKR)',
    kodeLaci: 'LACI-C',
    namaLaci: 'Laporan Servis Berkala Mobil Guru/Warga (TeFa)',
    deskripsiTugas: 'Data kendaraan warga sekolah yang telah diservis (ganti oli, spooring balancing, tune up) oleh siswa magang bengkel.',
    kategoriJob: 'Pelaporan',
    formatWajib: ['excel', 'pdf'],
    deadline: '2026-10-20',
    isMandatory: false,
    status: 'kosong',
    updatedAt: '2026-09-01 08:00',
    berkasList: []
  },

  // ==========================================
  // 15. TEACHING FACTORY / TEFA (unit-tefa)
  // ==========================================
  {
    id: 'laci-tefa-a',
    lemariId: 'lemari-tefa',
    unitId: 'unit-tefa',
    unitName: 'Unit Produksi & Teaching Factory (TeFa)',
    kodeLaci: 'LACI-A',
    namaLaci: 'SOP Alur Produksi & Standar Mutu Produk/Jasa',
    deskripsiTugas: 'Bagan alur pemesanan pesanan dari konsumen luar, pembagian tugas siswa per workstation, dan checklist kontrol mutu produk jadi.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['pdf'],
    deadline: '2026-08-30',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Drs. H. Bambang Hartono (Kepala Sekolah)',
    verifiedAt: '2026-09-08 14:00',
    catatanSuperAdmin: 'Sistem alur produksi profesional menyerupai pabrik manufaktur sungguhan.',
    updatedAt: '2026-09-06 11:30',
    berkasList: [
      {
        id: 'file-tefa-01',
        laciId: 'laci-tefa-a',
        unitId: 'unit-tefa',
        namaFile: 'SOP_Alur_Produksi_dan_Quality_Control_TeFa_2025.pdf',
        ukuranFile: '8.4 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-06 11:30',
        uploadedBy: 'Farhan Maulana, S.T.',
        uploadedByUserId: 'u-unit-04'
      }
    ]
  },
  {
    id: 'laci-tefa-b',
    lemariId: 'lemari-tefa',
    unitId: 'unit-tefa',
    unitName: 'Unit Produksi & Teaching Factory (TeFa)',
    kodeLaci: 'LACI-B',
    namaLaci: 'Laporan Keuangan Omzet Usaha & Bagi Hasil Siswa',
    deskripsiTugas: 'Rekapitulasi omzet penjualan barang/jasa semester berjalan, pemotongan biaya bahan baku, dan pembagian insentif/upah kerja siswa.',
    kategoriJob: 'Pelaporan',
    formatWajib: ['excel', 'pdf'],
    deadline: '2026-09-15',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Drs. H. Mulyadi (SPI)',
    verifiedAt: '2026-09-17 08:30',
    catatanSuperAdmin: 'Transparan, akuntabel, dan seluruh siswa pekerja menerima bagi hasil tepat waktu.',
    updatedAt: '2026-09-16 16:20',
    berkasList: [
      {
        id: 'file-tefa-02',
        laciId: 'laci-tefa-b',
        unitId: 'unit-tefa',
        namaFile: 'Laporan_Omzet_dan_Bagi_Hasil_TeFa_Agustus_2025.xlsx',
        ukuranFile: '3.6 MB',
        tipeFile: 'excel',
        versi: 'v1.0',
        uploadedAt: '2026-09-16 16:20',
        uploadedBy: 'Farhan Maulana, S.T.',
        uploadedByUserId: 'u-unit-04'
      }
    ]
  },
  {
    id: 'laci-tefa-c',
    lemariId: 'lemari-tefa',
    unitId: 'unit-tefa',
    unitName: 'Unit Produksi & Teaching Factory (TeFa)',
    kodeLaci: 'LACI-C',
    namaLaci: 'Proposal Pengembangan Produk Baru Berbasis Riset',
    deskripsiTugas: 'Rencana inovasi produk unggulan baru bekerja sama dengan inkubator bisnis perguruan tinggi vokasi.',
    kategoriJob: 'Perencanaan',
    formatWajib: ['pdf'],
    deadline: '2026-11-20',
    isMandatory: false,
    status: 'kosong',
    updatedAt: '2026-09-01 08:00',
    berkasList: []
  },

  // ==========================================
  // 16. LSP P-1 (unit-lsp)
  // ==========================================
  {
    id: 'laci-lsp-a',
    lemariId: 'lemari-lsp',
    unitId: 'unit-lsp',
    unitName: 'Lembaga Sertifikasi Profesi (LSP P-1)',
    kodeLaci: 'LACI-A',
    namaLaci: 'Sertifikat Lisensi BNSP & SK Skema Sertifikasi',
    deskripsiTugas: 'Salinan SK Lisensi LSP dari Badan Nasional Sertifikasi Profesi (BNSP) yang masih aktif dan daftar 12 skema kompetensi terlisensi.',
    kategoriJob: 'Perencanaan',
    formatWajib: ['pdf'],
    deadline: '2026-08-20',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Drs. H. Bambang Hartono (Kepala Sekolah)',
    verifiedAt: '2026-08-26 10:00',
    catatanSuperAdmin: 'Masa berlaku lisensi BNSP aktif hingga 2028.',
    updatedAt: '2026-08-24 14:15',
    berkasList: [
      {
        id: 'file-lsp-01',
        laciId: 'laci-lsp-a',
        unitId: 'unit-lsp',
        namaFile: 'SK_Lisensi_BNSP_dan_Daftar_12_Skema_2025.pdf',
        ukuranFile: '9.1 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-08-24 14:15',
        uploadedBy: 'Dr. Surya Adi, M.Pd.',
        uploadedByUserId: 'u-tpmps-01'
      }
    ]
  },
  {
    id: 'laci-lsp-b',
    lemariId: 'lemari-lsp',
    unitId: 'unit-lsp',
    unitName: 'Lembaga Sertifikasi Profesi (LSP P-1)',
    kodeLaci: 'LACI-B',
    namaLaci: 'Daftar Asesor Kompetensi Bersertifikat BNSP',
    deskripsiTugas: 'Data nomor register asesor kompetensi (MET) guru SMK yang masih aktif masa berlaku sertifikat kompetensinya.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['excel', 'pdf'],
    deadline: '2026-09-05',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-09-10 11:30',
    catatanSuperAdmin: 'Memiliki 28 asesor bersertifikat BNSP aktif di seluruh 6 program keahlian.',
    updatedAt: '2026-09-08 10:40',
    berkasList: [
      {
        id: 'file-lsp-02',
        laciId: 'laci-lsp-b',
        unitId: 'unit-lsp',
        namaFile: 'Daftar_28_Asesor_Kompetensi_Aktif_2025.xlsx',
        ukuranFile: '2.1 MB',
        tipeFile: 'excel',
        versi: 'v1.0',
        uploadedAt: '2026-09-08 10:40',
        uploadedBy: 'Dr. Surya Adi, M.Pd.',
        uploadedByUserId: 'u-tpmps-01'
      }
    ]
  },
  {
    id: 'laci-lsp-c',
    lemariId: 'lemari-lsp',
    unitId: 'unit-lsp',
    unitName: 'Lembaga Sertifikasi Profesi (LSP P-1)',
    kodeLaci: 'LACI-C',
    namaLaci: 'Laporan Rekapitulasi Asesmen & Sertifikat Garuda',
    deskripsiTugas: 'Berita acara pelaksanaan asesmen, rekomendasi kompeten (K), dan tanda terima pembagian sertifikat berlogo garuda emas.',
    kategoriJob: 'Pelaporan',
    formatWajib: ['pdf'],
    deadline: '2026-09-15',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Dr. Indah Permata (Ketua TPMPS)',
    verifiedAt: '2026-09-18 11:15',
    catatanSuperAdmin: 'Seluruh blanko sertifikat terdistribusi dengan akurat tanpa kesalahan cetak nama siswa.',
    updatedAt: '2026-09-17 15:30',
    berkasList: [
      {
        id: 'file-lsp-03',
        laciId: 'laci-lsp-c',
        unitId: 'unit-lsp',
        namaFile: 'Laporan_Asesmen_dan_Tanda_Terima_Sertifikat_2025.pdf',
        ukuranFile: '14.3 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-17 15:30',
        uploadedBy: 'Dr. Surya Adi, M.Pd.',
        uploadedByUserId: 'u-tpmps-01'
      }
    ]
  },

  // ==========================================
  // 17. SATUAN PENGAWAS INTERNAL (unit-spi)
  // ==========================================
  {
    id: 'laci-spi-a',
    lemariId: 'lemari-spi',
    unitId: 'unit-spi',
    unitName: 'Satuan Pengawas Internal (SPI)',
    kodeLaci: 'LACI-A',
    namaLaci: 'Program Kerja Pengawasan Tahunan (PKPT)',
    deskripsiTugas: 'Rencana jadwal audit kepatuhan keuangan, audit operasional sarpras, dan reviu pengadaan barang/jasa sekolah.',
    kategoriJob: 'Perencanaan',
    formatWajib: ['pdf'],
    deadline: '2026-08-15',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Drs. H. Bambang Hartono (Kepala Sekolah)',
    verifiedAt: '2026-08-20 09:10',
    catatanSuperAdmin: 'Program kerja pengawasan independen dan terukur.',
    updatedAt: '2026-08-18 11:20',
    berkasList: [
      {
        id: 'file-spi-01',
        laciId: 'laci-spi-a',
        unitId: 'unit-spi',
        namaFile: 'PKPT_Pengawasan_Internal_Sekolah_2025_2026.pdf',
        ukuranFile: '4.9 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-08-18 11:20',
        uploadedBy: 'Drs. H. Mulyadi, M.M.',
        uploadedByUserId: 'u-ks-01'
      }
    ]
  },
  {
    id: 'laci-spi-b',
    lemariId: 'lemari-spi',
    unitId: 'unit-spi',
    unitName: 'Satuan Pengawas Internal (SPI)',
    kodeLaci: 'LACI-B',
    namaLaci: 'Laporan Hasil Reviu Pertanggungjawaban BOS & Komite',
    deskripsiTugas: 'Kertas kerja pemeriksaan kelengkapan bukti SPJ kuitansi belanja BOS Reguler dan dana sumbangan masyarakat/komite.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['pdf', 'excel'],
    deadline: '2026-09-10',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Drs. H. Bambang Hartono (Kepala Sekolah)',
    verifiedAt: '2026-09-15 11:00',
    catatanSuperAdmin: 'Reviu SPI memastikan zero-finding pada audit BPKP / Inspektorat Daerah.',
    updatedAt: '2026-09-14 14:40',
    berkasList: [
      {
        id: 'file-spi-02',
        laciId: 'laci-spi-b',
        unitId: 'unit-spi',
        namaFile: 'Laporan_Reviu_SPJ_BOS_Semester_Ganjil_2025.pdf',
        ukuranFile: '7.8 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-14 14:40',
        uploadedBy: 'Drs. H. Mulyadi, M.M.',
        uploadedByUserId: 'u-ks-01'
      }
    ]
  },
  {
    id: 'laci-spi-c',
    lemariId: 'lemari-spi',
    unitId: 'unit-spi',
    unitName: 'Satuan Pengawas Internal (SPI)',
    kodeLaci: 'LACI-C',
    namaLaci: 'Matriks Pemantauan Tindak Lanjut Hasil Pemeriksaan',
    deskripsiTugas: 'Tabel pemantauan status penyelesaian rekomendasi perbaikan dari tim auditor internal ke unit-unit kerja.',
    kategoriJob: 'Pelaporan',
    formatWajib: ['excel', 'pdf'],
    deadline: '2026-09-18',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Drs. H. Bambang Hartono (Kepala Sekolah)',
    verifiedAt: '2026-09-18 09:00',
    catatanSuperAdmin: 'Tindak lanjut rekomendasi telah dituntaskan 100% oleh unit terkait.',
    updatedAt: '2026-09-17 16:15',
    berkasList: [
      {
        id: 'file-spi-03',
        laciId: 'laci-spi-c',
        unitId: 'unit-spi',
        namaFile: 'Matriks_Tindak_Lanjut_Rekomendasi_Audit_2025.xlsx',
        ukuranFile: '2.4 MB',
        tipeFile: 'excel',
        versi: 'v1.0',
        uploadedAt: '2026-09-17 16:15',
        uploadedBy: 'Drs. H. Mulyadi, M.M.',
        uploadedByUserId: 'u-ks-01'
      }
    ]
  },

  // ==========================================
  // 18. SEKRETARIAT TPMPS (unit-tpmps-int)
  // ==========================================
  {
    id: 'laci-tpmps-a',
    lemariId: 'lemari-tpmps-int',
    unitId: 'unit-tpmps-int',
    unitName: 'Sekretariat TPMPS Internal',
    kodeLaci: 'LACI-A',
    namaLaci: 'SK Tim Penjaminan Mutu & Manual Mutu SPMI',
    deskripsiTugas: 'Surat Keputusan Kepala Sekolah tentang pembentukan TPMPS dan buku pedoman siklus PPEPP SMK.',
    kategoriJob: 'Perencanaan',
    formatWajib: ['pdf'],
    deadline: '2026-08-10',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Drs. H. Bambang Hartono (Kepala Sekolah)',
    verifiedAt: '2026-08-15 08:30',
    catatanSuperAdmin: 'Manual mutu dijadikan landasan utama penjaminan mutu seluruh 18 unit sekolah.',
    updatedAt: '2026-08-12 10:00',
    berkasList: [
      {
        id: 'file-tpmps-01',
        laciId: 'laci-tpmps-a',
        unitId: 'unit-tpmps-int',
        namaFile: 'SK_TPMPS_dan_Manual_Mutu_SPMI_2025_2026.pdf',
        ukuranFile: '6.5 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-08-12 10:00',
        uploadedBy: 'Dr. Indah Permata, M.T.',
        uploadedByUserId: 'u-tpmps-01'
      }
    ]
  },
  {
    id: 'laci-tpmps-b',
    lemariId: 'lemari-tpmps-int',
    unitId: 'unit-tpmps-int',
    unitName: 'Sekretariat TPMPS Internal',
    kodeLaci: 'LACI-B',
    namaLaci: 'Instrumen Evaluasi Diri Sekolah (EDS) 8 SNP',
    deskripsiTugas: 'Kuesioner dan instrumen penilaian mandiri ketercapaian 8 Standar Nasional Pendidikan oleh 18 unit kerja.',
    kategoriJob: 'Pelaksanaan',
    formatWajib: ['excel', 'pdf'],
    deadline: '2026-09-05',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Drs. H. Bambang Hartono (Kepala Sekolah)',
    verifiedAt: '2026-09-10 09:40',
    catatanSuperAdmin: 'Instrumen sangat komprehensif mengukur performa 18 unit.',
    updatedAt: '2026-09-08 14:20',
    berkasList: [
      {
        id: 'file-tpmps-02',
        laciId: 'laci-tpmps-b',
        unitId: 'unit-tpmps-int',
        namaFile: 'Instrumen_EDS_8_SNP_Digital_2025.xlsx',
        ukuranFile: '5.8 MB',
        tipeFile: 'excel',
        versi: 'v1.0',
        uploadedAt: '2026-09-08 14:20',
        uploadedBy: 'Dr. Indah Permata, M.T.',
        uploadedByUserId: 'u-tpmps-01'
      }
    ]
  },
  {
    id: 'laci-tpmps-c',
    lemariId: 'lemari-tpmps-int',
    unitId: 'unit-tpmps-int',
    unitName: 'Sekretariat TPMPS Internal',
    kodeLaci: 'LACI-C',
    namaLaci: 'Laporan Rapat Tinjauan Manajemen (RTM) & RTL',
    deskripsiTugas: 'Notula rapat evaluasi mutu bersama kepala sekolah, dewan guru, komite, serta rencana tindak lanjut perbaikan indikator rapor pendidikan.',
    kategoriJob: 'Pelaporan',
    formatWajib: ['pdf'],
    deadline: '2026-09-18',
    isMandatory: true,
    status: 'disetujui',
    verifiedBy: 'Drs. H. Bambang Hartono (Kepala Sekolah)',
    verifiedAt: '2026-09-18 15:45',
    catatanSuperAdmin: 'Rekomendasi RTM telah disahkan dan siap diimplementasikan untuk semester berikutnya.',
    updatedAt: '2026-09-18 13:30',
    berkasList: [
      {
        id: 'file-tpmps-03',
        laciId: 'laci-tpmps-c',
        unitId: 'unit-tpmps-int',
        namaFile: 'Laporan_RTM_dan_RTL_Mutu_Tahunan_2025.pdf',
        ukuranFile: '8.7 MB',
        tipeFile: 'pdf',
        versi: 'v1.0',
        uploadedAt: '2026-09-18 13:30',
        uploadedBy: 'Dr. Indah Permata, M.T.',
        uploadedByUserId: 'u-tpmps-01'
      }
    ]
  }
];
