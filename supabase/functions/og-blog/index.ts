import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_NAME = "Mabior Agau — Cybersecurity";
const AUTHOR_NAME = "Mabior Agau";
const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200&h=630";

function getExcerpt(html: string, maxLen = 160) {
  try {
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.length > maxLen ? text.slice(0, maxLen - 1) + "…" : text;
  } catch (_) {
    return "Read this cybersecurity article from Mabior Agau.";
  }
}

function buildImageUrl(rawUrl: string | null, supabaseUrl: string): string {
  if (!rawUrl) return DEFAULT_OG_IMAGE;
  let url = rawUrl.trim();
  if (!url) return DEFAULT_OG_IMAGE;

  // Normalize protocol
  if (url.startsWith("http://")) url = url.replace(/^http:\/\//i, "https://");
  if (url.startsWith("https://")) return url;

  // Handle Supabase storage paths (relative to bucket)
  let cleanPath = url.replace(/^\/+/, "");
  if (cleanPath.includes("blog-images/")) {
    cleanPath = cleanPath.split("blog-images/")[1] || cleanPath;
  }

  const final = `${supabaseUrl}/storage/v1/object/public/blog-images/${cleanPath}`;
  return final;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const reqUrl = new URL(req.url);
    const slug = reqUrl.searchParams.get("slug");

    // No slug = blog listing page
    if (!slug) {
      const listingHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Intelligence Feed — Mabior Agau</title>
  <meta name="description" content="Cybersecurity research, briefings, and threat intelligence by offensive security specialist Mabior Agau." />
  <link rel="canonical" href="https://mabioragau.com/blog" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Mabior Agau — Intelligence Feed" />
  <meta property="og:description" content="Field briefings, technical deep-dives, and threat intelligence from active cybersecurity engagements." />
  <meta property="og:url" content="https://mabioragau.com/blog" />
  <meta property="og:image" content="${DEFAULT_OG_IMAGE}" />
  <meta property="og:image:secure_url" content="${DEFAULT_OG_IMAGE}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:locale" content="en_US" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Mabior Agau — Intelligence Feed" />
  <meta name="twitter:description" content="Cybersecurity research, briefings, and threat intelligence." />
  <meta name="twitter:image" content="${DEFAULT_OG_IMAGE}" />
  <meta name="twitter:site" content="@MabiorAgau" />
  <meta name="twitter:creator" content="@MabiorAgau" />
  <meta name="theme-color" content="#0a0e14" />
</head>
<body style="background:#0a0e14;color:#c8d0d8;font-family:system-ui;padding:2rem;max-width:720px;margin:0 auto;">
  <h1 style="color:#e2e8f0;">Intelligence Feed</h1>
  <p style="color:#94a3b8;">Cybersecurity research and threat intelligence by Mabior Agau.</p>
  <p><a href="https://mabioragau.com/blog" style="color:#2dd4bf;">Browse all articles →</a></p>
</body>
</html>`;
      return new Response(listingHtml, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { data: post, error } = await supabase
      .from("blog_posts")
      .select("id, title, content, slug, image_url, image_alt, updated_at, created_at")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error || !post) {
      // Return a generic OG response for missing posts
      const fallback = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"/>
<title>Blog — Mabior Agau</title>
<meta name="description" content="Cybersecurity research and intelligence feed by Mabior Agau." />
<meta property="og:type" content="website" />
<meta property="og:title" content="Mabior Agau — Intelligence Feed" />
<meta property="og:description" content="Cybersecurity research and intelligence feed." />
<meta property="og:image" content="${DEFAULT_OG_IMAGE}" />
<meta property="og:image:secure_url" content="${DEFAULT_OG_IMAGE}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Mabior Agau — Intelligence Feed" />
<meta name="twitter:description" content="Cybersecurity research and intelligence feed." />
<meta name="twitter:image" content="${DEFAULT_OG_IMAGE}" />
</head>
<body style="background:#0a0e14;color:#c8d0d8;font-family:system-ui;padding:2rem;">
<h1 style="color:#e2e8f0;">Blog — Mabior Agau</h1>
<p>Post not found. <a href="https://mabioragau.com/blog" style="color:#2dd4bf;">Browse all articles →</a></p>
</body>
</html>`;
      return new Response(fallback, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    const title = escapeHtml(post.title || "Blog Article — Mabior Agau");
    const description = escapeHtml(getExcerpt(post.content || "", 160));
    const canonicalUrl = `https://mabioragau.com/blog/${post.slug}`;
    const imageUrl = buildImageUrl(post.image_url, SUPABASE_URL);
    const imageAlt = escapeHtml(post.image_alt || title);
    const publishedDate = post.created_at
      ? new Date(post.created_at).toISOString()
      : new Date().toISOString();
    const modifiedDate = post.updated_at
      ? new Date(post.updated_at).toISOString()
      : publishedDate;

    const readableDate = new Date(post.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <link rel="canonical" href="${canonicalUrl}" />
  <meta name="description" content="${description}" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:secure_url" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${imageAlt}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:locale" content="en_US" />
  <meta property="article:published_time" content="${publishedDate}" />
  <meta property="article:modified_time" content="${modifiedDate}" />
  <meta property="article:author" content="${AUTHOR_NAME}" />
  <meta property="article:section" content="Cybersecurity" />
  <meta property="article:tag" content="cybersecurity" />
  <meta property="article:tag" content="penetration testing" />
  <meta property="article:tag" content="red team" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />
  <meta name="twitter:image:alt" content="${imageAlt}" />
  <meta name="twitter:site" content="@MabiorAgau" />
  <meta name="twitter:creator" content="@MabiorAgau" />

  <!-- Facebook / LinkedIn -->
  <meta property="fb:app_id" content="mabioragau" />

  <meta name="theme-color" content="#0a0e14" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #c8d0d8;
      background: #0a0e14;
      max-width: 720px;
      margin: 0 auto;
      padding: 3rem 2rem;
    }
    a { color: #2dd4bf; text-decoration: none; }
    a:hover { text-decoration: underline; }
    h1 {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1.2;
      color: #e2e8f0;
      margin-bottom: 0.75rem;
    }
    .meta {
      color: #94a3b8;
      font-size: 0.85rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 1rem;
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 12px;
      margin: 0 0 1.5rem 0;
      border: 1px solid #1e293b;
    }
    p { color: #94a3b8; margin-bottom: 1.5rem; font-size: 0.95rem; }
    .cta {
      display: inline-block;
      padding: 0.65rem 1.5rem;
      border-radius: 8px;
      background: #2dd4bf;
      color: #0a0e14;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .cta:hover { background: #5eead4; text-decoration: none; }
    .site-tag {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #475569;
      margin-bottom: 1.5rem;
    }
  </style>
</head>
<body>
  <div class="site-tag">${SITE_NAME}</div>
  <h1>${title}</h1>
  <div class="meta">${readableDate}</div>
  ${imageUrl !== DEFAULT_OG_IMAGE ? `<img src="${imageUrl}" alt="${imageAlt}" />` : ""}
  <p>${description}</p>
  <p><a class="cta" href="${canonicalUrl}">Read full article →</a></p>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (e) {
    console.error("OG function error", e);
    return new Response("Internal Server Error", { status: 500 });
  }
});
