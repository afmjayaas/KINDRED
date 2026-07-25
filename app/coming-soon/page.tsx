"use client";

import { useEffect, useState } from "react";
import { ComingSoonSettings } from "@/lib/types";
import { Mail, Sparkles, Instagram, Facebook, Send, CheckCircle, Clock, ShieldCheck, Phone } from "lucide-react";

export default function ComingSoonPage() {
  const [settings, setSettings] = useState<ComingSoonSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribedMessage, setSubscribedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings/coming-soon");
        const data = await res.json();
        if (data.comingSoon) {
          setSettings(data.comingSoon);
        }
      } catch (err) {
        console.error("Failed to load coming soon settings", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!settings?.launchDate) return;

    function calculateTime() {
      const target = new Date(settings!.launchDate!).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [settings?.launchDate]);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setSubscribedMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Subscription failed.");

      setSubscribedMessage(data.message || "Thank you for subscribing! We'll notify you on launch.");
      setEmail("");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to subscribe.");
    } finally {
      setSubmitting(false);
    }
  }

  const headline = settings?.headline || "KINDRED is Opening Soon";
  const subtitle =
    settings?.subtitle ||
    "We are putting the finishing touches on our exclusive women's fashion collection. Subscribe to receive an invitation to our grand launch.";
  const bgImage = settings?.bgImage;

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-brand-cream text-brand-brownDark overflow-hidden font-sans">
      {/* Optional Background Image */}
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-multiply pointer-events-none"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}

      {/* Decorative Luxe Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-brand-gold/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-burgundy/10 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 container-luxe pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold tracking-widest text-brand-burgundy">KINDRED</span>
          <span className="text-[10px] tracking-widest uppercase font-semibold text-brand-gold bg-brand-burgundy px-2 py-0.5 rounded-full">
            Boutique
          </span>
        </div>

        <a
          href="/admin/login"
          className="text-xs font-medium text-brand-brown/70 hover:text-brand-burgundy transition-colors flex items-center gap-1"
        >
          <ShieldCheck size={14} /> Admin Access
        </a>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container-luxe py-12 flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-burgundy/10 text-brand-burgundy text-xs font-semibold tracking-wider uppercase mb-6 border border-brand-burgundy/20">
          <Sparkles size={14} /> Grand Opening Imminent
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-brand-brownDark leading-tight mb-6">
          {headline}
        </h1>

        <p className="text-base sm:text-lg text-brand-brown/80 max-w-2xl leading-relaxed mb-10 font-normal">
          {subtitle}
        </p>

        {/* Countdown Timer */}
        {timeLeft && (
          <div className="grid grid-cols-4 gap-3 sm:gap-6 mb-12 w-full max-w-md">
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Minutes", value: timeLeft.minutes },
              { label: "Seconds", value: timeLeft.seconds },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-md border border-brand-brown/15 p-3.5 sm:p-5 rounded-2xl shadow-sm text-center"
              >
                <div className="font-serif text-2xl sm:text-4xl font-bold text-brand-burgundy">
                  {String(unit.value).padStart(2, "0")}
                </div>
                <div className="text-[10px] sm:text-xs tracking-widest uppercase font-semibold text-brand-brown/60 mt-1">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIP Newsletter Lead Capture Form */}
        {settings?.enableNewsletter !== false && (
          <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-brand-brown/15 mb-10">
            <h3 className="font-serif text-lg font-medium text-brand-brownDark mb-2 flex items-center justify-center gap-2">
              <Mail size={18} className="text-brand-burgundy" /> Get Exclusive Access
            </h3>
            <p className="text-xs text-brand-brown/70 mb-4">
              Be the first to know when our collection launches and receive a VIP opening discount.
            </p>

            {subscribedMessage ? (
              <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center justify-center gap-2">
                <CheckCircle size={16} className="text-green-600 shrink-0" />
                <span>{subscribedMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-luxe text-sm flex-1 bg-white"
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary py-2.5 px-5 text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {submitting ? (
                    <Clock size={16} className="animate-spin" />
                  ) : (
                    <>
                      Notify Me <Send size={14} />
                    </>
                  )}
                </button>
              </form>
            )}

            {errorMessage && (
              <p className="text-xs text-red-600 mt-2 font-medium">{errorMessage}</p>
            )}
          </div>
        )}

        {/* Social Media & Contact Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-brand-brown/80">
          {settings?.socialLinks?.instagram && (
            <a
              href={settings.socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/70 border border-brand-brown/15 hover:bg-brand-burgundy hover:text-white transition-all shadow-sm"
            >
              <Instagram size={15} /> Instagram
            </a>
          )}
          {settings?.socialLinks?.facebook && (
            <a
              href={settings.socialLinks.facebook}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/70 border border-brand-brown/15 hover:bg-brand-burgundy hover:text-white transition-all shadow-sm"
            >
              <Facebook size={15} /> Facebook
            </a>
          )}
          {settings?.socialLinks?.whatsapp && (
            <a
              href={`https://wa.me/${settings.socialLinks.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/70 border border-brand-brown/15 hover:bg-brand-burgundy hover:text-white transition-all shadow-sm"
            >
              <Phone size={15} /> WhatsApp Inquiry
            </a>
          )}
          {settings?.contactEmail && (
            <a
              href={`mailto:${settings.contactEmail}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/70 border border-brand-brown/15 hover:bg-brand-burgundy hover:text-white transition-all shadow-sm"
            >
              <Mail size={15} /> {settings.contactEmail}
            </a>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 container-luxe py-6 border-t border-brand-brown/10 text-center text-xs text-brand-brown/60">
        © {new Date().getFullYear()} KINDRED Boutique. All rights reserved.
      </footer>
    </div>
  );
}
