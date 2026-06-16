import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6">
      <div className="text-center max-w-md">
        <p className="eyebrow mb-3">KINDRED</p>
        <h1 className="font-serif text-5xl text-brand-brownDark mb-4">404</h1>
        <p className="text-brand-brown/70 mb-8">
          The page you're looking for has drifted off the rack. Let's get you back to
          something beautiful.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
