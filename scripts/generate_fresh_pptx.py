import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

# Initialize Presentation
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6] # completely blank layout

# Color Palette Definitions
C_NAVY_DARK = RGBColor(15, 23, 42)      # #0f172a
C_NAVY_MED  = RGBColor(30, 41, 59)      # #1e293b
C_BLUE_MAIN = RGBColor(37, 99, 235)     # #2563eb
C_BLUE_LIGHT = RGBColor(239, 246, 255)  # #eff6ff
C_BLUE_BORDER = RGBColor(191, 219, 254) # #bfdbfe
C_TEXT_DARK = RGBColor(15, 23, 42)      # #0f172a
C_TEXT_MUTED = RGBColor(100, 116, 139)  # #64748b
C_TEXT_LIGHT = RGBColor(241, 245, 249)  # #f1f5f9
C_WHITE     = RGBColor(255, 255, 255)
C_AMBER     = RGBColor(217, 119, 6)     # #d97706
C_AMBER_BG  = RGBColor(254, 243, 199)   # #fef3c7
C_EMERALD   = RGBColor(16, 185, 129)    # #10b981
C_EMERALD_BG = RGBColor(209, 250, 229)  # #d1fae5
C_CARD_BG   = RGBColor(248, 250, 252)   # #f8fafc
C_CARD_BORDER = RGBColor(226, 232, 240) # #e2e8f0

SCREENSHOT_DIR = r"C:\Users\lulus\tpmps-smk\public\screenshots"

def add_header(slide, badge_text, title_text, subtitle_text="Sistem Informasi Penjaminan Mutu Internal - SMK Negeri 2 Magelang"):
    # Header container
    header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(1.1))
    tf = header_box.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    # Badge
    p0 = tf.paragraphs[0]
    p0.text = badge_text.upper()
    p0.font.name = "Segoe UI"
    p0.font.size = Pt(10)
    p0.font.bold = True
    p0.font.color.rgb = C_BLUE_MAIN
    p0.space_after = Pt(2)
    
    # Title
    p1 = tf.add_paragraph()
    p1.text = title_text
    p1.font.name = "Segoe UI"
    p1.font.size = Pt(20)
    p1.font.bold = True
    p1.font.color.rgb = C_NAVY_DARK
    p1.space_after = Pt(2)
    
    # Subtitle
    p2 = tf.add_paragraph()
    p2.text = subtitle_text
    p2.font.name = "Segoe UI"
    p2.font.size = Pt(11)
    p2.font.color.rgb = C_TEXT_MUTED
    
    # Accent Line
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.55), Inches(11.733), Inches(0.02))
    line.fill.solid()
    line.fill.fore_color.rgb = C_CARD_BORDER
    line.line.color.rgb = C_CARD_BORDER

def add_card_box(slide, left, top, width, height, bg_color=C_CARD_BG, border_color=C_CARD_BORDER):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    if border_color:
        card.line.color.rgb = border_color
        card.line.width = Pt(1)
    else:
        card.line.fill.background()
    return card

def add_screenshot(slide, img_path, left, top, width, height):
    # Screenshot background card / frame
    add_card_box(slide, left - Inches(0.08), top - Inches(0.08), width + Inches(0.16), height + Inches(0.16), bg_color=C_WHITE, border_color=C_CARD_BORDER)
    if os.path.exists(img_path):
        slide.shapes.add_picture(img_path, left, top, width, height)
    else:
        # Placeholder
        ph = slide.shapes.add_textbox(left, top + Inches(1.5), width, Inches(1))
        p = ph.text_frame.paragraphs[0]
        p.text = f"[Screenshot Not Found: {os.path.basename(img_path)}]"
        p.alignment = PP_ALIGN.CENTER
        p.font.color.rgb = C_TEXT_MUTED

# ==========================================
# SLIDE 1: COVER
# ==========================================
slide1 = prs.slides.add_slide(blank_layout)
# Dark elegant background
bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
bg1.fill.solid()
bg1.fill.fore_color.rgb = C_NAVY_DARK
bg1.line.fill.background()

# Accent decorative bars
bar1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.2), Inches(1.5), Inches(0.15), Inches(4.5))
bar1.fill.solid()
bar1.fill.fore_color.rgb = C_BLUE_MAIN
bar1.line.fill.background()

# Cover Text Box
c_box = slide1.shapes.add_textbox(Inches(1.6), Inches(1.5), Inches(10.5), Inches(4.5))
tf1 = c_box.text_frame
tf1.word_wrap = True

p_badge = tf1.paragraphs[0]
p_badge.text = "SISTEM PENJAMINAN MUTU INTERNAL (SPMI) - SINTESA TPMPS"
p_badge.font.name = "Segoe UI"
p_badge.font.size = Pt(13)
p_badge.font.bold = True
p_badge.font.color.rgb = RGBColor(96, 165, 250) # Light blue
p_badge.space_after = Pt(12)

p_t1 = tf1.add_paragraph()
p_t1.text = "SINTESA TPMPS"
p_t1.font.name = "Segoe UI"
p_t1.font.size = Pt(40)
p_t1.font.bold = True
p_t1.font.color.rgb = C_WHITE
p_t1.space_after = Pt(4)

p_t2 = tf1.add_paragraph()
p_t2.text = "Sistem Integrasi Penjaminan Mutu Terpadu SMK Negeri 2 Magelang"
p_t2.font.name = "Segoe UI"
p_t2.font.size = Pt(22)
p_t2.font.color.rgb = RGBColor(226, 232, 240)
p_t2.space_after = Pt(20)

p_desc = tf1.add_paragraph()
p_desc.text = "Dokumentasi Lengkap Fitur, Hak Akses Pimpinan (Kepala Sekolah & Ketua TPMPS),\nAlur Validasi Dokumen Unit Kerja, serta Rincian Portofolio Mutu 15 Unit Kerja."
p_desc.font.name = "Segoe UI"
p_desc.font.size = Pt(14)
p_desc.font.color.rgb = RGBColor(148, 163, 184)
p_desc.space_after = Pt(36)

p_meta = tf1.add_paragraph()
p_meta.text = "SMK NEGERI 2 MAGELANG  •  SWADAYA BHINA RAHARJA  •  TAHUN AJARAN 2026/2027"
p_meta.font.name = "Segoe UI"
p_meta.font.size = Pt(11)
p_meta.font.bold = True
p_meta.font.color.rgb = C_AMBER

# ==========================================
# SLIDE 2: LOGIN & AUTENTIKASI
# ==========================================
slide2 = prs.slides.add_slide(blank_layout)
add_header(slide2, "Modul 00: Akses & Keamanan", "Halaman Login & Autentikasi Pengguna Multi-Role")

# Left Info Card
card_l2 = add_card_box(slide2, Inches(0.8), Inches(1.8), Inches(4.5), Inches(5.1))
tfl2 = card_l2.text_frame
tfl2.word_wrap = True
tfl2.margin_left = Inches(0.25)
tfl2.margin_right = Inches(0.25)
tfl2.margin_top = Inches(0.25)

