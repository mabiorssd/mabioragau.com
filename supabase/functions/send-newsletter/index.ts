import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  subject: string;
  html: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting newsletter sending process");
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const emailRequest: EmailRequest = await req.json();
    console.log('Email request:', { 
      subject: emailRequest.subject,
      recipients: emailRequest.to 
    });

    // If it's a single recipient, it's a confirmation email
    const isConfirmation = emailRequest.to.length === 1;

    if (!isConfirmation) {
      // Verify admin status for newsletter sending
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

      // Get confirmed subscribers for newsletter
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

      emailRequest.to = subscribers.map(sub => sub.email);
    }

    console.log(`Sending email to ${emailRequest.to.length} recipient(s)`);

    // Send email using Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Mabior Agau <news@newsletter.mabioragau.com>",
        to: isConfirmation ? emailRequest.to : undefined,
        bcc: isConfirmation ? undefined : emailRequest.to,
        subject: emailRequest.subject,
        html: emailRequest.html,
      }),
    });

    const responseText = await res.text();
    console.log('Resend API response:', responseText);

    if (!res.ok) {
      throw new Error(`Resend API error: ${responseText}`);
    }

    // Record the newsletter in the database (only for newsletters, not confirmations)
    if (!isConfirmation) {
      const { error: insertError } = await supabaseClient
        .from('newsletters')
        .insert({
          subject: emailRequest.subject,
          content: emailRequest.html,
          sent_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error recording newsletter:', insertError);
        throw insertError;
      }
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