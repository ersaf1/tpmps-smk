import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
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
const issues = [];
for (const width of [1440, 390]) {
  const context = await browser.newContext({
    viewport: { width, height: 1000 },
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => issues.push(e.message));
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
  await page.route("**/rest/v1/**", async (route) => {
    const url = new URL(route.request().url());
    const table = url.pathname.split("/").pop();
    let value =
      table === "server_clock" ? "2026-10-02T05:00:00Z" : fixture[table] || [];
    if (table === "profiles" && url.searchParams.has("id"))
      value = fixture.profiles[0];
    return route.fulfill({ json: value });
  });
  await page.goto(base);
  await page.getByRole("heading", { name: "Sistem Informasi TPMPS" }).waitFor();
  for (const theme of ["dark", "light"]) {
    if (theme === "light")
      await page.getByRole("button", { name: "Aktifkan tema terang" }).click();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: `artifacts/login-${width}-${theme}.png`,
      fullPage: true,
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
  await page.getByRole("heading", { name: "Dashboard", exact: true }).waitFor();
  for (const theme of ["dark", "light"]) {
    if (theme === "light")
      await page.getByRole("button", { name: "Aktifkan tema terang" }).click();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: `artifacts/dashboard-${width}-${theme}.png`,
      fullPage: true,
    });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `dashboard overflow ${width}`,
    );
  }
  if (width === 390)
    await page.getByRole("button", { name: "Buka menu" }).click();
  await page.getByRole("button", { name: "File Manager", exact: true }).click();
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
    fullPage: true,
  });
  await page.getByRole("button", { name: "Tampilan daftar" }).click();
  await page.screenshot({
    path: `artifacts/list-${width}-dark.png`,
    fullPage: true,
  });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    `files overflow ${width}`,
  );
  await page.getByRole("button", { name: "Unggah file", exact: true }).click();
  await page.getByRole("heading", { name: "Unggah dokumen" }).waitFor();
  await page.screenshot({
    path: `artifacts/upload-${width}-dark.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Tutup dialog", exact: true }).click();
  await page.getByRole("button", { name: "Aktifkan tema terang" }).click();
  await page.reload();
  await page.getByRole("heading", { name: "Dashboard", exact: true }).waitFor();
  assert.equal(
    await page.evaluate(() => document.documentElement.dataset.theme),
    "light",
  );
  await context.close();
}
await browser.close();
server?.kill();
assert.deepEqual(issues, []);
console.log(
  "Browser desktop/mobile, dark/light, login, navigation, list, upload dialog, persistence and overflow checks passed (mocked transport).",
);
