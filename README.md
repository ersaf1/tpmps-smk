# SINTESA TPMPS v2

Sistem arsip dokumen mutu SMK Negeri 2 Magelang berbasis Next.js 16 dan Supabase. Aplikasi difokuskan pada pengelolaan periode, folder, dan file seperti file manager sederhana.

## Hak akses

- `superadmin`: mengelola seluruh folder, file, unit, dan pengguna.
- `ketua_tpmps`: membaca seluruh arsip serta mengelola Manual Mutu, Prosedur Mutu, dan Dokumen Lainnya pada area TPMPS.
- `kepala_sekolah`: membaca/mengunduh seluruh dokumen dan membuat periode.
- `ketua_unit`: mengelola Petunjuk Kerja dan Catatan Mutu milik unitnya sendiri.

Semua pembatasan utama diterapkan kembali di PostgreSQL Row Level Security, bukan hanya disembunyikan dari antarmuka.

## Menyiapkan aplikasi

1. Salin `.env.example` menjadi `.env` dan isi Project URL, publishable key, serta service-role key.
2. Terapkan migrasi Supabase sampai `20260924033022_simplify_document_management_v2.sql`.
3. Buat 19 akun resmi dengan `npm run provision:users`.
4. Simpan password sementara yang dicetak sekali ke password manager sekolah.
5. Jalankan `npm run build`, lalu `npm run start`.

`SUPABASE_SERVICE_ROLE_KEY` hanya digunakan oleh skrip provisioning lokal. Jangan pernah menggunakan nama variabel `NEXT_PUBLIC_` untuk secret tersebut dan jangan memasukkannya ke deployment browser.

## Pengembangan lokal

```bash
npm install
npm run dev
```

Tidak ada akun demo atau password bersama di aplikasi. Login hanya menerima email dan kata sandi akun Supabase Auth yang valid.

## Batas unggahan

- Semua ekstensi dan tipe file diperbolehkan.
- Maksimal 50 MB untuk setiap file.
- Maksimal 10 file dalam satu proses unggah.
- File kosong ditolak.
- File disimpan pada bucket privat dan hanya disajikan sebagai unduhan terautentikasi.
