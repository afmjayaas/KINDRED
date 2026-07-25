import { NextRequest, NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/server-auth";

// GET: returns current mail settings, omitting sensitive passwords
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const settings = await getSettings();
    const mail = settings.mail;
    return NextResponse.json({
      mail: {
        smtpHost: mail?.smtpHost || "",
        smtpPort: mail?.smtpPort || 465,
        smtpSecure: mail?.smtpSecure !== undefined ? mail.smtpSecure : true,
        fromName: mail?.fromName || "KINDRED Boutique",
        fromEmail: mail?.fromEmail || mail?.gmailUser || "",
        gmailUser: mail?.gmailUser || "",
        adminNotifyEmail: mail?.adminNotifyEmail || "",
        hasAppPassword: !!mail?.gmailAppPassword,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load settings." }, { status: 500 });
  }
}


// PUT: updates mail & SMTP settings
export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const body = await req.json();
    const settings = await getSettings();
    const existingPassword = settings.mail?.gmailAppPassword || "";

    const updated = {
      ...settings,
      mail: {
        smtpHost: typeof body.smtpHost === "string" ? body.smtpHost.trim() : settings.mail?.smtpHost || "",
        smtpPort: typeof body.smtpPort === "number" ? body.smtpPort : parseInt(body.smtpPort || "465", 10),
        smtpSecure: typeof body.smtpSecure === "boolean" ? body.smtpSecure : settings.mail?.smtpSecure !== false,
        fromName: typeof body.fromName === "string" ? body.fromName.trim() : settings.mail?.fromName || "KINDRED Boutique",
        fromEmail: typeof body.fromEmail === "string" ? body.fromEmail.trim() : settings.mail?.fromEmail || "",
        gmailUser: typeof body.gmailUser === "string" ? body.gmailUser.trim() : settings.mail?.gmailUser || "",
        adminNotifyEmail:
          typeof body.adminNotifyEmail === "string"
            ? body.adminNotifyEmail.trim()
            : settings.mail?.adminNotifyEmail || "",
        gmailAppPassword:
          typeof body.gmailAppPassword === "string" && body.gmailAppPassword.trim()
            ? body.gmailAppPassword.trim()
            : existingPassword,
      },
    };

    await saveSettings(updated);
    return NextResponse.json({
      mail: {
        smtpHost: updated.mail.smtpHost,
        smtpPort: updated.mail.smtpPort,
        smtpSecure: updated.mail.smtpSecure,
        fromName: updated.mail.fromName,
        fromEmail: updated.mail.fromEmail,
        gmailUser: updated.mail.gmailUser,
        adminNotifyEmail: updated.mail.adminNotifyEmail,
        hasAppPassword: !!updated.mail.gmailAppPassword,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to save settings." }, { status: 500 });
  }
}

