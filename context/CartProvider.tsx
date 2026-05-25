"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import {
  getProductBySlug,
  type PackKey,
  type Product,
  type Variant,
} from "@/lib/products";

const STORAGE_KEY = "aurix-cart-v1";

export interface CartItem {
  slug: string;
  variantKey: PackKey;
  qty: number;
}

export interface ResolvedItem extends CartItem {
  product: Product;
  variant: Variant;
  lineTotal: number;
}

type Action =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; slug: string; variantKey: PackKey; qty: number }
  | { type: "setQty"; slug: string; variantKey: PackKey; qty: number }
  | { type: "remove"; slug: string; variantKey: PackKey }
  | { type: "clear" };

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case "hydrate":
      return action.items;
    case "add": {
      const idx = state.findIndex(
        (i) => i.slug === action.slug && i.variantKey === action.variantKey,
      );
      if (idx >= 0) {
        const next = [...state];
        next[idx] = { ...next[idx], qty: next[idx].qty + action.qty };
        return next;
      }
      return [
        ...state,
        { slug: action.slug, variantKey: action.variantKey, qty: action.qty },
      ];
    }
    case "setQty": {
      if (action.qty <= 0) {
        return state.filter(
          (i) => !(i.slug === action.slug && i.variantKey === action.variantKey),
        );
      }
      return state.map((i) =>
        i.slug === action.slug && i.variantKey === action.variantKey
          ? { ...i, qty: action.qty }
          : i,
      );
    }
    case "remove":
      return state.filter(
        (i) => !(i.slug === action.slug && i.variantKey === action.variantKey),
      );
    case "clear":
      return [];
    default:
      return state;
  }
}

interface CartContextValue {
  items: ResolvedItem[];
  count: number;
  subtotal: number;
  add: (slug: string, variantKey: PackKey, qty?: number) => void;
  setQty: (slug: string, variantKey: PackKey, qty: number) => void;
  remove: (slug: string, variantKey: PackKey) => void;
  clear: () => void;
  // Drawer UI
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  // Popup feedback: the most recently added line, cleared after a beat.
  flash: ResolvedItem | null;
}

const CartContext = createContext<CartContextValue | null>(null);

function resolve(items: CartItem[]): ResolvedItem[] {
  return items
    .map((i) => {
      const product = getProductBySlug(i.slug);
      const variant = product?.variants.find((v) => v.key === i.variantKey);
      if (!product || !variant) return null;
      return { ...i, product, variant, lineTotal: variant.price * i.qty };
    })
    .filter((x): x is ResolvedItem => x !== null);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, dispatch] = useReducer(reducer, []);
  const [open, setOpen] = useState(false);
  const [flashKey, setFlashKey] = useState<string | null>(null);
  const hydrated = useRef(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from localStorage once.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) dispatch({ type: "hydrate", items: JSON.parse(stored) });
    } catch {
      /* ignore malformed storage */
    }
    hydrated.current = true;
  }, []);

  // Persist after hydration.
  useEffect(() => {
    if (hydrated.current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    }
  }, [raw]);

  const items = useMemo(() => resolve(raw), [raw]);
  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((n, i) => n + i.lineTotal, 0),
    [items],
  );

  const add = useCallback(
    (slug: string, variantKey: PackKey, qty = 1) => {
      dispatch({ type: "add", slug, variantKey, qty });
      setFlashKey(`${slug}:${variantKey}`);
      if (flashTimer.current) clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setFlashKey(null), 4000);
    },
    [],
  );

  const setQty = useCallback(
    (slug: string, variantKey: PackKey, qty: number) =>
      dispatch({ type: "setQty", slug, variantKey, qty }),
    [],
  );
  const remove = useCallback(
    (slug: string, variantKey: PackKey) =>
      dispatch({ type: "remove", slug, variantKey }),
    [],
  );
  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);

  const flash = useMemo(
    () =>
      flashKey
        ? items.find((i) => `${i.slug}:${i.variantKey}` === flashKey) ?? null
        : null,
    [flashKey, items],
  );

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      add,
      setQty,
      remove,
      clear,
      open,
      openCart,
      closeCart,
      flash,
    }),
    [items, count, subtotal, add, setQty, remove, clear, open, openCart, closeCart, flash],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
