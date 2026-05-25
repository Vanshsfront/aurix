import { Hero } from "@/components/home/Hero";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/shop/ProductCard";
import { getAllProducts } from "@/lib/products";

export default function HomePage() {
  const products = getAllProducts();

  return (
    <>
      <Hero />

      {/* ---------------- The Origin ---------------- */}
      <section
        id="story"
        className="mx-auto max-w-4xl scroll-mt-24 px-[var(--spacing-gutter)] py-32 text-center md:py-44"
      >
        <Reveal>
          <p className="eyebrow">The Origin</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mx-auto mt-8 max-w-3xl font-serif text-4xl leading-[1.15] text-ivory md:text-6xl">
            AURIX was born from a{" "}
            <span className="italic text-gold-gradient">contradiction.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-10 max-w-xl text-lg leading-relaxed text-mute">
            The world taught us indulgence had to come with compromise. Too much
            sugar. Too much excess. Too little intention. So we built something
            to bridge those worlds — where pleasure and refinement coexist.
          </p>
        </Reveal>
      </section>

      {/* ---------------- The Standard ---------------- */}
      <section
        id="function"
        className="scroll-mt-24 border-y border-line/50 bg-ink-2/60"
      >
        <div className="mx-auto max-w-[1400px] px-[var(--spacing-gutter)] py-28 md:py-36">
          <div className="grid gap-16 md:grid-cols-[1fr_1.1fr] md:items-center">
            <Reveal>
              <div>
                <p className="eyebrow">The Standard</p>
                <h2 className="mt-7 font-serif text-4xl leading-tight text-ivory md:text-5xl">
                  Functionality is not an add-on. It is part of the ritual.
                </h2>
                <p className="mt-7 max-w-md leading-relaxed text-mute">
                  Every serve is crafted with bar-quality spirits, layered
                  flavour architecture, and functional ingredients selected with
                  purpose — integrated subtly into the experience, never
                  overpowering it.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-px overflow-hidden border border-line/60 bg-line/60 sm:grid-cols-3">
              {[
                {
                  t: "Marine Collagen",
                  d: "For structure and a velvet mouthfeel.",
                },
                {
                  t: "Essential Minerals",
                  d: "Balance, restored with every pour.",
                },
                {
                  t: "Targeted Vitamins",
                  d: "Considered support, quietly composed.",
                },
              ].map((f, i) => (
                <Reveal key={f.t} delay={i * 0.08}>
                  <div className="flex h-full flex-col gap-3 bg-ink p-8">
                    <span className="font-display text-sm tracking-[0.18em] text-gold">
                      0{i + 1}
                    </span>
                    <h3 className="font-display text-lg tracking-[0.1em] text-ivory">
                      {f.t}
                    </h3>
                    <p className="text-sm leading-relaxed text-mute">{f.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- The Experience ---------------- */}
      <section
        id="ritual"
        className="mx-auto max-w-4xl scroll-mt-24 px-[var(--spacing-gutter)] py-32 text-center md:py-44"
      >
        <Reveal>
          <p className="eyebrow">The Experience</p>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mx-auto mt-8 max-w-3xl font-serif text-3xl italic leading-snug text-cream md:text-5xl">
            A velvet texture inspired by dessert. A finish designed to linger. A
            composition engineered to feel lighter, cleaner, and more refined.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-10 text-sm uppercase tracking-[0.3em] text-mute-2">
            Nothing exists by accident.
          </p>
        </Reveal>
      </section>

      {/* ---------------- The Collection ---------------- */}
      <section
        id="collection"
        className="scroll-mt-24 border-t border-line/50 bg-ink-2/40"
      >
        <div className="mx-auto max-w-[1400px] px-[var(--spacing-gutter)] py-28 md:py-36">
          <Reveal>
            <div className="flex flex-col items-end justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">The Collection</p>
                <h2 className="mt-6 font-serif text-4xl leading-tight text-ivory md:text-6xl">
                  Three expressions.
                  <br />
                  One standard.
                </h2>
              </div>
              <Button href="/shop" variant="ghost" size="sm" className="shrink-0">
                Shop all →
              </Button>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08}>
                <ProductCard product={p} priority={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Philosophy ---------------- */}
      <section className="mx-auto max-w-4xl px-[var(--spacing-gutter)] py-36 text-center md:py-48">
        <Reveal>
          <h2 className="mx-auto max-w-3xl font-serif text-4xl leading-[1.2] text-ivory md:text-6xl">
            Modern luxury is no longer defined by excess. It is defined by{" "}
            <span className="italic text-gold-gradient">consideration.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col items-center gap-2 text-sm uppercase tracking-[0.3em] text-mute md:flex-row md:justify-center md:gap-10">
            <span>Considered ingredients</span>
            <span className="hidden text-gold/40 md:inline">·</span>
            <span>Considered indulgence</span>
            <span className="hidden text-gold/40 md:inline">·</span>
            <span>Considered living</span>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-14 font-display text-2xl tracking-[0.3em] text-gold-gradient">
            WHERE INDULGENCE EVOLVES
          </p>
        </Reveal>
      </section>
    </>
  );
}
