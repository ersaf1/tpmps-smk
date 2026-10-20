# Sistem Informasi TPMPS SMK

Workspace TypeScript: `apps/web` adalah React/Vite SPA; `apps/api` adalah Next.js Route Handlers untuk Supabase Auth Admin. UI Indonesia, empat role, folder bertingkat, arsip per periode, tema gelap/terang, private Storage. Logo sekolah berada di `apps/web/public/school-logo.png`. Semua tabel aplikasi berada di schema `tpmps`.

## Menjalankan

Node.js 22.18+ dan npm diperlukan (tes domain memakai dukungan TypeScript native Node). Dari root:

```sh
npm ci
# Gunakan .env yang tersedia; .env.example mendokumentasikan variabel tambahan.
npm run dev
```

Vite biasanya `http://127.0.0.1:5173` (terminal menampilkan port berikutnya jika terpakai), API `http://127.0.0.1:3001`. Proxy Vite `/api` menuju `API_PROXY_TARGET`. Skrip dev membaca `.env` root. `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` yang tersedia dapat langsung digunakan; variabel `VITE_*`/`SUPABASE_*` di contoh juga didukung. Tidak ada UI Next.js duplikat.

```sh
npm run lint
npm run typecheck
npm test
npm run build
# Tes menjalankan Vite terisolasi di port 5180 secara otomatis.
npm run test:browser
```

Browser test memakai Microsoft Edge dan **transport palsu khusus tes**, bukan login produksi. Server tes menggunakan URL/key fiktif terpisah; tidak mengirim permintaan ke project `.env`. `TEST_BASE_URL` opsional untuk server tes sendiri. Screenshot berada di `artifacts/`. Database tests memakai PGlite/PostgreSQL dengan stub schema Auth/Storage, bukan layanan Supabase end-to-end.

## Setup Supabase

1. Gunakan proyek Supabase yang ditunjuk `.env`. Aplikasi membuat schema khusus `tpmps` dan `tpmps_private`; tidak memerlukan seed unit atau akun contoh.
2. Auth → General Configuration: nonaktifkan **Allow new users to sign up**, anonymous sign-ins, dan provider tak dipakai. Aplikasi tidak punya registrasi; pengaturan server tetap wajib. Admin API masih dapat membuat akun.
3. Jalankan `npm run db:migrate` setelah `DATABASE_URL` siap, atau jalankan `supabase/migrations/20261002045742_archive_security.sql` di SQL Editor. SQL transaksional membuat schema, indexes, RLS, helper privat, bucket dan trigger sinkronisasi. Di Settings → Data API → Exposed schemas, tambahkan **`tpmps`**. Jangan expose `tpmps_private`. Reload schema cache bila diperlukan (`NOTIFY pgrst, 'reload schema'`). Migrasi hanya dijalankan sekali.
4. Bucket `tpmps-documents` privat. Batas bucket dan batas global Storage harus mengizinkan tepat **50.000.000 byte (50 MB desimal)**. Tidak ada public sharing atau Storage upsert.
5. Isi URL/publishable key frontend dan server, secret hanya server. Isi `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_NAME`, `BOOTSTRAP_ADMIN_PASSWORD` (minimal 12 karakter) di environment lokal lalu `npm run bootstrap`. Hapus password bootstrap sesudahnya. Bootstrap menolak bila superadmin aktif sudah ada. Tidak ada kredensial default.
6. Login admin, buat unit aktual, pengguna dan periode. Tidak ada seed produksi fiktif. Periode otomatis memperoleh MM/PM ketua serta CM/PK tiap unit aktif; unit baru memperoleh ruang di periode belum selesai.
7. Sebelum produksi, uji empat akun role, upload/download nyata, token akun nonaktif, UUID lintas unit, batas ukuran dan periode terkunci di staging. **Verifikasi trigger `storage.objects` dengan versi layanan Storage proyek**; pengujian layanan tersebut belum dapat dilakukan pada sesi ini.

## Keamanan dan siklus file

Otorisasi membaca `profiles.active`, role dan unit langsung dari database, bukan metadata JWT yang bisa diubah pengguna. Profiles hanya dapat ditulis server; API memvalidasi token lewat `getUser` dan profil authoritative. Kepemilikan arsip melekat pada unit/fungsi ketua.

