"use client";

import { MotionConfig } from "framer-motion";
import { FlavourProvider } from "@/context/FlavourProvider";
import { CartProvider } from "@/context/CartProvider";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <FlavourProvider>
        <CartProvider>{children}</CartProvider>
      </FlavourProvider>
    </MotionConfig>
  );
}
