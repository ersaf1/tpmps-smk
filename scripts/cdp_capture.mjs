import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/screenshots/presentation');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// User Profile for Super Admin
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

async function getWsUrl(port = 9333) {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const list = await res.json();
      if (list && list.length > 0 && list[0].webSocketDebuggerUrl) {
        return list[0].webSocketDebuggerUrl;
      }
    } catch (e) {
      // wait
    }
    await sleep(500);
  }
  throw new Error('Failed to find WebSocketDebuggerUrl');
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.msgId = 0;
    this.callbacks = new Map();
    this.ready = new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && this.callbacks.has(data.id)) {
        const { resolve, reject } = this.callbacks.get(data.id);
        this.callbacks.delete(data.id);
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.result);
        }
      }
    };
  }

  send(method, params = {}) {
    const id = ++this.msgId;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async close() {
    this.ws.close();
  }
}

async function run() {
  const port = 9333;
  console.log(`Connecting to CDP on port ${port}...`);
  const wsUrl = await getWsUrl(port);
  console.log('Connected to:', wsUrl);

  const client = new CDPClient(wsUrl);
  await client.ready;

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Network.enable');

  async function navigate(url, waitMs = 2500) {
    console.log(`Navigating to ${url}...`);
    await client.send('Page.navigate', { url });
    await sleep(waitMs);
  }

  async function evaluate(expression) {
    const res = await client.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res?.result?.value;
  }

  async function screenshot(filename) {
    console.log(`Capturing ${filename}...`);
    // Set 1600x1000 viewport
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1600,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false
    });
    await sleep(400);

    const shot = await client.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });

    const buffer = Buffer.from(shot.data, 'base64');
    const targetPath = path.join(outDir, filename);
    fs.writeFileSync(targetPath, buffer);
    console.log(`Saved: ${filename} (${buffer.length} bytes)`);
  }

  // 1. Capture Login Page
  await navigate('http://localhost:3000/login', 2500);
  await screenshot('01_login_page.png');

  // 2. Set Admin Auth State in LocalStorage & Cookies
  await evaluate(`
    localStorage.setItem('sintesa_auth_user', JSON.stringify(${JSON.stringify(adminUser)}));
    document.cookie = "sintesa_session=${encodedCookie}; path=/; max-age=86400; SameSite=Lax";
  `);
  console.log('Authentication state set.');

  // 3. Dashboard (Super Admin / Kepsek / TPMPS)
  await navigate('http://localhost:3000/dashboard', 3000);
  await screenshot('02_dashboard_mutu.png');

  // 4. Monitoring & Validasi Dokumen (TPMPS & Kepsek)
  await navigate('http://localhost:3000/dokumen/validasi', 3000);
  await screenshot('03_validasi_dokumen_tpmps.png');

  // 5. Kelola Unit Kerja (CRUD Unit)
  await navigate('http://localhost:3000/unit', 3000);
  await screenshot('04_kelola_unit_crud.png');

  // 6. Bank Dokumen Digital
  await navigate('http://localhost:3000/dokumen', 3000);
  await screenshot('05_bank_dokumen_digital.png');

  // 7. Google Drive Unit 1 s/d 15
  await navigate('http://localhost:3000/drive', 3000);

  const units = [
    { code: 'WKS-1', name: 'WKS 1 (Bidang Kurikulum)', file: 'unit_01_wks1_kurikulum.png' },
    { code: 'WKS-2', name: 'WKS 2 (Bidang Kesiswaan)', file: 'unit_02_wks2_kesiswaan.png' },
    { code: 'WKS-3', name: 'WKS 3 (Bidang Sarana & Prasarana)', file: 'unit_03_wks3_sarpras.png' },
    { code: 'WKS-4', name: 'WKS 4 (Hubungan Industri & Humas)', file: 'unit_04_wks4_humas.png' },
    { code: 'WKS-SDM', name: 'Bidang Ketenagaan & SDM', file: 'unit_05_wks_sdm.png' },
    { code: 'PROG-RPL', name: 'Program Keahlian PPLG / RPL', file: 'unit_06_prog_rpl.png' },
    { code: 'PROG-TKJ', name: 'Program Keahlian TJKT / TKJ', file: 'unit_07_prog_tkj.png' },
    { code: 'PROG-AKL', name: 'Program Keahlian Akuntansi (AKL)', file: 'unit_08_prog_akl.png' },
    { code: 'PROG-OTKP', name: 'Program Keahlian Perkantoran (MPLB)', file: 'unit_09_prog_mplb.png' },
    { code: 'PROG-BDP', name: 'Program Keahlian Pemasaran (BDP)', file: 'unit_10_prog_bdp.png' },
    { code: 'BENGKEL', name: 'Unit Pengelola Bengkel & Lab Komputer', file: 'unit_11_lab_bengkel.png' },
    { code: 'PERPUS', name: 'Unit Perpustakaan Digital', file: 'unit_12_perpustakaan.png' },
    { code: 'BKK', name: 'Bursa Kerja Khusus (BKK Magelang)', file: 'unit_13_bkk.png' },
    { code: 'BK', name: 'Unit Bimbingan Konseling (BK)', file: 'unit_14_bk.png' },
    { code: 'TEFA', name: 'Unit Produksi & Teaching Factory (TEFA)', file: 'unit_15_tefa.png' }
  ];

  for (const u of units) {
    console.log(`Selecting unit: ${u.code}...`);
    const clicked = await evaluate(`
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.textContent && b.textContent.includes('${u.code}'));
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      })()
    `);
    console.log(`Unit ${u.code} button clicked:`, clicked);
    await sleep(800);
    await screenshot(u.file);
  }

  console.log('ALL SCREENSHOTS COMPLETED SUCCESSFULLY!');
  await client.close();
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
