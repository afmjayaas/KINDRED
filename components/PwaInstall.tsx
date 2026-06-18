"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

// Registers the service worker (so the site is installable + works offline)
// and shows a small, dismissible "Install App" prompt:
//  - On Android/Chrome/Edge: a real install button via the beforeinstallprompt event.
//  - On iOS Safari (which has no install event): short "Add to Home Screen" instructions.
// Dismissing is remembered for 14 days via localStorage so it never nags.

const DISMISS_KEY = "kindred_pwa_dismissed_until";
const DISMISS_DAYS = 14;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

function isIOSDevice() {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export default function PwaInstall() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Non-fatal — the site still works without offline support.
      });
    }
  }, []);

  useEffect(() => {
    if (isStandalone()) return; // already installed, never show

    const dismissedUntil = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (Date.now() < dismissedUntil) return;

    const ios = isIOSDevice();
    setIsIOS(ios);

    if (ios) {
      setShowBanner(true);
      return;
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  function dismiss() {
    setShowBanner(false);
    localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000));
  }

  async function handleInstall() {
    if (!deferredEvent) return;
    await deferredEvent.prompt();
    const { outcome } = await deferredEvent.userChoice;
    if (outcome === "accepted") setShowBanner(false);
    setDeferredEvent(null);
  }

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[60] sm:left-auto sm:right-4 sm:w-80 animate-fadeUp">
      <div className="bg-white border border-cream-deep rounded-xl2 shadow-soft p-4 flex gap-3 items-start">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-brand-brown/10 flex items-center justify-center text-brand-brown">
          <Download size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-brand-brown">Install the KINDRED app</p>
          {isIOS ? (
            <p className="text-xs text-brand-brown/80 mt-1 leading-relaxed">
              Tap <Share size={12} className="inline -mt-0.5" /> Share, then "Add to Home Screen" for
              quick access and a full-screen experience.
            </p>
          ) : (
            <p className="text-xs text-brand-brown/80 mt-1 leading-relaxed">
              Get faster access, offline browsing, and a full-screen app experience on your phone.
            </p>
          )}
          {!isIOS && (
            <button
              onClick={handleInstall}
              className="mt-3 text-xs font-semibold uppercase tracking-wide bg-brand-brown text-cream px-4 py-2 rounded-full hover:bg-brand-brownDark transition-colors"
            >
              Install
            </button>
          )}
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 text-brand-brown/50 hover:text-brand-brown"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