p = tfl2.paragraphs[0]
p.text = "FITUR KEAMANAN & AKSES"
p.font.name = "Segoe UI"
p.font.size = Pt(14)
p.font.bold = True
p.font.color.rgb = C_BLUE_MAIN
p.space_after = Pt(10)

features_login = [
    ("Sistem Login Terpusat", "Satu pintu masuk aman bagi seluruh stakeholder penjaminan mutu sekolah."),
    ("Role-Based Access Control (RBAC)", "Pengguna diarahkan otomatis ke modul sesuai peran: Super Admin, Kepala Sekolah, Ketua TPMPS, atau 15 Koordinator Unit Kerja."),
    ("Keamanan Kredensial", "Setiap koordinator unit memiliki akun terverifikasi untuk menjamin akuntabilitas dokumen yang diunggah."),
    ("Session & Proteksi Data", "Sesi login terenkripsi mencegah manipulasi berkas atau akses data antar unit tanpa wewenang.")
]

for title, desc in features_login:
    pt = tfl2.add_paragraph()
    pt.text = f"• {title}"
    pt.font.name = "Segoe UI"
    pt.font.size = Pt(11)
    pt.font.bold = True
    pt.font.color.rgb = C_NAVY_DARK
    
    pd = tfl2.add_paragraph()
    pd.text = f"  {desc}"
    pd.font.name = "Segoe UI"
    pd.font.size = Pt(10)
    pd.font.color.rgb = C_TEXT_MUTED
    pd.space_after = Pt(8)

# Right Screenshot
add_screenshot(slide2, os.path.join(SCREENSHOT_DIR, "00_login", "01_login_page.png"), Inches(5.6), Inches(1.8), Inches(6.9), Inches(5.1))

# ==========================================
# SLIDE 3: WEWENANG PIMPINAN & SUPER ADMIN
# ==========================================
slide3 = prs.slides.add_slide(blank_layout)
add_header(slide3, "Struktur Kewenangan", "Matriks Peran & Hak Akses: Super Admin, Kepsek, & Ketua TPMPS")

roles_data = [
    ("SUPER ADMIN", "Pengendali Sistem & Infrastruktur", C_NAVY_MED, [
        "Kelola Master Unit Kerja: Tambah, edit, nonaktifkan unit",
        "Manajemen Akun & Kredensial: Reset password & role assignment",
        "Backup & Maintenance Database: Menjaga integritas data",
        "Konfigurasi Standar Penilaian: Bobot SNP & butir instrumen"
    ]),
    ("KEPALA SEKOLAH", "Pengambil Keputusan & Pengesah Mutu", C_BLUE_MAIN, [
        "Executive Dashboard: Memantau ketercapaian 8 SNP sekolah",
        "Validasi Akhir Dokumen: Menyetujui/menolak berkas dari unit",
        "Pengesahan Laporan EDS: Memberikan legalitas laporan mutu",
        "Monitoring Rencana Tindak Lanjut: Memastikan eksekusi mutu"
    ]),
    ("KETUA TPMPS", "Koordinator & Verifikator Penjaminan Mutu", C_AMBER, [
        "Audit & Verifikasi Berkas: Menilai kelayakan bukti fisik unit",
        "Input Skor Evaluasi Mutu: Menilai kepatuhan tiap butir SNP",
        "Pemberian Catatan Revisi: Umpan balik langsung ke unit kerja",
        "Penyusunan Rencana Tindak Lanjut (RTL): Merancang aksi mutu"
    ])
]

for idx, (r_title, r_sub, r_color, r_bullets) in enumerate(roles_data):
    x_pos = Inches(0.8 + idx * 4.0)
    card_r = add_card_box(slide3, x_pos, Inches(1.8), Inches(3.7), Inches(5.1))
    tfr = card_r.text_frame
    tfr.word_wrap = True
    tfr.margin_left = Inches(0.2)
    tfr.margin_right = Inches(0.2)
    tfr.margin_top = Inches(0.25)
    
    # Role Title Badge
    pt = tfr.paragraphs[0]
    pt.text = r_title
    pt.font.name = "Segoe UI"
    pt.font.size = Pt(16)
    pt.font.bold = True
    pt.font.color.rgb = r_color
    pt.space_after = Pt(2)
    
    ps = tfr.add_paragraph()
    ps.text = r_sub
    ps.font.name = "Segoe UI"
    ps.font.size = Pt(10)
    ps.font.italic = True
    ps.font.color.rgb = C_TEXT_MUTED
    ps.space_after = Pt(16)
    
    for b in r_bullets:
        pb = tfr.add_paragraph()
        pb.text = f"✓ {b}"
        pb.font.name = "Segoe UI"
        pb.font.size = Pt(10.5)
        pb.font.color.rgb = C_NAVY_DARK
        pb.space_after = Pt(8)

# ==========================================
# SLIDE 4: DASHBOARD KEPALA SEKOLAH
# ==========================================
slide4 = prs.slides.add_slide(blank_layout)
add_header(slide4, "Pimpinan: Kepala Sekolah", "Executive Dashboard Ketercapaian Mutu & 8 Standar Nasional")

card_l4 = add_card_box(slide4, Inches(0.8), Inches(1.8), Inches(4.5), Inches(5.1))
tfl4 = card_l4.text_frame
tfl4.word_wrap = True
tfl4.margin_left = tfl4.margin_right = tfl4.margin_top = Inches(0.25)

p = tfl4.paragraphs[0]
p.text = "KAPABILITAS DASHBOARD KEPSEK"
p.font.name = "Segoe UI"
p.font.size = Pt(13)
p.font.bold = True
p.font.color.rgb = C_BLUE_MAIN
p.space_after = Pt(10)

kepsek_dash_items = [
    ("Monitoring Capaian SNP Real-Time", "Melihat grafik radar dan persentase kepatuhan terhadap 8 Standar Nasional Pendidikan secara agregat."),
    ("Status Pemenuhan Dokumen Unit", "Mengetahui unit kerja mana yang aktif, pending, atau terlambat dalam mengunggah bukti fisik."),
    ("Pusat Notifikasi Aksi Pimpinan", "Menampilkan jumlah dokumen yang menunggu pengesahan dan status revisi terkini."),
    ("Ringkasan Skor Evaluasi Diri (EDS)", "Indikator cepat untuk menilai mutu sebelum penandatanganan laporan formal.")
]

for title, desc in kepsek_dash_items:
    pt = tfl4.add_paragraph()
    pt.text = f"• {title}"
    pt.font.name = "Segoe UI"
    pt.font.size = Pt(11)
    pt.font.bold = True
    pt.font.color.rgb = C_NAVY_DARK
    
    pd = tfl4.add_paragraph()
    pd.text = f"  {desc}"
    pd.font.name = "Segoe UI"
    pd.font.size = Pt(10)
    pd.font.color.rgb = C_TEXT_MUTED
    pd.space_after = Pt(8)

