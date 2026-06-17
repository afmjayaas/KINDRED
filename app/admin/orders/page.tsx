import { getOrders } from "@/lib/db";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { formatDate } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = (await getOrders()).sort(
    (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
  );

  return (
    <div>
      <h1 className="font-serif text-3xl text-brand-brownDark mb-2">Orders</h1>
      <p className="text-brand-brown/70 mb-8">{orders.length} total orders</p>

      {orders.length === 0 ? (
        <div className="card-luxe p-12 text-center text-brand-brown/60">
          No orders yet. Orders placed via the Shop's "Inquire to Order" button will appear
          here.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card-luxe p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-serif text-lg text-brand-brownDark">
                    {order.orderNumber}
                  </p>
                  <p className="text-sm text-brand-brown/60">
                    {order.customerName} • {order.phone} • {order.email}
                  </p>
                  <p className="text-xs text-brand-brown/50 mt-1">
                    Placed {formatDate(order.placedAt)}
                  </p>
                </div>
                <OrderStatusSelect order={order} />
              </div>
              <div className="border-t border-cream-deep pt-3 space-y-1">
                {order.items.map((item, i) => (
                  <p key={i} className="text-sm text-brand-brown/80">
                    {item.quantity} × {item.productName} ({item.size}
                    {item.color ? `, ${item.color}` : ""}) — Rs. {item.price.toLocaleString("en-US")}
                  </p>
                ))}
              </div>
              <p className="text-right font-medium text-brand-brownDark mt-2">
                Total: Rs. {order.total.toLocaleString("en-US")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
