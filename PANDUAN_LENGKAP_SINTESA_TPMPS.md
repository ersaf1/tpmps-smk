# BUKU PANDUAN LENGKAP PENGOPERASIAN SISTEM SINTESA TPMPS
## PANDUAN TEKNIS PENGGUNAAN LANGKAH DEMI LANGKAH (STEP-BY-STEP USER MANUAL)
### SISTEM INFORMASI PENJAMINAN MUTU INTERNAL TERPADU — SMK NEGERI 2 MAGELANG

---

## DAFTAR ISI
1. **BAB 1: PENDAHULUAN & PRINSIP DASAR SISTEM SINTESA**
   - 1.1 Apa itu SINTESA TPMPS?
   - 1.2 Konsep Siklus PPEPP di SMK Negeri 2 Magelang
   - 1.3 Pembagian Peran Pengguna (Role Hierarchy)
2. **BAB 2: MASTER KREDENSIAL AKUN (EMAIL, KODE LOGIN, PASSWORD)**
   - 2.1 Tabel Kredensial 15 Unit Resmi + Kepsek + TPMPS + Admin
   - 2.2 Panduan Login Cara 1: Fitur 1-Klik Login Demo
   - 2.3 Panduan Login Cara 2: Login Manual dengan Kode Singkat
   - 2.4 Panduan Logout / Keluar Sesi dengan Aman
3. **BAB 3: PANDUAN PENGOPERASIAN UNTUK 14 KOORDINATOR UNIT KERJA (PENGUNGGAH BUKTI FISIK)**
   - 3.1 Memahami Antarmuka Google Drive Unit (`/drive`)
   - 3.2 Langkah demi Langkah Mengunggah Bukti Fisik Baru (Tutorial Klik-per-Klik)
   - 3.3 Langkah demi Langkah Membuat Folder Kustom Tambahan
   - 3.4 Langkah demi Langkah Mengecek Status Berkas & Catatan Revisi dari TPMPS
   - 3.5 Langkah demi Langkah Memperbaiki & Mengunggah Ulang Dokumen Revisi
   - 3.6 Daftar Dokumen Wajib yang Harus Diunggah oleh Masing-Masing dari 15 Unit
4. **BAB 4: PANDUAN PENGOPERASIAN UNTUK KETUA TPMPS (AUDITOR & EVALUATOR MUTU)**
   - 4.1 Tugas & Wewenang Auditor TPMPS
   - 4.2 Langkah demi Langkah Memeriksa Berkas Masuk di Modul Validasi (`/dokumen/validasi`)
   - 4.3 Menggunakan Fitur Filter Unit Kerja agar Dokumen Tidak Bercampur
   - 4.4 Menggunakan Modal Inspeksi Split-Screen (Pratinjau Dokumen & Checklist Bukti)
   - 4.5 Memberikan Keputusan: Sahkan, Minta Revisi (dengan Catatan), atau Tolak
   - 4.6 Langkah demi Langkah Melakukan Evaluasi Mutu & Input Skor Indikator (`/evaluasi`)
   - 4.7 Langkah demi Langkah Menyusun Rencana Tindak Lanjut (RTL) Mutu (`/rtl`)
5. **BAB 5: PANDUAN PENGOPERASIAN UNTUK KEPALA SEKOLAH (KASEK)**
   - 5.1 Peran Eksekutif Kepala Sekolah
   - 5.2 Membaca Executive Dashboard Capaian 8 SNP (`/dashboard`)
   - 5.3 Langkah demi Langkah Validasi Akhir Dokumen Mutu Sekolah
   - 5.4 Langkah demi Langkah Mengesahkan Laporan Evaluasi Diri Sekolah (EDS) (`/laporan`)
   - 5.5 Mencetak & Mengekspor Laporan Mutu untuk Akreditasi BAN-PDM
6. **BAB 6: PANDUAN PENGOPERASIAN UNTUK SUPER ADMINISTRATOR**
   - 6.1 Mengelola Master Data 15 Unit Kerja (`/unit`)
   - 6.2 Manajemen Akun Pengguna & Reset Kredensial
   - 6.3 Backup & Pemeliharaan Integritas Data
7. **BAB 7: TANYA JAWAB TEKNIS (FAQ) & PEMECAHAN MASALAH (TROUBLESHOOTING)**

---

# BAB 1: PENDAHULUAN & PRINSIP DASAR SISTEM SINTESA

### 1.1 Apa itu SINTESA TPMPS?
**SINTESA TPMPS** (*Sistem Integrasi Penjaminan Mutu Terpadu*) adalah aplikasi web resmi SMK Negeri 2 Magelang yang dirancang untuk mengotomasi, memantau, dan mengarsipkan seluruh proses Penjaminan Mutu Pendidikan Sekolah berbasis **8 Standar Nasional Pendidikan (SNP)**.

Sebelum adanya sistem ini, pengumpulan bukti fisik akreditasi dilakukan secara manual menggunakan map kertas atau link Google Drive yang terpisah-pisah, sehingga rentan hilang, sulit dilacak status verifikasinya, dan memberatkan pimpinan saat harus merekap Laporan Evaluasi Diri Sekolah (EDS). SINTESA TPMPS menyatukan seluruh proses tersebut ke dalam satu pintu akses terpadu.

### 1.2 Konsep Siklus PPEPP di SMK Negeri 2 Magelang
Sistem SINTESA beroperasi mengikuti siklus penjaminan mutu resmi Direktorat Vokasi Kemendikbudristek:
1. **Penetapan (P)**: Pimpinan dan TPMPS menetapkan target indikator 8 SNP (target sekolah: rata-rata 95.0%).
2. **Pelaksanaan (P)**: 14 Koordinator Unit Kerja mengunggah berkas bukti fisik, modul ajar, dokumen inventaris, dan portofolio ke ruang kerja unit masing-masing.
3. **Evaluasi (E)**: Ketua TPMPS mengaudit kesesuaian dokumen bukti fisik dan memberikan skor capaian indikator (skala 1 - 4).
4. **Pengendalian (P)**: Jika ditemukan kekurangan bukti, dokumen dikembalikan dengan status **Perlu Revisi** beserta catatan perbaikan. Dokumen yang telah lengkap disahkan oleh Kepala Sekolah.
5. **Peningkatan (P)**: Kesenjangan mutu yang ditemukan ditindaklanjuti melalui modul **Rencana Tindak Lanjut (RTL)** untuk peningkatan mutu berkelanjutan.

