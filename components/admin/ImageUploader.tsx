"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X, UploadCloud, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  target: "products" | "journal" | "banners";
  multiple?: boolean;
}

export default function ImageUploader({
  images,
  onChange,
  target,
  multiple = true,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("files", f));
      formData.append("target", target);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      const newPaths: string[] = data.paths || [];
      if (multiple) {
        onChange([...images, ...newPaths]);
      } else {
        onChange(newPaths.slice(0, 1));
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(idx: number) {
    onChange(images.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((img, idx) => (
          <div
            key={img + idx}
            className="relative w-24 h-24 rounded-lg overflow-hidden border border-cream-deep group"
          >
            <Image src={img} alt={`Image ${idx + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-24 h-24 rounded-lg border-2 border-dashed border-brand-brown/30 flex flex-col items-center justify-center text-brand-brown/60 hover:border-brand-orange hover:text-brand-orange transition-colors"
        >
          {uploading ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />}
          <span className="text-[11px] mt-1">{uploading ? "Uploading" : "Add"}</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
