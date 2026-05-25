"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/context/CartProvider";
import { formatPrice } from "@/lib/products";

export function CartDrawer() {
  const { items, subtotal, count, setQty, remove, open, closeCart } = useCart();

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeCart]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        aria-hidden={!open}
        className={`fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-[85] flex h-full w-full max-w-md flex-col border-l border-line/60 bg-ink-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-line/60 px-6 py-6">
          <h2 className="eyebrow">
            Your Cart{count > 0 ? ` · ${count}` : ""}
          </h2>
          <button
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center text-mute transition-colors hover:text-ivory"
            aria-label="Close cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <p className="font-serif text-2xl italic text-mute">
              Your cart is quiet.
            </p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="eyebrow text-gold underline-offset-4 hover:underline"
            >
              Explore the collection
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line/40 overflow-y-auto px-6">
              {items.map((item) => (
                <li
                  key={`${item.slug}:${item.variantKey}`}
                  className="flex gap-4 py-6"
                >
                  <div
                    className="h-24 w-20 shrink-0 overflow-hidden rounded-sm border border-line/60 bg-ink"
                    style={{
                      boxShadow: `inset 0 0 30px -10px ${item.product.accent}55`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.product.label}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-base tracking-[0.18em] text-ivory">
                          {item.product.name}
                        </p>
                        <p className="mt-0.5 text-xs tracking-wide text-mute">
                          {item.variant.label}
                        </p>
                      </div>
                      <p className="font-sans text-sm text-cream">
                        {formatPrice(item.lineTotal)}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-line/60">
                        <QtyBtn
                          onClick={() =>
                            setQty(item.slug, item.variantKey, item.qty - 1)
                          }
                          label="Decrease quantity"
                        >
                          −
                        </QtyBtn>
                        <span className="w-8 text-center text-sm text-ivory">
                          {item.qty}
                        </span>
                        <QtyBtn
                          onClick={() =>
                            setQty(item.slug, item.variantKey, item.qty + 1)
                          }
                          label="Increase quantity"
                        >
                          +
                        </QtyBtn>
                      </div>
                      <button
                        onClick={() => remove(item.slug, item.variantKey)}
                        className="text-xs tracking-wide text-mute-2 underline-offset-4 transition-colors hover:text-gulab hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-line/60 px-6 py-6">
              <div className="flex items-center justify-between">
                <span className="eyebrow">Subtotal</span>
                <span className="font-serif text-2xl text-ivory">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-2 text-xs text-mute-2">
                Shipping &amp; taxes calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-5 flex min-h-[54px] items-center justify-center bg-gold font-sans text-xs uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light"
              >
                Proceed to checkout
              </Link>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}

function QtyBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center text-lg text-mute transition-colors hover:text-gold"
    >
      {children}
    </button>
  );
}
