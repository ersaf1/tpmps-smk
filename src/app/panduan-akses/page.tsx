'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AppShell from '@/components/layout/AppShell';
import { useToast } from '@/components/ui/ToastFeedback';
import {
  Printer,
  Download,
  Copy,
  Check,
  Search,
  ShieldCheck,
  UserCheck,
  Building2,
  HardDrive,
  Lock,
  Mail,
  Award,
  BookOpen,
  Layers,
  FileText
} from 'lucide-react';

interface UnitInfoItem {
  id: string;
  num: number;
  code: string;
  name: string;
  pic: string;
  email: string;
  pw: string;
  category: string;
  snp: string[];
  capabilities: string[];
  driveFolders: string[];
}

const UNITS_DATA: UnitInfoItem[] = [
  {
    id: 'u-01',
    num: 1,
    code: 'KASEK',
    name: '1. KASEK (Kepala Sekolah)',
    pic: 'Drs. H. Mulyono, M.Pd.',
    email: 'kasek@smkn2magelang.sch.id',
    pw: 'sintesa123',
    category: 'Pimpinan',
    snp: ['Seluruh 8 Standar SNP (Pengawasan Menyeluruh)'],
    capabilities: [
      'Hak Akses Read-Only Penuh: Memantau agregat dashboard capaian, instrumen evaluasi, dan repositori berkas dari SELURUH 18 UNIT KERJA.',
      'Wewenang Eksklusif Pembuat Periode Mutu: SATU-SATUNYA akun yang berwenang membuat, menetapkan tanggal aktif, dan mengarsipkan Periode Mutu SPMI (/periode).',
      'Persetujuan Akhir (Approval) Laporan Evaluasi Diri Sekolah (EDS) dan Rapor Mutu Pendidikan SMK Negeri 2 Magelang.',
      'Penetapan kebijakan strategis mutu sekolah dan pengesahan dokumen Manual Mutu (MM).',
      'Memantau kepatuhan pemenuhan dokumen bukti fisik digital dan tindak lanjut rekomendasi audit internal.'
    ],
    driveFolders: ['07. Standar Pengelolaan & SPMI', '09. SK & Penetapan Periode Mutu SPMI', '10. Arsip Laporan EDS Resmi']
  },
  {
    id: 'u-02',
    num: 2,
    code: 'WKS-1',
    name: '2. UNIT KERJA WKS 1 (Kurikulum)',
    pic: 'Dra. Sri Wahyuni, M.Pd.',
    email: 'wks1@smkn2magelang.sch.id',
    pw: 'sintesa123',
    category: 'Manajemen',
    snp: ['SNP-2 (Standar Isi)', 'SNP-3 (Standar Proses)', 'SNP-4 (Standar Penilaian)'],
    capabilities: [
      'Menyusun & mengunggah dokumen Kurikulum Operasional Satuan Pendidikan (KOSP) dan Kurikulum Merdeka.',
      'Mengunggah Petunjuk Kerja (PK) kurikulum, Kalender Pendidikan, SK Pembagian Jam Mengajar, dan Jadwal KBM.',
      'Mengunggah Catatan Mutu (F) verifikasi silabus, modul ajar, dan instrumen asesmen diagnostik/sumatif.',
      'Mengisi evaluasi mandiri ketercapaian standar kurikulum dan menyusun Rekapitulasi Mutu Kurikulum.',
      'Mengelola Google Drive Unit: Folder Kurikulum, Perangkat Pembelajaran, dan Asesmen.'
    ],
    driveFolders: ['02. Standar Isi & Kurikulum', '03. Standar Proses & PjBL', '04. Standar Penilaian', '09. SK & Regulasi Unit']
  },
  {
    id: 'u-03',
    num: 3,
    code: 'WKS-2',
    name: '3. UNIT KERJA WKS 2 (Kesiswaan)',
    pic: 'Bambang Sutrisno, S.Pd.',
    email: 'wks2@smkn2magelang.sch.id',
    pw: 'sintesa123',
    category: 'Manajemen',
    snp: ['SNP-1 (Standar Kompetensi Lulusan)', 'SNP-7 (Standar Pengelolaan)'],
    capabilities: [
      'Mengunggah Buku Pedoman Tata Tertib Siswa, Buku Saku Karakter, dan SOP Penegakan Disiplin.',
      'Mendokumentasikan & mengarsipkan prestasi siswa di ajang LKS SMK, O2SN, FLS2N tingkat Kota, Provinsi, dan Nasional.',
      'Mengunggah Petunjuk Kerja (PK) kegiatan kesiswaan, kepanduan Pramuka, OSIS/MPK, dan data beasiswa PIP/KIP.',
      'Mengunggah Catatan Mutu (F) pembiasaan karakter & P5 serta Rekapitulasi Prestasi Kesiswaan.',
      'Mengelola Google Drive Unit: Folder Prestasi LKS, Tata Tertib, dan Kegiatan Kesiswaan.'
    ],
    driveFolders: ['01. Standar SKL', '07. Standar Pengelolaan & SPMI', '10. Portofolio & Dokumentasi']
  },
  {
    id: 'u-04',
    num: 4,
    code: 'WKS-3',
    name: '4. UNIT KERJA WKS 3 (Sarpras)',
    pic: 'Ir. Agus Haryanto, M.T.',
    email: 'wks3@smkn2magelang.sch.id',
    pw: 'sintesa123',
    category: 'Manajemen',
    snp: ['SNP-6 (Standar Sarana & Prasarana)'],
    capabilities: [
      'Mengunggah buku inventarisasi sarana prasarana sekolah, daftar peralatan bengkel, dan perangkat PC lab.',
      'Menyusun Master Plan pemeliharaan gedung, ruang praktik siswa (RPS), instalasi listrik, dan utilitas.',
      'Mengunggah Petunjuk Kerja (PK) K3 lingkungan sekolah dan SOP jalur evakuasi bencana.',
      'Mengunggah Catatan Mutu (F) kartu pemeliharaan berkala sarpras dan Rekapitulasi Kelayakan Ruang Praktik.',
      'Mengajukan program RTL peremajaan komputer, perbaikan ruang kelas, dan sertifikasi standar industri ruang praktik.'
    ],
    driveFolders: ['06. Standar Sarpras', '09. SK & Regulasi Unit', '10. Portofolio & Dokumentasi']
  },
  {
    id: 'u-05',
    num: 5,
    code: 'WKS-4',
    name: '5. UNIT KERJA WKS 4 (Humas & Hubin)',
    pic: 'Drs. Hendro Wibowo',
    email: 'wks4@smkn2magelang.sch.id',
    pw: 'sintesa123',
    category: 'Manajemen',
    snp: ['SNP-2 (Standar Isi)', 'SNP-3 (Standar Proses)', 'SNP-7 (Standar Pengelolaan)'],
    capabilities: [
      'Mengunggah naskah Memorandum of Understanding (MoU) dan perjanjian kerjasama (PKS) bersama DUDI/Industri mitra.',
      'Mengarsipkan Berita Acara sinkronisasi kurikulum industri dan pelaksanaan program Guru Tamu praktisi.',
      'Mengunggah Petunjuk Kerja (PK) monitoring Praktik Kerja Lapangan (PKL) siswa dan jurnal pembimbingan industri.',
      'Mengunggah Catatan Mutu (F) presensi monitoring PKL dan Rekapitulasi Penyerapan Kemitraan Industri.',
      'Mengajukan program RTL perluasan jaringan kemitraan industri nasional dan multinasional.'
    ],
    driveFolders: ['02. Standar Isi & Kurikulum', '03. Standar Proses & PjBL', '07. Standar Pengelolaan & SPMI']
  },
  {
    id: 'u-06',
    num: 6,
    code: 'PPLG',
    name: '6. UNIT KEJURUAN PPLG',
    pic: 'Eko Prasetyo, S.Kom., M.Cs.',
    email: 'pplg@smkn2magelang.sch.id',
    pw: 'sintesa123',
    category: 'Kejuruan',
    snp: ['SNP-1 (SKL)', 'SNP-3 (Standar Proses)', 'SNP-4 (Standar Penilaian)'],
    capabilities: [
      'Mengunggah modul ajar kejuruan PPLG, materi Cloud Computing, Web Development, dan Mobile Application.',
      'Mengunggah portofolio proyek perangkat lunak hasil Teaching Factory (TEFA) pesanan industri/klien.',
      'Mengunggah Petunjuk Kerja (PK) praktikum software, Catatan Mutu (F) lembar penilaian UKK PPLG skema BNSP.',
      'Mengisi evaluasi mandiri kelulusan sertifikasi BNSP kompetensi Rekayasa Perangkat Lunak & Rekap Capaian Kejuruan.',
      'Mengajukan program RTL pengadaan lisensi software resmi dan sertifikasi vendor industri (AWS/Google).'
    ],
    driveFolders: ['01. Standar SKL', '02. Standar Isi & Kurikulum', '03. Standar Proses & PjBL', '04. Standar Penilaian']
  },
  {
    id: 'u-07',
    num: 7,
    code: 'MPLB',
    name: '7. UNIT KEJURUAN MPLB',
    pic: 'Dewi Lestari, S.Pd.',
    email: 'mplb@smkn2magelang.sch.id',
    pw: 'sintesa123',
    category: 'Kejuruan',
    snp: ['SNP-1 (SKL)', 'SNP-3 (Standar Proses)', 'SNP-7 (Standar Pengelolaan)'],
    capabilities: [
      'Mengunggah SOP Manajemen Kearsipan Digital, penanganan korespondensi bisnis, dan protokol keprotokolan.',
      'Mengunggah portofolio simulasi rapat bisnis, otomatisasi tata kelola perkantoran, dan layanan kehumasan siswa.',
      'Mengunggah Petunjuk Kerja (PK) administrasi perkantoran dan Catatan Mutu (F) rekapitulasi penilaian UKK MPLB.',
      'Mengisi evaluasi mandiri penguasaan soft skills komunikasi dan public speaking siswa serta Rekapitulasi Capaian.',
      'Mengajukan RTL pengadaan mesin kantor modern dan software sistem kearsipan elektronik (e-filing).'
    ],
    driveFolders: ['01. Standar SKL', '03. Standar Proses & PjBL', '07. Standar Pengelolaan & SPMI']
  },
  {
    id: 'u-08',
    num: 8,
    code: 'PM',
    name: '8. UNIT KEJURUAN PM',
    pic: 'Rudi Hartono, S.E.',
    email: 'pm@smkn2magelang.sch.id',
    pw: 'sintesa123',
    category: 'Kejuruan',
    snp: ['SNP-1 (SKL)', 'SNP-3 (Standar Proses)', 'SNP-4 (Standar Penilaian)'],
    capabilities: [
      'Mengunggah laporan omzet praktik penjualan retail dan kasir komputer POS di Business Center sekolah.',
      'Mengunggah portofolio kampanye digital marketing (social media, SEO, e-commerce, dan TikTok Shop).',
      'Mengunggah Petunjuk Kerja (PK) transaksi kasir dan Catatan Mutu (F) bukti uji sertifikasi BNSP pramuniaga/pemasaran.',
      'Mengisi instrumen evaluasi mandiri efektivitas praktik kewirausahaan riil siswa & Rekapitulasi Mutu PM.',
      'Mengajukan RTL kerjasama kemitraan dengan jaringan ritel modern nasional dan marketplace.'
    ],
    driveFolders: ['01. Standar SKL', '03. Standar Proses & PjBL', '10. Portofolio & Dokumentasi']
  },
  {
    id: 'u-09',
    num: 9,
    code: 'AKL',
    name: '9. UNIT KEJURUAN AKL',
    pic: 'Siti Rahmawati, S.E., M.Akt.',
    email: 'akl@smkn2magelang.sch.id',
    pw: 'sintesa123',
    category: 'Kejuruan',
    snp: ['SNP-1 (SKL)', 'SNP-2 (Standar Isi)', 'SNP-4 (Standar Penilaian)'],
    capabilities: [
      'Mengunggah lembar kerja siklus akuntansi perusahaan jasa, dagang, manufaktur, dan software komputer akuntansi (MYOB/Accurate).',
      'Mengunggah modul praktikum perpajakan, spreadsheet akuntansi, dan pembukuan Mini Bank sekolah.',
      'Mengunggah Petunjuk Kerja (PK) pembukuan dan Catatan Mutu (F) kelulusan sertifikasi Teknisi Akuntansi Yunior LSP-P1/BNSP.',
      'Mengisi evaluasi mandiri kompetensi literasi finansial dan digital accounting siswa serta Rekapitulasi Capaian AKL.',
      'Mengajukan RTL sinkronisasi materi audit dengan Kantor Akuntan Publik (KAP).'
    ],
    driveFolders: ['01. Standar SKL', '02. Standar Isi & Kurikulum', '04. Standar Penilaian']
  },
  {
    id: 'u-10',
    num: 10,
    code: 'TPMPS',
    name: '10. UNIT KERJA TPMPS',
    pic: 'Dra. Hj. Siti Fatimah, M.M.',
    email: 'tpmps@smkn2magelang.sch.id',
    pw: 'sintesa123',
    category: 'Pengawasan',
    snp: ['Seluruh 8 Standar SNP (Pengendalian Mutu & PPEPP)'],
    capabilities: [
      'Wewenang Eksklusif Dokumen Level 1: Mengelola, menyusun, dan memperbarui Manual Mutu (MM) SMKN 2 Magelang.',
      'Wewenang Eksklusif Dokumen Level 2: Mengelola dan menetapkan Prosedur Mutu (PM) / SOP tata cara proses mutu.',
      'Memimpin seluruh siklus PPEPP (Penetapan, Pelaksanaan, Evaluasi, Pengendalian, Peningkatan) mutu sekolah.',
      'Melakukan verifikasi, validasi, dan audit berkas bukti fisik digital dari seluruh 17 unit pelaksana.',
      'Memberikan skor penilaian verifikasi auditor pada instrumen evaluasi mandiri unit.',
      'Menerbitkan Rapor Mutu Sekolah dan menyusun Laporan Evaluasi Diri Sekolah (EDS) resmi.'
    ],
    driveFolders: ['00. Dokumen Level 1 - Manual Mutu (MM)', '00. Dokumen Level 2 - Prosedur Mutu (PM)', '07. Standar Pengelolaan & SPMI']
  },
  {
    id: 'u-11',
    num: 11,
    code: 'RENBANG',
    name: '11. UNIT KERJA RENBANG',
    pic: 'Drs. Supriyadi, M.M.',
    email: 'renbang@smkn2magelang.sch.id',
    pw: 'sintesa123',
    category: 'Perencanaan',
    snp: ['SNP-7 (Standar Pengelolaan)', 'SNP-8 (Standar Pembiayaan)'],
    capabilities: [
      'Menyusun & mengunggah dokumen Rencana Kerja Jangka Menengah (RKJM) 4 tahunan dan Rencana Kerja Tahunan (RKT).',
      'Menyusun dokumen analisis SWOT mutu pendidikan sekolah dan pemetaan prioritas strategis.',
      'Mengunggah Petunjuk Kerja (PK) penyusunan program kerja unit dan Catatan Mutu (F) ketercapaian target RKAS.',
      'Mengisi instrumen evaluasi mandiri efektivitas perencanaan anggaran dan Rekapitulasi Ketercapaian Target Renbang.',
      'Mengajukan program RTL penguatan sistem informasi manajemen perencanaan terpadu.'
    ],
    driveFolders: ['07. Standar Pengelolaan & SPMI', '08. Standar Pembiayaan & RKAS']
  },
  {
    id: 'u-12',
    num: 12,
    code: 'KATU',
    name: '12. UNIT KERJA KATU',
    pic: 'Nurul Hidayati, S.Sos.',
    email: 'katu@smkn2magelang.sch.id',
    pw: 'sintesa123',
    category: 'Layanan',
    snp: ['SNP-5 (Pendidik & Tendik)', 'SNP-7 (Standar Pengelolaan)'],
    capabilities: [
      'Mengunggah data kepegawaian tenaga kependidikan (Tendik), Sasaran Kinerja Pegawai (SKP), dan arsip kepegawaian.',
      'Mengelola buku agenda persuratan resmi masuk dan keluar serta pengarsipan digital SK Kepala Sekolah.',
      'Mengunggah Petunjuk Kerja (PK) layanan tata usaha dan Catatan Mutu (F) bukti pelayanan administrasi sekolah.',
      'Mengisi evaluasi mandiri indeks kepuasan layanan tata usaha dan Rekapitulasi Pelayanan Administrasi.',
      'Mengajukan RTL digitalisasi arsip persuratan dan pelatihan kompetensi administrasi modern bagi tendik.'
    ],
    driveFolders: ['05. Standar Pendidik (PTK)', '07. Standar Pengelolaan & SPMI', '09. SK & Regulasi Unit']
  },
  {
    id: 'u-13',
    num: 13,
    code: 'KALAB',
    name: '13. UNIT KERJA KALAB',
    pic: 'Supriyanto, A.Md.',
    email: 'kalab@smkn2magelang.sch.id',
    pw: 'sintesa123',
    category: 'Layanan',
    snp: ['SNP-6 (Standar Sarpras)', 'SNP-7 (Standar Pengelolaan)'],
    capabilities: [
      'Mengunggah jadwal pemakaian seluruh laboratorium komputer dan bengkel praktik SMK Negeri 2 Magelang.',
      'Mengunggah kartu riwayat perawatan & perbaikan berkala (maintenance log) perangkat PC, jaringan, dan AC lab.',
      'Mengunggah Petunjuk Kerja (PK) keselamatan kerja laboratorium (K3 Lab) dan inventaris software berlisensi.',
      'Mengunggah Catatan Mutu (F) formulir peminjaman alat lab dan Rekapitulasi Kesiapan CBT Ujian Sekolah.',
      'Mengajukan RTL pengadaan suku cadang cadangan komputer dan peremajaan UPS server laboratorium.'
    ],
    driveFolders: ['06. Standar Sarpras', '07. Standar Pengelolaan & SPMI']
  },
  {
    id: 'u-14',
    num: 14,
    code: 'PERPUSTAKAAN',
    name: '14. UNIT KERJA PERPUSTAKAAN',
    pic: 'Tri Utami, S.I.Pust.',
    email: 'perpustakaan@smkn2magelang.sch.id',
    pw: 'sintesa123',
    category: 'Layanan',
    snp: ['SNP-3 (Standar Proses)', 'SNP-6 (Standar Sarpras)'],
    capabilities: [
      'Mengunggah laporan sirkulasi peminjaman buku, katalog buku digital (OPAC), dan statistik kunjungan perpustakaan.',
      'Mengunggah program pembiasaan literasi sekolah dan bukti MoU kerjasama dengan Perpustakaan Daerah.',
      'Mengunggah Petunjuk Kerja (PK) layanan perpustakaan dan Catatan Mutu (F) kartu peminjaman buku kejuruan.',
      'Mengisi evaluasi mandiri rasio buku pelajaran pokok 1 buku per siswa dan Rekapitulasi Indeks Minat Baca.',
      'Mengajukan program RTL penambahan koleksi e-book kejuruan dan peremajaan sistem barcode perpustakaan.'
    ],
    driveFolders: ['03. Standar Proses & PjBL', '06. Standar Sarpras', '07. Standar Pengelolaan & SPMI']
  },
  {
    id: 'u-15',
    num: 15,
    code: 'NASWIL',
    name: '15. UNIT KERJA NASWIL',
    pic: 'Drs. H. Mulyadi, M.Pd.',
    email: 'naswil@smkn2magelang.sch.id',
    pw: 'sintesa123',
    category: 'Kesiswaan',
    snp: ['SNP-1 (Standar Kompetensi Lulusan)', 'SNP-3 (Standar Proses)'],
    capabilities: [
      'Mengunggah program pembinaan karakter wawasan kebangsaan, nasionalisme, dan bela negara bagi peserta didik.',
      'Mendokumentasikan tata upacara bendera, apel disiplin pagi, dan kegiatan peringatan hari besar nasional.',
      'Mengunggah Petunjuk Kerja (PK) pelaksanaan PBB/Paskibra dan Catatan Mutu (F) presensi pembinaan kedisiplinan.',
      'Mengisi evaluasi mandiri indeks ketahanan nasionalisme siswa dan Rekapitulasi Kegiatan Kebangsaan.',
      'Mengajukan program RTL kemitraan pembinaan karakter bersama Kodim dan Polres Magelang.'
    ],
    driveFolders: ['01. Standar SKL', '03. Standar Proses & PjBL', '10. Portofolio & Dokumentasi']
  },
  {
    id: 'u-16',
    num: 16,
    code: 'BK',
    name: '16. UNIT KERJA BK',
    pic: 'Dra. Endang Sulastri',
    email: 'bk@smkn2magelang.sch.id',
    pw: 'sintesa123',
    category: 'Layanan',
    snp: ['SNP-3 (Standar Proses)', 'SNP-7 (Standar Pengelolaan)'],
    capabilities: [
      'Mengunggah Program Tahunan Layanan BK (Bimbingan Pribadi, Sosial, Belajar, dan Karir).',
      'Mengunggah instrumen asesmen diagnostik non-kognitif awal tahun untuk pemetaan gaya belajar dan minat karir.',
      'Mengunggah Petunjuk Kerja (PK) konseling individual/kelompok dan Catatan Mutu (F) kartu konseling siswa.',
      'Mengisi evaluasi mandiri iklim keamanan sekolah, program anti-perundungan, dan Rekapitulasi Konseling.',
      'Mengajukan RTL workshop penelusuran karir dan psikotes industri bagi siswa kelas XII.'
    ],
    driveFolders: ['03. Standar Proses & PjBL', '07. Standar Pengelolaan & SPMI']
  },
  {
    id: 'u-17',
    num: 17,
    code: 'BKK',
    name: '17. UNIT KERJA BKK',
    pic: 'Wahyu Nugroho, S.Pd.',
    email: 'bkk@smkn2magelang.sch.id',
    pw: 'sintesa123',
    category: 'Layanan',
    snp: ['SNP-1 (Standar Kompetensi Lulusan)', 'SNP-7 (Standar Pengelolaan)'],
    capabilities: [
      'Mengunggah laporan Tracer Study keterserapan alumni 1-3 tahun setelah lulus (Bekerja, Melanjutkan Kuliah, Wirausaha - BMW).',
      'Mengunggah Berita Acara dan dokumentasi pelaksanaan Campus Recruitment dan Job Fair SMK.',
      'Mengunggah Petunjuk Kerja (PK) rekrutmen kerja dan Catatan Mutu (F) data penyaluran alumni ke IDUKA mitra.',
      'Mengisi instrumen evaluasi mandiri persentase keterserapan lulusan (target > 85%) & Rekapitulasi Tracer Study.',
      'Mengajukan program RTL pembekalan kesiapan kerja (interview training, psikotes, dan tes fisik industri).'
    ],
    driveFolders: ['01. Standar SKL', '07. Standar Pengelolaan & SPMI', '10. Portofolio & Dokumentasi']
  },
  {
    id: 'u-18',
    num: 18,
    code: 'UPS',
    name: '18. UNIT KERJA UPS',
    pic: 'Anwar Sadat, S.T.',
    email: 'ups@smkn2magelang.sch.id',
    pw: 'sintesa123',
    category: 'Kejuruan',
    snp: ['SNP-3 (Standar Proses)', 'SNP-8 (Standar Pembiayaan)'],
    capabilities: [
      'Mengunggah Standar Operasional Prosedur (SOP) operasional Unit Produksi dan Jasa Sekolah (UPS) vokasi.',
      'Mengunggah neraca laporan omzet produksi barang/jasa vokasi dan kontribusi pendapatan ke kas BLUD sekolah.',
      'Mengunggah Petunjuk Kerja (PK) alur produksi dan Catatan Mutu (F) faktur pemesanan dan bukti serah terima jasa.',
      'Mengisi evaluasi mandiri keterlibatan siswa dalam siklus produksi riil & Rekapitulasi Kinerja Produksi UPS.',
      'Mengajukan program RTL peningkatan kapasitas mesin produksi dan perluasan pemasaran produk TEFA.'
    ],
    driveFolders: ['03. Standar Proses & PjBL', '08. Standar Pembiayaan & RKAS', '10. Portofolio & Dokumentasi']
  }
];

