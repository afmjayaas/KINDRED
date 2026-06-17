import { Suspense } from "react";
import { Metadata } from "next";
import ShopGrid from "@/components/ShopGrid";
import { getProducts } from "@/lib/db";

export const metadata: Metadata = {
  title: "Shop All Dresses | KINDRED",
  description: "Browse the full KINDRED collection of women's dresses — evening gowns, festive sets, maxi dresses, and more.",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="bg-brand-brown py-14 text-center">
        <p className="eyebrow text-brand-orange mb-2">The Collection</p>
        <h1 className="font-serif text-3xl md:text-5xl text-cream">Shop All Dresses</h1>
      </div>
      <Suspense>
        <ShopGrid products={products} />
      </Suspense>
    </div>
  );
}
