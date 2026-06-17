import { NextRequest, NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/server-auth";

// GET: returns current mail settings, but never sends the saved app password
// back to the browser — only whether one is currently set.
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const settings = await getSettings();
    return NextResponse.json({
      mail: {
        gmailUser: settings.mail?.gmailUser || "",
        adminNotifyEmail: settings.mail?.adminNotifyEmail || "",
        hasAppPassword: !!settings.mail?.gmailAppPassword,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load settings." }, { status: 500 });
  }
}

// PUT: updates mail settings. Send gmailAppPassword only when the admin wants
// to change it; omit/blank it to keep the previously saved password.
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
        gmailUser: updated.mail.gmailUser,
        adminNotifyEmail: updated.mail.adminNotifyEmail,
        hasAppPassword: !!updated.mail.gmailAppPassword,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to save settings." }, { status: 500 });
  }
}
