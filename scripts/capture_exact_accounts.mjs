import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('public/screenshots/exact_accounts');
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 15 EXACT OFFICIAL UNITS
const OFFICIAL_UNITS = [
  {
    num: '01',
    code: 'KASEK',
    folder: '01_kasek',
    name: '1. KASEK',
    pic: 'Drs. H. Mulyono, M.Pd.',
    role: 'kepala_sekolah',
    email: 'kasek@smkn2magelang.sch.id',
    unitId: 'u-01'
  },
  {
    num: '02',
    code: 'WKS-1',
    folder: '02_wks1',
    name: '2. UNIT KERJA WKS 1',
    pic: 'Dra. Sri Wahyuni, M.Pd.',
    role: 'guru',
    email: 'wks1@smkn2magelang.sch.id',
    unitId: 'u-02'
  },
  {
    num: '03',
    code: 'WKS-2',
    folder: '03_wks2',
    name: '3. UNIT KERJA WKS 2',
    pic: 'Bambang Sutrisno, S.Pd.',
    role: 'guru',
    email: 'wks2@smkn2magelang.sch.id',
    unitId: 'u-03'
  },
  {
    num: '04',
    code: 'WKS-3',
    folder: '04_wks3',
    name: '4. UNIT KERJA WKS 3',
    pic: 'Ir. Agus Haryanto, M.T.',
    role: 'guru',
    email: 'wks3@smkn2magelang.sch.id',
    unitId: 'u-04'
  },
  {
    num: '05',
    code: 'WKS-4',
    folder: '05_wks4',
    name: '5. UNIT KERJA WKS 4',
    pic: 'Drs. Hendro Wibowo',
    role: 'guru',
    email: 'wks4@smkn2magelang.sch.id',
    unitId: 'u-05'
  },
  {
    num: '06',
    code: 'K3',
    folder: '06_k3',
    name: '6. UNIT KERJA K3',
    pic: 'Eko Prasetyo, S.Kom., M.Cs.',
    role: 'guru',
    email: 'k3@smkn2magelang.sch.id',
    unitId: 'u-06'
  },
  {
    num: '07',
    code: 'TPMPS',
    folder: '07_tpmps',
    name: '7. UNIT KERJA TPMPS',
    pic: 'Dra. Hj. Siti Fatimah, M.M.',
    role: 'tpmps',
    email: 'tpmps@smkn2magelang.sch.id',
    unitId: 'u-07'
  },
  {
    num: '08',
    code: 'RENBANG',
    folder: '08_renbang',
    name: '8. UNIT KERJA RENBANG',
    pic: 'Drs. Supriyadi, M.M.',
    role: 'guru',
    email: 'renbang@smkn2magelang.sch.id',
    unitId: 'u-08'
  },
  {
    num: '09',
    code: 'KATU',
    folder: '09_katu',
    name: '9. UNIT KERJA KATU',
    pic: 'Nurul Hidayati, S.Sos.',
    role: 'guru',
    email: 'katu@smkn2magelang.sch.id',
    unitId: 'u-09'
  },
  {
    num: '10',
    code: 'KALAB',
    folder: '10_kalab',
    name: '10. UNIT KERJA KALAB',
    pic: 'Supriyanto, A.Md.',
    role: 'guru',
    email: 'kalab@smkn2magelang.sch.id',
    unitId: 'u-10'
  },
  {
    num: '11',
    code: 'PERPUSTAKAAN',
    folder: '11_perpustakaan',
    name: '11. UNIT KERJA PERPUSTAKAAN',
    pic: 'Tri Utami, S.I.Pust.',
    role: 'guru',
    email: 'perpustakaan@smkn2magelang.sch.id',
    unitId: 'u-11'
  },
  {
    num: '12',
    code: 'NASWIL',
    folder: '12_naswil',
    name: '12. UNIT KERJA NASWIL',
    pic: 'Drs. H. Mulyadi, M.Pd.',
    role: 'guru',
    email: 'naswil@smkn2magelang.sch.id',
    unitId: 'u-12'
  },
  {
    num: '13',
    code: 'BK',
    folder: '13_bk',
    name: '13. UNIT KERJA BK',
    pic: 'Dra. Endang Sulastri',
    role: 'guru',
    email: 'bk@smkn2magelang.sch.id',
    unitId: 'u-13'
  },
  {
    num: '14',
    code: 'BKK',
    folder: '14_bkk',
    name: '14. UNIT KERJA BKK',
    pic: 'Wahyu Nugroho, S.Pd.',
    role: 'guru',
    email: 'bkk@smkn2magelang.sch.id',
    unitId: 'u-14'
  },
  {
    num: '15',
    code: 'UPS',
    folder: '15_ups',
    name: '15. UNIT KERJA UPS',
    pic: 'Anwar Sadat, S.T.',
    role: 'guru',
    email: 'ups@smkn2magelang.sch.id',
    unitId: 'u-15'
  }
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

  console.log('Target found:', pageTarget.url);
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  console.log('Connected to WebSocket successfully!');

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

  async function navigate(url, waitMs = 1500) {
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
      userId: userObj.id || `usr-${userObj.unitId}`,
      nip: userObj.nip || '198501012010011001',
      role: userObj.role,
      name: userObj.pic || userObj.fullName,
      exp: Math.floor(Date.now() / 1000) + 86400
    };
    const encoded = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');
    const userJson = JSON.stringify({
      id: userObj.id || `usr-${userObj.unitId}`,
      nip: '198501012010011001',
      fullName: userObj.pic || userObj.fullName,
      email: userObj.email,
      role: userObj.role,
      unitId: userObj.unitId,
      unitName: userObj.name,
      avatarUrl: '/avatar-guru.png',
      isActive: true,
      createdAt: new Date().toISOString()
    });

    await evaluate(`
      localStorage.setItem('sintesa_auth_user', JSON.stringify(${userJson}));
      document.cookie = "sintesa_session=${encoded}; path=/; max-age=86400; SameSite=Lax";
    `);
    await sleep(200);
  }

  async function screenshot(targetDir, filename) {
    ensureDir(targetDir);
    const filepath = path.join(targetDir, filename);
    const result = await send('Page.captureScreenshot', { format: 'png', quality: 100 });
    if (result && result.data) {
      fs.writeFileSync(filepath, Buffer.from(result.data, 'base64'));
      console.log(`Saved screenshot: ${filepath}`);
    } else {
      console.error(`Failed to capture: ${filename}`);
    }
  }

  // ==========================================
  // 1. CAPTURE LOGIN PAGE WITH QUICK LOGIN BUTTONS
  // ==========================================
  console.log('\n--- 1. CAPTURING LOGIN PAGE ---');
  await evaluate(`localStorage.clear(); document.cookie = "sintesa_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";`);
  await navigate('http://localhost:3000/login', 2000);
  const loginDir = path.join(baseDir, '00_login');
  await screenshot(loginDir, '01_login_page.png');

  // ==========================================
  // 2. CAPTURE KASEK (KEPALA SEKOLAH)
  // ==========================================
  console.log('\n--- 2. CAPTURING KASEK (KEPALA SEKOLAH) ---');
  const kasek = OFFICIAL_UNITS[0];
  await setAuth(kasek);
  const kasekDir = path.join(baseDir, kasek.folder);

  // 2.1 Dashboard Mutu Kasek
  await navigate('http://localhost:3000/dashboard', 2000);
  await screenshot(kasekDir, '01_dashboard_kasek.png');

  // 2.2 Validasi Dokumen (Tampilan Baru yang Elegan untuk Cek Dokumen Unit)
  await navigate('http://localhost:3000/dokumen/validasi', 2000);
  await screenshot(kasekDir, '02_validasi_dokumen_kasek.png');

  // ==========================================
  // 3. CAPTURE KETUA TPMPS
  // ==========================================
  console.log('\n--- 3. CAPTURING KETUA TPMPS ---');
  const tpmps = OFFICIAL_UNITS[6]; // index 6 is Unit 7 TPMPS
  await setAuth(tpmps);
  const tpmpsDir = path.join(baseDir, tpmps.folder);

  // 3.1 Dashboard TPMPS
  await navigate('http://localhost:3000/dashboard', 2000);
  await screenshot(tpmpsDir, '01_dashboard_tpmps.png');

  // 3.2 Validasi Dokumen TPMPS
  await navigate('http://localhost:3000/dokumen/validasi', 2000);
  await screenshot(tpmpsDir, '02_validasi_dokumen_tpmps.png');

  // 3.3 Evaluasi Mutu
  await navigate('http://localhost:3000/evaluasi', 2000);
  await screenshot(tpmpsDir, '03_evaluasi_mutu_tpmps.png');

  // 3.4 RTL
  await navigate('http://localhost:3000/rtl', 2000);
  await screenshot(tpmpsDir, '04_rtl_tpmps.png');

  // ==========================================
  // 4. CAPTURE SETIAP UNIT (LOGGED IN AS EACH UNIT ACCOUNT)
  // ==========================================
  console.log('\n--- 4. CAPTURING EVERY UNIT (LOGGED IN PER UNIT ACCOUNT) ---');
  for (const u of OFFICIAL_UNITS) {
    if (u.code === 'KASEK' || u.code === 'TPMPS') continue; // already captured

    console.log(`\n>>> Logging in as ${u.name} (${u.email})...`);
    await setAuth(u);
    const unitDir = path.join(baseDir, u.folder);

    // 4.1 Drive Unit (Logged in as that unit!)
    await navigate('http://localhost:3000/drive', 2000);
    // Make sure unit's drive is selected
    await evaluate(`
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.textContent && b.textContent.includes('${u.code}'));
        if (btn) btn.click();
      })()
    `);
    await sleep(600);
    await screenshot(unitDir, `01_drive_${u.code.toLowerCase().replace('-', '_')}.png`);

    // 4.2 Dashboard Unit (Logged in as that unit!)
    await navigate('http://localhost:3000/dashboard', 1800);
    await screenshot(unitDir, `02_dashboard_${u.code.toLowerCase().replace('-', '_')}.png`);
  }

  console.log('\nALL 15 UNIT ACCOUNT SCREENSHOTS CAPTURED SUCCESSFULLY!');
  ws.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
