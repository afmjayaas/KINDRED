"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  ShoppingBag,
  Newspaper,
  Image as ImageIcon,
  PackageSearch,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/journal", label: "Journal Posts", icon: Newspaper },
  { href: "/admin/banners", label: "Promo Banners", icon: ImageIcon },
  { href: "/admin/orders", label: "Orders", icon: PackageSearch },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-brand-brownDark">{children}</div>;
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-cream">
      <aside className="hidden lg:flex flex-col w-64 bg-brand-brownDark text-cream shrink-0">
        <div className="p-6 border-b border-cream/10">
          <Image
            src="/images/brand/icon.png"
            alt="KINDRED"
            width={48}
            height={38}
            className="h-9 w-auto object-contain brightness-0 invert"
          />
          <p className="text-xs text-cream-deep mt-2 uppercase tracking-wider">Admin Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  active ? "bg-brand-orange text-cream" : "text-cream-deep hover:bg-cream/10"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-cream/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-cream-deep hover:bg-cream/10 w-full transition-colors"
          >
            <LogOut size={18} /> Log Out
          </button>
          <Link href="/" className="block text-xs text-cream-deep/60 mt-3 px-4 hover:text-cream-deep">
            ← Back to Website
          </Link>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-brand-brownDark text-cream flex items-center justify-between px-5 py-4">
        <Image
          src="/images/brand/icon.png"
          alt="KINDRED"
          width={36}
          height={29}
          className="h-7 w-auto object-contain brightness-0 invert"
        />
        <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-brand-brownDark text-cream pt-20 px-5">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${
                    active ? "bg-brand-orange text-cream" : "text-cream-deep"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-cream-deep w-full"
            >
              <LogOut size={18} /> Log Out
            </button>
          </nav>
        </div>
      )}

      <main className="flex-1 p-6 lg:p-10 pt-24 lg:pt-10 max-w-6xl">{children}</main>
    </div>
  );
}
