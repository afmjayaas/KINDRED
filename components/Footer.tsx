import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-brown text-cream mt-24">
      <div className="container-luxe py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Image
            src="/images/brand/icon.png"
            alt="KINDRED"
            width={64}
            height={51}
            className="h-12 w-auto object-contain mb-4 brightness-0 invert opacity-90"
          />
          <p className="text-cream-deep text-sm leading-relaxed max-w-xs">
            KINDRED is a modern boutique for women who dress with intention —
            elegant, considered pieces made to be lived in.
          </p>
        </div>

        <div>
          <h4 className="eyebrow text-brand-orange mb-4">Explore</h4>
          <ul className="space-y-3 text-sm text-cream-deep">
            <li><Link href="/shop" className="hover:text-cream transition-colors">Shop All</Link></li>
            <li><Link href="/shop?newArrival=true" className="hover:text-cream transition-colors">New Arrivals</Link></li>
            <li><Link href="/journal" className="hover:text-cream transition-colors">The Journal</Link></li>
            <li><Link href="/about" className="hover:text-cream transition-colors">Our Story</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-brand-orange mb-4">Support</h4>
          <ul className="space-y-3 text-sm text-cream-deep">
            <li><Link href="/track-order" className="hover:text-cream transition-colors">Track My Order</Link></li>
            <li><Link href="/about#contact" className="hover:text-cream transition-colors">Contact Us</Link></li>
            <li><Link href="/admin" className="hover:text-cream transition-colors">Admin Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-brand-orange mb-4">Stay Connected</h4>
          <div className="flex items-center gap-2 text-sm text-cream-deep mb-2">
            <Mail size={16} /> <span>hello@kindred.style</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-cream-deep mb-4">
            <Phone size={16} /> <span>+91 98765 43210</span>
          </div>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="p-2 rounded-full border border-cream-deep/40 hover:bg-brand-orange hover:border-brand-orange transition-colors">
              <Instagram size={16} />
            </a>
            <a href="#" aria-label="Facebook" className="p-2 rounded-full border border-cream-deep/40 hover:bg-brand-orange hover:border-brand-orange transition-colors">
              <Facebook size={16} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-cream-deep/20 py-5 text-center text-xs text-cream-deep/80">
        © {new Date().getFullYear()} KINDRED. All rights reserved.
      </div>
    </footer>
  );
}
