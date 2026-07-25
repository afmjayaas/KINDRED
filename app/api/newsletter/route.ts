import { NextRequest, NextResponse } from "next/server";
import { addNewsletterSubscriber } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const res = await addNewsletterSubscriber(email);
    if (!res.success) {
      return NextResponse.json({ error: res.message }, { status: 400 });
    }

    return NextResponse.json({ message: res.message });
  } catch {
    return NextResponse.json({ error: "Failed to process subscription request." }, { status: 500 });
  }
}
