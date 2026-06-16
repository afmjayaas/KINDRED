import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/server-auth";
import { slugify } from "@/lib/utils";
import { Product } from "@/lib/types";
import crypto from "crypto";

export async function GET() {
  try {
    const products = getProducts();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Failed to load products." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const body = await req.json();
    const required = ["name", "price", "category"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Field "${field}" is required.` }, { status: 400 });
      }
    }
    const products = getProducts();
    const baseSlug = slugify(body.name);
    let slug = baseSlug;
    let i = 1;
    while (products.some((p) => p.slug === slug)) {
      slug = `${baseSlug}-${i++}`;
    }
    const now = new Date().toISOString();
    const newProduct: Product = {
      id: crypto.randomUUID(),
      slug,
      name: body.name,
      price: Number(body.price) || 0,
      salePrice: body.salePrice ? Number(body.salePrice) : null,
      category: body.category,
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
      colors: Array.isArray(body.colors) ? body.colors : [],
      stock: Number(body.stock) || 0,
      description: body.description || "",
      fabric: body.fabric || "",
      careInstructions: body.careInstructions || "",
      images: Array.isArray(body.images) ? body.images : [],
      isNewArrival: !!body.isNewArrival,
      isFeatured: !!body.isFeatured,
      isTrending: !!body.isTrending,
      offerLabel: body.offerLabel || null,
      createdAt: now,
      updatedAt: now,
    };
    products.unshift(newProduct);
    saveProducts(products);
    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}