Waktu DB memakai `clock_timestamp()` Asia/Jakarta. Tanggal akhir inklusif; sebelum mulai/sesudah akhir seluruh write ditolak termasuk service role melalui trigger. Periode selesai tidak dapat diubah, dihapus atau dibuka kembali. Semua relasi arsip memakai RESTRICT, bukan cascade.

Metadata file dimulai `pending` dengan key acak. Storage INSERT mengecek ulang izin/periode/ukuran lalu memfinalkan metadata `ready` di transaksi yang sama. Retry menggunakan key yang sama dan mengecek status. Storage DELETE menghapus metadata atomik bersama baris objek. Folder hanya boleh dihapus saat kosong. Tidak ada trash.

`node --env-file=.env scripts/reconcile.mjs` melakukan dry run pending lebih dari 24 jam; `--apply` menghapus metadata pending **hanya periode aktif**, dengan login operator superadmin dan RLS. Pending periode terkunci dipertahankan untuk audit. Pembersihan blob internal tanpa baris objek ditangani layanan Storage; jangan menghapus baris `storage.objects` via SQL manual.

Download dan preview memakai akses authenticated. Viewer fullscreen menggunakan PDF.js lokal (scroll, zoom, fit-width/fit-page, navigasi halaman, teks dapat dipilih), preview gambar, audio/video, teks per bagian, dan HEX/ASCII untuk file biner. DOCX/PPTX dibaca langsung dalam tampilan cepat; tata letak lengkap Word/PowerPoint serta DOC/PPT lama dikonversi secara privat di server dengan LibreOffice. Excel XLS/XLSX/XLSM/XLSB, ODS, CSV dan TSV dibaca di worker browser, dengan tab sheet, navigasi sel, scroll dua arah, dan halaman baris/kolom untuk workbook besar. Formula/macro tidak dieksekusi; yang ditampilkan adalah nilai tersimpan atau teks formula. Tidak ada dokumen yang dikirim ke layanan preview publik. Unduhan tetap berkas asli.

## Mesin preview Office

Preview ringan: PDF asli dibaca melalui permintaan byte range ber-JWT oleh PDF.js, tanpa pre-download blob penuh atau auto-fetch seluruh berkas. Hanya halaman dekat viewport yang dirender; satu observer bersama menangani kedekatan halaman. Teks/biner meminta bagian masing-masing 256 KB/16 KB, dengan pembatalan unduhan lebih awal jika gateway mengabaikan Range. Gambar/audio/video memakai URL bertanda tangan selama lima menit yang dibuat dengan akses pengguna; audio/video menggunakan `preload="metadata"` agar tidak menunggu seluruh media. URL tidak disimpan di localStorage atau log. Kode pembaca disiapkan pada hover/focus nama file; dokumen privat baru diminta setelah dibuka. OOXML/Excel membutuhkan isi arsip untuk parsing tetapi dekompresi/pembacaan workbook tetap berlangsung di worker dan grid dirender per bagian.

DOCX/PPTX (serta varian OOXML DOCM/DOTX/PPTM/PPSX/POTX) menggunakan **Tampilan cepat** secara default: dokumen diunduh satu kali dengan JWT pengguna dan dibaca di browser tanpa menunggu LibreOffice. Worker mengekstrak XML/gambar lokal dengan batas ukuran; teks dirender sebagai elemen React, tanpa HTML mentah, macro, atau sumber eksternal. Tampilan cepat mempertahankan isi teks, tabel Word, gambar tersimpan, dan urutan slide, tetapi tidak meniru pagination, diagram, atau desain slide. Tombol **Tata letak lengkap** meminta PDF konversi yang tersedia sebelumnya. DOC/PPT biner lama dan format Office lain tetap menggunakan konversi server. Tidak ada konversi server yang dimulai pada tampilan cepat.

Windows lokal: jalankan `npm run setup:preview`. Skrip mengunduh LibreOffice 26.2.6 dari distribusi resmi, memverifikasi SHA-256, mengekstrak runtime ke `.tools/libreoffice`, dan menyiapkan profil awal di `.tools/preview-profile`. Ini bukan instalasi Office global dan tidak mengubah file association. Folder `.tools` tidak masuk Git.

