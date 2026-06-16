"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JournalPost } from "@/lib/types";
import ImageUploader from "./ImageUploader";
import { Loader2 } from "lucide-react";

interface JournalFormProps {
  initialPost?: JournalPost;
}

export default function JournalForm({ initialPost }: JournalFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialPost);

  const [title, setTitle] = useState(initialPost?.title || "");
  const [category, setCategory] = useState(initialPost?.category || "Style Guide");
  const [date, setDate] = useState(
    initialPost?.date || new Date().toISOString().slice(0, 10)
  );
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [images, setImages] = useState<string[]>(
    initialPost?.image ? [initialPost.image] : []
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title || !excerpt || !content || images.length === 0) {
      setError("Please fill in title, excerpt, content, and add a cover image.");
      return;
    }

    setSubmitting(true);
    const payload = {
      title,
      category,
      date,
      excerpt,
      content,
      image: images[0],
    };

    try {
      const url = isEdit ? `/api/journal/${initialPost!.id}` : "/api/journal";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }
      router.push("/admin/journal");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="card-luxe p-6">
        <h2 className="font-serif text-lg text-brand-brownDark mb-4">Cover Image</h2>
        <ImageUploader images={images} onChange={setImages} target="journal" multiple={false} />
      </div>

      <div className="card-luxe p-6 grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-brand-brownDark mb-1">Title</label>
          <input className="input-luxe" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-brownDark mb-1">Category</label>
          <input
            className="input-luxe"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Style Guide, Care Tips"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-brownDark mb-1">Date</label>
          <input
            type="date"
            className="input-luxe"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-brand-brownDark mb-1">
            Short Description / Excerpt
          </label>
          <textarea
            className="input-luxe min-h-[80px]"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-brand-brownDark mb-1">
            Full Article Content (use blank lines between paragraphs)
          </label>
          <textarea
            className="input-luxe min-h-[220px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} /> Saving...
            </span>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Publish Post"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/journal")}
          className="btn-outline-light !text-brand-brown !border-brand-brown/30"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
