-- ==============================================================================
-- SIGMA TPMPS: Sistem Informasi Manajemen Penjaminan Mutu Pendidikan Sekolah
-- ALL-IN-ONE PRODUCTION DATABASE SCHEMA & INITIALIZATION SCRIPT
-- Institusi: SMK Negeri 2 Magelang ("Swadaya Bhina Raharja")
-- Database: Supabase PostgreSQL
-- ==============================================================================
-- Petunjuk:
-- 1. Buka Supabase Dashboard -> SQL Editor -> New Query.
-- 2. Salin dan tempel SELURUH skrip ini.
-- 3. Klik tombol "RUN".
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 2. CUSTOM ENUMS & DATA TYPES
-- ------------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('admin', 'kepala_sekolah', 'tpmps', 'guru');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE unit_category_type AS ENUM ('Manajemen', 'Kejuruan', 'Layanan', 'Pengawasan');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE eval_status_type AS ENUM ('Draft', 'Diajukan', 'Direview', 'Disetujui', 'Perlu Revisi');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE doc_status_type AS ENUM ('Menunggu Review', 'Terverifikasi', 'Perlu Revisi', 'Ditolak');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE rtl_status_type AS ENUM ('Direncanakan', 'Sedang Berjalan', 'Selesai', 'Dievaluasi', 'Tertunda');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE priority_type AS ENUM ('Tinggi', 'Sedang', 'Rendah');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ------------------------------------------------------------------------------
-- 3. TABEL: ROLES (Peran Pengguna Berbasis RBAC)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code user_role_type NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. TABEL: PERMISSIONS (Hak Akses Granular Sistem)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    module VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. TABEL: ROLE_PERMISSIONS (Pivot M:N Antara Roles & Permissions)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- ------------------------------------------------------------------------------
-- 6. TABEL: UNITS (18 Unit Kerja SMK Negeri 2 Magelang)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    category unit_category_type NOT NULL DEFAULT 'Manajemen',
    pic_name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(50),
    score NUMERIC(5,2) DEFAULT 0.00,
    total_indicators INT DEFAULT 0,
    completed_indicators INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. TABEL: USERS (Profil Terintegrasi Supabase Auth)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nip VARCHAR(50) UNIQUE,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
    unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
    avatar_url TEXT,
    phone VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. TABEL: STANDARDS (8 Standar Nasional Pendidikan)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.standards (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    weight NUMERIC(5,2) NOT NULL DEFAULT 12.50,
    target_score NUMERIC(5,2) NOT NULL DEFAULT 95.00,
    current_score NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    icon VARCHAR(50) DEFAULT 'Award',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. TABEL: EVALUATIONS (Instrumen Evaluasi Mutu Internal SPMI)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    standard_id INT NOT NULL REFERENCES public.standards(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
    periode VARCHAR(50) NOT NULL,
    indikator_code VARCHAR(50) NOT NULL,
    indikator_name TEXT NOT NULL,
    nilai_mandiri NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (nilai_mandiri >= 0 AND nilai_mandiri <= 100),
    nilai_verifikasi NUMERIC(5,2) CHECK (nilai_verifikasi >= 0 AND nilai_verifikasi <= 100),
    status eval_status_type NOT NULL DEFAULT 'Draft',
    catatan_unit TEXT,
    catatan_reviewer TEXT,
    reviewer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. TABEL: DOCUMENTS (Bank Bukti Fisik Digital & Arsip Dokumen Mutu)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size VARCHAR(50),
    file_type VARCHAR(50) NOT NULL,
    standard_id INT NOT NULL REFERENCES public.standards(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
    version VARCHAR(20) DEFAULT 'v1.0',
    status doc_status_type NOT NULL DEFAULT 'Menunggu Review',
    notes TEXT,
    uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. TABEL: EVIDENCE (Pivot Relasi M:N Evaluasi Mutu dengan Dokumen Bukti)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_id UUID NOT NULL REFERENCES public.evaluations(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(evaluation_id, document_id)
);

-- ------------------------------------------------------------------------------
-- 12. TABEL: RTL_PROGRAM (Rencana Tindak Lanjut Pemenuhan Mutu)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rtl_program (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    standard_id INT NOT NULL REFERENCES public.standards(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
    evaluation_id UUID REFERENCES public.evaluations(id) ON DELETE SET NULL,
    program_name VARCHAR(255) NOT NULL,
    latar_belakang TEXT,
    target_kinerja TEXT NOT NULL,
    anggaran NUMERIC(15,2) DEFAULT 0.00,
    deadline DATE,
    progress INT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    priority priority_type NOT NULL DEFAULT 'Sedang',
    status rtl_status_type NOT NULL DEFAULT 'Direncanakan',
    pj_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    evaluasi_akhir TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 13. TABEL: ACTIVITY_LOGS (Immutable System Audit Trail)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_name VARCHAR(200) NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 14. PERFORMANCE INDEXES (Optimasi Pencarian & Foreign Keys)
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_nip ON public.users(nip);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON public.users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_unit_id ON public.users(unit_id);

CREATE INDEX IF NOT EXISTS idx_evaluations_code ON public.evaluations(code);
CREATE INDEX IF NOT EXISTS idx_evaluations_standard_id ON public.evaluations(standard_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_unit_id ON public.evaluations(unit_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_status ON public.evaluations(status);

CREATE INDEX IF NOT EXISTS idx_documents_code ON public.documents(code);
CREATE INDEX IF NOT EXISTS idx_documents_standard_id ON public.documents(standard_id);
CREATE INDEX IF NOT EXISTS idx_documents_unit_id ON public.documents(unit_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);

CREATE INDEX IF NOT EXISTS idx_rtl_code ON public.rtl_program(code);
CREATE INDEX IF NOT EXISTS idx_rtl_standard_id ON public.rtl_program(standard_id);
CREATE INDEX IF NOT EXISTS idx_rtl_unit_id ON public.rtl_program(unit_id);
CREATE INDEX IF NOT EXISTS idx_rtl_status ON public.rtl_program(status);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- ------------------------------------------------------------------------------
-- 15. DATABASE TRIGGERS: AUTO UPDATED_AT
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_units_updated_at ON public.units;
CREATE TRIGGER trg_units_updated_at BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_standards_updated_at ON public.standards;
CREATE TRIGGER trg_standards_updated_at BEFORE UPDATE ON public.standards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_evaluations_updated_at ON public.evaluations;
CREATE TRIGGER trg_evaluations_updated_at BEFORE UPDATE ON public.evaluations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_documents_updated_at ON public.documents;
CREATE TRIGGER trg_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_rtl_updated_at ON public.rtl_program;
CREATE TRIGGER trg_rtl_updated_at BEFORE UPDATE ON public.rtl_program FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 16. ROW LEVEL SECURITY (RLS) POLICIES & SECURITY FUNCTIONS
-- ------------------------------------------------------------------------------
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rtl_program ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper Function: Dapatkan Role Kode User yang Sedang Login
CREATE OR REPLACE FUNCTION auth.current_user_role()
RETURNS VARCHAR AS $$
    SELECT r.code::VARCHAR
    FROM public.users u
    JOIN public.roles r ON u.role_id = r.id
    WHERE u.id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper Function: Dapatkan Unit Kerja User yang Sedang Login
CREATE OR REPLACE FUNCTION auth.current_user_unit()
RETURNS UUID AS $$
    SELECT u.unit_id
    FROM public.users u
    WHERE u.id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- RLS: ROLES & PERMISSIONS
DROP POLICY IF EXISTS "Auth users can read roles" ON public.roles;
CREATE POLICY "Auth users can read roles" ON public.roles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin can manage roles" ON public.roles;
CREATE POLICY "Admin can manage roles" ON public.roles FOR ALL TO authenticated USING (auth.current_user_role() = 'admin');

-- RLS: UNITS (18 Unit Kerja)
DROP POLICY IF EXISTS "Auth users can read units" ON public.units;
CREATE POLICY "Auth users can read units" ON public.units FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin can manage units" ON public.units;
CREATE POLICY "Admin can manage units" ON public.units FOR ALL TO authenticated USING (auth.current_user_role() = 'admin');

-- RLS: STANDARDS (8 SNP)
DROP POLICY IF EXISTS "Auth users can read standards" ON public.standards;
CREATE POLICY "Auth users can read standards" ON public.standards FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin and TPMPS can update standards" ON public.standards;
CREATE POLICY "Admin and TPMPS can update standards" ON public.standards FOR UPDATE TO authenticated USING (auth.current_user_role() IN ('admin', 'tpmps'));

-- RLS: USERS
DROP POLICY IF EXISTS "Auth users can read user directory" ON public.users;
CREATE POLICY "Auth users can read user directory" ON public.users FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE TO authenticated USING (id = auth.uid());

DROP POLICY IF EXISTS "Admin can manage all users" ON public.users;
CREATE POLICY "Admin can manage all users" ON public.users FOR ALL TO authenticated USING (auth.current_user_role() = 'admin');

-- RLS: EVALUATIONS
DROP POLICY IF EXISTS "Auth users can read evaluations" ON public.evaluations;
CREATE POLICY "Auth users can read evaluations" ON public.evaluations FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin and TPMPS full evaluations" ON public.evaluations;
CREATE POLICY "Admin and TPMPS full evaluations" ON public.evaluations FOR ALL TO authenticated USING (auth.current_user_role() IN ('admin', 'tpmps'));

DROP POLICY IF EXISTS "Guru/Unit can insert for own unit" ON public.evaluations;
CREATE POLICY "Guru/Unit can insert for own unit" ON public.evaluations FOR INSERT TO authenticated WITH CHECK (unit_id = auth.current_user_unit());

DROP POLICY IF EXISTS "Guru/Unit can update draft for own unit" ON public.evaluations;
CREATE POLICY "Guru/Unit can update draft for own unit" ON public.evaluations FOR UPDATE TO authenticated USING (unit_id = auth.current_user_unit() AND status IN ('Draft', 'Perlu Revisi'));

-- RLS: DOCUMENTS
DROP POLICY IF EXISTS "Auth users can read documents" ON public.documents;
CREATE POLICY "Auth users can read documents" ON public.documents FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin and TPMPS full documents" ON public.documents;
CREATE POLICY "Admin and TPMPS full documents" ON public.documents FOR ALL TO authenticated USING (auth.current_user_role() IN ('admin', 'tpmps'));

DROP POLICY IF EXISTS "Unit can insert docs for own unit" ON public.documents;
CREATE POLICY "Unit can insert docs for own unit" ON public.documents FOR INSERT TO authenticated WITH CHECK (unit_id = auth.current_user_unit() OR auth.current_user_role() IN ('admin', 'tpmps'));

-- RLS: EVIDENCE
DROP POLICY IF EXISTS "Auth users can read evidence" ON public.evidence;
CREATE POLICY "Auth users can read evidence" ON public.evidence FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authorized can manage evidence" ON public.evidence;
CREATE POLICY "Authorized can manage evidence" ON public.evidence FOR ALL TO authenticated USING (auth.current_user_role() IN ('admin', 'tpmps', 'guru'));

-- RLS: RTL_PROGRAM
DROP POLICY IF EXISTS "Auth users can read RTL" ON public.rtl_program;
CREATE POLICY "Auth users can read RTL" ON public.rtl_program FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin and TPMPS full RTL" ON public.rtl_program;
CREATE POLICY "Admin and TPMPS full RTL" ON public.rtl_program FOR ALL TO authenticated USING (auth.current_user_role() IN ('admin', 'tpmps'));

DROP POLICY IF EXISTS "Unit can update own RTL progress" ON public.rtl_program;
CREATE POLICY "Unit can update own RTL progress" ON public.rtl_program FOR UPDATE TO authenticated USING (unit_id = auth.current_user_unit() OR pj_user_id = auth.uid());

-- RLS: ACTIVITY_LOGS
DROP POLICY IF EXISTS "Admin Kepsek TPMPS can read audit logs" ON public.activity_logs;
CREATE POLICY "Admin Kepsek TPMPS can read audit logs" ON public.activity_logs FOR SELECT TO authenticated USING (auth.current_user_role() IN ('admin', 'kepala_sekolah', 'tpmps'));

DROP POLICY IF EXISTS "Auth users can insert audit logs" ON public.activity_logs;
CREATE POLICY "Auth users can insert audit logs" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 17. SUPABASE STORAGE BUCKET CONFIGURATION
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'sigma-evidence', 
    'sigma-evidence', 
    false, 
    52428800, -- 50 MB
    ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Auth users can view evidence bucket" ON storage.objects;
CREATE POLICY "Auth users can view evidence bucket" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'sigma-evidence');

DROP POLICY IF EXISTS "Auth users can upload to evidence bucket" ON storage.objects;
CREATE POLICY "Auth users can upload to evidence bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'sigma-evidence');

-- ------------------------------------------------------------------------------
-- 18. SEED DATA RESMI: 4 ROLES SISTEM
-- ------------------------------------------------------------------------------
INSERT INTO public.roles (code, name, description) VALUES
('admin', 'Administrator Sistem', 'Akses kontrol penuh pengguna, pengaturan hak akses, pemeliharaan jejak audit, dan integritas database'),
('kepala_sekolah', 'Kepala Sekolah', 'Akses eksekutif pemantauan agregat 18 unit kerja, monitoring 8 SNP, dan persetujuan kebijakan mutu akhir'),
('tpmps', 'Tim Penjamin Mutu Pendidikan Sekolah (TPMPS)', 'Pengelola siklus PPEPP, validasi & verifikasi instrumen evaluasi, audit berkas bukti fisik, dan monitoring RTL'),
('guru', 'Pendidik / Unit Kerja', 'Penginput instrumen penilaian mandiri unit dan pengunggah dokumen bukti fisik pendukung')
ON CONFLICT (code) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 19. SEED DATA RESMI: 8 STANDAR NASIONAL PENDIDIKAN (SNP)
-- ------------------------------------------------------------------------------
INSERT INTO public.standards (id, code, name, description, weight, target_score, current_score, icon) VALUES
(1, 'SNP-1', 'Standar Kompetensi Lulusan', 'Capaian kualifikasi kemampuan lulusan mencakup sikap, pengetahuan, dan keterampilan kejuruan bersertifikasi BNSP', 15.00, 95.00, 88.50, 'Award'),
(2, 'SNP-2', 'Standar Isi', 'Ruang lingkup materi pembelajaran, struktur Kurikulum Merdeka SMK, dan keselarasan kurikulum bersama IDUKA', 12.50, 92.00, 86.00, 'BookOpen'),
(3, 'SNP-3', 'Standar Proses', 'Pelaksanaan pembelajaran berbasis proyek (PjBL), Teaching Factory (TEFA), Praktik Kerja Lapangan, dan modul ajar', 15.00, 94.00, 84.50, 'Activity'),
(4, 'SNP-4', 'Standar Penilaian Pendidikan', 'Mekanisme asesmen diagnostik, formatif, sumatif, Uji Kompetensi Keahlian (UKK), dan sertifikasi LSP-P1', 12.50, 95.00, 89.20, 'CheckSquare'),
(5, 'SNP-5', 'Standar Pendidik & Tenaga Kependidikan', 'Kualifikasi akademik, sertifikasi pendidik, sertifikat asesor kompetensi, dan kompetensi manajerial tendik', 15.00, 90.00, 81.80, 'Users'),
(6, 'SNP-6', 'Standar Sarana dan Prasarana', 'Ketersediaan bengkel kejuruan, workstation komputer, rasio alat praktik standar industri, dan keselamatan K3', 10.00, 90.00, 78.40, 'Building2'),
(7, 'SNP-7', 'Standar Pengelolaan', 'Tata kelola BLUD SMK, sistem penjaminan mutu SPMI, kemitraan strategis IDUKA, transparansi, dan kepemimpinan', 10.00, 95.00, 91.00, 'Layers'),
(8, 'SNP-8', 'Standar Pembiayaan', 'Optimalisasi dana BOS/BOP SMK, unit produksi TEFA, transparansi anggaran, dan akuntabilitas pelaporan RKAS', 10.00, 95.00, 87.60, 'BadgePercent')
ON CONFLICT (id) DO UPDATE SET
    weight = EXCLUDED.weight,
    target_score = EXCLUDED.target_score,
    current_score = EXCLUDED.current_score;

-- ------------------------------------------------------------------------------
-- 20. SEED DATA RESMI: 18 UNIT KERJA SMK NEGERI 2 MAGELANG
-- ------------------------------------------------------------------------------
INSERT INTO public.units (code, name, category, pic_name, email, score, total_indicators, completed_indicators) VALUES
('WKS-1', 'WKS 1 (Bidang Kurikulum)', 'Manajemen', 'Dra. Sri Wahyuni, M.Pd.', 'kurikulum@smkn2magelang.sch.id', 89.50, 24, 22),
('WKS-2', 'WKS 2 (Bidang Kesiswaan)', 'Manajemen', 'Bambang Sutrisno, S.Pd.', 'kesiswaan@smkn2magelang.sch.id', 86.00, 20, 18),
('WKS-3', 'WKS 3 (Bidang Sarana & Prasarana)', 'Manajemen', 'Ir. Agus Haryanto, M.T.', 'sarpras@smkn2magelang.sch.id', 78.40, 22, 16),
('WKS-4', 'WKS 4 (Hubungan Industri & Humas)', 'Manajemen', 'Drs. Hendro Wibowo', 'humas@smkn2magelang.sch.id', 92.00, 18, 17),
('WKS-SDM', 'Bidang Ketenagaan & SDM', 'Manajemen', 'Nurul Hidayati, S.Pd.', 'sdm@smkn2magelang.sch.id', 82.50, 16, 14),
('PROG-RPL', 'Program Keahlian PPLG / RPL', 'Kejuruan', 'Eko Prasetyo, S.Kom., M.Cs.', 'rpl@smkn2magelang.sch.id', 94.20, 28, 27),
('PROG-TKJ', 'Program Keahlian TJKT / TKJ', 'Kejuruan', 'Ahmad Fauzi, S.T.', 'tkj@smkn2magelang.sch.id', 91.00, 26, 24),
('PROG-AKL', 'Program Keahlian Akuntansi (AKL)', 'Kejuruan', 'Siti Rahmawati, S.E., M.Akt.', 'akl@smkn2magelang.sch.id', 88.00, 25, 22),
('PROG-OTKP', 'Program Keahlian Manajemen Perkantoran (MPLB)', 'Kejuruan', 'Dewi Lestari, S.Pd.', 'mplb@smkn2magelang.sch.id', 87.50, 24, 21),
('PROG-BDP', 'Program Keahlian Pemasaran (BDP)', 'Kejuruan', 'Rudi Hartono, S.E.', 'bdp@smkn2magelang.sch.id', 85.00, 22, 19),
('BENGKEL', 'Unit Pengelola Bengkel & Lab Komputer', 'Layanan', 'Supriyanto, A.Md.', 'lab@smkn2magelang.sch.id', 83.00, 15, 12),
('PERPUS', 'Unit Perpustakaan Digital', 'Layanan', 'Tri Utami, S.I.Pust.', 'perpustakaan@smkn2magelang.sch.id', 90.00, 14, 13),
('BKK', 'Bursa Kerja Khusus (BKK Magelang)', 'Layanan', 'Wahyu Nugroho, S.Pd.', 'bkk@smkn2magelang.sch.id', 93.50, 18, 17),
('BK', 'Unit Bimbingan Konseling (BK)', 'Layanan', 'Dra. Endang Sulastri', 'bk@smkn2magelang.sch.id', 89.00, 16, 15),
('TEFA', 'Unit Produksi & Teaching Factory (TEFA)', 'Kejuruan', 'Anwar Sadat, S.T.', 'tefa@smkn2magelang.sch.id', 86.80, 20, 17),
('LSP', 'Lembaga Sertifikasi Profesi (LSP-P1)', 'Pengawasan', 'Drs. Maryanto, M.M.', 'lsp@smkn2magelang.sch.id', 95.00, 22, 21),
('TU-KEU', 'Tata Usaha & Keuangan Sekolah', 'Layanan', 'Sri Mulyani, S.Ak.', 'tu@smkn2magelang.sch.id', 87.60, 18, 16),
('SPI', 'Satuan Pengawas Internal (SPI)', 'Pengawasan', 'H. Suwandi, S.Pd., M.M.', 'spi@smkn2magelang.sch.id', 92.50, 16, 15)
ON CONFLICT (code) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 21. SEED DATA RESMI: CONTOH EVALUASI MUTU INTERNAL
-- ------------------------------------------------------------------------------
INSERT INTO public.evaluations (code, standard_id, unit_id, periode, indikator_code, indikator_name, nilai_mandiri, nilai_verifikasi, status, catatan_unit, catatan_reviewer)
SELECT 
    'EV-2025-01', 
    1, 
    u.id, 
    'Semester Ganjil 2025/2026', 
    'SKL-1.1', 
    'Persentase kelulusan siswa yang memiliki sertifikat kompetensi BNSP pada skema KKNI Level II', 
    94.00, 
    92.50, 
    'Disetujui', 
    'Tercatat 92.5% siswa tingkat XII berhasil lulus uji skema LSP-P1 pada gelombang I.', 
    'Valid dan terbukti otentik dengan arsip sertifikasi LSP-P1.'
FROM public.units u WHERE u.code = 'LSP'
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.evaluations (code, standard_id, unit_id, periode, indikator_code, indikator_name, nilai_mandiri, nilai_verifikasi, status, catatan_unit, catatan_reviewer)
SELECT 
    'EV-2025-02', 
    2, 
    u.id, 
    'Semester Ganjil 2025/2026', 
    'ISI-2.1', 
    'Penyelarasan Kurikulum Operasional Satuan Pendidikan (KOSP) dengan minimal 5 Industri Mitra', 
    90.00, 
    88.00, 
    'Disetujui', 
    'MoU dan Berita Acara penyelarasan kurikulum bersama PT Telkom dan PT Astra telah rampung.', 
    'Disetujui. Rekomendasi: terus perluas mitra industri lokal Magelang.'
FROM public.units u WHERE u.code = 'WKS-1'
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.evaluations (code, standard_id, unit_id, periode, indikator_code, indikator_name, nilai_mandiri, nilai_verifikasi, status, catatan_unit, catatan_reviewer)
SELECT 
    'EV-2025-03', 
    6, 
    u.id, 
    'Semester Ganjil 2025/2026', 
    'SAR-6.2', 
    'Rasio ketersediaan perangkat PC workstation berstandar industri pada Laboratorium Rekayasa Perangkat Lunak', 
    75.00, 
    70.00, 
    'Perlu Revisi', 
    'Terdapat 8 unit PC di Lab RPL 2 yang mengalami penurunan performa hardware.', 
    'Diusulkan masuk dalam program RTL pengadaan dan peremajaan workstation RKAS.'
FROM public.units u WHERE u.code = 'WKS-3'
ON CONFLICT (code) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 22. SEED DATA RESMI: CONTOH BANK BUKTI FISIK DIGITAL
-- ------------------------------------------------------------------------------
INSERT INTO public.documents (code, title, file_name, file_url, file_size, file_type, standard_id, unit_id, version, status, notes)
SELECT 
    'DOC-SKL-001', 
    'SK Penetapan Kelulusan Uji Sertifikasi LSP-P1 Tahun 2025', 
    'SK_LSP_P1_Kelulusan_2025.pdf', 
    '/storage/documents/sk_lsp_p1_2025.pdf', 
    '3.4 MB', 
    'pdf', 
    1, 
    u.id, 
    'v1.0', 
    'Terverifikasi', 
    'SK resmi ditandatangani Kepala Sekolah & Dewan Pengarah LSP-P1.'
FROM public.units u WHERE u.code = 'LSP'
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.documents (code, title, file_name, file_url, file_size, file_type, standard_id, unit_id, version, status, notes)
SELECT 
    'DOC-ISI-002', 
    'Dokumen KOSP & Berita Acara Penyelarasan Kurikulum IDUKA', 
    'KOSP_Penyelarasan_Mitra_2025.pdf', 
    '/storage/documents/kosp_2025.pdf', 
    '8.1 MB', 
    'pdf', 
    2, 
    u.id, 
    'v2.1', 
    'Terverifikasi', 
    'Disertai daftar hadir perwakilan IDUKA dan modul ajar tersinkronisasi.'
FROM public.units u WHERE u.code = 'WKS-1'
ON CONFLICT (code) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 23. SEED DATA RESMI: CONTOH PROGRAM RTL (RENCANA TINDAK LANJUT)
-- ------------------------------------------------------------------------------
INSERT INTO public.rtl_program (code, standard_id, unit_id, program_name, latar_belakang, target_kinerja, anggaran, deadline, progress, priority, status)
SELECT 
    'RTL-2025-01', 
    6, 
    u.id, 
    'Pengadaan & Peremajaan Hardware Lab Komputer PPLG', 
    'Penurunan performa 8 workstation siswa saat kompilasi aplikasi mobile.', 
    '100% workstation Lab RPL memenuhi standar minimal RAM 16GB dan SSD NVMe.', 
    45000000.00, 
    '2025-11-30', 
    40, 
    'Tinggi', 
    'Sedang Berjalan'
FROM public.units u WHERE u.code = 'WKS-3'
ON CONFLICT (code) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 24. SEED DATA RESMI: JEJAK AUDIT SISTEM (ACTIVITY LOGS)
-- ------------------------------------------------------------------------------
INSERT INTO public.activity_logs (user_name, role_name, action, entity, entity_id, details, ip_address) VALUES
('Dra. Hj. Siti Fatimah, M.M.', 'KETUA TPMPS', 'APPROVAL_EVALUASI', 'Evaluasi Mutu', 'EV-2025-01', 'Menyetujui evaluasi ketercapaian sertifikasi kompetensi kejuruan dengan skor verifikasi 92.5%', '192.168.10.15'),
('Budi Santoso, S.Pd.', 'WKS KURIKULUM', 'UPLOAD_DOKUMEN', 'Bukti Dokumen', 'DOC-ISI-002', 'Mengunggah berkas: Dokumen KOSP & Berita Acara Penyelarasan Kurikulum IDUKA (8.1 MB)', '192.168.10.42'),
('Rian Prasetyo, S.Kom.', 'ADMIN SISTEM', 'SETUP_DATABASE', 'Sistem', 'SCHEMA-ALL-IN-ONE', 'Inisialisasi skema lengkap 11 tabel PostgreSQL Supabase dengan konfigurasi RLS dan trigger otomatis', '192.168.10.2');

-- ==============================================================================
-- SELESAI: DATABASE SIGMA TPMPS SIAP DIGUNAKAN DALAM MODE PRODUCTION!
-- ==============================================================================
