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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { page, referrer, userAgent } = await req.json();

    // Get visitor IP and location
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'unknown';

    // Store visitor data
    const { data, error } = await supabaseClient
      .from('visitor_analytics')
      .insert({
        page_url: page,
        referrer: referrer || null,
        user_agent: userAgent,
        ip_address: ip,
        visited_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing visitor data:', error);
      throw error;
    }

    // Trigger AI analysis in background (non-blocking)
    EdgeRuntime.waitUntil(
      analyzeVisitorPattern(supabaseClient, data.id)
    );

    return new Response(
      JSON.stringify({ success: true, visitId: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in track-visitor:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function analyzeVisitorPattern(supabaseClient: any, visitId: string) {
  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) return;

    // Get recent visitor data
    const { data: recentVisits } = await supabaseClient
      .from('visitor_analytics')
      .select('*')
      .order('visited_at', { ascending: false })
      .limit(100);

    if (!recentVisits || recentVisits.length === 0) return;

    // Analyze patterns with AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an analytics expert. Analyze visitor patterns and provide concise insights in JSON format with keys: topPages, trafficSources, peakHours, insights.'
          },
          {
            role: 'user',
            content: `Analyze these visitor patterns: ${JSON.stringify(recentVisits.slice(0, 50))}`
          }
        ],
      }),
    });

    if (response.ok) {
      const aiData = await response.json();
      const insights = aiData.choices[0].message.content;

      // Store insights
      await supabaseClient
        .from('visitor_insights')
        .insert({
          analysis: insights,
          analyzed_at: new Date().toISOString(),
          sample_size: recentVisits.length,
        });
    }
  } catch (error) {
    console.error('Error in AI analysis:', error);
  }
}
