import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('public/screenshots');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// User Profiles
const USERS = {
  kepsek: {
    id: 'usr-kepsek-01',
    nip: '196803121992031004',
    fullName: 'Drs. H. Mulyono, M.Pd.',
    email: 'kepala.sekolah@smkn2magelang.sch.id',
    role: 'kepala_sekolah',
    avatarUrl: '/avatar-kepsek.png',
    phone: '081198765432',
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z'
  },
  tpmps: {
    id: 'usr-tpmps-01',
    nip: '197509182002122001',
    fullName: 'Dra. Hj. Siti Fatimah, M.M. (Ketua TPMPS)',
    email: 'tpmps.ketua@smkn2magelang.sch.id',
    role: 'tpmps',
    avatarUrl: '/avatar-tpmps.png',
    phone: '081328901234',
    isActive: true,
    createdAt: '2024-02-15T08:00:00Z'
  },
  admin: {
    id: 'usr-admin-01',
    nip: '198204152008011005',
    fullName: 'Rian Prasetyo, S.Kom. (Admin)',
    email: 'admin.sintesa@smkn2magelang.sch.id',
    role: 'admin',
    unitId: 'u-01',
    unitName: 'Administrator Pusat SINTESA',
    avatarUrl: '/avatar-admin.png',
    phone: '081234567890',
    isActive: true,
    createdAt: '2025-01-10T08:00:00Z'
  }
};