### 1.3 Pembagian Peran Pengguna (Role Hierarchy)
Sistem membagi pengguna ke dalam 4 tingkatan wewenang:
* **Super Administrator**: Mengelola sistem pusat, master data unit, akun pengguna, dan konfigurasi instrumen.
* **Kepala Sekolah (1. KASEK)**: Memantau agregat mutu sekolah, memvalidasi dokumen tingkat akhir, dan menandatangani/mengesahkan Laporan EDS resmi.
* **Ketua TPMPS (7. UNIT KERJA TPMPS)**: Mengaudit bukti fisik unit, memberi catatan revisi, menginput skor evaluasi mutu, dan merumuskan RTL.
* **14 Koordinator Unit Kerja**: Mengunggah berkas eviden, mengelola folder drive unit, merespons catatan revisi, dan memantau persentase kelengkapan unitnya.

---

# BAB 2: MASTER KREDENSIAL AKUN (EMAIL, KODE LOGIN, PASSWORD)

> 🔑 **KATA SANDI (*PASSWORD*) DEFAULT SELURUH AKUN:**  
> `sintesa123`

### 2.1 Tabel Kredensial 15 Unit Resmi + Kepsek + TPMPS + Admin

Gunakan informasi akun berikut untuk masuk ke sistem:

| No | Nama Unit / Peran | Koordinator / PIC | Alamat Email Resmi | Kode Singkat Login | Hak Akses Utama |
|:---:|---|---|---|:---:|---|
| **0** | **SUPER ADMIN** | Rian Prasetyo, S.Kom. | `admin.sintesa@smkn2magelang.sch.id` | `admin` | Pengelolaan sistem, master unit, akun, database |
| **1** | **1. KASEK** | Drs. H. Mulyono, M.Pd. | `kasek@smkn2magelang.sch.id` | `kasek` | Executive Dashboard, Validasi Dokumen, Pengesahan EDS |
| **2** | **2. UNIT KERJA WKS 1** | Dra. Sri Wahyuni, M.Pd. | `wks1@smkn2magelang.sch.id` | `wks1` | Kurikulum, KOSP, Modul Ajar, Jadwal KBM, Asesmen UKK |
| **3** | **3. UNIT KERJA WKS 2** | Bambang Sutrisno, S.Pd. | `wks2@smkn2magelang.sch.id` | `wks2` | Kesiswaan, Tata Tertib, Prestasi Siswa, OSIS, Ekskul |
| **4** | **4. UNIT KERJA WKS 3** | Ir. Agus Haryanto, M.T. | `wks3@smkn2magelang.sch.id` | `wks3` | Sarpras, Inventaris Gedung/Lab, Perawatan, Kelaikan K3 |
| **5** | **5. UNIT KERJA WKS 4** | Drs. Hendro Wibowo | `wks4@smkn2magelang.sch.id` | `wks4` | Hubin/Humas, MoU/PKS DUDI Mitra, Laporan PKL Siswa |
| **6** | **6. UNIT KERJA K3** | Eko Prasetyo, S.Kom., M.Cs. | `k3@smkn2magelang.sch.id` | `k3` | Program Keahlian, Perangkat UKK, Jobsheet Praktikum |
| **7** | **7. UNIT KERJA TPMPS** | Dra. Hj. Siti Fatimah, M.M. | `tpmps@smkn2magelang.sch.id` | `tpmps` | Modul Validasi Bukti, Input Skor Evaluasi Mutu, RTL |
| **8** | **8. UNIT KERJA RENBANG** | Drs. Supriyadi, M.M. | `renbang@smkn2magelang.sch.id` | `renbang` | Perencanaan, RKS 4 Tahunan, RKAS, Roadmap SMK PK |
| **9** | **9. UNIT KERJA KATU** | Nurul Hidayati, S.Sos. | `katu@smkn2magelang.sch.id` | `katu` | Tata Usaha, Profil/Ijazah PTK, LPJ BOS/BOP, Buku Induk |
| **10** | **10. UNIT KERJA KALAB** | Supriyanto, A.Md. | `kalab@smkn2magelang.sch.id` | `kalab` | Laboratorium Komputer, SOP K3 Lab, Jadwal, Logbook |
| **11** | **11. UNIT KERJA PERPUSTAKAAN** | Tri Utami, S.I.Pust. | `perpustakaan@smkn2magelang.sch.id` | `perpustakaan` | Perpustakaan Digital, Katalog Buku, Gerakan Literasi |
| **12** | **12. UNIT KERJA NASWIL** | Drs. H. Mulyadi, M.Pd. | `naswil@smkn2magelang.sch.id` | `naswil` | Wawasan Kebangsaan, PHBN, Bela Negara, Adiwiyata |
| **13** | **13. UNIT KERJA BK** | Dra. Endang Sulastri | `bk@smkn2magelang.sch.id` | `bk` | Bimbingan Konseling, Asesmen Diagnostik, Karir Siswa |
| **14** | **14. UNIT KERJA BKK** | Wahyu Nugroho, S.Pd. | `bkk@smkn2magelang.sch.id` | `bkk` | Bursa Kerja Khusus, Tracer Study Alumni (BMW), Job Fair |
| **15** | **15. UNIT KERJA UPS** | Anwar Sadat, S.T. | `ups@smkn2magelang.sch.id` | `ups` | Unit Produksi & TEFA, Laporan Omzet, Job Order Nyata |

---

### 2.2 Panduan Login Cara 1: Fitur 1-Klik Login Demo (Sangat Direkomendasikan)
Metode ini dirancang agar siapa pun dapat mendemokan dan menguji sistem secara instan tanpa perlu mengingat password:
1. Buka aplikasi di peramban web: `http://localhost:3000/login`.
2. Pada bagian atas kotak login, klik tab **"Pilih Login Per Unit (1-Klik Demo)"**.
3. Di layar akan muncul dua kelompok tombol:
   * **Kelompok Pimpinan & Validator**: Tombol biru `1. KASEK`, tombol kuning `7. UNIT TPMPS`, dan tombol abu-abu `SUPER ADMIN`.
   * **Kelompok 14 Unit Kerja Pelaksana**: Tombol kotak putih untuk `2. UNIT KERJA WKS 1` sampai `15. UNIT KERJA UPS`.
