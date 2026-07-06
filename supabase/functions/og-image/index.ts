import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function excerpt(text: string, max = 80): string {
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

function generateSvg(title: string, author: string, date: string, hasImage: boolean): string {
  const safeTitle = escapeXml(excerpt(title, 72));
  const safeAuthor = escapeXml(author);
  const safeDate = escapeXml(date);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0e14"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#0a0e14"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#2dd4bf"/>
      <stop offset="50%" stop-color="#14b8a6"/>
      <stop offset="100%" stop-color="#2dd4bf"/>
    </linearGradient>
    <linearGradient id="divider" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2dd4bf" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#2dd4bf" stop-opacity="0"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Subtle grid pattern -->
  <g opacity="0.03">
    <line x1="0" y1="0" x2="0" y2="630" stroke="#2dd4bf" stroke-width="0.5" stroke-dasharray="0"/>
    ${Array.from({length: 13}, (_, i) => {
      const x = i * 100;
      return `<line x1="${x}" y1="0" x2="${x}" y2="630" stroke="#ffffff" stroke-width="0.5"/>`;
    }).join('\n    ')}
    ${Array.from({length: 7}, (_, i) => {
      const y = i * 105;
      return `<line x1="0" y1="${y}" x2="1200" y2="${y}" stroke="#ffffff" stroke-width="0.5"/>`;
    }).join('\n    ')}
  </g>

  <!-- Top accent bar -->
  <rect x="0" y="0" width="1200" height="4" fill="url(#accent)"/>

  <!-- Left accent vertical -->
  <rect x="0" y="0" width="6" height="630" fill="url(#divider)"/>

  <!-- Site branding -->
  <g transform="translate(60, 52)">
    <circle cx="0" cy="0" r="18" fill="#2dd4bf" opacity="0.15"/>
    <circle cx="0" cy="0" r="8" fill="#2dd4bf" opacity="0.3"/>
    <text x="28" y="6" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#475569" letter-spacing="3" text-transform="uppercase">MABIOR AGAU</text>
  </g>

  <!-- Decorative element -->
  <circle cx="1140" cy="50" r="120" fill="#2dd4bf" opacity="0.04"/>
  <circle cx="1120" cy="70" r="60" fill="#2dd4bf" opacity="0.06"/>

  <!-- Main content area -->
  <g transform="translate(80, 180)">
    <!-- Vertical quote line -->
    <rect x="0" y="-10" width="4" height="${Math.min(280, 40 + safeTitle.length * 2.2)}" rx="2" fill="url(#accent)" opacity="0.5"/>

    <!-- Category badge -->
    <rect x="24" y="-10" width="110" height="24" rx="12" fill="#2dd4bf" fill-opacity="0.1"/>
    <text x="79" y="6" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="600" fill="#2dd4bf" text-anchor="middle" letter-spacing="2">CYBERSECURITY</text>

    <!-- Title -->
    <text x="24" y="44" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="36" font-weight="700" fill="#e2e8f0" filter="url(#glow)">
      <tspan x="24" dy="0">${safeTitle}</tspan>
    </text>

    <!-- Decorative line under title -->
    <line x1="24" y1="70" x2="${24 + Math.min(safeTitle.length * 9, 500)}" y2="70" stroke="url(#accent)" stroke-width="1.5" opacity="0.4"/>
  </g>

  <!-- Footer -->
  <g transform="translate(80, 560)">
    <line x1="0" y1="0" x2="1040" y2="0" stroke="#1e293b" stroke-width="1"/>
    <text x="0" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="500" fill="#475569" letter-spacing="1.5">${safeAuthor}</text>
    <circle cx="${10 + safeAuthor.length * 7.5}" cy="20" r="2" fill="#475569"/>
    <text x="${28 + safeAuthor.length * 7.5}" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="400" fill="#475569">${safeDate}</text>

    <!-- Brand mark -->
    <text x="1040" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="600" fill="#1e293b" text-anchor="end" letter-spacing="2">MABIORAGAU.COM</text>
  </g>

  <!-- Bottom accent bar -->
  <rect x="0" y="626" width="1200" height="4" fill="url(#accent)"/>
</svg>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const reqUrl = new URL(req.url);
    const slug = reqUrl.searchParams.get("slug");

    if (!slug) {
      // Return a default branded image for the homepage or listing
      const defaultSvg = generateSvg(
        "Intelligence Feed",
        "Mabior Agau",
        new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" }),
        false
      );
      return new Response(defaultSvg, {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
          ...corsHeaders,
        },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { data: post, error } = await supabase
      .from("blog_posts")
      .select("title, updated_at, created_at, image_url")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error || !post) {
      const notFoundSvg = generateSvg(
        "Blog Article",
        "Mabior Agau",
        new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" }),
        false
      );
      return new Response(notFoundSvg, {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=300",
          ...corsHeaders,
        },
      });
    }

    const title = post.title || "Blog Article";
    const date = new Date(post.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const svg = generateSvg(title, "Mabior Agau", date, !!post.image_url);

    return new Response(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        ...corsHeaders,
      },
    });
  } catch (e) {
    console.error("OG image error:", e);
    const fallbackSvg = generateSvg(
      "Mabior Agau — Cybersecurity",
      "Mabior Agau",
      new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" }),
      false
    );
    return new Response(fallbackSvg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        ...corsHeaders,
      },
    });
  }
});
