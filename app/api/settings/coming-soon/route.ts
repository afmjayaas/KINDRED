import { NextRequest, NextResponse } from "next/server";
import { getComingSoonSettings, saveComingSoonSettings, getNewsletterSubscribers } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/server-auth";

export async function GET() {
  try {
    const comingSoon = await getComingSoonSettings();
    const isAdmin = await isAdminAuthenticated();

    if (isAdmin) {
      const subscribers = await getNewsletterSubscribers();
      return NextResponse.json({ comingSoon, subscribers });
    }

    // Public return (omit admin preview codes/subscriber details)
    return NextResponse.json({ comingSoon });
  } catch {
    return NextResponse.json({ error: "Failed to fetch Coming Soon settings." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const current = await getComingSoonSettings();

    const updated = {
      ...current,
      enabled: typeof body.enabled === "boolean" ? body.enabled : current.enabled,
      headline: typeof body.headline === "string" ? body.headline.trim() : current.headline,
      subtitle: typeof body.subtitle === "string" ? body.subtitle.trim() : current.subtitle,
      launchDate: typeof body.launchDate === "string" ? body.launchDate.trim() : current.launchDate,
      bgImage: typeof body.bgImage === "string" ? body.bgImage.trim() : current.bgImage,
      enableNewsletter: typeof body.enableNewsletter === "boolean" ? body.enableNewsletter : current.enableNewsletter,
      socialLinks: {
        instagram: typeof body.socialLinks?.instagram === "string" ? body.socialLinks.instagram.trim() : current.socialLinks?.instagram || "",
        facebook: typeof body.socialLinks?.facebook === "string" ? body.socialLinks.facebook.trim() : current.socialLinks?.facebook || "",
        tiktok: typeof body.socialLinks?.tiktok === "string" ? body.socialLinks.tiktok.trim() : current.socialLinks?.tiktok || "",
        whatsapp: typeof body.socialLinks?.whatsapp === "string" ? body.socialLinks.whatsapp.trim() : current.socialLinks?.whatsapp || "",
        pinterest: typeof body.socialLinks?.pinterest === "string" ? body.socialLinks.pinterest.trim() : current.socialLinks?.pinterest || "",
      },
      contactEmail: typeof body.contactEmail === "string" ? body.contactEmail.trim() : current.contactEmail,
      contactPhone: typeof body.contactPhone === "string" ? body.contactPhone.trim() : current.contactPhone,
      previewCode: typeof body.previewCode === "string" ? body.previewCode.trim() : current.previewCode,
    };

    await saveComingSoonSettings(updated);
    const subscribers = await getNewsletterSubscribers();

    return NextResponse.json({ comingSoon: updated, subscribers });
  } catch {
    return NextResponse.json({ error: "Failed to save Coming Soon settings." }, { status: 500 });
  }
}