add_screenshot(slide4, os.path.join(SCREENSHOT_DIR, "kepala_sekolah", "01_dashboard_kepsek.png"), Inches(5.6), Inches(1.8), Inches(6.9), Inches(5.1))

# ==========================================
# SLIDE 5: MODUL VALIDASI DOKUMEN (CARA CEK UPLOAD UNIT)
# ==========================================
slide5 = prs.slides.add_slide(blank_layout)
add_header(slide5, "Pimpinan & TPMPS: Validasi Dokumen", "Mekanisme Pemeriksaan & Pengesahan Dokumen Tiap Unit")

card_l5 = add_card_box(slide5, Inches(0.8), Inches(1.8), Inches(4.5), Inches(5.1))
tfl5 = card_l5.text_frame
tfl5.word_wrap = True
tfl5.margin_left = tfl5.margin_right = tfl5.margin_top = Inches(0.25)

p = tfl5.paragraphs[0]
p.text = "CARA KEPSEK & TPMPS CEK UPLOAD UNIT"
p.font.name = "Segoe UI"
p.font.size = Pt(13)
p.font.bold = True
p.font.color.rgb = C_AMBER
p.space_after = Pt(8)

validasi_steps = [
    ("1. Antrean Dokumen Terpusat", "Kepsek dan TPMPS melihat tabel daftar berkas yang baru diupload oleh 15 unit lengkap dengan nama unit, butir SNP, dan tanggal upload."),
    ("2. Preview & Analisis Berkas", "Dapat membuka/melihat isi dokumen PDF/bukti fisik secara langsung untuk memverifikasi keabsahan data."),
    ("3. Verifikasi Kesesuaian Butir", "Memeriksa apakah bukti yang diupload telah memenuhi kriteria indikator mutu yang dipersyaratkan."),
    ("4. Keputusan Validasi:", "• SAHKAN: Berkas diterima, status berubah 'Disahkan', masuk portofolio resmi.\n• TOLAK/REVISI: Berkas dikembalikan dengan catatan koreksi yang wajib diperbaiki unit.")
]

for title, desc in validasi_steps:
    pt = tfl5.add_paragraph()
    pt.text = title
    pt.font.name = "Segoe UI"
    pt.font.size = Pt(10.5)
    pt.font.bold = True
    pt.font.color.rgb = C_NAVY_DARK
    
    pd = tfl5.add_paragraph()
    pd.text = desc
    pd.font.name = "Segoe UI"
    pd.font.size = Pt(9.5)
    pd.font.color.rgb = C_TEXT_MUTED
    pd.space_after = Pt(6)

add_screenshot(slide5, os.path.join(SCREENSHOT_DIR, "kepala_sekolah", "02_validasi_dokumen_kepsek.png"), Inches(5.6), Inches(1.8), Inches(6.9), Inches(5.1))

# ==========================================
# SLIDE 6: KELOLA UNIT KERJA
# ==========================================
slide6 = prs.slides.add_slide(blank_layout)
add_header(slide6, "Pimpinan & Admin: Kelola Unit Kerja", "Manajemen 15 Unit Kerja & Konfigurasi Standar Penjaminan")

card_l6 = add_card_box(slide6, Inches(0.8), Inches(1.8), Inches(4.5), Inches(5.1))
tfl6 = card_l6.text_frame
tfl6.word_wrap = True
tfl6.margin_left = tfl6.margin_right = tfl6.margin_top = Inches(0.25)

p = tfl6.paragraphs[0]
p.text = "FITUR KELOLA UNIT KERJA"
p.font.name = "Segoe UI"
p.font.size = Pt(13)
p.font.bold = True
p.font.color.rgb = C_BLUE_MAIN
p.space_after = Pt(10)

unit_mgmt_items = [
    ("Direktori 15 Unit Kerja", "Daftar lengkap 15 unit kerja dari WKS, Program Keahlian, Tata Usaha, hingga TEFA."),
    ("Pemetaan Standar (SNP Mapping)", "Menetapkan standar mana saja yang menjadi tanggung jawab tiap unit (misal: WKS 1 mengampu SKL, Isi, Proses, Penilaian)."),
    ("Monitoring Progress Berkas", "Melihat statistik total berkas yang diunggah dan rasio kelengkapan dokumen per unit secara komparatif."),
    ("Pengelolaan Penanggung Jawab", "Menetapkan koordinator / PIC yang bertanggung jawab atas pengisian instrumen mutu.")
]

for title, desc in unit_mgmt_items:
    pt = tfl6.add_paragraph()
    pt.text = f"• {title}"
    pt.font.name = "Segoe UI"
    pt.font.size = Pt(11)
    pt.font.bold = True
    pt.font.color.rgb = C_NAVY_DARK
    
    pd = tfl6.add_paragraph()
    pd.text = f"  {desc}"
    pd.font.name = "Segoe UI"
    pd.font.size = Pt(10)
    pd.font.color.rgb = C_TEXT_MUTED
    pd.space_after = Pt(8)

add_screenshot(slide6, os.path.join(SCREENSHOT_DIR, "kepala_sekolah", "03_kelola_unit_kepsek.png"), Inches(5.6), Inches(1.8), Inches(6.9), Inches(5.1))

# ==========================================
# SLIDE 7: LAPORAN EDS & PENGESAHAN
# ==========================================
slide7 = prs.slides.add_slide(blank_layout)
add_header(slide7, "Pimpinan: Laporan EDS", "Laporan Evaluasi Diri Sekolah & Lembar Pengesahan Resmi")

card_l7 = add_card_box(slide7, Inches(0.8), Inches(1.8), Inches(4.5), Inches(5.1))
tfl7 = card_l7.text_frame
tfl7.word_wrap = True
tfl7.margin_left = tfl7.margin_right = tfl7.margin_top = Inches(0.25)

p = tfl7.paragraphs[0]
p.text = "PENGESAHAN LAPORAN MUTU"
p.font.name = "Segoe UI"
p.font.size = Pt(13)
p.font.bold = True
p.font.color.rgb = C_BLUE_MAIN
p.space_after = Pt(10)

eds_items = [
    ("Kompilasi Otomatis Laporan EDS", "Sistem menyusun seluruh capaian 8 SNP dan skor evaluasi diri ke dalam format laporan komprehensif."),
    ("Ringkasan Nilai & Rekomendasi", "Menyajikan skor akhir pemenuhan mutu sekolah serta area perbaikan prioritas."),
    ("Pengesahan Digital Kepala Sekolah", "Kepala Sekolah memberikan persetujuan resmi dan tanggal pengesahan yang mengikat secara institusional."),
    ("Ekspor & Arsip Akreditasi", "Laporan siap dicetak atau diunduh sebagai dokumen legal untuk Badan Akreditasi Nasional (BAN-PDM).")
]

