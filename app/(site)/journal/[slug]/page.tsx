import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getJournalPostBySlug, getJournalPosts } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import JournalCard from "@/components/JournalCard";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getJournalPostBySlug(params.slug);
  if (!post) return { title: "Article Not Found | KINDRED" };
  return {
    title: `${post.title} | KINDRED Journal`,
    description: post.excerpt,
    openGraph: { images: [post.image] },
  };
}

export default function JournalArticlePage({ params }: { params: { slug: string } }) {
  const post = getJournalPostBySlug(params.slug);
  if (!post) notFound();

  const more = getJournalPosts()
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  return (
    <article>
      <div className="relative h-[50vh] min-h-[360px] w-full">
        <Image src={post.image} alt={post.title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-brownDark/80 via-brand-brownDark/20 to-transparent" />
        <div className="relative z-10 h-full container-luxe flex flex-col items-start justify-end pb-12">
          <span className="bg-cream text-brand-brown text-xs uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-cream max-w-2xl leading-tight">{post.title}</h1>
          <p className="text-cream/80 text-sm mt-3">{formatDate(post.date)}</p>
        </div>
      </div>

      <div className="container-luxe py-14 max-w-2xl">
        {post.content.split("\n\n").map((para, i) => (
          <p key={i} className="text-brand-brown/85 leading-relaxed mb-5 text-base">
            {para}
          </p>
        ))}
        <Link href="/journal" className="btn-secondary mt-6 inline-flex">
          Back to The Journal
        </Link>
      </div>

      {more.length > 0 && (
        <section className="container-luxe py-16 border-t border-cream-deep">
          <h2 className="font-serif text-2xl text-brand-brownDark mb-8">More Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {more.map((p) => (
              <JournalCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
