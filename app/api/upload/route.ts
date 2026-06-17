import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/server-auth";
import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_SIZE = 8 * 1024 * 1024; // 8MB

// On Vercel, the deployment filesystem is read-only at runtime, so writing
// into /public/uploads does not persist. When a Vercel Blob store is
// connected to this project (Storage tab -> kindred-blob), @vercel/blob's
// put() automatically authenticates using Vercel's runtime credentials
// (OIDC) - no BLOB_READ_WRITE_TOKEN env var is needed or shown in the
// dashboard for this. We detect "running on Vercel" via the VERCEL env var
// (set automatically on every Vercel deployment) and use Blob storage in
// that case. Locally (no VERCEL env var), files are written to
// /public/uploads so `npm run dev` keeps working with no extra setup. If a
// BLOB_READ_WRITE_TOKEN happens to be set (e.g. older setups or local
// `vercel env pull`), that also counts as configured.
const blobConfigured = !!process.env.VERCEL || !!process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const target = (formData.get("target") as string) || "products";
    const safeTarget = ["products", "journal", "banners"].includes(target) ? target : "products";
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files were provided." }, { status: 400 });
    }

    const savedPaths: string[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.type}. Please upload PNG, JPG, or WEBP images.` },
          { status: 400 }
        );
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: `"${file.name}" exceeds the 8MB limit.` }, { status: 400 });
      }
      const ext = path.extname(file.name) || ".png";
      const filename = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      if (blobConfigured) {
        const blob = await put(`uploads/${safeTarget}/${filename}`, buffer, {
          access: "public",
          contentType: file.type,
          addRandomSuffix: false,
        });
        savedPaths.push(blob.url);
      } else {
        const uploadDir = path.join(process.cwd(), "public", "uploads", safeTarget);
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        fs.writeFileSync(path.join(uploadDir, filename), buffer);
        savedPaths.push(`/uploads/${safeTarget}/${filename}`);
      }
    }

    return NextResponse.json({ paths: savedPaths });
  } catch (err) {
    console.error("[upload] failed:", err);
    return NextResponse.json({ error: "Failed to upload file(s)." }, { status: 500 });
  }
}
