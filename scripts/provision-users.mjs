import { randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib tersedia.');
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const accounts = [
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

const { data: units, error: unitsError } = await admin.from('document_units').select('id, code');
if (unitsError) throw unitsError;
const unitIds = new Map(units.map((unit) => [unit.code, unit.id]));

const existingUsers = [];
for (let page = 1; ; page += 1) {
  const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
  if (error) throw error;
  existingUsers.push(...data.users);
  if (data.users.length < 1000) break;
}

const credentials = [];
for (const account of accounts) {
  let user = existingUsers.find((item) => item.email?.toLowerCase() === account.email);
  let temporaryPassword;
  if (!user) {
    temporaryPassword = `Smk2!${randomBytes(9).toString('base64url')}`;
    const { data, error } = await admin.auth.admin.createUser({
      email: account.email,
      password: temporaryPassword,
      email_confirm: true,
      app_metadata: { role: account.role }
    });
    if (error) throw new Error(`${account.email}: ${error.message}`);
    user = data.user;
  }

  const unitId = account.unitCode ? unitIds.get(account.unitCode) : null;
  if (account.unitCode && !unitId) throw new Error(`Unit ${account.unitCode} tidak ditemukan.`);
  const profile = {
    id: user.id,
    email: account.email,
    full_name: account.fullName,
    position_name: account.position,
    role: account.role,
    unit_id: unitId,
    is_active: true,
    ...(temporaryPassword ? { must_change_password: true } : {})
  };
  const { error: profileError } = await admin.from('profiles').upsert(profile, { onConflict: 'id' });
  if (profileError) throw new Error(`${account.email}: ${profileError.message}`);
  if (temporaryPassword) credentials.push({ name: account.fullName, email: account.email, temporaryPassword });
}

if (credentials.length) {
  console.table(credentials);
  console.log('Simpan kredensial sementara di password manager lalu hapus dari riwayat terminal.');
} else {
  console.log('Semua 19 akun sudah tersedia; tidak ada password yang diubah.');
}
