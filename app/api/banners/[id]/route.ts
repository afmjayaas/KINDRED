import { NextRequest, NextResponse } from "next/server";
import { getBanners, saveBanners } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/server-auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const body = await req.json();
    const banners = getBanners();
    const idx = banners.findIndex((b) => b.id === params.id);
    if (idx === -1) {
      return NextResponse.json({ error: "Banner not found." }, { status: 404 });
    }
    banners[idx] = { ...banners[idx], ...body };
    saveBanners(banners);
    return NextResponse.json({ banner: banners[idx] });
  } catch {
    return NextResponse.json({ error: "Failed to update banner." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const banners = getBanners();
    const filtered = banners.filter((b) => b.id !== params.id);
    if (filtered.length === banners.length) {
      return NextResponse.json({ error: "Banner not found." }, { status: 404 });
    }
    saveBanners(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete banner." }, { status: 500 });
  }
}
