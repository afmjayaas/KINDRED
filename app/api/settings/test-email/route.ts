import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/server-auth";
import { sendTestEmail } from "@/lib/email";

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const result = await sendTestEmail();
  if (!result.ok) {
    return NextResponse.json({ error: result.error || "Failed to send test email." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
