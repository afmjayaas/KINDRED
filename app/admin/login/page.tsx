"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      router.push(searchParams.get("next") || "/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="bg-cream rounded-xl2 shadow-soft max-w-sm w-full p-9">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/images/brand/icon.png"
            alt="KINDRED"
            width={56}
            height={45}
            className="h-11 w-auto object-contain mb-4"
          />
          <h1 className="font-serif text-2xl text-brand-brownDark">Admin Portal</h1>
          <p className="text-sm text-brand-brown/60 mt-1">Sign in to manage your store</p>
        </div>
        {error && <p className="text-sm text-red-600 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-brand-brownDark mb-1 block">Username</label>
            <input
              className="input-luxe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-brand-brownDark mb-1 block">Password</label>
            <input
              type="password"
              className="input-luxe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
