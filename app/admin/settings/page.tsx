import { getSettings, getComingSoonSettings, getNewsletterSubscribers, isPersistentStorageConfigured } from "@/lib/db";
import MailSettingsForm from "@/components/admin/MailSettingsForm";
import ComingSoonSettingsForm from "@/components/admin/ComingSoonSettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  const comingSoonSettings = await getComingSoonSettings();
  const subscribers = await getNewsletterSubscribers();
  const persistent = isPersistentStorageConfigured();

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="font-serif text-3xl text-brand-brownDark mb-2 font-medium">Store Settings</h1>
        <p className="text-brand-brown/70 text-sm">
          Manage system configurations, customizable Coming Soon landing page mode, and SMTP notification servers for KINDRED.
        </p>
      </div>

      {!persistent && (
        <div className="card-luxe p-4 border border-amber-300 bg-amber-50 text-amber-900 text-sm rounded-xl">
          <span className="font-semibold">Note:</span> Persistent storage (Upstash Redis) isn't connected yet. Changes here will save locally to <code>data/settings.json</code>. Connect Upstash in Vercel Storage to make changes permanent in cloud serverless deployments.
        </div>
      )}

      {/* Coming Soon Settings */}
      <section>
        <ComingSoonSettingsForm initialSettings={comingSoonSettings} subscribers={subscribers} />
      </section>

      {/* SMTP Email Server Settings */}
      <section>
        <MailSettingsForm
          initial={{
            smtpHost: settings.mail?.smtpHost || "",
            smtpPort: settings.mail?.smtpPort || 465,
            smtpSecure: settings.mail?.smtpSecure !== false,
            fromName: settings.mail?.fromName || "KINDRED Boutique",
            fromEmail: settings.mail?.fromEmail || settings.mail?.gmailUser || "",
            gmailUser: settings.mail?.gmailUser || "",
            adminNotifyEmail: settings.mail?.adminNotifyEmail || "",
            hasAppPassword: !!settings.mail?.gmailAppPassword,
          }}
        />
      </section>
    </div>
  );
}
