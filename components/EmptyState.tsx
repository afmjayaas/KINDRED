import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white/60 rounded-xl2 border border-cream-deep">
      <div className="text-brand-orange mb-4">{icon ?? <PackageOpen size={42} />}</div>
      <h3 className="font-serif text-xl text-brand-brownDark mb-2">{title}</h3>
      {message && <p className="text-brand-brown/70 text-sm max-w-sm">{message}</p>}
    </div>
  );
}
