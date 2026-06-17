import Link from "next/link";
import Image from "next/image";
import { getJournalPosts } from "@/lib/db";
import { Plus } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminJournalPage() {
  const posts = (await getJournalPosts()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-brand-brownDark">Journal Posts</h1>
          <p className="text-brand-brown/70">{posts.length} total</p>
        </div>
        <Link href="/admin/journal/new" className="btn-primary inline-flex items-center gap-2">
          <Plus size={18} /> New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="card-luxe p-12 text-center text-brand-brown/60">
          No journal posts yet. Click "New Post" to publish your first story.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <div key={post.id} className="card-luxe overflow-hidden">
              <div className="relative h-40 w-full">
                <Image src={post.image} alt={post.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <p className="text-xs text-brand-orange uppercase tracking-wide mb-1">
                  {post.category}
                </p>
                <h3 className="font-serif text-lg text-brand-brownDark mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <div className="flex items-center justify-between">
                  <Link
                    href={`/admin/journal/${post.id}/edit`}
                    className="text-brand-orange text-sm underline"
                  >
                    Edit
                  </Link>
                  <DeleteProductButton id={post.id} name={post.title} endpoint="/api/journal" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
