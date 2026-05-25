"use client";

import { useCart } from "@/context/CartProvider";
import { formatPrice } from "@/lib/products";

/** Transient confirmation when an item is added — does not steal the page. */
export function CartPopup() {
  const { flash, openCart } = useCart();

  return (
    <div
      aria-live="polite"
      className={`fixed bottom-5 right-5 z-[70] w-[min(92vw,360px)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        flash
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      {flash && (
        <div className="flex items-center gap-4 border border-line/70 bg-ink-3/95 p-4 shadow-2xl backdrop-blur-xl">
          <div
            className="h-16 w-14 shrink-0 overflow-hidden rounded-sm border border-line/60 bg-ink"
            style={{ boxShadow: `inset 0 0 24px -8px ${flash.product.accent}66` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={flash.product.label}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[0.62rem] uppercase tracking-[0.25em] text-gold">
              Added to cart
            </p>
            <p className="mt-1 truncate font-display text-sm tracking-[0.16em] text-ivory">
              {flash.product.name}
            </p>
            <p className="text-xs text-mute">
              {flash.variant.label} · {formatPrice(flash.variant.price)}
            </p>
          </div>
          <button
            onClick={openCart}
            className="shrink-0 self-stretch border border-gold/40 px-3 text-[0.6rem] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/10"
          >
            View
          </button>
        </div>
      )}
    </div>
  );
}
