"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteButtonProps {
  id: string;
  name: string;
  endpoint?: string;
}

export default function DeleteProductButton({ id, name, endpoint = "/api/products" }: DeleteButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-sm">
        <span className="text-brand-brown/70">Delete "{name}"?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-600 font-medium underline"
        >
          {deleting ? <Loader2 className="animate-spin inline" size={14} /> : "Yes"}
        </button>
        <button onClick={() => setConfirming(false)} className="text-brand-brown/60 underline">
          No
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-red-600/80 hover:text-red-600 text-sm inline-flex items-center gap-1"
    >
      <Trash2 size={14} /> Delete
    </button>
  );
}