4. **Klik pada tombol unit yang ingin Anda operasikan** (misalnya, klik tombol **"2. UNIT KERJA WKS 1"**).
5. Sistem akan memproses autentikasi dalam 0.5 detik dan otomatis mengarahkan Anda ke Dashboard akun WKS 1.

---

### 2.3 Panduan Login Cara 2: Login Manual dengan Kode Singkat
Jika Anda ingin login secara manual:
1. Buka `http://localhost:3000/login`.
2. Klik tab **"Login Manual (Email & Password)"**.
3. Pada kolom **Alamat Email / Kode Unit**, Anda tidak perlu mengetik email panjang. Cukup ketik **kode singkat unit** (huruf kecil semua):
   * Contoh: ketik `wks1`, `wks2`, `k3`, `renbang`, `katu`, `kalab`, `naswil`, `bk`, `bkk`, `ups`, `kasek`, atau `tpmps`.
4. Pada kolom **Kata Sandi**, ketik: `sintesa123`.
5. *(Opsional)* Klik ikon **Mata** di sisi kanan kolom password jika ingin melihat teks kata sandi.
6. Klik tombol **"Masuk ke Sistem Mutu"**.
7. Jika kredensial benar, sistem akan membawa Anda masuk ke dashboard utama.

---

### 2.4 Panduan Logout / Keluar Sesi dengan Aman
Jika Anda telah selesai menggunakan sistem atau ingin berganti akun:
1. Perhatikan bilah menu samping (*sidebar*) di sebelah kiri layar.
2. Gulir ke bagian paling bawah sidebar.
3. Klik tombol **"Keluar (Logout)"** yang berwarna merah/abu-abu.
4. Sesi aktif akan dihapus secara aman, dan peramban akan kembali menampilkan halaman login.

---

# BAB 3: PANDUAN PENGOPERASIAN UNTUK 14 KOORDINATOR UNIT KERJA (PENGUNGGAH BUKTI FISIK)

Bab ini adalah panduan khusus bagi penanggung jawab unit: **WKS 1, WKS 2, WKS 3, WKS 4, K3, RENBANG, KATU, KALAB, PERPUSTAKAAN, NASWIL, BK, BKK, dan UPS**.

### 3.1 Memahami Antarmuka Google Drive Unit (`/drive`)
Menu **Drive Unit** adalah ruang kerja utama koordinator unit untuk mengunggah, mengelola, dan memantau dokumen bukti fisik.
* Ketika Anda login sebagai unit tertentu (misal: WKS 1 Kurikulum), halaman `/drive` akan **otomatis terkunci dan menampilkan folder milik unit Anda**.
* Di dalam Drive Unit, terdapat **10 Folder Standar Bawaan**:
  1. `01. Standar SKL`: Dokumen kompetensi lulusan, sertifikat kompetensi, rekap nilai kelulusan.
  2. `02. Standar Isi & Kurikulum`: Dokumen KOSP, penyelarasan kurikulum IDUKA, modul ajar.
  3. `03. Standar Proses & PjBL`: Dokumen pelaksanaan pembelajaran, Teaching Factory, jadwal KBM.
  4. `04. Standar Penilaian`: Perangkat asesmen diagnostik, formatif, sumatif, dan instrumen UKK.
  5. `05. Standar Pendidik (PTK)`: Sertifikat pendidik, sertifikat asesor, SK pembagian tugas.
  6. `06. Standar Sarpras`: Buku inventaris, kartu perawatan alat, kelaikan fasilitas K3.
  7. `07. Standar Pengelolaan & SPMI`: Tata tertib, SOP unit, naskah MoU kemitraan industri.
  8. `08. Standar Pembiayaan & RKAS`: Rencana anggaran kegiatan, laporan pertanggungjawaban dana.
  9. `09. SK & Regulasi Unit`: Surat Keputusan Kepala Sekolah terkait penugasan unit.
  10. `10. Portofolio & Dokumentasi`: Foto kegiatan, video dokumentasi, brosur, publikasi.

---

### 3.2 Langkah demi Langkah Mengunggah Bukti Fisik Baru (Tutorial Klik-per-Klik)

Ikuti langkah-langkah berikut saat unit Anda akan menyetorkan dokumen bukti fisik baru:

* **Langkah 1: Masuk ke Menu Drive Unit**  
  Pada sidebar navigasi kiri, klik menu **"Drive Unit"** (ikon hard drive).
* **Langkah 2: Buka Folder yang Sesuai**  
  Klik dua kali pada folder yang relevan dengan dokumen yang akan Anda unggah (misal: jika ingin mengunggah KOSP atau Modul Ajar, klik folder `02. Standar Isi & Kurikulum`).
* **Langkah 3: Klik Tombol Upload Berkas**  
  Di bagian atas daftar berkas, klik tombol biru bertuliskan **"+ Upload Berkas Baru"**.
* **Langkah 4: Isi Formulir Unggah Berkas pada Jendela Pop-up Modal**:
  1. **Pilih File Dokumen**: Klik area kotak putus-putus (*dropzone*) untuk memilih file dari komputer Anda (format yang didukung: PDF, Excel, Word, Gambar; ukuran maksimal 25 MB). Anda juga bisa menyeret (*drag-and-drop*) file dari Windows Explorer langsung ke kotak ini.
  2. **Judul Dokumen**: Ketikkan nama resmi dokumen secara jelas.  
     *Contoh yang baik: `Kurikulum Operasional Satuan Pendidikan (KOSP) Tahun Ajaran 2026/2027 Lengkap Pengesahan Dinas`.*
  3. **Pilih Standar SNP Terkait**: Pilih dari dropdown standar mana yang dipenuhi oleh dokumen ini (misal: `SNP-2: Standar Isi`).
  4. **Pilih Folder Tujuan**: Pastikan folder yang dipilih sudah benar (misal: `02. Standar Isi & Kurikulum`).
  5. **Catatan Keterangan (*Notes*)**: Ketikkan catatan ringkas mengenai berkas tersebut.  
     *Contoh: `Dokumen telah disahkan Kepala Sekolah dan Kepala Balai Tekkomdik Dinas Pendidikan Provinsi Jawa Tengah`.*
* **Langkah 5: Simpan & Unggah Dokumen**  
  Klik tombol biru **"Simpan & Unggah Dokumen"**.
