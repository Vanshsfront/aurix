import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import {
  PRODUCTS,
  getProductBySlug,
  formatPrice,
} from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Not found" };

  const title = `${product.name} — ${product.notes.join(", ")}`;
  return {
    title,
    description: product.description,
    openGraph: {
      title: `AURIX ${product.name}`,
      description: product.description,
      images: [product.label],
      type: "website",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const from = Math.min(...product.variants.map((v) => v.price));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `AURIX ${product.name}`,
    description: product.description,
    image: product.label,
    brand: { "@type": "Brand", name: "AURIX" },
    category: "Ready-to-drink cocktail",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: from,
      highPrice: Math.max(...product.variants.map((v) => v.price)),
      offerCount: product.variants.length,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
    </>
  );
}
