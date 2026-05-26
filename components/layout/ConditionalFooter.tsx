"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

/** The home page is an immersive full-screen scroll experience — no footer. */
export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <Footer />;
}
