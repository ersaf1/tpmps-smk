'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AppShell from '@/components/layout/AppShell';
import { useToast } from '@/components/ui/ToastFeedback';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Printer,
  Download,
  HardDrive,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  Award,
  Layers,
  FileText,
  Activity,
  ArrowRight,
  Sparkles,
  BookOpen,
  Briefcase,
  Wrench,
  Check,
  Copy,
  Folder,
  UploadCloud,
  FileCheck2,
  Search,
  Eye
} from 'lucide-react';

interface SlideData {
  id: number;
  badge: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

export default function PresentationPage() {
  const { showToast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomImageSrc, setZoomImageSrc] = useState<string | null>(null);

  const slides: SlideData[] = [
    // SLIDE 1: COVER
    {
      id: 1,
      badge: 'SOSIALISASI SISTEM PENJAMINAN MUTU (SPMI)',
      title: 'SINTESA TPMPS & GOOGLE DRIVE 15 UNIT KERJA',
      subtitle: 'Panduan Wewenang Pimpinan (Super Admin, Kepsek, Ketua TPMPS) & Rincian Tugas 15 Unit Kerja',
      content: (
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto my-auto">
          <div className="p-4 rounded-3xl bg-white shadow-lg border border-slate-200">
            <Image
              src="/logo.png"
              alt="Logo SMK Negeri 2 Magelang"
              width={96}
              height={96}
              className="w-24 h-24 object-contain"
              priority
              unoptimized
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full bg-blue-100 text-[#0077B6] border border-blue-200">
              SMK NEGERI 2 MAGELANG &bull; TAHUN AJARAN 2025/2026
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              SINTESA <span className="text-[#0077B6]">TPMPS</span>
            </h1>
            <p className="text-base sm:text-xl font-semibold text-slate-600">
              Sistem Informasi Manajemen Penjaminan Mutu Pendidikan Sekolah
            </p>
          </div>

          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
            Dokumentasi antarmuka lengkap (Screenshots), struktur wewenang pimpinan sekolah, mekanisme kontrol dan verifikasi dokumen bukti fisik tiap unit kerja, serta rincian wewenang 15 unit kerja berbasis 8 Standar Nasional Pendidikan (SNP) dan siklus PPEPP.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-semibold">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
              🏛️ 15 Unit Kerja Terintegrasi
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-[#0077B6]">
              📂 Google Drive Per Unit
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              🛡️ Siklus Mutu PPEPP
            </span>
            <a
              href="/PRESENTASI_SINTESA_TPMPS_LENGKAP.pptx"
              download
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#0284C7] text-white font-bold shadow-md shadow-sky-500/20 hover:brightness-105 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download PPTX (5.4 MB)
            </a>
          </div>
        </div>
      )
    },

    // SLIDE 2: LOGIN PAGE
    {
      id: 2,
      badge: 'AUTENTIKASI & KEAMANAN SISTEM',
      title: 'Halaman Login Terpusat (/login)',
      subtitle: 'Gerbang masuk sistem dengan otentikasi peran (RBAC) & proteksi Supabase PostgreSQL',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto">
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 relative group cursor-zoom-in" onClick={() => setZoomImageSrc('/screenshots/presentation/01_login_page.png')}>
            <Image
              src="/screenshots/presentation/01_login_page.png"
              alt="Halaman Login SINTESA"
              width={1600}
              height={1000}
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-200"
              unoptimized
            />
            <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[10px] font-semibold flex items-center gap-1">
              <Eye className="w-3 h-3" /> Klik untuk perbesar
            </div>
          </div>
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Fitur & Keamanan Halaman Login
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Rute Modul</span>
                <span className="font-mono font-bold text-[#0077B6]">/login</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Password Baku</span>
                <span className="font-mono font-bold text-slate-700">sintesa123</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Email Resmi & Alias Cepat:</b> Pengguna dapat login dengan email resmi atau mengetik alias <code>admin</code>, <code>kepsek</code>, <code>tpmps</code>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Role-Based Access Control:</b> Menyesuaikan akses menu secara otomatis (Pimpinan mendapat modul CRUD & Validasi; Unit mendapat repositori Drive).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Enkripsi & Sesi Aman:</b> Dilindungi cookie terenkripsi Base64 dan penyimpanan localStorage terisolasi.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Audit Forensik:</b> Setiap sesi masuk mencatat waktu login dan IP address untuk keamanan data mutu sekolah.</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },

    // SLIDE 3: WEWENANG SUPER ADMIN, KEPSEK, & KETUA TPMPS
    {
      id: 3,
      badge: 'STRUKTUR OTORITAS TINGKAT PIMPINAN',
      title: 'Wewenang Super Admin, Kepala Sekolah, & Ketua TPMPS',
      subtitle: 'Tiga pilar pimpinan pengambil keputusan dalam Sistem Informasi Mutu SINTESA',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-auto">
          {/* Card 1: Super Admin */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm border-t-4 border-t-[#0077B6] space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0077B6] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">SUPER ADMIN</h3>
                <p className="text-[11px] text-slate-500">Rian Prasetyo, S.Kom. (IT Lead)</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic">admin.sintesa@smkn2magelang.sch.id</p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>CRUD Unit Kerja (/unit):</b> Tambah, ubah identitas/PIC, dan hapus unit kerja.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Akses Drive Seluruh Unit:</b> Membuka dan mengelola folder 15 unit.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Manajemen Pengguna:</b> Reset sandi dan otorisasi peran akun.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Master SNP:</b> Bobot dan konfigurasi indikator standar.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Ketua TPMPS */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm border-t-4 border-t-[#0284C7] space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">KETUA TPMPS</h3>
                <p className="text-[11px] text-slate-500">Dra. Hj. Siti Fatimah, M.M.</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic">tpmps.ketua@smkn2magelang.sch.id</p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                <span><b>Validasi Bukti (/dokumen/validasi):</b> Mengecek apa yang diupload tiap unit.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                <span><b>Audit Evaluasi Mutu:</b> Memberikan skor audit dan telaah mandiri.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                <span><b>Persetujuan Program RTL:</b> Verifikasi rencana tindak lanjut mutu.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                <span><b>Penerbitan Rapor Mutu:</b> Menyusun Laporan EDS untuk disahkan Kepsek.</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Kepala Sekolah */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm border-t-4 border-t-slate-900 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">KEPALA SEKOLAH</h3>
                <p className="text-[11px] text-slate-500">Drs. H. Mulyono, M.Pd.</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic">kepala.sekolah@smkn2magelang.sch.id</p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-slate-900 shrink-0 mt-0.5" />
                <span><b>Executive Monitoring:</b> Memantau real-time 8 SNP di dashboard.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-slate-900 shrink-0 mt-0.5" />
                <span><b>Approval Akhir Laporan EDS:</b> Pengesahan legal Rapor Mutu sekolah.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-slate-900 shrink-0 mt-0.5" />
                <span><b>Pengawasan Kepatuhan 15 Unit:</b> Mengecek pemenuhan berkas tiap unit.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-slate-900 shrink-0 mt-0.5" />
                <span><b>Evaluasi Anggaran RTL:</b> Menyetujui pagu dana perbaikan mutu.</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },

    // SLIDE 4: DASHBOARD MUTU AGREGAT
    {
      id: 4,
      badge: 'MONITORING TINGKAT PIMPINAN',
      title: 'Dashboard Penjaminan Mutu (/dashboard)',
      subtitle: 'Pusat pemantauan capaian 8 Standar SNP dan distribusi predikat mutu 15 unit kerja',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto">
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 relative group cursor-zoom-in" onClick={() => setZoomImageSrc('/screenshots/presentation/02_dashboard_mutu.png')}>
            <Image
              src="/screenshots/presentation/02_dashboard_mutu.png"
              alt="Dashboard Mutu Screenshot"
              width={1600}
              height={1000}
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-200"
              unoptimized
            />
            <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[10px] font-semibold flex items-center gap-1">
              <Eye className="w-3 h-3" /> Klik untuk perbesar
            </div>
          </div>
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Yang Dapat Dilakukan Pimpinan di Dashboard:
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-[10px] uppercase text-blue-600 font-bold block">Indeks Mutu Sekolah</span>
                <span className="font-bold text-blue-900 text-sm">87.2% (Unggul)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] uppercase text-emerald-600 font-bold block">Dokumen Sahih</span>
                <span className="font-bold text-emerald-900 text-sm">26 Terverifikasi</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Spline Line Chart:</b> Grafik tren perkembangan mutu per bulan dibandingkan target akreditasi sekolah (95.0%).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Donut Distribution Chart:</b> Analisis sebaran predikat 15 unit kerja: Unggul (A), Baik (B), Cukup (C), dan Perlu Perhatian.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Pusat Audit Log:</b> Memantau rekaman aktivitas real-time lengkap dengan nama user, aksi, dan stempel waktu.</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },

    // SLIDE 5: VALIDASI DOKUMEN MUTU (TPMPS & KEPSEK NGECEK UPLOAD UNIT)
    {
      id: 5,
      badge: 'AUDIT & PENGAWASAN MUTU BUKTI',
      title: 'Modul Validasi Dokumen Auditor (/dokumen/validasi)',
      subtitle: 'Fitur khusus TPMPS dan Kepala Sekolah untuk memeriksa seluruh berkas yang diunggah tiap unit',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto">
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 relative group cursor-zoom-in" onClick={() => setZoomImageSrc('/screenshots/presentation/03_validasi_dokumen_tpmps_kepsek.png')}>
            <Image
              src="/screenshots/presentation/03_validasi_dokumen_tpmps_kepsek.png"
              alt="Validasi Dokumen Screenshot"
              width={1600}
              height={1000}
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-200"
              unoptimized
            />
            <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[10px] font-semibold flex items-center gap-1">
              <Eye className="w-3 h-3" /> Klik untuk perbesar
            </div>
          </div>
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Mekanisme TPMPS & Kepsek Mengecek Upload Unit:
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200">
                <span className="text-[10px] uppercase text-sky-600 font-bold block">Antrean Review</span>
                <span className="font-bold text-sky-900 text-sm">4 Berkas Menunggu</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] uppercase text-emerald-600 font-bold block">Progres Audit</span>
                <span className="font-bold text-emerald-900 text-sm">87% (26/30 Sah)</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><b>Mengecek Unggahan Tiap Unit:</b> Berkas yang diupload WKS 1 s/d 15 otomatis muncul di antrean terpusat ini.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><b>Pratinjau Dokumen:</b> Tombol <b>Pratinjau</b> membuka isi dokumen bukti fisik (PDF/Excel/Word) langsung di layar.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><b>Aksi 'Sahkan Dokumen':</b> Berkas dinyatakan sah &rarr; status berubah jadi 'Terverifikasi' dan skor rapor unit naik.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><b>Aksi 'Revisi' & 'Tolak':</b> Auditor memberikan catatan kekurangan yang langsung tampil di akun unit bersangkutan.</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },

    // SLIDE 6: KELOLA UNIT KERJA (CRUD UNIT)
    {
      id: 6,
      badge: 'MANAJEMEN ORGANISASI SEKOLAH',
      title: 'Modul Kelola Unit Kerja / CRUD Unit (/unit)',
      subtitle: 'Otoritas penuh Super Admin, Kepala Sekolah, dan Ketua TPMPS untuk mengelola unit kerja',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto">
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 relative group cursor-zoom-in" onClick={() => setZoomImageSrc('/screenshots/presentation/04_kelola_unit_crud.png')}>
            <Image
              src="/screenshots/presentation/04_kelola_unit_crud.png"
              alt="CRUD Unit Screenshot"
              width={1600}
              height={1000}
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-200"
              unoptimized
            />
            <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[10px] font-semibold flex items-center gap-1">
              <Eye className="w-3 h-3" /> Klik untuk perbesar
            </div>
          </div>
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Fitur CRUD Unit Kerja:
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Unit Terdaftar</span>
                <span className="font-bold text-slate-900 text-sm">15 Unit Resmi</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-[10px] uppercase text-[#0077B6] font-bold block">Hak Wewenang</span>
                <span className="font-bold text-[#0077B6] text-sm">Admin, Kepsek, TPMPS</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Tambah Unit (+ Create):</b> Menambahkan unit kerja atau pokja mutu baru dengan kode unik, nama PIC, email, dan SNP binaan.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Ubah Unit (Update):</b> Memperbarui data PIC saat terjadi rotasi jabatan kepala program atau penanggung jawab unit.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Hapus Unit (Delete):</b> Menonaktifkan unit non-aktif secara aman dengan pencatatan audit log forensik.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Buka Google Drive:</b> Tombol pintasan langsung membuka repositori berkas drive unit terkait.</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },

    // SLIDE 7: BANK DOKUMEN DIGITAL
    {
      id: 7,
      badge: 'REPOSITORI DIGITAL TERPADU',
      title: 'Bank Dokumen Mutu Digital Seluruh Unit (/dokumen)',
      subtitle: 'Pusat arsip bukti fisik seluruh 8 SNP dari 15 unit kerja SMK Negeri 2 Magelang',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto">
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 relative group cursor-zoom-in" onClick={() => setZoomImageSrc('/screenshots/presentation/05_bank_dokumen_digital.png')}>
            <Image
              src="/screenshots/presentation/05_bank_dokumen_digital.png"
              alt="Bank Dokumen Screenshot"
              width={1600}
              height={1000}
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-200"
              unoptimized
            />
            <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[10px] font-semibold flex items-center gap-1">
              <Eye className="w-3 h-3" /> Klik untuk perbesar
            </div>
          </div>
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Fungsi Bank Dokumen Mutu:
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Arsip Lintas Unit:</b> Menggabungkan bukti fisik dari seluruh 15 unit kerja dalam satu repositori yang rapi.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Filter Cerdas 8 Standar SNP:</b> Memudahkan pencarian berkas berdasarkan standar mutu, unit kerja pengunggah, dan status verifikasi.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Stempel Keabsahan Auditor:</b> Setiap berkas menampilkan tanggal validasi dan nama auditor yang menyetujui.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Kesiapan Akreditasi:</b> Berkas siap diunduh dan dipresentasikan sewaktu-waktu saat visitasi asesor akreditasi BAN-SM.</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },

    // SLIDE 8: ARSITEKTUR GOOGLE DRIVE PER UNIT KERJA
    {
      id: 8,
      badge: 'REPOSITORI BERKAS CLOUD VOKASI',
      title: 'Modul Google Drive Per Unit Kerja (/drive)',
      subtitle: 'Pengalaman repositori modern mirip Google Drive yang didedikasikan untuk 15 unit kerja',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto">
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 relative group cursor-zoom-in" onClick={() => setZoomImageSrc('/screenshots/presentation/06_unit_01_wks1_kurikulum.png')}>
            <Image
              src="/screenshots/presentation/06_unit_01_wks1_kurikulum.png"
              alt="Google Drive Unit Screenshot"
              width={1600}
              height={1000}
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-200"
              unoptimized
            />
            <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[10px] font-semibold flex items-center gap-1">
              <Eye className="w-3 h-3" /> Klik untuk perbesar
            </div>
          </div>
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Fitur Utama Google Drive Unit:
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Daftar 15 Unit Kerja (Kiri):</b> Panel navigasi kiri menampilkan 15 unit dengan nomor urut, kode unit, dan kategori.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>10 Folder Standar SNP Baku:</b> Struktur folder terstandar (Standar SKL, Isi, Proses, Penilaian, Pendidik, Sarpras, Pengelolaan, Pembiayaan, SK Unit, & Portofolio).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Tombol '+ Baru' & 'Folder Baru':</b> Mengunggah berkas bukti baru lengkap dengan judul, target folder, dan catatan.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0077B6] shrink-0 mt-0.5" />
                <span><b>Drawer Rincian Berkas (Kanan):</b> Menampilkan tipe berkas, ukuran, pengunggah, tanggal, dan status verifikasi TPMPS.</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },

    // SLIDES 9 TO 23: 15 UNIT KERJA LENGKAP
    ...[
      {
        id: 9, num: 1, name: 'WKS 1 (Bidang Kurikulum)', code: 'WKS-1', cat: 'Manajemen', pic: 'Dra. Sri Wahyuni, M.Pd.', email: 'kurikulum@smkn2magelang.sch.id', snp: 'SNP-2, SNP-3, SNP-4', score: '89.5%', ind: '22 / 24', img: '/screenshots/presentation/06_unit_01_wks1_kurikulum.png',
        tasks: [
          'Menyusun & mengunggah dokumen KOSP (Kurikulum Operasional Satuan Pendidikan) & Kurikulum Merdeka.',
          'Mengunggah Kalender Akademik Sekolah, SK Beban Mengajar Guru, dan Jadwal Pelajaran per semester.',
          'Mengisi evaluasi mandiri ketercapaian silabus, modul ajar (ATP), dan asesmen sumatif/diagnostik.',
          'Mengajukan program RTL penyelarasan kurikulum bersama industri mitra (PT Telkom & PT Astra).',
          'Mengelola Google Drive Unit: Folder Kurikulum, Perangkat Pembelajaran, dan Bank Soal Ujian.'
        ]
      },
      {
        id: 10, num: 2, name: 'WKS 2 (Bidang Kesiswaan)', code: 'WKS-2', cat: 'Manajemen', pic: 'Bambang Sutrisno, S.Pd.', email: 'kesiswaan@smkn2magelang.sch.id', snp: 'SNP-1 (SKL), SNP-7', score: '86.0%', ind: '18 / 20', img: '/screenshots/presentation/07_unit_02_wks2_kesiswaan.png',
        tasks: [
          'Mengunggah Buku Pedoman Tata Tertib Siswa, Buku Saku Karakter, dan SOP Penegakan Disiplin.',
          'Mendokumentasikan rekap prestasi lomba siswa di ajang LKS SMK, O2SN, FLS2N (Kota, Provinsi, Nasional).',
          'Mengarsipkan data kegiatan ekstrakurikuler, Pramuka Wajib, kepengurusan OSIS/MPK, dan beasiswa PIP/KIP.',
          'Mengisi evaluasi mandiri pembiasaan 7 Kebiasaan Anak Indonesia Hebat dan implementasi Projek P5.',
          'Mengelola Google Drive Unit: Folder Prestasi Siswa, Tata Tertib, dan Laporan Kesiswaan.'
        ]
      },
      {
        id: 11, num: 3, name: 'WKS 3 (Bidang Sarana & Prasarana)', code: 'WKS-3', cat: 'Manajemen', pic: 'Ir. Agus Haryanto, M.T.', email: 'sarpras@smkn2magelang.sch.id', snp: 'SNP-6 (Sarpras)', score: '78.4%', ind: '16 / 22', img: '/screenshots/presentation/08_unit_03_wks3_sarpras.png',
        tasks: [
          'Mengunggah Buku Inventarisasi sarana prasarana sekolah, daftar peralatan bengkel, dan PC lab komputer.',
          'Menyusun Master Plan pemeliharaan gedung, ruang praktik siswa (RPS), instalasi listrik, dan air.',
          'Mengunggah SOP Keselamatan dan Kesehatan Kerja (K3) serta denah jalur evakuasi bencana sekolah.',
          'Mengajukan program RTL peremajaan workstation PC Lab RPL dan perbaikan ruang kelas.',
          'Mengelola Google Drive Unit: Folder Inventaris Aset, Pemeliharaan Gedung, dan SOP K3 Sarpras.'
        ]
      },
      {
        id: 12, num: 4, name: 'WKS 4 (Hubungan Industri & Humas)', code: 'WKS-4', cat: 'Manajemen', pic: 'Drs. Hendro Wibowo', email: 'humas@smkn2magelang.sch.id', snp: 'SNP-2, SNP-3, SNP-7', score: '92.0%', ind: '17 / 18', img: '/screenshots/presentation/09_unit_04_wks4_humas.png',
        tasks: [
          'Mengunggah naskah nota kesepahaman (MoU) dan Perjanjian Kerjasama (PKS) dengan 42 DUDI mitra strategis.',
          'Mengarsipkan Berita Acara sinkronisasi kurikulum industri dan pelaksanaan Guru Tamu praktisi industri.',
          'Mengunggah laporan monitoring PKL siswa, jurnal pembimbingan industri, dan sertifikat PKL.',
          'Mengisi evaluasi kemitraan industri dan tingkat kepuasan mitra DUDI terhadap lulusan SMK.',
          'Mengelola Google Drive Unit: Folder MoU Industri, Laporan PKL, dan Dokumentasi Kunjungan Industri.'
        ]
      },
      {
        id: 13, num: 5, name: 'Bidang Ketenagaan & SDM', code: 'WKS-SDM', cat: 'Manajemen', pic: 'Nurul Hidayati, S.Pd.', email: 'sdm@smkn2magelang.sch.id', snp: 'SNP-5 (Pendidik & Tendik)', score: '82.5%', ind: '14 / 16', img: '/screenshots/presentation/10_unit_05_wks_sdm.png',
        tasks: [
          'Mengunggah rekapitulasi kualifikasi akademik pendidik (S1/S2), Serdik, dan lisensi asesor BNSP guru produktif.',
          'Mengarsipkan data magang industri guru kejuruan (minimal 1 bulan) di industri mitra DUDI.',
          'Mengunggah rekapitulasi Penilaian Kinerja Guru (PKG) dan Sasaran Kinerja Pegawai (SKP) Tenaga Kependidikan.',
          'Mengajukan program RTL peningkatan kompetensi pedagogik dan pelatihan kejuruan guru.',
          'Mengelola Google Drive Unit: Folder Sertifikasi Guru, Magang Industri Guru, dan Berkas PKG Tendik.'
        ]
      },
      {
        id: 14, num: 6, name: 'Program Keahlian PPLG / RPL', code: 'PROG-RPL', cat: 'Kejuruan', pic: 'Eko Prasetyo, S.Kom., M.Cs.', email: 'rpl@smkn2magelang.sch.id', snp: 'SNP-1, SNP-3, SNP-4', score: '94.2%', ind: '27 / 28', img: '/screenshots/presentation/11_unit_06_prog_rpl.png',
        tasks: [
          'Mengunggah modul ajar produktif Coding Web, Mobile Development, Cloud Computing, dan Database.',
          'Mengunggah portofolio aplikasi perangkat lunak hasil Teaching Factory (TEFA) pesanan UMKM/klien riil.',
          'Mengunggah rekapitulasi penilaian Uji Kompetensi Keahlian (UKK) skema Rekayasa Perangkat Lunak.',
          'Mengarsipkan bukti sertifikasi kompetensi siswa dari Lembaga Sertifikasi Profesi (LSP-P1 / BNSP).',
          'Mengelola Google Drive Unit: Folder Modul Ajar RPL, Portofolio Proyek Aplikasi, dan Nilai UKK Siswa.'
        ]
      },
      {
        id: 15, num: 7, name: 'Program Keahlian TJKT / TKJ', code: 'PROG-TKJ', cat: 'Kejuruan', pic: 'Ahmad Fauzi, S.T.', email: 'tkj@smkn2magelang.sch.id', snp: 'SNP-1, SNP-3, SNP-6', score: '91.0%', ind: '24 / 26', img: '/screenshots/presentation/12_unit_07_prog_tkj.png',
        tasks: [
          'Mengunggah modul ajar administrasi server Linux/Windows, keamanan siber, dan penyambungan fiber optik.',
          'Mengunggah diagram arsitektur jaringan backbone sekolah dan dokumentasi sertifikasi Mikrotik MTCNA / Cisco.',
          'Mengunggah Berita Acara dan rekapan nilai UKK Network Administrator bekerjasama dengan PT Telkom.',
          'Mengisi evaluasi kelayakan peralatan lab jaringan (Routerboard, Fusion Splicer, OTDR, Server).',
          'Mengelola Google Drive Unit: Folder Topologi Jaringan, Modul TKJ, dan Dokumentasi Sertifikasi Siswa.'
        ]
      },
      {
        id: 16, num: 8, name: 'Program Keahlian Akuntansi (AKL)', code: 'PROG-AKL', cat: 'Kejuruan', pic: 'Siti Rahmawati, S.E., M.Akt.', email: 'akl@smkn2magelang.sch.id', snp: 'SNP-1, SNP-2, SNP-4', score: '88.0%', ind: '22 / 25', img: '/screenshots/presentation/13_unit_08_prog_akl.png',
        tasks: [
          'Mengunggah lembar kerja siklus akuntansi perusahaan jasa, dagang, dan manufaktur (MYOB & Accurate).',
          'Mengunggah modul praktikum perpajakan elektronik (e-Faktur, e-SPT) dan pembukuan Mini Bank sekolah.',
          'Mengunggah rekapan hasil sertifikasi Teknisi Akuntansi Yunior berlisensi LSP-P1 dan BNSP.',
          'Mendokumentasikan kegiatan simulasi audit pembukuan keuangan dan rekonsiliasi kas.',
          'Mengelola Google Drive Unit: Folder Modul Akuntansi Komputer, Laporan Praktik Mini Bank, dan Berkas UKK.'
        ]
      },
      {
        id: 17, num: 9, name: 'Program Keahlian Perkantoran (MPLB)', code: 'PROG-OTKP', cat: 'Kejuruan', pic: 'Dewi Lestari, S.Pd.', email: 'mplb@smkn2magelang.sch.id', snp: 'SNP-1, SNP-3, SNP-7', score: '87.5%', ind: '21 / 24', img: '/screenshots/presentation/14_unit_09_prog_mplb.png',
        tasks: [
          'Mengunggah SOP Manajemen Kearsipan Digital (e-filing), tata persuratan, dan korespondensi bisnis.',
          'Mengunggah portofolio simulasi rapat bisnis, pelayanan prima (service excellence), dan keprotokolan humas.',
          'Mengunggah rekapitulasi penilaian UKK skema Otomasi Tata Kelola Perkantoran tersertifikasi BNSP.',
          'Mengisi evaluasi kesiapan sarana lab perkantoran (mesin fax, filling cabinet, shredder, PC sekretaris).',
          'Mengelola Google Drive Unit: Folder SOP Kearsipan, Modul MPLB, dan Portofolio Praktik Humas Kantor.'
        ]
      },
      {
        id: 18, num: 10, name: 'Program Keahlian Pemasaran (BDP)', code: 'PROG-BDP', cat: 'Kejuruan', pic: 'Rudi Hartono, S.E.', email: 'bdp@smkn2magelang.sch.id', snp: 'SNP-1, SNP-3, SNP-4', score: '85.0%', ind: '19 / 22', img: '/screenshots/presentation/15_unit_10_prog_bdp.png',
        tasks: [
          'Mengunggah laporan omzet praktik penjualan retail di Business Center dan toko vokasi sekolah.',
          'Mengunggah portofolio kampanye digital marketing siswa (Social Media Marketing, SEO, TikTok Shop).',
          'Mengunggah bukti uji sertifikasi kompetensi pramuniaga dan kasir berlisensi LSP/BNSP.',
          'Mengarsipkan modul ajar visual merchandising, penataan produk, dan negosiasi bisnis.',
          'Mengelola Google Drive Unit: Folder Laporan Omzet Retail, Portofolio Digital Marketing, dan Uji Kompetensi.'
        ]
      },
      {
        id: 19, num: 11, name: 'Unit Pengelola Bengkel & Lab Komputer', code: 'BENGKEL', cat: 'Layanan', pic: 'Supriyanto, A.Md.', email: 'lab@smkn2magelang.sch.id', snp: 'SNP-6 (Sarpras), SNP-7', score: '83.0%', ind: '12 / 15', img: '/screenshots/presentation/16_unit_11_lab_bengkel.png',
        tasks: [
          'Mengunggah jadwal penggunaan harian seluruh laboratorium komputer dan bengkel kejuruan sekolah.',
          'Mengunggah kartu riwayat perawatan dan perbaikan hardware (maintenance log) PC, server, dan printer.',
          'Mengisi evaluasi mandiri kesiapan PC dan jaringan untuk pelaksanaan Computer-Based Test (CBT 1:1).',
          'Mengarsipkan formulir peminjaman alat bengkel dan SOP keselamatan kerja teknisi laboratorium.',
          'Mengelola Google Drive Unit: Folder Jadwal Penggunaan Lab, Kartu Maintenance PC, dan SOP Bengkel.'
        ]
      },
      {
        id: 20, num: 12, name: 'Unit Perpustakaan Digital', code: 'PERPUS', cat: 'Layanan', pic: 'Tri Utami, S.I.Pust.', email: 'perpustakaan@smkn2magelang.sch.id', snp: 'SNP-3, SNP-6', score: '90.0%', ind: '13 / 14', img: '/screenshots/presentation/17_unit_12_perpustakaan.png',
        tasks: [
          'Mengunggah katalog buku digital (OPAC) dan rekap statistik kunjungan peminjaman e-library siswa/guru.',
          'Mengunggah program pembiasaan literasi sekolah dan naskah MoU kerjasama dengan Perpustakaan Daerah.',
          'Mengarsipkan daftar pengadaan buku teks Kurikulum Merdeka dan buku referensi kejuruan terbaru.',
          'Mengisi evaluasi mandiri kecukupan judul buku dan kenyamanan fasilitas ruang baca digital.',
          'Mengelola Google Drive Unit: Folder Katalog Buku OPAC, Statistik Kunjungan, dan Berkas Literasi Vokasi.'
        ]
      },
      {
        id: 21, num: 13, name: 'Bursa Kerja Khusus (BKK Magelang)', code: 'BKK', cat: 'Layanan', pic: 'Wahyu Nugroho, S.Pd.', email: 'bkk@smkn2magelang.sch.id', snp: 'SNP-1 (SKL), SNP-7', score: '93.5%', ind: '17 / 18', img: '/screenshots/presentation/18_unit_13_bkk.png',
        tasks: [
          'Mengunggah laporan Tracer Study keterserapan alumni (Bekerja, Melanjutkan Kuliah, Wirausaha - BMW).',
          'Mengunggah dokumentasi pelaksanaan Campus Recruitment dan Job Fair SMK Negeri 2 Magelang.',
          'Mengunggah statistik penyaluran tenaga kerja alumni ke industri nasional dan program magang ke Jepang/Jerman.',
          'Mengisi evaluasi masa tunggu lulusan hingga mendapatkan pekerjaan pertama (target < 3 bulan).',
          'Mengelola Google Drive Unit: Folder Laporan Tracer Study BMW, Dokumentasi Job Fair, dan Rekap Penyaluran Alumni.'
        ]
      },
      {
        id: 22, num: 14, name: 'Unit Bimbingan Konseling (BK)', code: 'BK', cat: 'Layanan', pic: 'Dra. Endang Sulastri', email: 'bk@smkn2magelang.sch.id', snp: 'SNP-3, SNP-7', score: '89.0%', ind: '15 / 16', img: '/screenshots/presentation/19_unit_14_bk.png',
        tasks: [
          'Mengunggah Program Tahunan Layanan BK (Bimbingan Pribadi, Sosial, Belajar, dan Perencanaan Karir).',
          'Mengunggah instrumen asesmen diagnostik non-kognitif pemetaan gaya belajar dan minat karir siswa baru.',
          'Mengunggah dokumentasi program pencegahan perundungan (anti-bullying) dan penciptaan sekolah ramah anak.',
          'Mengarsipkan laporan rekapitulasi penanganan konseling individual dan bimbingan kelompok.',
          'Mengelola Google Drive Unit: Folder Program Tahunan BK, Asesmen Diagnostik, dan Laporan Konseling Siswa.'
        ]
      },
      {
        id: 23, num: 15, name: 'Unit Produksi & Teaching Factory (TEFA)', code: 'TEFA', cat: 'Kejuruan', pic: 'Anwar Sadat, S.T.', email: 'tefa@smkn2magelang.sch.id', snp: 'SNP-3, SNP-8 (Pembiayaan)', score: '86.8%', ind: '17 / 20', img: '/screenshots/presentation/20_unit_15_tefa.png',
        tasks: [
          'Mengunggah SOP operasional Teaching Factory (TEFA) berstandar tata kelola industri manufaktur/jasa.',
          'Mengunggah neraca laporan omzet produksi barang/jasa vokasi dan kontribusi pendapatan ke kas BLUD sekolah.',
          'Mengunggah portofolio produk unggulan, katalog layanan jasa kejuruan, dan nota pesanan order klien industri.',
          'Mengisi evaluasi keterlibatan siswa dalam siklus produksi riil berorientasi pasar konsumen.',
          'Mengelola Google Drive Unit: Folder Neraca Keuangan TEFA, Katalog Produk Unggulan, dan SOP Produksi Vokasi.'
        ]
      }
    ].map((u) => ({
      id: u.id,
      badge: `UNIT KERJA ${u.num} &bull; KATEGORI ${u.cat.toUpperCase()}`,
      title: `${u.name} (${u.code})`,
      subtitle: `PIC: ${u.pic} | Email: ${u.email} | Diampu: ${u.snp}`,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto">
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 relative group cursor-zoom-in" onClick={() => setZoomImageSrc(u.img)}>
            <Image
              src={u.img}
              alt={`${u.name} Screenshot`}
              width={1600}
              height={1000}
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-200"
              unoptimized
            />
            <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[10px] font-semibold flex items-center gap-1">
              <Eye className="w-3 h-3" /> Klik untuk perbesar
            </div>
          </div>
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Tugas Pokok & Bisa Apa di Sistem:
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-[10px] uppercase text-[#0077B6] font-bold block">Skor Mutu Unit</span>
                <span className="font-bold text-[#0077B6] text-sm">{u.score} (Unggul)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Indikator Terpenuhi</span>
                <span className="font-bold text-slate-700 text-sm">{u.ind}</span>
              </div>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              {u.tasks.map((task, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0077B6] shrink-0 mt-0.5" />
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    })),

    // SLIDE 24: ALUR WORKFLOW VALIDASI
    {
      id: 24,
      badge: 'SIKLUS PENJAMINAN MUTU TERINTEGRASI',
      title: 'Alur Terpadu: Dari Upload Unit ke Validasi Pimpinan',
      subtitle: 'Bagaimana integrasi data terjadi dari 15 unit kerja hingga disahkan Kepala Sekolah',
      content: (
        <div className="space-y-3 max-w-4xl mx-auto my-auto w-full">
          {[
            { step: '01', title: '15 Unit Kerja Mengunggah Bukti Fisik (/drive)', desc: 'Setiap unit kerja (Kurikulum, Kesiswaan, Sarpras, RPL, TKJ, dll) mengunggah dokumen bukti sahih ke folder 10 SNP di Google Drive masing-masing unit.', color: 'border-l-[#0077B6]' },
            { step: '02', title: 'Otomasi Masuk ke Antrean Auditor (/dokumen/validasi)', desc: 'Sistem secara otomatis mendaftarkan dokumen dengan status "Menunggu Review" dan memunculkan badge notifikasi auditor TPMPS.', color: 'border-l-[#0284C7]' },
            { step: '03', title: 'Auditor TPMPS Menelaah & Memberi Keputusan', desc: 'Ketua TPMPS dan tim auditor membuka pratinjau dokumen. Jika sah, klik "Sahkan Dokumen". Jika kurang lengkap, klik "Revisi" disertai catatan perbaikan.', color: 'border-l-amber-500' },
            { step: '04', title: 'Pembaruan Otomatis Skor & Rapor Mutu Sekolah (/dashboard)', desc: 'Setiap dokumen yang disahkan otomatis mendongkrak persentase capaian 8 Standar SNP unit kerja dan sekolah secara real-time.', color: 'border-l-emerald-500' },
            { step: '05', title: 'Approval Legal oleh Kepala Sekolah', desc: 'Kepala Sekolah memantau dashboard eksekutif, mengevaluasi anggaran RTL, dan menandatangani secara sah Laporan Evaluasi Diri Sekolah (EDS).', color: 'border-l-slate-900' }
          ].map((s, idx) => (
            <div key={idx} className={`p-4 rounded-2xl bg-white border border-slate-200 shadow-xs border-l-4 ${s.color} flex items-start gap-4`}>
              <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-mono font-bold text-xs text-slate-700 shrink-0">
                {s.step}
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{s.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )
    },

    // SLIDE 25: PENUTUP & PENGESAHAN
    {
      id: 25,
      badge: 'KOMITMEN MUTU VOKASI BERKELANJUTAN',
      title: 'Lembar Pengesahan & Komitmen Mutu Bersama',
      subtitle: 'SINTESA TPMPS &bull; SMK Negeri 2 Magelang &bull; Swadaya Bhina Raharja',
      content: (
        <div className="flex flex-col items-center justify-center space-y-8 max-w-3xl mx-auto my-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs text-center space-y-3">
              <span className="text-xs text-slate-500 block">Mengetahui,</span>
              <h4 className="text-sm font-bold text-slate-900">Kepala SMK Negeri 2 Magelang</h4>
              <div className="h-20 flex items-center justify-center text-xs text-slate-300 italic">
                ( Tanda Tangan & Cap Resmi )
              </div>
              <h3 className="text-sm font-bold text-[#0077B6]">Drs. H. Mulyono, M.Pd.</h3>
              <p className="text-xs text-slate-500">NIP. 19680312 199203 1 004</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs text-center space-y-3">
              <span className="text-xs text-slate-500 block">Disusun Oleh,</span>
              <h4 className="text-sm font-bold text-slate-900">Ketua TPMPS SMK Negeri 2 Magelang</h4>
              <div className="h-20 flex items-center justify-center text-xs text-slate-300 italic">
                ( Tanda Tangan Auditor )
              </div>
              <h3 className="text-sm font-bold text-[#0077B6]">Dra. Hj. Siti Fatimah, M.M.</h3>
              <p className="text-xs text-slate-500">NIP. 19750918 200212 2 001</p>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="/PRESENTASI_SINTESA_TPMPS_LENGKAP.pptx"
              download
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0077B6] via-[#0284C7] to-[#0077B6] text-white font-bold text-sm shadow-lg shadow-sky-500/20 hover:brightness-105 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download File Presentasi Resmi (.PPTX) (5.4 MB)
            </a>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape') {
        setZoomImageSrc(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const slide = slides[currentSlide];

  return (
    <AppShell
      title="Slide Presentasi Resmi SINTESA TPMPS"
      subtitle="Panduan Antarmuka, Wewenang Pimpinan, dan Repositori 15 Unit Kerja SMK Negeri 2 Magelang"
    >
      <div className="space-y-4">
        {/* Top Slide Control Bar */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span>Slide {currentSlide + 1} dari {slides.length}</span>
            <div className="w-32 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0077B6] to-[#0284C7] transition-all duration-300"
                style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/PRESENTASI_SINTESA_TPMPS_LENGKAP.pptx"
              download
              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0077B6] border border-blue-200 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download PPTX (5.4 MB)
            </a>

            <button
              type="button"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Slide Sebelumnya (Panah Kiri)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Slide Berikutnya (Panah Kanan / Spasi)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Stage Canvas */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm min-h-[640px] flex flex-col justify-between">
          {/* Header */}
          <div className="border-b border-slate-100 pb-4 mb-6">
            <span className="inline-block text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-blue-50 text-[#0077B6] border border-blue-200 mb-2">
              {slide.badge}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                {slide.subtitle}
              </p>
            )}
          </div>

          {/* Body Content */}
          <div className="flex-1 flex flex-col justify-center">
            {slide.content}
          </div>

          {/* Slide Navigation Footer */}
          <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between text-xs text-slate-400">
            <span>SMK Negeri 2 Magelang &bull; Swadaya Bhina Raharja</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="text-[#0077B6] hover:underline font-bold disabled:text-slate-300 cursor-pointer disabled:cursor-not-allowed"
              >
                &larr; Sebelumnya
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                className="text-[#0077B6] hover:underline font-bold disabled:text-slate-300 cursor-pointer disabled:cursor-not-allowed"
              >
                Berikutnya &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Image Zoom Modal */}
      {zoomImageSrc && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomImageSrc(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2">
            <Image
              src={zoomImageSrc}
              alt="Enlarged screenshot"
              width={1600}
              height={1000}
              className="w-full h-auto rounded-xl object-contain max-h-[85vh]"
              unoptimized
            />
            <p className="text-center text-xs text-slate-500 mt-2 font-medium">
              Klik di mana saja atau tekan Escape untuk menutup pratinjau layar penuh
            </p>
          </div>
        </div>
      )}
    </AppShell>
  );
}