const UNITS = [
  { id: 'u-01', num: '01', code: 'WKS-1', name: 'WKS 1 (Bidang Kurikulum)', pic: 'Dra. Sri Wahyuni, M.Pd.', email: 'kurikulum@smkn2magelang.sch.id', folderName: 'unit_01_wks1_kurikulum' },
  { id: 'u-02', num: '02', code: 'WKS-2', name: 'WKS 2 (Bidang Kesiswaan)', pic: 'Bambang Sutrisno, S.Pd.', email: 'kesiswaan@smkn2magelang.sch.id', folderName: 'unit_02_wks2_kesiswaan' },
  { id: 'u-03', num: '03', code: 'WKS-3', name: 'WKS 3 (Bidang Sarana & Prasarana)', pic: 'Ir. Agus Haryanto, M.T.', email: 'sarpras@smkn2magelang.sch.id', folderName: 'unit_03_wks3_sarpras' },
  { id: 'u-04', num: '04', code: 'WKS-4', name: 'WKS 4 (Hubungan Industri & Humas)', pic: 'Drs. Hendro Wibowo', email: 'humas@smkn2magelang.sch.id', folderName: 'unit_04_wks4_humas' },
  { id: 'u-05', num: '05', code: 'WKS-SDM', name: 'Bidang Ketenagaan & SDM', pic: 'Nurul Hidayati, S.Pd.', email: 'sdm@smkn2magelang.sch.id', folderName: 'unit_05_wks_sdm' },
  { id: 'u-06', num: '06', code: 'PROG-RPL', name: 'Program Keahlian PPLG / RPL', pic: 'Eko Prasetyo, S.Kom., M.Cs.', email: 'rpl@smkn2magelang.sch.id', folderName: 'unit_06_prog_rpl' },
  { id: 'u-07', num: '07', code: 'PROG-TKJ', name: 'Program Keahlian TJKT / TKJ', pic: 'Ahmad Fauzi, S.T.', email: 'tkj@smkn2magelang.sch.id', folderName: 'unit_07_prog_tkj' },
  { id: 'u-08', num: '08', code: 'PROG-AKL', name: 'Program Keahlian Akuntansi (AKL)', pic: 'Siti Rahmawati, S.E., M.Akt.', email: 'akl@smkn2magelang.sch.id', folderName: 'unit_08_prog_akl' },
  { id: 'u-09', num: '09', code: 'PROG-OTKP', name: 'Program Keahlian Perkantoran (MPLB)', pic: 'Dewi Lestari, S.Pd.', email: 'mplb@smkn2magelang.sch.id', folderName: 'unit_09_prog_mplb' },
  { id: 'u-10', num: '10', code: 'PROG-BDP', name: 'Program Keahlian Pemasaran (BDP)', pic: 'Rudi Hartono, S.E.', email: 'bdp@smkn2magelang.sch.id', folderName: 'unit_10_prog_bdp' },
  { id: 'u-11', num: '11', code: 'BENGKEL', name: 'Unit Pengelola Bengkel & Lab Komputer', pic: 'Supriyanto, A.Md.', email: 'lab@smkn2magelang.sch.id', folderName: 'unit_11_lab_bengkel' },
  { id: 'u-12', num: '12', code: 'PERPUS', name: 'Unit Perpustakaan Digital', pic: 'Tri Utami, S.I.Pust.', email: 'perpustakaan@smkn2magelang.sch.id', folderName: 'unit_12_perpustakaan' },
  { id: 'u-13', num: '13', code: 'BKK', name: 'Bursa Kerja Khusus (BKK Magelang)', pic: 'Wahyu Nugroho, S.Pd.', email: 'bkk@smkn2magelang.sch.id', folderName: 'unit_13_bkk' },
  { id: 'u-14', num: '14', code: 'BK', name: 'Unit Bimbingan Konseling (BK)', pic: 'Dra. Endang Sulastri', email: 'bk@smkn2magelang.sch.id', folderName: 'unit_14_bk' },
  { id: 'u-15', num: '15', code: 'TEFA', name: 'Unit Produksi & Teaching Factory (TEFA)', pic: 'Anwar Sadat, S.T.', email: 'tefa@smkn2magelang.sch.id', folderName: 'unit_15_tefa' }
];

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log('Connecting to CDP on port 9333...');
  const res = await fetch('http://127.0.0.1:9333/json/list');
  const list = await res.json();
  const pageTarget = list.find((item) => item.type === 'page');
  if (!pageTarget) throw new Error('No page target found!');

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  console.log('Connected to WebSocket!');

  let msgId = 0;
  function send(method, params = {}) {
    const id = ++msgId;
    return new Promise((resolve) => {
      const handler = (event) => {
        const data = JSON.parse(event.data);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1600,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false
  });

  async function navigate(url, waitMs = 2000) {
    console.log(`Navigating to ${url}...`);
    await send('Page.navigate', { url });
    await sleep(waitMs);
  }

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res?.result?.value;
  }

  async function setAuth(userObj) {
    const sessionPayload = {
      userId: userObj.id,
      nip: userObj.nip || '198501012010011001',
      role: userObj.role,
      name: userObj.fullName,
      exp: Math.floor(Date.now() / 1000) + 86400
    };
    const encoded = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');
    await evaluate(`
      localStorage.setItem('sintesa_auth_user', JSON.stringify(${JSON.stringify(userObj)}));
      document.cookie = "sintesa_session=${encoded}; path=/; max-age=86400; SameSite=Lax";
    `);
    await sleep(200);
  }

  async function screenshot(targetDir, filename) {
    ensureDir(targetDir);
    await sleep(300);
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(shot.data, 'base64');
    const fullPath = path.join(targetDir, filename);
    fs.writeFileSync(fullPath, buffer);
    console.log(`Saved: ${fullPath} (${buffer.length} bytes)`);
  }

  // =========================================================================
  // 1. HALAMAN LOGIN
  // =========================================================================
  console.log('\n--- CAPTURING LOGIN PAGE ---');
  await evaluate(`localStorage.clear(); document.cookie = "sintesa_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";`);
  await navigate('http://localhost:3000/login', 2500);
  const loginDir = path.join(baseDir, '00_login');
  await screenshot(loginDir, '01_login_page.png');

  // =========================================================================
  // 2. HALAMAN KEPALA SEKOLAH (KEPSEK)
  // =========================================================================
  console.log('\n--- CAPTURING KEPALA SEKOLAH PAGES ---');
  await setAuth(USERS.kepsek);
  const kepsekDir = path.join(baseDir, 'kepala_sekolah');

  // 2.1 Dashboard Mutu Kepsek
  await navigate('http://localhost:3000/dashboard', 2500);
  await screenshot(kepsekDir, '01_dashboard_kepsek.png');

  // 2.2 Validasi Dokumen (Kepsek mengecek apa yang diupload unit)
  await navigate('http://localhost:3000/dokumen/validasi', 2500);
  await screenshot(kepsekDir, '02_validasi_dokumen_kepsek.png');

  // 2.3 Kelola Unit Kerja (CRUD Unit)
  await navigate('http://localhost:3000/unit', 2500);
  await screenshot(kepsekDir, '03_kelola_unit_kepsek.png');

  // 2.4 Laporan EDS (Approval Rapor Mutu)
  await navigate('http://localhost:3000/laporan', 2500);
  await screenshot(kepsekDir, '04_laporan_eds_kepsek.png');

  // 2.5 Bank Dokumen Digital
  await navigate('http://localhost:3000/dokumen', 2500);
  await screenshot(kepsekDir, '05_bank_dokumen_kepsek.png');

  // =========================================================================
  // 3. HALAMAN KETUA TPMPS
  // =========================================================================
  console.log('\n--- CAPTURING KETUA TPMPS PAGES ---');
  await setAuth(USERS.tpmps);
  const tpmpsDir = path.join(baseDir, 'ketua_tpmps');

  // 3.1 Dashboard TPMPS
  await navigate('http://localhost:3000/dashboard', 2500);
  await screenshot(tpmpsDir, '01_dashboard_tpmps.png');

  // 3.2 Validasi Dokumen (Ketua TPMPS memeriksa berkas upload unit)
  await navigate('http://localhost:3000/dokumen/validasi', 2500);
  await screenshot(tpmpsDir, '02_validasi_dokumen_tpmps.png');

  // 3.3 Evaluasi Mutu Auditor
  await navigate('http://localhost:3000/evaluasi', 2500);
  await screenshot(tpmpsDir, '03_evaluasi_mutu_tpmps.png');

  // 3.4 Kelola Unit Kerja
  await navigate('http://localhost:3000/unit', 2500);
  await screenshot(tpmpsDir, '04_kelola_unit_tpmps.png');

  // 3.5 RTL (Rencana Tindak Lanjut Mutu)
  await navigate('http://localhost:3000/rtl', 2500);
  await screenshot(tpmpsDir, '05_rtl_mutu_tpmps.png');

  // =========================================================================
  // 4. HALAMAN TIAP UNIT (UNIT 1 S/D UNIT 15)
  // =========================================================================
  console.log('\n--- CAPTURING EACH UNIT (UNIT 1 S/D 15) ---');
  // First, authenticate as admin/tpmps so we can freely access and switch units
  await setAuth(USERS.admin);
  await navigate('http://localhost:3000/drive', 2500);

  for (const u of UNITS) {
    console.log(`\nCapturing Unit ${u.num}: ${u.name} (${u.code})...`);
    const unitDir = path.join(baseDir, u.folderName);
    ensureDir(unitDir);

    // 1. Google Drive Unit
    await evaluate(`
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.textContent && b.textContent.includes('${u.code}'));
        if (btn) {
          btn.scrollIntoView({ block: 'center' });
          btn.click();
        }
      })()
    `);
    await sleep(800);
    await screenshot(unitDir, `01_drive_${u.code.toLowerCase().replace('-', '_')}.png`);

    // 2. Dashboard Unit Perspective (login as that unit)
    const unitUser = {
      id: `usr-${u.id}`,
      nip: '198501012010011001',
      fullName: u.pic,
      email: u.email,
      role: 'guru',
      unitId: u.id,
      unitName: u.name,
      avatarUrl: '/avatar-guru.png',
      phone: '081578904321',
      isActive: true,
      createdAt: '2024-03-01T08:00:00Z'
    };
    await setAuth(unitUser);
    await navigate('http://localhost:3000/dashboard', 2000);
    await screenshot(unitDir, `02_dashboard_${u.code.toLowerCase().replace('-', '_')}.png`);

    // 3. Evaluasi Mutu Unit Perspective
    await navigate('http://localhost:3000/evaluasi', 2000);
    await screenshot(unitDir, `03_evaluasi_${u.code.toLowerCase().replace('-', '_')}.png`);

    // Restore admin auth for next drive switch
    await setAuth(USERS.admin);
    await navigate('http://localhost:3000/drive', 2000);
  }

  console.log('\nALL SCREENSHOTS CAPTURED COMPLETELY AND CLEANLY!');
  ws.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
