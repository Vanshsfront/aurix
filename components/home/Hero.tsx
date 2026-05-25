"use client";

import FloatingCan from "@/components/scene/FloatingCan";
import { Button } from "@/components/ui/Button";
import { useFlavour } from "@/context/FlavourProvider";
import { getAllProducts, getProductBySlug } from "@/lib/products";

export function Hero() {
  const { active, setActive } = useFlavour();
  const products = getAllProducts();
  const product = getProductBySlug(active) ?? products[0];

  return (
    <section className="bg-vignette relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Faint wordmark watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[24vw] leading-none tracking-[0.1em] text-ivory/[0.035]"
      >
        AURIX
      </span>

      {/* Top eyebrow */}
      <div className="relative z-20 flex justify-center pt-24 md:pt-28">
        <p className="eyebrow text-center">A new category of indulgence</p>
      </div>

      {/* The floating can fills the flexible middle band */}
      <div className="relative z-10 min-h-0 flex-1">
        <div className="absolute inset-0">
          <FloatingCan />
        </div>
      </div>

      {/* Bottom flavour panel — sits below the can, no overlap */}
      <div className="relative z-20 mx-auto mb-6 flex w-full max-w-3xl flex-col items-center gap-5 px-6 text-center">
        <div className="min-h-[92px]">
          <h1
            key={product.slug}
            className="animate-[aurix-fade-up_0.7s_cubic-bezier(0.22,1,0.36,1)] font-serif text-5xl italic leading-none text-ivory md:text-6xl"
          >
            {product.name}
          </h1>
          <p className="mt-3 text-[0.68rem] uppercase tracking-[0.32em] text-mute">
            {product.notes.join("  ·  ")}
          </p>
        </div>

        {/* Flavour selector */}
        <div
          className="flex flex-wrap items-center justify-center gap-2.5"
          role="tablist"
          aria-label="Choose a flavour"
        >
          {products.map((p) => {
            const on = p.slug === active;
            return (
              <button
                key={p.slug}
                role="tab"
                aria-selected={on}
                onMouseEnter={() => setActive(p.slug)}
                onFocus={() => setActive(p.slug)}
                onClick={() => setActive(p.slug)}
                className="min-h-[40px] rounded-full border px-5 py-2 text-[0.62rem] uppercase tracking-[0.22em] transition-all duration-500"
                style={{
                  borderColor: on ? p.accent : "var(--color-line)",
                  color: on ? p.accent : "var(--color-mute)",
                  backgroundColor: on ? `${p.accent}14` : "transparent",
                }}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        <Button href={`/products/${product.slug}`} variant="outline" size="sm">
          Discover {product.name}
        </Button>
      </div>
    </section>
  );
}
