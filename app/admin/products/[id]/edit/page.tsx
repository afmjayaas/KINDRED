import { notFound } from "next/navigation";
import { getProductById } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

interface EditProductPageProps {
  params: { id: string };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const product = getProductById(params.id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl text-brand-brownDark mb-2">Edit Product</h1>
      <p className="text-brand-brown/70 mb-8">Update details for "{product.name}".</p>
      <ProductForm initialProduct={product} />
    </div>
  );
}