* **Langkah 6: Verifikasi Keberhasilan Unggah**  
  Sistem akan menampilkan notifikasi hijau (*toast message*) *"Dokumen berhasil diunggah"*. Berkas baru Anda akan langsung muncul di daftar dokumen dengan status berwarna kuning bertuliskan **"Menunggu Validasi"**.

---

### 3.3 Langkah demi Langkah Membuat Folder Kustom Tambahan
Jika 10 folder bawaan dirasa kurang spesifik untuk kebutuhan unit Anda:
1. Di halaman `/drive`, klik tombol **"+ Buat Folder Baru"** di barisan tombol atas.
2. Pada kotak dialog yang muncul, ketikkan nama folder baru.  
   *Contoh: `11. Arsip Uji Sertifikasi BNSP 2026` atau `12. Data Penempatan Magang Guru`.*
3. Klik tombol **"Buat Folder"**.
4. Folder baru langsung aktif dan siap digunakan untuk menampung dokumen.

---

### 3.4 Langkah demi Langkah Mengecek Status Berkas & Catatan Revisi dari TPMPS
Setiap berkas yang Anda unggah akan dipantau dan diaudit oleh Tim TPMPS atau Kepala Sekolah. Status dokumen ditandai dengan warna badge:
* 🟡 **Kuning ("Menunggu Validasi")**: Berkas baru diunggah dan sedang dalam antrean pemeriksaan auditor TPMPS. Anda tidak perlu melakukan apa pun, cukup menunggu.
* 🟢 **Hijau ("Disahkan" / "Terverifikasi")**: Berkas telah diperiksa, disetujui, dan resmi masuk ke dalam Laporan Evaluasi Diri Sekolah (EDS).
* 🟠 **Orange ("Perlu Revisi")**: Berkas memiliki kekurangan atau belum sesuai dengan butir instrumen SNP.

**Cara Membaca Catatan Revisi**:
1. Buka menu **"Drive Unit"**.
2. Cari dokumen yang memiliki badge orange **"Perlu Revisi"**.
3. Klik pada baris dokumen tersebut. Di panel detail sebelah kanan layar, baca bagian **"Catatan Reviewer / Auditor"**.
4. Catatan tersebut berisi instruksi spesifik dari pimpinan.  
   *Contoh catatan: "Rubrik asesmen formatif untuk pertemuan ke-3 belum dilampirkan, mohon ditambahkan dan diunggah ulang."*

---

### 3.5 Langkah demi Langkah Memperbaiki & Mengunggah Ulang Dokumen Revisi
Setelah membaca catatan revisi dari auditor:
1. Buka file dokumen tersebut di laptop Anda dan lakukan perbaikan sesuai instruksi auditor.
2. Simpan file yang telah diperbaiki dalam format PDF.
3. Kembali ke sistem SINTESA di menu **Drive Unit**.
4. Klik tombol **"Upload Ulang / Perbarui Berkas"** pada dokumen yang bersangkutan.
5. Pilih file baru yang telah diperbaiki.
6. Pada kolom catatan, ketikkan konfirmasi: *"Sudah diperbaiki dengan menambahkan lembar rubrik asesmen formatif pertemuan ke-3."*
7. Klik **"Simpan Perubahan"**.
8. Status dokumen seketika kembali berubah menjadi **"Menunggu Validasi"** berwarna kuning, dan auditor TPMPS akan menerima pemberitahuan untuk memeriksa ulang.

---

### 3.6 Daftar Dokumen Wajib yang Harus Diunggah oleh Masing-Masing dari 15 Unit

Agar tidak ada dokumen yang terlewat saat persiapan akreditasi, berikut adalah panduan rincian eviden wajib untuk setiap unit:

#### Unit 01: KASEK (Kepala Sekolah)
* SK Pembagian Tugas Guru dan Tenaga Kependidikan Tahun Ajaran Berjalan.
* Lembar Pengesahan KOSP dan Dokumen Kurikulum Satuan Pendidikan.
* Rencana Kerja Jangka Menengah (RKJM 4 Tahun) dan Rencana Kerja Tahunan (RKT).
* Notula Rapat Dewan Guru, Rapat Pleno Komite Sekolah, dan Keputusan Strategis.

#### Unit 02: UNIT KERJA WKS 1 (Kurikulum)
* Dokumen Kurikulum Operasional Satuan Pendidikan (KOSP) lengkap.
* Sampel Perangkat Ajar: Capaian Pembelajaran (CP), Alur Tujuan Pembelajaran (ATP), dan Modul Ajar seluruh mata pelajaran.
* Kalender Pendidikan Sekolah dan Jadwal Pembelajaran KBM Mingguan.
* Bukti Pelaksanaan Asesmen: Soal Sumatif Tengah Semester, Sumatif Akhir Semester, dan Rubrik Asesmen Diagnostik.
* Berkas Pelaksanaan Uji Kompetensi Keahlian (UKK) Mandiri maupun DUDI.

#### Unit 03: UNIT KERJA WKS 2 (Kesiswaan)
* Buku Tata Tertib Peserta Didik dan Pedoman Penegakan Disiplin Karakter.
* Dokumen Program Penguatan Profil Pelajar Pancasila (P5) dan laporannya.
* Rekapitulasi Data Prestasi Siswa (Piagam Kejuaraan LKS, O2SN, FLS2N tingkat Kota, Provinsi, Nasional).
* Portofolio Kegiatan Organisasi Kesiswaan: OSIS, MPK, Pramuka, Paskibra, PMR, dan Ekstrakurikuler.
* Laporan Pelaksanaan Masa Pengenalan Lingkungan Sekolah (MPLS) dan Penyaluran Beasiswa PIP/KIP.

#### Unit 04: UNIT KERJA WKS 3 (Sarana & Prasarana)
* Buku Induk Inventarisasi Aset Tanah, Bangunan Gedung, Ruang Kelas, Lab, dan Bengkel.
* Kartu Riwayat Pemeliharaan Berkala Fasilitas (*Maintenance Logbook*).
* Sertifikat Kelaikan Sarana Keselamatan Kerja K3: Tabung Pemadam APAR, Instalasi Listrik, Genset, Jalur Evakuasi.
* Usulan Rencana Kebutuhan Sarana Prasarana (RKAS Sarpras) dan Berita Acara Penerimaan Barang.

