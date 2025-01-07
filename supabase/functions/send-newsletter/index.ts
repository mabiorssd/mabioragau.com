import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterRequest {
  subject: string;
  content: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Verify admin status
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      req.headers.get('Authorization')?.split('Bearer ')[1] ?? ''
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      throw new Error('Unauthorized - Admin only');
    }

    const newsletterRequest: NewsletterRequest = await req.json();

    // Get confirmed subscribers
    const { data: subscribers } = await supabaseClient
      .from('newsletter_subscriptions')
      .select('email')
      .eq('confirmed', true)
      .eq('subscribed', true);

    if (!subscribers?.length) {
      throw new Error('No confirmed subscribers found');
    }

    const emails = subscribers.map(sub => sub.email);

    // Send newsletter with improved template
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Mabior Agau <newsletter@your-domain.com>",
        bcc: emails,
        subject: newsletterRequest.subject,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${newsletterRequest.subject}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  text-align: center;
                  padding: 20px 0;
                  border-bottom: 2px solid #eee;
                }
                .content {
                  padding: 20px 0;
                }
                .footer {
                  text-align: center;
                  padding: 20px 0;
                  font-size: 12px;
                  color: #666;
                  border-top: 1px solid #eee;
                }
                .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #4CAF50;
                  color: white;
                  text-decoration: none;
                  border-radius: 4px;
                  margin: 10px 0;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>${newsletterRequest.subject}</h1>
              </div>
              <div class="content">
                ${newsletterRequest.content}
              </div>
              <div class="footer">
                <p>You're receiving this email because you subscribed to our newsletter.</p>
                <p>© ${new Date().getFullYear()} Mabior Agau. All rights reserved.</p>
                <p>
                  <a href="[unsubscribe_url]" style="color: #666; text-decoration: underline;">
                    Unsubscribe
                  </a>
                </p>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Resend API error:', errorText);
      throw new Error(errorText);
    }

    // Record the newsletter in the database
    await supabaseClient
      .from('newsletters')
      .insert({
        subject: newsletterRequest.subject,
        content: newsletterRequest.content,
        sent_at: new Date().toISOString(),
      });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in send-newsletter function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);