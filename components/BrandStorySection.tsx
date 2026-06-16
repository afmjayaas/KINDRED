import Image from "next/image";
import Link from "next/link";

export default function BrandStorySection() {
  return (
    <section className="container-luxe grid md:grid-cols-2 gap-12 items-center py-8">
      <div className="relative aspect-[4/5] rounded-xl2 overflow-hidden shadow-soft order-2 md:order-1">
        <Image
          src="/images/dresses/dress2.png"
          alt="KINDRED craftsmanship"
          fill
          className="object-cover"
        />
      </div>
      <div className="order-1 md:order-2">
        <p className="eyebrow mb-3">Our Story</p>
        <h2 className="font-serif text-3xl md:text-4xl text-brand-brownDark mb-5 leading-tight">
          Built on craft, worn with quiet confidence.
        </h2>
        <p className="text-brand-brown/80 leading-relaxed mb-4">
          KINDRED began with a simple idea: that elegance shouldn't be loud.
          Every piece we design balances considered fabric, thoughtful detail,
          and a silhouette that flatters rather than shouts.
        </p>
        <p className="text-brand-brown/80 leading-relaxed mb-8">
          From hand-finished lace to richly embroidered festive sets, our
          dresses are made for the women who shape their own moments —
          ordinary days and once-a-year occasions alike.
        </p>
        <Link href="/about" className="btn-secondary">
          Discover Our Story
        </Link>
      </div>
    </section>
  );
}
