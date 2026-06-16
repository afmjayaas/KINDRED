import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[78vh] min-h-[520px] w-full">
        <Image
          src="/images/brand/cover.png"
          alt="KINDRED — New Season Collection"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-brownDark/70 via-brand-brownDark/30 to-transparent" />
        <div className="relative z-10 h-full container-luxe flex items-center">
          <div className="max-w-lg fade-up">
            <p className="eyebrow text-cream-deep mb-4">New Season · 2026</p>
            <h1 className="font-serif text-4xl md:text-6xl text-cream leading-[1.1] mb-6">
              Dress with intention.
            </h1>
            <p className="text-cream/90 text-base md:text-lg leading-relaxed mb-8 max-w-md">
              Discover KINDRED's collection of considered, elegant dresses —
              crafted for women who move through life with quiet confidence.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="btn-primary">
                Shop the Collection
              </Link>
              <Link href="/about" className="btn-outline-light">
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
