import { NextRequest, NextResponse } from "next/server";
import { getOrderByNumberAndContact } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, contact } = await req.json();
    if (!orderNumber || !contact) {
      return NextResponse.json(
        { error: "Please provide your order number and phone or email." },
        { status: 400 }
      );
    }
    const order = getOrderByNumberAndContact(orderNumber, contact);
    if (!order) {
      return NextResponse.json(
        { error: "We couldn't find an order matching those details. Please double-check and try again." },
        { status: 404 }
      );
    }
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
