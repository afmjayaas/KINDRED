import { notFound } from "next/navigation";
import { getJournalPosts } from "@/lib/db";
import JournalForm from "@/components/admin/JournalForm";

interface EditJournalPageProps {
  params: { id: string };
}

export default async function EditJournalPage({ params }: EditJournalPageProps) {
  const post = (await getJournalPosts()).find((p) => p.id === params.id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl text-brand-brownDark mb-2">Edit Journal Post</h1>
      <p className="text-brand-brown/70 mb-8">Update "{post.title}".</p>
      <JournalForm initialPost={post} />
    </div>
  );
}
