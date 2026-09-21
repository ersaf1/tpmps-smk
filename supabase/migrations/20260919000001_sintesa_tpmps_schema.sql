-- ==============================================================================
-- SINTESA TPMPS: Sistem Informasi Manajemen Penjaminan Mutu Pendidikan Sekolah
-- Database Schema & Row Level Security (RLS) Policies
-- SMK Negeri 2 Magelang - "Swadaya Bhina Raharja"
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS
CREATE TYPE user_role_type AS ENUM ('admin', 'kepala_sekolah', 'tpmps', 'guru');
CREATE TYPE unit_category_type AS ENUM ('Manajemen', 'Kejuruan', 'Layanan', 'Pengawasan');
CREATE TYPE eval_status_type AS ENUM ('Draft', 'Diajukan', 'Direview', 'Disetujui', 'Perlu Revisi');
CREATE TYPE doc_status_type AS ENUM ('Menunggu Review', 'Terverifikasi', 'Perlu Revisi', 'Ditolak');
CREATE TYPE rtl_status_type AS ENUM ('Direncanakan', 'Sedang Berjalan', 'Selesai', 'Dievaluasi', 'Tertunda');
CREATE TYPE priority_type AS ENUM ('Tinggi', 'Sedang', 'Rendah');

-- 3. ROLES TABLE
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code user_role_type NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    module VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ROLE_PERMISSIONS TABLE (M:N)
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 6. UNITS (18 UNIT KERJA SMK NEGERI 2 MAGELANG)
CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    category unit_category_type NOT NULL DEFAULT 'Manajemen',
    pic_name VARCHAR(150),
    email VARCHAR(150),
    phone VARCHAR(50),
    score NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. USERS PROFILE TABLE (EXTENDS SUPABASE AUTH.USERS)
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

-- 8. STANDARDS (8 STANDAR NASIONAL PENDIDIKAN)
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

