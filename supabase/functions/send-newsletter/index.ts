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
    console.log("Starting newsletter sending process");
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify admin status
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      req.headers.get('Authorization')?.split('Bearer ')[1] ?? ''
    );

    if (authError || !user) {
      console.error('Authentication error:', authError);
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
    console.log('Newsletter request:', { subject: newsletterRequest.subject });

    // Get confirmed subscribers only
    const { data: subscribers, error: subscribersError } = await supabaseClient
      .from('newsletter_subscriptions')
      .select('email')
      .eq('confirmed', true)
      .eq('subscribed', true);

    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError);
      throw subscribersError;
    }

    if (!subscribers?.length) {
      console.log('No confirmed subscribers found');
      throw new Error('No confirmed subscribers found');
    }

    const emails = subscribers.map(sub => sub.email);
    console.log(`Sending newsletter to ${emails.length} subscribers`);

    // Send newsletter with improved template
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Your Blog <newsletter@yourdomain.com>", // Replace with your verified domain
        bcc: emails,
        subject: newsletterRequest.subject,
        html: newsletterRequest.content,
      }),
    });

    const responseText = await res.text();
    console.log('Resend API response:', responseText);

    if (!res.ok) {
      throw new Error(`Resend API error: ${responseText}`);
    }

    // Record the newsletter in the database
    const { error: insertError } = await supabaseClient
      .from('newsletters')
      .insert({
        subject: newsletterRequest.subject,
        content: newsletterRequest.content,
        sent_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Error recording newsletter:', insertError);
      throw insertError;
    }

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