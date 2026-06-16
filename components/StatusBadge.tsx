import { OrderStatus } from "@/lib/types";

const STYLES: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-800 border-amber-300",
  Confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  Processing: "bg-purple-100 text-purple-800 border-purple-300",
  Shipped: "bg-cyan-100 text-cyan-800 border-cyan-300",
  Delivered: "bg-green-100 text-green-800 border-green-300",
  Cancelled: "bg-red-100 text-red-800 border-red-300",
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
