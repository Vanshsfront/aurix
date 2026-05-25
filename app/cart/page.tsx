"use client";

import Link from "next/link";
import { useCart } from "@/context/CartProvider";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/products";

export default function CartPage() {
  const { items, subtotal, count, setQty, remove } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-[var(--spacing-gutter)] pb-28 pt-32 md:pt-40">
      <h1 className="font-serif text-5xl text-ivory md:text-6xl">Your Cart</h1>
      <p className="mt-3 eyebrow">
        {count > 0 ? `${count} item${count === 1 ? "" : "s"}` : "Empty"}
      </p>

      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-start gap-6">
          <p className="font-serif text-2xl italic text-mute">
            Nothing here yet.
          </p>
          <Button href="/shop" variant="outline">
            Explore the collection
          </Button>
        </div>
      ) : (
        <div className="mt-12 grid gap-16 lg:grid-cols-[1.6fr_1fr]">
          {/* Items */}
          <ul className="divide-y divide-line/50 border-y border-line/50">
            {items.map((item) => (
              <li
                key={`${item.slug}:${item.variantKey}`}
                className="flex gap-5 py-7"
              >
                <Link
                  href={`/products/${item.slug}`}
                  className="h-28 w-24 shrink-0 overflow-hidden border border-line/60 bg-ink"
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
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-display text-lg tracking-[0.16em] text-ivory transition-colors hover:text-gold"
                      >
                        {item.product.name}
                      </Link>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-mute">
                        {item.variant.label}
                      </p>
                    </div>
                    <p className="font-serif text-xl text-ivory">
                      {formatPrice(item.lineTotal)}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center border border-line/60">
                      <button
                        onClick={() =>
                          setQty(item.slug, item.variantKey, item.qty - 1)
                        }
                        className="flex h-10 w-10 items-center justify-center text-mute hover:text-gold"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm text-ivory">
                        {item.qty}
                      </span>
                      <button
                        onClick={() =>
                          setQty(item.slug, item.variantKey, item.qty + 1)
                        }
                        className="flex h-10 w-10 items-center justify-center text-mute hover:text-gold"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
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

          {/* Summary */}
          <aside className="h-fit border border-line/60 bg-ink-2/60 p-8 lg:sticky lg:top-28">
            <h2 className="eyebrow mb-6">Order summary</h2>
            <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
            <SummaryRow label="Shipping" value="Complimentary" muted />
            <div className="my-5 h-px bg-line/60" />
            <SummaryRow label="Total" value={formatPrice(subtotal)} large />
            <Button href="/checkout" className="mt-8 w-full">
              Checkout
            </Button>
            <p className="mt-4 text-center text-[0.65rem] tracking-wide text-mute-2">
              Demo checkout — no payment is taken.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  large,
  muted,
}: {
  label: string;
  value: string;
  large?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span
        className={`${large ? "eyebrow" : "text-sm"} ${muted ? "text-mute" : "text-cream/80"}`}
      >
        {label}
      </span>
      <span
        className={
          large
            ? "font-serif text-2xl text-ivory"
            : `text-sm ${muted ? "text-mute" : "text-cream"}`
        }
      >
        {value}
      </span>
    </div>
  );
}