#### Unit 05: UNIT KERJA WKS 4 (Hubin & Humas)
* Naskah Nota Kesepahaman (MoU) dan Perjanjian Kerja Sama (PKS) aktif dengan industri mitra DUDI.
* Panduan Pelaksanaan, Jurnal Monitoring, dan Berita Acara Penjemputan Praktik Kerja Lapangan (PKL) 6 bulan.
* Dokumentasi dan Jadwal Program Guru Tamu dari Praktisi Industri.
* Berkas Program Magang Guru di Industri dan Sertifikat Magang Industri.
* Dokumen Berita Acara Sinkronisasi Kurikulum bersama Industri Mitra.

#### Unit 06: UNIT KERJA K3 (Ketua Kompetensi Keahlian)
* Kurikulum Konsentrasi Keahlian (RPL, TKJ, AKL, MP, BDP) yang telah diselaraskan dengan standar industri.
* Kumpulan Jobsheet Praktikum Kejuruan dan Lembar Kerja Peserta Didik (LKPD).
* Portofolio Hasil Karya / Proyek Nyata Pembelajaran Berbasis Proyek (PjBL) siswa.
* Verifikasi Kelaikan Tempat Uji Kompetensi (TUK) dan Blanko Sertifikat UKK.

#### Unit 07: UNIT KERJA TPMPS (Tim Penjaminan Mutu)
* SK Penetapan Susunan Tim Penjaminan Mutu Pendidikan Sekolah (TPMPS).
* Dokumen Instrumen Evaluasi Diri Sekolah (EDS) 8 Standar Nasional Pendidikan.
* Rekomendasi Hasil Audit Mutu Internal (AMI) dan Dokumen Rencana Tindak Lanjut (RTL).

#### Unit 08: UNIT KERJA RENBANG (Perencanaan & Pengembangan)
* Dokumen Rencana Kerja Sekolah (RKS) 4 Tahunan.
* Dokumen Rencana Kegiatan dan Anggaran Sekolah (RKAS) Tahunan.
* Dokumen Rencana Pengembangan Sekolah (RPS) berbasis data Rapor Pendidikan Nasional.
* Dokumen Roadmap Pengembangan SMK Pusat Keunggulan (SMK PK).

#### Unit 09: UNIT KERJA KATU (Kepala Tata Usaha)
* Database Kualifikasi Pendidik dan Tenaga Kependidikan (Ijazah, Sertifikat Pendidik, SK Kenaikan Pangkat).
* Arsip Penilaian Kinerja Guru (PKG) dan Sasaran Kinerja Pegawai (SKP) Aparatur Sipil.
* Buku Register Induk Peserta Didik dan Arsip Administrasi Kearsipan Persuratan Dinas.
* Laporan Pertanggungjawaban Keuangan (LPJ Dana BOS, BOP, dan Komite Sekolah).

#### Unit 10: UNIT KERJA KALAB (Kepala Laboratorium)
* Standar Operasional Prosedur (SOP) Keselamatan dan Kesehatan Kerja (K3) Laboratorium Komputer.
* Jadwal Penggunaan Laboratorium Komputer per Kelas dan Buku Logbook Kunjungan Harian.
* Kartu Riwayat Pemeliharaan dan Perbaikan Hardware/Jaringan Komputer.
* Buku Daftar Inventaris PC Workstation, Switch, Router, dan Lisensi Perangkat Lunak.

#### Unit 11: UNIT KERJA PERPUSTAKAAN
* Buku Induk Katalog Koleksi Perpustakaan (Buku Teks, Buku Pengayaan, Referensi, e-Book).
* Laporan Statistik Kunjungan Pemustaka dan Sirkulasi Peminjaman Buku Bulanan.
* Portofolio Kegiatan Gerakan Literasi Sekolah (GLS), Tantangan Membaca, dan Pojok Baca Kelas.
* Dokumentasi Sistem Otomasi Perpustakaan Digital (e-Library).

#### Unit 12: UNIT KERJA NASWIL (Nasionalisme & Bina Wilayah)
* Dokumentasi Pelaksanaan Upacara Bendera Hari Senin dan Peringatan Hari Besar Nasional (PHBN).
* Laporan Kegiatan Pendidikan Karakter, Wawasan Nusantara, dan Pembinaan Bela Negara bersama Koramil/Polsek.
* Portofolio Sekolah Berbudaya Lingkungan / Adiwiyata dan Bakti Sosial Kemasyarakatan Sekitar.
* Program Pencegahan Perundungan (*Anti-Bullying*), Intoleransi, dan Pencegahan Radikalisme.

#### Unit 13: UNIT KERJA BK (Bimbingan Konseling)
* Program Kerja Tahunan Layanan Bimbingan Pribadi, Sosial, Belajar, dan Karir.
* Instrumen dan Rekapitulasi Hasil Asesmen Diagnostik Non-Kognitif Siswa Baru.
* Rekapitulasi Pelaksanaan Layanan Konseling Individual, Konseling Kelompok, dan Bimbingan Klasikal.
* Data Pemetaan Peminatan Studi Lanjut ke Perguruan Tinggi dan Penelusuran Bakat Minat Siswa.

#### Unit 14: UNIT KERJA BKK (Bursa Kerja Khusus)
* Database Hasil Penelusuran Tamatan (*Tracer Study*): Bekerja, Melanjutkan Pendidikan, Wirausaha (BMW).
* Dokumentasi Pelaksanaan Rekrutmen Kampus, Job Fair, dan Seleksi Kerja Industri di Sekolah.
* Arsip Surat Keputusan Penempatan Kerja Lulusan di DUDI Mitra.
* Laporan Persentase Keterserapan Alumni dalam Jangka Waktu Kurang dari 6 Bulan Pasca Lulus.

#### Unit 15: UNIT KERJA UPS (Unit Produksi Sekolah / TEFA)
* Pedoman Tata Kelola dan Struktur Pengelola Unit Produksi Sekolah (UPS) / Teaching Factory (TEFA).
* Bukti Order Pekerjaan Riil (*Job Order*) dari Konsumen Luar/Masyarakat yang Dikerjakan oleh Siswa.
* Laporan Keuangan Neraca Laba-Rugi dan Rekapitulasi Omzet Penjualan Jasa/Produk TEFA.
* Katalog Produk Barang dan Jasa Unggulan Siswa yang Dipasarkan ke Masyarakat.

