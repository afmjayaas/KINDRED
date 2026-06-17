import { Metadata } from "next";
import { getJournalPosts } from "@/lib/db";
import JournalCard from "@/components/JournalCard";
import EmptyState from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "The Journal | KINDRED",
  description: "Style guides, care tips, and stories from the KINDRED studio.",
};

export default async function JournalPage() {
  const posts = (await getJournalPosts()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div>
      <div className="bg-brand-brown py-14 text-center">
        <p className="eyebrow text-brand-orange mb-2">Stories & Style</p>
        <h1 className="font-serif text-3xl md:text-5xl text-cream">The Journal</h1>
      </div>
      <div className="container-luxe py-16">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {posts.map((post) => (
              <JournalCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="The Journal is empty"
            message="New articles will appear here once published from the admin portal."
          />
        )}
      </div>
    </div>
  );
}
