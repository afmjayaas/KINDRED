"use client";

import { useState } from "react";
import { Loader2, Mail, Send, Server, CheckCircle, AlertCircle } from "lucide-react";

interface InitialMailSettings {
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  fromName?: string;
  fromEmail?: string;
  gmailUser?: string;
  adminNotifyEmail?: string;
  hasAppPassword?: boolean;
}

export default function MailSettingsForm({ initial }: { initial: InitialMailSettings }) {
  const [useCustomSmtp, setUseCustomSmtp] = useState(!!initial.smtpHost);
  const [smtpHost, setSmtpHost] = useState(initial.smtpHost || "");
  const [smtpPort, setSmtpPort] = useState(initial.smtpPort || 465);
  const [smtpSecure, setSmtpSecure] = useState(initial.smtpSecure !== undefined ? initial.smtpSecure : true);

  const [fromName, setFromName] = useState(initial.fromName || "KINDRED Boutique");
  const [fromEmail, setFromEmail] = useState(initial.fromEmail || initial.gmailUser || "");
  const [gmailUser, setGmailUser] = useState(initial.gmailUser || "");
  const [adminNotifyEmail, setAdminNotifyEmail] = useState(initial.adminNotifyEmail || "");
  const [gmailAppPassword, setGmailAppPassword] = useState("");
  const [hasAppPassword, setHasAppPassword] = useState(initial.hasAppPassword || false);

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
        body: JSON.stringify({
          smtpHost: useCustomSmtp ? smtpHost : "",
          smtpPort: Number(smtpPort),
          smtpSecure,
          fromName,
          fromEmail: fromEmail || gmailUser,
          gmailUser,
          adminNotifyEmail,
          gmailAppPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings.");
      setHasAppPassword(data.mail.hasAppPassword);
      setGmailAppPassword("");
      setMessage({ type: "success", text: "SMTP Email server settings saved successfully!" });
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
      setMessage({
        type: "success",
        text: `Test email sent to ${adminNotifyEmail || "your notify address"}. Check your inbox!`,
      });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setTesting(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="card-luxe p-6 max-w-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-brand-brown/10 pb-4">
        <div className="flex items-center gap-2 text-brand-brownDark">
          <Mail size={22} className="text-brand-burgundy" />
          <div>
            <h2 className="font-serif text-xl font-medium">Email Server (SMTP Settings)</h2>
            <p className="text-xs text-brand-brown/70">
              Configure order notifications, customer receipts, and store alerts.
            </p>
          </div>
        </div>

        {/* Server mode toggle button */}
        <div className="flex bg-brand-cream border border-brand-brown/15 rounded-lg p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setUseCustomSmtp(false);
              setSmtpHost("");
            }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              !useCustomSmtp ? "bg-brand-burgundy text-white shadow-sm" : "text-brand-brownDark/70 hover:text-brand-brownDark"
            }`}
          >
            Gmail App
          </button>
          <button
            type="button"
            onClick={() => {
              setUseCustomSmtp(true);
              if (!smtpHost) setSmtpHost("mail.yourdomain.com");
            }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              useCustomSmtp ? "bg-brand-burgundy text-white shadow-sm" : "text-brand-brownDark/70 hover:text-brand-brownDark"
            }`}
          >
            Custom SMTP
          </button>
        </div>
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

      {useCustomSmtp ? (
        <div className="space-y-4 bg-brand-cream/50 p-4 rounded-lg border border-brand-brown/10">
          <div className="flex items-center gap-2 text-sm font-medium text-brand-brownDark">
            <Server size={16} /> Custom SMTP Server Details
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-brownDark mb-1">
                SMTP Host / Server
              </label>
              <input
                className="input-luxe text-sm"
                type="text"
                placeholder="mail.yourdomain.com or smtp.sendgrid.net"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-brownDark mb-1">
                SMTP Port
              </label>
              <input
                className="input-luxe text-sm"
                type="number"
                placeholder="465 or 587"
                value={smtpPort}
                onChange={(e) => setSmtpPort(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              id="smtpSecure"
              checked={smtpSecure}
              onChange={(e) => setSmtpSecure(e.target.checked)}
              className="rounded border-brand-brown/30 text-brand-burgundy focus:ring-brand-burgundy"
            />
            <label htmlFor="smtpSecure" className="text-brand-brownDark font-medium cursor-pointer">
              Use SSL/TLS Connection (recommended for port 465)
            </label>
          </div>
        </div>
      ) : (
        <p className="text-xs text-brand-brown/70 bg-brand-cream/60 p-3 rounded-lg border border-brand-brown/10">
          Gmail Setup: Requires 2-Step Verification enabled on your Google Account and an App Password from{" "}
          <a
            href="https://myaccount.google.com/apppasswords"
            target="_blank"
            rel="noreferrer"
            className="underline font-semibold text-brand-burgundy"
          >
            Google Account Security settings
          </a>.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-brand-brownDark mb-1">
            Sender Display Name
          </label>
          <input
            className="input-luxe text-sm"
            type="text"
            placeholder="KINDRED Boutique"
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-brand-brownDark mb-1">
            From Email Address
          </label>
          <input
            className="input-luxe text-sm"
            type="email"
            placeholder="contact@kindredboutique.com"
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-brand-brownDark mb-1">
            SMTP Username / Email
          </label>
          <input
            className="input-luxe text-sm"
            type="text"
            placeholder="your@email.com"
            value={gmailUser}
            onChange={(e) => setGmailUser(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-brownDark mb-1">
            SMTP / App Password {hasAppPassword && <span className="text-green-700 font-normal">(saved)</span>}
          </label>
          <input
            className="input-luxe text-sm"
            type="password"
            placeholder={hasAppPassword ? "Leave blank to keep saved password" : "Enter password"}
            value={gmailAppPassword}
            onChange={(e) => setGmailAppPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-brand-brownDark mb-1">
          Admin Notification Email (receives order alerts)
        </label>
        <input
          className="input-luxe text-sm"
          type="email"
          placeholder="usrajlive@gmail.com"
          value={adminNotifyEmail}
          onChange={(e) => setAdminNotifyEmail(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <button type="submit" disabled={saving} className="btn-primary inline-flex items-center gap-2">
          {saving ? <Loader2 className="animate-spin" size={16} /> : "Save SMTP Settings"}
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
