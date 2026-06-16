"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ product }: { product: Product }) {
  const onSale = !!product.salePrice && product.salePrice < product.price;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="card-luxe group block overflow-hidden"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl2 bg-cream-deep/30">
        <Image
          src={product.images[0] || "/images/brand/icon.png"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNewArrival && (
            <span className="bg-brand-brown text-cream text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-card">
              New
            </span>
          )}
          {product.offerLabel && (
            <span className="bg-brand-orange text-cream text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-card">
              {product.offerLabel}
            </span>
          )}
        </div>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-brand-brownDark/50 flex items-center justify-center">
            <span className="text-cream text-xs uppercase tracking-widest border border-cream px-4 py-2 rounded-full">
              Sold Out
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-[11px] uppercase tracking-wider text-brand-orange mb-1">
          {product.category}
        </p>
        <h3 className="font-serif text-lg text-brand-brownDark leading-snug mb-2 group-hover:text-brand-orange transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          {onSale ? (
            <>
              <span className="text-brand-brownDark font-semibold">
                {formatPrice(product.salePrice as number)}
              </span>
              <span className="text-brand-brown/50 text-sm line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-brand-brownDark font-semibold">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {product.sizes.slice(0, 5).map((s) => (
            <span
              key={s}
              className="text-[10px] border border-cream-deep rounded-full px-2 py-0.5 text-brand-brown/70"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
