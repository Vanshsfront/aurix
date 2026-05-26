// AURIX — texture pipeline
// Builds the can wrap-labels + can-top texture from the source dieline.
//
//   node scripts/build-textures.mjs
//
// All three labels (incl. Rasmalai) are composited from ONE template so the
// cans are visually identical in style: shared AURIX wordmark + gold botanical,
// flavour name in that flavour's accent, and a fully-printed wrap (front block +
// botanical + side/back text) so the rotating can never shows empty black.
//
// Output: public/textures/labels/{rasmalai,gulab,masala-chai}.png + can-top.png
// All labels share one size (1370x995, ratio 1.377). Re-runnable; overwrites.

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(process.env.HOME, "Downloads", "Gemini Generated Image 2D Map.png");
const OUT = join(ROOT, "public", "textures");
const LABELS = join(OUT, "labels");

const W = 1370;
const H = 995;
const BG = "#1d1c1d"; // sampled label black

// Gold botanical motif (no text) — widened for a fuller print.
const BOTANICAL = { left: 1150, top: 295, width: 478, height: 885 };
const BOT_LEFT = 700; // x position on the label

const FLAVOURS = {
  rasmalai: { name: "RASMALAI", notes: ["SAFFRON", "CARDAMOM", "ALMOND"], accent: "#d99a8b" },
  gulab: { name: "GULAB", notes: ["ROSE", "GULKAND", "PISTACHIO"], accent: "#c97b86" },
  "masala-chai": { name: "MASALA CHAI", notes: ["CARDAMOM", "CINNAMON", "CLOVE"], accent: "#bd8a5e" },
};

const SANS = "Avenir Next, Futura, Helvetica Neue, sans-serif";
const ROMAN = "Trajan Pro, Optima, Didot, serif";

function labelSvg(name, notes, accent) {
  const x = 150; // left text column
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f0caa0"/>
      <stop offset="0.5" stop-color="#cf9a6a"/>
      <stop offset="1" stop-color="#9a6f48"/>
    </linearGradient>
  </defs>

  <!-- Front block -->
  <text x="${x}" y="170" font-family="${ROMAN}" font-size="86" letter-spacing="20" fill="url(#gold)">AURIX</text>
  <text x="${x + 4}" y="295" font-family="${SANS}" font-size="54" font-weight="400" letter-spacing="12" fill="${accent}">${name}</text>
  <text x="${x + 4}" y="350" font-family="${SANS}" font-size="34" font-weight="300" letter-spacing="14" fill="#cf9a6a">COCKTAIL</text>
  <rect x="${x + 5}" y="392" width="120" height="1.5" fill="#9a6f48"/>
  <text x="${x + 5}" y="455" font-family="${SANS}" font-size="30" font-weight="300" letter-spacing="8" fill="#e7dcc6">${notes[0]}</text>
  <text x="${x + 5}" y="500" font-family="${SANS}" font-size="30" font-weight="300" letter-spacing="8" fill="#e7dcc6">${notes[1]}</text>
  <text x="${x + 5}" y="545" font-family="${SANS}" font-size="30" font-weight="300" letter-spacing="8" fill="#e7dcc6">${notes[2]}</text>
  <text x="${x + 5}" y="770" font-family="${SANS}" font-size="34" font-weight="300" letter-spacing="4" fill="#cf9a6a">110 ml</text>
  <text x="${x + 5}" y="815" font-family="${SANS}" font-size="24" font-weight="300" letter-spacing="6" fill="#8d8678">ALC. 7% VOL.</text>
  <text x="${x + 5}" y="915" font-family="${SANS}" font-size="22" font-weight="300" letter-spacing="14" fill="#8d8678">PREMIUM COCKTAIL</text>

  <!-- Left side: functional standard (vertical) -->
  <text x="78" y="905" transform="rotate(-90 78 905)" font-family="${SANS}" font-size="19"
        font-weight="300" letter-spacing="6" fill="#6f615a">MARINE COLLAGEN · ESSENTIAL MINERALS · TARGETED VITAMINS</text>

  <!-- Right/back: brand line (vertical) -->
  <text x="1300" y="880" transform="rotate(-90 1300 880)" font-family="${SANS}" font-size="26"
        font-weight="300" letter-spacing="10" fill="#8d7864">WHERE INDULGENCE EVOLVES</text>
  <text x="1340" y="700" transform="rotate(-90 1340 700)" font-family="${SANS}" font-size="16"
        font-weight="300" letter-spacing="5" fill="#6f615a">CONSIDERED · INTENTIONAL · PURE</text>
</svg>`);
}

async function buildCanTop() {
  await sharp(SRC)
    .extract({ left: 965, top: 1330, width: 455, height: 455 })
    .png()
    .toFile(join(OUT, "can-top.png"));
  console.log("✓ can-top.png");
}

let cachedBotanical = null;
async function botanicalLayer() {
  if (cachedBotanical) return cachedBotanical;
  const crushed = await sharp(SRC)
    .extract(BOTANICAL)
    .linear(1.4, -42)
    .resize({ height: 900 })
    .toBuffer();
  const m = await sharp(crushed).metadata();
  const fade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${m.width}" height="${m.height}">
    <defs><linearGradient id="f" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity="1"/>
      <stop offset="0.12" stop-color="#000" stop-opacity="1"/>
      <stop offset="0.32" stop-color="#000" stop-opacity="0"/>
    </linearGradient></defs>
    <rect width="${m.width}" height="${m.height}" fill="url(#f)"/>
  </svg>`);
  const buf = await sharp(crushed).composite([{ input: fade, blend: "over" }]).toBuffer();
  cachedBotanical = { buf, meta: await sharp(buf).metadata() };
  return cachedBotanical;
}

async function buildLabel(slug) {
  const { name, notes, accent } = FLAVOURS[slug];
  const { buf, meta } = await botanicalLayer();
  await sharp({ create: { width: W, height: H, channels: 3, background: BG } })
    .composite([
      { input: buf, left: BOT_LEFT, top: Math.round((H - meta.height) / 2), blend: "screen" },
      { input: labelSvg(name, notes, accent), left: 0, top: 0, blend: "over" },
    ])
    .png()
    .toFile(join(LABELS, `${slug}.png`));
  console.log(`✓ ${slug}.png`);
}

async function main() {
  await mkdir(LABELS, { recursive: true });
  await buildCanTop();
  for (const slug of Object.keys(FLAVOURS)) await buildLabel(slug);
  console.log("\nAll textures written to public/textures/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
