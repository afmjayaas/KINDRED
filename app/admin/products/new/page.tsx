import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-brand-brownDark mb-2">Add New Product</h1>
      <p className="text-brand-brown/70 mb-8">
        Upload images and fill in the details below. It will appear on the Shop page
        immediately, and on the Home page if marked as New Arrival or Featured.
      </p>
      <ProductForm />
    </div>
  );
}
