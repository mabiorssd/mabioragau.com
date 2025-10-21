import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Mabior Agau's AI assistant for his cybersecurity consulting business. Your goal is to engage potential clients, understand their security needs, and guide them towards scheduling a consultation.

PERSONALITY:
- Professional yet friendly and approachable
- Knowledgeable about cybersecurity but explain concepts simply
- Persuasive without being pushy
- Build trust by being helpful and transparent

YOUR OBJECTIVES:
1. Understand the client's security concerns or needs
2. Explain how Mabior's services can help them
3. Build confidence by mentioning relevant experience
4. Guide them to provide contact information (name, email, specific needs)
5. Encourage them to schedule a free consultation

SERVICES OFFERED:
- Penetration Testing & Security Assessments
- Web Application Security
- Network Security Auditing
- Security Training & Awareness
- Incident Response Support
- Compliance & Best Practices

CONVERSATION FLOW:
1. Greet warmly and ask how you can help
2. Listen to their concerns
3. Offer relevant solutions and explain benefits
4. Build trust with specific examples
5. Ask for their name and email to schedule a consultation
6. Confirm next steps

Keep responses concise (2-3 paragraphs max). Be conversational and natural. Use emojis sparingly for warmth.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI service error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("AI contact chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});