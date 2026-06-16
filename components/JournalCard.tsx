import Image from "next/image";
import Link from "next/link";
import { JournalPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function JournalCard({ post }: { post: JournalPost }) {
  return (
    <Link href={`/journal/${post.slug}`} className="card-luxe group block overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl2">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 bg-cream/90 text-brand-brown text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
          {post.category}
        </span>
      </div>
      <div className="p-5">
        <p className="text-xs text-brand-brown/60 mb-2">{formatDate(post.date)}</p>
        <h3 className="font-serif text-lg text-brand-brownDark mb-2 leading-snug group-hover:text-brand-orange transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-brand-brown/70 leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}
