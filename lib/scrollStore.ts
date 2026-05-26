// Shared, render-loop-friendly scroll state. The home experience writes the
// whole-page progress here; the R3F can reads it inside useFrame (avoids
// threading MotionValues into the three.js renderer).

export const scrollStore = {
  /** Whole-page scroll progress, 0..1. */
  progress: 0,
  /** Active flavour slug, driven by scroll (read by the can in useFrame). */
  flavour: "rasmalai",
  /** Pointer position, -1..1 (for subtle can parallax). */
  px: 0,
  py: 0,
  /** Hover proximity to the can, 0..1 (speeds spin + scales up). */
  hover: 0,
};

/** Flavour shown for a given whole-page progress (0..1). */
export function flavourForProgress(p: number): string {
  if (p < 0.5) return "rasmalai";
  if (p < 0.64) return "gulab";
  if (p < 0.78) return "masala-chai";
  // Shop section — can matches the product scrolling into view.
  if (p < 0.85) return "rasmalai";
  if (p < 0.92) return "gulab";
  return "masala-chai";
}
