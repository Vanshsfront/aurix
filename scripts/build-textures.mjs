// AURIX — texture pipeline
// Builds the can wrap-labels + can-top texture from the source dieline.
//
//   node scripts/build-textures.mjs
//
// - Rasmalai: direct clean crop of the supplied artwork (gold botanical kept).
// - Gulab / Masala Chai: composited from the same gold botanical motif + AURIX
//   wordmark, with the flavour name rendered in that flavour's accent. This keeps
//   the trio visually cohesive (shared black + gold system) while differentiating.
//
// Output: public/textures/labels/{rasmalai,gulab,masala-chai}.png + can-top.png
// All labels share one size (1370x995, ratio 1.377) so they wrap the cylinder
// identically. Re-runnable; overwrites outputs.

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(process.env.HOME, "Downloads", "Gemini Generated Image 2D Map.png");
const OUT = join(ROOT, "public", "textures");
const LABELS = join(OUT, "labels");

// Clean label rectangle inside all dieline guide lines (ratio ~1.377:1).
const LABEL = { left: 270, top: 240, width: 1370, height: 995 };
const W = LABEL.width;
const H = LABEL.height;
const BG = "#1d1c1d"; // sampled label black

// Gold botanical motif (no text), reused across the trio.
const BOTANICAL = { left: 1255, top: 295, width: 330, height: 885 };

const ACCENTS = {
  gulab: "#c16a82",
  "masala-chai": "#b5703a",
};

const GENERATED = {
  gulab: { name: "GULAB", notes: ["ROSE", "GULKAND", "PISTACHIO"] },
  "masala-chai": { name: "MASALA CHAI", notes: ["CARDAMOM", "CINNAMON", "CLOVE"] },
};

const SANS = "Avenir Next, Futura, Helvetica Neue, sans-serif";
const ROMAN = "Trajan Pro, Optima, Didot, serif";

function labelSvg(name, notes, accent) {
  const x = 150; // left text column
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e6cd8e"/>
      <stop offset="0.5" stop-color="#c9a24b"/>
      <stop offset="1" stop-color="#9a7b33"/>
    </linearGradient>
  </defs>
  <text x="${x}" y="170" font-family="${ROMAN}" font-size="86" letter-spacing="20"
        fill="url(#gold)">AURIX</text>

  <text x="${x + 4}" y="295" font-family="${SANS}" font-size="54" font-weight="400"
        letter-spacing="12" fill="${accent}">${name}</text>
  <text x="${x + 4}" y="350" font-family="${SANS}" font-size="34" font-weight="300"
        letter-spacing="14" fill="#c9a24b">COCKTAIL</text>

  <rect x="${x + 5}" y="392" width="120" height="1.5" fill="#9a7b33"/>

  <text x="${x + 5}" y="455" font-family="${SANS}" font-size="30" font-weight="300"
        letter-spacing="8" fill="#e7dcc6">${notes[0]}</text>
  <text x="${x + 5}" y="500" font-family="${SANS}" font-size="30" font-weight="300"
        letter-spacing="8" fill="#e7dcc6">${notes[1]}</text>
  <text x="${x + 5}" y="545" font-family="${SANS}" font-size="30" font-weight="300"
        letter-spacing="8" fill="#e7dcc6">${notes[2]}</text>

  <text x="${x + 5}" y="770" font-family="${SANS}" font-size="34" font-weight="300"
        letter-spacing="4" fill="#c9a24b">110 ml</text>
  <text x="${x + 5}" y="815" font-family="${SANS}" font-size="24" font-weight="300"
        letter-spacing="6" fill="#8d8678">ALC. 7% VOL.</text>

  <text x="${x + 5}" y="915" font-family="${SANS}" font-size="22" font-weight="300"
        letter-spacing="14" fill="#8d8678">PREMIUM COCKTAIL</text>
</svg>`);
}

async function buildRasmalai() {
  await sharp(SRC)
    .extract(LABEL)
    .png()
    .toFile(join(LABELS, "rasmalai.png"));
  console.log("✓ rasmalai.png");
}

async function buildCanTop() {
  await sharp(SRC)
    .extract({ left: 965, top: 1330, width: 455, height: 455 })
    .png()
    .toFile(join(OUT, "can-top.png"));
  console.log("✓ can-top.png");
}

async function buildGenerated(slug) {
  const { name, notes } = GENERATED[slug];
  const accent = ACCENTS[slug];

  // Gold botanical: crush the dark background to true black so a screen blend
  // adds only the gold linework (no lightened box around the motif).
  const crushed = await sharp(SRC)
    .extract(BOTANICAL)
    .linear(1.4, -42)
    .resize({ height: 900 })
    .toBuffer();
  const cMeta = await sharp(crushed).metadata();

  // Feather the left edge to black — erases any stray artwork at the crop edge
  // and lets the motif dissolve elegantly into the label background.
  const fade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cMeta.width}" height="${cMeta.height}">
    <defs><linearGradient id="f" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity="1"/>
      <stop offset="0.10" stop-color="#000" stop-opacity="1"/>
      <stop offset="0.30" stop-color="#000" stop-opacity="0"/>
    </linearGradient></defs>
    <rect width="${cMeta.width}" height="${cMeta.height}" fill="url(#f)"/>
  </svg>`);
  const botanical = await sharp(crushed)
    .composite([{ input: fade, blend: "over" }])
    .toBuffer();
  const botMeta = await sharp(botanical).metadata();

  await sharp({ create: { width: W, height: H, channels: 3, background: BG } })
    .composite([
      {
        input: botanical,
        left: W - botMeta.width - 70,
        top: Math.round((H - botMeta.height) / 2),
        blend: "screen",
      },
      { input: labelSvg(name, notes, accent), left: 0, top: 0, blend: "over" },
    ])
    .png()
    .toFile(join(LABELS, `${slug}.png`));
  console.log(`✓ ${slug}.png`);
}

async function main() {
  await mkdir(LABELS, { recursive: true });
  await buildRasmalai();
  await buildCanTop();
  await buildGenerated("gulab");
  await buildGenerated("masala-chai");
  console.log("\nAll textures written to public/textures/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
