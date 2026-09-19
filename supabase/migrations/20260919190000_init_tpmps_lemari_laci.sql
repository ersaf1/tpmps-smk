-- ==========================================================
-- SKEMA BASIS DATA SUPABASE: SIGMA-TPMPS SMK
-- Migration: 20260919190000_init_tpmps_lemari_laci.sql
-- Sistem Lemari & Laci Digital (18 Unit Kerja)
-- ==========================================================

-- 1. Tabel Unit Kerja (18 Unit)
CREATE TABLE IF NOT EXISTS unit_kerja (
    id TEXT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Manajemen', 'Kejuruan', 'Layanan', 'Pengawasan')),
    pic_user_id TEXT,
    pic VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    score NUMERIC(5, 2) DEFAULT 0,
    total_indicators INT DEFAULT 0,
    completed_indicators INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Baik',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel Lemari Unit (Filing Cabinet - 1 Lemari per Unit)
CREATE TABLE IF NOT EXISTS lemari_unit (
    id TEXT PRIMARY KEY,
    unit_id TEXT NOT NULL REFERENCES unit_kerja(id) ON DELETE CASCADE,
    unit_code VARCHAR(50) NOT NULL,
    unit_name VARCHAR(255) NOT NULL,
    unit_category VARCHAR(50) NOT NULL,
    pic VARCHAR(255) NOT NULL,
    tahun_ajaran VARCHAR(50) NOT NULL DEFAULT '2025/2026',
    deskripsi_job TEXT,
    total_laci INT DEFAULT 0,
    laci_terisi INT DEFAULT 0,
    laci_disetujui INT DEFAULT 0,
    laci_revisi INT DEFAULT 0,
    laci_kosong INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Aktif',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabel Laci Tugas (Laci A, B, C, dst.)
CREATE TABLE IF NOT EXISTS laci_unit (
    id TEXT PRIMARY KEY,
    lemari_id TEXT NOT NULL REFERENCES lemari_unit(id) ON DELETE CASCADE,
    unit_id TEXT NOT NULL REFERENCES unit_kerja(id) ON DELETE CASCADE,
    unit_name VARCHAR(255) NOT NULL,
    kode_laci VARCHAR(50) NOT NULL, -- 'LACI-A', 'LACI-B', etc.
    nama_laci VARCHAR(255) NOT NULL,
    deskripsi_tugas TEXT NOT NULL,
    kategori_job VARCHAR(50) NOT NULL, -- 'Perencanaan', 'Pelaksanaan', 'Evaluasi', 'Pelaporan'
    format_wajib TEXT[] DEFAULT ARRAY['pdf', 'link'],
    deadline DATE,
    is_mandatory BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'kosong' CHECK (status IN ('kosong', 'menunggu_verifikasi', 'disetujui', 'revisi')),
    catatan_super_admin TEXT,
    verified_by VARCHAR(255),
    verified_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabel Berkas di Dalam Laci
CREATE TABLE IF NOT EXISTS berkas_laci (
    id TEXT PRIMARY KEY,
    laci_id TEXT NOT NULL REFERENCES laci_unit(id) ON DELETE CASCADE,
    unit_id TEXT NOT NULL REFERENCES unit_kerja(id) ON DELETE CASCADE,
    nama_file VARCHAR(255) NOT NULL,
    file_url TEXT,
    link_external TEXT, -- Tautan Google Drive / Cloud Eksternal
    ukuran_file VARCHAR(50) NOT NULL DEFAULT '2.4 MB',
    tipe_file VARCHAR(50) NOT NULL CHECK (tipe_file IN ('pdf', 'excel', 'word', 'image', 'link')),
    versi VARCHAR(20) DEFAULT 'v1.0',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by VARCHAR(255) NOT NULL,
    uploaded_by_user_id TEXT NOT NULL,
    catatan_pengirim TEXT
);

-- 5. Tabel Audit Logs / Trail
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL, -- 'UPLOAD_BERKAS_LACI', 'APPROVAL_LACI', 'REVISI_LACI'
    entity VARCHAR(100) NOT NULL,
    entity_id TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address VARCHAR(50),
    details TEXT NOT NULL
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) - ISOLASI PRIVASI (ANTI-NYONTEK)
-- ==========================================================

-- Aktifkan RLS pada tabel berkas_laci
ALTER TABLE berkas_laci ENABLE ROW LEVEL SECURITY;

-- 1. Policy Super Admin / Kepala Sekolah / TPMPS: Master Key (Dapat melihat & mengedit semua berkas)
DROP POLICY IF EXISTS "Super Admin Full Access" ON berkas_laci;
CREATE POLICY "Super Admin Full Access" ON berkas_laci
    FOR ALL
    TO authenticated
    USING (
        auth.jwt() ->> 'role' IN ('admin', 'super_admin', 'kepala_sekolah', 'ketua_tpmps', 'anggota_tpmps')
    );

-- 2. Policy Unit Kerja: Hanya dapat melihat dan mengunggah berkas pada lemarinya sendiri (Anti-Nyontek)
DROP POLICY IF EXISTS "Unit Kerja Own Cabinet Access Only" ON berkas_laci;
CREATE POLICY "Unit Kerja Own Cabinet Access Only" ON berkas_laci
    FOR ALL
    TO authenticated
    USING (
        auth.jwt() ->> 'unit_id' = unit_id
    );