---

# BAB 4: PANDUAN PENGOPERASIAN UNTUK KETUA TPMPS (AUDITOR & EVALUATOR MUTU)

Bab ini adalah panduan teknis bagi **Ketua TPMPS (Dra. Hj. Siti Fatimah, M.M.)** dan Tim Auditor Penjamin Mutu.

### 4.1 Tugas & Wewenang Auditor TPMPS
Ketua TPMPS bertindak sebagai **verifikator garis depan**. Tugas utama TPMPS meliputi:
1. Memeriksa antrean bukti fisik yang diunggah oleh 14 unit kerja.
2. Memberikan telaah keabsahan dokumen (apakah dokumen asli, bertanda tangan resmi, dan relevan dengan butir instrumen).
3. Mengembalikan berkas yang belum lengkap dengan menyertakan instruksi perbaikan tertulis.
4. Menginput skor capaian mutu per butir instrumen SNP (skala 1 - 4).
5. Merumuskan Rencana Tindak Lanjut (RTL) bagi butir-butir yang skornya masih di bawah target 95.0%.

---

### 4.2 Langkah demi Langkah Memeriksa Berkas Masuk di Modul Validasi (`/dokumen/validasi`)

Ikuti alur pemeriksaan dokumen berikut:

* **Langkah 1: Login sebagai Akun TPMPS**  
  Akses `http://localhost:3000/login`, pilih tab *Pilih Login Per Unit*, lalu klik tombol kuning **"7. UNIT TPMPS"**.
* **Langkah 2: Buka Halaman Validasi Dokumen**  
  Pada sidebar navigasi kiri, klik menu **"Validasi Dokumen"** (ikon perisai centang) atau akses langsung `http://localhost:3000/dokumen/validasi`.
* **Langkah 3: Tinjau 4 Kartu KPI Mutu di Bagian Atas Layar**:
  * *Total Berkas Masuk*: Menampilkan seluruh berkas yang ada di sistem.
  * *Menunggu Validasi*: Jumlah berkas berbadge kuning yang membutuhkan audit Anda hari ini.
  * *Telah Disahkan*: Jumlah berkas yang sudah disetujui.
  * *Perlu Revisi*: Jumlah berkas yang sedang dalam proses perbaikan oleh unit.
* **Langkah 4: Gunakan Dropdown Filter Unit Kerja**  
  Agar berkas tidak tercampur aduk, klik dropdown **"Unit Kerja"** di bilah filter, lalu pilih unit yang ingin Anda periksa (misalnya: pilih `2. UNIT KERJA WKS 1`).  
  *Seketika tabel hanya menampilkan berkas milik WKS 1.*
* **Langkah 5: Buka Modal Inspeksi Dokumen**  
  Cari berkas yang berstatus kuning (*Menunggu Validasi*), lalu klik tombol biru bertuliskan **"Periksa & Sahkan"**.

---

### 4.3 Menggunakan Modal Inspeksi Split-Screen (Fitur Pratinjau & Form Keputusan)

Ketika tombol **"Periksa & Sahkan"** diklik, sistem akan memunculkan jendela modal inspeksi split-screen (*layar terbelah*):

* **Sisi Kiri Layar (Panel Pratinjau Dokumen)**:
  * Menampilkan simulasi tampilan dokumen resmi ber-kop surat resmi SMK Negeri 2 Magelang.
  * Menampilkan informasi nama file, format (.pdf/.xlsx/.docx), ukuran berkas, dan nomor versi dokumen.
  * **Checklist Kepatuhan**: Sistem menampilkan daftar kriteria yang harus Anda verifikasi:
    - [x] Dokumen terunggah utuh dan dapat dibuka tanpa rusak.
    - [x] Tanda tangan pejabat/koordinator unit dan cap dinas tertera jelas.
    - [x] Substansi isi berkas sesuai dengan tuntutan indikator Standar SNP.

* **Sisi Kanan Layar (Panel Keputusan Auditor)**:
  * Menampilkan form input bertuliskan **"Catatan Evaluasi / Umpan Balik untuk Unit"**.
  * Di kotak ini, Anda dapat mengetikkan catatan audit, apresiasi, atau rincian bagian mana yang perlu diperbaiki oleh koordinator unit.

---

### 4.4 Memberikan Keputusan Validasi: Sahkan, Minta Revisi, atau Tolak

Di bagian bawah panel kanan modal inspeksi, terdapat 3 tombol keputusan:

1. **Tombol Hijau "Sahkan Dokumen (Terverifikasi)"**:
   * **Kapan digunakan?**: Gunakan tombol ini jika dokumen bukti fisik sudah lengkap, benar, bertanda tangan sah, dan memenuhi kriteria instrumen SNP.
   * **Efek Sistem**: Dokumen seketika berubah status menjadi hijau (*Terverifikasi*), nama Anda tercatat sebagai verifikator beserta tanggal & jam validasi, dan berkas ini otomatis dimasukkan ke dalam arsip Laporan EDS sekolah.

2. **Tombol Orange "Minta Revisi"**:
   * **Kapan digunakan?**: Gunakan tombol ini jika dokumen ada yang kurang (misal: lampiran rubrik belum ada, tanda tangan kepala unit terlewat, atau data belum mutakhir).
   * **Cara Penggunaan**: **Wajib mengetikkan alasan revisi** pada kotak textarea catatan umpan balik di atasnya, lalu klik tombol **"Minta Revisi"**.
   * **Efek Sistem**: Status berkas berubah menjadi orange (*Perlu Revisi*), catatan Anda terkirim ke drive koordinator unit terkait, dan unit akan segera memperbaiki berkas tersebut.

3. **Tombol Merah "Tolak Berkas"**:
   * **Kapan digunakan?**: Gunakan tombol ini jika dokumen yang diunggah salah kamar/salah unit, rusak total, atau tidak relevan sama sekali dengan instrumen penjaminan mutu.
   * **Efek Sistem**: Dokumen berstatus merah (*Ditolak*) dan tidak dihitung dalam capaian mutu sekolah.

---

### 4.5 Langkah demi Langkah Melakukan Evaluasi Mutu & Input Skor Indikator (`/evaluasi`)

