# SINTESA-TPMPS | Sistem Informasi Penjaminan Mutu Pendidikan Sekolah SMK

Aplikasi web modern berbasis **Next.js (App Router) + React + TypeScript + Tailwind CSS** yang dirancang berdasarkan **Product Requirements Document (PRD) Sistem Informasi TPMPS SMK**.

---

## 🌟 Fitur Utama Sesuai PRD

1. **Simulasi Multi-Peran (RBAC Interaktif):**
   - **Kepala Sekolah**: Akses eksekutif *read-only* ke seluruh 18 unit kerja, ringkasan KPI agregat, pemantauan 8 SNP, dan verifikasi akhir laporan resmi.
   - **Ketua TPMPS**: Pengelolaan siklus PPEPP, validasi & verifikasi evaluasi unit kerja, persetujuan bukti fisik, dan monitoring rencana tindak lanjut (RTL).
   - **Anggota TPMPS / Auditor Internal**: Pengumpulan data, audit berkas bukti dokumen, dan input draft rekomendasi perbaikan.
   - **WKS / Unit Kerja (18 Unit)**: Input penilaian mandiri (*self-assessment*), unggah dokumen bukti, dan pelaporan tindak lanjut program.
   - **Guru & Tenaga Kependidikan**: Unggah bukti dokumen kegiatan pembelajaran (modul ajar, bukti asesmen, portofolio).
   - **Admin Sistem**: Pengaturan hak akses, bobot 8 Standar Nasional Pendidikan (SNP), user management, dan audit trail lengkap.

2. **Dashboard Mutu Real-Time:**
   - Indeks Mutu Sekolah (Agregat 8 SNP, Predikat A / Unggul).
   - Indikator Keterisian 18 Unit Kerja (100% Onboard).
   - Persentase Dokumen Fisik Terverifikasi vs Pending.
   - Kartu Capaian 8 Standar Nasional Pendidikan (SKL, Isi, Proses, Penilaian, PTK, Sarpras, Pengelolaan, Pembiayaan).
   - Tabel Monitoring Kinerja 18 Unit Kerja per kategori (Manajemen, Kejuruan, Layanan, Pengawasan).

3. **Alur Evaluasi & Verifikasi (Workflow Stage):**
   - Pipeline: `Draft` ➔ `Diajukan` ➔ `Direview` ➔ `Disetujui` / `Perlu Revisi`.
   - Form penilaian mandiri dengan skor persentase (0-100%).
   - Form verifikasi auditor TPMPS dengan catatan/rekomendasi dan kunci nilai.

4. **Bank Bukti Dokumen (Evidence Management):**
   - Repositori terpusat dokumen bukti fisik (PDF, Spreadsheet, Word, Image).
   - Filter berdasarkan 18 Unit Kerja, 8 SNP, dan Status Verifikasi.
   - Simulator unggah berkas (drag-and-drop, versi v1.0, uploader identity).
   - Pratinjau dokumen & tombol sahkan verifikasi langsung oleh auditor TPMPS.

5. **Monitoring Rencana Tindak Lanjut (RTL) Mutu:**
   - Tampilan ganda: **Papan Kanban Interaktif** & **Tabel Daftar**.
   - Kolom status: `Belum Mulai`, `Sedang Berjalan`, `Selesai`, `Terlambat`.
   - Informasi anggaran biaya (Rp), PIC Unit, tingkat prioritas, dan deadline countdown.
   - Slider update progres realisasi persentase real-time.

6. **Generator Laporan Mutu & Evaluasi Diri Sekolah (EDS):**
   - Template Laporan EDS Komprehensif, Rapor 8 SNP, dan Matriks RTL.
   - **Pratinjau Dokumen Resmi**: Kop Surat Dinas Pendidikan Provinsi & SMKN 1 Unggul Terpadu, Berita Acara, Tabel Rapor 8 SNP, dan Tanda Tangan Digital Kepala Sekolah & Ketua TPMPS.
   - Siap cetak ke PDF (`@media print` clean formatting) atau ekspor data.

7. **Jejak Audit (Audit Trail):**
   - Pencatatan seluruh aksi: `APPROVAL_LAPORAN`, `REVIEW_EVALUASI`, `SUBMIT_EVALUASI`, `UPLOAD_DOKUMEN`, `CREATE_RTL`.
   - Dilengkapi stempel waktu (timestamp), user pelaku, peran, dan alamat IP.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi berada pada direktori:
```bash
cd C:\Users\lulus\tpmps-smk
```

### 1. Mode Development:
```bash
npm run dev
```
Buka browser di: **[http://localhost:3000](http://localhost:3000)**

### 2. Mode Production:
```bash
npm run build
npm run start
```
