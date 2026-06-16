import Link from "next/link";
import { getProducts, getJournalPosts, getOrders, getBanners } from "@/lib/db";
import { ShoppingBag, Newspaper, PackageSearch, Tag } from "lucide-react";

export default function AdminDashboard() {
  const products = getProducts();
  const journalPosts = getJournalPosts();
  const orders = getOrders();
  const banners = getBanners();

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: ShoppingBag,
      href: "/admin/products",
    },
    {
      label: "Active Offers",
      value: products.filter((p) => p.offerLabel).length,
      icon: Tag,
      href: "/admin/products",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: PackageSearch,
      href: "/admin/orders",
    },
    {
      label: "Journal Posts",
      value: journalPosts.length,
      icon: Newspaper,
      href: "/admin/journal",
    },
  ];

  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const lowStock = products.filter((p) => p.stock <= 5 && p.stock > 0).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  return (
    <div>
      <h1 className="font-serif text-3xl text-brand-brownDark mb-2">Dashboard</h1>
      <p className="text-brand-brown/70 mb-8">Welcome back. Here's what's happening at KINDRED.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card-luxe p-6">
            <s.icon className="text-brand-orange mb-3" size={26} />
            <p className="text-2xl font-semibold text-brand-brownDark">{s.value}</p>
            <p className="text-sm text-brand-brown/60">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-10">
        <div className="card-luxe p-6">
          <p className="text-sm text-brand-brown/60 mb-1">Pending Orders</p>
          <p className="text-2xl font-semibold text-amber-700">{pendingOrders}</p>
        </div>
        <div className="card-luxe p-6">
          <p className="text-sm text-brand-brown/60 mb-1">Low Stock (≤5)</p>
          <p className="text-2xl font-semibold text-orange-700">{lowStock}</p>
        </div>
        <div className="card-luxe p-6">
          <p className="text-sm text-brand-brown/60 mb-1">Out of Stock</p>
          <p className="text-2xl font-semibold text-red-700">{outOfStock}</p>
        </div>
      </div>

      <div className="card-luxe p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-brand-brownDark">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-brand-orange underline">
            View All
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-brand-brown/60">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-brand-brown/60 border-b border-cream-deep">
                  <th className="py-2 pr-4">Order #</th>
                  <th className="py-2 pr-4">Customer</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="border-b border-cream-deep/50">
                    <td className="py-2 pr-4 font-medium text-brand-brownDark">{o.orderNumber}</td>
                    <td className="py-2 pr-4">{o.customerName}</td>
                    <td className="py-2 pr-4">{o.status}</td>
                    <td className="py-2 pr-4">Rs. {o.total.toLocaleString("en-US")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
