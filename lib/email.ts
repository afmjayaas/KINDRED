import nodemailer from "nodemailer";
import { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { getSettings } from "@/lib/db";

// Sends order notification emails using Gmail SMTP via Nodemailer.
// Mail credentials can come from two places, checked in this order:
//   1. Admin Portal -> Settings (saved in data/settings.json)
//   2. GMAIL_USER / GMAIL_APP_PASSWORD / ADMIN_NOTIFY_EMAIL env vars
// If neither is configured, emails are silently skipped so order placement
// never breaks for the customer.

export function getMailConfig() {
  const settings = getSettings();
  const gmailUser = settings.mail?.gmailUser || process.env.GMAIL_USER || "";
  const gmailAppPassword = settings.mail?.gmailAppPassword || process.env.GMAIL_APP_PASSWORD || "";
  const adminNotifyEmail =
    settings.mail?.adminNotifyEmail || process.env.ADMIN_NOTIFY_EMAIL || "usrajlive@gmail.com";
  return { gmailUser, gmailAppPassword, adminNotifyEmail };
}

function getTransporter() {
  const { gmailUser, gmailAppPassword } = getMailConfig();
  if (!gmailUser || !gmailAppPassword) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailAppPassword },
  });
}

function itemsHtml(order: Order) {
  return order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${item.productName}${
          item.size ? ` (${item.size}${item.color ? ", " + item.color : ""})` : ""
        }</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${formatPrice(
            item.price
          )}</td>
        </tr>`
    )
    .join("");
}

function wrapHtml(title: string, bodyHtml: string) {
  return `
  <div style="font-family:Georgia,'Times New Roman',serif;background:#FFECCD;padding:32px;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #eee;">
      <div style="background:#004526;color:#FFECCD;padding:24px 28px;">
        <h1 style="margin:0;font-size:22px;letter-spacing:1px;">KINDRED</h1>
        <p style="margin:4px 0 0;font-size:13px;opacity:0.85;">${title}</p>
      </div>
      <div style="padding:28px;color:#3a2a20;">
        ${bodyHtml}
      </div>
      <div style="background:#FFECCD;padding:16px 28px;font-size:12px;color:#650403;text-align:center;">
        KINDRED Boutique &mdash; this is an automated message.
      </div>
    </div>
  </div>`;
}

export async function sendOrderEmails(order: Order): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[email] Mail not configured (Admin Portal > Settings) — skipping order emails.");
    return;
  }
  const { gmailUser, adminNotifyEmail } = getMailConfig();
  const fromAddress = `KINDRED Boutique <${gmailUser}>`;

  const summaryTable = `
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0;">
      <thead>
        <tr style="text-align:left;color:#650403;">
          <th style="padding:8px 0;border-bottom:2px solid #650403;">Item</th>
          <th style="padding:8px 0;border-bottom:2px solid #650403;text-align:center;">Qty</th>
          <th style="padding:8px 0;border-bottom:2px solid #650403;text-align:right;">Price</th>
        </tr>
      </thead>
      <tbody>${itemsHtml(order)}</tbody>
    </table>
    <p style="text-align:right;font-weight:bold;font-size:15px;">Total: ${formatPrice(order.total)}</p>
  `;

  // 1. Admin notification — always sent.
  const adminHtml = wrapHtml(
    "New Order Received",
    `<p>A new order/inquiry has been placed.</p>
     <p><strong>Order Number:</strong> ${order.orderNumber}<br/>
        <strong>Customer:</strong> ${order.customerName}<br/>
        <strong>Phone:</strong> ${order.phone || "—"}<br/>
        <strong>Email:</strong> ${order.email || "—"}</p>
     ${summaryTable}
     <p>Log in to the admin portal to update this order's status.</p>`
  );

  const adminSend = transporter
    .sendMail({
      from: fromAddress,
      to: adminNotifyEmail,
      subject: `New Order ${order.orderNumber} — ${order.customerName}`,
      html: adminHtml,
    })
    .catch((err) => console.error("[email] Failed to send admin notification:", err));

  // 2. Customer confirmation — only if they provided an email address.
  const customerSend = order.email
    ? transporter
        .sendMail({
          from: fromAddress,
          to: order.email,
          subject: `Your KINDRED order ${order.orderNumber} is confirmed`,
          html: wrapHtml(
            "Order Confirmation",
            `<p>Hi ${order.customerName},</p>
             <p>Thank you for your order! We've received your request and our team will reach out shortly to confirm details and arrange delivery.</p>
             <p><strong>Order Number:</strong> ${order.orderNumber}<br/>
                <strong>Status:</strong> ${order.status}</p>
             ${summaryTable}
             <p>You can track your order anytime on our website's "Track My Order" page using your order number and the phone/email you provided.</p>
             <p>With love,<br/>KINDRED</p>`
          ),
        })
        .catch((err) => console.error("[email] Failed to send customer confirmation:", err))
    : Promise.resolve();

  await Promise.all([adminSend, customerSend]);
}

// Used by the Admin Portal Settings page's "Send Test Email" button so the
// admin can verify their Gmail credentials work before relying on them.
export async function sendTestEmail(): Promise<{ ok: boolean; error?: string }> {
  const transporter = getTransporter();
  if (!transporter) {
    return { ok: false, error: "Mail is not configured yet. Fill in the fields above and save first." };
  }
  const { gmailUser, adminNotifyEmail } = getMailConfig();
  try {
    await transporter.sendMail({
      from: `KINDRED Boutique <${gmailUser}>`,
      to: adminNotifyEmail,
      subject: "KINDRED — Test Email",
      html: wrapHtml(
        "Test Email",
        `<p>This is a test message from your KINDRED admin portal mail settings.</p>
         <p>If you received this, order notification emails are configured correctly.</p>`
      ),
    });
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to send test email." };
  }
}
