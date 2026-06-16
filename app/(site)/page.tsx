import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import JournalCard from "@/components/JournalCard";
import PromoBanner from "@/components/PromoBanner";
import BrandStorySection from "@/components/BrandStorySection";
import EmptyState from "@/components/EmptyState";
import { getProducts, getJournalPosts, getBanners } from "@/lib/db";
import Link from "next/link";

export default function HomePage() {
  const products = getProducts();
  const journalPosts = getJournalPosts();
  const banners = getBanners().filter((b) => b.active).sort((a, b) => a.order - b.order);

  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const featured = products.filter((p) => p.isFeatured).slice(0, 4);
  const trending = products.filter((p) => p.isTrending).slice(0, 4);

  return (
    <div className="pb-8">
      <Hero />

      <section className="container-luxe py-20">
        <SectionHeading
          eyebrow="Just In"
          title="New Arrivals"
          subtitle="Fresh silhouettes and seasonal fabrics, added to the KINDRED wardrobe."
        />
        {newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No new arrivals yet"
            message="Check back soon — new pieces are added regularly from the admin portal."
          />
        )}
      </section>

      {banners[0] && <PromoBanner banner={banners[0]} />}

      <section className="container-luxe py-20">
        <SectionHeading
          eyebrow="Curated"
          title="Featured Dresses"
          subtitle="A handpicked edit of the pieces we can't stop reaching for."
        />
        {featured.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No featured dresses yet"
            message="Mark products as Featured from the admin portal to showcase them here."
          />
        )}
      </section>

      <BrandStorySection />

      <section className="container-luxe py-20">
        <SectionHeading
          eyebrow="Loved By Many"
          title="Trending Now"
          subtitle="The dresses our community keeps coming back for."
        />
        {trending.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
            {trending.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No trending dresses yet"
            message="Trending items will appear here as products are marked from the admin portal."
          />
        )}
      </section>

      {banners[1] && <PromoBanner banner={banners[1]} />}

      <section className="container-luxe py-20">
        <div className="flex items-end justify-between mb-2">
          <SectionHeading
            eyebrow="The Journal"
            title="Stories & Style Notes"
            subtitle="Fashion edits, care guides, and behind-the-seams stories from KINDRED."
          />
          <Link href="/journal" className="btn-secondary hidden md:inline-flex mb-10">
            View All
          </Link>
        </div>
        {journalPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {journalPosts.slice(0, 3).map((post) => (
              <JournalCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="The Journal is empty"
            message="New stories will appear here once published from the admin portal."
          />
        )}
      </section>
    </div>
  );
}
