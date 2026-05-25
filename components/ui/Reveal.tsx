"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  delay?: number;
  y?: number;
}

/**
 * Fade + rise into view on scroll. Reduced motion is handled globally by
 * <MotionConfig reducedMotion="user">, which keeps the initial markup identical
 * on server and client (no hydration mismatch) and skips the transform for
 * users who prefer reduced motion.
 */
export function Reveal({ children, delay = 0, y = 28, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
