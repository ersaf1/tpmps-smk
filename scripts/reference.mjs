import { chromium } from "@playwright/test";
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(
  "https://app.uizard.io/templates/5EK6jQgEGjtPVwXy0MyO/preview",
  { waitUntil: "domcontentloaded", timeout: 60000 },
);
await page.waitForTimeout(5000);
await page.getByText("Got it", { exact: true }).click();
await page.getByText("Overview", { exact: true }).click();
await page.waitForTimeout(1000);
const boards = await page
  .locator('[class*="NodeArtboardstyles__Artboard-sc"]')
  .elementHandles();
for (let i = 0; i < boards.length; i++) {
  const board = boards[i];
  await board.evaluate((el) => {
    el.style.position = "fixed";
    el.style.left = "0";
    el.style.top = "0";
    el.style.width = "1440px";
    el.style.height = "900px";
    el.style.zIndex = "999999";
    document.body.appendChild(el);
  });
  await board.screenshot({ path: `artifacts/reference-screen-${i}.png` });
  await board.evaluate((el) => el.remove());
}
await browser.close();
