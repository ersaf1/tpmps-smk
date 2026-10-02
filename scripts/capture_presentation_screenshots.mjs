import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/screenshots/presentation');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// User Profile for Super Admin (has full access)
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

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = path.resolve('.edge-debug-profile');

const edgeProc = spawn(edgePath, [
  '--headless',
  '--remote-debugging-port=9222',
  '--disable-gpu',
  '--window-size=1600,1000',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: 'ignore' });

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getDebuggerUrl() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9222/json');
      const list = await res.json();
      if (list && list.length > 0 && list[0].webSocketDebuggerUrl) {
        return list[0].webSocketDebuggerUrl;
      }
    } catch (e) {
      // wait
    }
    await sleep(500);
  }
  throw new Error('Could not connect to CDP WebSocket');
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.msgId = 0;
    this.callbacks = new Map();
    this.ready = new Promise((resolve) => {
      this.ws.onopen = resolve;
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

async function main() {
  try {
    console.log('Waiting for Edge CDP...');
    const wsUrl = await getDebuggerUrl();
    console.log('Connected to CDP at:', wsUrl);

    const client = new CDPClient(wsUrl);
    await client.ready;

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('Network.enable');

    // Helper: navigate and wait
    async function navigate(url, waitMs = 2500) {
      console.log(`Navigating to ${url}...`);
      await client.send('Page.navigate', { url });
      await sleep(waitMs);
    }

    // Helper: evaluate JS
    async function evaluate(expression) {
      const res = await client.send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true
      });
      return res?.result?.value;
    }

    // Helper: full-page screenshot
    async function screenshot(filename) {
      console.log(`Capturing ${filename}...`);
      const layout = await client.send('Page.getLayoutMetrics');
      const width = Math.max(1600, Math.ceil(layout.contentSize?.width || 1600));
      const height = Math.max(1000, Math.ceil(layout.contentSize?.height || 1000));

      await client.send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: false
      });
      await sleep(300);

      const shot = await client.send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: true
      });

      const buffer = Buffer.from(shot.data, 'base64');
      const targetPath = path.join(outDir, filename);
      fs.writeFileSync(targetPath, buffer);
      console.log(`Saved: ${targetPath} (${buffer.length} bytes)`);

      // Reset viewport
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: 1600,
        height: 1000,
        deviceScaleFactor: 1,
        mobile: false
      });
      await sleep(200);
    }

    // 1. LOGIN PAGE SCREENSHOT
    await navigate('http://localhost:3000/login', 2000);
    await screenshot('01_login_page.png');

    // 2. SETUP AUTHENTICATED SESSION
    await evaluate(`
      localStorage.setItem('sintesa_auth_user', JSON.stringify(${JSON.stringify(adminUser)}));
      document.cookie = "sintesa_session=${encodedCookie}; path=/; max-age=86400; SameSite=Lax";
    `);
    console.log('Injected authenticated session.');

    // 3. DASHBOARD (Super Admin / Kepsek / Ketua TPMPS overview)
    await navigate('http://localhost:3000/dashboard', 3000);
    await screenshot('02_dashboard_mutu.png');

    // 4. MONITORING & VALIDASI DOKUMEN (TPMPS & Kepsek checking uploads)
    await navigate('http://localhost:3000/dokumen/validasi', 3000);
    await screenshot('03_validasi_dokumen_tpmps.png');

    // 5. KELOLA UNIT KERJA (CRUD Unit for Admin / Kepsek / TPMPS)
    await navigate('http://localhost:3000/unit', 3000);
    await screenshot('04_kelola_unit_crud.png');

    // 6. BANK DOKUMEN DIGITAL (Arsip seluruh unit)
    await navigate('http://localhost:3000/dokumen', 3000);
    await screenshot('05_bank_dokumen_digital.png');

    // 7. GOOGLE DRIVE UNIT 1 S/D 15
    await navigate('http://localhost:3000/drive', 3000);

    const unitsList = [
      { id: 'u-01', code: 'WKS-1', name: 'WKS 1 (Bidang Kurikulum)', file: 'unit_01_wks1_kurikulum.png' },
      { id: 'u-02', code: 'WKS-2', name: 'WKS 2 (Bidang Kesiswaan)', file: 'unit_02_wks2_kesiswaan.png' },
      { id: 'u-03', code: 'WKS-3', name: 'WKS 3 (Bidang Sarana & Prasarana)', file: 'unit_03_wks3_sarpras.png' },
      { id: 'u-04', code: 'WKS-4', name: 'WKS 4 (Hubungan Industri & Humas)', file: 'unit_04_wks4_humas.png' },
      { id: 'u-05', code: 'WKS-SDM', name: 'Bidang Ketenagaan & SDM', file: 'unit_05_wks_sdm.png' },
      { id: 'u-06', code: 'PROG-RPL', name: 'Program Keahlian PPLG / RPL', file: 'unit_06_prog_rpl.png' },
      { id: 'u-07', code: 'PROG-TKJ', name: 'Program Keahlian TJKT / TKJ', file: 'unit_07_prog_tkj.png' },
      { id: 'u-08', code: 'PROG-AKL', name: 'Program Keahlian Akuntansi (AKL)', file: 'unit_08_prog_akl.png' },
      { id: 'u-09', code: 'PROG-OTKP', name: 'Program Keahlian Perkantoran (MPLB)', file: 'unit_09_prog_mplb.png' },
      { id: 'u-10', code: 'PROG-BDP', name: 'Program Keahlian Pemasaran (BDP)', file: 'unit_10_prog_bdp.png' },
      { id: 'u-11', code: 'BENGKEL', name: 'Unit Pengelola Bengkel & Lab Komputer', file: 'unit_11_lab_bengkel.png' },
      { id: 'u-12', code: 'PERPUS', name: 'Unit Perpustakaan Digital', file: 'unit_12_perpustakaan.png' },
      { id: 'u-13', code: 'BKK', name: 'Bursa Kerja Khusus (BKK Magelang)', file: 'unit_13_bkk.png' },
      { id: 'u-14', code: 'BK', name: 'Unit Bimbingan Konseling (BK)', file: 'unit_14_bk.png' },
      { id: 'u-15', code: 'TEFA', name: 'Unit Produksi & Teaching Factory (TEFA)', file: 'unit_15_tefa.png' }
    ];

    for (const u of unitsList) {
      console.log(`Selecting unit ${u.code}: ${u.name}...`);
      await evaluate(`
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const target = buttons.find(b => b.textContent && b.textContent.includes('${u.code}'));
          if (target) {
            target.click();
            return true;
          }
          return false;
        })()
      `);
      await sleep(1000);
      await screenshot(u.file);
    }

    console.log('All screenshots captured successfully!');
    await client.close();
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    edgeProc.kill();
    process.exit(0);
  }
}

main();