-- 9. EVALUATIONS (EVALUASI MUTU INTERNAL)
CREATE TABLE IF NOT EXISTS public.evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    standard_id INT NOT NULL REFERENCES public.standards(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
    periode VARCHAR(50) NOT NULL,
    indikator_code VARCHAR(50) NOT NULL,
    indikator_name TEXT NOT NULL,
    nilai_mandiri NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    nilai_verifikasi NUMERIC(5,2),
    status eval_status_type NOT NULL DEFAULT 'Draft',
    catatan_unit TEXT,
    catatan_reviewer TEXT,
    reviewer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. DOCUMENTS (BANK BUKTI FISIK & ARSIP MUTU)
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

-- 11. EVIDENCE (RELASI MANY-TO-MANY EVALUATIONS & DOCUMENTS)
CREATE TABLE IF NOT EXISTS public.evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_id UUID NOT NULL REFERENCES public.evaluations(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(evaluation_id, document_id)
);

-- 12. RTL_PROGRAM (RENCANA TINDAK LANJUT MUTU)
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

-- 13. ACTIVITY_LOGS (IMMUTABLE AUDIT TRAIL)
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

-- 14. TRIGGERS UNTUK AUTO UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_units_updated_at BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_standards_updated_at BEFORE UPDATE ON public.standards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_evaluations_updated_at BEFORE UPDATE ON public.evaluations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_rtl_updated_at BEFORE UPDATE ON public.rtl_program FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 15. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

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

-- Helper function untuk mendapatkan kode role user yang sedang terautentikasi
CREATE OR REPLACE FUNCTION auth.current_user_role()
RETURNS VARCHAR AS $$
    SELECT r.code::VARCHAR
    FROM public.users u
    JOIN public.roles r ON u.role_id = r.id
    WHERE u.id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper function untuk mendapatkan unit kerja user yang sedang terautentikasi
CREATE OR REPLACE FUNCTION auth.current_user_unit()
RETURNS UUID AS $$
    SELECT u.unit_id
    FROM public.users u
    WHERE u.id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- RLS: ROLES, PERMISSIONS, STANDARDS & UNITS (Read by authenticated, Managed by Admin)
CREATE POLICY "Public authenticated can read roles" ON public.roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage roles" ON public.roles FOR ALL TO authenticated USING (auth.current_user_role() = 'admin');

CREATE POLICY "Public authenticated can read units" ON public.units FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage units" ON public.units FOR ALL TO authenticated USING (auth.current_user_role() = 'admin');

CREATE POLICY "Public authenticated can read standards" ON public.standards FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin and TPMPS can update standards" ON public.standards FOR UPDATE TO authenticated USING (auth.current_user_role() IN ('admin', 'tpmps'));

-- RLS: USERS
CREATE POLICY "Users can read all user profiles" ON public.users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Admin can manage all users" ON public.users FOR ALL TO authenticated USING (auth.current_user_role() = 'admin');

-- RLS: EVALUATIONS
CREATE POLICY "Authenticated users can read evaluations" ON public.evaluations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin and TPMPS can manage evaluations" ON public.evaluations FOR ALL TO authenticated USING (auth.current_user_role() IN ('admin', 'tpmps'));
CREATE POLICY "Guru/Unit can insert evaluations for own unit" ON public.evaluations FOR INSERT TO authenticated WITH CHECK (unit_id = auth.current_user_unit());
CREATE POLICY "Guru/Unit can update draft evaluations for own unit" ON public.evaluations FOR UPDATE TO authenticated USING (unit_id = auth.current_user_unit() AND status IN ('Draft', 'Perlu Revisi'));

-- RLS: DOCUMENTS
CREATE POLICY "Authenticated users can read documents" ON public.documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin and TPMPS can manage all documents" ON public.documents FOR ALL TO authenticated USING (auth.current_user_role() IN ('admin', 'tpmps'));
CREATE POLICY "Users can insert documents for own unit" ON public.documents FOR INSERT TO authenticated WITH CHECK (unit_id = auth.current_user_unit() OR auth.current_user_role() IN ('admin', 'tpmps'));
CREATE POLICY "Users can update own unverified documents" ON public.documents FOR UPDATE TO authenticated USING (uploaded_by = auth.uid() AND status = 'Menunggu Review');

-- RLS: EVIDENCE
CREATE POLICY "Authenticated can read evidence" ON public.evidence FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authorized can manage evidence" ON public.evidence FOR ALL TO authenticated USING (auth.current_user_role() IN ('admin', 'tpmps', 'guru'));

-- RLS: RTL_PROGRAM
CREATE POLICY "Authenticated users can read RTL" ON public.rtl_program FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin and TPMPS can manage RTL" ON public.rtl_program FOR ALL TO authenticated USING (auth.current_user_role() IN ('admin', 'tpmps'));
CREATE POLICY "Unit PIC can update RTL progress" ON public.rtl_program FOR UPDATE TO authenticated USING (unit_id = auth.current_user_unit() OR pj_user_id = auth.uid());

-- RLS: ACTIVITY_LOGS (Immutable, only Insert & Select)
CREATE POLICY "Admin, Kepsek, TPMPS can read activity logs" ON public.activity_logs FOR SELECT TO authenticated USING (auth.current_user_role() IN ('admin', 'kepala_sekolah', 'tpmps'));
CREATE POLICY "Authenticated can insert activity logs" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (true);

-- ==============================================================================
-- 16. SEED DATA INISIAL (8 STANDAR NASIONAL PENDIDIKAN & ROLES)
-- ==============================================================================

INSERT INTO public.roles (code, name, description) VALUES
('admin', 'Administrator Sistem', 'Akses penuh kontrol sistem, manajemen hak akses, dan konfigurasi database'),
('kepala_sekolah', 'Kepala Sekolah', 'Akses eksekutif monitoring capaian 8 SNP, laporan akhir, dan persetujuan kebijakan mutu'),
('tpmps', 'Tim Penjamin Mutu Pendidikan Sekolah', 'Pengelola siklus PPEPP, verifikasi berkas bukti fisik, validasi evaluasi, dan manajemen RTL'),
('guru', 'Pendidik / Unit Kerja', 'Penginput instrumen evaluasi mandiri unit dan pengunggah berkas bukti dokumen')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.standards (id, code, name, description, weight, target_score, current_score, icon) VALUES
(1, 'SNP-1', 'Standar Kompetensi Lulusan', 'Capaian kualifikasi kemampuan lulusan mencakup sikap, pengetahuan, dan keterampilan kejuruan vokasi', 15.00, 95.00, 88.50, 'GraduationCap'),
(2, 'SNP-2', 'Standar Isi', 'Ruang lingkup materi pembelajaran, struktur kurikulum merdeka SMK, dan keselarasan dengan IDUKA', 12.50, 92.00, 86.00, 'BookOpen'),
(3, 'SNP-3', 'Standar Proses', 'Pelaksanaan pembelajaran interaktif, Teaching Factory (TEFA), Praktik Kerja Lapangan (PKL), dan modul ajar', 15.00, 94.00, 84.50, 'Activity'),
(4, 'SNP-4', 'Standar Penilaian Pendidikan', 'Mekanisme asesmen diagnostik, formatif, sumatif, Uji Kompetensi Keahlian (UKK), dan sertifikasi LSP-P1', 12.50, 95.00, 89.20, 'CheckSquare'),
(5, 'SNP-5', 'Standar Pendidik dan Tenaga Kependidikan', 'Kualifikasi akademik, sertifikasi pendidik, sertifikat asesor kompetensi, dan kompetensi manajerial tendik', 15.00, 90.00, 81.80, 'Users'),
(6, 'SNP-6', 'Standar Sarana dan Prasarana', 'Ketersediaan bengkel praktik kejuruan, laboratorium komputer, rasio alat praktik, dan lingkungan belajar K3', 10.00, 90.00, 78.40, 'Building2'),
(7, 'SNP-7', 'Standar Pengelolaan', 'Perencanaan program kerja SMK, kemitraan strategis DUDI, sistem informasi manajemen, dan kepemimpinan', 10.00, 95.00, 91.00, 'Layers'),
(8, 'SNP-8', 'Standar Pembiayaan', 'Alokasi dana BOS, BOP SMK, transparansi anggaran, akuntabilitas RKAS, dan investasi sarana kejuruan', 10.00, 95.00, 87.60, 'BadgePercent')
ON CONFLICT (id) DO NOTHING;

-- 17. SUPABASE STORAGE BUCKET CONFIGURATION (JIKA DIDUKUNG)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('sintesa-evidence', 'sintesa-evidence', false)
ON CONFLICT (id) DO NOTHING;
