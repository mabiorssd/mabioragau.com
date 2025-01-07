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
    
    const { data: subscribers } = await supabaseClient
      .from('newsletter_subscriptions')
      .select('email')
      .eq('confirmed', true)
      .eq('subscribed', true);

    if (!subscribers?.length) {
      throw new Error('No confirmed subscribers found');
    }

    const emails = subscribers.map(sub => sub.email);
    
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
        html: newsletterRequest.content,
      }),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

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
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);