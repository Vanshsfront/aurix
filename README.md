# AURIX

A premium marketing site + demo shop for **AURIX**, a new-category ready-to-drink
cocktail brand — _"where indulgence evolves."_ Dark-and-gold minimal aesthetic,
with a **3D can** built from the real label artwork floating at the centre of the
experience and morphing between flavours.

## Highlights

- **Floating 3D can** (React Three Fiber) — the supplied 2D label dieline is
  wrapped around a cylinder; it floats, rotates, reacts to the cursor, and
  **crossfades its label** between flavours via a custom shader.
- **Three flavours** — Rasmalai (gold), Gulab (rose), Masala Chai (copper).
  Each shares the black + gold system with its own accent that propagates through
  the site (`--flavour` CSS variable).
- **Demo shop** — product listing, dynamic product pages (with Product JSON-LD),
  cart drawer + page, and a **simulated checkout** → order confirmation. No
  backend, no real payments; cart persists in `localStorage`.
- **Premium details** — age gate, scroll-reveal editorial sections, reduced-motion
  fallback, mobile sticky add-to-cart with safe-area inset, and responsive layouts.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
three / @react-three/fiber / @react-three/drei · framer-motion · sharp (build-time).

## Getting started

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```

## Texture pipeline

The can labels and gold lid are generated from the source dieline
(`~/Downloads/Gemini Generated Image 2D Map.png`) by:

```bash
node scripts/build-textures.mjs
```

This crops the clean Rasmalai label, extracts the gold can-top, and composites the
Gulab + Masala Chai labels (shared AURIX wordmark + gold botanical, flavour name in
its accent) into `public/textures/`. The committed PNGs already exist; re-run the
script only if you change the source art or layout.

## Structure

```
app/                     routes: / · /shop · /products/[slug] · /cart · /checkout · /checkout/confirmation
components/scene/        FloatingCan → CanScene → Can (R3F)
components/layout/       Navbar, Footer
components/{home,shop,product,cart,ui}/
context/                 FlavourProvider (active can label) · CartProvider (reducer + localStorage)
lib/products.ts          the three flavours + pack variants (front-end data)
scripts/build-textures.mjs   label/can-top texture generation
public/textures/         generated can textures
```

## Notes

- Checkout is a demonstration only — it takes no payment and stores the last order
  in `sessionStorage` to render the confirmation page.
- `scripts/shot.mjs` is a dev-only Puppeteer screenshot helper (pre-accepts the age
  gate, enables software WebGL).
