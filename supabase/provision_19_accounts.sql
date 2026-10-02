-- ==============================================================================
-- PROVISION 19 AKUN RESMI SINTESA TPMPS KE SUPABASE AUTH & PROFILES
-- Password Seragam: Sintesa2026!
-- Petunjuk Penggunaan:
-- 1. Buka Supabase Dashboard di browser (https://supabase.com/dashboard)
-- 2. Pilih Project Anda -> Buka menu "SQL Editor"
-- 3. Tempelkan seluruh isi file ini lalu klik tombol "Run"
-- 4. Semua 19 akun akan dibuat / direset password-nya menjadi: Sintesa2026!
-- ==============================================================================

create extension if not exists pgcrypto;

do $$
declare
  v_default_pw text := 'Sintesa2026!';
  v_encrypted_pw text;
  v_user_id uuid;
  v_unit_id uuid;
  rec record;
begin
  v_encrypted_pw := crypt(v_default_pw, gen_salt('bf'));

  -- Temporary table berisi 19 akun resmi SMK Negeri 2 Magelang
  drop table if exists temp_accounts;
  create temp table temp_accounts (
    email text primary key,
    full_name text,
    position text,
    role text,
    unit_code text
  );

  insert into temp_accounts (email, full_name, position, role, unit_code) values
    ('admin@smkn2magelang.sch.id', 'Administrator SINTESA', 'Superadmin', 'superadmin', null),
    ('vickky.listyaningsih@smkn2magelang.sch.id', 'Vickky Listyaningsih, M.Kom.', 'Ketua TPMPS', 'ketua_tpmps', null),
    ('kurniawan.basuki@smkn2magelang.sch.id', 'Kurniawan Basuki, S.Pd., M.T.', 'Kepala Sekolah', 'kepala_sekolah', null),
    ('gigih.murniati@smkn2magelang.sch.id', 'Dra. Gigih Murniati', 'Ka. Renbang', 'ketua_unit', 'RENBANG'),
    ('yuana.dwi.utami@smkn2magelang.sch.id', 'Yuana Dwi Utami, S.Pd.', 'WKS 1', 'ketua_unit', 'WKS-1'),
    ('agus.supriyanto@smkn2magelang.sch.id', 'Drs. Agus Supriyanto', 'WKS 2', 'ketua_unit', 'WKS-2'),
    ('may.wilasih@smkn2magelang.sch.id', 'May Wilasih, S.Pd.', 'WKS 3', 'ketua_unit', 'WKS-3'),
    ('antuk.madiyanto@smkn2magelang.sch.id', 'Antuk Madiyanto, S.Pd.', 'WKS 4', 'ketua_unit', 'WKS-4'),
    ('cicilia.nugrahanti@smkn2magelang.sch.id', 'Cicilia Nugrahanti, S.Pd.', 'Kaproli AKL', 'ketua_unit', 'AKL'),
    ('purwaningsri@smkn2magelang.sch.id', 'Purwaningsri, S.Pd., M.M.', 'Kaproli MPLB', 'ketua_unit', 'MPLB'),
    ('fieka.praditaliana@smkn2magelang.sch.id', 'Fieka Praditaliana, S.Pd.', 'Kaproli PM', 'ketua_unit', 'PM'),
    ('arifin.andi.gunawan@smkn2magelang.sch.id', 'Arifin Andi Gunawan, S.Kom.', 'Kaproli PPLG', 'ketua_unit', 'PPLG'),
    ('mugi.rahayu@smkn2magelang.sch.id', 'Mugi Rahayu, S.Pd., M.Pd.', 'Ka. Umum', 'ketua_unit', 'UMUM'),
    ('murtiningsih@smkn2magelang.sch.id', 'Murtiningsih, S.Pd., M.Pd.', 'Ka. TU', 'ketua_unit', 'TU'),
    ('esti.zunastiti@smkn2magelang.sch.id', 'Esti Zunastiti, S.Pd.', 'Ka. BK', 'ketua_unit', 'BK'),
    ('anggraini.kusumawardani@smkn2magelang.sch.id', 'Anggraini Kusumawardani, S.Pd.', 'Ka. BKK', 'ketua_unit', 'BKK'),
    ('wiwik.pristiwati@smkn2magelang.sch.id', 'Dra. Wiwik Pristiwati', 'Ka. Perpustakaan', 'ketua_unit', 'PERPUS'),
    ('yunus.adi.wibowo@smkn2magelang.sch.id', 'Yunus Adi Wibowo, S.Kom.', 'Ka. Lab', 'ketua_unit', 'LAB'),
    ('tri.djoko@smkn2magelang.sch.id', 'Tri Djoko, S.Pd.', 'Ka. Usman', 'ketua_unit', 'USMAN');

  for rec in select * from temp_accounts loop
    -- 1. Cek apakah user sudah ada di auth.users
    select id into v_user_id from auth.users where lower(email) = lower(rec.email);

    if v_user_id is null then
      v_user_id := gen_random_uuid();
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
        v_user_id,
        'authenticated',
        'authenticated',
        rec.email,
        v_encrypted_pw,
        now(),
        jsonb_build_object('provider', 'email', 'providers', array['email'], 'role', rec.role),
        jsonb_build_object('full_name', rec.full_name, 'position', rec.position, 'unit_code', rec.unit_code),
        now(),
        now(),
        ''
      );
    else
      -- Update password dan metadata akun yang sudah ada
      update auth.users
      set
        encrypted_password = v_encrypted_pw,
        email_confirmed_at = coalesce(email_confirmed_at, now()),
        raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', rec.role),
        raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('full_name', rec.full_name, 'position', rec.position, 'unit_code', rec.unit_code),
        updated_at = now()
      where id = v_user_id;
    end if;

    -- 2. Dapatkan unit_id jika relasi document_units tersedia
    v_unit_id := null;
    if rec.unit_code is not null and exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'document_units') then
      select id into v_unit_id from public.document_units where code = rec.unit_code limit 1;
    end if;

    -- 3. Upsert ke public.profiles jika tabel profiles ada
    if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'profiles') then
      begin
        insert into public.profiles (
          id,
          email,
          full_name,
          position_name,
          role,
          unit_id,
          is_active,
          must_change_password
        ) values (
          v_user_id,
          rec.email,
          rec.full_name,
          rec.position,
          rec.role::text,
          v_unit_id,
          true,
          false
        )
        on conflict (id) do update set
          email = excluded.email,
          full_name = excluded.full_name,
          position_name = excluded.position_name,
          role = excluded.role,
          unit_id = coalesce(excluded.unit_id, public.profiles.unit_id),
          is_active = true,
          must_change_password = false;
      exception when others then
        -- Tangani jika ada variasi nama kolom profil
        null;
      end;
    end if;
  end loop;

  raise notice '19 Akun resmi SINTESA TPMPS berhasil diprovision. Kata sandi seragam: %', v_default_pw;
end $$;