Pada server Linux, sediakan LibreOffice Writer/Impress/Calc dan font yang digunakan dokumen, lalu atur `LIBREOFFICE_PATH=/usr/bin/libreoffice` jika perlu. API harus berjalan pada host/container Node dengan executable LibreOffice; runtime serverless tanpa executable tidak menyediakan konversi Word/PowerPoint. Profil awal lokal bersifat opsional; `LIBREOFFICE_PATH` mendukung instalasi sistem pada Windows/Linux/macOS.

Endpoint `GET /api/preview?id=<UUID>` memeriksa token, profil aktif, metadata ber-RLS dan download Storage menggunakan JWT pemanggil (tanpa service-role). Hasil konversi hanya dikirim setelah akses diperiksa ulang, dengan `Cache-Control: private, no-store`. Maksimal dua konversi berjalan per proses, batas input 50 MB, output 100 MB, dan timeout 180 detik. Konversi memakai profil sementara terpisah, macro/OLE/DDE dan pembaruan link dinonaktifkan, lalu sumber/PDF sementara dihapus. Cache hasil hanya di memori server selama lima menit, maksimal 20 MB; izin tetap diperiksa untuk setiap akses cache. File terenkripsi/rusak menampilkan error yang jelas.

`npm run test:preview` membangun API dan menguji endpoint sungguhan dengan transport Supabase terisolasi: DOCX/PPTX/XLSX/RTF dan DOC/PPT/XLS lama, isi/jumlah halaman hasil, empat role pembaca, penolakan sesi/profil/Storage, serta cache privat. LibreOffice harus tersedia untuk tes ini. Fixtures hanya berada di `tests/fixtures` dan `artifacts`, bukan data aplikasi.

Referensi mesin preview: [LibreOffice CLI](https://help.libreoffice.org/latest/en-US/text/shared/guide/start_parameters.html), [PDF.js](https://mozilla.github.io/pdf.js/examples/index.html), [SheetJS 0.20.3](https://docs.sheetjs.com/docs/getting-started/installation/nodejs/).

Data metadata diambil ber-RLS, berhalaman 1000 baris agar tidak terpotong batas PostgREST. Pencarian/hitungan hanya mencakup data yang diizinkan. Untuk arsip sangat besar, lanjutkan pagination/filter dan agregasi pada server agar browser tidak memuat seluruh metadata.

## Deployment

Tidak ada deployment eksternal dilakukan. `npm run build` menghasilkan `apps/web/dist`; host sebagai static SPA dengan fallback `index.html`. Jalankan API `npm run start --workspace @tpmps/api`, dengan environment server. Reverse-proxy **same-origin** `/api/*` ke Next.js tanpa mengubah jalur; jalur lain ke SPA. API tidak menyediakan CORS lintas origin. Jangan arahkan `VITE_API_URL` ke origin lain tanpa pengaturan CORS eksplisit. Vite membaca public env saat build. Gunakan HTTPS dan jangan cache API authenticated.

## Verifikasi dan referensi

Lihat [catatan pengujian](docs/VERIFICATION.md). Konfigurasi `.env` digunakan sesuai arahan. Auth dapat dijangkau; koneksi database langsung belum tersedia dan secret Admin API perlu ditambahkan. Gunakan **Session pooler connection string** dari menu Connect Supabase untuk `DATABASE_URL` jika koneksi IPv6 langsung tidak tersedia. Tambahkan secret server (`SUPABASE_SECRET_KEY`) ke `.env`, bukan ke chat atau variabel publik. Setup dan pengujian integrasi nyata wajib selesai sebelum produksi.

[MyBox Uizard](https://app.uizard.io/templates/5EK6jQgEGjtPVwXy0MyO/preview) diperiksa melalui browser. Geometri diadaptasi ke TPMPS, bukan klaim pixel-perfect. Referensi teknis: [changelog](https://supabase.com/changelog), [Auth](https://supabase.com/docs/guides/auth), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Storage](https://supabase.com/docs/guides/storage/security/access-control), [Admin API](https://supabase.com/docs/reference/javascript/auth-admin-createuser). Dependency dipatok dan lockfile tersedia.
