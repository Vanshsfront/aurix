"use client";

import Link from "next/link";
import { useCart } from "@/context/CartProvider";
import { formatPrice, type Product } from "@/lib/products";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { add } = useCart();
  const from = Math.min(...product.variants.map((v) => v.price));

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col"
    >
      <div
        className="relative aspect-[4/5] overflow-hidden border border-line/60 bg-ink-2 transition-colors duration-500 group-hover:border-[color:var(--accent)]"
        style={{ ["--accent" as string]: product.accent }}
      >
        {/* accent glow */}
        <div
          className="absolute inset-0 opacity-50 transition-opacity duration-700 group-hover:opacity-90"
          style={{
            background: `radial-gradient(120% 80% at 70% 30%, ${product.accent}26, transparent 60%)`,
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.label}
          alt={`AURIX ${product.name} — ${product.notes.join(", ")}`}
          loading={priority ? "eager" : "lazy"}
          className="absolute left-1/2 top-1/2 w-[118%] max-w-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        <span
          className="absolute left-4 top-4 text-[0.6rem] uppercase tracking-[0.25em]"
          style={{ color: product.accent }}
        >
          7% ABV · 110ml
        </span>

        <button
          onClick={(e) => {
            e.preventDefault();
            add(product.slug, "single", 1);
          }}
          className="absolute bottom-4 right-4 flex h-11 items-center gap-2 border border-gold/40 bg-ink/70 px-4 text-[0.6rem] uppercase tracking-[0.2em] text-gold opacity-0 backdrop-blur-md transition-all duration-500 hover:bg-gold/10 group-hover:opacity-100"
          aria-label={`Add ${product.name} to cart`}
        >
          Quick add
        </button>
      </div>

      <div className="flex items-start justify-between gap-4 pt-5">
        <div>
          <h3 className="font-display text-xl tracking-[0.16em] text-ivory">
            {product.name}
          </h3>
          <p className="mt-1 font-serif text-base italic text-mute">
            {product.tagline}
          </p>
          <p className="mt-2 text-[0.68rem] uppercase tracking-[0.2em] text-mute-2">
            {product.notes.join(" · ")}
          </p>
        </div>
        <p className="shrink-0 pt-1 font-sans text-sm text-cream">
          from {formatPrice(from)}
        </p>
      </div>
    </Link>
  );
}
