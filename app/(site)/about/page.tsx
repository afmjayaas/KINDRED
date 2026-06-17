import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Gem, HeartHandshake, Sparkles, Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "About KINDRED | Our Story",
  description:
    "KINDRED is a premium women's fashion boutique rooted in elegant, modest, and considered design. Learn about our values, craft, and story.",
};

const values = [
  {
    icon: Gem,
    title: "Considered Quality",
    text: "Every fabric and finish is chosen to last — we'd rather make fewer pieces beautifully than many pieces quickly.",
  },
  {
    icon: Leaf,
    title: "Elegant, Modest Design",
    text: "Our silhouettes celebrate the body with grace — flattering necklines, gentle draping, and timeless proportions.",
  },
  {
    icon: HeartHandshake,
    title: "Crafted With Care",
    text: "From hand-finished lace to embroidered borders, our pieces carry the marks of real craftsmanship.",
  },
  {
    icon: Sparkles,
    title: "Quiet Confidence",
    text: "We design for women who don't need to shout to be noticed — KINDRED is for those who dress with intention.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <div className="relative h-[60vh] min-h-[420px] w-full">
        <Image src="/images/brand/cover.png" alt="KINDRED" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-brand-brownDark/55 flex flex-col items-center justify-center text-center px-6">
          <Image
            src="/images/brand/icon.png"
            alt="KINDRED"
            width={90}
            height={72}
            className="h-16 w-auto object-contain mb-6 brightness-0 invert"
          />
          <p className="eyebrow text-cream-deep mb-3">Our Story</p>
          <h1 className="font-serif text-3xl md:text-5xl text-cream max-w-2xl">
            Elegant fashion, made with intention.
          </h1>
        </div>
      </div>

      <section className="container-luxe py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="eyebrow mb-3">Who We Are</p>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-brownDark mb-5 leading-tight">
            A boutique built around the modern, modest woman.
          </h2>
          <p className="text-brand-brown/80 leading-relaxed mb-4">
            KINDRED was founded on the belief that elegant dressing doesn't
            require excess. We design dresses that honor classic
            silhouettes — modest necklines, considered sleeve lengths, and
            flowing hemlines — while feeling unmistakably current.
          </p>
          <p className="text-brand-brown/80 leading-relaxed">
            Each collection is shaped around versatility: pieces that move
            effortlessly from daytime errands to evening celebrations, festive
            gatherings to quiet Sundays. Whatever the occasion, KINDRED is
            designed to make you feel like yourself, only more so.
          </p>
        </div>
        <div className="relative aspect-[4/5] rounded-xl2 overflow-hidden shadow-soft">
          <Image src="/images/dresses/dress4.png" alt="KINDRED design detail" fill className="object-cover" />
        </div>
      </section>

      <section className="bg-brand-brown py-20">
        <div className="container-luxe">
          <p className="eyebrow text-brand-orange mb-3 text-center">What We Stand For</p>
          <h2 className="font-serif text-3xl md:text-4xl text-cream text-center mb-14">
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div key={v.title} className="text-center px-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-cream/10 text-brand-orange mb-4">
                  <v.icon size={26} />
                </div>
                <h3 className="font-serif text-lg text-cream mb-2">{v.title}</h3>
                <p className="text-cream-deep text-sm leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-luxe py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/5] rounded-xl2 overflow-hidden shadow-soft order-2 md:order-1">
          <Image src="/images/dresses/dress3.png" alt="KINDRED craftsmanship" fill className="object-cover" />
        </div>
        <div className="order-1 md:order-2">
          <p className="eyebrow mb-3">Design & Craft</p>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-brownDark mb-5 leading-tight">
            Quality you can see — and feel.
          </h2>
          <p className="text-brand-brown/80 leading-relaxed mb-4">
            We work closely with skilled artisans to bring lace overlays,
            hand embroidery, and zari detailing to life. Every piece passes
            through multiple quality checks before it reaches your hands.
          </p>
          <p className="text-brand-brown/80 leading-relaxed">
            We believe fashion should feel as good as it looks — which is why
            we prioritize breathable, skin-friendly fabrics and finishings
            that hold up wear after wear.
          </p>
        </div>
      </section>

      <section id="contact" className="bg-cream-deep/30 py-20">
        <div className="container-luxe text-center max-w-2xl mx-auto">
          <p className="eyebrow mb-3">Get In Touch</p>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-brownDark mb-5">
            We'd Love to Hear From You
          </h2>
          <p className="text-brand-brown/80 leading-relaxed mb-10">
            Have a question about sizing, a custom order, or just want to say
            hello? Reach out — our team responds personally to every message.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8 mb-10 text-brand-brown/80">
            <div className="flex items-center justify-center gap-2">
              <Mail size={18} className="text-brand-orange" /> info@kindred.com
            </div>
            <div className="flex items-center justify-center gap-2">
              <Phone size={18} className="text-brand-orange" /> +94 77 2051527
            </div>
            <div className="flex items-center justify-center gap-2">
              <MapPin size={18} className="text-brand-orange" /> Kalmunai, Sri Lanka
            </div>
          </div>
          <Link href="/shop" className="btn-primary">
            Explore the Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
