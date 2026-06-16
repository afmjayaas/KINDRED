"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product, ProductCategory } from "@/lib/types";
import ImageUploader from "./ImageUploader";
import { Loader2 } from "lucide-react";

const CATEGORIES: ProductCategory[] = [
  "Maxi Dresses",
  "Evening Gowns",
  "Casual Dresses",
  "Festive Wear",
  "Workwear",
];

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

interface ProductFormProps {
  initialProduct?: Product;
}

export default function ProductForm({ initialProduct }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialProduct);

  const [name, setName] = useState(initialProduct?.name || "");
  const [price, setPrice] = useState(initialProduct?.price?.toString() || "");
  const [salePrice, setSalePrice] = useState(
    initialProduct?.salePrice ? initialProduct.salePrice.toString() : ""
  );
  const [category, setCategory] = useState<string>(
    initialProduct?.category || CATEGORIES[0]
  );
  const [sizes, setSizes] = useState<string[]>(initialProduct?.sizes || []);
  const [colors, setColors] = useState(initialProduct?.colors?.join(", ") || "");
  const [stock, setStock] = useState(initialProduct?.stock?.toString() || "10");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [fabric, setFabric] = useState(initialProduct?.fabric || "");
  const [careInstructions, setCareInstructions] = useState(
    initialProduct?.careInstructions || ""
  );
  const [images, setImages] = useState<string[]>(initialProduct?.images || []);
  const [isNewArrival, setIsNewArrival] = useState(initialProduct?.isNewArrival || false);
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured || false);
  const [isTrending, setIsTrending] = useState(initialProduct?.isTrending || false);
  const [offerLabel, setOfferLabel] = useState(initialProduct?.offerLabel || "");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function toggleSize(size: string) {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !price || images.length === 0 || sizes.length === 0) {
      setError("Please fill in name, price, at least one size, and at least one image.");
      return;
    }

    setSubmitting(true);
    const payload = {
      name,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      category,
      sizes,
      colors: colors.split(",").map((c) => c.trim()).filter(Boolean),
      stock: Number(stock),
      description,
      fabric,
      careInstructions,
      images,
      isNewArrival,
      isFeatured,
      isTrending,
      offerLabel: offerLabel || null,
    };

    try {
      const url = isEdit ? `/api/products/${initialProduct!.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="card-luxe p-6">
        <h2 className="font-serif text-lg text-brand-brownDark mb-4">Product Images</h2>
        <ImageUploader images={images} onChange={setImages} target="products" />
      </div>

      <div className="card-luxe p-6 grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-brand-brownDark mb-1">
            Dress Name
          </label>
          <input
            className="input-luxe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Noir Lace Bloom Dress"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-brownDark mb-1">
            Price (Rs.)
          </label>
          <input
            type="number"
            className="input-luxe"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-brownDark mb-1">
            Sale Price (Rs.) — optional
          </label>
          <input
            type="number"
            className="input-luxe"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-brownDark mb-1">
            Category
          </label>
          <select
            className="input-luxe"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-brownDark mb-1">
            Stock Quantity
          </label>
          <input
            type="number"
            className="input-luxe"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-brand-brownDark mb-1">
            Available Sizes
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSize(s)}
                className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                  sizes.includes(s)
                    ? "bg-brand-orange text-white border-brand-orange"
                    : "border-brand-brown/30 text-brand-brown hover:border-brand-orange"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-brand-brownDark mb-1">
            Colors (comma separated)
          </label>
          <input
            className="input-luxe"
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            placeholder="e.g. Black, Burgundy, Forest Green"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-brand-brownDark mb-1">
            Offer Label — optional
          </label>
          <input
            className="input-luxe"
            value={offerLabel}
            onChange={(e) => setOfferLabel(e.target.value)}
            placeholder="e.g. Limited Offer, Best Seller, Festive Pick"
          />
        </div>
      </div>

      <div className="card-luxe p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-brownDark mb-1">
            Description
          </label>
          <textarea
            className="input-luxe min-h-[100px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-brownDark mb-1">
            Fabric
          </label>
          <input
            className="input-luxe"
            value={fabric}
            onChange={(e) => setFabric(e.target.value)}
            placeholder="e.g. Pure silk blend with hand embroidery"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-brownDark mb-1">
            Care Instructions
          </label>
          <textarea
            className="input-luxe min-h-[80px]"
            value={careInstructions}
            onChange={(e) => setCareInstructions(e.target.value)}
            placeholder="e.g. Dry clean only. Store in a cool, dry place."
          />
        </div>
      </div>

      <div className="card-luxe p-6 flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-brand-brownDark">
          <input
            type="checkbox"
            checked={isNewArrival}
            onChange={(e) => setIsNewArrival(e.target.checked)}
            className="w-4 h-4 accent-brand-orange"
          />
          Mark as New Arrival
        </label>
        <label className="flex items-center gap-2 text-sm text-brand-brownDark">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 accent-brand-orange"
          />
          Mark as Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-brand-brownDark">
          <input
            type="checkbox"
            checked={isTrending}
            onChange={(e) => setIsTrending(e.target.checked)}
            className="w-4 h-4 accent-brand-orange"
          />
          Mark as Trending / Best Selling
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} /> Saving...
            </span>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Create Product"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="btn-outline-light !text-brand-brown !border-brand-brown/30"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