for title, desc in eds_items:
    pt = tfl7.add_paragraph()
    pt.text = f"• {title}"
    pt.font.name = "Segoe UI"
    pt.font.size = Pt(11)
    pt.font.bold = True
    pt.font.color.rgb = C_NAVY_DARK
    
    pd = tfl7.add_paragraph()
    pd.text = f"  {desc}"
    pd.font.name = "Segoe UI"
    pd.font.size = Pt(10)
    pd.font.color.rgb = C_TEXT_MUTED
    pd.space_after = Pt(8)

add_screenshot(slide7, os.path.join(SCREENSHOT_DIR, "kepala_sekolah", "04_laporan_eds_kepsek.png"), Inches(5.6), Inches(1.8), Inches(6.9), Inches(5.1))

# ==========================================
# SLIDE 8: EVALUASI MUTU KETUA TPMPS
# ==========================================
slide8 = prs.slides.add_slide(blank_layout)
add_header(slide8, "TPMPS: Evaluasi Mutu", "Audit Internal & Pengisian Skor Evaluasi Butir Instrumen")

card_l8 = add_card_box(slide8, Inches(0.8), Inches(1.8), Inches(4.5), Inches(5.1))
tfl8 = card_l8.text_frame
tfl8.word_wrap = True
tfl8.margin_left = tfl8.margin_right = tfl8.margin_top = Inches(0.25)

p = tfl8.paragraphs[0]
p.text = "TUGAS AUDIT KETUA TPMPS"
p.font.name = "Segoe UI"
p.font.size = Pt(13)
p.font.bold = True
p.font.color.rgb = C_AMBER
p.space_after = Pt(10)

eval_items = [
    ("Audit Instrumen Per Butir", "Ketua TPMPS memeriksa kepatuhan tiap butir instrumen berdasarkan bukti fisik yang telah disahkan."),
    ("Penilaian Skor Mutu Internal", "Memberikan skor capaian (1-4 / Kurang s/d Sangat Baik) didukung catatan objektif hasil telaah bukti."),
    ("Analisis Kesenjangan (Gap Analysis)", "Mengidentifikasi deviasi antara standar target sekolah dengan realisasi capaian unit kerja."),
    ("Sinkronisasi Otomatis ke EDS", "Hasil evaluasi TPMPS langsung menjadi dasar kalkulasi capaian mutu pada Laporan EDS sekolah.")
]

for title, desc in eval_items:
    pt = tfl8.add_paragraph()
    pt.text = f"• {title}"
    pt.font.name = "Segoe UI"
    pt.font.size = Pt(11)
    pt.font.bold = True
    pt.font.color.rgb = C_NAVY_DARK
    
    pd = tfl8.add_paragraph()
    pd.text = f"  {desc}"
    pd.font.name = "Segoe UI"
    pd.font.size = Pt(10)
    pd.font.color.rgb = C_TEXT_MUTED
    pd.space_after = Pt(8)

add_screenshot(slide8, os.path.join(SCREENSHOT_DIR, "ketua_tpmps", "03_evaluasi_mutu_tpmps.png"), Inches(5.6), Inches(1.8), Inches(6.9), Inches(5.1))

# ==========================================
# SLIDE 9: RENCANA TINDAK LANJUT (RTL) MUTU
# ==========================================
slide9 = prs.slides.add_slide(blank_layout)
add_header(slide9, "TPMPS: Pengendalian & Peningkatan", "Penyusunan Rencana Tindak Lanjut (RTL) & Target Perbaikan")

card_l9 = add_card_box(slide9, Inches(0.8), Inches(1.8), Inches(4.5), Inches(5.1))
tfl9 = card_l9.text_frame
tfl9.word_wrap = True
tfl9.margin_left = tfl9.margin_right = tfl9.margin_top = Inches(0.25)

p = tfl9.paragraphs[0]
p.text = "MANAJEMEN RTL OLEH TPMPS"
p.font.name = "Segoe UI"
p.font.size = Pt(13)
p.font.bold = True
p.font.color.rgb = C_AMBER
p.space_after = Pt(10)

rtl_items = [
    ("Formulasi Rekomendasi Solutif", "Menyusun aksi konkret perbaikan mutu untuk butir-butir standar yang belum optimal."),
    ("Penugasan Unit Penanggung Jawab", "Menunjuk unit kerja pelaksana (WKS, Program Keahlian, TEFA, dll) untuk mengeksekusi rekomendasi."),
    ("Penetapan Target Waktu & Indikator", "Menentukan tenggat waktu penyelesaian (timeline) dan indikator keberhasilan perbaikan."),
    ("Siklus PPEPP Berkesinambungan", "Memastikan siklus Pengendalian (P) dan Peningkatan (P) mutu berjalan aktif di sekolah.")
]

for title, desc in rtl_items:
    pt = tfl9.add_paragraph()
    pt.text = f"• {title}"
    pt.font.name = "Segoe UI"
    pt.font.size = Pt(11)
    pt.font.bold = True
    pt.font.color.rgb = C_NAVY_DARK
    
    pd = tfl9.add_paragraph()
    pd.text = f"  {desc}"
    pd.font.name = "Segoe UI"
    pd.font.size = Pt(10)
    pd.font.color.rgb = C_TEXT_MUTED
    pd.space_after = Pt(8)

add_screenshot(slide9, os.path.join(SCREENSHOT_DIR, "ketua_tpmps", "05_rtl_mutu_tpmps.png"), Inches(5.6), Inches(1.8), Inches(6.9), Inches(5.1))

