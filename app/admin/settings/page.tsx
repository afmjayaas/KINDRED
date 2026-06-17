import { getSettings, isPersistentStorageConfigured } from "@/lib/db";
import MailSettingsForm from "@/components/admin/MailSettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  const persistent = isPersistentStorageConfigured();

  return (
    <div>
      <h1 className="font-serif text-3xl text-brand-brownDark mb-2">Settings</h1>
      <p className="text-brand-brown/70 mb-8">
        Configure the mail server used for order notification emails. You can come back and
        edit these anytime.
      </p>
      {!persistent && (
        <div className="card-luxe p-4 mb-6 border border-amber-300 bg-amber-50 text-amber-800 text-sm">
          Persistent storage (Upstash Redis) isn't connected yet. Changes here will only last
          until this server instance restarts. Connect Upstash in Vercel → Storage to make
          everything saved through the admin portal permanent.
        </div>
      )}
      <MailSettingsForm
        initial={{
          gmailUser: settings.mail?.gmailUser || "",
          adminNotifyEmail: settings.mail?.adminNotifyEmail || "",
          hasAppPassword: !!settings.mail?.gmailAppPassword,
        }}
      />
    </div>
  );
}
