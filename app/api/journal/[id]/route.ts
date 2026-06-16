import { NextRequest, NextResponse } from "next/server";
import { getJournalPosts, saveJournalPosts } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/server-auth";
import { slugify } from "@/lib/utils";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const body = await req.json();
    const posts = getJournalPosts();
    const idx = posts.findIndex((p) => p.id === params.id);
    if (idx === -1) {
      return NextResponse.json({ error: "Journal post not found." }, { status: 404 });
    }
    const existing = posts[idx];
    let slug = existing.slug;
    if (body.title && body.title !== existing.title) {
      const baseSlug = slugify(body.title);
      slug = baseSlug;
      let i = 1;
      while (posts.some((p) => p.slug === slug && p.id !== existing.id)) {
        slug = `${baseSlug}-${i++}`;
      }
    }
    const updated = { ...existing, ...body, slug, updatedAt: new Date().toISOString() };
    posts[idx] = updated;
    saveJournalPosts(posts);
    return NextResponse.json({ post: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update journal post." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const posts = getJournalPosts();
    const filtered = posts.filter((p) => p.id !== params.id);
    if (filtered.length === posts.length) {
      return NextResponse.json({ error: "Journal post not found." }, { status: 404 });
    }
    saveJournalPosts(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete journal post." }, { status: 500 });
  }
}
