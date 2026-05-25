// Dev screenshot helper (verification only).
//   node scripts/shot.mjs <path> <out.png> [scrollY] [waitMs] [width] [height]
// Pre-accepts the age gate, enables software WebGL, waits for the scene.

import puppeteer from "puppeteer-core";

const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const [, , path = "/", out = "/tmp/shot.png", scrollY = "0", waitMs = "3500", w = "1440", h = "900"] =
  process.argv;

const url = `http://localhost:3000${path}`;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--hide-scrollbars",
    `--window-size=${w},${h}`,
  ],
  defaultViewport: { width: Number(w), height: Number(h), deviceScaleFactor: 1 },
});

const page = await browser.newPage();
await page.evaluateOnNewDocument(() => {
  try {
    localStorage.setItem("aurix-age-ok", "1");
  } catch {}
});
await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
if (Number(scrollY) > 0) {
  await page.evaluate((y) => window.scrollTo(0, y), Number(scrollY));
}
await new Promise((r) => setTimeout(r, Number(waitMs)));
await page.screenshot({ path: out });
await browser.close();
console.log("wrote", out);
