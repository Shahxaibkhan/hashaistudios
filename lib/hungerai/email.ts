/**
 * Email utilities for HungerAI using Resend
 * Sends backup order emails to restaurant owners
 */

import { Resend } from "resend";
import type { OrderItem } from "@/types/hungerai";
import { formatPhoneForDisplay, formatPrice } from "./waLink";

// Lazy-loaded Resend client
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

interface OrderEmailParams {
  orderNumber: number;
  restaurantName: string;
  ownerEmail: string;
  customerName: string;
  customerWhatsApp: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryLat: number | null;
  deliveryLng: number | null;
  paymentMethod: "cod" | "online";
}

/**
 * Build HTML email body for order notification
 */
function buildOrderEmailHtml(params: OrderEmailParams): string {
  const {
    orderNumber,
    restaurantName,
    customerName,
    customerWhatsApp,
    items,
    subtotal,
    deliveryFee,
    total,
    deliveryLat,
    deliveryLng,
    paymentMethod,
  } = params;

  const itemRows = items
    .map((item) => {
      const itemTotal =
        (item.price + item.options.reduce((sum, o) => sum + o.price_delta, 0)) *
        item.qty;
      const optionsText =
        item.options.length > 0
          ? `<br><small style="color: #666;">${item.options
              .map((o) => `+ ${o.label}`)
              .join(", ")}</small>`
          : "";
      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            ${item.qty}x ${item.name}${optionsText}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
            ${formatPrice(itemTotal)}
          </td>
        </tr>
      `;
    })
    .join("");

  const locationLink =
    deliveryLat && deliveryLng
      ? `<a href="https://maps.google.com/?q=${deliveryLat},${deliveryLng}" style="color: #06C167;">View on Map</a>`
      : "Not provided";

  const paymentDisplay =
    paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: #0A0A0A; color: white; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🍔 New Order #${orderNumber}</h1>
          <p style="margin: 8px 0 0; opacity: 0.8;">${restaurantName}</p>
        </div>
        
        <!-- Customer Info -->
        <div style="padding: 24px; border-bottom: 1px solid #eee;">
          <h2 style="margin: 0 0 16px; font-size: 16px; color: #333;">Customer Details</h2>
          <p style="margin: 0 0 8px;"><strong>Name:</strong> ${customerName}</p>
          <p style="margin: 0 0 8px;">
            <strong>WhatsApp:</strong> 
            <a href="https://wa.me/${customerWhatsApp}" style="color: #25D366;">${formatPhoneForDisplay(customerWhatsApp)}</a>
          </p>
          <p style="margin: 0;"><strong>Location:</strong> ${locationLink}</p>
        </div>
        
        <!-- Order Items -->
        <div style="padding: 24px;">
          <h2 style="margin: 0 0 16px; font-size: 16px; color: #333;">Order Items</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${itemRows}
          </table>
          
          <!-- Totals -->
          <table style="width: 100%; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 0; color: #666;">Subtotal</td>
              <td style="padding: 8px 0; text-align: right;">${formatPrice(subtotal)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Delivery Fee</td>
              <td style="padding: 8px 0; text-align: right;">${formatPrice(deliveryFee)}</td>
            </tr>
            <tr style="font-size: 18px; font-weight: bold;">
              <td style="padding: 12px 0; border-top: 2px solid #0A0A0A;">Total</td>
              <td style="padding: 12px 0; border-top: 2px solid #0A0A0A; text-align: right; color: #06C167;">${formatPrice(total)}</td>
            </tr>
          </table>
          
          <!-- Payment Method -->
          <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 8px;">
            <strong>Payment Method:</strong> ${paymentDisplay}
          </div>
        </div>
        
        <!-- Footer -->
        <div style="padding: 24px; background: #f9f9f9; text-align: center; color: #666; font-size: 14px;">
          <p style="margin: 0;">This is a backup notification from HungerAI.</p>
          <p style="margin: 8px 0 0;">The customer has been redirected to WhatsApp to send the order.</p>
        </div>
        
      </div>
    </body>
    </html>
  `;
}

/**
 * Send order notification email to restaurant owner
 */
export async function sendOrderEmail(params: OrderEmailParams): Promise<{
  success: boolean;
  error?: string;
}> {
  const resend = getResendClient();

  if (!resend) {
    console.warn("RESEND_API_KEY not set, skipping email");
    return { success: false, error: "Email not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "HungerAI <orders@hungerai.pk>",
      to: params.ownerEmail,
      subject: `New HungerAI Order #${params.orderNumber} — ${formatPrice(params.total)}`,
      html: buildOrderEmailHtml(params),
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Email send error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
