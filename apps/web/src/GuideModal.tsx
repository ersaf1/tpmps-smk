import React, { useState, useEffect } from "react";
import {
  BookOpen,
  X,
  CheckCircle2,
  HelpCircle,
  FolderOpen,
  MapPin,
  Building2,
  Users,
  CalendarDays,
  ShieldCheck,
  LayoutDashboard,
  ChevronRight,
  Lightbulb,
  FileText,
  Printer,
  UploadCloud,
  Search,
  HardDrive,
  LogOut,
  Folder,
  Compass,
  ArrowRight,
  Info,
} from "lucide-react";

interface GuideModalProps {
  currentPage: string;
  initialTab?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface PageGuideInfo {
  id: string;
  title: string;
  badge: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  summary: string;
  targetRole: string;
  purposes: string[];
  steps: { number: number; title: string; description: string }[];
  tips: string[];
}

export const guidesData: Record<string, PageGuideInfo> = {
  dashboard: {
    id: "dashboard",
    title: "Ringkasan TPMPS (Beranda SPMI)",
    badge: "Ringkasan Mutu",
    icon: LayoutDashboard,
    summary:
      "Pusat informasi utama dokumen penjaminan mutu sekolah (SPMI) pada periode/tahun ajaran aktif.",
    targetRole: "Seluruh Guru, Kepala Unit, TPMPS, dan Kepala Sekolah",
    purposes: [
      "Melihat total jumlah dokumen mutu, folder arsip, dan penggunaan penyimpanan.",
      "Mengakses berkas pedoman mutu induk: Manual Mutu (MM) dan Prosedur Mutu (PM).",
      "Memantau berkas dokumen yang baru saja diunggah di lingkungan sekolah.",
    ],
    steps: [
      {
        number: 1,
        title: "Pilih Periode Tahun Ajaran",
        description:
          "Gunakan pemilih periode di bagian kanan atas untuk beralih antara periode aktif atau melihat riwayat arsip periode lalu.",
      },
      {
        number: 2,
        title: "Periksa Statistik Dokumen",
        description:
          "Pantau kartu statistik di bagian atas untuk mengetahui total dokumen dan folder yang terdata.",
      },
      {
        number: 3,
        title: "Akses Pedoman Mutu Sekolah (MM & PM)",
        description:
          "Klik tombol 'Buka Folder MM' atau 'Buka Folder PM' untuk langsung membaca standar mutu resmi SMK Negeri 2 Magelang.",
      },
    ],
    tips: [
      "Dokumen Manual Mutu (MM) adalah kebijakan tertinggi penjaminan mutu sekolah.",
      "Gunakan tombol 'Segarkan' jika rekan guru lain baru saja mengunggah berkas baru.",
    ],
  },
  files: {
    id: "files",
    title: "Dokumen & Manajemen Arsip",
    badge: "Arsip Berkas",
    icon: FolderOpen,
    summary:
      "Ruang kerja berkas digital untuk mengelola folder, mengunggah dokumen unit kerja, dan membaca pratinjau berkas secara instan.",
    targetRole: "Bapak/Ibu Guru, Kepala Unit Kerja, dan Tim TPMPS",
    purposes: [
      "Mengunggah berkas penjaminan mutu unit kerja (Catatan Mutu, Petunjuk Kerja, SK, Berita Acara, dll).",
      "Membaca berkas PDF, Word, Excel, PowerPoint secara langsung tanpa perlu mengunduh.",
      "Mengatur folder berjenjang agar arsip tertata rapi sesuai standar administrasi sekolah.",
    ],
    steps: [
      {
        number: 1,
        title: "Navigasi Folder Unit",
        description:
          "Pilih folder unit kerja Anda di sidebar kiri (misalnya 'CM — Catatan Mutu' atau 'PK — Petunjuk Kerja').",
      },
      {
        number: 2,
        title: "Buat Folder atau Subfolder",
        description:
          "Klik tombol '+ Folder Baru' untuk mengelompokkan dokumen berdasarkan semester, kegiatan, atau tahun kegiatan.",
      },
      {
        number: 3,
        title: "Unggah Dokumen Mutu",
        description:
          "Klik tombol '+ Unggah' atau tarik berkas langsung dari komputer Anda. Mendukung PDF, DOCX, XLSX, PPTX, dan Gambar hingga 50 MB.",
      },
      {
        number: 4,
        title: "Buka Pratinjau (Viewer)",
        description:
          "Klik pada nama berkas untuk membuka penampil berkas. Anda dapat memperbesar (zoom), mencari teks, dan membaca halaman demi halaman.",
      },
    ],
    tips: [
      "Gunakan penamaan berkas yang konsisten (misal: 'LAP-PKL-RPL-2026.pdf') agar mudah dicari.",
      "Berkas yang diunggah disimpan di bucket privat terenkripsi demi keamanan data sekolah.",
    ],
  },
  directory: {
    id: "directory",
    title: "Direktori & Letak Dokumen Mutu",
    badge: "Pencarian & Audit",
    icon: MapPin,
    summary:
      "Modul pelacak posisi penyimpanan fisik (lemari arsip/rak di sekolah) serta modul audit dan approval dokumen mutu.",
    targetRole: "Seluruh Guru (Pencarian), Ketua TPMPS & Pimpinan (Audit & Approval)",
    purposes: [
      "Mencari letak fisik dokumen (contoh: di lemari mana, rak nomor berapa, atau map bantex apa).",
      "Menyaring dokumen berdasarkan jurusan/unit pemilik dan status hasil audit.",
      "Bagi Ketua TPMPS: Memberikan catatan audit (kelebihan & kekurangan) serta approval (Disetujui / Perlu Revisi).",
      "Mencetak lembar Laporan Hasil Audit resmi ber-Kop Surat sekolah standar kertas A4.",
    ],
    steps: [
      {
        number: 1,
        title: "Cari Posisi Dokumen Fisik",
        description:
          "Ketikkan nama dokumen (misal: 'Nilai') atau kata kunci lokasi (misal: 'Lemari B') di Search Bar. Tabel akan langsung menyaring posisi dokumen.",
      },
      {
        number: 2,
        title: "Filter Berdasarkan Unit Kerja",
        description:
          "Pilih dropdown 'Semua Unit Kerja' untuk menampilkan dokumen khusus jurusan/unit Anda.",
      },
      {
        number: 3,
        title: "Daftarkan Dokumen Baru",
        description:
          "Klik tombol '+ Tambah Dokumen', isi nomor dokumen, nama, unit pemilik, dan posisi lemari/rak tempat dokumen disimpan.",
      },
      {
        number: 4,
        title: "Audit & Approval (Khusus Tim TPMPS)",
        description:
          "Klik tombol perisai hijau pada baris dokumen untuk memeriksa kesesuaian dokumen, mengisi catatan kelebihan & kekurangan, lalu klik 'Simpan Keputusan Audit'.",
      },
      {
        number: 5,
        title: "Cetak Laporan Hasil Audit",
        description:
          "Klik ikon printer kuning pada baris dokumen yang telah diaudit untuk membuka lembar laporan resmi dan klik 'Cetak / Simpan PDF'.",
      },
    ],
    tips: [
      "Fitur pencarian bersifat instan; Anda tidak perlu menekan tombol Enter.",
      "Hasil cetak laporan audit sudah otomatis disesuaikan dengan format kertas A4 dan menyembunyikan menu layar.",
    ],
  },
  spaces: {
    id: "spaces",
    title: "Dokumen Seluruh Unit Kerja",
    badge: "Monitoring Lintas Unit",
    icon: Building2,
    summary:
      "Tinjauan komprehensif bagi Kepala Sekolah dan Tim TPMPS untuk memantau kelengkapan arsip setiap unit kerja.",
    targetRole: "Kepala Sekolah, Ketua TPMPS, dan Superadmin",
    purposes: [
      "Melihat daftar seluruh ruang kerja unit kerja di SMK Negeri 2 Magelang.",
      "Memeriksa apakah seluruh unit telah mengunggah arsip mutu yang disyaratkan.",
      "Memudahkan pengawasan dan evaluasi mutu internal secara berkala.",
    ],
    steps: [
      {
        number: 1,
        title: "Pilih Kartu Unit Kerja",
        description:
          "Pilih kartu unit kerja atau jurusan yang ingin Anda periksa (misalnya Kurikulum, Kesiswaan, Humas, atau Program Keahlian).",
      },
      {
        number: 2,
        title: "Jelajahi Berkas Unit",
        description:
          "Sistem akan mengarahkan Anda langsung ke struktur folder dan berkas yang dimiliki unit tersebut.",
      },
    ],
    tips: [
      "Halaman ini hanya dapat diakses oleh pimpinan sekolah dan tim penjaminan mutu.",
    ],
  },
  users: {
    id: "users",
    title: "Manajemen Pengguna & Akun Guru",
    badge: "Administrasi Akun",
    icon: Users,
    summary:
      "Pusat pengelolaan akun dinas guru dan staf sekolah pada sistem SIMPENLAH.",
    targetRole: "Khusus Superadmin",
    purposes: [
      "Mendaftarkan akun baru bagi bapak/ibu guru atau kepala unit.",
      "Menetapkan peran (Role): Superadmin, Kepala Sekolah, Ketua TPMPS, atau Kepala Unit.",
      "Mengatur atau mereset kata sandi akun guru jika lupa.",
    ],
    steps: [
      {
        number: 1,
        title: "Tambah Akun Guru Baru",
        description:
          "Klik '+ Tambah Pengguna', isi nama lengkap beserta gelar, email dinas sekolah, peran sistem, dan kata sandi awal (minimal 12 karakter).",
      },
      {
        number: 2,
        title: "Edit atau Reset Kata Sandi",
        description:
          "Klik ikon pensil di baris pengguna untuk memperbarui nama atau memasukkan kata sandi baru.",
      },
    ],
    tips: [
      "Pastikan unit kerja dipilih dengan tepat untuk guru yang menjabat sebagai Kepala Unit.",
    ],
  },
  units: {
    id: "units",
    title: "Manajemen Unit & Jurusan Sekolah",
    badge: "Struktur Sekolah",
    icon: Building2,
    summary:
      "Pengaturan daftar program keahlian, bidang kejuruan, dan unit kerja pelaksana administrasi di sekolah.",
    targetRole: "Khusus Superadmin",
    purposes: [
      "Menambah jurusan baru atau unit kerja baru (misal: Unit Perpustakaan, BKK, dll).",
      "Mengaktifkan atau menonaktifkan unit yang sedang tidak beroperasi.",
    ],
    steps: [
      {
        number: 1,
        title: "Tambah Unit Sekolah",
        description:
          "Klik '+ Tambah Unit', ketikkan nama unit kerja resmi, dan simpan.",
      },
    ],
    tips: [
      "Menambah unit baru otomatis membuat ruang dokumen mutu untuk unit tersebut pada periode aktif.",
    ],
  },
  periods: {
    id: "periods",
    title: "Manajemen Periode & Tahun Ajaran",
    badge: "Kalender Mutu",
    icon: CalendarDays,
    summary:
      "Pengelolaan siklus tahun ajaran atau periode penjaminan mutu pendidikan sekolah.",
    targetRole: "Khusus Superadmin",
    purposes: [
      "Membuka periode tahun ajaran baru (contoh: 'Tahun Ajaran 2026/2027').",
      "Menentukan tanggal mulai dan tanggal berakhir penjaminan mutu.",
    ],
    steps: [
      {
        number: 1,
        title: "Buat Periode Baru",
        description:
          "Klik '+ Tambah Periode', tentukan nama tahun ajaran serta rentang tanggal pelaksanaan.",
      },
    ],
    tips: [
      "Periode yang telah lewat tanggal akhirnya akan otomatis terkunci menjadi mode 'Hanya Baca' demi integritas arsip.",
    ],
  },
  profile: {
    id: "profile",
    title: "Informasi Profil & Hak Akses Akun",
    badge: "Profil Pengguna",
    icon: Users,
    summary:
      "Halaman untuk melihat identitas akun Anda, gelar peran yang diemban, dan pengaturan tampilan tema.",
    targetRole: "Seluruh Pengguna",
    purposes: [
      "Memeriksa status keaktifan akun dinas Anda.",
      "Melihat unit kerja dan peran sistem Anda di SIMPENLAH.",
      "Mengganti tema tampilan (Mode Gelap atau Mode Terang).",
    ],
    steps: [
      {
        number: 1,
        title: "Periksa Data Profil",
        description:
          "Pastikan nama lengkap, email dinas, dan peran Anda sudah sesuai.",
      },
    ],
    tips: [
      "Jika terdapat kesalahan nama atau unit, silakan hubungi Superadmin sekolah.",
    ],
  },
};

export function GuideModal({
  currentPage,
  initialTab,
  isOpen,
  onClose,
}: GuideModalProps) {
  const [selectedId, setSelectedId] = useState(initialTab || currentPage || "sidebar_guide");

  useEffect(() => {
    if (initialTab) {
      setSelectedId(initialTab);
    } else if (currentPage) {
      setSelectedId(currentPage);
    }
  }, [initialTab, currentPage, isOpen]);

  if (!isOpen) return null;

  const isSidebarGuide = selectedId === "sidebar_guide";
  const currentGuide = guidesData[selectedId] || guidesData.dashboard;
  const IconComponent = currentGuide.icon;

  const menuItems = [
    { id: "sidebar_guide", label: "🧭 Semua Menu Sidebar", isSpecial: true },
    { id: "dashboard", label: "Ringkasan TPMPS", icon: LayoutDashboard },
    { id: "files", label: "Dokumen & Berkas", icon: FolderOpen },
    { id: "directory", label: "Direktori & Letak Dokumen", icon: MapPin },
    { id: "spaces", label: "Dokumen Seluruh Unit", icon: Building2 },
    { id: "users", label: "Pengguna & Akun Guru", icon: Users },
    { id: "units", label: "Unit Sekolah", icon: Building2 },
    { id: "periods", label: "Periode Mutu", icon: CalendarDays },
    { id: "profile", label: "Profil Akun", icon: Users },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card guide-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 920,
          width: "95%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header Modal Buku Panduan */}
        <div
          className="modal-header"
          style={{
            background: "var(--panel, #0f172a)",
            borderBottom: "1px solid var(--border, rgba(255,255,255,0.1))",
            padding: "16px 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: "rgba(56, 189, 248, 0.15)",
                color: "#38bdf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOpen size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>
                Buku Panduan SIMPENLAH SMK Negeri 2 Magelang
              </h3>
              <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>
                Panduan praktis agar bapak/ibu guru memahami setiap fungsi menu, tombol, dan folder sistem
              </span>
            </div>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Tutup buku panduan"
            style={{ padding: 6 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Konten Grid 2 Kolom (Sidebar Modul + Isi Panduan) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "250px 1fr",
            flex: 1,
            overflow: "hidden",
            minHeight: 480,
          }}
        >
          {/* Kolom Kiri: Navigasi Daftar Panduan */}
          <div
            style={{
              borderRight: "1px solid var(--border, rgba(255,255,255,0.1))",
              background: "var(--panel-sub, rgba(0,0,0,0.12))",
              padding: "14px 10px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--muted, #94a3b8)",
                textTransform: "uppercase",
                letterSpacing: 1,
                padding: "4px 10px 8px",
              }}
            >
              Pilih Panduan
            </span>

            {menuItems.map((item) => {
              const ItemIcon = item.icon || Compass;
              const isSelected = selectedId === item.id;
              const isCurrent = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: item.isSpecial ? "11px 12px" : "9px 12px",
                    borderRadius: 8,
                    border: item.isSpecial
                      ? isSelected
                        ? "1.5px solid #38bdf8"
                        : "1px dashed rgba(56, 189, 248, 0.4)"
                      : "none",
                    background: isSelected
                      ? "var(--blue, #0284c7)"
                      : item.isSpecial
                        ? "rgba(56, 189, 248, 0.08)"
                        : "transparent",
                    color: isSelected ? "#ffffff" : item.isSpecial ? "#38bdf8" : "inherit",
                    fontWeight: isSelected || item.isSpecial ? 600 : 500,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <ItemIcon size={16} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {isCurrent && !item.isSpecial && (
                    <span
                      style={{
                        fontSize: "0.68rem",
                        background: isSelected ? "rgba(255,255,255,0.25)" : "rgba(56, 189, 248, 0.15)",
                        color: isSelected ? "#ffffff" : "#38bdf8",
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontWeight: 600,
                      }}
                    >
                      Aktif
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Kolom Kanan: Isi Panduan */}
          <div
            style={{
              padding: "24px 30px",
              overflowY: "auto",
              lineHeight: 1.6,
            }}
          >
            {/* TAMPILAN KHUSUS: PANDUAN SEMUA MENU DI SIDEBAR */}
            {isSidebarGuide ? (
              <div className="sidebar-comprehensive-guide">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "rgba(56, 189, 248, 0.15)",
                      color: "#38bdf8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Compass size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>
                      Panduan Lengkap Semua Menu & Tombol di Sidebar
                    </h3>
                    <p style={{ margin: "3px 0 0", opacity: 0.8, fontSize: "0.9rem" }}>
                      Penjelasan fungsi setiap tombol, kategori, dan folder pada bilah samping kiri (sidebar)
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: 8,
                    background: "rgba(56, 189, 248, 0.08)",
                    border: "1px solid rgba(56, 189, 248, 0.2)",
                    fontSize: "0.86rem",
                    marginBottom: 24,
                  }}
                >
                  💡 <strong>Tips Navigasi:</strong> Sidebar di sebelah kiri adalah navigasi utama Anda untuk berpindah antar ruangan berkas, melihat rekap mutu sekolah, dan mencari letak dokumen fisik.
                </div>

                {/* Bagian 1: RUANG KERJA */}
                <div className="guide-section-card" style={{ marginBottom: 20 }}>
                  <h4 style={{ margin: "0 0 10px 0", fontSize: "1rem", color: "#38bdf8", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ background: "#38bdf8", color: "#000", width: 20, height: 20, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>1</span>
                    KATEGORI: RUANG KERJA (WORKSPACE UTAMA)
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="guide-item-row" style={{ padding: "10px 14px", borderRadius: 8, background: "var(--hover, rgba(255,255,255,0.03))", border: "1px solid var(--border, rgba(255,255,255,0.08))" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--text)" }}>
                        <LayoutDashboard size={16} /> 1. Ringkasan TPMPS
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "0.85rem", opacity: 0.85 }}>
                        <strong>Fungsi:</strong> Beranda dasbor sekolah. Di sini bapak/ibu guru dapat melihat ringkasan statistik (total dokumen, total folder, kapasitas terpakai) serta langsung mengakses pedoman mutu Manual Mutu (MM) dan Prosedur Mutu (PM).
                      </p>
                    </div>

                    <div className="guide-item-row" style={{ padding: "10px 14px", borderRadius: 8, background: "var(--hover, rgba(255,255,255,0.03))", border: "1px solid var(--border, rgba(255,255,255,0.08))" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--text)" }}>
                        <FolderOpen size={16} /> 2. Dokumen
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "0.85rem", opacity: 0.85 }}>
                        <strong>Fungsi:</strong> Ruang pengarsipan berkas aktif. Di halaman ini guru membuka folder unitnya, membuat folder/subfolder baru, mengunggah berkas (PDF/Word/Excel hingga 50 MB), membaca pratinjau instan (*viewer*), dan mengunduh berkas.
                      </p>
                    </div>

                    <div className="guide-item-row" style={{ padding: "10px 14px", borderRadius: 8, background: "var(--hover, rgba(255,255,255,0.03))", border: "1px solid var(--border, rgba(255,255,255,0.08))" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--text)" }}>
                        <Building2 size={16} /> 3. Dokumen Seluruh Unit
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "0.85rem", opacity: 0.85 }}>
                        <strong>Fungsi:</strong> Khusus pimpinan sekolah dan TPMPS untuk meninjau ruang dokumen dari seluruh unit kerja (Kurikulum, Kesiswaan, Humas, dan seluruh program keahlian) secara terpusat dalam satu layar.
                      </p>
                    </div>

                    <div className="guide-item-row" style={{ padding: "10px 14px", borderRadius: 8, background: "var(--hover, rgba(255,255,255,0.03))", border: "1px solid var(--border, rgba(255,255,255,0.08))" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--text)" }}>
                        <MapPin size={16} /> 4. Direktori & Letak Dokumen
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "0.85rem", opacity: 0.85 }}>
                        <strong>Fungsi:</strong> Modul pencarian letak fisik dokumen (mengetahui dokumen disimpan di lemari mana, rak nomor berapa, atau map bantex apa di sekolah). Dilengkapi fitur audit bagi Ketua TPMPS serta tombol cetak laporan audit resmi A4 ber-Kop Surat sekolah.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bagian 2: PENJAMINAN MUTU (TPMPS) */}
                <div className="guide-section-card" style={{ marginBottom: 20 }}>
                  <h4 style={{ margin: "0 0 10px 0", fontSize: "1rem", color: "#10b981", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ background: "#10b981", color: "#000", width: 20, height: 20, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>2</span>
                    KATEGORI: PENJAMINAN MUTU (TPMPS)
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="guide-item-row" style={{ padding: "10px 14px", borderRadius: 8, background: "var(--hover, rgba(255,255,255,0.03))", border: "1px solid var(--border, rgba(255,255,255,0.08))" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--text)" }}>
                        <ShieldCheck size={16} /> Dokumen Mutu Sekolah
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "0.85rem", opacity: 0.85 }}>
                        <strong>Fungsi:</strong> Ruang induk penjaminan mutu sekolah yang dikelola oleh Ketua TPMPS. Memuat 2 folder standar utama:
                      </p>
                      <ul style={{ margin: "6px 0 0", paddingLeft: 20, fontSize: "0.84rem", opacity: 0.9 }}>
                        <li><strong>📁 MM — Manual Mutu:</strong> Kebijakan penjaminan mutu tertinggi dan pedoman standar mutu di SMK Negeri 2 Magelang.</li>
                        <li><strong>📁 PM — Prosedur Mutu:</strong> Prosedur operasional baku pelaksanaan penjaminan mutu yang berlaku untuk seluruh warga sekolah.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bagian 3: RUANG UNIT KERJA */}
                <div className="guide-section-card" style={{ marginBottom: 20 }}>
                  <h4 style={{ margin: "0 0 10px 0", fontSize: "1rem", color: "#f59e0b", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ background: "#f59e0b", color: "#000", width: 20, height: 20, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>3</span>
                    KATEGORI: RUANG UNIT KERJA (JURUSAN & BAGIAN)
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="guide-item-row" style={{ padding: "10px 14px", borderRadius: 8, background: "var(--hover, rgba(255,255,255,0.03))", border: "1px solid var(--border, rgba(255,255,255,0.08))" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--text)" }}>
                        <Building2 size={16} /> Daftar Nama Unit Kerja (Kurikulum, Kesiswaan, RPL, AKL, dll)
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "0.85rem", opacity: 0.85 }}>
                        <strong>Fungsi:</strong> Ruang arsip khusus milik unit kerja atau program keahlian Anda. Setiap unit kerja memiliki 2 subfolder bawaan:
                      </p>
                      <ul style={{ margin: "6px 0 0", paddingLeft: 20, fontSize: "0.84rem", opacity: 0.9 }}>
                        <li><strong>📁 CM — Catatan Mutu:</strong> Folder tempat mengunggah bukti fisik pelaksanaan kegiatan, laporan kegiatan, notula rapat, absensi, rekap nilai siswa, dan dokumen pendukung.</li>
                        <li><strong>📁 PK — Petunjuk Kerja:</strong> Folder berisi SOP teknis atau petunjuk operasional tata cara kerja unit bersangkutan.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bagian 4: ADMINISTRASI */}
                <div className="guide-section-card" style={{ marginBottom: 20 }}>
                  <h4 style={{ margin: "0 0 10px 0", fontSize: "1rem", color: "#ec4899", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ background: "#ec4899", color: "#000", width: 20, height: 20, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>4</span>
                    KATEGORI: ADMINISTRASI (KHUSUS SUPERADMIN)
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="guide-item-row" style={{ padding: "10px 14px", borderRadius: 8, background: "var(--hover, rgba(255,255,255,0.03))", border: "1px solid var(--border, rgba(255,255,255,0.08))" }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.85 }}>
                        Menu administrasi hanya muncul bagi pengguna dengan peran Superadmin:
                      </p>
                      <ul style={{ margin: "6px 0 0", paddingLeft: 20, fontSize: "0.84rem", opacity: 0.9 }}>
                        <li><strong>👥 Pengguna:</strong> Menambah akun dinas baru bagi guru, mengatur peran (*role*), dan reset kata sandi akun guru.</li>
                        <li><strong>🏢 Unit Sekolah:</strong> Menambah jurusan baru atau unit kerja operasional di sekolah.</li>
                        <li><strong>📅 Periode:</strong> Membuka periode/tahun ajaran baru atau mengunci periode lama menjadi mode hanya-baca.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bagian 5: KARTU STATUS PENYIMPANAN & KELUAR */}
                <div className="guide-section-card" style={{ marginBottom: 20 }}>
                  <h4 style={{ margin: "0 0 10px 0", fontSize: "1rem", color: "#a855f7", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ background: "#a855f7", color: "#000", width: 20, height: 20, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>5</span>
                    STATUS PENYIMPANAN ARSIP & TOMBOL KELUAR
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="guide-item-row" style={{ padding: "10px 14px", borderRadius: 8, background: "var(--hover, rgba(255,255,255,0.03))", border: "1px solid var(--border, rgba(255,255,255,0.08))" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--text)" }}>
                        <HardDrive size={16} /> Kotak Penyimpanan Arsip
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "0.85rem", opacity: 0.85 }}>
                        <strong>Fungsi:</strong> Menunjukkan total pemakaian kapasitas berkas dan jumlah file yang aman tersimpan di bucket privat sekolah yang terenkripsi.
                      </p>
                    </div>

                    <div className="guide-item-row" style={{ padding: "10px 14px", borderRadius: 8, background: "var(--hover, rgba(255,255,255,0.03))", border: "1px solid var(--border, rgba(255,255,255,0.08))" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "#ef4444" }}>
                        <LogOut size={16} /> Tombol Keluar (Logout)
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "0.85rem", opacity: 0.85 }}>
                        <strong>Fungsi:</strong> Mengakhiri sesi login akun sekolah Anda dengan aman setelah selesai mengunggah atau memeriksa dokumen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* TAMPILAN PANDUAN PER HALAMAN SPESIFIK */
              <div>
                {/* Header Panduan */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "var(--blue, #0284c7)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <h4 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>
                        {currentGuide.title}
                      </h4>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          background: "rgba(56, 189, 248, 0.15)",
                          color: "#38bdf8",
                          padding: "2px 8px",
                          borderRadius: 6,
                        }}
                      >
                        {currentGuide.badge}
                      </span>
                    </div>
                    <p style={{ margin: "4px 0 0", opacity: 0.85, fontSize: "0.92rem" }}>
                      {currentGuide.summary}
                    </p>
                  </div>
                </div>

                {/* Kotak Sasaran Pengguna */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 14px",
                    background: "var(--hover, rgba(255,255,255,0.04))",
                    borderRadius: 8,
                    border: "1px solid var(--border, rgba(255,255,255,0.1))",
                    fontSize: "0.85rem",
                    marginBottom: 20,
                  }}
                >
                  <Users size={16} style={{ color: "#38bdf8", flexShrink: 0 }} />
                  <div>
                    <strong>Pengguna: </strong>
                    <span style={{ opacity: 0.9 }}>{currentGuide.targetRole}</span>
                  </div>
                </div>

                {/* Bagian 1: Fungsi Halaman */}
                <div style={{ marginBottom: 22 }}>
                  <h5
                    style={{
                      margin: "0 0 10px 0",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <CheckCircle2 size={16} className="text-primary" />
                    Fungsi & Manfaat Halaman Ini:
                  </h5>
                  <ul style={{ margin: 0, paddingLeft: 22, fontSize: "0.88rem", opacity: 0.9 }}>
                    {currentGuide.purposes.map((p, idx) => (
                      <li key={idx} style={{ marginBottom: 4 }}>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bagian 2: Panduan Langkah demi Langkah */}
                <div style={{ marginBottom: 22 }}>
                  <h5
                    style={{
                      margin: "0 0 12px 0",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <FileText size={16} className="text-primary" />
                    Petunjuk Langkah-demi-Langkah:
                  </h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {currentGuide.steps.map((step) => (
                      <div
                        key={step.number}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                          padding: "12px 14px",
                          borderRadius: 8,
                          background: "var(--hover, rgba(255,255,255,0.03))",
                          border: "1px solid var(--border, rgba(255,255,255,0.08))",
                        }}
                      >
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: "var(--blue, #0284c7)",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {step.number}
                        </div>
                        <div>
                          <strong style={{ fontSize: "0.9rem", display: "block", marginBottom: 2 }}>
                            {step.title}
                          </strong>
                          <span style={{ fontSize: "0.85rem", opacity: 0.85 }}>
                            {step.description}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bagian 3: Tips Bermanfaat */}
                {currentGuide.tips.length > 0 && (
                  <div
                    style={{
                      padding: "14px 16px",
                      borderRadius: 10,
                      background: "rgba(245, 158, 11, 0.08)",
                      border: "1px solid rgba(245, 158, 11, 0.25)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        color: "#f59e0b",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        marginBottom: 6,
                      }}
                    >
                      <Lightbulb size={17} />
                      Tips Bermanfaat:
                    </div>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: 20,
                        fontSize: "0.84rem",
                        color: "inherit",
                        opacity: 0.9,
                      }}
                    >
                      {currentGuide.tips.map((tip, idx) => (
                        <li key={idx} style={{ marginBottom: 3 }}>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Modal */}
        <div
          style={{
            padding: "12px 24px",
            borderTop: "1px solid var(--border, rgba(255,255,255,0.1))",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--panel, #0f172a)",
          }}
        >
          <span style={{ fontSize: "0.82rem", opacity: 0.7 }}>
            💡 Butuh bantuan menu bilah kiri? Klik <strong>🧭 Semua Menu Sidebar</strong> pada daftar panduan di sebelah kiri.
          </span>
          <button
            className="button-primary"
            onClick={onClose}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              background: "#0284c7",
              color: "#ffffff",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
}

/** Banner Ringkas di Atas Halaman untuk Membimbing Guru secara Cepat */
export function PageTipBanner({
  page,
  onOpenGuide,
}: {
  page: string;
  onOpenGuide: (tab?: string) => void;
}) {
  const guide = guidesData[page] || guidesData.dashboard;

  return (
    <div
      className="page-tip-banner"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 16px",
        borderRadius: 10,
        background: "rgba(56, 189, 248, 0.08)",
        border: "1px solid rgba(56, 189, 248, 0.2)",
        marginBottom: 18,
        fontSize: "0.86rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
        <Lightbulb size={18} style={{ color: "#38bdf8", flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <strong>Panduan {guide.badge}: </strong>
          <span style={{ opacity: 0.85 }}>{guide.summary}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => onOpenGuide("sidebar_guide")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: 6,
            border: "1px solid rgba(16, 185, 129, 0.4)",
            background: "rgba(16, 185, 129, 0.12)",
            color: "#10b981",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Compass size={14} /> Panduan Sidebar
        </button>
        <button
          type="button"
          onClick={() => onOpenGuide(page)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: 6,
            border: "1px solid rgba(56, 189, 248, 0.4)",
            background: "rgba(56, 189, 248, 0.15)",
            color: "#38bdf8",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <BookOpen size={14} /> Panduan Halaman Ini
        </button>
      </div>
    </div>
  );
}
