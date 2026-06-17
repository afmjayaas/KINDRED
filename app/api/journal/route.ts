import { NextRequest, NextResponse } from "next/server";
import { getJournalPosts, saveJournalPosts } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/server-auth";
import { slugify } from "@/lib/utils";
import { JournalPost } from "@/lib/types";
import crypto from "crypto";

export async function GET() {
  try {
    const posts = await getJournalPosts();
    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ error: "Failed to load journal posts." }, { status: 500 });
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
    const posts = await getJournalPosts();
    const baseSlug = slugify(body.title);
    let slug = baseSlug;
    let i = 1;
    while (posts.some((p) => p.slug === slug)) {
      slug = `${baseSlug}-${i++}`;
    }
    const now = new Date().toISOString();
    const newPost: JournalPost = {
      id: crypto.randomUUID(),
      slug,
      title: body.title,
      image: body.image || "/images/brand/cover.png",
      category: body.category || "Journal",
      date: body.date || now,
      excerpt: body.excerpt || "",
      content: body.content || "",
      createdAt: now,
      updatedAt: now,
    };
    posts.unshift(newPost);
    await saveJournalPosts(posts);
    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create journal post." }, { status: 500 });
  }
}