# ==========================================
# SLIDES 10 s/d 24: 15 UNIT KERJA LENGKAP
# ==========================================
units_info = [
    {
        "id": "Unit 01",
        "name": "WKS 1 Bidang Kurikulum",
        "pic": "Koordinator Kurikulum & Pembelajaran",
        "snp": "Standar Isi, Standar Proses, Standar Penilaian, Standar Kompetensi Lulusan (SKL)",
        "ngapain": [
            "Menyusun dan mengunggah dokumen Kurikulum Operasional Satuan Pendidikan (KOSP).",
            "Mengelola perangkat ajar: Alur Tujuan Pembelajaran (ATP), Modul Ajar, dan Kalender Akademik.",
            "Menyiapkan bukti pelaksanaan Asesmen Sumatif, Formatif, dan Ujian Kompetensi Keahlian (UKK).",
            "Mendokumentasikan jadwal pembelajaran dan keterlaksanaan jam mengajar guru."
        ],
        "bisa_apa": [
            "Upload & kelola bukti fisik kurikulum ke folder standar bersangkutan.",
            "Melihat status verifikasi dokumen (Menunggu, Disahkan, atau Perlu Revisi).",
            "Membaca catatan revisi dari TPMPS / Kepsek dan mengunggah dokumen perbaikan.",
            "Memantau persentase kelengkapan berkas kurikulum secara mandiri di Dashboard Unit."
        ],
        "img": os.path.join(SCREENSHOT_DIR, "unit_01_wks1_kurikulum", "01_drive_wks_1.png")
    },
    {
        "id": "Unit 02",
        "name": "WKS 2 Bidang Kesiswaan",
        "pic": "Koordinator Kesiswaan & Pembinaan Karakter",
        "snp": "Standar Kompetensi Lulusan (SKL), Standar Pengelolaan (Ekstrakurikuler & Disiplin)",
        "ngapain": [
            "Mendokumentasikan program pembiasaan karakter, tata tertib, dan buku kedisiplinan siswa.",
            "Mengunggah bukti prestasi akademik dan non-akademik siswa di berbagai tingkat perlombaan.",
            "Mengelola portofolio kegiatan OSIS, MPK, Pramuka, dan ekstrakurikuler sekolah.",
            "Mendokumentasikan kegiatan Masa Pengenalan Lingkungan Sekolah (MPLS) dan Peringatan Hari Besar."
        ],
        "bisa_apa": [
            "Mengunggah sertifikat kejuaraan, foto kegiatan, dan laporan pembinaan kesiswaan.",
            "Melihat rekapitulasi berkas kesiswaan yang sudah disahkan oleh Kepala Sekolah.",
            "Menerima catatan evaluasi TPMPS terkait kelengkapan program kesiswaan.",
            "Memantau progres pemenuhan instrumen karakter dan ekstrakurikuler."
        ],
        "img": os.path.join(SCREENSHOT_DIR, "unit_02_wks2_kesiswaan", "01_drive_wks_2.png")
    },
    {
        "id": "Unit 03",
        "name": "WKS 3 Bidang Sarana & Prasarana",
        "pic": "Koordinator Sarana, Prasarana & Aset Sekolah",
        "snp": "Standar Sarana dan Prasarana (Sarpras)",
        "ngapain": [
            "Mengunggah master data inventaris gedung, ruang kelas, laboratorium, dan bengkel praktik.",
            "Mendokumentasikan sertifikat kelaikan sarana, izin operasional genset, dan alat pemadam api (APAR).",
            "Mengarsipkan jadwal dan bukti perawatan berkala peralatan praktik dan fasilitas sekolah.",
            "Menyusun laporan perencanaan kebutuhan dan pengadaan sarana pembelajaran."
        ],
        "bisa_apa": [
            "Upload berkas bukti fisik sarana ke dalam kategori ruang dan peralatan standar.",
            "Mengecek berkas inventaris yang telah diverifikasi oleh Tim TPMPS.",
            "Mengajukan bukti perbaikan sarana sesuai rekomendasi RTL dari pimpinan.",
            "Melihat audit kelaikan sarana penunjang pembelajaran kejuruan."
        ],
        "img": os.path.join(SCREENSHOT_DIR, "unit_03_wks3_sarpras", "01_drive_wks_3.png")
    },
    {
        "id": "Unit 04",
        "name": "WKS 4 Hubungan Industri & Humas",
        "pic": "Koordinator Hubungan Industri (Hubin) & Humas",
        "snp": "Standar Pengelolaan, Standar Proses (PKL & Kemitraan Industri)",
        "ngapain": [
            "Mengunggah Nota Kesepahaman (MoU / PKS) kemitraan dengan Dunia Usaha / Dunia Industri (DUDI).",
            "Mendokumentasikan program Pelaksanaan Praktik Kerja Lapangan (PKL) siswa di industri.",
            "Mengarsipkan jadwal Guru Tamu dari praktisi industri dan program Magang Guru.",
            "Menyusun dokumentasi sinkronisasi kurikulum industri dan kelas industri."
        ],
        "bisa_apa": [
            "Upload dokumen kerjasama DUDI dan evaluasi kemitraan industri.",
            "Melacak status legalitas dokumen MoU yang divalidasi oleh Kepala Sekolah.",
            "Mendapatkan umpan balik kelayakan program kemitraan dari TPMPS.",
            "Menyajikan portofolio keterlibatan industri dalam pembelajaran SMK."
        ],
        "img": os.path.join(SCREENSHOT_DIR, "unit_04_wks4_humas", "01_drive_wks_4.png")
    },
    {
        "id": "Unit 05",
        "name": "WKS SDM / Tata Usaha & Ketenagaan",
        "pic": "Kepala Tata Usaha & Pengelola Kepegawaian",
        "snp": "Standar Pendidik dan Tenaga Kependidikan (PTK), Standar Pembiayaan",
        "ngapain": [
            "Mengunggah database kualifikasi ijazah, sertifikat pendidik (Serdik), dan SK Pembagian Tugas Guru/Staf.",
            "Mengarsipkan bukti keikutsertaan pelatihan, workshop, dan pengembangan keprofesian berkelanjutan (PKB).",
            "Menyimpan data penilaian kinerja guru (PKG) dan SKP aparatur sipil / GTT-PTT.",
            "Mendokumentasikan RKAS dan laporan pertanggungjawaban keuangan sekolah."
        ],
        "bisa_apa": [
            "Upload berkas portofolio PTK dan dokumen akuntabilitas anggaran.",
            "Melihat pemetaan pemenuhan rasio guru tersertifikasi pada sistem.",
            "Menerima rekomendasi pelatihan guru dari TPMPS pada modul RTL.",
            "Memantau kepatuhan administrasi kepegawaian sekolah secara digital."
        ],
        "img": os.path.join(SCREENSHOT_DIR, "unit_05_wks_sdm", "01_drive_wks_sdm.png")
    },
    {
        "id": "Unit 06",
        "name": "Program Keahlian RPL / PPLG",
        "pic": "Ketua Konsentrasi Rekayasa Perangkat Lunak",
        "snp": "Standar Isi, Proses, Penilaian, dan Sarpras Khusus Kejuruan",
        "ngapain": [
            "Mengunggah silabus kejuruan, modul ajar pemrograman, dan jobsheet praktikum lab coding.",
            "Mendokumentasikan hasil karya proyek perangkat lunak dan portofolio aplikasi siswa.",
            "Mengunggah bukti verifikasi kelaikan laboratorium komputer RPL dan lisensi software.",
            "Menyusun laporan Uji Kompetensi Keahlian (UKK) skema Software Development."
        ],
        "bisa_apa": [
            "Upload instrumen spesifik kejuruan RPL langsung ke folder unit.",
            "Memantau dokumen yang telah diverifikasi untuk akreditasi kejuruan.",
            "Mengunggah bukti revisi jobsheet jika diminta oleh tim reviewer TPMPS.",
            "Melihat grafik kesiapan mutu lab dan pembelajaran RPL."
        ],
        "img": os.path.join(SCREENSHOT_DIR, "unit_06_prog_rpl", "01_drive_prog_rpl.png")
    },
    {
        "id": "Unit 07",
        "name": "Program Keahlian TKJ / TJKT",
        "pic": "Ketua Konsentrasi Teknik Komputer & Jaringan",
        "snp": "Standar Isi, Proses, Penilaian, dan Sarpras Khusus Jaringan",
        "ngapain": [
            "Mengunggah perangkat ajar instalasi jaringan, administrasi server, dan sistem keamanan siber.",
            "Mendokumentasikan hasil praktikum konfigurasi routing, switching, dan fiber optik.",
            "Mengarsipkan kartu inventaris perangkat lab jaringan (router, switch, crimping tool, server).",
            "Menyiapkan bukti portofolio asesmen UKK sertifikasi MikroTik / Cisco / BNSP."
        ],
        "bisa_apa": [
            "Upload berkas kurikulum kejuruan dan kelengkapan lab TJKT.",
            "Mengecek validasi bukti fisik asesmen kejuruan oleh pimpinan.",
            "Menyesuaikan bukti dukung praktikum sesuai catatan telaah TPMPS.",
            "Memantau kesiapan instrumen akreditasi program keahlian TKJ."
        ],
        "img": os.path.join(SCREENSHOT_DIR, "unit_07_prog_tkj", "01_drive_prog_tkj.png")
    },
    {
        "id": "Unit 08",
        "name": "Program Keahlian AKL",
        "pic": "Ketua Konsentrasi Akuntansi & Keuangan Lembaga",
        "snp": "Standar Isi, Proses, Penilaian, dan Sarpras Akuntansi",
        "ngapain": [
            "Mengunggah modul ajar akuntansi manual, spreadsheet, MYOB/Accurate, dan perpajakan.",
            "Mendokumentasikan praktikum simulasi bank mini sekolah dan akuntansi perusahaan.",
            "Mengarsipkan portofolio asesmen UKK skema Teknisi Akuntansi Yunior.",
            "Menyimpan bukti kelaikan sarana komputer akuntansi dan software berlisensi."
        ],
        "bisa_apa": [
            "Upload dokumen perangkat uji dan laporan praktikum akuntansi.",
            "Melihat approval bukti fisik pembelajaran akuntansi dari Kepala Sekolah.",
            "Merespon masukan TPMPS terkait standar peralatan lab akuntansi.",
            "Mengakses arsip instrumen mutu kejuruan secara terstruktur."
        ],
        "img": os.path.join(SCREENSHOT_DIR, "unit_08_prog_akl", "01_drive_prog_akl.png")
    },
    {
        "id": "Unit 09",
        "name": "Program Keahlian MP / MPLB",
        "pic": "Ketua Konsentrasi Manajemen Perkantoran & Logistik",
        "snp": "Standar Isi, Proses, Penilaian, dan Sarpras Perkantoran",
        "ngapain": [
            "Mengunggah modul ajar kearsipan digital, komunikasi bisnis, dan otomatisasi tata kelola kantor.",
            "Mendokumentasikan praktikum simulasi ruang kantor modern dan penanganan surat masuk/keluar.",
            "Menyusun portofolio asesmen UKK skema Administrasi Perkantoran.",
            "Mengarsipkan kartu inventaris sarana lab perkantoran (mesin ketik/komputer, mesin laminating, penghancur kertas)."
        ],
        "bisa_apa": [
            "Upload berkas instrumen kejuruan dan laporan uji kompetensi perkantoran.",
            "Mengecek status validasi bukti fisik perkantoran oleh TPMPS.",
            "Membaca catatan revisi terkait kelengkapan bukti praktikum kantor.",
            "Memantau pemenuhan standar mutu kejuruan MPLB."
        ],
        "img": os.path.join(SCREENSHOT_DIR, "unit_09_prog_mplb", "01_drive_prog_otkp.png")
    },
    {
        "id": "Unit 10",
        "name": "Program Keahlian BDP / Pemasaran",
        "pic": "Ketua Konsentrasi Bisnis Daring & Pemasaran",
        "snp": "Standar Isi, Proses, Penilaian, dan Sarpras Pemasaran",
        "ngapain": [
            "Mengunggah modul ajar digital marketing, kasir POS, display barang, dan e-commerce.",
            "Mendokumentasikan kegiatan praktik penjualan di Business Center / laboratorium retail.",
            "Mengarsipkan portofolio karya promosi digital, konten media sosial, dan kampanye iklan siswa.",
            "Menyiapkan bukti asesmen UKK skema Kasir / Pramuniaga / Pemasaran Digital."
        ],
        "bisa_apa": [
            "Upload bukti fisik kurikulum retail, foto penataan barang, dan laporan penjualan.",
            "Melihat verifikasi dokumen mutu pemasaran dari tim verifikator.",
            "Memperbarui dokumen bukti sesuai evaluasi TPMPS.",
            "Memantau persentase ketercapaian standar kompetensi retail."
        ],
        "img": os.path.join(SCREENSHOT_DIR, "unit_10_prog_bdp", "01_drive_prog_bdp.png")
    },
    {
        "id": "Unit 11",
        "name": "Laboratorium & Bengkel Komputer",
        "pic": "Kepala Laboratorium & Teknisi Komputer",
        "snp": "Standar Sarana & Prasarana, Standar Pengelolaan Lab",
        "ngapain": [
            "Mengunggah tata tertib penggunaan laboratorium komputer dan SOP keselamatan kerja.",
            "Mendokumentasikan jadwal pemakaian lab per kelas dan buku logbook praktikum.",
            "Mengarsipkan kartu riwayat perbaikan (maintenance log) PC, jaringan, dan pendingin ruangan.",
            "Menyusun daftar inventaris hardware, software, dan kebutuhan suku cadang komputer."
        ],
        "bisa_apa": [
            "Upload dokumen SOP, kartu perawatan hardware, dan logbook lab.",
            "Melihat feedback dan persetujuan SOP dari TPMPS dan Kepala Sekolah.",
            "Mengunggah bukti tindak lanjut pemeliharaan peralatan rusak.",
            "Memantau status kelaikan operasional seluruh ruang laboratorium."
        ],
        "img": os.path.join(SCREENSHOT_DIR, "unit_11_lab_bengkel", "01_drive_bengkel.png")
    },
    {
        "id": "Unit 12",
        "name": "Perpustakaan Sekolah",
        "pic": "Kepala Perpustakaan & Pustakawan",
        "snp": "Standar Sarana & Prasarana (Perpustakaan), Standar Pengelolaan",
        "ngapain": [
            "Mengunggah laporan inventaris buku teks pelajaran, referensi umum, dan buku bacaan pengayaan.",
            "Mendokumentasikan statistik kunjungan pembaca, peminjaman buku, dan keanggotaan perpustakaan.",
            "Mengarsipkan bukti program literasi sekolah (pojok baca, tantangan membaca, review buku).",
            "Menyusun laporan pengembangan perpustakaan digital (e-library) dan katalogisasi."
        ],
        "bisa_apa": [
            "Upload katalog buku, laporan sirkulasi bulanan, dan dokumentasi kegiatan literasi.",
            "Mengecek status pengesahan dokumen perpustakaan oleh pimpinan.",
            "Menerima rekomendasi penambahan koleksi buku dari TPMPS.",
            "Memantau skor pemenuhan Standar Nasional Perpustakaan (SNP)."
        ],
        "img": os.path.join(SCREENSHOT_DIR, "unit_12_perpustakaan", "01_drive_perpus.png")
    },
    {
        "id": "Unit 13",
        "name": "Bursa Kerja Khusus (BKK)",
        "pic": "Ketua BKK & Tim Penelusuran Alumni",
        "snp": "Standar Kompetensi Lulusan (Tracer Study & Serapan Kerja)",
        "ngapain": [
            "Mengunggah database hasil penelusuran tamatan (Tracer Study): Bekerja, Melanjutkan, Wirausaha (BMW).",
            "Mendokumentasikan pelaksanaan bursa kerja (Job Fair), rekrutmen kampus, dan seleksi kerja industri.",
            "Mengarsipkan surat penempatan kerja lulusan di DUDI mitra.",
            "Menyusun laporan persentase keterserapan lulusan dalam waktu kurang dari 6 bulan."
        ],
        "bisa_apa": [
            "Upload rekapitulasi data tracer study dan foto pelaksanaan seleksi kerja.",
            "Melihat validasi data serapan lulusan oleh Kepala Sekolah.",
            "Menerima catatan dari TPMPS terkait target peningkatan angka keterserapan.",
            "Menyajikan statistik daya serap alumni secara transparan dan terverifikasi."
        ],
        "img": os.path.join(SCREENSHOT_DIR, "unit_13_bkk", "01_drive_bkk.png")
    },
    {
        "id": "Unit 14",
        "name": "Bimbingan & Konseling (BK)",
        "pic": "Koordinator Guru BK",
        "snp": "Standar Proses (Layanan BK), Standar Kompetensi Lulusan",
        "ngapain": [
            "Mengunggah program kerja tahunan layanan Bimbingan Pribadi, Sosial, Belajar, dan Karir.",
            "Mendokumentasikan asesmen diagnostik non-kognitif awal tahun untuk pemetaan potensi siswa.",
            "Mengarsipkan rekap layanan konseling individual, kelompok, dan bimbingan klasikal.",
            "Menyusun laporan peminatan studi lanjut, pemetaan karir, dan penanganan kasus siswa."
        ],
        "bisa_apa": [
            "Upload dokumen program BK dan rekap laporan layanan secara berkala.",
            "Menjaga kerahasiaan data konseling sambil membuktikan kepatuhan proses layanan ke sistem.",
            "Melihat status verifikasi instrumen layanan BK oleh tim penjamin mutu.",
            "Merespon rekomendasi perbaikan pembinaan karakter siswa dari TPMPS."
        ],
        "img": os.path.join(SCREENSHOT_DIR, "unit_14_bk", "01_drive_bk.png")
    },
    {
        "id": "Unit 15",
        "name": "Teaching Factory (TEFA) & Unit Produksi",
        "pic": "Manajer TEFA & Koordinator Unit Produksi",
        "snp": "Standar Proses, Standar Pengelolaan, Standar Sarpras (Pembelajaran Berbasis Industri)",
        "ngapain": [
            "Mengunggah pedoman operasional TEFA, struktur pengelola, dan alur produksi standar industri.",
            "Mendokumentasikan integrasi jadwal pembelajaran dengan order pekerjaan industri / masyarakat.",
            "Mengarsipkan laporan omzet penjualan produk/jasa TEFA dan laporan keuangan unit produksi.",
            "Menyusun portofolio produk unggulan hasil karya siswa yang dipasarkan ke publik."
        ],
        "bisa_apa": [
            "Upload dokumen SOP TEFA, lembar kerja produksi siswa, dan laporan keuangan TEFA.",
            "Mengecek validasi bukti kemitraan produksi oleh Kepala Sekolah.",
            "Mendapatkan arahan evaluasi mutu implementasi model pembelajaran TEFA.",
            "Menampilkan kapabilitas sekolah sebagai SMK Pusat Keunggulan berorientasi produk nyata."
        ],
        "img": os.path.join(SCREENSHOT_DIR, "unit_15_tefa", "01_drive_tefa.png")
    }
]