Setelah memeriksa bukti fisik, Ketua TPMPS menginput skor penilaian mutu:
1. Pada sidebar navigasi, klik menu **"Evaluasi Mutu"** (`/evaluasi`).
2. Di tabel evaluasi, klik tombol **"Audit & Beri Skor"** pada butir indikator yang ingin dinilai.
3. Tinjau nilai mandiri yang diajukan oleh unit (misal: unit mengajukan nilai 90.0).
4. Masukkan **Nilai Verifikasi Auditor** berdasarkan kualitas bukti fisik yang telah Anda sahkan (skor rentang 0 - 100):
   * Skor 91 - 100: Sangat Baik / Unggul (Memenuhi seluruh kriteria dan ada inovasi).
   * Skor 81 - 90: Baik (Memenuhi seluruh kriteria standar).
   * Skor 71 - 80: Cukup (Memenuhi sebagian besar kriteria, ada catatan kecil).
   * Skor < 70: Kurang (Bukti fisik belum memadai).
5. Ketikkan catatan rekomendasi audit pada kolom catatan reviewer.
6. Klik tombol **"Simpan Hasil Evaluasi"**.
7. Skor ini akan langsung memperbarui grafik ketercapaian 8 SNP di Dashboard sekolah.

---

### 4.6 Langkah demi Langkah Menyusun Rencana Tindak Lanjut (RTL) Mutu (`/rtl`)

Jika hasil evaluasi menemukan adanya standar yang nilainya masih di bawah target (di bawah 95.0%):
1. Pada sidebar navigasi, klik menu **"RTL Mutu"** (`/rtl`).
2. Klik tombol biru **"+ Buat Program RTL Baru"**.
3. Isi formulir RTL:
   * **Nama Program Aksi**: Tindakan konkret perbaikan (misal: *"Workshop Peningkatan Kompetensi Guru dalam Penyusunan Modul Ajar Berdiferensiasi"*).
   * **Standar SNP Sasaran**: Pilih standar yang relevan (misal: *SNP-2 Standar Isi*).
   * **Unit Penanggung Jawab**: Pilih unit pelaksana (misal: *2. UNIT KERJA WKS 1*).
   * **Tenggat Waktu (*Deadline*)**: Tentukan tanggal target penyelesaian program.
   * **Indikator Keberhasilan**: Target hasil yang ingin dicapai (misal: *100% guru kejuruan memiliki modul ajar tervalidasi*).
4. Klik **"Simpan & Terbitkan RTL"**. Program perbaikan akan muncul di dashboard pimpinan untuk dipantau pelaksanaannya.

---

# BAB 5: PANDUAN PENGOPERASIAN UNTUK KEPALA SEKOLAH (KASEK)

Bab ini adalah panduan eksekutif bagi **Kepala SMK Negeri 2 Magelang (Drs. H. Mulyono, M.Pd.)**.

### 5.1 Peran Eksekutif Kepala Sekolah
Sebagai pucuk pimpinan satuan pendidikan, Kepala Sekolah memiliki kewenangan tertinggi untuk:
1. Memantau kesehatan mutu sekolah secara menyeluruh melalui Executive Dashboard.
2. Memeriksa rekapitulasi keaktifan dan kepatuhan pengunggahan dokumen dari 15 unit kerja.
3. Memberikan validasi akhir pada dokumen-dokumen strategis sekolah.
4. Menandatangani dan mengesahkan secara digital **Laporan Evaluasi Diri Sekolah (EDS)** tahun ajaran berjalan.

---

### 5.2 Membaca Executive Dashboard Capaian 8 SNP (`/dashboard`)
1. Login sebagai Kepala Sekolah: Akses `/login`, pilih tab *Pilih Login Per Unit*, klik tombol biru **"1. KASEK"**.
2. Pada halaman Dashboard, perhatikan komponen-komponen berikut:
   * **Dynamic Welcome Banner**: Menampilkan sapaan *"Selamat Datang, Drs. H. Mulyono, M.Pd. (Kepala Sekolah)"* serta jumlah dokumen yang menunggu persetujuan Anda.
   * **4 Kartu Metrik KPI**: Memperlihatkan jumlah total standar (8 SNP), dokumen yang sudah diverifikasi, evaluasi yang berjalan, dan program RTL yang aktif.
   * **Grafik Radar & Spline Chart**: Memperlihatkan keseimbangan mutu antar 8 standar. Jika ada grafik yang condong ke dalam pada standar tertentu (misal Sarpras bernilai 78.4%), artinya standar tersebut membutuhkan alokasi perhatian atau anggaran khusus.
   * **Tabel Capaian 8 SNP**: Kolom persentase skor realisasi terhadap target mutu sekolah (95.0%). Klik pada salah satu standar untuk melihat rincian butir instrumennya.

---

### 5.3 Langkah demi Langkah Validasi Akhir Dokumen Mutu Sekolah
Kepala Sekolah dapat melakukan pemeriksaan dokumen bukti fisik kapan saja:
1. Di sidebar kiri, klik menu **"Validasi Dokumen"** (`/dokumen/validasi`).
2. Gunakan dropdown filter unit untuk melihat dokumen dari unit tertentu (misal ingin melihat MoU yang diunggah oleh *WKS 4 Hubin*).
3. Klik tombol **"Periksa & Sahkan"**.
4. Periksa pratinjau dokumen di panel kiri modal inspeksi.
5. Jika dokumen telah memenuhi kriteria kepemimpinan sekolah, klik tombol hijau **"Sahkan Dokumen (Terverifikasi)"**.

---

### 5.4 Langkah demi Langkah Mengesahkan Laporan Evaluasi Diri Sekolah (EDS) (`/laporan`)
Pengesahan Laporan EDS adalah tahapan puncak penjaminan mutu tahunan:
1. Di sidebar kiri, klik menu **"Laporan EDS"** (`/laporan`).
2. Di layar akan tampil Laporan Komprehensif Evaluasi Diri Sekolah yang telah dikompilasi secara otomatis oleh sistem, mencakup:
   * Identitas sekolah dan tahun ajaran berjalan (2026/2027).
   * Rekapitulasi nilai capaian 8 Standar Nasional Pendidikan (SNP).
   * Nilai mutu komposit sekolah beserta predikat akreditasi (*Unggul*).
   * Daftar eviden bukti fisik yang telah disahkan dari 15 unit kerja.
   * Rekomendasi program peningkatan mutu untuk tahun berikutnya.
