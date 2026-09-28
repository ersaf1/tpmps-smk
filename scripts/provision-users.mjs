import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEFAULT_PASSWORD = process.env.INITIAL_USER_PASSWORD || 'Sintesa2026!';

if (!url || !serviceRoleKey) {
  console.error('\n[ERROR] NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib tersedia.');
  console.info('Tip: Jika service-role key belum tersedia di .env lokal, Anda dapat menggunakan script SQL di:');
  console.info('     supabase/provision_19_accounts.sql langsung di SQL Editor Supabase Dashboard.\n');
  process.exit(1);
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export const accounts = [
  { email: 'admin@smkn2magelang.sch.id', fullName: 'Administrator SINTESA', position: 'Superadmin', role: 'superadmin' },
  { email: 'vickky.listyaningsih@smkn2magelang.sch.id', fullName: 'Vickky Listyaningsih, M.Kom.', position: 'Ketua TPMPS', role: 'ketua_tpmps' },
  { email: 'kurniawan.basuki@smkn2magelang.sch.id', fullName: 'Kurniawan Basuki, S.Pd., M.T.', position: 'Kepala Sekolah', role: 'kepala_sekolah' },
  { email: 'gigih.murniati@smkn2magelang.sch.id', fullName: 'Dra. Gigih Murniati', position: 'Ka. Renbang', role: 'ketua_unit', unitCode: 'RENBANG' },
  { email: 'yuana.dwi.utami@smkn2magelang.sch.id', fullName: 'Yuana Dwi Utami, S.Pd.', position: 'WKS 1', role: 'ketua_unit', unitCode: 'WKS-1' },
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

async function provisionUsers() {
  console.log(`\n=== Memulai Provisioning 19 Akun Resmi SINTESA TPMPS ===`);
  console.log(`Kata sandi default yang ditetapkan: "${DEFAULT_PASSWORD}"\n`);

  let unitIds = new Map();
  try {
    const { data: units, error: unitsError } = await admin.from('document_units').select('id, code');
    if (!unitsError && units) {
      unitIds = new Map(units.map((unit) => [unit.code, unit.id]));
    }
  } catch (err) {
    console.warn('[INFO] Tabel document_units belum terbaca, melanjutkan konfigurasi auth...');
  }

  const existingUsers = [];
  for (let page = 1; ; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    existingUsers.push(...data.users);
    if (data.users.length < 1000) break;
  }

  const results = [];

  for (const account of accounts) {
    let user = existingUsers.find((item) => item.email?.toLowerCase() === account.email.toLowerCase());

    if (!user) {
      // Buat akun baru di Supabase Auth
      const { data, error } = await admin.auth.admin.createUser({
        email: account.email,
        password: DEFAULT_PASSWORD,
        email_confirm: true,
        app_metadata: { role: account.role },
        user_metadata: {
          full_name: account.fullName,
          position: account.position,
          unit_code: account.unitCode || null
        }
      });
      if (error) {
        console.error(`[ERROR] Gagal membuat ${account.email}: ${error.message}`);
        continue;
      }
      user = data.user;
      results.push({ email: account.email, nama: account.fullName, status: 'BARU DIBUAT', password: DEFAULT_PASSWORD });
    } else {
      // Perbarui / reset password akun yang sudah ada ke kata sandi seragam
      const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
        password: DEFAULT_PASSWORD,
        email_confirm: true,
        app_metadata: { role: account.role },
        user_metadata: {
          full_name: account.fullName,
          position: account.position,
          unit_code: account.unitCode || null
        }
      });
      if (updateError) {
        console.error(`[ERROR] Gagal memperbarui ${account.email}: ${updateError.message}`);
        continue;
      }
      results.push({ email: account.email, nama: account.fullName, status: 'PASSWORD DIPERBARUI', password: DEFAULT_PASSWORD });
    }

    // Upsert profil di tabel profiles jika skema tersedia
    try {
      const unitId = account.unitCode ? unitIds.get(account.unitCode) : null;
      const profile = {
        id: user.id,
        email: account.email,
        full_name: account.fullName,
        position_name: account.position,
        role: account.role,
        ...(unitId ? { unit_id: unitId } : {}),
        is_active: true,
        must_change_password: false
      };
      await admin.from('profiles').upsert(profile, { onConflict: 'id' });
    } catch {
      // Abaikan jika tabel profiles belum dibuat
    }
  }

  console.table(results);
  console.log(`\n[SELESAI] Seluruh 19 akun berhasil disinkronisasi.`);
  console.log(`Semua akun dapat login menggunakan kata sandi: ${DEFAULT_PASSWORD}\n`);
}

provisionUsers().catch((err) => {
  console.error('[FATAL ERROR]:', err);
  process.exit(1);
});
