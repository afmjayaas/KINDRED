import Image from "next/image";
import Link from "next/link";
import { Banner } from "@/lib/types";

export default function PromoBanner({ banner }: { banner: Banner }) {
  return (
    <section className="container-luxe">
      <div className="relative rounded-xl2 overflow-hidden h-[320px] md:h-[380px] shadow-soft">
        <Image
          src={banner.image}
          alt={banner.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-brownDark/80 via-brand-brownDark/30 to-transparent" />
        <div className="relative z-10 h-full flex flex-col items-start justify-end p-8 md:p-12">
          <p className="eyebrow text-brand-orange mb-2">Limited Time</p>
          <h3 className="font-serif text-2xl md:text-4xl text-cream mb-2">{banner.title}</h3>
          <p className="text-cream/90 mb-6 max-w-md">{banner.subtitle}</p>
          <Link href={banner.ctaLink} className="btn-primary">
            {banner.ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}
