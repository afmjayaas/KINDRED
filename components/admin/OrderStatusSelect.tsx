"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Order, OrderStatus } from "@/lib/types";
import { Loader2 } from "lucide-react";

const STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function OrderStatusSelect({ order }: { order: Order }) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [saving, setSaving] = useState(false);

  async function handleChange(newStatus: OrderStatus) {
    setStatus(newStatus);
    setSaving(true);
    try {
      await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...order, status: newStatus }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        className="input-luxe !py-1.5 !px-3 text-sm w-auto"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {saving && <Loader2 className="animate-spin text-brand-orange" size={16} />}
    </div>
  );
}
