import Link from "next/link";
import { getAllProducts } from "@/lib/products";

export function Footer() {
  const products = getAllProducts();
  return (
    <footer className="border-t border-line/60 bg-ink">
      <div className="mx-auto max-w-[1400px] px-[var(--spacing-gutter)] py-20">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <p className="font-display text-3xl tracking-[0.3em] text-ivory">
              AURIX
            </p>
            <p className="mt-5 max-w-xs font-serif text-lg italic leading-relaxed text-mute">
              Where indulgence evolves. Considered ingredients, considered
              indulgence, considered living.
            </p>
          </div>

          <FooterCol title="The Collection">
            {products.map((p) => (
              <FooterLink key={p.slug} href={`/products/${p.slug}`}>
                {p.name}
              </FooterLink>
            ))}
            <FooterLink href="/shop">Shop all</FooterLink>
          </FooterCol>

          <FooterCol title="House">
            <FooterLink href="/">The experience</FooterLink>
            <FooterLink href="/shop">Our story</FooterLink>
            <FooterLink href="/shop">The functional standard</FooterLink>
          </FooterCol>

          <FooterCol title="Connect">
            <FooterLink href="#">Instagram</FooterLink>
            <FooterLink href="#">Stockists</FooterLink>
            <FooterLink href="#">Contact</FooterLink>
          </FooterCol>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line/40 pt-8 text-xs tracking-wide text-mute-2 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} AURIX. All rights reserved.</p>
          <p className="uppercase tracking-[0.25em]">
            Please enjoy responsibly · 21+
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="eyebrow mb-5">{title}</h3>
      <ul className="flex flex-col gap-3">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="font-sans text-sm text-cream/70 transition-colors hover:text-gold"
      >
        {children}
      </Link>
    </li>
  );
}
