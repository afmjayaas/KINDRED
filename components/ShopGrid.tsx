"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface ShopGridProps {
  products: Product[];
}

export default function ShopGrid({ products }: ShopGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );
  const sizes = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.sizes))).sort(),
    [products]
  );
  const colors = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.colors))).sort(),
    [products]
  );
  const maxPrice = useMemo(
    () => Math.max(...products.map((p) => p.price), 1000),
    [products]
  );

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [size, setSize] = useState(searchParams.get("size") || "");
  const [color, setColor] = useState(searchParams.get("color") || "");
  const [newArrivalOnly, setNewArrivalOnly] = useState(searchParams.get("newArrival") === "true");
  const [priceMax, setPriceMax] = useState<number>(
    Number(searchParams.get("priceMax")) || maxPrice
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (category && p.category !== category) return false;
    if (size && !p.sizes.includes(size)) return false;
    if (color && !p.colors.includes(color)) return false;
    if (newArrivalOnly && !p.isNewArrival) return false;
    const effectivePrice = p.salePrice ?? p.price;
    if (effectivePrice > priceMax) return false;
    return true;
  });

  function resetFilters() {
    setSearch("");
    setCategory("");
    setSize("");
    setColor("");
    setNewArrivalOnly(false);
    setPriceMax(maxPrice);
  }

  const FilterPanel = (
    <div className="space-y-8">
      <div>
        <h4 className="font-serif text-lg text-brand-brownDark mb-3">Category</h4>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setCategory("")}
            className={`text-left text-sm py-1 ${!category ? "text-brand-orange font-semibold" : "text-brand-brown/80 hover:text-brand-orange"}`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`text-left text-sm py-1 ${category === c ? "text-brand-orange font-semibold" : "text-brand-brown/80 hover:text-brand-orange"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-serif text-lg text-brand-brownDark mb-3">Size</h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(size === s ? "" : s)}
              className={`text-xs border rounded-full px-3 py-1.5 transition-colors ${
                size === s
                  ? "bg-brand-brown text-cream border-brand-brown"
                  : "border-cream-deep text-brand-brown/80 hover:border-brand-orange"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-serif text-lg text-brand-brownDark mb-3">Color</h4>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(color === c ? "" : c)}
              className={`text-xs border rounded-full px-3 py-1.5 transition-colors ${
                color === c
                  ? "bg-brand-brown text-cream border-brand-brown"
                  : "border-cream-deep text-brand-brown/80 hover:border-brand-orange"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-serif text-lg text-brand-brownDark mb-3">
          Max Price: Rs. {priceMax.toLocaleString("en-US")}
        </h4>
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={500}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full accent-brand-orange"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={newArrivalOnly}
          onChange={(e) => setNewArrivalOnly(e.target.checked)}
          className="accent-brand-orange w-4 h-4"
        />
        <span className="text-sm text-brand-brown/80">New Arrivals Only</span>
      </label>

      <button onClick={resetFilters} className="text-xs uppercase tracking-wider text-brand-orange underline">
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="container-luxe py-12">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown/50" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dresses..."
            className="input-luxe pl-11"
          />
        </div>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden btn-secondary text-xs py-2 px-4 flex items-center gap-2"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
        <aside className="hidden lg:block">{FilterPanel}</aside>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-brand-brownDark/50 flex">
            <div className="bg-cream w-[85%] max-w-sm h-full overflow-y-auto p-6 ml-auto animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl text-brand-brownDark">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                  <X size={22} />
                </button>
              </div>
              {FilterPanel}
            </div>
          </div>
        )}

        <div>
          <p className="text-sm text-brand-brown/60 mb-5">{filtered.length} dresses found</p>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-7">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No dresses match your filters"
              message="Try adjusting or clearing your filters to see more results."
            />
          )}
        </div>
      </div>
    </div>
  );
}
