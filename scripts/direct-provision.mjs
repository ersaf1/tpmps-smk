import pg from 'pg';
const { Client } = pg;

const url = 'postgresql://postgres.qmhtxkhvovajanyookta:ecapramavicky@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres';

const accounts = [
  { email: 'admin@smkn2magelang.sch.id', fullName: 'Administrator SINTESA', position: 'Superadmin', role: 'superadmin' },
  { email: 'admin.sintesa@smkn2magelang.sch.id', fullName: 'Administrator SINTESA (Alias)', position: 'Superadmin', role: 'superadmin' },
  { email: 'vickky.listyaningsih@smkn2magelang.sch.id', fullName: 'Vickky Listyaningsih, M.Kom.', position: 'Ketua TPMPS', role: 'ketua_tpmps' },
  { email: 'tpmps.ketua@smkn2magelang.sch.id', fullName: 'Vickky Listyaningsih, M.Kom. (Alias)', position: 'Ketua TPMPS', role: 'ketua_tpmps' },
  { email: 'kurniawan.basuki@smkn2magelang.sch.id', fullName: 'Kurniawan Basuki, S.Pd., M.T.', position: 'Kepala Sekolah', role: 'kepala_sekolah' },
  { email: 'kepala.sekolah@smkn2magelang.sch.id', fullName: 'Kurniawan Basuki, S.Pd., M.T. (Alias)', position: 'Kepala Sekolah', role: 'kepala_sekolah' },
  { email: 'gigih.murniati@smkn2magelang.sch.id', fullName: 'Dra. Gigih Murniati', position: 'Ka. Renbang', role: 'ketua_unit', unitCode: 'RENBANG' },
  { email: 'yuana.dwi.utami@smkn2magelang.sch.id', fullName: 'Yuana Dwi Utami, S.Pd.', position: 'WKS 1', role: 'ketua_unit', unitCode: 'WKS-1' },
  { email: 'kurikulum@smkn2magelang.sch.id', fullName: 'Yuana Dwi Utami, S.Pd. (Alias WKS-1)', position: 'WKS 1', role: 'ketua_unit', unitCode: 'WKS-1' },
  { email: 'agus.supriyanto@smkn2magelang.sch.id', fullName: 'Drs. Agus Supriyanto', position: 'WKS 2', role: 'ketua_unit', unitCode: 'WKS-2' },
  { email: 'may.wilasih@smkn2magelang.sch.id', fullName: 'May Wilasih, S.Pd.', position: 'WKS 3', role: 'ketua_unit', unitCode: 'WKS-3' },
  { email: 'antuk.madiyanto@smkn2magelang.sch.id', fullName: 'Antuk Madiyanto, S.Pd.', position: 'WKS 4', role: 'ketua_unit', unitCode: 'WKS-4' },
  { email: 'cicilia.nugrahanti@smkn2magelang.sch.id', fullName: 'Cicilia Nugrahanti, S.Pd.', position: 'Kaproli AKL', role: 'ketua_unit', unitCode: 'AKL' },
  { email: 'purwaningsri@smkn2magelang.sch.id', fullName: 'Purwaningsri, S.Pd., M.M.', position: 'Kaproli MPLB', role: 'ketua_unit', unitCode: 'MPLB' },
  { email: 'fieka.praditaliana@smkn2magelang.sch.id', fullName: 'Fieka Praditaliana, S.Pd.', position: 'Kaproli PM', role: 'ketua_unit', unitCode: 'PM' },
  { email: 'arifin.andi.gunawan@smkn2magelang.sch.id', fullName: 'Arifin Andi Gunawan, S.Kom.', position: 'Kaproli PPLG', role: 'ketua_unit', unitCode: 'PPLG' },
  { email: 'mugi.rahayu@smkn2magelang.sch.id', fullName: 'Mugi Rahayu, S.Pd., M.Pd.', position: 'Ka. Umum', role: 'ketua_unit', unitCode: 'UMUM' },
  { email: 'murtiningsih@smkn2magelang.sch.id', fullName: 'Murtiningsih, S.Pd., M.Pd.', position: 'Ka. TU', role: 'ketua_unit', unitCode: 'TU' },
  { email: 'esti.zunastiti@smkn2magelang.sch.id', fullName: 'Esti Zunastiti, S.Pd.', position: 'Ka. BK', role: 'ketua_unit', unitCode: 'BK' },
  { email: 'anggraini.kusumawardani@smkn2magelang.sch.id', fullName: 'Anggraini Kusumawardani, S.Pd.', position: 'Ka. BKK', role: 'ketua_unit', unitCode: 'BKK' },
  { email: 'wiwik.pristiwati@smkn2magelang.sch.id', fullName: 'Dra. Wiwik Pristiwati', position: 'Ka. Perpustakaan', role: 'ketua_unit', unitCode: 'PERPUS' },
  { email: 'yunus.adi.wibowo@smkn2magelang.sch.id', fullName: 'Yunus Adi Wibowo, S.Kom.', position: 'Ka. Lab', role: 'ketua_unit', unitCode: 'LAB' },
  { email: 'tri.djoko@smkn2magelang.sch.id', fullName: 'Tri Djoko, S.Pd.', position: 'Ka. Usman', role: 'ketua_unit', unitCode: 'USMAN' }
];

