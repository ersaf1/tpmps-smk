import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { performance } from 'node:perf_hooks';
import { mkdirSync, existsSync, readFileSync } from "node:fs";
import {spawn} from 'node:child_process';
mkdirSync("artifacts", { recursive: true });
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:5180";
const server=process.env.TEST_BASE_URL?null:spawn(process.execPath,['node_modules/vite/bin/vite.js','apps/web','--host','127.0.0.1','--port','5180','--strictPort'],{stdio:'ignore',env:{...process.env,VITE_SUPABASE_URL:'https://tpmps-browser-test.supabase.co',VITE_SUPABASE_PUBLISHABLE_KEY:'test-publishable-key'}});
process.on('exit',()=>server?.kill());
for(let attempt=0;attempt<60;attempt++){try{const response=await fetch(base);if(response.ok)break;}catch{/* server starting */}await new Promise(resolve=>setTimeout(resolve,250));}
const browser = await chromium.launch({ channel: "msedge" });
// Fixtures exist only in this test transport, never in the application or database.
const user = {
  id: "00000000-0000-4000-8000-000000000001",
  email: "admin@example.test",
  aud: "authenticated",
  role: "authenticated",
  app_metadata: {},
  user_metadata: {},
  created_at: new Date().toISOString(),
};
const fixture = {
  profiles: [
    {
      id: user.id,
      full_name: "Administrator Pengujian",
      role: "superadmin",
      active: true,
      unit_id: null,
    },
  ],
  units: [{ id: "u1", name: "Unit Pengujian", active: true }],
  periods: [
    {
      id: "p1",
      name: "Periode pengujian",
      starts_on: "2026-01-01",
      ends_on: "2026-12-31",
    },
  ],
  document_spaces: [
    { id: "s1", period_id: "p1", unit_id: null, name: "Ketua TPMPS" },
    { id: "s2", period_id: "p1", unit_id: "u1", name: "Unit Pengujian" },
  ],
  folders: [
    {
      id: "f1",
      space_id: "s1",
      parent_id: null,
      name: "MM — Manual Mutu",
      created_at: "2026-10-01T03:00:00Z",
    },
    {
      id: "f2",
      space_id: "s1",
      parent_id: null,
      name: "PM — Prosedur Mutu",
      created_at: "2026-10-01T03:00:00Z",
    },
  ],
  files: [
    {
      id: "d1",
      space_id: "s1",
      folder_id: "f1",
      name: "Manual mutu sekolah.pdf",
      size: 24500,
      mime_type: "application/pdf",
      object_key: "test-object",
      uploaded_by: user.id,
      created_at: "2026-10-01T03:00:00Z",
      status: "ready",
    },
  ],
};
fixture.files.push(
  {...fixture.files[0], id:"d2", name:"Diagram.png", mime_type:"image/png", object_key:"test-image"},
  {...fixture.files[0], id:"d3", name:"Catatan.txt", mime_type:"text/plain", object_key:"test-text", size:600000},
  {...fixture.files[0], id:"d4", name:"Laporan.docx", mime_type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document", object_key:"test-office"},
  {...fixture.files[0], id:"d5", name:"Presentasi.pptx", mime_type:"application/vnd.openxmlformats-officedocument.presentationml.presentation", object_key:"test-pptx"},
  {...fixture.files[0], id:"d6", name:"Data.xlsx", mime_type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", object_key:"test-xlsx"},
  {...fixture.files[0], id:"d7", name:"Berkas.bin", mime_type:"application/octet-stream", object_key:"test-binary"}
);
fixture.folders.push({ ...fixture.folders[0], id:"f3", space_id:"s2", name:"CM ? Catatan Mutu" });
function testPdf(padding = 0) {
  const stream = "BT /F1 24 Tf 72 720 Td (SINTESA - PDF preview test) Tj ET";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  if (padding) { offsets.push(Buffer.byteLength(pdf)); pdf += `7 0 obj\n<< /Length ${padding} >>\nstream\n${'X'.repeat(padding)}\nendstream\nendobj\n`; }
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${offsets.length}\n0000000000 65535 f \n${offsets.slice(1).map(offset => String(offset).padStart(10,"0") + " 00000 n ").join("\n")}\ntrailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return pdf;
}
const issues = [];
const widths = process.env.TEST_VIEWPORTS ? process.env.TEST_VIEWPORTS.split(',').map(Number) : [320, 375, 390, 768, 1024, 1440];
for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: 1000 },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  console.log(`Checking ${width}px`);
  page.on("pageerror", (e) => issues.push(e.message));
  await page.addInitScript(() => {
    const schedule = window.setInterval.bind(window);
    window.setInterval = (callback, delay, ...args) => {
      if (delay === 60000) window.__refreshDocuments = callback;
      return schedule(callback, delay, ...args);
    };
  });
  // Exercise the download-to-reader transition while renderer code is still loading.
  await page.route('**/OfficeReader.tsx', async route => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    await route.continue();
  });
  await page.route("**/auth/v1/**", async (route) => {
    const url = route.request().url();
    if (url.includes("/token"))
      return route.fulfill({
        json: {
          access_token: "test-token",
          token_type: "bearer",
          expires_in: 3600,
          refresh_token: "test-refresh",
          user,
        },
      });
    return route.fulfill({ json: user });
  });
  let failProfileRefresh = false;
  await page.route("**/rest/v1/**", async (route) => {
    const url = new URL(route.request().url());
    const table = url.pathname.split("/").pop();
    if (failProfileRefresh && table === 'profiles' && url.searchParams.has('id')) return route.fulfill({status:503,json:{message:'Temporary network failure'}});
    let value =
      table === "server_clock" ? "2026-10-02T05:00:00Z" : fixture[table] || [];
    if (table === "profiles" && url.searchParams.has("id"))
      value = fixture.profiles[0];
    return route.fulfill({ json: value });
  });
  let denyStorage = false;
  let delayStorage = false;
  let failStorage = false;
  let officeOriginalDownloads = 0;
  let officeConversions = 0;
  const ranges = [];
  let pdfBytes = 0;
  await context.route("**/storage/v1/object/**", async route => {
    if (failStorage) return route.abort('failed');
    if (delayStorage) await new Promise(resolve => setTimeout(resolve, 500));
    if (denyStorage) return route.fulfill({status:403,json:{message:"Access denied"}});
    const url = new URL(route.request().url());
    const key = url.pathname.split('/').pop();
    if (route.request().method() === 'POST' && url.pathname.includes('/object/sign/')) {
      assert.equal(route.request().headers().authorization, 'Bearer test-token');
      assert.equal(route.request().postDataJSON().expiresIn, 300);
      return route.fulfill({json:{signedURL:`/object/sign/tpmps-documents/${key}?token=fixture`}});
    }
    if (url.pathname.includes('/object/sign/')) assert.equal(url.searchParams.get('token'), 'fixture');
    else assert.equal(route.request().headers().authorization, 'Bearer test-token');
    if (key === 'test-office' || key === 'test-pptx') officeOriginalDownloads++;
    if (key === 'test-office') return route.fulfill({contentType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',body:readFileSync('tests/fixtures/test.docx')});
    if (key === 'test-pptx') return route.fulfill({contentType:'application/vnd.openxmlformats-officedocument.presentationml.presentation',body:readFileSync('tests/fixtures/test.pptx')});
    if (key === "test-image") return route.fulfill({contentType:"image/png",body:Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=","base64")});
    if (key === "test-xlsx") return route.fulfill({contentType:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",body:readFileSync("tests/fixtures/test.xlsx")});
    if (key === 'test-text' || key === 'test-binary' || key === 'test-object') {
      const body = Buffer.from(key === 'test-text' ? ("<script>throw new Error('unsafe')</script>\n" + 'Catatan mutu\n'.repeat(60000)).slice(0,600000)
        : key === 'test-object' ? testPdf(2_000_000) : 'office fixture');
      const requested = route.request().headers().range;
      const headers = {'accept-ranges':'bytes','access-control-allow-origin':'*','access-control-expose-headers':'Content-Length,Accept-Ranges,Content-Range'};
      if (url.searchParams.has('download')) headers['content-disposition'] = `attachment; filename="${url.searchParams.get('download')}"`;
      if (requested) {
        ranges.push({key, range:requested});
        const [,begin,last] = requested.match(/bytes=(\d+)-(\d+)/);
        const start = Number(begin); const end = Math.min(Number(last) + 1, body.length);
        if (key === 'test-object') pdfBytes += end - start;
        return route.fulfill({status:206,contentType:key === 'test-object' ? 'application/pdf' : 'application/octet-stream',
          headers:{...headers,'content-range':`bytes ${start}-${end - 1}/${body.length}`,'content-length':String(end - start)},body:body.subarray(start,end)});
      }
      return route.fulfill({contentType:key === 'test-object' ? 'application/pdf' : 'application/octet-stream',headers:{...headers,'content-length':String(body.length)},body});
    }
    return route.fulfill({contentType:key === "test-object" ? "application/pdf" : "application/octet-stream",body:key === "test-object" ? testPdf() : "office fixture"});
  });
  await page.route("**/api/preview?*", async route => {
    officeConversions++;
    assert.equal(route.request().headers().authorization,"Bearer test-token");
    const id = new URL(route.request().url()).searchParams.get("id");
    const format = id === "d5" ? "pptx" : id === "d6" ? "xlsx" : "docx";
    const fixturePath = `artifacts/office-preview/test.${format}.pdf`;
    return route.fulfill({contentType:"application/pdf",body:existsSync(fixturePath) ? readFileSync(fixturePath) : testPdf()});
  });
  await page.goto(base);
  await page.getByRole("heading", { name: /Sistem Penjaminan Mutu/i }).waitFor();
  for (const theme of ["dark", "light"]) {
    if (theme === "light")
      await page.getByRole("button", { name: "Aktifkan tema terang" }).click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `artifacts/landing-${width}-${theme}.png`,
      fullPage: true, animations: "disabled",
    });
    if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) console.log(await page.evaluate(() => [...document.querySelectorAll('body *')].map(node => ({class:node.className,right:node.getBoundingClientRect().right,width:node.getBoundingClientRect().width})).filter(node=>node.right>window.innerWidth+1).slice(0,20)));
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `landing overflow ${width} ${theme}`,
    );
  }
  await page.getByRole("button", { name: "Aktifkan tema gelap" }).click();
  await page.waitForTimeout(200);

  // Navigate to login
  await page.getByRole("button", { name: "Masuk Portal TPMPS" }).first().click();
  await page.getByRole("heading", { name: "Masuk ke Sistem TPMPS" }).waitFor();
  for (const theme of ["dark", "light"]) {
    if (theme === "light")
      await page.getByRole("button", { name: "Aktifkan tema terang" }).click();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: `artifacts/login-${width}-${theme}.png`,
      fullPage: true, animations: "disabled",
    });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `login overflow ${width}`,
    );
  }
  await page.getByRole("button", { name: "Aktifkan tema gelap" }).click();
  await page.getByLabel("Email", { exact: true }).fill("admin@example.test");
  await page.getByLabel("Kata sandi", { exact: true }).fill("test-password");
  await page.getByRole("button", { name: "Masuk", exact: true }).click();
  await page.getByRole("heading", { name: "Ringkasan TPMPS", exact: true }).waitFor();
  for (const theme of ["dark", "light"]) {
    if (theme === "light")
      await page.getByRole("button", { name: "Aktifkan tema terang" }).click();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: `artifacts/dashboard-${width}-${theme}.png`,
      fullPage: true, animations: "disabled",
    });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `dashboard overflow ${width}`,
    );
  }
  if (width >= 768) {
    const card = page.locator('.stat').first();
    await page.waitForTimeout(500);
    assert.equal(await card.evaluate(node => window.getComputedStyle(node).transform), 'none');
    await card.hover();
    await page.waitForTimeout(250);
    assert.notEqual(await card.evaluate(node => window.getComputedStyle(node).transform), 'none');
    await page.mouse.move(0,0);
  }
  if (width <= 760)
    await page.getByRole("button", { name: "Buka menu" }).click();
  await page.getByRole("button", { name: "Dokumen", exact: true }).click();
  await page
    .locator(".folder-open")
    .filter({ hasText: "MM — Manual Mutu" })
    .click();
  await page
    .getByRole("button", { name: "Unggah file", exact: true })
    .waitFor();
  await page.getByRole("button", { name: "Aktifkan tema gelap" }).click();
  await page.waitForTimeout(200);
  await page.screenshot({
    path: `artifacts/files-${width}-dark.png`,
    fullPage: true, animations: "disabled",
  });
  assert(await page.locator('.main-shell').evaluate(node => window.getComputedStyle(node).overflowY === 'auto'), `main scroll ${width}`);
  await page.getByRole("button", { name: "Tampilan daftar" }).click();
  await page.screenshot({
    path: `artifacts/list-${width}-dark.png`,
    fullPage: true, animations: "disabled",
  });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    `files overflow ${width}`,
  );
  // Every file opens the same fullscreen top-layer viewer.
  for (const name of ["Manual mutu sekolah.pdf", "Diagram.png", "Catatan.txt", "Laporan.docx", "Presentasi.pptx", "Data.xlsx", "Berkas.bin"]) {
    const start = performance.now();
    const conversionsBefore = officeConversions;
    const trigger = page.getByRole("button", {name, exact:true});
    await trigger.click();
    const viewer = page.getByRole("dialog", {name:`Pratinjau ${name}`});
    await viewer.waitFor();
    await viewer.getByRole("button", {name:"Unduh dokumen",exact:true}).first().waitFor();
    await page.waitForFunction(() => document.querySelector('.viewer-download')?.disabled === false);
    const rect = await viewer.boundingBox();
    assert.equal(rect.x, 0); assert.equal(rect.y, 0);
    assert.equal(rect.width, width); assert.equal(rect.height, 1000);
    assert.equal(await viewer.getByLabel("Pratinjau hanya lihat").count(), 1);
    await page.keyboard.press("Tab");
    assert(await viewer.evaluate(node => node.contains(document.activeElement)));
    if (name.endsWith(".pdf")) {
      await viewer.locator('.pdf-page canvas').first().waitFor();
      await viewer.locator('.textLayer').first().getByText(/SINTESA/).waitFor().catch(async error => {
        console.log('PDF debug:', await viewer.innerText(), JSON.stringify(ranges), pdfBytes);
        throw error;
      });
      assert(ranges.some(item => item.key === 'test-object'), 'PDF should request byte ranges');
      assert(pdfBytes < 1_000_000, 'Initial PDF pages should not fetch the entire 2 MB file');
      assert((await viewer.locator('.pdf-scroll').boundingBox()).height > 650);
      assert(await viewer.locator('.pdf-scroll').evaluate(node => node.scrollHeight > node.clientHeight));
      await viewer.getByRole("button", {name:"Perbesar dokumen"}).click();
      await viewer.getByText("125%",{exact:true}).waitFor();
      await viewer.getByRole("button", {name:"Sesuaikan lebar dokumen"}).click();
      await viewer.getByLabel("Nomor halaman").fill("2");
      await page.waitForFunction(() => document.querySelector('.pdf-scroll')?.scrollTop > 20);
      const downloaded = new Promise(resolve => {
        page.once('download', resolve);
        context.once('page', popup => popup.once('download', resolve));
      });
      await viewer.getByRole("button",{name:"Unduh dokumen",exact:true}).click();
      assert.equal((await downloaded).suggestedFilename(), name);
    }
    if (name.endsWith(".png")) {
      await viewer.getByRole("button", {name:"Perbesar gambar"}).click();
      await viewer.getByText("125%",{exact:true}).waitFor();
      await viewer.getByRole("button", {name:"Sesuaikan gambar ke layar"}).click();
    }
    if (name.endsWith(".txt")) {
      assert((await viewer.locator("pre").textContent()).includes("<script>"));
      assert(await viewer.locator('.viewer-content').evaluate(node => node.scrollHeight > node.clientHeight));
      assert(ranges.some(item => item.key === 'test-text' && item.range === 'bytes=0-255999'));
      await viewer.getByRole('button', {name:'Bagian berikutnya'}).click();
      await viewer.getByText(/Bagian 2 dari 3/).waitFor();
      await viewer.locator('.viewer-text').waitFor();
      assert(ranges.some(item => item.key === 'test-text' && item.range === 'bytes=256000-511999'));
    }
    if (/\.(docx|pptx)$/.test(name)) {
      await viewer.locator('.office-paper').getByText(name.endsWith('.docx') ? 'SINTESA Word preview' : 'SINTESA slide 1', {exact:true}).waitFor();
      const elapsed = Math.round(performance.now() - start);
      console.log(`${width}px ${name} quick preview: ${elapsed}ms (no conversion)`);
      assert.equal(officeConversions, conversionsBefore, 'Quick preview must not wait for server conversion');
      await viewer.evaluate(node => node.close());
      await page.waitForFunction(() => document.querySelector('.file-viewer')?.open);
      assert(await viewer.locator('.office-paper').isVisible(), 'Reader must survive incidental native dialog closure');
      const originalUrl = page.url();
      await page.evaluate(() => window.__refreshDocuments?.());
      await page.waitForTimeout(300);
      assert.equal(page.url(), originalUrl);
      assert(await viewer.isVisible(), 'Refreshing metadata must not dismiss the reader');
      failProfileRefresh = true;
      await page.evaluate(() => window.__refreshDocuments?.());
      await page.waitForTimeout(300);
      assert(await viewer.isVisible(), 'Transient profile fetch failures must not discard an already active reader');
      failProfileRefresh = false;
      if (name.endsWith('.pptx')) {
        await viewer.getByRole('button', {name:'Slide berikutnya'}).click();
        await viewer.getByText('SINTESA slide 2', {exact:true}).waitFor();
      }
      const downloadsBefore = officeOriginalDownloads;
      await viewer.getByRole('button', {name:'Tata letak lengkap',exact:true}).click();
      await viewer.locator('.pdf-page canvas').first().waitFor();
      await viewer.locator('.textLayer').first().locator('span').first().waitFor();
      assert.equal(officeOriginalDownloads, downloadsBefore, 'Full layout must not download the original again in the browser');
      assert.equal(officeConversions, conversionsBefore + 1);
      assert.equal(await viewer.getByRole("heading", {name:"Pratinjau belum tersedia untuk format ini"}).count(),0);
      assert(await viewer.getByLabel("Nomor halaman").count());
    }
    if (name.endsWith(".xlsx")) {
      await viewer.getByRole("tab", {name:"Dokumen",exact:true}).waitFor();
      await viewer.getByRole("button", {name:"A2: Manual Mutu",exact:true}).click();
      assert.equal(await viewer.locator('.sheet-inspector output').textContent(), "Manual Mutu");
      await page.keyboard.press("ArrowRight");
      assert.equal(await viewer.locator('.sheet-inspector output').textContent(), "8");
      await viewer.getByRole("tab", {name:"Unit",exact:true}).click();
      await viewer.getByRole("button", {name:"A2: Unit pengujian",exact:true}).waitFor();
      assert.equal(await viewer.getByRole("textbox").count(),0);
    }
    if (name.endsWith(".bin")) await viewer.getByText("Isi biner",{exact:false}).waitFor();
    await page.screenshot({path:`artifacts/viewer-${width}-${name.split('.').pop()}.png`});
    await page.keyboard.press("Escape");
    await viewer.waitFor({state:"detached"});
    assert.equal(await page.evaluate(() => document.body.style.overflow), "");
    assert(await trigger.evaluate(node => document.activeElement === node));
  }
  denyStorage = true;
  await page.getByRole("button",{name:"Catatan.txt",exact:true}).click();
  await page.getByRole("heading",{name:"Dokumen belum dapat dibuka"}).waitFor();
  assert.equal(await page.getByRole('heading',{name:'Dokumen belum dapat dibuka'}).count(), 1);
  denyStorage = false;
  await page.getByRole("button",{name:"Coba lagi",exact:true}).click();
  await page.locator('.viewer-text').waitFor();
  await page.keyboard.press("Escape");
  failStorage = true;
  await page.getByRole("button",{name:"Catatan.txt",exact:true}).click();
  await page.getByText(/Koneksi ke penyimpanan gagal/).waitFor();
  assert.equal(await page.getByRole('heading',{name:'Dokumen belum dapat dibuka'}).count(), 1);
  failStorage = false;
  await page.getByRole("button",{name:"Coba lagi",exact:true}).click();
  await page.locator('.viewer-text').waitFor();
  await page.keyboard.press("Escape");
  delayStorage = true;
  await page.getByRole("button",{name:"Catatan.txt",exact:true}).click();
  await page.getByRole('progressbar', { name: 'Memuat bagian file' }).waitFor();
  assert.equal(await page.locator('.preview-progress').getAttribute('value'), '0');
  await page.screenshot({path:`artifacts/preview-loading-${width}.png`});
  await page.getByRole("button",{name:"Tutup pratinjau"}).click();
  await page.waitForTimeout(600);
  assert.equal(await page.locator('.file-viewer').count(), 0);
  delayStorage = false;
  await page.getByRole("button", { name: "Unggah file", exact: true }).click();
  await page.getByRole("heading", { name: "Unggah dokumen" }).waitFor();
  await page.screenshot({
    path: `artifacts/upload-${width}-dark.png`,
    fullPage: true, animations: "disabled",
  });
  await page.getByRole("button", { name: "Tutup dialog", exact: true }).click();
  await page.getByRole("button", { name: "Aktifkan tema terang" }).click();
  await page.reload();
  await page.getByRole("heading", { name: "Ringkasan TPMPS", exact: true }).waitFor();
  assert.equal(
    await page.evaluate(() => document.documentElement.dataset.theme),
    "light",
  );
  async function menu(name) {
    if (width <= 760) await page.getByRole("button", {name:"Buka menu"}).click();
    await page.locator('.sidebar').getByRole("button",{name,exact:true}).click();
  }
  for (const [menuName, heading] of [["Pengguna","Pengguna"],["Unit sekolah","Unit sekolah"],["Periode","Periode sekolah"]]) {
    await menu(menuName);
    await page.getByRole("heading",{name:heading,exact:true}).waitFor();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `admin overflow ${width}`);
    await page.getByRole("button", {name:`Tambah ${heading.toLowerCase()}`,exact:true}).click();
    await page.getByRole("button", {name:`Kembali ke ${heading.toLowerCase()}`}).click();
  }
  if (width > 760) {
    await page.getByRole("button",{name:"Ringkas navigasi"}).click();
    await page.waitForFunction(() => document.querySelector(".sidebar").getBoundingClientRect().width < 100);
    await menu("Dokumen");
    await page.getByRole("button",{name:"Perluas navigasi"}).click();
  } else {
    await page.getByRole("button",{name:"Buka menu"}).click();
    await page.keyboard.press("Escape");
    assert.equal(await page.evaluate(() => document.body.style.overflow), "");
  }
  for (const role of ["kepala_sekolah","ketua_tpmps","kepala_unit"]) {
    fixture.profiles[0].role = role;
    fixture.profiles[0].unit_id = role === "kepala_unit" ? "u1" : null;
    await page.reload();
    await page.getByRole("heading", {name:"Ringkasan TPMPS",exact:true}).waitFor();
    assert.equal(await page.locator('.sidebar').getByRole("button",{name:"Pengguna",exact:true}).count(),0);
    await menu("Dokumen");
    await page.locator('.folder-open').filter({hasText:role === "kepala_unit" ? "Catatan Mutu" : "Manual Mutu"}).click();
    assert.equal(await page.getByRole("button",{name:"Unggah file",exact:true}).count(),role === "kepala_sekolah" ? 0 : 1);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `role overflow ${role} ${width}`);
  }
  await menu("Ringkasan TPMPS");
  await page.setViewportSize({width:Math.max(320,Math.floor(width / 2)),height:480});
  await page.emulateMedia({reducedMotion:"reduce"});
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `narrow/short overflow ${width}`);
  assert(await page.locator('.main-shell').evaluate(node => node.scrollHeight > node.clientHeight), `short viewport scroll ${width}`);
  await page.locator('.main-shell').evaluate(node => node.scrollTop = 100);
  assert(await page.locator('.main-shell').evaluate(node => node.scrollTop > 0));
  await page.locator('.recent-card').first().click();
  await page.locator('.file-viewer').waitFor();
  assert.equal((await page.locator('.file-viewer').boundingBox()).height,480);
  await page.getByRole("button",{name:"Tutup pratinjau"}).click();
  fixture.profiles[0].role = "superadmin";
  fixture.profiles[0].unit_id = null;
  await context.close();
}
await browser.close();
server?.kill();
assert.deepEqual(issues, []);
console.log(
  `Browser ${widths.join('/')}px, dark/light, four roles, CRUD forms, animated controls, drawer/collapse, main/table/sidebar scroll, PDF/image/text/Office/binary fullscreen viewers, direct DOCX/PPTX reading, slide navigation, optional full layout, download, denied storage/retry, network failure/retry, loading progress, no duplicate Office downloads, safe text, zoom, close-during-load, focus/scroll restoration and short/reduced-motion checks passed (mocked transport).`,
);
