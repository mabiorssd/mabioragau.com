import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailPayload {
  subject: string;
  content: string;
  from?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("Starting newsletter sending process");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify admin status
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser(authHeader);

    if (authError || !user) {
      throw new Error("Invalid credentials");
    }

    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      throw new Error("Unauthorized: Admin access required");
    }

    // Get active subscribers
    const { data: subscribers, error: subscribersError } = await supabaseClient
      .from("newsletter_subscriptions")
      .select("email")
      .eq("confirmed", true)
      .eq("subscribed", true);

    if (subscribersError) {
      console.error("Error fetching subscribers:", subscribersError);
      throw new Error(`Error fetching subscribers: ${subscribersError.message}`);
    }

    if (!subscribers || subscribers.length === 0) {
      console.log("No active subscribers found");
      throw new Error("No active subscribers found");
    }

    const { subject, content, from = "news@newsletter.mabioragau.com" } = await req.json() as EmailPayload;

    if (!subject || !content) {
      throw new Error("Missing required fields");
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("Missing Resend API key");
    }

    console.log(`Sending newsletter to ${subscribers.length} subscribers`);
    
    // Send to all subscribers
    const emails = subscribers.map((subscriber) => subscriber.email);
    
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from,
        to: from, // Send to yourself
        bcc: emails, // BCC all subscribers
        subject,
        html: content,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resend API error:", errorData);
      throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
    }

    const responseData = await response.json();
    console.log("Newsletter sent successfully:", responseData);

    // Store the newsletter in the database
    const { error: dbError } = await supabaseClient
      .from("newsletters")
      .insert({
        subject,
        content,
        sent_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error("Error storing newsletter:", dbError);
      // Don't throw here as the email was already sent
    }

    return new Response(
      JSON.stringify({ 
        message: "Newsletter sent successfully",
        recipientCount: subscribers.length
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});