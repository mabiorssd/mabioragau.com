import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.7';

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
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message, conversationSummary }: ContactNotification = await req.json();

    const safeName = esc(name);
    const safeEmail = esc(email);
    const safeMessage = esc(message);
    const safeSummary = conversationSummary ? esc(conversationSummary) : '';

    // Send notification to admin
    const emailResponse = await resend.emails.send({
      from: "Mabior Agau <info@mabioragau.com>",
      to: ["info@mabioragau.com"],
      subject: `New Contact from ${safeName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00ff00; background: #000; padding: 20px; text-align: center;">
            New Contact Submission
          </h1>
          
          <div style="background: #f5f5f5; padding: 20px; border-left: 4px solid #00ff00;">
            <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; margin-top: 20px; border: 1px solid #ddd;">
            <h2 style="color: #333; margin-top: 0;">Message</h2>
            <p style="white-space: pre-wrap; line-height: 1.6;">${safeMessage}</p>
          </div>
          
          ${safeSummary ? `
          <div style="background: #f0f9ff; padding: 20px; margin-top: 20px; border-left: 4px solid #0066cc;">
            <h2 style="color: #333; margin-top: 0;">💬 AI Conversation Summary</h2>
            <p style="white-space: pre-wrap; line-height: 1.6;">${safeSummary}</p>
          </div>
          ` : ''}
          
          <div style="background: #000; color: #00ff00; padding: 20px; margin-top: 20px; text-align: center;">
            <p style="margin: 0;">Reply to this lead promptly for best conversion!</p>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #888;">
              Sent via mabioragau.com contact system
            </p>
          </div>
        </div>
      `,
    });

    // Send confirmation to user
    const confirmationResponse = await resend.emails.send({
      from: "Mabior Agau <info@mabioragau.com>",
      to: [email],
      subject: "Thank you for reaching out!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00ff00; background: #000; padding: 20px; text-align: center;">
            Message Received
          </h1>
          
          <div style="background: #fff; padding: 30px;">
            <h2 style="color: #333;">Hi ${safeName},</h2>
            
            <p style="line-height: 1.6; color: #555;">
              Thank you for contacting me! I've received your message and will review it shortly.
            </p>
            
            <p style="line-height: 1.6; color: #555;">
              I typically respond within 24 hours. If your inquiry is urgent, feel free to 
              call me directly or send a follow-up email.
            </p>
            
            <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-left: 4px solid #00ff00;">
              <h3 style="color: #333; margin-top: 0;">Your Message:</h3>
              <p style="white-space: pre-wrap; color: #555;">${safeMessage}</p>
            </div>
            
            <p style="line-height: 1.6; color: #555;">
              Looking forward to discussing how I can help secure your organization!
            </p>
            
            <p style="line-height: 1.6; color: #555;">
              Best regards,<br>
              <strong>Mabior Agau</strong><br>
              Cybersecurity Consultant<br>
              <a href="https://mabioragau.com" style="color: #00ff00;">mabioragau.com</a>
            </p>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; text-align: center; color: #888; font-size: 12px;">
            <p>© 2025 Mabior Agau. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    console.log("Admin notification sent:", emailResponse);
    console.log("User confirmation sent:", confirmationResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmail: emailResponse,
        confirmationEmail: confirmationResponse 
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