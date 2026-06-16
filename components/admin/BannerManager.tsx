"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Banner } from "@/lib/types";
import ImageUploader from "./ImageUploader";
import { Loader2, Plus, Trash2, Pencil, X } from "lucide-react";

interface BannerManagerProps {
  initialBanners: Banner[];
}

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  ctaText: "Shop Now",
  ctaLink: "/shop",
  active: true,
  images: [] as string[],
};

export default function BannerManager({ initialBanners }: BannerManagerProps) {
  const router = useRouter();
  const [banners, setBanners] = useState(initialBanners);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function startCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(b: Banner) {
    setForm({
      title: b.title,
      subtitle: b.subtitle,
      ctaText: b.ctaText,
      ctaLink: b.ctaLink,
      active: b.active,
      images: [b.image],
    });
    setEditingId(b.id);
    setShowForm(true);
  }

  async function refresh() {
    const res = await fetch("/api/banners");
    const data = await res.json();
    setBanners(data.banners || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title || form.images.length === 0) {
      setError("Please add a title and an image.");
      return;
    }
    setSubmitting(true);
    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      ctaText: form.ctaText,
      ctaLink: form.ctaLink,
      active: form.active,
      image: form.images[0],
    };
    try {
      const url = editingId ? `/api/banners/${editingId}` : "/api/banners";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        return;
      }
      await refresh();
      setShowForm(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/banners/${id}`, { method: "DELETE" });
    await refresh();
    router.refresh();
  }

  async function toggleActive(b: Banner) {
    await fetch(`/api/banners/${b.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...b, active: !b.active }),
    });
    await refresh();
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-brand-brown/70">{banners.length} banner(s)</p>
        <button onClick={startCreate} className="btn-primary inline-flex items-center gap-2">
          <Plus size={18} /> Add Banner
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-luxe p-6 mb-8 space-y-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-brand-brownDark">
              {editingId ? "Edit Banner" : "New Banner"}
            </h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={18} className="text-brand-brown/60" />
            </button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <ImageUploader
            images={form.images}
            onChange={(images) => setForm((f) => ({ ...f, images }))}
            target="banners"
            multiple={false}
          />
          <div>
            <label className="block text-sm font-medium text-brand-brownDark mb-1">Title</label>
            <input
              className="input-luxe"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-brownDark mb-1">
              Subtitle
            </label>
            <input
              className="input-luxe"
              value={form.subtitle}
              onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-brownDark mb-1">
                Button Text
              </label>
              <input
                className="input-luxe"
                value={form.ctaText}
                onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-brownDark mb-1">
                Button Link
              </label>
              <input
                className="input-luxe"
                value={form.ctaLink}
                onChange={(e) => setForm((f) => ({ ...f, ctaLink: e.target.value }))}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-brand-brownDark">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              className="w-4 h-4 accent-brand-orange"
            />
            Active (visible on Home page)
          </label>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? <Loader2 className="animate-spin" size={16} /> : "Save Banner"}
          </button>
        </form>
      )}

      {banners.length === 0 ? (
        <div className="card-luxe p-12 text-center text-brand-brown/60">
          No banners yet. Click "Add Banner" to create your first promotion.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {banners.map((b) => (
            <div key={b.id} className="card-luxe overflow-hidden">
              <div className="relative h-36 w-full">
                <Image src={b.image} alt={b.title} fill className="object-cover" />
                {!b.active && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm">
                    Inactive
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg text-brand-brownDark">{b.title}</h3>
                <p className="text-sm text-brand-brown/60 mb-3">{b.subtitle}</p>
                <div className="flex items-center gap-4 text-sm">
                  <button onClick={() => startEdit(b)} className="text-brand-orange inline-flex items-center gap-1">
                    <Pencil size={14} /> Edit
                  </button>
                  <button onClick={() => toggleActive(b)} className="text-brand-brown/70 underline">
                    {b.active ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="text-red-600/80 inline-flex items-center gap-1">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
