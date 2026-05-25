import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "solid" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-sans uppercase tracking-[0.2em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:opacity-40 disabled:pointer-events-none select-none";

const sizes: Record<Size, string> = {
  sm: "text-[0.65rem] px-5 py-2.5 min-h-[40px]",
  md: "text-[0.72rem] px-7 py-3.5 min-h-[48px]",
  lg: "text-[0.78rem] px-9 py-4 min-h-[56px]",
};

const variants: Record<Variant, string> = {
  solid:
    "bg-gold text-ink hover:bg-gold-light shadow-[0_0_0_0_rgba(201,162,75,0)] hover:shadow-[0_8px_40px_-8px_rgba(201,162,75,0.45)]",
  outline:
    "border border-gold/40 text-gold hover:border-gold hover:bg-gold/5",
  ghost: "text-mute hover:text-ivory",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<"button">, "className"> & { href?: undefined };
type ButtonAsLink = CommonProps &
  Omit<ComponentProps<typeof Link>, "className"> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = "solid",
    size = "md",
    className = "",
    children,
    ...rest
  } = props;
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if ("href" in props && props.href !== undefined) {
    const { href, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={cls} {...linkRest}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...(rest as ComponentProps<"button">)}>
      {children}
    </button>
  );
}
