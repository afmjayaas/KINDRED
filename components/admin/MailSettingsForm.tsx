"use client";

import { useState } from "react";
import { Loader2, Mail, Send } from "lucide-react";

interface InitialMailSettings {
  gmailUser: string;
  adminNotifyEmail: string;
  hasAppPassword: boolean;
}

export default function MailSettingsForm({ initial }: { initial: InitialMailSettings }) {
  const [gmailUser, setGmailUser] = useState(initial.gmailUser);
  const [adminNotifyEmail, setAdminNotifyEmail] = useState(initial.adminNotifyEmail);
  const [gmailAppPassword, setGmailAppPassword] = useState("");
  const [hasAppPassword, setHasAppPassword] = useState(initial.hasAppPassword);

  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmailUser, adminNotifyEmail, gmailAppPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings.");
      setHasAppPassword(data.mail.hasAppPassword);
      setGmailAppPassword("");
      setMessage({ type: "success", text: "Mail settings saved." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setSaving(false);
    }
  }

  async function handleTestEmail() {
    setMessage(null);
    setTesting(true);
    try {
      const res = await fetch("/api/settings/test-email", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send test email.");
      setMessage({ type: "success", text: `Test email sent to ${adminNotifyEmail || "your notify address"}. Check your inbox.` });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setTesting(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="card-luxe p-6 max-w-xl space-y-5">
      <div className="flex items-center gap-2 text-brand-brownDark">
        <Mail size={20} />
        <h2 className="font-serif text-xl">Mail Server (Gmail)</h2>
      </div>
      <p className="text-sm text-brand-brown/70">
        Used to email you when a customer places an order, and to send the customer a
        confirmation email. Requires a Gmail account with 2-Step Verification turned on and an
        App Password (Google Account → Security → App Passwords) — not your normal Gmail
        password.
      </p>

      {message && (
        <p className={`text-sm ${message.type === "success" ? "text-green-700" : "text-red-600"}`}>
          {message.text}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-brand-brownDark mb-1">
          Gmail Address (sends the emails)
        </label>
        <input
          className="input-luxe"
          type="email"
          placeholder="yourshop@gmail.com"
          value={gmailUser}
          onChange={(e) => setGmailUser(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-brownDark mb-1">
          Gmail App Password {hasAppPassword && <span className="text-green-700 text-xs">(currently set)</span>}
        </label>
        <input
          className="input-luxe"
          type="password"
          placeholder={hasAppPassword ? "Leave blank to keep current password" : "16-character app password"}
          value={gmailAppPassword}
          onChange={(e) => setGmailAppPassword(e.target.value)}
          autoComplete="new-password"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-brownDark mb-1">
          Admin Notification Email (receives new order alerts)
        </label>
        <input
          className="input-luxe"
          type="email"
          placeholder="usrajlive@gmail.com"
          value={adminNotifyEmail}
          onChange={(e) => setAdminNotifyEmail(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn-primary inline-flex items-center gap-2">
          {saving ? <Loader2 className="animate-spin" size={16} /> : "Save Settings"}
        </button>
        <button
          type="button"
          onClick={handleTestEmail}
          disabled={testing}
          className="btn-secondary inline-flex items-center gap-2 text-sm"
        >
          {testing ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
          Send Test Email
        </button>
      </div>
    </form>
  );
}
