"use client";

import { useState } from "react";
import { Order } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, formatPrice } from "@/lib/utils";
import { Loader2, PackageSearch, CheckCircle2, Circle } from "lucide-react";

const STEPS: Order["status"][] = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOrder(null);
    if (!orderNumber || !contact) {
      setError("Please enter both your order number and phone or email.");
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, contact }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order not found.");
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const currentStepIndex = order ? STEPS.indexOf(order.status) : -1;
  const isCancelled = order?.status === "Cancelled";

  return (
    <div className="bg-cream min-h-[70vh]">
      <div className="bg-brand-brown py-14 text-center">
        <p className="eyebrow text-brand-orange mb-2">Order Support</p>
        <h1 className="font-serif text-3xl md:text-5xl text-cream">Track My Order</h1>
      </div>

      <div className="container-luxe py-16 max-w-2xl">
        <form onSubmit={handleSubmit} className="card-luxe p-8 mb-10">
          <h2 className="font-serif text-xl text-brand-brownDark mb-1">Find Your Order</h2>
          <p className="text-sm text-brand-brown/70 mb-6">
            Enter your order number along with the phone or email used at checkout.
          </p>
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-semibold text-brand-brownDark mb-1 block">Order Number</label>
              <input
                className="input-luxe"
                placeholder="e.g. KIN-2026-1042"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-brand-brownDark mb-1 block">Phone or Email</label>
              <input
                className="input-luxe"
                placeholder="Phone number or email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Track Order"}
          </button>
          <p className="text-xs text-brand-brown/50 mt-4">
            Try a demo order: <span className="font-semibold">KIN-2026-1042</span> with phone{" "}
            <span className="font-semibold">9876543210</span>
          </p>
        </form>

        {order && (
          <div className="card-luxe p-8 animate-fadeUp">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <p className="text-xs text-brand-brown/60">Order Number</p>
                <p className="font-serif text-xl text-brand-brownDark">{order.orderNumber}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {!isCancelled ? (
              <div className="flex items-center mb-8 overflow-x-auto pb-2">
                {STEPS.map((step, i) => (
                  <div key={step} className="flex items-center flex-1 min-w-[90px]">
                    <div className="flex flex-col items-center flex-1">
                      {i <= currentStepIndex ? (
                        <CheckCircle2 className="text-brand-orange" size={26} />
                      ) : (
                        <Circle className="text-cream-deep" size={26} />
                      )}
                      <span
                        className={`text-[11px] mt-2 text-center ${
                          i <= currentStepIndex ? "text-brand-brownDark font-semibold" : "text-brand-brown/40"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`h-[2px] flex-1 -mt-5 ${
                          i < currentStepIndex ? "bg-brand-orange" : "bg-cream-deep"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-red-600 text-sm mb-8">
                This order was cancelled on {formatDate(order.statusHistory[order.statusHistory.length - 1].date)}.
              </p>
            )}

            <div className="border-t border-cream-deep pt-6">
              <p className="text-sm font-semibold text-brand-brownDark mb-3">Order Items</p>
              <div className="space-y-3 mb-6">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-brand-brown/80">
                    <span>
                      {item.productName} · {item.size} · Qty {item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-semibold text-brand-brownDark border-t border-cream-deep pt-3">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>

            <p className="text-xs text-brand-brown/50 mt-6">
              Placed on {formatDate(order.placedAt)} · Last updated {formatDate(order.updatedAt)}
            </p>
          </div>
        )}

        {searched && !order && !loading && !error && (
          <div className="text-center py-10">
            <PackageSearch className="mx-auto text-brand-brown/40 mb-3" size={40} />
            <p className="text-brand-brown/60">No order found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
