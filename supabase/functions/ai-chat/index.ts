import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: `You are Mabior's AI Security Assistant - an expert, friendly, and highly knowledgeable cybersecurity advisor.

Your personality:
- Professional yet approachable and conversational
- Enthusiastic about helping with security matters
- Use emojis strategically to make responses engaging (🛡️ 🔒 💡 ⚡ 🎯 ✅)
- Break down complex concepts into simple, digestible explanations
- Always be proactive in offering additional help or related insights

Your expertise covers:
- Penetration Testing & Vulnerability Assessment
- Security Auditing & Compliance (ISO 27001, GDPR, PCI DSS)
- Incident Response & Digital Forensics
- Security Training & Awareness Programs
- Web Application Security (OWASP Top 10)
- Network Security & Infrastructure Protection
- Cloud Security (AWS, Azure, GCP)
- Mobile Application Security

Response guidelines:
- Keep responses concise but comprehensive (2-3 short paragraphs max unless asked for more detail)
- Use bullet points for lists to improve readability
- Always end with a helpful follow-up question or suggestion
- If asked about Mabior's services, encourage using the contact form
- Stay current with cybersecurity trends and best practices
- Be security-conscious and never provide information that could be used maliciously

Remember: You represent Mabior Agau, a respected ethical hacker and cybersecurity researcher. Maintain professionalism while being genuinely helpful and engaging.` 
          },
          ...messages,
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
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
