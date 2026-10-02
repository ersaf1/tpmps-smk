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

Download melalui endpoint authenticated. Preview blob hanya PDF/raster dalam allowlist; HTML/SVG/script didownload sebagai octet-stream. Nama file dirender sebagai teks. Berkas yang sudah didownload tidak dapat ditarik kembali dari perangkat.

Data metadata diambil ber-RLS, berhalaman 1000 baris agar tidak terpotong batas PostgREST. Pencarian/hitungan hanya mencakup data yang diizinkan. Untuk arsip sangat besar, lanjutkan pagination/filter dan agregasi pada server agar browser tidak memuat seluruh metadata.

## Deployment

Tidak ada deployment eksternal dilakukan. `npm run build` menghasilkan `apps/web/dist`; host sebagai static SPA dengan fallback `index.html`. Jalankan API `npm run start --workspace @tpmps/api`, dengan environment server. Reverse-proxy **same-origin** `/api/*` ke Next.js tanpa mengubah jalur; jalur lain ke SPA. API tidak menyediakan CORS lintas origin. Jangan arahkan `VITE_API_URL` ke origin lain tanpa pengaturan CORS eksplisit. Vite membaca public env saat build. Gunakan HTTPS dan jangan cache API authenticated.

## Verifikasi dan referensi

Lihat [catatan pengujian](docs/VERIFICATION.md). Konfigurasi `.env` digunakan sesuai arahan. Auth dapat dijangkau; koneksi database langsung belum tersedia dan secret Admin API perlu ditambahkan. Gunakan **Session pooler connection string** dari menu Connect Supabase untuk `DATABASE_URL` jika koneksi IPv6 langsung tidak tersedia. Tambahkan secret server (`SUPABASE_SECRET_KEY`) ke `.env`, bukan ke chat atau variabel publik. Setup dan pengujian integrasi nyata wajib selesai sebelum produksi.

[MyBox Uizard](https://app.uizard.io/templates/5EK6jQgEGjtPVwXy0MyO/preview) diperiksa melalui browser. Geometri diadaptasi ke TPMPS, bukan klaim pixel-perfect. Referensi teknis: [changelog](https://supabase.com/changelog), [Auth](https://supabase.com/docs/guides/auth), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Storage](https://supabase.com/docs/guides/storage/security/access-control), [Admin API](https://supabase.com/docs/reference/javascript/auth-admin-createuser). Dependency dipatok dan lockfile tersedia.
