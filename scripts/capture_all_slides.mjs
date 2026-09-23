import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/screenshots/presentation');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// User Profile for Super Admin (has full access across all modules)
const adminUser = {
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
};

const sessionPayload = {
  userId: adminUser.id,
  nip: adminUser.nip,
  role: adminUser.role,
  name: adminUser.fullName,
  exp: Math.floor(Date.now() / 1000) + 86400
};
const encodedCookie = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log('Connecting to CDP on port 9333...');
  const res = await fetch('http://127.0.0.1:9333/json/list');
  const list = await res.json();
  const pageTarget = list.find((item) => item.type === 'page');
  if (!pageTarget) {
    throw new Error('No page target found!');
  }

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
  console.log('WebSocket connected successfully.');

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

  async function screenshot(filename) {
    console.log(`Capturing ${filename}...`);
    await sleep(300);
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(shot.data, 'base64');
    const targetPath = path.join(outDir, filename);
    fs.writeFileSync(targetPath, buffer);
    console.log(`Saved: ${filename} (${buffer.length} bytes)`);
  }

  // 1. LOGIN PAGE
  await navigate('http://localhost:3000/login', 2000);
  await screenshot('01_login_page.png');

  // 2. INJECT AUTHENTICATION
  await evaluate(`
    localStorage.setItem('sintesa_auth_user', JSON.stringify(${JSON.stringify(adminUser)}));
    document.cookie = "sintesa_session=${encodedCookie}; path=/; max-age=86400; SameSite=Lax";
  `);
  console.log('Injected session credentials.');

  // 3. DASHBOARD MUTU AGREGAT (Super Admin / Kepsek / Ketua TPMPS)
  await navigate('http://localhost:3000/dashboard', 2500);
  await screenshot('02_dashboard_mutu.png');

  // 4. MONITORING & VALIDASI DOKUMEN (TPMPS & Kepsek checking uploads)
  await navigate('http://localhost:3000/dokumen/validasi', 2500);
  await screenshot('03_validasi_dokumen_tpmps_kepsek.png');

  // 5. KELOLA UNIT KERJA (CRUD Unit for Super Admin, Kepsek, TPMPS)
  await navigate('http://localhost:3000/unit', 2500);
  await screenshot('04_kelola_unit_crud.png');

  // 6. BANK DOKUMEN DIGITAL (Arsip seluruh unit)
  await navigate('http://localhost:3000/dokumen', 2500);
  await screenshot('05_bank_dokumen_digital.png');

  // 7. GOOGLE DRIVE UNIT 1 S/D 15
  await navigate('http://localhost:3000/drive', 2500);

  const units = [
    { code: 'WKS-1', name: 'WKS 1 (Bidang Kurikulum)', file: '06_unit_01_wks1_kurikulum.png' },
    { code: 'WKS-2', name: 'WKS 2 (Bidang Kesiswaan)', file: '07_unit_02_wks2_kesiswaan.png' },
    { code: 'WKS-3', name: 'WKS 3 (Bidang Sarana & Prasarana)', file: '08_unit_03_wks3_sarpras.png' },
    { code: 'WKS-4', name: 'WKS 4 (Hubungan Industri & Humas)', file: '09_unit_04_wks4_humas.png' },
    { code: 'WKS-SDM', name: 'Bidang Ketenagaan & SDM', file: '10_unit_05_wks_sdm.png' },
    { code: 'PROG-RPL', name: 'Program Keahlian PPLG / RPL', file: '11_unit_06_prog_rpl.png' },
    { code: 'PROG-TKJ', name: 'Program Keahlian TJKT / TKJ', file: '12_unit_07_prog_tkj.png' },
    { code: 'PROG-AKL', name: 'Program Keahlian Akuntansi (AKL)', file: '13_unit_08_prog_akl.png' },
    { code: 'PROG-OTKP', name: 'Program Keahlian Perkantoran (MPLB)', file: '14_unit_09_prog_mplb.png' },
    { code: 'PROG-BDP', name: 'Program Keahlian Pemasaran (BDP)', file: '15_unit_10_prog_bdp.png' },
    { code: 'BENGKEL', name: 'Unit Pengelola Bengkel & Lab Komputer', file: '16_unit_11_lab_bengkel.png' },
    { code: 'PERPUS', name: 'Unit Perpustakaan Digital', file: '17_unit_12_perpustakaan.png' },
    { code: 'BKK', name: 'Bursa Kerja Khusus (BKK Magelang)', file: '18_unit_13_bkk.png' },
    { code: 'BK', name: 'Unit Bimbingan Konseling (BK)', file: '19_unit_14_bk.png' },
    { code: 'TEFA', name: 'Unit Produksi & Teaching Factory (TEFA)', file: '20_unit_15_tefa.png' }
  ];

  for (const u of units) {
    console.log(`Selecting unit: ${u.code} (${u.name})...`);
    await evaluate(`
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.textContent && b.textContent.includes('${u.code}'));
        if (btn) {
          btn.click();
        }
      })()
    `);
    await sleep(600);
    await screenshot(u.file);
  }

  console.log('ALL 20 SCREENSHOTS CAPTURED SUCCESSFULLY!');
  ws.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
