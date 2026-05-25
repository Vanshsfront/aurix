"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FloatingCan from "@/components/scene/FloatingCan";
import { useFlavour } from "@/context/FlavourProvider";
import { useCart } from "@/context/CartProvider";
import {
  formatPrice,
  getRelated,
  type PackKey,
  type Product,
} from "@/lib/products";

export function ProductDetail({ product }: { product: Product }) {
  const { setActive } = useFlavour();
  const { add, openCart } = useCart();
  const [variantKey, setVariantKey] = useState<PackKey>("pack4");
  const [qty, setQty] = useState(1);

  // Drive the 3D can to this flavour.
  useEffect(() => {
    setActive(product.slug);
  }, [product.slug, setActive]);

  const variant =
    product.variants.find((v) => v.key === variantKey) ?? product.variants[0];
  const related = getRelated(product.slug);

  return (
    <div className="relative grid lg:grid-cols-2">
      {/* Left — the floating can (sticky on desktop) */}
      <div
        className="bg-vignette relative h-[58vh] lg:sticky lg:top-0 lg:h-screen"
        style={{ ["--flavour" as string]: product.accent }}
      >
        <div className="absolute inset-0 pt-16">
          <FloatingCan />
        </div>
      </div>

      {/* Right — details */}
      <div className="px-[var(--spacing-gutter)] py-16 lg:py-28">
        <div className="mx-auto max-w-xl pb-24 lg:pb-0">
          <nav className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-mute-2">
            <Link href="/shop" className="transition-colors hover:text-gold">
              Shop
            </Link>
            <span>/</span>
            <span className="text-mute">{product.name}</span>
          </nav>

          <p
            className="mt-8 text-[0.7rem] uppercase tracking-[0.3em]"
            style={{ color: product.accent }}
          >
            {product.notes.join(" · ")}
          </p>
          <h1 className="mt-4 font-serif text-6xl italic leading-none text-ivory md:text-7xl">
            {product.name}
          </h1>
          <p className="mt-4 font-serif text-xl text-mute">{product.tagline}</p>

          <p className="mt-8 leading-relaxed text-cream/80">{product.story}</p>

          {/* Spec row */}
          <div className="mt-8 flex gap-8 border-y border-line/50 py-5 text-sm">
            <Spec label="Volume" value={product.volume} />
            <Spec label="ABV" value={`${product.abv}%`} />
            <Spec label="Build" value={product.build.split(" · ")[0]} />
          </div>

          {/* Variant selector */}
          <div className="mt-9">
            <p className="eyebrow mb-4">Format</p>
            <div className="grid grid-cols-3 gap-3">
              {product.variants.map((v) => {
                const on = v.key === variantKey;
                return (
                  <button
                    key={v.key}
                    onClick={() => setVariantKey(v.key)}
                    aria-pressed={on}
                    className="flex min-h-[80px] flex-col items-start justify-between border p-4 text-left transition-all duration-300"
                    style={{
                      borderColor: on ? product.accent : "var(--color-line)",
                      backgroundColor: on ? `${product.accent}12` : "transparent",
                    }}
                  >
                    <span className="text-[0.6rem] uppercase tracking-[0.18em] text-mute">
                      {v.count} {v.count === 1 ? "can" : "cans"}
                    </span>
                    <span className="font-serif text-lg text-ivory">
                      {formatPrice(v.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity + add to cart */}
          <div className="mt-7 flex items-stretch gap-4">
            <div className="flex items-center border border-line/60">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-full w-12 items-center justify-center text-lg text-mute transition-colors hover:text-gold"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center text-ivory">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="flex h-full w-12 items-center justify-center text-lg text-mute transition-colors hover:text-gold"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={() => {
                add(product.slug, variantKey, qty);
                openCart();
              }}
              className="flex flex-1 items-center justify-center gap-3 bg-gold font-sans text-xs uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light"
            >
              Add to cart
              <span className="opacity-60">·</span>
              {formatPrice(variant.price * qty)}
            </button>
          </div>

          {/* Functional standard */}
          <div className="mt-12 border-t border-line/50 pt-8">
            <p className="eyebrow mb-5">The functional standard</p>
            <ul className="grid grid-cols-3 gap-4">
              {product.functional.map((f) => (
                <li
                  key={f}
                  className="border border-line/50 p-4 text-xs leading-relaxed text-cream/70"
                >
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-mute-2">
              Integrated subtly into the experience — never overpowering it. Not
              as a statement. As a standard.
            </p>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-12 border-t border-line/50 pt-8">
              <p className="eyebrow mb-5">Also in the collection</p>
              <div className="flex flex-wrap gap-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/products/${r.slug}`}
                    className="group flex items-center gap-3 border border-line/60 p-3 pr-5 transition-colors hover:border-gold/50"
                  >
                    <span
                      className="h-12 w-10 overflow-hidden rounded-sm border border-line/60 bg-ink"
                      style={{ boxShadow: `inset 0 0 20px -6px ${r.accent}66` }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={r.label}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </span>
                    <span>
                      <span className="block font-display text-sm tracking-[0.14em] text-ivory">
                        {r.name}
                      </span>
                      <span className="block text-[0.62rem] uppercase tracking-[0.18em] text-mute-2">
                        {r.notes.join(" · ")}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sticky add-to-cart bar (safe-area aware) */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-line/60 bg-ink/90 px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
        <div className="flex-1">
          <p className="text-[0.58rem] uppercase tracking-[0.18em] text-mute">
            {variant.label}
          </p>
          <p className="font-serif text-lg text-ivory">
            {formatPrice(variant.price * qty)}
          </p>
        </div>
        <button
          onClick={() => {
            add(product.slug, variantKey, qty);
            openCart();
          }}
          className="flex min-h-[48px] items-center justify-center bg-gold px-8 font-sans text-xs uppercase tracking-[0.2em] text-ink"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.6rem] uppercase tracking-[0.2em] text-mute-2">
        {label}
      </p>
      <p className="mt-1 font-sans text-ivory">{value}</p>
    </div>
  );
}
