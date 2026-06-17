import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/server-auth";
import { slugify } from "@/lib/utils";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const body = await req.json();
    const products = await getProducts();
    const idx = products.findIndex((p) => p.id === params.id);
    if (idx === -1) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    const existing = products[idx];
    let slug = existing.slug;
    if (body.name && body.name !== existing.name) {
      const baseSlug = slugify(body.name);
      slug = baseSlug;
      let i = 1;
      while (products.some((p) => p.slug === slug && p.id !== existing.id)) {
        slug = `${baseSlug}-${i++}`;
      }
    }
    const updated = {
      ...existing,
      ...body,
      slug,
      price: body.price !== undefined ? Number(body.price) : existing.price,
      salePrice: body.salePrice !== undefined && body.salePrice !== "" ? Number(body.salePrice) : null,
      stock: body.stock !== undefined ? Number(body.stock) : existing.stock,
      updatedAt: new Date().toISOString(),
    };
    products[idx] = updated;
    await saveProducts(products);
    return NextResponse.json({ product: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const products = await getProducts();
    const filtered = products.filter((p) => p.id !== params.id);
    if (filtered.length === products.length) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    await saveProducts(filtered);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  }
}
