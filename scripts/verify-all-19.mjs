import { createClient } from '@supabase/supabase-js';

const url = 'https://qmhtxkhvovajanyookta.supabase.co';
const anonKey = 'sb_publishable_k8MbyJVhOzoluyZZb4n6Jw_lSM2SWH6';

const supabase = createClient(url, anonKey);

const accounts = [
  { no: 1, email: 'admin@smkn2magelang.sch.id', role: 'Superadmin', name: 'Administrator SINTESA' },
  { no: 2, email: 'vickky.listyaningsih@smkn2magelang.sch.id', role: 'Ketua TPMPS', name: 'Vickky Listyaningsih, M.Kom.' },
  { no: 3, email: 'kurniawan.basuki@smkn2magelang.sch.id', role: 'Kepala Sekolah', name: 'Kurniawan Basuki, S.Pd., M.T.' },
  { no: 4, email: 'gigih.murniati@smkn2magelang.sch.id', role: 'Ka. Renbang', name: 'Dra. Gigih Murniati' },
  { no: 5, email: 'yuana.dwi.utami@smkn2magelang.sch.id', role: 'WKS 1 Kurikulum', name: 'Yuana Dwi Utami, S.Pd.' },
  { no: 6, email: 'agus.supriyanto@smkn2magelang.sch.id', role: 'WKS 2 Kesiswaan', name: 'Drs. Agus Supriyanto' },
  { no: 7, email: 'may.wilasih@smkn2magelang.sch.id', role: 'WKS 3 Sarpras', name: 'May Wilasih, S.Pd.' },
  { no: 8, email: 'antuk.madiyanto@smkn2magelang.sch.id', role: 'WKS 4 Humas & Hubin', name: 'Antuk Madiyanto, S.Pd.' },
  { no: 9, email: 'cicilia.nugrahanti@smkn2magelang.sch.id', role: 'Kaproli AKL', name: 'Cicilia Nugrahanti, S.Pd.' },
  { no: 10, email: 'purwaningsri@smkn2magelang.sch.id', role: 'Kaproli MPLB', name: 'Purwaningsri, S.Pd., M.M.' },
  { no: 11, email: 'fieka.praditaliana@smkn2magelang.sch.id', role: 'Kaproli PM', name: 'Fieka Praditaliana, S.Pd.' },
  { no: 12, email: 'arifin.andi.gunawan@smkn2magelang.sch.id', role: 'Kaproli PPLG', name: 'Arifin Andi Gunawan, S.Kom.' },
  { no: 13, email: 'mugi.rahayu@smkn2magelang.sch.id', role: 'Ka. Umum', name: 'Mugi Rahayu, S.Pd., M.Pd.' },
  { no: 14, email: 'murtiningsih@smkn2magelang.sch.id', role: 'Ka. TU', name: 'Murtiningsih, S.Pd., M.Pd.' },
  { no: 15, email: 'esti.zunastiti@smkn2magelang.sch.id', role: 'Ka. BK', name: 'Esti Zunastiti, S.Pd.' },
  { no: 16, email: 'anggraini.kusumawardani@smkn2magelang.sch.id', role: 'Ka. BKK', name: 'Anggraini Kusumawardani, S.Pd.' },
  { no: 17, email: 'wiwik.pristiwati@smkn2magelang.sch.id', role: 'Ka. Perpustakaan', name: 'Dra. Wiwik Pristiwati' },
  { no: 18, email: 'yunus.adi.wibowo@smkn2magelang.sch.id', role: 'Ka. Lab', name: 'Yunus Adi Wibowo, S.Kom.' },
  { no: 19, email: 'tri.djoko@smkn2magelang.sch.id', role: 'Ka. Usman', name: 'Tri Djoko, S.Pd.' }
];

const password = 'Sintesa2026!';

async function verifyAll19() {
  console.log(`\n========================================================================`);
  console.log(` PENGUJIAN LOGIN LIVE SUPABASE AUTH: 19/19 AKUN RESMI`);
  console.log(` Password Uji: ${password}`);
  console.log(`========================================================================\n`);

  const results = [];
  let successCount = 0;

  for (const acc of accounts) {
    const startTime = Date.now();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: acc.email,
      password: password
    });
    const duration = Date.now() - startTime;

    if (!error && data.user) {
      successCount++;
      results.push({
        No: acc.no,
        Unit: acc.role,
        Nama: acc.name,
        Email: acc.email,
        Status: 'LOGIN BERHASIL (200 OK)',
        Respon: `${duration}ms`
      });
      // Sign out to keep session clean
      await supabase.auth.signOut();
    } else {
      results.push({
        No: acc.no,
        Unit: acc.role,
        Nama: acc.name,
        Email: acc.email,
        Status: `GAGAL: ${error?.message}`,
        Respon: `${duration}ms`
      });
    }
  }

  console.table(results);
  console.log(`\nHASIL AKHIR: ${successCount} dari 19 akun BERHASIL LOGIN tanpa kendala.`);
  if (successCount === 19) {
    console.log(`SEMUA 19 AKUN 100% AKTIF DAN BISA LOGIN LANGSUNG!`);
  }
}

verifyAll19().catch(console.error);
