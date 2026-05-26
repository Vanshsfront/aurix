// AURIX product catalogue — front-end demo data (no backend).
// Three flavours in the "warm cohesive trio": shared black + gold system,
// each with its own accent.

export type PackKey = "single" | "pack4" | "pack12";

export interface Variant {
  key: PackKey;
  label: string;
  count: number;
  price: number; // USD, display format
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  /** Tasting notes shown on the label. */
  notes: string[];
  /** Short one-line description for cards. */
  description: string;
  /** Long-form copy for the product page. */
  story: string;
  /** Base spirit / build note. */
  build: string;
  /** Functional ingredients — the AURIX standard. */
  functional: string[];
  accent: string; // hex
  accentRgb: [number, number, number];
  abv: number;
  volume: string;
  /** Wrap-label texture used by the 3D can. */
  label: string;
  variants: Variant[];
  related: string[];
}

const BASE_VARIANTS = (): Variant[] => [
  { key: "single", label: "Single Can", count: 1, price: 11 },
  { key: "pack4", label: "Quartet · 4 Cans", count: 4, price: 40 },
  { key: "pack12", label: "Case · 12 Cans", count: 12, price: 108 },
];

export const PRODUCTS: Product[] = [
  {
    slug: "rasmalai",
    name: "Rasmalai",
    tagline: "Saffron-kissed silk.",
    notes: ["Saffron", "Cardamom", "Almond"],
    description:
      "Single-origin saffron, green cardamom and toasted almond, folded into a velvet pour.",
    story:
      "Inspired by the dessert it is named for, Rasmalai opens with single-origin saffron and the cool lift of green cardamom, then settles into toasted almond and a whisper of cream. A velvet texture engineered to linger — clean, refined, and quietly indulgent.",
    build: "Bar-quality blanco base · 7% ABV",
    functional: ["Marine collagen", "Essential minerals", "Targeted vitamins"],
    accent: "#d99a8b",
    accentRgb: [217, 154, 139],
    abv: 7,
    volume: "110 ml",
    label: "/textures/labels/rasmalai.png",
    variants: BASE_VARIANTS(),
    related: ["gulab", "masala-chai"],
  },
  {
    slug: "gulab",
    name: "Gulab",
    tagline: "Persian rose, slow and low.",
    notes: ["Rose", "Gulkand", "Pistachio"],
    description:
      "Damask rose and gulkand preserve over pistachio cream — floral, faintly sweet, impossibly smooth.",
    story:
      "Gulab is built on damask rose and gulkand — the rose-petal preserve — layered over a soft pistachio cream. Floral and faintly sweet, it stays composed from first sip to finish: perfume without excess, sweetness held in restraint.",
    build: "Bar-quality blanco base · 7% ABV",
    functional: ["Marine collagen", "Essential minerals", "Targeted vitamins"],
    accent: "#c97b86",
    accentRgb: [201, 123, 134],
    abv: 7,
    volume: "110 ml",
    label: "/textures/labels/gulab.png",
    variants: BASE_VARIANTS(),
    related: ["rasmalai", "masala-chai"],
  },
  {
    slug: "masala-chai",
    name: "Masala Chai",
    tagline: "Spice, warmth, restraint.",
    notes: ["Cardamom", "Cinnamon", "Clove"],
    description:
      "Slow-steeped chai spices built into a warming, late-evening serve.",
    story:
      "Masala Chai is a study in warmth: cardamom, cinnamon and clove, slow-steeped and balanced so no single spice dominates. A late-evening serve — comforting, layered, and engineered to feel lighter than it tastes.",
    build: "Bar-quality dark base · 7% ABV",
    functional: ["Marine collagen", "Essential minerals", "Targeted vitamins"],
    accent: "#bd8a5e",
    accentRgb: [189, 138, 94],
    abv: 7,
    volume: "110 ml",
    label: "/textures/labels/masala-chai.png",
    variants: BASE_VARIANTS(),
    related: ["rasmalai", "gulab"],
  },
];

export const DEFAULT_SLUG = "rasmalai";

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRelated(slug: string): Product[] {
  const p = getProductBySlug(slug);
  if (!p) return [];
  return p.related
    .map(getProductBySlug)
    .filter((x): x is Product => Boolean(x));
}

export function formatPrice(usd: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(usd);
}
