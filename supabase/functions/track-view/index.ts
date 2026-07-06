import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Track a blog post view with 24h IP-based deduplication
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slug } = await req.json();
    if (!slug) {
      return new Response(JSON.stringify({ error: "Missing slug" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Get visitor identity from headers
    const forwarded = req.headers.get("x-forwarded-for") || "";
    const visitorIp = forwarded.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "";
    const referer = req.headers.get("referer") || "";
    const country = req.headers.get("x-vercel-ip-country") ||
                    req.headers.get("cf-ipcountry") ||
                    "Unknown";

    // Dedup: check if this IP viewed this post within 24h
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: existingView } = await supabase
      .from("visitor_analytics")
      .select("id")
      .eq("page_url", `/blog/${slug}`)
      .eq("ip_address", visitorIp)
      .gte("visited_at", twentyFourHoursAgo)
      .maybeSingle();

    if (existingView) {
      return new Response(JSON.stringify({ counted: false, reason: "dedup_24h" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Log visit for future dedup
    await supabase.from("visitor_analytics").insert({
      page_url: `/blog/${slug}`,
      ip_address: visitorIp,
      user_agent: userAgent,
      referrer: referer,
    });

    // Atomically increment view_count and append view entry
    const { data: post } = await supabase
      .from("blog_posts")
      .select("view_count, views")
      .eq("slug", slug)
      .single();

    if (post) {
      const newCount = (post.view_count || 0) + 1;
      const currentViews = Array.isArray(post.views) ? post.views : [];
      currentViews.push({
        country,
        timestamp: new Date().toISOString(),
        user_agent: userAgent.slice(0, 60),
      });

      await supabase
        .from("blog_posts")
        .update({
          view_count: newCount,
          views: currentViews,
        })
        .eq("slug", slug);
    }

    return new Response(JSON.stringify({ counted: true, slug, count: (post?.view_count || 0) + 1 }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Track-view error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
