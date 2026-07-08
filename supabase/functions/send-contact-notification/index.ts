import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.7";
import {
  shell,
  authorHeader,
  header,
  content,
  text,
  card,
  messageBubble,
  divider,
  spacer,
  ctaButton,
  footer,
} from "../_shared/email-templates.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactNotification {
  name: string;
  email: string;
  message: string;
  conversationSummary?: string;
}

const esc = (s: string) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const bold = (s: string) => `<strong style="color:#f1f5f9;">${s}</strong>`;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message, conversationSummary }: ContactNotification = await req.json();

    const safeName = esc(name);
    const safeEmail = esc(email);
    const safeMessage = esc(message).replace(/\n/g, "<br/>");
    const safeSummary = conversationSummary ? esc(conversationSummary).replace(/\n/g, "<br/>") : "";

    // ── Auto-reply to inquirer (portrait header) ────────────
    const confirmHtml = shell({
      previewText: "Thanks for reaching out — I'll respond within 24 hours.",
      bodyContent:
        authorHeader("Message Received", `Hi ${safeName}`) +
        content(
          text(
            "Thank you for contacting me. I've received your message and will review it within " +
              '<strong style="color:#0d9488;">24 hours</strong>. ' +
              "If your inquiry is urgent, reply directly to this email and I'll prioritise it."
          ),
          messageBubble(safeMessage),
          ctaButton(`mailto:info@mabioragau.com?subject=Re:${encodeURIComponent(safeName)}`, "Reply via Email"),
          divider(),
          text(
            "Looking forward to discussing how I can help strengthen your security posture."
          ),
          text(
            "Best regards,<br/>" +
              bold("Mabior Agau") +
              "<br/>" +
              '<span style="color:#94a3b8;">Cybersecurity Professional</span><br/>' +
              '<a href="https://mabioragau.com" style="color:#0d9488;">mabioragau.com</a>'
          ),
        ) +
        footer(),
    });

    const confirmationResponse = await resend.emails.send({
      from: "Mabior Agau <info@mabioragau.com>",
      to: [email],
      subject: "Thank you for reaching out, " + safeName,
      html: confirmHtml,
    });

    // ── Admin notification (plain header) ──────────────────
    const adminHtml = shell({
      previewText: `New inquiry from ${safeName}`,
      bodyContent:
        header("New Contact") +
        content(
          card("From", `${bold(safeName)} &lt;${safeEmail}&gt;`),
          card("Message", safeMessage),
          card("Time", new Date().toLocaleString("en-US", {
            timeZone: "Africa/Juba",
            dateStyle: "full",
            timeStyle: "short",
          })),
          conversationSummary
            ? card("AI Summary", safeSummary)
            : "",
          divider(),
          text(
            `<a href="mailto:${safeEmail}" style="color:#0d9488;font-weight:600;">Reply to this lead</a> — respond promptly for best engagement.`
          ),
        ) +
        footer(),
    });

    const emailResponse = await resend.emails.send({
      from: "Mabior Agau <info@mabioragau.com>",
      to: ["info@mabioragau.com"],
      subject: `New inquiry from ${safeName}`,
      html: adminHtml,
    });

    console.log("User confirmation sent:", confirmationResponse);
    console.log("Admin notification sent:", emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        adminEmail: emailResponse,
        confirmationEmail: confirmationResponse,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
