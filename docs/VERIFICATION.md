# Verifikasi implementasi — 2 Oktober 2026

## Hasil lokal

- `npm run lint`, `npm run typecheck`, `npm run build`: lulus untuk Vite SPA dan Next.js API.
- `npm test`: 14 tes lulus (termasuk subtes). Migration benar-benar dieksekusi oleh PostgreSQL WASM/PGlite; schema layanan Auth/Storage distub.
- Diuji: default MM/PM/CM/PK, empat role, SELECT UUID lintas unit, larangan ketua menulis unit, kepala sekolah read-only, penolakan eskalasi role, siklus folder, perpindahan lintas ruang, 50.000.000 byte versus 50.000.001 byte, finalisasi Storage atomik, deactivation dengan identitas sesi lama, pergantian kepala unit, penghapusan Storage+metadata, seluruh role pada periode selesai, upload dimulai sebelum akhir tetapi finalisasi terlambat, larangan reopen/cascade dan waktu 00.00 WIB. Trigger write juga diuji melalui koneksi DB berprivilege.
- Domain/UI: batas tengah malam Asia/Jakarta, matriks role dan allowlist preview (HTML/SVG/script ditolak).
- Browser Edge: desktop 1440 dan mobile 390, tema gelap/terang, login, dashboard, folder, grid/list, dialog upload, persistensi tema setelah reload, dan tidak ada overflow horizontal halaman. **Tes memakai intercept jaringan/fixture**, bukan akun Supabase nyata. Fixture hanya berada dalam skrip tes, bukan bundle aplikasi.
- Tidak ada secret Admin API yang dikonfigurasi/disalin ke frontend. Vite hanya mengekspor URL dan publishable key.

## Perbandingan visual

Uizard berhasil dibuka melalui browser. Delapan artboard di-capture pada ukuran native 1440×900 ke `artifacts/reference-screen-*.png`, tanpa bingkai laptop/kontrol preview dalam hasil artboard. Landing, dashboard, file manager grid/list, upload, preview dan dialog diperiksa.

Implementasi memakai DM Sans seperti referensi, sidebar desktop 260 px (~18%), topbar 120 px, charcoal `#181A1F`, panel `#252930`, kartu ringkasan satu baris, dokumen terbaru dan tabel, filter sisi kanan pada desktop, modal tengah, sudut kecil dan ikon outline. Biru `#016EC4` serta oranye `#FCA601` diambil dari sampling pixel dominan logo pengguna. Light mode mempertahankan geometri; mobile drawer dan grid dua kolom.

Screenshot implementasi: `artifacts/login-*.png`, `dashboard-*.png`, `files-*.png`, `list-*.png`, `upload-*.png`. Perbandingan manual menghasilkan koreksi font, warna, lebar sidebar, tinggi topbar, susunan dashboard, ukuran ikon folder dan letak filter. **Tidak diklaim pixel-perfect**: kontrol administrasi, periode, tindakan file dan konten TPMPS berbeda; referensi juga memiliki fitur sharing/storage upgrade yang sengaja tidak disertakan sesuai lingkup pengguna.

## Integrasi eksternal yang belum tervalidasi

**Pengguna meminta pekerjaan database ditunda.** Deliverable tahap ini adalah source, migrasi, setup, dan hasil pengujian lokal. Tidak diperlukan tindakan database untuk memeriksa screenshot atau menjalankan tes lokal.

Konfigurasi `.env` digunakan sesuai arahan pengguna. Auth settings merespons HTTP 200; `disable_signup=false` sehingga registrasi publik perlu dinonaktifkan. Host PostgreSQL langsung memiliki record IPv6 tetapi jaringan runtime tidak mendukung rutenya (`ENETUNREACH` saat IP dipakai langsung). Secret Admin API belum ada, dan connector Supabase tidak memiliki izin ke project yang ditunjuk `.env`. Gunakan session pooler dari dashboard untuk koneksi database. Belum ada migrasi atau pembuatan akun eksternal yang dijalankan.

Login empat akun nyata, Admin createUser/update, transfer file sampai 50 MB, kebijakan layanan Storage termasuk trigger internalnya, preview/download authenticated, race operasi paralel di PostgreSQL server dan deployment belum teruji end-to-end. PGlite tidak menggantikan tes tersebut. Supabase signup harus dinonaktifkan di dashboard proyek sebelum digunakan. Selesaikan setup proyek baru dan staging sesuai README.

## Batas operasional

Folder tidak kosong harus dikosongkan sebelum dihapus. Akun/unit dinonaktifkan untuk mempertahankan arsip. Pending upload dari periode terkunci dipertahankan; cleanup tidak mempunyai override arsip. Metadata seluruh arsip berizin saat ini dimuat bertahap ke browser; skala sangat besar memerlukan pagination UI dan agregasi server.
