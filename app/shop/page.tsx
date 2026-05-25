import type { Metadata } from "next";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop the Collection",
  description:
    "Three premium ready-to-drink cocktails — Rasmalai, Gulab and Masala Chai. Bar-quality spirits with a functional standard.",
};

export default function ShopPage() {
  const products = getAllProducts();
  return (
    <div className="mx-auto max-w-[1400px] px-[var(--spacing-gutter)] pb-28 pt-32 md:pt-40">
      <Reveal>
        <header className="max-w-2xl">
          <p className="eyebrow">The Collection</p>
          <h1 className="mt-6 font-serif text-5xl leading-tight text-ivory md:text-7xl">
            Considered indulgence, by the can.
          </h1>
          <p className="mt-6 max-w-lg leading-relaxed text-mute">
            Three expressions, one standard. Each 110ml serve is built with
            bar-quality spirits, layered flavour, and functional ingredients —
            7% ABV.
          </p>
        </header>
      </Reveal>

      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08}>
            <ProductCard product={p} priority={i < 2} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
