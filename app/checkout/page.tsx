"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartProvider";
import { formatPrice } from "@/lib/products";

const ORDER_KEY = "aurix-last-order";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [placing, setPlacing] = useState(false);

  function placeOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;
    setPlacing(true);

    const fd = new FormData(e.currentTarget);
    const order = {
      id: `AUR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      date: new Date().toISOString(),
      email: String(fd.get("email") ?? ""),
      name: String(fd.get("name") ?? ""),
      items: items.map((i) => ({
        name: i.product.name,
        variant: i.variant.label,
        qty: i.qty,
        lineTotal: i.lineTotal,
        label: i.product.label,
        accent: i.product.accent,
      })),
      total: subtotal,
    };

    try {
      sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
    } catch {
      /* ignore */
    }
    clear();
    router.push("/checkout/confirmation");
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-[var(--spacing-gutter)] pb-28 pt-40 text-center">
        <h1 className="font-serif text-4xl text-ivory">Your cart is empty</h1>
        <p className="mt-4 text-mute">
          Add a flavour before heading to checkout.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block eyebrow text-gold underline-offset-4 hover:underline"
        >
          Explore the collection
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={placeOrder}
      className="mx-auto max-w-6xl px-[var(--spacing-gutter)] pb-28 pt-32 md:pt-40"
    >
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-5xl text-ivory md:text-6xl">Checkout</h1>
        <span className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-mute">
          <LockIcon /> Secure demo
        </span>
      </div>

      <div className="mt-12 grid gap-14 lg:grid-cols-[1.4fr_1fr]">
        {/* Form */}
        <div className="flex flex-col gap-10">
          <Section title="Contact">
            <Field name="email" type="email" label="Email" autoComplete="email" />
            <Field name="name" label="Full name" autoComplete="name" />
          </Section>

          <Section title="Shipping address">
            <Field name="address" label="Address" autoComplete="street-address" />
            <div className="grid grid-cols-2 gap-4">
              <Field name="city" label="City" autoComplete="address-level2" />
              <Field name="zip" label="Postal code" autoComplete="postal-code" />
            </div>
            <Field name="country" label="Country" autoComplete="country-name" />
          </Section>

          <Section title="Payment">
            <p className="mb-2 text-xs leading-relaxed text-mute-2">
              This is a demonstration store. No payment is processed — please do
              not enter real card details.
            </p>
            <Field name="card" label="Card number" placeholder="4242 4242 4242 4242" />
            <div className="grid grid-cols-2 gap-4">
              <Field name="exp" label="Expiry" placeholder="MM / YY" />
              <Field name="cvc" label="CVC" placeholder="123" />
            </div>
          </Section>
        </div>

        {/* Summary */}
        <aside className="h-fit border border-line/60 bg-ink-2/60 p-8 lg:sticky lg:top-28">
          <h2 className="eyebrow mb-6">Order summary</h2>
          <ul className="flex flex-col gap-4">
            {items.map((i) => (
              <li
                key={`${i.slug}:${i.variantKey}`}
                className="flex items-center gap-4"
              >
                <span
                  className="h-14 w-12 shrink-0 overflow-hidden border border-line/60 bg-ink"
                  style={{ boxShadow: `inset 0 0 20px -8px ${i.product.accent}66` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={i.product.label}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-sm tracking-[0.14em] text-ivory">
                    {i.product.name}
                  </span>
                  <span className="block text-xs text-mute">
                    {i.variant.label} × {i.qty}
                  </span>
                </span>
                <span className="text-sm text-cream">
                  {formatPrice(i.lineTotal)}
                </span>
              </li>
            ))}
          </ul>

          <div className="my-6 h-px bg-line/60" />
          <Row label="Subtotal" value={formatPrice(subtotal)} />
          <Row label="Shipping" value="Complimentary" muted />
          <div className="my-5 h-px bg-line/60" />
          <Row label="Total" value={formatPrice(subtotal)} large />

          <button
            type="submit"
            disabled={placing}
            className="mt-8 flex min-h-[54px] w-full items-center justify-center bg-gold font-sans text-xs uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light disabled:opacity-60"
          >
            {placing ? "Placing order…" : "Place order"}
          </button>
          <p className="mt-4 flex items-center justify-center gap-2 text-[0.65rem] tracking-wide text-mute-2">
            <LockIcon /> No real payment is taken.
          </p>
        </aside>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="eyebrow mb-2">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({
  name,
  label,
  type = "text",
  ...rest
}: {
  name: string;
  label: string;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.65rem] uppercase tracking-[0.18em] text-mute">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required
        {...rest}
        className="min-h-[48px] w-full border border-line/60 bg-ink px-4 text-ivory outline-none transition-colors placeholder:text-mute-2 focus:border-gold/70"
      />
    </label>
  );
}

function Row({
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

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="4" y="11" width="16" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
