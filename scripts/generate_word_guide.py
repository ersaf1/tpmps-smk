import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_guide_document():
    doc = docx.Document()

    # Page setup - Margins
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Styles
    PRIMARY = RGBColor(0, 119, 182)     # #0077B6
    NAVY = RGBColor(15, 23, 42)         # #0F172A
    SLATE = RGBColor(71, 85, 105)       # #475569
    SKY = RGBColor(2, 132, 199)         # #0284C7

    # =========================================================================
    # KOP SURAT RESMI
    # =========================================================================
    kop_table = doc.add_table(rows=1, cols=2)
    kop_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    kop_table.autofit = False

    # Widths
    kop_table.columns[0].width = Inches(1.2)
    kop_table.columns[1].width = Inches(5.1)

    cell_logo = kop_table.cell(0, 0)
    cell_text = kop_table.cell(0, 1)

    logo_path = os.path.abspath("public/logo.png")
    if os.path.exists(logo_path):
        p_logo = cell_logo.paragraphs[0]
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.add_run().add_picture(logo_path, width=Inches(1.0))

    p_kop = cell_text.paragraphs[0]
    p_kop.alignment = WD_ALIGN_PARAGRAPH.CENTER

    run_kop1 = p_kop.add_run("PEMERINTAH PROVINSI JAWA TENGAH\nDINAS PENDIDIKAN DAN KEBUDAYAAN\n")
    run_kop1.font.size = Pt(10)
    run_kop1.font.bold = True
    run_kop1.font.color.rgb = NAVY

    run_kop2 = p_kop.add_run("SMK NEGERI 2 MAGELANG\n")
    run_kop2.font.size = Pt(14)
    run_kop2.font.bold = True
    run_kop2.font.color.rgb = PRIMARY

    run_kop3 = p_kop.add_run("Motto: Swadaya Bhina Raharja\nJl. Perintis Kemerdekaan No. 9, Kota Magelang, Jawa Tengah 56115\nEmail: surat@smkn2magelang.sch.id | Website: www.smkn2magelang.sch.id\n")
    run_kop3.font.size = Pt(8.5)
    run_kop3.font.color.rgb = SLATE

    # Horizontal double border line
    p_line = doc.add_paragraph()
    p_line.paragraph_format.space_before = Pt(4)
    p_line.paragraph_format.space_after = Pt(16)
    p_line_run = p_line.add_run("━" * 58)
    p_line_run.font.size = Pt(14)
    p_line_run.font.bold = True
    p_line_run.font.color.rgb = PRIMARY

    # =========================================================================
    # JUDUL DOKUMEN
    # =========================================================================
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(4)

    run_t1 = p_title.add_run("BUKU PANDUAN PENGGUNA & DAFTAR AKUN RESMI\n")
    run_t1.font.size = Pt(16)
    run_t1.font.bold = True
    run_t1.font.color.rgb = NAVY

    run_t2 = p_title.add_run("SINTESA TPMPS (SISTEM PENJAMINAN MUTU SEKOLAH)\n")
    run_t2.font.size = Pt(12)
    run_t2.font.bold = True
    run_t2.font.color.rgb = PRIMARY

    run_t3 = p_title.add_run("Tahun Ajaran 2025/2026 — Edisi Lengkap Ramah Pengguna")
    run_t3.font.size = Pt(10)
    run_t3.font.italic = True
    run_t3.font.color.rgb = SLATE

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # =========================================================================
    # BAGIAN 1: PENGENALAN SISTEM
    # =========================================================================
    h1 = doc.add_heading(level=1)
    r_h1 = h1.add_run("1. Apa Itu SINTESA TPMPS? (Pengenalan Singkat)")
    r_h1.font.size = Pt(13)
    r_h1.font.bold = True
    r_h1.font.color.rgb = PRIMARY

    p_intro = doc.add_paragraph()
    p_intro.paragraph_format.line_spacing = 1.15
    p_intro.paragraph_format.space_after = Pt(8)
    p_intro.add_run(
        "SINTESA TPMPS adalah aplikasi web resmi milik SMK Negeri 2 Magelang yang digunakan untuk mengelola "
        "seluruh dokumen mutu dan akreditasi sekolah secara digital. Dahulu, setiap unit kerja (seperti Kurikulum, Kesiswaan, Jurusan, dll) "
        "harus mencetak berkas bukti fisik dalam ratusan map kertas. Sekarang, dengan SINTESA TPMPS, semua berkas cukup diunggah ke "
        "Google Drive digital masing-masing unit kerja dan otomatis dapat diperiksa oleh Tim TPMPS serta Kepala Sekolah."
    )

    p_box = doc.add_paragraph()
    p_box.paragraph_format.space_before = Pt(4)
    p_box.paragraph_format.space_after = Pt(14)
    r_box = p_box.add_run(
        "💡 Inti Utama Sistem:\n"
        "1. Setiap unit kerja punya 'Google Drive Unit' sendiri dengan 10 folder standar rapi.\n"
        "2. Dokumen yang diupload unit otomatis masuk ke meja auditor TPMPS & Kepala Sekolah untuk dicek keabsahannya.\n"
        "3. Nilai mutu sekolah terhitung otomatis secara real-time tanpa perlu hitungan manual."
    )
    r_box.font.size = Pt(9.5)
    r_box.font.color.rgb = NAVY

    # =========================================================================
    # BAGIAN 2: CARA MASUK / LOGIN
    # =========================================================================
    h2 = doc.add_heading(level=1)
    r_h2 = h2.add_run("2. Cara Masuk / Login ke Sistem SINTESA")
    r_h2.font.size = Pt(13)
    r_h2.font.bold = True
    r_h2.font.color.rgb = PRIMARY

    p_steps = doc.add_paragraph()
    p_steps.paragraph_format.line_spacing = 1.15
    p_steps.paragraph_format.space_after = Pt(10)
    p_steps.add_run(
        "Untuk masuk ke dalam sistem, silakan ikuti 3 langkah mudah berikut:\n\n"
        "1. Buka Browser (Google Chrome atau Microsoft Edge), lalu ketik alamat:\n"
        "   👉 http://localhost:3000/login\n\n"
        "2. Masukkan Alamat Email Resmi atau Alias Singkat Anda.\n"
        "   (Misalnya pimpinan cukup ketik 'admin', 'kepsek', atau 'tpmps'; unit kerja ketik email resminya).\n\n"
        "3. Masukkan Kata Sandi (Password):\n"
        "   👉 Password Baku Seluruh Akun: sintesa123\n\n"
        "4. Klik tombol biru: 'Masuk ke Sistem Mutu'. Anda akan langsung diarahkan ke halaman kerja Anda."
    )

    # =========================================================================
    # BAGIAN 3: BUKU KREDENSIAL LENGKAP (EMAIL & PASSWORD)
    # =========================================================================
    h3 = doc.add_heading(level=1)
    r_h3 = h3.add_run("3. Daftar Akun Resmi, Email, & Password")
    r_h3.font.size = Pt(13)
    r_h3.font.bold = True
    r_h3.font.color.rgb = PRIMARY

    p_tbl_desc = doc.add_paragraph()
    p_tbl_desc.paragraph_format.space_after = Pt(8)
    p_tbl_desc.add_run("Berikut adalah daftar resmi seluruh akun pimpinan dan 15 unit kerja sekolah:")

    # Table 1: Pimpinan
    p_sub1 = doc.add_paragraph()
    p_sub1.paragraph_format.space_before = Pt(4)
    p_sub1.paragraph_format.space_after = Pt(4)
    r_sub1 = p_sub1.add_run("A. Tingkat Pimpinan & Auditor Mutu")
    r_sub1.font.bold = True
    r_sub1.font.color.rgb = SKY

    t_pim = doc.add_table(rows=4, cols=5)
    t_pim.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_pim.autofit = False

    col_widths_pim = [Inches(1.2), Inches(1.5), Inches(2.2), Inches(0.8), Inches(0.9)]
    headers_pim = ["Peran / Jabatan", "Nama Pejabat (PIC)", "Email Resmi Login", "Alias", "Password"]

    for i, h in enumerate(headers_pim):
        cell = t_pim.cell(0, i)
        cell.width = col_widths_pim[i]
        set_cell_background(cell, "0077B6")
        set_cell_margins(cell, 100, 100, 120, 120)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        r.font.bold = True
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(255, 255, 255)

    data_pim = [
        ("Super Admin", "Rian Prasetyo, S.Kom.", "admin.sintesa@smkn2magelang.sch.id", "admin", "sintesa123"),
        ("Ketua TPMPS", "Dra. Hj. Siti Fatimah, M.M.", "tpmps.ketua@smkn2magelang.sch.id", "tpmps", "sintesa123"),
        ("Kepala Sekolah", "Drs. H. Mulyono, M.Pd.", "kepala.sekolah@smkn2magelang.sch.id", "kepsek", "sintesa123")
    ]

    for row_idx, row_data in enumerate(data_pim, start=1):
        bg_color = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(row_data):
            cell = t_pim.cell(row_idx, col_idx)
            cell.width = col_widths_pim[col_idx]
            set_cell_background(cell, bg_color)
            set_cell_margins(cell, 90, 90, 120, 120)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if col_idx in [3, 4] else WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(text)
            r.font.size = Pt(8.5)
            if col_idx == 0:
                r.font.bold = True
                r.font.color.rgb = NAVY
            elif col_idx == 4:
                r.font.bold = True
                r.font.color.rgb = PRIMARY

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # Table 2: 15 Unit Kerja
    p_sub2 = doc.add_paragraph()
    p_sub2.paragraph_format.space_before = Pt(8)
    p_sub2.paragraph_format.space_after = Pt(4)
    r_sub2 = p_sub2.add_run("B. 15 Unit Kerja Resmi SMK Negeri 2 Magelang")
    r_sub2.font.bold = True
    r_sub2.font.color.rgb = SKY

    t_unit = doc.add_table(rows=16, cols=6)
    t_unit.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_unit.autofit = False

    col_widths_u = [Inches(0.4), Inches(0.8), Inches(1.8), Inches(1.5), Inches(1.5), Inches(0.7)]
    headers_u = ["No", "Kode", "Nama Unit Kerja", "Penanggung Jawab (PIC)", "Email Login", "Password"]

    for i, h in enumerate(headers_u):
        cell = t_unit.cell(0, i)
        cell.width = col_widths_u[i]
        set_cell_background(cell, "0077B6")
        set_cell_margins(cell, 100, 100, 100, 100)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        r.font.bold = True
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    data_units = [
        ("1", "WKS-1", "WKS 1 (Bidang Kurikulum)", "Dra. Sri Wahyuni, M.Pd.", "kurikulum@smkn2magelang.sch.id", "sintesa123"),
        ("2", "WKS-2", "WKS 2 (Bidang Kesiswaan)", "Bambang Sutrisno, S.Pd.", "kesiswaan@smkn2magelang.sch.id", "sintesa123"),
        ("3", "WKS-3", "WKS 3 (Sarana & Prasarana)", "Ir. Agus Haryanto, M.T.", "sarpras@smkn2magelang.sch.id", "sintesa123"),
        ("4", "WKS-4", "WKS 4 (Humas & Hubin)", "Drs. Hendro Wibowo", "humas@smkn2magelang.sch.id", "sintesa123"),
        ("5", "WKS-SDM", "Bidang Ketenagaan & SDM", "Nurul Hidayati, S.Pd.", "sdm@smkn2magelang.sch.id", "sintesa123"),
        ("6", "PROG-RPL", "Program Keahlian PPLG / RPL", "Eko Prasetyo, S.Kom., M.Cs.", "rpl@smkn2magelang.sch.id", "sintesa123"),
        ("7", "PROG-TKJ", "Program Keahlian TJKT / TKJ", "Ahmad Fauzi, S.T.", "tkj@smkn2magelang.sch.id", "sintesa123"),
        ("8", "PROG-AKL", "Program Keahlian Akuntansi (AKL)", "Siti Rahmawati, S.E., M.Akt.", "akl@smkn2magelang.sch.id", "sintesa123"),
        ("9", "PROG-OTKP", "Program Keahlian Perkantoran (MPLB)", "Dewi Lestari, S.Pd.", "mplb@smkn2magelang.sch.id", "sintesa123"),
        ("10", "PROG-BDP", "Program Keahlian Pemasaran (BDP)", "Rudi Hartono, S.E.", "bdp@smkn2magelang.sch.id", "sintesa123"),
        ("11", "BENGKEL", "Pengelola Bengkel & Lab Komputer", "Supriyanto, A.Md.", "lab@smkn2magelang.sch.id", "sintesa123"),
        ("12", "PERPUS", "Unit Perpustakaan Digital", "Tri Utami, S.I.Pust.", "perpustakaan@smkn2magelang.sch.id", "sintesa123"),
        ("13", "BKK", "Bursa Kerja Khusus (BKK Magelang)", "Wahyu Nugroho, S.Pd.", "bkk@smkn2magelang.sch.id", "sintesa123"),
        ("14", "BK", "Unit Bimbingan Konseling (BK)", "Dra. Endang Sulastri", "bk@smkn2magelang.sch.id", "sintesa123"),
        ("15", "TEFA", "Teaching Factory (TEFA)", "Anwar Sadat, S.T.", "tefa@smkn2magelang.sch.id", "sintesa123")
    ]

    for row_idx, row_data in enumerate(data_units, start=1):
        bg_color = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(row_data):
            cell = t_unit.cell(row_idx, col_idx)
            cell.width = col_widths_u[col_idx]
            set_cell_background(cell, bg_color)
            set_cell_margins(cell, 80, 80, 100, 100)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if col_idx in [0, 1, 5] else WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(text)
            r.font.size = Pt(8)
            if col_idx in [1, 2]:
                r.font.bold = True
                r.font.color.rgb = NAVY
            elif col_idx == 5:
                r.font.bold = True
                r.font.color.rgb = PRIMARY

    doc.add_page_break()

    # =========================================================================
    # BAGIAN 4: SIAPA BISA NGAPAIN SAJA? (HAK WEWENANG)
    # =========================================================================
    h4 = doc.add_heading(level=1)
    r_h4 = h4.add_run("4. Siapa Bisa Ngapain Saja? (Hak Wewenang Pengguna)")
    r_h4.font.size = Pt(13)
    r_h4.font.bold = True
    r_h4.font.color.rgb = PRIMARY

    p_wewenang = doc.add_paragraph()
    p_wewenang.paragraph_format.line_spacing = 1.15
    p_wewenang.paragraph_format.space_after = Pt(10)
    p_wewenang.add_run(
        "Berikut penjelasan sederhana tentang apa saja yang bisa dilakukan oleh masing-masing pihak:\n\n"
        "1. SUPER ADMIN (IT Lead & Administrator):\n"
        "   • Mengatur Kelola Unit Kerja (/unit): Bisa menambah unit baru, mengedit nama PIC, dan menghapus unit.\n"
        "   • Mengatur Akun Pengguna: Bisa mereset kata sandi jika ada guru yang lupa password.\n"
        "   • Akses Penuh Seluruh Drive: Bisa membuka dan mengelola file di Google Drive 15 unit kerja.\n"
        "   • Menjaga Keamanan: Memantau log audit sistem dan mencadangkan (backup) basis data.\n\n"
        "2. KETUA TPMPS (Auditor Mutu Utama):\n"
        "   • Mengecek Apa yang Diupload Tiap Unit (/dokumen/validasi): Memeriksa berkas bukti fisik apakah sudah sah atau belum.\n"
        "   • Memberi Status Sah / Revisi: Klik 'Sahkan Dokumen' jika benar, atau klik 'Revisi' jika ada yang kurang lengkap.\n"
        "   • Memberi Skor Penilaian: Mengisi nilai verifikasi auditor terhadap evaluasi mandiri tiap unit.\n"
        "   • Menerbitkan Laporan Mutu (EDS): Menyusun laporan hasil evaluasi sekolah untuk diserahkan ke Kepala Sekolah.\n\n"
        "3. KEPALA SEKOLAH (Pimpinan Eksekutif):\n"
        "   • Memantau Dashboard Mutu (/dashboard): Melihat nilai keseluruhan 8 Standar Nasional Pendidikan (SNP) secara langsung.\n"
        "   • Mengawasi Kepatuhan 15 Unit: Melihat unit mana yang sudah rajin mengupload berkas dan mana yang belum.\n"
        "   • Menyetujui / Mengesahkan Laporan Akhir: Memberikan persetujuan legal (tanda tangan) atas Laporan EDS sekolah.\n"
        "   • Menyetujui Anggaran RTL: Memutuskan alokasi dana perbaikan mutu sekolah.\n\n"
        "4. 15 UNIT KERJA (Kurikulum, Kesiswaan, Jurusan, dll):\n"
        "   • Mengelola Google Drive Unit Sendiri (/drive): Mengupload berkas bukti kerja ke 10 folder standar.\n"
        "   • Mengisi Evaluasi Mandiri: Menilai ketercapaian target kerja masing-masing unit.\n"
        "   • Memantau Catatan Revisi: Melihat apakah dokumen yang diunggah sudah disahkan atau perlu diperbaiki."
    )

    # =========================================================================
    # BAGIAN 5: CARA TPMPS & KEPSEK MENGECEK DOKUMEN UPLOAD UNIT
    # =========================================================================
    h5 = doc.add_heading(level=1)
    r_h5 = h5.add_run("5. Panduan Khusus TPMPS & Kepsek: Cara Mengecek Dokumen Tiap Unit")
    r_h5.font.size = Pt(13)
    r_h5.font.bold = True
    r_h5.font.color.rgb = PRIMARY

    p_val_steps = doc.add_paragraph()
    p_val_steps.paragraph_format.line_spacing = 1.15
    p_val_steps.paragraph_format.space_after = Pt(10)
    p_val_steps.add_run(
        "Bagi Ketua TPMPS dan Kepala Sekolah, sistem menyediakan halaman khusus bernama 'Validasi Dokumen' "
        "untuk mengontrol seluruh unggahan dari 15 unit kerja:\n\n"
        "Langkah-Langkah Pemeriksaan:\n"
        "1. Masuk ke menu 'Validasi Dokumen' di bilah menu samping kiri atau buka alamat: /dokumen/validasi\n"
        "2. Di halaman ini, seluruh berkas yang baru diupload oleh unit kerja akan otomatis muncul dalam status 'Menunggu Review'.\n"
        "3. Anda dapat melihat informasi lengkap:\n"
        "   • Siapa yang mengupload (misalnya: WKS 1 Kurikulum, Jurusan RPL, Sarpras, dll).\n"
        "   • Nama berkas, ukuran file, dan standar SNP yang terkait.\n"
        "4. Klik tombol 'Pratinjau' untuk melihat isi dokumen secara langsung di layar tanpa perlu mendownload.\n"
        "5. Tentukan Keputusan:\n"
        "   • Jika dokumen sudah lengkap & sah: Klik tombol hijau 'Sahkan Dokumen'. Status berkas langsung berubah menjadi 'Terverifikasi' dan skor rapor mutu unit otomatis bertambah.\n"
        "   • Jika ada kekurangan: Klik tombol oranye 'Revisi' dan tuliskan catatan kekurangannya (misal: 'Kurang tanda tangan kepala program'). Catatan ini akan langsung terbaca oleh unit yang bersangkutan."
    )

    # =========================================================================
    # BAGIAN 6: PANDUAN UNIT KERJA PAKAI GOOGLE DRIVE (/drive)
    # =========================================================================
    h6 = doc.add_heading(level=1)
    r_h6 = h6.add_run("6. Panduan Unit Kerja: Cara Menggunakan Google Drive Unit (/drive)")
    r_h6.font.size = Pt(13)
    r_h6.font.bold = True
    r_h6.font.color.rgb = PRIMARY

    p_drive_steps = doc.add_paragraph()
    p_drive_steps.paragraph_format.line_spacing = 1.15
    p_drive_steps.paragraph_format.space_after = Pt(10)
    p_drive_steps.add_run(
        "Halaman Google Drive Unit dibuat mirip seperti Google Drive biasa agar Bapak/Ibu guru mudah menggunakannya:\n\n"
        "1. Membuka Drive Unit: Klik menu 'Google Drive Unit' di samping kiri atau buka /drive.\n"
        "2. Di sebelah kiri, pilih unit kerja Anda (misal: Unit 1 Kurikulum, Unit 6 RPL, dll).\n"
        "3. Di layar tengah, Anda akan melihat 10 Folder Standar Baku:\n"
        "   • 01. Standar SKL\n"
        "   • 02. Standar Isi & Kurikulum\n"
        "   • 03. Standar Proses & PjBL\n"
        "   • 04. Standar Penilaian\n"
        "   • 05. Standar Pendidik (PTK)\n"
        "   • 06. Standar Sarpras\n"
        "   • 07. Standar Pengelolaan & SPMI\n"
        "   • 08. Standar Pembiayaan & RKAS\n"
        "   • 09. SK & Regulasi Unit\n"
        "   • 10. Portofolio & Dokumentasi\n"
        "4. Cara Mengunggah Berkas Baru:\n"
        "   • Klik tombol biru '+ Baru' di pojok kanan atas.\n"
        "   • Tuliskan Judul Dokumen (misal: 'KOSP Tahun Ajaran 2025/2026').\n"
        "   • Pilih Folder Tujuan dan Jenis File (PDF, Excel, Word, atau Gambar).\n"
        "   • Klik 'Simpan'. File Anda berhasil diupload dan otomatis masuk ke antrean Tim TPMPS."
    )

    # =========================================================================
    # BAGIAN 7: PERTANYAAN UMUM (FAQ)
    # =========================================================================
    h7 = doc.add_heading(level=1)
    r_h7 = h7.add_run("7. Tanya Jawab & Bantuan Teknis (FAQ)")
    r_h7.font.size = Pt(13)
    r_h7.font.bold = True
    r_h7.font.color.rgb = PRIMARY

    p_faq = doc.add_paragraph()
    p_faq.paragraph_format.line_spacing = 1.15
    p_faq.paragraph_format.space_after = Pt(16)
    p_faq.add_run(
        "Q: Bagaimana jika saya lupa kata sandi?\n"
        "A: Hubungi Super Admin (Bapak Rian Prasetyo, S.Kom.) untuk melakukan reset password akun Anda kembali ke default 'sintesa123'.\n\n"
        "Q: Apakah saya bisa membuka sistem ini dari ponsel / HP?\n"
        "A: Bisa. Sistem SINTESA sudah mendukung tampilan responsif untuk smartphone, tablet, dan laptop.\n\n"
        "Q: Format dokumen apa saja yang boleh diunggah?\n"
        "A: Sistem mendukung format PDF (.pdf), Microsoft Excel (.xlsx / .xls), Microsoft Word (.docx / .doc), dan Gambar (.jpg / .png)."
    )

    # =========================================================================
    # LEMBAR PENGESAHAN
    # =========================================================================
    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    t_ttd = doc.add_table(rows=1, cols=2)
    t_ttd.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_ttd.autofit = False
    t_ttd.columns[0].width = Inches(3.1)
    t_ttd.columns[1].width = Inches(3.1)

    c_ks = t_ttd.cell(0, 0)
    c_tp = t_ttd.cell(0, 1)

    p_ks = c_ks.paragraphs[0]
    p_ks.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_ks.add_run("Mengetahui,\nKepala SMK Negeri 2 Magelang\n\n\n\n\n").font.size = Pt(10)
    r_ks_nm = p_ks.add_run("Drs. H. Mulyono, M.Pd.\n")
    r_ks_nm.font.bold = True
    r_ks_nm.font.size = Pt(11)
    r_ks_nm.font.color.rgb = NAVY
    p_ks.add_run("NIP. 19680312 199203 1 004").font.size = Pt(9)

    p_tp = c_tp.paragraphs[0]
    p_tp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tp.add_run("Disusun Oleh,\nKetua TPMPS SMK Negeri 2 Magelang\n\n\n\n\n").font.size = Pt(10)
    r_tp_nm = p_tp.add_run("Dra. Hj. Siti Fatimah, M.M.\n")
    r_tp_nm.font.bold = True
    r_tp_nm.font.size = Pt(11)
    r_tp_nm.font.color.rgb = NAVY
    p_tp.add_run("NIP. 19750918 200212 2 001").font.size = Pt(9)

    # Save to both locations
    out_docx = os.path.abspath("BUKU_PANDUAN_SINTESA_TPMPS.docx")
    out_public_docx = os.path.abspath("public/BUKU_PANDUAN_SINTESA_TPMPS.docx")
    out_doc = os.path.abspath("BUKU_PANDUAN_SINTESA_TPMPS.doc")
    out_public_doc = os.path.abspath("public/BUKU_PANDUAN_SINTESA_TPMPS.doc")

    doc.save(out_docx)
    doc.save(out_public_docx)
    doc.save(out_doc)
    doc.save(out_public_doc)

    print(f"Buku Panduan Word berhasil disimpan ke:\n1) {out_docx}\n2) {out_public_docx}\n3) {out_doc}\n4) {out_public_doc}")

if __name__ == "__main__":
    create_guide_document()
