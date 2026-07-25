"use client";

import { useState } from "react";
import { ComingSoonSettings } from "@/lib/types";
import { Loader2, Clock, CheckCircle, AlertCircle, ExternalLink, Users, Sparkles, Copy } from "lucide-react";

export default function ComingSoonSettingsForm({
  initialSettings,
  subscribers = [],
}: {
  initialSettings: ComingSoonSettings;
  subscribers?: string[];
}) {
  const [enabled, setEnabled] = useState(initialSettings.enabled ?? false);
  const [headline, setHeadline] = useState(initialSettings.headline || "KINDRED is Opening Soon");
  const [subtitle, setSubtitle] = useState(
    initialSettings.subtitle ||
      "We are putting the finishing touches on our exclusive fashion collection. Subscribe to receive an invitation to our grand launch."
  );
  const [launchDate, setLaunchDate] = useState(initialSettings.launchDate || "");
  const [bgImage, setBgImage] = useState(initialSettings.bgImage || "");
  const [enableNewsletter, setEnableNewsletter] = useState(initialSettings.enableNewsletter !== false);
  const [previewCode, setPreviewCode] = useState(initialSettings.previewCode || "kindred2026");

  const [instagram, setInstagram] = useState(initialSettings.socialLinks?.instagram || "");
  const [facebook, setFacebook] = useState(initialSettings.socialLinks?.facebook || "");
  const [tiktok, setTiktok] = useState(initialSettings.socialLinks?.tiktok || "");
  const [whatsapp, setWhatsapp] = useState(initialSettings.socialLinks?.whatsapp || "");
  const [pinterest, setPinterest] = useState(initialSettings.socialLinks?.pinterest || "");

  const [contactEmail, setContactEmail] = useState(initialSettings.contactEmail || "");
  const [contactPhone, setContactPhone] = useState(initialSettings.contactPhone || "");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);

    try {
      const res = await fetch("/api/settings/coming-soon", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled,
          headline,
          subtitle,
          launchDate,
          bgImage,
          enableNewsletter,
          socialLinks: { instagram, facebook, tiktok, whatsapp, pinterest },
          contactEmail,
          contactPhone,
          previewCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update Coming Soon settings.");

      setMessage({
        type: "success",
        text: `Coming Soon mode is now ${enabled ? "ENABLED" : "DISABLED"}. Settings saved!`,
      });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save settings." });
    } finally {
      setSaving(false);
    }
  }

  function copyPreviewLink() {
    const link = `${window.location.origin}/?preview=true`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="card-luxe p-6 max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-brown/10 pb-4">
        <div className="flex items-center gap-3 text-brand-brownDark">
          <Clock size={24} className="text-brand-burgundy" />
          <div>
            <h2 className="font-serif text-xl font-medium">"Coming Soon" Mode & Customizer</h2>
            <p className="text-xs text-brand-brown/70">
              Lock the public website behind an elegant launch landing page while keeping Admin accessible.
            </p>
          </div>
        </div>

        {/* Master Switch Toggle */}
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-burgundy"></div>
          <span className="ml-3 text-sm font-semibold text-brand-brownDark">
            {enabled ? "ENABLED" : "DISABLED"}
          </span>
        </label>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-lg text-sm flex items-start gap-2.5 ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Preview Link Banner */}
      <div className="bg-brand-cream/70 border border-brand-brown/15 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-semibold text-brand-brownDark flex items-center gap-1.5 mb-0.5">
            <Sparkles size={14} className="text-brand-burgundy" /> Storefront Preview Bypass Link
          </span>
          <p className="text-brand-brown/70">
            Share this link with your team to bypass the Coming Soon page and view the live shop.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyPreviewLink}
            className="px-3 py-1.5 bg-white border border-brand-brown/20 rounded-md font-medium text-brand-brownDark hover:bg-brand-cream inline-flex items-center gap-1.5 transition-colors"
          >
            <Copy size={13} /> {copied ? "Copied Link!" : "Copy Preview Link"}
          </button>
          <a
            href="/coming-soon"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-brand-burgundy text-white rounded-md font-medium inline-flex items-center gap-1 hover:bg-brand-burgundy/90 transition-colors"
          >
            <ExternalLink size={13} /> View Page
          </a>
        </div>
      </div>

      {/* Customizable Content Fields */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-brand-brownDark border-b border-brand-brown/10 pb-1">
          Content & Messaging
        </h3>

        <div>
          <label className="block text-xs font-semibold text-brand-brownDark mb-1">
            Main Title / Headline
          </label>
          <input
            className="input-luxe text-sm"
            type="text"
            placeholder="KINDRED is Opening Soon"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-brownDark mb-1">
            Announcement / Description Message
          </label>
          <textarea
            className="input-luxe text-sm min-h-[90px]"
            placeholder="Describe your brand launch..."
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-brownDark mb-1">
              Target Launch Date & Time (Optional Countdown)
            </label>
            <input
              className="input-luxe text-sm"
              type="datetime-local"
              value={launchDate}
              onChange={(e) => setLaunchDate(e.target.value)}
            />
            <p className="text-[11px] text-brand-brown/60 mt-1">
              Leave blank to display an elegant "Opening Soon" badge without a live countdown clock.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-brownDark mb-1">
              Background Hero Image URL (Optional)
            </label>
            <input
              className="input-luxe text-sm"
              type="text"
              placeholder="/images/brand/cover.png or https://..."
              value={bgImage}
              onChange={(e) => setBgImage(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* VIP Newsletter Capture Option */}
      <div className="space-y-3 bg-brand-cream/40 p-4 rounded-xl border border-brand-brown/10">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enableNewsletter}
              onChange={(e) => setEnableNewsletter(e.target.checked)}
              className="rounded border-brand-brown/30 text-brand-burgundy focus:ring-brand-burgundy"
            />
            <span className="text-sm font-semibold text-brand-brownDark">
              Enable VIP Newsletter Email Lead Capture
            </span>
          </label>

          <span className="text-xs font-medium text-brand-burgundy bg-brand-burgundy/10 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Users size={13} /> {subscribers.length} Subscribers
          </span>
        </div>

        {subscribers.length > 0 && (
          <div className="mt-2 text-xs">
            <p className="font-semibold text-brand-brownDark mb-1">Captured Email Subscribers:</p>
            <div className="max-h-24 overflow-y-auto bg-white p-2.5 rounded border border-brand-brown/15 space-y-1 font-mono text-[11px]">
              {subscribers.map((email, idx) => (
                <div key={idx} className="text-brand-brownDark">
                  {email}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Social Media Links & Contact */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-brand-brownDark border-b border-brand-brown/10 pb-1">
          Social Links & Contact Info
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-brownDark mb-1">Instagram URL</label>
            <input
              className="input-luxe text-sm"
              type="text"
              placeholder="https://instagram.com/kindred"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-brownDark mb-1">WhatsApp Number / Link</label>
            <input
              className="input-luxe text-sm"
              type="text"
              placeholder="+1234567890"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-brownDark mb-1">Facebook URL</label>
            <input
              className="input-luxe text-sm"
              type="text"
              placeholder="https://facebook.com/kindred"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-brownDark mb-1">TikTok URL</label>
            <input
              className="input-luxe text-sm"
              type="text"
              placeholder="https://tiktok.com/@kindred"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-brownDark mb-1">Contact Email</label>
            <input
              className="input-luxe text-sm"
              type="email"
              placeholder="contact@kindredboutique.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-brownDark mb-1">Contact Phone</label>
            <input
              className="input-luxe text-sm"
              type="text"
              placeholder="+1 (555) 019-2834"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button type="submit" disabled={saving} className="btn-primary inline-flex items-center gap-2">
          {saving ? <Loader2 className="animate-spin" size={16} /> : "Save Coming Soon Settings"}
        </button>
      </div>
    </form>
  );
}