for u in units_info:
    slide_u = prs.slides.add_slide(blank_layout)
    add_header(slide_u, f"{u['id']}: Unit Kerja Pelaksana", f"Portofolio Mutu: {u['name']}")
    
    # Left Content Card
    card_u = add_card_box(slide_u, Inches(0.8), Inches(1.8), Inches(4.5), Inches(5.1))
    tfu = card_u.text_frame
    tfu.word_wrap = True
    tfu.margin_left = tfu.margin_right = tfu.margin_top = Inches(0.2)
    
    # PIC & SNP Metadata
    p_pic = tfu.paragraphs[0]
    p_pic.text = f"Koordinator: {u['pic']}"
    p_pic.font.name = "Segoe UI"
    p_pic.font.size = Pt(10.5)
    p_pic.font.bold = True
    p_pic.font.color.rgb = C_BLUE_MAIN
    p_pic.space_after = Pt(2)
    
    p_snp = tfu.add_paragraph()
    p_snp.text = f"SNP Diampu: {u['snp']}"
    p_snp.font.name = "Segoe UI"
    p_snp.font.size = Pt(9.5)
    p_snp.font.italic = True
    p_snp.font.color.rgb = C_TEXT_MUTED
    p_snp.space_after = Pt(8)
    
    # Section 1: Ngapain Aja?
    p_sec1 = tfu.add_paragraph()
    p_sec1.text = "TUGAS POKOK & BUKTI FISIK (Ngapain Aja?):"
    p_sec1.font.name = "Segoe UI"
    p_sec1.font.size = Pt(10)
    p_sec1.font.bold = True
    p_sec1.font.color.rgb = C_NAVY_DARK
    p_sec1.space_after = Pt(2)
    
    for item in u["ngapain"]:
        pi = tfu.add_paragraph()
        pi.text = f"• {item}"
        pi.font.name = "Segoe UI"
        pi.font.size = Pt(9)
        pi.font.color.rgb = C_TEXT_DARK
        pi.space_after = Pt(3)
        
    p_gap = tfu.add_paragraph()
    p_gap.space_after = Pt(4)
    
    # Section 2: Bisa Apa Aja di Sistem?
    p_sec2 = tfu.add_paragraph()
    p_sec2.text = "FITUR & AKSES SISTEM SINTESA (Bisa Apa Aja?):"
    p_sec2.font.name = "Segoe UI"
    p_sec2.font.size = Pt(10)
    p_sec2.font.bold = True
    p_sec2.font.color.rgb = C_AMBER
    p_sec2.space_after = Pt(2)
    
    for item in u["bisa_apa"]:
        pi = tfu.add_paragraph()
        pi.text = f"✓ {item}"
        pi.font.name = "Segoe UI"
        pi.font.size = Pt(9)
        pi.font.color.rgb = C_TEXT_DARK
        pi.space_after = Pt(3)
        
    # Right Screenshot
    add_screenshot(slide_u, u["img"], Inches(5.6), Inches(1.8), Inches(6.9), Inches(5.1))

