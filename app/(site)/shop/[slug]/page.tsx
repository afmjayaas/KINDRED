import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductBySlug, getProducts } from "@/lib/db";
import ProductDetailClient from "@/components/ProductDetailClient";
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found | KINDRED" };
  return {
    title: `${product.name} | KINDRED`,
    description: product.description,
    openGraph: { images: product.images },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = getProducts()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div>
      <ProductDetailClient product={product} />
      {related.length > 0 && (
        <section className="container-luxe py-16 border-t border-cream-deep">
          <SectionHeading eyebrow="You Might Also Like" title="More From This Category" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
