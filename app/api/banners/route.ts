import { NextRequest, NextResponse } from "next/server";
import { getBanners, saveBanners } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/server-auth";
import { Banner } from "@/lib/types";
import crypto from "crypto";

export async function GET() {
  try {
    const banners = await getBanners();
    return NextResponse.json({ banners });
  } catch {
    return NextResponse.json({ error: "Failed to load banners." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    const banners = await getBanners();
    const newBanner: Banner = {
      id: crypto.randomUUID(),
      title: body.title,
      subtitle: body.subtitle || "",
      image: body.image || "/images/brand/cover.png",
      ctaText: body.ctaText || "Shop Now",
      ctaLink: body.ctaLink || "/shop",
      active: body.active !== undefined ? !!body.active : true,
      order: banners.length + 1,
    };
    banners.push(newBanner);
    await saveBanners(banners);
    return NextResponse.json({ banner: newBanner }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create banner." }, { status: 500 });
  }
}