# ==========================================
# SLIDE 25: ALUR SIKLUS PPEPP TERPADU
# ==========================================
slide25 = prs.slides.add_slide(blank_layout)
add_header(slide25, "Siklus Penjaminan Mutu Internal", "Alur Kerja End-to-End PPEPP & Siklus Validasi SINTESA")

ppepp_steps = [
    ("1. Penetapan (P)", "Pimpinan & TPMPS menetapkan target 8 SNP, indikator mutu, butir instrumen, dan penugasan 15 unit kerja.", C_NAVY_MED),
    ("2. Pelaksanaan (P)", "15 Unit Kerja mengunggah berkas bukti fisik, dokumen portofolio, dan laporan kegiatan ke Drive Unit masing-masing.", C_BLUE_MAIN),
    ("3. Evaluasi (E)", "Ketua TPMPS & Tim mengaudit keabsahan berkas di Modul Validasi, menginput skor evaluasi, dan memberikan catatan koreksi.", C_AMBER),
    ("4. Pengendalian (P)", "Kepala Sekolah mengesahkan dokumen yang valid atau menolak untuk revisi. Menyusun Laporan EDS resmi dan penandatanganan legal.", C_EMERALD),
    ("5. Peningkatan (P)", "Penyusunan Rencana Tindak Lanjut (RTL) berbasis kesenjangan mutu untuk peningkatan standar di periode berikutnya.", RGBColor(124, 58, 237))
]

