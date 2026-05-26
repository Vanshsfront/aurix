"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { Loader } from "@/components/Loader";
import { useCart } from "@/context/CartProvider";
import {
  getAllProducts,
  getProductBySlug,
  formatPrice,
} from "@/lib/products";
import { scrollStore, flavourForProgress } from "@/lib/scrollStore";

const ExperienceCanvas = dynamic(
  () => import("@/components/scene/ExperienceCanvas").then((m) => m.ExperienceCanvas),
  { ssr: false },
);

export function ScrollExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  // A single stable progress MotionValue that every section binds to.
  const progress = useMotionValue(0);

  // Cursor → scroll store (for can hover/parallax). No React state.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      scrollStore.px = (e.clientX / window.innerWidth) * 2 - 1;
      scrollStore.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Feed the render loop + drive the live flavour (and site accent) by scroll.
  // No React state here — keeps the component from re-rendering on scroll.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.set(v);
    scrollStore.progress = v;
    const next = flavourForProgress(v);
    if (next !== scrollStore.flavour) {
      scrollStore.flavour = next;
      const accent = getProductBySlug(next)?.accent;
      if (accent)
        document.documentElement.style.setProperty("--flavour", accent);
    }
  });

  return (
    <div ref={ref}>
      <Loader />
      <ExperienceCanvas />

      {/* Fixed UI chrome */}
      <div className="pointer-events-none fixed inset-0 z-10">
        <span className="absolute left-[var(--spacing-gutter)] top-24 text-[0.6rem] uppercase tracking-[0.3em] text-mute-2">
          AURIX · Target Pure
        </span>
        <Progress progress={progress} />

        <Intro progress={progress} />
        <Brand progress={progress} />
        <Benefits progress={progress} />
        <FlavourBeat progress={progress} slug="gulab" range={[0.5, 0.56, 0.6, 0.64]} side="right" />
        <FlavourBeat progress={progress} slug="masala-chai" range={[0.64, 0.7, 0.74, 0.78]} side="left" />
        <Shop progress={progress} />
      </div>

      {/* Scroll track — provides the scroll distance */}
      <div style={{ height: "740vh" }} aria-hidden />
    </div>
  );
}

/* ----------------------------- Chrome ----------------------------- */

function Progress({ progress }: { progress: MotionValue<number> }) {
  const h = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div className="absolute right-[var(--spacing-gutter)] top-1/2 hidden h-32 w-px -translate-y-1/2 bg-line md:block">
      <motion.div
        style={{ height: h }}
        className="w-px bg-gradient-to-b from-gold-light to-gold-deep"
      />
    </div>
  );
}

/* ----------------------------- Sections ----------------------------- */

function Intro({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.06, 0.12], [1, 1, 0]);
  const y = useTransform(progress, [0, 0.12], [0, -50]);
  return (
    <motion.section style={{ opacity, y }} className="absolute inset-0 text-center">
      <p className="eyebrow absolute left-1/2 top-28 -translate-x-1/2 md:top-32">
        A new category of indulgence
      </p>
      <div className="absolute bottom-[7%] left-1/2 w-full -translate-x-1/2 px-6">
        <h1 className="font-serif text-4xl italic leading-none text-ivory md:text-6xl">
          Where indulgence <span className="text-gold-gradient">evolves.</span>
        </h1>
        <div className="mt-6 flex flex-col items-center gap-2 text-mute-2">
          <span className="text-[0.55rem] uppercase tracking-[0.4em]">Scroll</span>
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold/70 to-transparent" />
        </div>
      </div>
    </motion.section>
  );
}

function Brand({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.12, 0.17, 0.28, 0.33], [0, 1, 1, 0]);
  const lx = useTransform(progress, [0.12, 0.2], ["-130%", "0%"]);
  const rx = useTransform(progress, [0.12, 0.2], ["130%", "0%"]);
  return (
    <motion.section style={{ opacity }} className="absolute inset-0">
      {/* Left capsule */}
      <motion.div
        style={{ x: lx }}
        className="absolute left-0 top-1/2 max-w-md -translate-y-1/2 rounded-r-full border border-line/60 bg-ink-2/70 py-12 pl-[var(--spacing-gutter)] pr-16 backdrop-blur-xl"
      >
        <p className="eyebrow">The Origin</p>
        <p className="mt-4 font-serif text-3xl italic leading-tight text-ivory md:text-4xl">
          Born from a contradiction.
        </p>
      </motion.div>

      {/* Right capsule */}
      <motion.div
        style={{ x: rx }}
        className="absolute right-0 top-1/2 max-w-sm -translate-y-1/2 rounded-l-full border border-line/60 bg-ink-2/70 py-12 pr-[var(--spacing-gutter)] pl-16 text-right backdrop-blur-xl"
      >
        <p className="text-sm leading-relaxed text-cream/80">
          Bar-quality spirits, layered flavour, and functional ingredients —
          composed to feel lighter, cleaner, and more refined than any ordinary
          ready-to-drink cocktail.
        </p>
        <p className="mt-4 text-[0.6rem] uppercase tracking-[0.3em] text-gold">
          Considered · Intentional
        </p>
      </motion.div>
    </motion.section>
  );
}

const BENEFITS = [
  { t: "Marine Collagen", pos: "left-[8%] top-[26%]" },
  { t: "Essential Minerals", pos: "left-[6%] top-1/2 -translate-y-1/2" },
  { t: "Targeted Vitamins", pos: "left-[8%] bottom-[26%]" },
  { t: "Bar-Quality Spirit", pos: "right-[8%] top-[26%]" },
  { t: "Velvet Texture", pos: "right-[6%] top-1/2 -translate-y-1/2" },
  { t: "7% ABV · 110ml", pos: "right-[8%] bottom-[26%]" },
];