export default function PanduanAksesPage() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`${label} disalin ke clipboard: "${text}"`, 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDoc = () => {
    const headerHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Panduan Hak Akses & Kredensial SINTESA TPMPS</title>
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; color: #1e293b; }
        h1 { font-size: 18pt; color: #0077B6; text-align: center; font-weight: bold; margin-bottom: 4pt; }
        h2 { font-size: 14pt; color: #0f172a; border-bottom: 2pt solid #0077B6; padding-bottom: 4pt; margin-top: 18pt; }
        h3 { font-size: 12pt; color: #0284c7; margin-top: 12pt; }
        table { border-collapse: collapse; width: 100%; margin-top: 10pt; margin-bottom: 12pt; }
        th { background-color: #f1f5f9; border: 1pt solid #cbd5e1; padding: 6pt; font-weight: bold; text-align: left; font-size: 10pt; }
        td { border: 1pt solid #cbd5e1; padding: 6pt; font-size: 10pt; }
        .kop { text-align: center; border-bottom: 2pt solid #000; padding-bottom: 8pt; margin-bottom: 16pt; }
        .kop h2 { margin: 0; font-size: 15pt; color: #000; border: none; }
        .kop p { margin: 2pt 0; font-size: 9pt; color: #475569; }
        .badge { display: inline-block; padding: 2pt 6pt; border-radius: 4pt; font-size: 9pt; font-weight: bold; }
        .cred-box { background: #f8fafc; border: 1pt solid #cbd5e1; padding: 8pt; border-radius: 6pt; margin: 6pt 0; }
      </style>
      </head>
      <body>
    `;

    let contentHtml = `
      <div class="kop">
        <p style="font-weight: bold; text-transform: uppercase;">PEMERINTAH PROVINSI JAWA TENGAH &bull; DINAS PENDIDIKAN DAN KEBUDAYAAN</p>
        <h2>SMK NEGERI 2 MAGELANG</h2>
        <p>Jl. Perintis Kemerdekaan No. 9, Kota Magelang, Jawa Tengah 56115 | Telp: (0293) 362577</p>
        <p style="font-weight: bold; color: #0077B6;">SINTESA TPMPS &bull; SISTEM PENJAMINAN MUTU INTERNAL SEKOLAH (SPMI)</p>
      </div>

      <h1>DOKUMEN PANDUAN HAK AKSES, WEWENANG, & KREDENSIAL PENGGUNA</h1>
      <p style="text-align: center; font-style: italic; color: #64748b;">Tahun Ajaran 2025/2026 &bull; Sesuai 8 Standar Nasional Pendidikan (SNP) & Siklus PPEPP</p>

      <h2>1. PERAN TINGKAT PIMPINAN & AUDITOR SISTEM</h2>
      
      <h3>A. Super Admin (Administrator Sistem)</h3>
      <div class="cred-box">
        <strong>Email Resmi:</strong> admin.sintesa@smkn2magelang.sch.id (Alias: admin@smkn2magelang.sch.id / admin)<br>
        <strong>Kata Sandi Default:</strong> sintesa123<br>
        <strong>Peran & Wewenang:</strong>
        <ul>
          <li>Manajemen unit penuh (CRUD Unit di /unit): Menambah unit baru, mengedit data unit, dan menghapus unit kerja.</li>
          <li>Manajemen pengguna: aktivasi, reset password, dan konfigurasi hak akses 15 unit kerja.</li>
          <li>Akses penuh ke seluruh Google Drive Unit kerja (lihat, unduh, kelola, hapus, restore berkas).</li>
          <li>Pengaturan bobot dan indikator 8 Standar Nasional Pendidikan (SNP).</li>
          <li>Pemantauan real-time Activity Audit Trail & Log keamanan Supabase PostgreSQL.</li>
          <li>Integritas dan backup snapshot basis data secara berkala.</li>
        </ul>
      </div>

      <h3>B. Ketua TPMPS (Tim Penjaminan Mutu Pendidikan Sekolah)</h3>
      <div class="cred-box">
        <strong>Email Resmi:</strong> tpmps.ketua@smkn2magelang.sch.id (Alias: tpmps@smkn2magelang.sch.id / tpmps)<br>
        <strong>Kata Sandi Default:</strong> sintesa123<br>
        <strong>Peran & Wewenang Sesuai Manual Mutu 2024:</strong>
        <ul>
          <li><strong>Pengelola Dokumen Level 1:</strong> Bertanggung jawab menyusun, memperbarui, dan memelihara Manual Mutu (MM).</li>
          <li><strong>Pengelola Dokumen Level 2:</strong> Menyusun dan menetapkan Prosedur Mutu (PM) / SOP tata cara proses mutu sekolah.</li>
          <li>Memimpin siklus PPEPP (Penetapan, Pelaksanaan, Evaluasi, Pengendalian, Peningkatan) mutu internal.</li>
          <li>Memvalidasi & memverifikasi dokumen bukti fisik di Bank Dokumen & Google Drive Unit (Status: Terverifikasi, Perlu Revisi, Ditolak).</li>
          <li>Memberikan penilaian verifikasi auditor atas instrumen evaluasi mandiri unit kerja.</li>
          <li>Menerbitkan Laporan Evaluasi Diri Sekolah (EDS) dan Rapor Mutu untuk diserahkan ke Kepala Sekolah.</li>
        </ul>
      </div>

      <h3>C. Kepala Sekolah (Executive Lead)</h3>
      <div class="cred-box">
        <strong>Email Resmi:</strong> kepala.sekolah@smkn2magelang.sch.id (Alias: kepsek@smkn2magelang.sch.id / kepsek / kasek)<br>
        <strong>Kata Sandi Default:</strong> sintesa123<br>
        <strong>Peran & Wewenang Sesuai Manual Mutu 2024:</strong>
        <ul>
          <li><strong>Pembuat Eksklusif Periode Mutu:</strong> SATU-SATUNYA akun yang memiliki hak akses membuat, mengaktifkan, dan mengarsipkan Periode Mutu SPMI (/periode).</li>
          <li><strong>Status Read-Only Operasional:</strong> Berstatus Read-Only untuk pengisian rutin dokumen/evaluasi mandiri unit, dengan hak inspeksi menyeluruh ke seluruh 18 unit kerja.</li>
          <li>Memantau Dashboard Mutu Agregat capaian 8 Standar Nasional Pendidikan secara komprehensif.</li>
          <li>Memberikan persetujuan akhir (Approval) atas Rapor Mutu Sekolah dan Laporan EDS.</li>
          <li>Meninjau ketercapaian dan alokasi anggaran Rencana Tindak Lanjut (RTL) tiap unit kerja.</li>
          <li>Melihat arsip dokumen mutu di Drive seluruh 18 unit kerja.</li>
        </ul>
      </div>

      <h2>2. HIERARKI DOKUMEN INTERNAL SPMI (MANUAL MUTU 2024)</h2>
      <p>Berdasarkan Manual Mutu 2024 SMK Negeri 2 Magelang, hierarki dokumen sistem manajemen mutu sekolah terdiri atas:</p>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 12pt;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th>Tingkat</th>
            <th>Singkatan</th>
            <th>Nama Dokumen Mutu</th>
            <th>Wewenang Pengelolaan</th>
            <th>Fungsi / Deskripsi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Level 1</strong></td>
            <td><strong>MM</strong></td>
            <td>Manual Mutu</td>
            <td><strong>Ketua TPMPS</strong></td>
            <td>Dokumen utama yang menjelaskan sistem dan manajemen mutu sekolah secara makro.</td>
          </tr>
          <tr>
            <td><strong>Level 2</strong></td>
            <td><strong>PM</strong></td>
            <td>Prosedur Mutu</td>
            <td><strong>Ketua TPMPS</strong></td>
            <td>Prosedur/SOP yang mengatur bagaimana suatu proses penjaminan mutu dilaksanakan.</td>
          </tr>
          <tr>
            <td><strong>Level 3</strong></td>
            <td><strong>PK</strong></td>
            <td>Petunjuk Kerja</td>
            <td><strong>Unit Kerja</strong></td>
            <td>Petunjuk/langkah kerja teknis untuk menjalankan suatu kegiatan operasional unit.</td>
          </tr>
          <tr>
            <td><strong>Level 4</strong></td>
            <td><strong>CM / F</strong></td>
            <td>Catatan Mutu (Formulir F)</td>
            <td><strong>Unit Kerja</strong></td>
            <td>Formulir rekaman dan bukti otentik bahwa kegiatan mutu telah selesai dilaksanakan.</td>
          </tr>
          <tr>
            <td><strong>Laporan</strong></td>
            <td><strong>REKAP</strong></td>
            <td>Rekapitulasi Unit</td>
            <td><strong>Unit Kerja</strong></td>
            <td>Laporan rekapitulasi ketercapaian target mutu dan evaluasi kinerja unit.</td>
          </tr>
        </tbody>
      </table>

      <h2>3. TABEL KREDENSIAL 18 UNIT KERJA RESMI</h2>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Kode</th>
            <th>Nama Unit Kerja</th>
            <th>Penanggung Jawab (PIC)</th>
            <th>Email Resmi</th>
            <th>Kata Sandi</th>
            <th>Kategori</th>
          </tr>
        </thead>
        <tbody>
    `;

    UNITS_DATA.forEach((u) => {
      contentHtml += `
        <tr>
          <td>${u.num}</td>
          <td><strong>${u.code}</strong></td>
          <td>${u.name}</td>
          <td>${u.pic}</td>
          <td><code>${u.email}</code></td>
          <td><code>${u.pw}</code></td>
          <td>${u.category}</td>
        </tr>
      `;
    });

    contentHtml += `
        </tbody>
      </table>

      <h2>4. RINCIAN WEWENANG & APA SAJA YANG BISA DILAKUKAN 18 UNIT KERJA</h2>
    `;

    UNITS_DATA.forEach((u) => {
      contentHtml += `
        <h3>Unit ${u.num}: ${u.name} (${u.code})</h3>
        <p><strong>PIC:</strong> ${u.pic} | <strong>Email:</strong> ${u.email} | <strong>Standar SNP Diampu:</strong> ${u.snp.join(', ')}</p>
        <p><strong>Wewenang & Kemampuan di Sistem SINTESA:</strong></p>
        <ul>
          ${u.capabilities.map((c) => `<li>${c}</li>`).join('')}
        </ul>
        <p><strong>Folder Google Drive Unit:</strong> ${u.driveFolders.join(', ')}</p>
        <hr style="border: 0.5pt solid #e2e8f0; margin: 12pt 0;">
      `;
    });

    contentHtml += `
      <h2>4. FITUR MANAJEMEN CRUD UNIT KERJA (/unit)</h2>
      <p>Sistem SINTESA TPMPS menyediakan fleksibilitas tata kelola kelembagaan melalui modul <strong>Kelola Unit Kerja (/unit)</strong>:</p>
      <ul>
        <li><strong>Hak Akses Khusus:</strong> Hanya <strong>Super Admin</strong>, <strong>Kepala Sekolah</strong>, dan <strong>Ketua TPMPS</strong> yang diizinkan melakukan operasi CRUD. Akun unit kerja (Unit 1 s/d 15) tidak diizinkan mengubah struktur unit lain.</li>
        <li><strong>Tambah Unit (Create):</strong> Pimpinan dapat membuat unit kerja baru (misal: penambahan Pokja Kewirausahaan, LSP-P1, Satgas Baru) dengan menentukan kode, nama unit, PIC, email, password, kategori, dan standar SNP terkait.</li>
        <li><strong>Ubah Unit (Update):</strong> Memperbarui informasi nama unit, pergantian PIC pejabat unit, email kontak resmi, dan standar SNP yang diampu.</li>
        <li><strong>Hapus Unit (Delete):</strong> Menghapus unit kerja yang sudah dilebur atau tidak aktif dengan konfirmasi proteksi sistem.</li>
      </ul>

      <h2>5. FITUR GOOGLE DRIVE PER UNIT DI SINTESA TPMPS (/drive)</h2>
      <p>Setiap unit kerja memiliki halaman repositori mandiri berformat Google Drive (/drive) dengan fasilitas:</p>
      <ul>
        <li><strong>+ Baru:</strong> Membuat folder baru dan mengunggah berkas bukti digital (PDF, Excel, Word, Gambar).</li>
        <li><strong>Struktur Folder SNP:</strong> Folder otomatis terbagi berdasarkan 8 Standar Nasional Pendidikan.</li>
        <li><strong>Validasi Status:</strong> Status berkas (Menunggu Review, Terverifikasi, Perlu Revisi) terpantau langsung.</li>
        <li><strong>Dokumen Berbintang:</strong> Menandai dokumen penting agar mudah diakses di tab Berbintang.</li>
        <li><strong>Pratinjau Layar Penuh:</strong> Melihat isi dokumen langsung tanpa perlu keluar dari aplikasi.</li>
      </ul>

      <br><br>
      <table style="border: none; width: 100%;">
        <tr style="border: none;">
          <td style="border: none; width: 50%; text-align: center;">
            Mengetahui,<br><strong>Kepala SMK Negeri 2 Magelang</strong><br><br><br><br>
            <strong><u>Drs. H. Mulyono, M.Pd.</u></strong><br>NIP. 196803121992031004
          </td>
          <td style="border: none; width: 50%; text-align: center;">
            Kota Magelang, September 2025<br><strong>Ketua TPMPS SMK N 2 Magelang</strong><br><br><br><br>
            <strong><u>Dra. Hj. Siti Fatimah, M.M.</u></strong><br>NIP. 197509182002122001
          </td>
        </tr>
      </table>
      </body></html>
    `;

    const fullDoc = headerHtml + contentHtml;
    const blob = new Blob(['\ufeff' + fullDoc], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PANDUAN_HAK_AKSES_DAN_KREDENSIAL_SINTESA_TPMPS.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Dokumen Word (.DOC) berhasil diunduh ke komputer Anda!', 'success');
  };

  const filteredUnits = UNITS_DATA.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.code.toLowerCase().includes(q) ||
      u.pic.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.category.toLowerCase().includes(q)
    );
  });

  return (
    <AppShell
      title="Panduan Hak Akses & Kredensial Pengguna"
      subtitle="Dokumentasi Resmi Wewenang Sistem, Akun, Email, dan Kata Sandi Unit Kerja SINTESA TPMPS"
    >
      {/* -------------------------------------------------------------
          TOP BAR: Actions (Cetak PDF, Download DOC, Search)
      ------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs mb-6 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Panduan Wewenang & Kredensial Akun
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Dokumen resmi hak akses Super Admin, Ketua TPMPS, Kepala Sekolah, dan 18 Unit Kerja Resmi Sesuai Manual Mutu 2024
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handlePrint}
              className="btn-enterprise px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-2xs transition-colors"
            >
              <Printer className="w-4 h-4 text-[#0077B6]" />
              <span>Cetak / Download PDF</span>
            </button>

            <a
              href="/BUKU_PANDUAN_SINTESA_TPMPS.docx"
              download
              className="btn-enterprise px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] hover:brightness-105 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Buku Panduan Word (.DOCX)</span>
            </a>
          </div>
        </div>

        {/* Quick Search Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari unit kerja, nama PIC, email, atau standar SNP..."
              className="w-full min-h-[42px] pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0077B6] text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-hidden transition-all"
            />
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          MAIN DOCUMENT SHEET (Formatted for Print & Screen)
      ------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-8 print:border-none print:shadow-none print:p-0">
        {/* KOP SURAT RESMI */}
        <div className="border-b-4 border-double border-slate-900 pb-5 text-center space-y-1 relative">
          <div className="flex items-center justify-center gap-4 mb-2">
            <Image
              src="/logo.png"
              alt="Logo SMK Negeri 2 Magelang"
              width={64}
              height={64}
              className="w-16 h-16 object-contain"
              unoptimized
            />
            <div className="text-left">
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-600">
                PEMERINTAH PROVINSI JAWA TENGAH &bull; DINAS PENDIDIKAN DAN KEBUDAYAAN
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                SMK NEGERI 2 MAGELANG
              </h1>
              <p className="text-xs text-slate-600">
                Jl. Perintis Kemerdekaan No. 9, Kota Magelang, Jawa Tengah 56115 | Telp: (0293) 362577
              </p>
              <p className="text-[11px] font-bold text-[#0077B6]">
                SINTESA TPMPS &bull; SISTEM PENJAMINAN MUTU INTERNAL SEKOLAH (SPMI)
              </p>
            </div>
          </div>
        </div>

        {/* DOCUMENT HEADER META */}
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 text-[#0077B6] border border-blue-200">
            DOKUMEN RESMI TATA KELOLA MUTU PENDIDIKAN &bull; MANUAL MUTU 2024
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            PANDUAN HAK AKSES, WEWENANG SISTEM, & KREDENSIAL 18 UNIT KERJA
          </h2>
          <p className="text-xs text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Struktur resmi sesuai Manual Mutu 2024: K3 dipecah menjadi 4 Kejuruan (PPLG, MPLB, PM, AKL). Kepala Sekolah berstatus Read-Only untuk operasional pengisian unit dan memegang wewenang eksklusif penetapan Periode Mutu SPMI. Ketua TPMPS mengelola dokumen Level 1 (MM) & Level 2 (PM). Unit kerja mengelola Level 3 (PK), Level 4 (Catatan Mutu F), dan Rekapitulasi Unit.
          </p>
        </div>

        {/* -------------------------------------------------------------
            SECTION 1: PERAN TINGKAT PIMPINAN (Super Admin, TPMPS, Kepsek)
        ------------------------------------------------------------- */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <ShieldCheck className="w-5 h-5 text-[#0077B6]" />
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              1. Wewenang Tingkat Pimpinan & Auditor Mutu
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* SUPER ADMIN */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                    SUPER ADMIN
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Level 0</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">
                  Administrator Sistem (IT Lead)
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Pengendalian infrastruktur, akun, hak akses, dan integritas basis data.
                </p>

                {/* Credentials */}
                <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Email:</span>
                    <div className="flex items-center gap-1.5 font-mono text-slate-900">
                      <span className="truncate max-w-[150px]">admin.sintesa@smkn2magelang.sch.id</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('admin.sintesa@smkn2magelang.sch.id', 'admin-email', 'Email Admin')}
                        className="text-slate-400 hover:text-[#0077B6]"
                      >
                        {copiedKey === 'admin-email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Password:</span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                      <span>sintesa123</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('sintesa123', 'admin-pw', 'Password Admin')}
                        className="text-slate-400 hover:text-[#0077B6]"
                      >
                        {copiedKey === 'admin-pw' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    Alias Cepat: <code className="text-[#0077B6]">admin</code> / <code className="text-[#0077B6]">admin@smkn2magelang.sch.id</code>
                  </div>
                </div>

                {/* Capabilities */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <span className="font-bold text-slate-800 block text-[11px]">Apa yang bisa dilakukan:</span>
                  <ul className="space-y-1 list-disc list-inside">
                    <li><strong className="text-[#0077B6]">CRUD Unit Kerja di /unit:</strong> Tambah unit baru, edit data, dan hapus unit kerja.</li>
                    <li>Kelola seluruh akun (tambah, edit, nonaktifkan, reset password).</li>
                    <li>Akses penuh seluruh Google Drive Unit kerja (15 unit).</li>
                    <li>Konfigurasi master data 8 Standar Nasional Pendidikan & bobot skor.</li>
                    <li>Pantau Activity Log & jejak audit forensik keamanan.</li>
                    <li>Manajemen backup PostgreSQL & Row Level Security (RLS).</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* KETUA TPMPS */}
            <div className="p-5 rounded-2xl bg-blue-50/40 border border-blue-200 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-100 text-[#0077B6] border border-blue-200">
                    KETUA TPMPS (MM & PM)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Auditor Utama</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">
                  Dra. Hj. Siti Fatimah, M.M.
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Penanggung jawab siklus PPEPP, pengelolaan Manual Mutu (MM) & Prosedur Mutu (PM), verifikasi bukti mutu, dan Laporan EDS.
                </p>

                {/* Credentials */}
                <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Email:</span>
                    <div className="flex items-center gap-1.5 font-mono text-slate-900">
                      <span className="truncate max-w-[150px]">tpmps.ketua@smkn2magelang.sch.id</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('tpmps.ketua@smkn2magelang.sch.id', 'tpmps-email', 'Email TPMPS')}
                        className="text-slate-400 hover:text-[#0077B6]"
                      >
                        {copiedKey === 'tpmps-email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Password:</span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                      <span>sintesa123</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('sintesa123', 'tpmps-pw', 'Password TPMPS')}
                        className="text-slate-400 hover:text-[#0077B6]"
                      >
                        {copiedKey === 'tpmps-pw' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    Alias Cepat: <code className="text-[#0077B6]">tpmps</code> / <code className="text-[#0077B6]">tpmps@smkn2magelang.sch.id</code>
                  </div>
                </div>

                {/* Capabilities */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <span className="font-bold text-slate-800 block text-[11px]">Apa yang bisa dilakukan:</span>
                  <ul className="space-y-1 list-disc list-inside">
                    <li><strong className="text-[#0077B6]">Wewenang Dokumen Level 1:</strong> Mengelola, memperbarui, dan menjaga Manual Mutu (MM).</li>
                    <li><strong className="text-[#0077B6]">Wewenang Dokumen Level 2:</strong> Mengelola Prosedur Mutu (PM) / SOP tata cara proses mutu sekolah.</li>
                    <li>Memimpin seluruh siklus PPEPP penjaminan mutu internal sekolah.</li>
                    <li>Validasi dokumen bukti di antrean validasi (Terverifikasi / Revisi / Tolak).</li>
                    <li>Memberikan skor penilaian verifikasi auditor pada evaluasi unit.</li>
                    <li>Menerbitkan Rapor Mutu Sekolah dan Laporan EDS resmi.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* KEPALA SEKOLAH */}
            <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-200">
                    KEPALA SEKOLAH (READ-ONLY & PERIODE)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Executive</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">
                  Drs. H. Mulyono, M.Pd.
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Pengawasan eksekutif seluruh 18 unit (Read-Only) dan pembuat eksklusif Periode Mutu SPMI.
                </p>

                {/* Credentials */}
                <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Email:</span>
                    <div className="flex items-center gap-1.5 font-mono text-slate-900">
                      <span className="truncate max-w-[150px]">kepala.sekolah@smkn2magelang.sch.id</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('kepala.sekolah@smkn2magelang.sch.id', 'kepsek-email', 'Email Kepsek')}
                        className="text-slate-400 hover:text-[#0077B6]"
                      >
                        {copiedKey === 'kepsek-email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Password:</span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                      <span>sintesa123</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('sintesa123', 'kepsek-pw', 'Password Kepsek')}
                        className="text-slate-400 hover:text-[#0077B6]"
                      >
                        {copiedKey === 'kepsek-pw' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    Alias Cepat: <code className="text-[#0077B6]">kasek</code> / <code className="text-[#0077B6]">kepsek</code>
                  </div>
                </div>

                {/* Capabilities */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <span className="font-bold text-slate-800 block text-[11px]">Apa yang bisa dilakukan:</span>
                  <ul className="space-y-1 list-disc list-inside">
                    <li><strong className="text-amber-800">Pembuat Eksklusif Periode Mutu:</strong> SATU-SATUNYA akun yang berwenang membuat & menetapkan Periode Mutu SPMI (/periode).</li>
                    <li><strong className="text-amber-800">Status Read-Only Operasional:</strong> Akses pantau menyeluruh terhadap capaian dan bukti seluruh 18 unit kerja.</li>
                    <li>Monitoring Dashboard Agregat capaian 8 SNP secara real-time.</li>
                    <li>Persetujuan akhir (Approval) Laporan Evaluasi Diri Sekolah (EDS).</li>
                    <li>Peninjauan alokasi dana dan pencapaian target program RTL.</li>
                    <li>Akses lihat ke seluruh repositori Drive 18 unit sekolah.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            HIERARKI DOKUMEN INTERNAL SPMI (Manual Mutu 2024)
        ------------------------------------------------------------- */}
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#0077B6]" />
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Hierarki Dokumen Internal SPMI (Manual Mutu SMKN 2 Magelang 2024)
              </h3>
            </div>
            <span className="text-xs font-mono text-[#0077B6] font-bold">
              MM &rarr; PM &rarr; PK &rarr; F (Catatan Mutu) &rarr; Rekapitulasi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-white border border-indigo-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-indigo-700 text-sm">MM</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">Level 1</span>
              </div>
              <h4 className="font-bold text-slate-900">Manual Mutu</h4>
              <p className="text-[11px] text-slate-500">Dokumen utama yang menjelaskan sistem dan kebijakan manajemen mutu sekolah secara makro.</p>
              <div className="pt-2 border-t border-slate-100 font-bold text-indigo-700 text-[11px]">
                Wewenang: Ketua TPMPS
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-sky-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-[#0077B6] text-sm">PM</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-[#0077B6]">Level 2</span>
              </div>
              <h4 className="font-bold text-slate-900">Prosedur Mutu</h4>
              <p className="text-[11px] text-slate-500">Prosedur operasional (SOP) yang mengatur bagaimana suatu proses penjaminan mutu dilaksanakan.</p>
              <div className="pt-2 border-t border-slate-100 font-bold text-[#0077B6] text-[11px]">
                Wewenang: Ketua TPMPS
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-emerald-700 text-sm">PK</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Level 3</span>
              </div>
              <h4 className="font-bold text-slate-900">Petunjuk Kerja</h4>
              <p className="text-[11px] text-slate-500">Petunjuk/instruksi teknis pelaksanaan untuk menjalankan setiap kegiatan di unit kerja.</p>
              <div className="pt-2 border-t border-slate-100 font-bold text-emerald-700 text-[11px]">
                Wewenang: Unit Kerja
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-amber-700 text-sm">CM (F)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Level 4</span>
              </div>
              <h4 className="font-bold text-slate-900">Catatan Mutu (F)</h4>
              <p className="text-[11px] text-slate-500">Formulir rekaman (bertanda F) dan bukti nyata bahwa kegiatan mutu telah selesai dilaksanakan.</p>
              <div className="pt-2 border-t border-slate-100 font-bold text-amber-700 text-[11px]">
                Wewenang: Unit Kerja
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-purple-700 text-sm">REKAP</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">Laporan</span>
              </div>
              <h4 className="font-bold text-slate-900">Rekapitulasi Unit</h4>
              <p className="text-[11px] text-slate-500">Laporan agregat ketercapaian target mutu dan evaluasi kinerja tahunan unit kerja.</p>
              <div className="pt-2 border-t border-slate-100 font-bold text-purple-700 text-[11px]">
                Wewenang: Unit Kerja
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            SECTION 2: TABEL KREDENSIAL 18 UNIT KERJA RESMI
        ------------------------------------------------------------- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0077B6]" />
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                2. Tabel Kredensial 18 Unit Kerja Resmi Sesuai Manual Mutu 2024
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              Total {filteredUnits.length} Unit Kerja
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3.5 text-center">No</th>
                  <th className="py-3 px-3">Kode</th>
                  <th className="py-3 px-4">Nama Unit Kerja</th>
                  <th className="py-3 px-4">Penanggung Jawab (PIC)</th>
                  <th className="py-3 px-4">Email Resmi Sistem</th>
                  <th className="py-3 px-3 text-center">Kata Sandi</th>
                  <th className="py-3 px-3">Kategori</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUnits.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3.5 text-center font-mono font-bold text-slate-500">
                      {u.num}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#0077B6]">
                      {u.code}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {u.name}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {u.pic}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span>{u.email}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(u.email, `u-email-${u.id}`, `Email ${u.name}`)}
                          className="text-slate-400 hover:text-[#0077B6] print:hidden"
                          title="Salin Email"
                        >
                          {copiedKey === `u-email-${u.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 bg-slate-50/50">
                      <div className="flex items-center justify-center gap-1.5">
                        <span>{u.pw}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(u.pw, `u-pw-${u.id}`, `Password ${u.name}`)}
                          className="text-slate-400 hover:text-[#0077B6] print:hidden"
                          title="Salin Kata Sandi"
                        >
                          {copiedKey === `u-pw-${u.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {u.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* -------------------------------------------------------------
            SECTION 3: DETAIL LENGKAP APA SAJA YANG BISA DILAKUKAN 18 UNIT KERJA
        ------------------------------------------------------------- */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <BookOpen className="w-5 h-5 text-[#0077B6]" />
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              3. Rincian Hak Akses & Tugas 18 Unit Kerja di SINTESA TPMPS
            </h3>
          </div>

          <div className="space-y-5">
            {UNITS_DATA.map((unit) => (
              <div
                key={unit.id}
                className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200 hover:border-blue-300 transition-all space-y-3.5"
              >
                {/* Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#0077B6] text-white font-mono font-black text-xs">
                      {unit.num}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Unit {unit.num}: {unit.name} ({unit.code})
                      </h4>
                      <p className="text-xs text-slate-500">
                        PIC: <span className="font-semibold text-slate-800">{unit.pic}</span> &bull; Kategori: {unit.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                      {unit.email}
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[#0077B6] font-bold">
                      PW: {unit.pw}
                    </span>
                  </div>
                </div>

                {/* Standar SNP yang diampu */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Standar SNP yang Diampu:
                  </span>
                  {unit.snp.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0077B6] font-bold text-[10px] border border-blue-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Capabilities list */}
                <div className="text-xs space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                    Wewenang & Apa Saja yang Bisa Dilakukan di SINTESA:
                  </span>
                  <ul className="space-y-1 text-slate-600 list-disc list-inside pl-1 leading-relaxed">
                    {unit.capabilities.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                {/* Google Drive Folders */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <HardDrive className="w-3.5 h-3.5 text-[#0077B6]" />
                    <span className="font-semibold text-slate-700">Folder di Google Drive Unit:</span>
                    {unit.driveFolders.map((f, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                        {f}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/drive`}
                    className="text-[#0077B6] hover:underline font-bold text-[11px] print:hidden"
                  >
                    Buka Drive Unit &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* -------------------------------------------------------------
            SECTION 4: PETUNJUK GOOGLE DRIVE & SIKLUS PPEPP
        ------------------------------------------------------------- */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-blue-200 space-y-4">
          <div className="flex items-center gap-2 text-[#0077B6]">
            <HardDrive className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">
              Petunjuk Penggunaan Google Drive Per Unit (/drive)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-xs">1. Navigasi Unit & Folder</span>
              <p>
                Pilih unit kerja Anda di panel sebelah kiri. Berkas telah dikelompokkan secara otomatis berdasarkan 8 Standar Nasional Pendidikan (SNP) dan kategori dokumen kerja.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-xs">2. Upload Berkas Bukti (+ Baru)</span>
              <p>
                Klik tombol <strong>+ Baru</strong> untuk mengunggah dokumen bukti baru atau membuat folder kustom. Berkas akan langsung tersimpan di Cloud Storage sekolah.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-xs">3. Alur Verifikasi TPMPS</span>
              <p>
                Dokumen yang diunggah akan berstatus <em>Menunggu Review</em>, lalu diverifikasi oleh Tim TPMPS menjadi <em>Terverifikasi</em> atau <em>Perlu Revisi</em> dengan catatan auditor.
              </p>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            SECTION 5: FITUR MANAJEMEN CRUD UNIT KERJA (/unit)
        ------------------------------------------------------------- */}
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Building2 className="w-5 h-5 text-[#0077B6]" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  5. Fitur Manajemen Unit Kerja (/unit) — Hak Akses CRUD Unit
                </h3>
                <p className="text-xs text-slate-500">
                  Khusus Super Admin, Kepala Sekolah, dan Ketua TPMPS untuk mengelola struktur unit sekolah
                </p>
              </div>
            </div>

            <Link
              href="/unit"
              className="px-4 py-2 rounded-xl bg-[#0077B6] hover:bg-[#0284C7] text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors print:hidden shadow-2xs"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Buka Halaman Kelola Unit (/unit) &rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">+</span>
                <span className="font-bold text-slate-900 text-xs">Tambah Unit (Create)</span>
              </div>
              <p>
                Pimpinan dapat menambahkan unit kerja baru sewaktu-waktu jika ada penambahan Pokja/Unit (misal Pokja Kewirausahaan, LSP, atau Satgas).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-100 text-[#0077B6] font-bold flex items-center justify-center text-xs">✎</span>
                <span className="font-bold text-slate-900 text-xs">Ubah Data Unit (Update)</span>
              </div>
              <p>
                Pimpinan dapat mengubah nama unit, nama PIC penanggung jawab saat ada mutasi/pergantian pejabat, alamat email resmi, serta standar SNP yang diampu.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">🗑</span>
                <span className="font-bold text-slate-900 text-xs">Hapus Unit (Delete)</span>
              </div>
              <p>
                Pimpinan dapat menghapus unit yang dimerger atau sudah tidak beroperasi dengan dialog konfirmasi keamanan sistem.
              </p>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            LEMBAR PENGESAHAN & TANDA TANGAN
        ------------------------------------------------------------- */}
        <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-xs text-slate-800 text-center">
          <div className="space-y-16">
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold text-slate-900">Kepala SMK Negeri 2 Magelang</p>
            </div>
            <div>
              <p className="font-bold text-slate-900 underline text-sm">Drs. H. Mulyono, M.Pd.</p>
              <p className="text-slate-500 font-mono">NIP. 196803121992031004</p>
            </div>
          </div>

          <div className="space-y-16">
            <div>
              <p>Kota Magelang, September 2025</p>
              <p className="font-bold text-slate-900">Ketua TPMPS SMK N 2 Magelang</p>
            </div>
            <div>
              <p className="font-bold text-slate-900 underline text-sm">Dra. Hj. Siti Fatimah, M.M.</p>
              <p className="text-slate-500 font-mono">NIP. 197509182002122001</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
