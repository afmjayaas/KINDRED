import { getSettings } from "@/lib/db";
import MailSettingsForm from "@/components/admin/MailSettingsForm";

export default function AdminSettingsPage() {
  const settings = getSettings();

  return (
    <div>
      <h1 className="font-serif text-3xl text-brand-brownDark mb-2">Settings</h1>
      <p className="text-brand-brown/70 mb-8">
        Configure the mail server used for order notification emails. You can come back and
        edit these anytime.
      </p>
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
