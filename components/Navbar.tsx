"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/track-order", label: "Track My Order" },
  { href: "/journal", label: "The Journal" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 backdrop-blur shadow-card"
          : "bg-cream/80 backdrop-blur"
      }`}
    >
      <div className="container-luxe flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/images/brand/logo-horizontal.png"
            alt="KINDRED"
            width={150}
            height={74}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm uppercase tracking-wider transition-colors ${
                pathname === link.href
                  ? "text-brand-orange font-semibold"
                  : "text-brand-brown hover:text-brand-orange"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/shop"
            aria-label="Search products"
            className="text-brand-brown hover:text-brand-orange transition-colors"
          >
            <Search size={20} />
          </Link>
          <Link href="/admin" className="btn-secondary text-xs py-2 px-5">
            Admin
          </Link>
        </div>

        <button
          className="lg:hidden text-brand-brown"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-cream border-t border-cream-deep px-6 py-6 flex flex-col gap-5 animate-fadeIn">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-base uppercase tracking-wide ${
                pathname === link.href
                  ? "text-brand-orange font-semibold"
                  : "text-brand-brown"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/admin" className="btn-secondary text-xs py-2 px-5 w-fit">
            Admin Portal
          </Link>
        </div>
      )}
    </header>
  );
}
