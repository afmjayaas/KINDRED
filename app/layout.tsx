import type { Metadata, Viewport } from "next";
import "./globals.css";
import PwaInstall from "@/components/PwaInstall";

export const metadata: Metadata = {
  title: "KINDRED | Modern Women's Fashion Boutique",
  description:
    "KINDRED is a premium women's fashion boutique offering elegant dresses, festive sets, and modern essentials. Shop new arrivals, featured pieces, and timeless designs.",
  keywords: ["KINDRED", "women's dresses", "fashion boutique", "festive wear", "evening gowns"],
  openGraph: {
    title: "KINDRED | Modern Women's Fashion Boutique",
    description: "Elegant, considered dresses for women who dress with intention.",
    images: ["/images/brand/cover.png"],
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KINDRED",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5E4026",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-cream">
        {children}
        <PwaInstall />
      </body>
    </html>
  );
}
