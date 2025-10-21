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
    const { type, topic, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let prompt = "";
    
    if (type === 'blog') {
      prompt = `Write a comprehensive, SEO-optimized blog post about: "${topic}". 
      The post should be 600-800 words, include:
      - An engaging introduction
      - 3-4 main sections with subheadings
      - Technical details and best practices
      - A strong conclusion
      Format it in markdown with proper headings (##, ###).`;
    } else if (type === 'email') {
      prompt = `You are a professional cybersecurity consultant. Write a courteous and professional email response to this client inquiry or context: "${context}". 
      The response should be:
      - Professional and friendly
      - Clear and concise
      - Include relevant technical information if needed
      - Offer next steps or call to action`;
    } else if (type === 'seo') {
      prompt = `Analyze the following content for SEO optimization. Title: "${topic}". Content preview: "${context}".
      
      Provide specific recommendations for:
      - Keyword optimization
      - Meta description suggestions
      - Content structure improvements
      - Readability enhancements
      - Internal linking opportunities
      - Title tag optimization
      
      Format your response as actionable bullet points.`;
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
            content: "You are an expert cybersecurity professional and technical writer. Provide accurate, detailed, and professional content."
          },
          {
            role: "user",
            content: prompt
          }
        ],
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

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Content generation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});