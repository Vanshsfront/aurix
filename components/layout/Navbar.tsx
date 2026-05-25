"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartProvider";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/#story", label: "Story" },
  { href: "/#ritual", label: "Ritual" },
];

function BagIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      aria-hidden="true"
    >
      <path d="M6 8h12l-.8 11.2A2 2 0 0 1 15.2 21H8.8a2 2 0 0 1-2-1.8L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function Navbar() {
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled
          ? "border-b border-line/60 bg-ink/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-[var(--spacing-gutter)] md:h-20">
        {/* Left: desktop links */}
        <div className="hidden flex-1 items-center gap-9 md:flex">
          {LINKS.slice(1).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="eyebrow transition-colors hover:text-ivory"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile: menu toggle */}
        <button
          className="flex h-11 w-11 items-center justify-center text-ivory md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <div className="flex flex-col gap-[5px]">
            <span
              className={`h-px w-6 bg-current transition-transform duration-300 ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-6 bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`h-px w-6 bg-current transition-transform duration-300 ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
            />
          </div>
        </button>

        {/* Center: wordmark */}
        <Link
          href="/"
          className="font-display text-2xl tracking-[0.32em] text-ivory md:flex-1 md:text-center md:text-[1.6rem]"
          aria-label="AURIX home"
        >
          AURIX
        </Link>

        {/* Right: cart */}
        <div className="flex flex-1 items-center justify-end">
          <button
            onClick={openCart}
            className="relative flex h-11 w-11 items-center justify-center text-ivory transition-colors hover:text-gold"
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            <BagIcon />
            <span
              aria-live="polite"
              className={`absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[0.6rem] font-medium text-ink transition-transform duration-300 ${
                count > 0 ? "scale-100 bg-gold" : "scale-0"
              }`}
            >
              {count > 0 ? count : ""}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`overflow-hidden bg-ink/95 backdrop-blur-xl transition-[max-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          menuOpen ? "max-h-80 border-b border-line/60" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-[var(--spacing-gutter)] py-4">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-line/40 py-4 font-serif text-2xl text-ivory"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
