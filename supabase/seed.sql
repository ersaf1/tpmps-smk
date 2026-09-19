-- ==========================================================
-- DATA AWAL (SEED): 18 UNIT KERJA & LEMARI DIGITAL SMK
-- Jalankan di SQL Editor Supabase setelah schema.sql
-- ==========================================================

-- 1. Insert 18 Unit Kerja
INSERT INTO unit_kerja (id, code, name, category, pic_user_id, pic, email, score, total_indicators, completed_indicators, status)
VALUES
('unit-kurikulum', 'WKS-KUR', 'WKS 1 Bidang Kurikulum', 'Manajemen', 'u-unit-01', 'Rudi Wijaya, S.Pd., M.M.', 'unit1@gmail.com', 92.5, 18, 18, 'Unggul'),
('unit-kesiswaan', 'WKS-KES', 'WKS 2 Bidang Kesiswaan', 'Manajemen', 'u-unit-02', 'Haryanto, S.Pd.', 'unit2@gmail.com', 87.2, 15, 14, 'Unggul'),
('unit-sarpras', 'WKS-SAR', 'WKS 3 Bidang Sarana & Prasarana', 'Manajemen', 'u-unit-03', 'Ir. Agus Santoso', 'unit3@gmail.com', 81.4, 16, 13, 'Baik'),
('unit-hubin', 'WKS-HUB', 'WKS 4 Hubungan Industri & BKK', 'Manajemen', 'u-unit-04', 'Dewi Sartika, S.T., M.Eng.', 'unit4@gmail.com', 94.0, 14, 14, 'Unggul'),
('unit-tu', 'TU-ADM', 'Tata Usaha & Kepegawaian', 'Layanan', 'u-unit-05', 'Sri Rahayu, S.Sos.', 'unit5@gmail.com', 86.8, 12, 11, 'Unggul'),
('unit-bk', 'BK-KON', 'Bimbingan Konseling (BK)', 'Layanan', 'u-unit-06', 'Dra. Nurhayati, M.Si.', 'unit6@gmail.com', 89.0, 10, 10, 'Unggul'),
('unit-perpustakaan', 'PERPUS', 'Perpustakaan Digital Sekolah', 'Layanan', 'u-unit-07', 'Endang Setiawati, S.I.Pust.', 'unit7@gmail.com', 79.5, 9, 7, 'Baik'),
('unit-lab', 'LAB-KOM', 'Laboratorium & Bengkel Komputer', 'Layanan', 'u-unit-08', 'Kurniawan, S.T.', 'unit8@gmail.com', 85.0, 11, 10, 'Baik'),
('unit-pplg', 'PRODI-PPLG', 'Kaprodi PPLG (RPL / Software)', 'Kejuruan', 'u-unit-09', 'Eko Prasetyo, M.Kom.', 'unit9@gmail.com', 95.2, 16, 16, 'Unggul'),
('unit-tjkt', 'PRODI-TJKT', 'Kaprodi TJKT (Jaringan & Telco)', 'Kejuruan', 'u-unit-10', 'Wahyu Nugroho, S.T.', 'unit10@gmail.com', 91.0, 16, 15, 'Unggul'),
('unit-dkv', 'PRODI-DKV', 'Kaprodi Desain Komunikasi Visual', 'Kejuruan', 'u-unit-11', 'Maya Safitri, M.Ds.', 'unit11@gmail.com', 88.5, 15, 14, 'Unggul'),
('unit-mplb', 'PRODI-MPLB', 'Kaprodi Manajemen Perkantoran (MPLB)', 'Kejuruan', 'u-unit-12', 'Tri Wahyuni, S.Pd.', 'unit12@gmail.com', 87.0, 14, 13, 'Unggul'),
('unit-akl', 'PRODI-AKL', 'Kaprodi Akuntansi & Keuangan (AKL)', 'Kejuruan', 'u-unit-13', 'Retno Wulandari, S.E., Ak.', 'unit13@gmail.com', 86.4, 14, 13, 'Unggul'),
('unit-tkr', 'PRODI-TKR', 'Kaprodi Teknik Kendaraan Ringan (TKR)', 'Kejuruan', 'u-unit-14', 'Budi Darmawan, S.Pd., M.T.', 'unit14@gmail.com', 83.2, 15, 12, 'Baik'),
('unit-tefa', 'UNIT-PROD', 'Unit Produksi & Teaching Factory (TeFa)', 'Kejuruan', 'u-unit-15', 'Farhan Maulana, S.T.', 'unit15@gmail.com', 88.0, 12, 11, 'Unggul'),
('unit-lsp', 'LSP-P1', 'Lembaga Sertifikasi Profesi (LSP P-1)', 'Layanan', 'u-unit-16', 'Dr. Surya Adi, M.Pd.', 'unit16@gmail.com', 93.0, 10, 10, 'Unggul'),
('unit-spi', 'SPI-PEN', 'Satuan Pengawas Internal (SPI)', 'Pengawasan', 'u-unit-17', 'Drs. H. Mulyadi, M.M.', 'unit17@gmail.com', 89.6, 8, 8, 'Unggul'),
('unit-tpmps-int', 'TPMPS-INT', 'Sekretariat TPMPS Internal', 'Pengawasan', 'u-unit-18', 'Dr. Indah Permata, M.T.', 'unit18@gmail.com', 96.0, 8, 8, 'Unggul')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert 18 Lemari Unit
INSERT INTO lemari_unit (id, unit_id, unit_code, unit_name, unit_category, pic, tahun_ajaran, deskripsi_job, total_laci, laci_terisi, laci_disetujui, laci_revisi, laci_kosong, status)
VALUES
('lemari-kurikulum', 'unit-kurikulum', 'WKS-KUR', 'WKS 1 Bidang Kurikulum', 'Manajemen', 'Rudi Wijaya, S.Pd., M.M.', '2025/2026', 'Pengembangan kurikulum merdeka SMK, KOSP, pembagian jam mengajar, modul ajar, asesmen sumatif/formatif, dan kalender pendidikan.', 4, 3, 2, 1, 1, 'Aktif'),
('lemari-kesiswaan', 'unit-kesiswaan', 'WKS-KES', 'WKS 2 Bidang Kesiswaan', 'Manajemen', 'Haryanto, S.Pd.', '2025/2026', 'Pengelolaan MPLS, OSIS/MPK, ekstrakurikuler, penegakan kedisiplinan dan tata tertib, beasiswa, dan pembinaan karakter.', 4, 3, 3, 0, 1, 'Aktif'),
('lemari-sarpras', 'unit-sarpras', 'WKS-SAR', 'WKS 3 Bidang Sarana & Prasarana', 'Manajemen', 'Ir. Agus Santoso', '2025/2026', 'Inventarisasi aset dan gedung, perawatan berkala fasilitas praktik & kelas, standar K3 workshop, dan usulan belanja modal.', 4, 3, 2, 1, 1, 'Aktif'),
('lemari-hubin', 'unit-hubin', 'WKS-HUB', 'WKS 4 Hubungan Industri & BKK', 'Manajemen', 'Dewi Sartika, S.T., M.Eng.', '2025/2026', 'Kemitraan dunia kerja (IDUKA), penyelarasan kurikulum industri, pelaksanaan PKL 6 bulan, tracer study, dan bursa kerja khusus.', 4, 4, 4, 0, 0, 'Aktif'),
('lemari-tu', 'unit-tu', 'TU-ADM', 'Tata Usaha & Kepegawaian', 'Layanan', 'Sri Rahayu, S.Sos.', '2025/2026', 'Administrasi kepegawaian (KGB, SK, PAK), tata persuratan dinas, arsip dokumen resmi, dan buku induk siswa.', 3, 2, 2, 0, 1, 'Aktif'),
('lemari-bk', 'unit-bk', 'BK-KON', 'Bimbingan Konseling (BK)', 'Layanan', 'Dra. Nurhayati, M.Si.', '2025/2026', 'Layanan bimbingan pribadi, sosial, belajar, dan karir; pemetaan sosiometri; dan penanganan kasus konseling siswa.', 3, 3, 2, 1, 0, 'Aktif'),
('lemari-perpustakaan', 'unit-perpustakaan', 'PERPUS', 'Perpustakaan Digital Sekolah', 'Layanan', 'Endang Setiawati, S.I.Pust.', '2025/2026', 'Katalog e-library, sirkulasi peminjaman buku paket, pengadaan referensi kejuruan, dan program literasi sekolah.', 3, 2, 1, 0, 1, 'Aktif'),
('lemari-lab', 'unit-lab', 'LAB-KOM', 'Laboratorium & Bengkel Komputer', 'Layanan', 'Kurniawan, S.T.', '2025/2026', 'Pengaturan jadwal 6 lab komputer, logbook pemeliharaan hardware/jaringan, lisensi software, dan SOP K3 lab.', 3, 2, 2, 0, 1, 'Aktif'),
('lemari-pplg', 'unit-pplg', 'PRODI-PPLG', 'Kaprodi PPLG (RPL / Software)', 'Kejuruan', 'Eko Prasetyo, M.Kom.', '2025/2026', 'Penyelarasan kurikulum software house, project-based learning aplikasi web & mobile, sertifikasi BNSP programmer, dan UKK RPL.', 4, 4, 4, 0, 0, 'Aktif'),
('lemari-tjkt', 'unit-tjkt', 'PRODI-TJKT', 'Kaprodi TJKT (Jaringan & Telco)', 'Kejuruan', 'Wahyu Nugroho, S.T.', '2025/2026', 'Penyelarasan kurikulum Mikrotik Academy / Cisco CCNA, job sheet instalasi fiber optic, server linux, dan uji kompetensi jaringan.', 4, 3, 3, 0, 1, 'Aktif'),
('lemari-dkv', 'unit-dkv', 'PRODI-DKV', 'Kaprodi Desain Komunikasi Visual', 'Kejuruan', 'Maya Safitri, M.Ds.', '2025/2026', 'Portofolio branding, animasi 2D/3D, videografi industri, job sheet studio kreatif, dan pameran tahunan siswa.', 3, 3, 2, 1, 0, 'Aktif'),
('lemari-mplb', 'unit-mplb', 'PRODI-MPLB', 'Kaprodi Manajemen Perkantoran (MPLB)', 'Kejuruan', 'Tri Wahyuni, S.Pd.', '2025/2026', 'Simulasi kantor modern, kearsipan digital, otomatisasi tata kelola perkantoran, dan UKK administrasi.', 3, 2, 2, 0, 1, 'Aktif'),
('lemari-akl', 'unit-akl', 'PRODI-AKL', 'Kaprodi Akuntansi & Keuangan (AKL)', 'Kejuruan', 'Retno Wulandari, S.E., Ak.', '2025/2026', 'Praktikum software akuntansi (MYOB/Accurate), perpajakan digital, pengelolaan bank mini sekolah, dan sertifikasi teknisi akuntansi.', 3, 2, 2, 0, 1, 'Aktif'),
('lemari-tkr', 'unit-tkr', 'PRODI-TKR', 'Kaprodi Teknik Kendaraan Ringan (TKR)', 'Kejuruan', 'Budi Darmawan, S.Pd., M.T.', '2025/2026', 'SOP bengkel otomotif, modul overhaul mesin & transmisi otomatis, EFI engine scanner, dan uji emisi berkala.', 3, 2, 1, 1, 1, 'Aktif'),
('lemari-tefa', 'unit-tefa', 'UNIT-PROD', 'Unit Produksi & Teaching Factory (TeFa)', 'Kejuruan', 'Farhan Maulana, S.T.', '2025/2026', 'Pembelajaran berbasis pesanan pelanggan luar nyata, standard QC, omzet unit usaha, dan akuntabilitas keuangan TeFa.', 3, 2, 2, 0, 1, 'Aktif'),
('lemari-lsp', 'unit-lsp', 'LSP-P1', 'Lembaga Sertifikasi Profesi (LSP P-1)', 'Layanan', 'Dr. Surya Adi, M.Pd.', '2025/2026', 'Pemeliharaan lisensi BNSP, verifikasi TUK, pembaharuan 12 skema sertifikasi KKNI level II, dan blanko garuda.', 3, 3, 3, 0, 0, 'Aktif'),
('lemari-spi', 'unit-spi', 'SPI-PEN', 'Satuan Pengawas Internal (SPI)', 'Pengawasan', 'Drs. H. Mulyadi, M.M.', '2025/2026', 'Audit kepatuhan tata kelola, reviu pertanggungjawaban anggaran BOS & BOP, pemeriksaan SOP, dan laporan temuan.', 3, 3, 3, 0, 0, 'Aktif'),
('lemari-tpmps-int', 'unit-tpmps-int', 'TPMPS-INT', 'Sekretariat TPMPS Internal', 'Pengawasan', 'Dr. Indah Permata, M.T.', '2025/2026', 'Penyelenggaraan siklus PPEPP, instrumen EDS 8 SNP, integrasi rapor pendidikan nasional, dan monitoring RTL mutu.', 3, 3, 3, 0, 0, 'Aktif')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Contoh Laci Utama WKS 1 Kurikulum
INSERT INTO laci_unit (id, lemari_id, unit_id, unit_name, kode_laci, nama_laci, deskripsi_tugas, kategori_job, format_wajib, deadline, is_mandatory, status, catatan_super_admin, verified_by, verified_at)
VALUES
('laci-kur-a', 'lemari-kurikulum', 'unit-kurikulum', 'WKS 1 Bidang Kurikulum', 'LACI-A', 'Dokumen KOSP (Kurikulum Operasional Satuan Pendidikan)', 'Unggah dokumen KOSP tahun ajaran berjalan lengkap dengan pengesahan Kepala Dinas.', 'Perencanaan', ARRAY['pdf', 'link'], '2026-08-15', true, 'disetujui', 'Dokumen KOSP sangat lengkap, struktur kurikulum selaras dengan 6 program keahlian.', 'Dr. Indah Permata (Ketua TPMPS)', NOW()),
('laci-kur-b', 'lemari-kurikulum', 'unit-kurikulum', 'WKS 1 Bidang Kurikulum', 'LACI-B', 'Modul Ajar & Perangkat Pembelajaran Merdeka', 'Sampel modul ajar terintegrasi pembelajaran berdiferensiasi dan asesmen diagnostik.', 'Pelaksanaan', ARRAY['pdf', 'docx', 'link'], '2026-09-10', true, 'revisi', 'Rubrik asesmen formatif untuk mata pelajaran dasar kejuruan kelas X belum mencantumkan lembar observasi sikap bernalar kritis.', 'Dr. Indah Permata (Ketua TPMPS)', NOW()),
('laci-kur-c', 'lemari-kurikulum', 'unit-kurikulum', 'WKS 1 Bidang Kurikulum', 'LACI-C', 'SK Pembagian Tugas Mengajar & Jadwal KBM', 'Surat Keputusan Kepala Sekolah tentang pembagian beban jam mengajar guru (minimal 24 JP).', 'Pelaksanaan', ARRAY['pdf', 'xlsx'], '2026-07-25', true, 'disetujui', 'Beban mengajar guru sudah proporsional dan tidak ada guru yang bentrok jadwal lab.', 'Drs. H. Bambang Hartono (Kepala Sekolah)', NOW()),
('laci-kur-d', 'lemari-kurikulum', 'unit-kurikulum', 'WKS 1 Bidang Kurikulum', 'LACI-D', 'Laporan Asesmen Sumatif & Analisis Daya Serap', 'Rekapitulasi hasil Penilaian Tengah Semester (PTS) dan Sumatif Akhir Semester.', 'Evaluasi', ARRAY['excel', 'pdf'], '2026-10-15', false, 'kosong', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;
