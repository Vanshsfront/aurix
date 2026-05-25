"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/products";

interface OrderLine {
  name: string;
  variant: string;
  qty: number;
  lineTotal: number;
  label: string;
  accent: string;
}
interface Order {
  id: string;
  date: string;
  email: string;
  name: string;
  items: OrderLine[];
  total: number;
}

export default function ConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("aurix-last-order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  if (!loaded) return <div className="min-h-screen" />;

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-[var(--spacing-gutter)] pb-28 pt-40 text-center">
        <h1 className="font-serif text-4xl text-ivory">No recent order</h1>
        <p className="mt-4 text-mute">
          Looks like there&apos;s nothing to confirm just yet.
        </p>
        <Button href="/shop" variant="outline" className="mt-8">
          Explore the collection
        </Button>
      </div>
    );
  }

  const firstName = order.name.split(" ")[0] || "there";

  return (
    <div className="mx-auto max-w-2xl px-[var(--spacing-gutter)] pb-28 pt-36 text-center md:pt-44">
      <p className="eyebrow">Order confirmed</p>
      <h1 className="mt-6 font-serif text-5xl italic leading-tight text-ivory md:text-6xl">
        Thank you, {firstName}.
      </h1>
      <p className="mt-5 leading-relaxed text-mute">
        Your considered indulgence is on its way. A confirmation has been sent
        to{" "}
        <span className="text-cream">{order.email || "your email"}</span>.
      </p>

      <div className="mt-10 inline-flex items-center gap-3 border border-gold/30 px-6 py-3">
        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-mute">
          Order
        </span>
        <span className="font-display tracking-[0.18em] text-gold">
          {order.id}
        </span>
      </div>

      <div className="mt-12 border border-line/60 bg-ink-2/50 p-8 text-left">
        <ul className="flex flex-col gap-5">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex items-center gap-4">
              <span
                className="h-16 w-14 shrink-0 overflow-hidden border border-line/60 bg-ink"
                style={{ boxShadow: `inset 0 0 22px -8px ${i.accent}66` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.label} alt="" className="h-full w-full object-cover" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-sm tracking-[0.14em] text-ivory">
                  {i.name}
                </span>
                <span className="block text-xs text-mute">
                  {i.variant} × {i.qty}
                </span>
              </span>
              <span className="text-sm text-cream">
                {formatPrice(i.lineTotal)}
              </span>
            </li>
          ))}
        </ul>
        <div className="my-6 h-px bg-line/60" />
        <div className="flex items-center justify-between">
          <span className="eyebrow">Total</span>
          <span className="font-serif text-2xl text-ivory">
            {formatPrice(order.total)}
          </span>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <Button href="/shop">Continue shopping</Button>
        <Link
          href="/"
          className="eyebrow text-mute underline-offset-4 hover:text-ivory"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
