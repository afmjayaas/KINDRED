import JournalForm from "@/components/admin/JournalForm";

export default function NewJournalPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-brand-brownDark mb-2">New Journal Post</h1>
      <p className="text-brand-brown/70 mb-8">
        This will appear on The Journal page and in the Home page preview.
      </p>
      <JournalForm />
    </div>
  );
}
