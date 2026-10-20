-- ==============================================================================
-- SKRIP PERGANTIAN PEJABAT (KEPALA SEKOLAH / KETUA TPMPS)
-- SINTESA TPMPS SMK
--
-- Petunjuk Penggunaan:
-- 1. Buka Supabase Dashboard di browser (https://supabase.com/dashboard)
-- 2. Pilih Project Anda -> Buka menu "SQL Editor"
-- 3. Sesuaikan variabel di bawah (v_role, v_old_email, v_new_email, v_new_name, v_new_password)
-- 4. Klik tombol "Run"
-- ==============================================================================

do $$
declare
  -- ---------------------------------------------------------------------------
  -- SESUAIKAN VARIABEL DI BAWAH INI:
  -- ---------------------------------------------------------------------------
  v_role         text := 'kepala_sekolah'; -- Opsi: 'kepala_sekolah' atau 'ketua_tpmps'
  v_old_email    text := 'kurniawan.basuki@smkn2magelang.sch.id'; -- Email pejabat lama yang akan dinonaktifkan
  v_new_email    text := 'kepsek.baru@smkn2magelang.sch.id';     -- Email login pejabat baru
  v_new_name     text := 'Nama Kepala Sekolah Baru, M.Pd.';     -- Nama lengkap & gelar pejabat baru
  v_new_password text := 'Sintesa2026!';                         -- Kata sandi akun baru (min. 12 karakter)

  -- Variabel internal
  v_new_user_id  uuid := gen_random_uuid();
  v_encrypted_pw text;
begin
  -- 1. Nonaktifkan akun pejabat lama di profil (riwayat arsip/file lama tetap aman)
  update tpmps.profiles
  set active = false
  where id in (
    select id from auth.users where lower(email) = lower(v_old_email)
  );

  -- 2. Enkripsi kata sandi baru
  v_encrypted_pw := crypt(v_new_password, gen_salt('bf'));

  -- 3. Daftarkan akun auth baru ke auth.users
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    v_new_user_id,
    'authenticated',
    'authenticated',
    v_new_email,
    v_encrypted_pw,
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', v_new_name),
    now(),
    now(),
    ''
  );

  -- 4. Daftarkan profil baru ke schema tpmps.profiles
  insert into tpmps.profiles (
    id,
    full_name,
    role,
    unit_id,
    active
  ) values (
    v_new_user_id,
    v_new_name,
    v_role,
    null, -- null untuk Kepala Sekolah dan Ketua TPMPS (bukan kepala unit kerja spesifik)
    true
  );

  raise notice 'Pejabat baru (%) berhasil didaftarkan dengan role (%) dan akun lama (%) telah dinonaktifkan.', 
    v_new_name, v_role, v_old_email;
end $$;
