"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { DEFAULT_SLUG, getProductBySlug } from "@/lib/products";

interface FlavourContextValue {
  /** Currently featured flavour slug (drives the 3D can label + site accent). */
  active: string;
  setActive: (slug: string) => void;
  accent: string;
}

const FlavourContext = createContext<FlavourContextValue | null>(null);

export function FlavourProvider({ children }: { children: ReactNode }) {
  const [active, setActiveState] = useState<string>(DEFAULT_SLUG);

  const setActive = useCallback((slug: string) => {
    if (getProductBySlug(slug)) setActiveState(slug);
  }, []);

  const accent = getProductBySlug(active)?.accent ?? "#c9a24b";

  // Expose the live accent as a CSS variable so any element can react to it.
  useEffect(() => {
    document.documentElement.style.setProperty("--flavour", accent);
  }, [accent]);

  const value = useMemo(
    () => ({ active, setActive, accent }),
    [active, setActive, accent],
  );

  return (
    <FlavourContext.Provider value={value}>{children}</FlavourContext.Provider>
  );
}

export function useFlavour(): FlavourContextValue {
  const ctx = useContext(FlavourContext);
  if (!ctx) throw new Error("useFlavour must be used within FlavourProvider");
  return ctx;
}
