import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BASE_PROMPT = `You are Mabior Agau's AI assistant for his cybersecurity consulting website (mabioragau.com). You help visitors understand his services, read his blog posts, and engage his expertise.

PERSONALITY:
- Professional yet warm and approachable
- Deeply knowledgeable about cybersecurity but explain concepts clearly
- Reference specific content from the website when relevant

SERVICES:
- Penetration Testing & Security Assessments
- Web Application Security
- Network Security Auditing
- Security Training & Awareness
- Incident Response Support
- Compliance & Best Practices

AVAILABLE PAGES: Home, Blog/Intelligence Feed, Trust & Security page, Services, Projects
BLOG: cybersecurity research, technical deep-dives, threat intel from active engagements

Keep responses concise (2-3 paragraphs max). Be conversational. Use emojis sparingly.`;

const buildSystemPrompt = (pageContext?: string, copilotCtx?: string): string => {
  let prompt = BASE_PROMPT;
  
  if (pageContext) {
    prompt += `\n\nCURRENT PAGE CONTEXT:\n${pageContext}`;
  }
  
  if (copilotCtx) {
    prompt += `\n\nUSER IS VIEWING:\n${copilotCtx}`;
  }

  prompt += `\n\nIMPORTANT: You represent Mabior Agau — personalize your responses. If asked about a blog post or page they're viewing, reference it directly. If they mention a specific topic, connect it to Mabior's expertise.`;

  return prompt;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, pageContext, copilotContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = buildSystemPrompt(pageContext, copilotContext);

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
