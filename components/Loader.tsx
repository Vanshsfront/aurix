"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

export function Loader() {
  const { progress, active } = useProgress();
  const [minElapsed, setMinElapsed] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Minimum display so the reveal feels intentional, plus a safety timeout.
  useEffect(() => {
    const min = setTimeout(() => setMinElapsed(true), 1100);
    const safety = setTimeout(() => setHidden(true), 6000);
    return () => {
      clearTimeout(min);
      clearTimeout(safety);
    };
  }, []);

  useEffect(() => {
    if (!active && progress >= 100 && minElapsed) {
      const t = setTimeout(() => setHidden(true), 450);
      return () => clearTimeout(t);
    }
  }, [active, progress, minElapsed]);

  // Lock scroll while loading.
  useEffect(() => {
    document.body.style.overflow = hidden ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [hidden]);

  const pct = Math.round(progress);

  return (
    <div
      className={`fixed inset-0 z-[120] grid place-items-center bg-ink transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden={hidden}
    >
      {/* ambient rose-gold glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-gold) 30%, transparent), transparent 70%)",
        }}
      />
      <div className="relative flex flex-col items-center">
        <p className="text-gold-gradient font-display text-5xl tracking-[0.4em] md:text-6xl">
          AURIX
        </p>
        <p className="mt-5 text-[0.6rem] uppercase tracking-[0.5em] text-mute">
          Where indulgence evolves
        </p>

        <div className="mt-12 h-px w-56 overflow-hidden bg-line">
          <div
            className="h-full bg-gradient-to-r from-gold-deep via-gold to-gold-light transition-[width] duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-4 font-sans text-xs tracking-[0.3em] text-mute-2">
          {pct.toString().padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}