async function provision() {
  console.log('Connecting to database...');
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();

  console.log('Ensuring pgcrypto extension...');
  await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');

  console.log('Fetching document_units mapping...');
  const unitsRes = await client.query('SELECT id, code FROM public.document_units;');
  const unitMap = new Map(unitsRes.rows.map(r => [r.code, r.id]));

  const password = 'Sintesa2026!';
  console.log(`Setting password "${password}" for all accounts...`);

  for (const acc of accounts) {
    const unitId = acc.unitCode ? unitMap.get(acc.unitCode) : null;

    // Check if user exists in auth.users
    const checkRes = await client.query('SELECT id FROM auth.users WHERE lower(email) = lower($1)', [acc.email]);

    let userId;
    if (checkRes.rows.length === 0) {
      // Insert new user into auth.users
      const insertUserRes = await client.query(`
        INSERT INTO auth.users (
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
          confirmation_token,
          email_change,
          email_change_token_new,
          recovery_token
        ) VALUES (
          '00000000-0000-0000-0000-000000000000',
          gen_random_uuid(),
          'authenticated',
          'authenticated',
          $1::text,
          crypt($2::text, gen_salt('bf', 10)),
          now(),
          jsonb_build_object('provider', 'email', 'providers', array['email'], 'role', $3::text),
          jsonb_build_object('full_name', $4::text, 'position', $5::text, 'unit_code', $6::text),
          now(),
          now(),
          '',
          '',
          '',
          ''
        ) RETURNING id;
      `, [acc.email, password, acc.role, acc.fullName, acc.position, acc.unitCode || null]);
      userId = insertUserRes.rows[0].id;
      console.log(`[CREATED] auth.users: ${acc.email} (${userId})`);
    } else {
      userId = checkRes.rows[0].id;
      // Update existing user password and metadata
      await client.query(`
        UPDATE auth.users
        SET
          encrypted_password = crypt($2::text, gen_salt('bf', 10)),
          email_confirmed_at = COALESCE(email_confirmed_at, now()),
          raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('provider', 'email', 'providers', array['email'], 'role', $3::text),
          raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('full_name', $4::text, 'position', $5::text, 'unit_code', $6::text),
          updated_at = now()
        WHERE id = $1;
      `, [userId, password, acc.role, acc.fullName, acc.position, acc.unitCode || null]);
      console.log(`[UPDATED] auth.users password: ${acc.email} (${userId})`);
    }

    // Upsert into public.profiles
    await client.query(`
      INSERT INTO public.profiles (
        id,
        email,
        full_name,
        position_name,
        role,
        unit_id,
        is_active,
        must_change_password,
        created_at,
        updated_at
      ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5::public.document_role,
        $6,
        true,
        false,
        now(),
        now()
      )
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        position_name = EXCLUDED.position_name,
        role = EXCLUDED.role,
        unit_id = EXCLUDED.unit_id,
        is_active = true,
        must_change_password = false,
        updated_at = now();
    `, [userId, acc.email, acc.fullName, acc.position, acc.role, unitId]);
    console.log(`  -> [SYNCED] public.profiles for ${acc.email}`);
  }

  console.log('\nAll accounts have been provisioned directly into Supabase Auth & Profiles successfully!');
  await client.end();
}

provision().catch(console.error);
