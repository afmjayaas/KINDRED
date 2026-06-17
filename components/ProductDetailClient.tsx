"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, Loader2, ShieldCheck, Truck, Sparkles } from "lucide-react";

export default function ProductDetailClient({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successOrder, setSuccessOrder] = useState<string | null>(null);

  const onSale = !!product.salePrice && product.salePrice < product.price;
  const images = product.images.length > 0 ? product.images : ["/images/brand/icon.png"];

  async function submitInquiry(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name || (!form.phone && !form.email)) {
      setError("Please share your name and a phone number or email so we can reach you.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name,
          phone: form.phone,
          email: form.email,
          items: [
            {
              productName: product.name,
              size: selectedSize,
              color: product.colors[0] || "",
              quantity,
              price: onSale ? product.salePrice : product.price,
            },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setSuccessOrder(data.order.orderNumber);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-luxe py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="relative aspect-[3/4] rounded-xl2 overflow-hidden bg-cream-deep/20 shadow-soft">
            <Image
              src={images[activeImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 ${
                    activeImage === i ? "border-brand-orange" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="eyebrow mb-2">{product.category}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-brand-brownDark mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-6">
            {onSale ? (
              <>
                <span className="text-2xl font-semibold text-brand-brownDark">
                  {formatPrice(product.salePrice as number)}
                </span>
                <span className="text-brand-brown/50 line-through">{formatPrice(product.price)}</span>
                {product.offerLabel && (
                  <span className="bg-brand-orange text-cream text-xs uppercase px-3 py-1 rounded-full">
                    {product.offerLabel}
                  </span>
                )}
              </>
            ) : (
              <span className="text-2xl font-semibold text-brand-brownDark">{formatPrice(product.price)}</span>
            )}
          </div>

          <p className="text-brand-brown/80 leading-relaxed mb-8">{product.description}</p>

          {product.sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-brand-brownDark mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`border rounded-full px-4 py-2 text-sm transition-colors ${
                      selectedSize === s
                        ? "bg-brand-brown text-cream border-brand-brown"
                        : "border-cream-deep text-brand-brown hover:border-brand-orange"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-brand-brownDark mb-2">Color</p>
              <p className="text-sm text-brand-brown/80">{product.colors.join(", ")}</p>
            </div>
          )}

          <div className="mb-8">
            <p className="text-sm font-semibold text-brand-brownDark mb-2">Quantity</p>
            <div className="inline-flex items-center border border-cream-deep rounded-full">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2 text-brand-brown"
              >
                −
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-2 text-brand-brown"
              >
                +
              </button>
            </div>
          </div>

          {product.stock > 0 ? (
            <button onClick={() => setModalOpen(true)} className="btn-primary w-full md:w-auto mb-8">
              Inquire to Order
            </button>
          ) : (
            <p className="text-red-600 font-semibold mb-8">Currently sold out</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-xs text-brand-brown/70">
            <div className="flex items-center gap-2"><Truck size={18} className="text-brand-orange" /> Ships in 3-5 days</div>
            <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-brand-orange" /> Quality checked</div>
            <div className="flex items-center gap-2"><Sparkles size={18} className="text-brand-orange" /> Handcrafted detail</div>
          </div>

          <div className="border-t border-cream-deep pt-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-brand-brownDark mb-1">Fabric</p>
              <p className="text-sm text-brand-brown/80">{product.fabric}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-brownDark mb-1">Care Instructions</p>
              <p className="text-sm text-brand-brown/80">{product.careInstructions}</p>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-brownDark/60 flex items-center justify-center p-4">
          <div className="bg-cream rounded-xl2 max-w-md w-full p-7 relative shadow-soft">
            <button
              onClick={() => {
                setModalOpen(false);
                setSuccessOrder(null);
                setError("");
              }}
              className="absolute top-4 right-5 text-brand-brown/60 text-xl"
              aria-label="Close"
            >
              ×
            </button>

            {successOrder ? (
              <div className="text-center py-6">
                <CheckCircle2 className="mx-auto text-green-600 mb-4" size={48} />
                <h3 className="font-serif text-xl text-brand-brownDark mb-2">Inquiry Received</h3>
                <p className="text-sm text-brand-brown/80 mb-4">
                  Your order number is
                </p>
                <p className="text-lg font-semibold text-brand-orange mb-4">{successOrder}</p>
                <p className="text-sm text-brand-brown/70 mb-6">
                  Save this number — you can check your order status anytime on the Track My Order page.
                  {form.email
                    ? " A confirmation email is on its way to your inbox."
                    : " Our team will reach out to you by phone shortly."}
                </p>
                <Link href="/track-order" className="btn-primary">
                  Track My Order
                </Link>
              </div>
            ) : (
              <form onSubmit={submitInquiry}>
                <h3 className="font-serif text-xl text-brand-brownDark mb-1">Inquire to Order</h3>
                <p className="text-sm text-brand-brown/70 mb-5">
                  {product.name} · Size {selectedSize} · Qty {quantity}
                </p>
                {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
                <div className="space-y-4 mb-6">
                  <input
                    className="input-luxe"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    className="input-luxe"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                  <input
                    className="input-luxe"
                    placeholder="Email (optional)"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : "Submit Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
