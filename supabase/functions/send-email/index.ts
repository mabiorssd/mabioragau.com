import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import {
  shell,
  header,
  content,
  text,
  ctaButton,
  divider,
  footer,
} from "../_shared/email-templates.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(RESEND_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendEmailRequest {
  to: string[];
  subject: string;
  html: string;
  from?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, from }: SendEmailRequest = await req.json();

    if (!to?.length || !subject || !html) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, html" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fromAddress = from || "Mabior Agau <info@mabioragau.com>";

    // Wrap the raw HTML in our professional template
    // If the HTML already looks like a full document, just pass it through
    const wrappedHtml = html.trim().startsWith("<!DOCTYPE")
      ? html
      : shell({
          previewText: subject,
          bodyContent:
            header(subject) +
            content(html) +
            footer(),
        });

    console.log("Sending email:", { to, subject, from: fromAddress });

    const emailResponse = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html: wrappedHtml,
    });

    console.log("Resend response:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