3. Gulir ke bagian paling bawah halaman pada kotak **"Lembar Pengesahan Resmi"**.
4. Klik tombol emas bertuliskan **"Sahkan Laporan Mutu"**.
5. Sistem akan mencatat tanda tangan digital, nama Kepala Sekolah (*Drs. H. Mulyono, M.Pd.*), NIP (*196803121992031004*), serta stempel tanggal pengesahan yang sah secara kelembagaan.

---

### 5.5 Mencetak & Mengekspor Laporan Mutu untuk Akreditasi BAN-PDM
Setelah disahkan, dokumen EDS siap digunakan untuk kebutuhan dinas pendidikan atau visitasi akreditasi:
1. Di halaman `/laporan`, klik tombol **"Cetak / Ekspor PDF"** di pojok kanan atas.
2. Jendela cetak peramban akan terbuka.
3. Pilih opsi printer Anda atau pilih **"Save as PDF"** (*Simpan sebagai PDF*).
4. Klik **Save**. Berkas Laporan EDS resmi siap dilampirkan pada sistem Sispena BAN-PDM atau diserahkan kepada Pengawas Pembina Sekolah.

---

# BAB 6: PANDUAN PENGOPERASIAN UNTUK SUPER ADMINISTRATOR

Bab ini adalah panduan teknis bagi **Super Administrator (Rian Prasetyo, S.Kom.)**.

### 6.1 Mengelola Master Data 15 Unit Kerja (`/unit`)
Super Admin bertanggung jawab menjaga keabsahan data 15 unit kerja sekolah:
1. Login sebagai Super Admin (`admin.sintesa@smkn2magelang.sch.id` / password: `sintesa123`).
2. Klik menu **"Kelola Unit"** (`/unit`).
3. Di halaman ini, Admin dapat:
   * Memantau keaktifan masing-masing unit kerja.
   * Meninjau persentase kelengkapan berkas bukti fisik tiap unit.
   * Memperbarui nama Koordinator/PIC jika terjadi mutasi atau pergantian pejabat sekolah.

### 6.2 Manajemen Akun Pengguna & Reset Kredensial
Jika ada koordinator unit yang lupa kata sandi atau mengalami kendala login:
1. Masuk ke modul pengaturan pengguna.
2. Cari akun koordinator unit yang bersangkutan berdasarkan email resmi atau kode unit.
3. Klik tombol **"Reset Kata Sandi"**.
4. Kata sandi akan otomatis dikembalikan ke default: `sintesa123`.

### 6.3 Backup & Pemeliharaan Integritas Data
1. Sistem SINTESA terintegrasi dengan basis data PostgreSQL Supabase dengan perlindungan *Row-Level Security (RLS)*.
2. Setiap dokumen yang diunggah memiliki catatan riwayat audit (*audit trail*): siapa yang mengunggah, kapan diunggah, siapa yang memverifikasi, dan kapan disahkan.
3. Admin disarankan melakukan ekspor cadangan (*backup*) basis data secara berkala setiap akhir semester melalui konsol manajemen Supabase.

---

# BAB 7: TANYA JAWAB TEKNIS (FAQ) & PEMECAHAN MASALAH (TROUBLESHOOTING)

### Q1: Mengapa saat saya login sebagai WKS 1, saya tidak bisa mengedit berkas milik WKS 2?
**Jawaban**: Ini adalah fitur keamanan utama SINTESA (*Role-Based Access Control*). Setiap unit kerja hanya memiliki hak akses penuh (*Full Write Access*) pada ruang kerja dan drive unitnya sendiri untuk mencegah manipulasi atau penghapusan data milik unit lain secara tidak sengaja.

### Q2: Dokumen apa saja yang dapat diunggah dan berapa batas ukuran maksimal file?
**Jawaban**: Sistem mendukung format:
* **PDF (`.pdf`)**: Format utama untuk dokumen legal, KOSP, SK, MoU, dan laporan resmi.
* **Spreadsheet (`.xlsx`, `.xls`)**: Untuk data angka, inventaris sarpras, dan tracer study.
* **Word (`.docx`, `.doc`)**: Untuk draf modul ajar dan SOP.
* **Gambar (`.jpg`, `.jpeg`, `.png`)**: Untuk dokumentasi foto kegiatan dan fasilitas.  
*Batas ukuran per file yang disarankan adalah maksimal 25 MB.*

### Q3: Bagaimana jika saya salah mengunggah dokumen ke folder yang keliru?
**Jawaban**: Buka menu **Drive Unit**, cari dokumen yang salah penempatan, klik ikon tiga titik atau ikon sampah untuk menghapus berkas tersebut, lalu unggah kembali ke folder yang benar. Jika berkas sudah terlanjur berstatus *Disahkan*, mintalah Ketua TPMPS atau Admin untuk mereset status dokumen menjadi *Perlu Revisi*.

### Q4: Apakah sistem ini bisa dibuka melalui HP Android atau iPhone?
**Jawaban**: **Ya.** SINTESA TPMPS dirancang menggunakan desain antarmuka responsif (*mobile-friendly*). Seluruh fitur—mulai dari melihat dashboard, mengunduh berkas, hingga melakukan validasi dokumen—dapat dioperasikan dengan nyaman melalui layar ponsel pintar maupun tablet.

### Q5: Jika sekolah menghadapi visitasi akreditasi BAN-PDM secara mendadak, bagaimana cara menunjukkannya kepada Asesor?
**Jawaban**:
1. Login menggunakan akun **1. KASEK** atau **7. UNIT TPMPS**.
2. Tampilkan menu **Dashboard** untuk memberikan gambaran umum ketercapaian 8 SNP sekolah kepada Asesor.
3. Saat Asesor meminta bukti fisik butir tertentu (misal: bukti kemitraan industri), buka menu **Drive Unit** $\rightarrow$ pilih **5. UNIT KERJA WKS 4** $\rightarrow$ buka folder **07. Standar Pengelolaan** $\rightarrow$ klik tombol **Pratinjau** pada dokumen MoU.
4. Buka menu **Laporan EDS** untuk memperlihatkan lembar pengesahan resmi yang telah ditandatangani digital oleh Kepala Sekolah.

---

*Buku Panduan ini disusun dan disahkan secara resmi oleh Tim Penjaminan Mutu Pendidikan Sekolah (TPMPS) SMK Negeri 2 Magelang.*  
*Magelang, September 2026.*
