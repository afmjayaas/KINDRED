import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/db";
import { Plus } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const products = (await getProducts()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-brand-brownDark">Products</h1>
          <p className="text-brand-brown/70">{products.length} total</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary inline-flex items-center gap-2">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card-luxe p-12 text-center text-brand-brown/60">
          No products yet. Click "Add Product" to create your first dress listing.
        </div>
      ) : (
        <div className="card-luxe overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-brand-brown/60 bg-cream/60 border-b border-cream-deep">
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Flags</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-cream-deep/50">
                  <td className="py-3 px-4">
                    <div className="relative w-14 h-16 rounded-md overflow-hidden">
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-brand-brownDark">{p.name}</td>
                  <td className="py-3 px-4">{p.category}</td>
                  <td className="py-3 px-4">
                    {p.salePrice ? (
                      <span>
                        <span className="text-brand-orange font-medium">Rs. {p.salePrice}</span>{" "}
                        <span className="line-through text-brand-brown/40 text-xs">
                          Rs. {p.price}
                        </span>
                      </span>
                    ) : (
                      `Rs. ${p.price}`
                    )}
                  </td>
                  <td className="py-3 px-4">{p.stock}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {p.isNewArrival && (
                        <span className="text-[10px] bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                      {p.isFeatured && (
                        <span className="text-[10px] bg-brand-brown/10 text-brand-brown px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                      {p.isTrending && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                          Trending
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="text-brand-orange text-sm underline"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