function Benefits({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.33, 0.39, 0.45, 0.5], [0, 1, 1, 0]);
  const scale = useTransform(progress, [0.33, 0.42], [0.9, 1]);
  const ringRotate = useTransform(progress, [0.33, 0.5], [0, 40]);
  return (
    <motion.section style={{ opacity }} className="absolute inset-0">
      {/* ring */}
      <motion.div
        style={{ scale, rotate: ringRotate }}
        className="ring-rosegold absolute left-1/2 top-1/2 h-[68vmin] w-[68vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border"
      />
      <motion.div style={{ scale }} className="absolute inset-0">
        <p className="absolute left-1/2 top-[12%] -translate-x-1/2 text-[0.6rem] uppercase tracking-[0.4em] text-gold">
          The Functional Standard
        </p>
        {BENEFITS.map((b) => (
          <span
            key={b.t}
            className={`absolute ${b.pos} capsule border border-line/60 bg-ink-2/70 px-5 py-2.5 text-[0.62rem] uppercase tracking-[0.18em] text-cream backdrop-blur-md`}
          >
            {b.t}
          </span>
        ))}
        <p className="absolute bottom-[12%] left-1/2 max-w-xs -translate-x-1/2 text-center text-xs leading-relaxed text-mute">
          Functionality is not an add-on. It is part of the ritual — integrated
          subtly, never overpowering.
        </p>
      </motion.div>
    </motion.section>
  );
}

function FlavourBeat({
  progress,
  slug,
  range,
  side,
}: {
  progress: MotionValue<number>;
  slug: string;
  range: [number, number, number, number];
  side: "left" | "right";
}) {
  const p = getProductBySlug(slug)!;
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const x = useTransform(
    progress,
    [range[0], range[1]],
    [side === "left" ? -60 : 60, 0],
  );
  return (
    <motion.section style={{ opacity }} className="absolute inset-0">
      <motion.div
        style={{ x }}
        className={`absolute top-1/2 max-w-sm -translate-y-1/2 px-[var(--spacing-gutter)] ${
          side === "left" ? "left-0 text-left" : "right-0 text-right"
        }`}
      >
        <p
          className="text-[0.65rem] uppercase tracking-[0.35em]"
          style={{ color: p.accent }}
        >
          {p.notes.join(" · ")}
        </p>
        <h2 className="mt-4 font-serif text-6xl italic leading-none text-ivory md:text-7xl">
          {p.name}
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-cream/80">{p.tagline}</p>
        <p className="mt-3 text-xs leading-relaxed text-mute">{p.description}</p>
      </motion.div>
    </motion.section>
  );
}

function Shop({ progress }: { progress: MotionValue<number> }) {
  const products = getAllProducts();
  const panelOpacity = useTransform(progress, [0.78, 0.83], [0, 1]);
  const heading = useTransform(progress, [0.78, 0.82], [30, 0]);

  return (
    <motion.section
      style={{ opacity: panelOpacity }}
      className="pointer-events-none absolute inset-0 flex items-center justify-end"
    >
      {/* Scrim so the list reads over the can (esp. on mobile) */}
      <div className="absolute inset-0 bg-gradient-to-l from-ink via-ink/85 to-transparent md:via-ink/45" />
      <div className="pointer-events-auto relative flex w-full max-w-xl flex-col gap-6 px-[var(--spacing-gutter)] md:mr-6">
        <motion.div style={{ y: heading }}>
          <p className="eyebrow">The Collection</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight text-ivory md:text-5xl">
            Add to your ritual.
          </h2>
        </motion.div>

        {products.map((prod, i) => (
          <ShopRow
            key={prod.slug}
            progress={progress}
            index={i}
            slug={prod.slug}
          />
        ))}
      </div>
    </motion.section>
  );
}

function ShopRow({
  progress,
  index,
  slug,
}: {
  progress: MotionValue<number>;
  index: number;
  slug: string;
}) {
  const prod = getProductBySlug(slug)!;
  const { add } = useCart();
  const start = 0.82 + index * 0.045;
  const opacity = useTransform(progress, [start, start + 0.03], [0, 1]);
  const x = useTransform(progress, [start, start + 0.04], [40, 0]);
  const from = Math.min(...prod.variants.map((v) => v.price));

  return (
    <motion.div
      style={{ opacity, x }}
      className="flex items-center gap-5 border-b border-line/50 pb-6"
    >
      <span className="font-display text-sm text-gold">0{index + 1}</span>
      <Link
        href={`/products/${slug}`}
        className="h-20 w-16 shrink-0 overflow-hidden border border-line/60 bg-ink"
        style={{ boxShadow: `inset 0 0 26px -8px ${prod.accent}77` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={prod.label} alt={prod.name} className="h-full w-full object-cover" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={`/products/${slug}`}
          className="font-display text-lg tracking-[0.14em] text-ivory transition-colors hover:text-gold"
        >
          {prod.name}
        </Link>
        <p className="text-[0.62rem] uppercase tracking-[0.18em] text-mute-2">
          {prod.notes.join(" · ")}
        </p>
        <p className="mt-1 text-sm text-cream">from {formatPrice(from)}</p>
      </div>
      <button
        onClick={() => add(slug, "pack4", 1)}
        className="capsule flex h-11 shrink-0 items-center gap-2 border border-gold/40 px-5 text-[0.6rem] uppercase tracking-[0.18em] text-gold transition-colors hover:bg-gold/10"
        aria-label={`Add ${prod.name} to cart`}
      >
        Add
      </button>
    </motion.div>
  );
}
