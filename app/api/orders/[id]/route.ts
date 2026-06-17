import { NextRequest, NextResponse } from "next/server";
import { getOrders, saveOrders } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/server-auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const body = await req.json();
    const orders = await getOrders();
    const idx = orders.findIndex((o) => o.id === params.id);
    if (idx === -1) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    const existing = orders[idx];
    const now = new Date().toISOString();
    const updated = {
      ...existing,
      ...body,
      updatedAt: now,
      statusHistory:
        body.status && body.status !== existing.status
          ? [...existing.statusHistory, { status: body.status, date: now }]
          : existing.statusHistory,
    };
    orders[idx] = updated;
    await saveOrders(orders);
    return NextResponse.json({ order: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update order." }, { status: 500 });
  }
}
