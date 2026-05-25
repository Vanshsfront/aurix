"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";

const CanScene = dynamic(() => import("./CanScene"), {
  ssr: false,
  loading: () => <Poster />,
});

/** Soft accent glow shown while the scene loads (and as the GL fallback). */
function Poster() {
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden>
      <div
        className="h-[55%] w-[34%] animate-pulse rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--flavour) 45%, transparent), transparent 70%)",
        }}
      />
    </div>
  );
}

class GLBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <Poster /> : this.props.children;
  }
}

export default function FloatingCan({
  className = "",
}: {
  className?: string;
}) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Root always fills its (sized) parent and is positioned so the Poster /
  // canvas can absolutely fill it. Callers control size/position via a wrapper.
  return (
    <div className={`relative h-full w-full ${className}`}>
      <GLBoundary>
        <CanScene interactive={!reduced} animate={!reduced} />
      </GLBoundary>
    </div>
  );
}
