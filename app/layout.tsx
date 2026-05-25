import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartPopup } from "@/components/cart/CartPopup";
import { AgeGate } from "@/components/AgeGate";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aurix.example"),
  title: {
    default: "AURIX — Where Indulgence Evolves",
    template: "%s · AURIX",
  },
  description:
    "AURIX is a new category of premium ready-to-drink cocktail. Bar-quality spirits, layered flavour, and functional ingredients — considered indulgence, where pleasure and refinement coexist.",
  keywords: [
    "AURIX",
    "premium cocktail",
    "ready to drink",
    "functional cocktail",
    "marine collagen",
    "luxury beverage",
  ],
  openGraph: {
    title: "AURIX — Where Indulgence Evolves",
    description:
      "A new category of premium ready-to-drink cocktail. Considered ingredients. Considered indulgence.",
    type: "website",
    siteName: "AURIX",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURIX — Where Indulgence Evolves",
    description:
      "A new category of premium ready-to-drink cocktail. Considered indulgence.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="bg-ink text-ivory min-h-full">
        <Providers>
          <AgeGate />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <CartPopup />
        </Providers>
      </body>
    </html>
  );
}
