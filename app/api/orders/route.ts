import { NextRequest, NextResponse } from "next/server";
import { getOrders, saveOrders } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/server-auth";
import { generateOrderNumber } from "@/lib/utils";
import { Order } from "@/lib/types";
import { sendOrderEmails } from "@/lib/email";
import crypto from "crypto";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const orders = (await getOrders()).sort(
      (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
    );
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Failed to load orders." }, { status: 500 });
  }
}

// Public endpoint: customers submit an inquiry/order request from the product page
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.customerName || (!body.phone && !body.email) || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Name, contact info, and at least one item are required." },
        { status: 400 }
      );
    }
    const orders = await getOrders();
    const now = new Date().toISOString();
    const total = body.items.reduce(
      (sum: number, item: any) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );
    const newOrder: Order = {
      id: crypto.randomUUID(),
      orderNumber: generateOrderNumber(),
      customerName: body.customerName,
      phone: body.phone || "",
      email: body.email || "",
      status: "Pending",
      items: body.items,
      total,
      placedAt: now,
      updatedAt: now,
      statusHistory: [{ status: "Pending", date: now }],
    };
    orders.unshift(newOrder);
    await saveOrders(orders);

    // Fire off notification emails (admin + customer). Never let an email
    // failure break order creation for the customer.
    try {
      await sendOrderEmails(newOrder);
    } catch (err) {
      console.error("[orders] Email notification failed:", err);
    }

    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit order inquiry." }, { status: 500 });
  }
}