for idx, (step_title, step_desc, step_color) in enumerate(ppepp_steps):
    y_pos = Inches(1.8 + idx * 1.0)
    box = add_card_box(slide25, Inches(0.8), y_pos, Inches(11.733), Inches(0.85))
    tf_step = box.text_frame
    tf_step.word_wrap = True
    tf_step.margin_left = Inches(0.2)
    tf_step.margin_right = Inches(0.2)
    tf_step.margin_top = Inches(0.12)
    
    p1 = tf_step.paragraphs[0]
    p1.text = step_title
    p1.font.name = "Segoe UI"
    p1.font.size = Pt(12)
    p1.font.bold = True
    p1.font.color.rgb = step_color
    p1.space_after = Pt(2)
    
    p2 = tf_step.add_paragraph()
    p2.text = step_desc
    p2.font.name = "Segoe UI"
    p2.font.size = Pt(10)
    p2.font.color.rgb = C_NAVY_DARK

# ==========================================
# SLIDE 26: KESIMPULAN & PENGESAHAN
# ==========================================
slide26 = prs.slides.add_slide(blank_layout)
add_header(slide26, "Penutup & Lembar Pengesahan", "Komitmen Bersama Penjaminan Mutu Berkelanjutan")

# Left Impact Summary Card
card_l26 = add_card_box(slide26, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.1))
tf26 = card_l26.text_frame
tf26.word_wrap = True
tf26.margin_left = tf26.margin_right = tf26.margin_top = Inches(0.3)

p = tf26.paragraphs[0]
p.text = "DAMPAK IMPLEMENTASI SINTESA TPMPS"
p.font.name = "Segoe UI"
p.font.size = Pt(13)
p.font.bold = True
p.font.color.rgb = C_BLUE_MAIN
p.space_after = Pt(14)

impacts = [
    ("Akuntabilitas Terukur", "Setiap bukti fisik terdokumentasi rapi, terverifikasi berjenjang, dan bebas dari risiko kehilangan arsip fisik."),
    ("Transparansi Kinerja Unit", "Pimpinan dapat memantau produktivitas dan kepatuhan 15 unit kerja secara real-time dari satu dashboard terpadu."),
    ("Efisiensi Akreditasi Sekolah", "Seluruh eviden siap saji untuk kebutuhan asesmen BAN-PDM, audit ISO, maupun evaluasi dinas pendidikan."),
    ("Budaya Mutu Berkelanjutan", "Siklus PPEPP bertransformasi dari sekadar kewajiban administratif menjadi budaya kerja nyata di SMK Negeri 2 Magelang.")
]

for title, desc in impacts:
    pt = tf26.add_paragraph()
    pt.text = f"✔ {title}"
    pt.font.name = "Segoe UI"
    pt.font.size = Pt(11)
    pt.font.bold = True
    pt.font.color.rgb = C_NAVY_DARK
    
    pd = tf26.add_paragraph()
    pd.text = f"   {desc}"
    pd.font.name = "Segoe UI"
    pd.font.size = Pt(10)
    pd.font.color.rgb = C_TEXT_MUTED
    pd.space_after = Pt(10)

# Right Signature Card
card_r26 = add_card_box(slide26, Inches(6.8), Inches(1.8), Inches(5.733), Inches(5.1))
tfr26 = card_r26.text_frame
tfr26.word_wrap = True
tfr26.margin_left = tfr26.margin_right = tfr26.margin_top = Inches(0.3)

ps_title = tfr26.paragraphs[0]
ps_title.text = "LEMBAR PENGESAHAN DOKUMEN SISTEM"
ps_title.font.name = "Segoe UI"
ps_title.font.size = Pt(13)
ps_title.font.bold = True
ps_title.font.color.rgb = C_NAVY_DARK
ps_title.alignment = PP_ALIGN.CENTER
ps_title.space_after = Pt(4)

ps_sub = tfr26.add_paragraph()
ps_sub.text = "Magelang, September 2026"
ps_sub.font.name = "Segoe UI"
ps_sub.font.size = Pt(10)
ps_sub.font.color.rgb = C_TEXT_MUTED
ps_sub.alignment = PP_ALIGN.CENTER
ps_sub.space_after = Pt(30)

# Signatures side-by-side simulation
sig_text = tfr26.add_paragraph()
sig_text.text = "Mengetahui,\nKepala SMK Negeri 2 Magelang\n\n\n\n\n( Kepala Sekolah )\nNIP. ........................................"
sig_text.font.name = "Segoe UI"
sig_text.font.size = Pt(10.5)
sig_text.font.color.rgb = C_NAVY_DARK
sig_text.alignment = PP_ALIGN.CENTER
sig_text.space_after = Pt(25)

sig_tpmps = tfr26.add_paragraph()
sig_tpmps.text = "Disetujui oleh,\nKetua TPMPS SMK Negeri 2 Magelang\n\n\n\n\n( Ketua TPMPS )\nNIP. ........................................"
sig_tpmps.font.name = "Segoe UI"
sig_tpmps.font.size = Pt(10.5)
sig_tpmps.font.color.rgb = C_NAVY_DARK
sig_tpmps.alignment = PP_ALIGN.CENTER

# Save Output
output_path1 = r"C:\Users\lulus\tpmps-smk\PRESENTASI_SINTESA_TPMPS.pptx"
output_path2 = r"C:\Users\lulus\tpmps-smk\public\PRESENTASI_SINTESA_TPMPS.pptx"

prs.save(output_path1)
prs.save(output_path2)

print(f"Presentation successfully generated at:\n1. {output_path1}\n2. {output_path2}")
