"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartProvider";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
];

function BagIcon() {
  return (
    <svg
      width="17"
      height="17"
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3">
      {/* Liquid-glass capsule */}
      <nav
        className="relative flex h-11 w-full max-w-[1180px] items-center justify-between rounded-full border border-white/12 px-4 text-ivory shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.18)] md:h-12 md:px-6"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
          backdropFilter: "blur(22px) saturate(180%)",
          WebkitBackdropFilter: "blur(22px) saturate(180%)",
        }}
      >
        {/* glossy top sheen */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-3 top-0 h-1/2 rounded-t-full opacity-60"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.12), transparent)",
          }}
        />

        {/* Left: desktop links + mobile toggle */}
        <div className="flex flex-1 items-center">
          <div className="hidden items-center gap-7 md:flex">
            {LINKS.slice(1).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[0.6rem] uppercase tracking-[0.3em] text-ivory/80 transition-colors hover:text-ivory"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <button
            className="flex h-9 w-9 items-center justify-center text-ivory md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <div className="flex flex-col gap-[4px]">
              <span className={`h-px w-5 bg-current transition-transform duration-300 ${menuOpen ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`h-px w-5 bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`h-px w-5 bg-current transition-transform duration-300 ${menuOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </div>
          </button>
        </div>

        {/* Center wordmark */}
        <Link
          href="/"
          className="relative font-display text-base tracking-[0.34em] text-ivory md:text-lg"
          aria-label="AURIX home"
        >
          AURIX
        </Link>

        {/* Right: cart */}
        <div className="flex flex-1 items-center justify-end">
          <button
            onClick={openCart}
            className="relative flex h-9 w-9 items-center justify-center text-ivory transition-colors hover:text-gold"
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            <BagIcon />
            <span
              aria-live="polite"
              className={`absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[0.55rem] font-medium text-ink transition-transform duration-300 ${count > 0 ? "scale-100 bg-gold" : "scale-0"}`}
            >
              {count > 0 ? count : ""}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`absolute left-4 right-4 top-16 overflow-hidden rounded-3xl border border-white/10 transition-[max-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${menuOpen ? "max-h-60" : "max-h-0 border-transparent"}`}
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          backdropFilter: "blur(22px) saturate(180%)",
          WebkitBackdropFilter: "blur(22px) saturate(180%)",
        }}
      >
        <div className="flex flex-col p-2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl px-4 py-3 font-serif text-xl text-ivory transition-colors hover:bg-white/5"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
