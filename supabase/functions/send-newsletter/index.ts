import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(RESEND_API_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsletterRequest {
  subject: string;
  html: string;
  to?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting newsletter sending process");
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify admin status
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
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

    // Get confirmed subscribers
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
      return new Response(
        JSON.stringify({ error: 'No confirmed subscribers found' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { subject, html }: NewsletterRequest = await req.json();
    
    if (!subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Newsletter request:', { 
      subject,
      recipientCount: subscribers.length 
    });

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "Mabior Agau <news@newsletter.mabioragau.com>",
      bcc: subscribers.map(sub => sub.email),
      subject: subject,
      html: html,
    });

    console.log('Resend API response:', emailResponse);

    // Record the newsletter in the database
    const { error: insertError } = await supabaseClient
      .from('newsletters')
      .insert({
        subject: subject,
        content: html,
        sent_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Error recording newsletter:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Newsletter sent successfully' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error("Error in send-newsletter function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send newsletter',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

serve(handler);