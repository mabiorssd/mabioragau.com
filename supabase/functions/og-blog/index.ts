import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_NAME = "Mabior Agau — Cybersecurity";
const OG_IMAGE_BASE = "https://www.mabioragau.com/api/og-image";

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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function ogImageUrl(slug?: string): string {
  return slug ? `${OG_IMAGE_BASE}?slug=${slug}` : OG_IMAGE_BASE;
}

function pageHead(title: string, desc: string, url: string, image: string, isArticle = false) {
  const type = isArticle ? "article" : "website";
  const extra = isArticle
    ? `  <meta property="article:published_time" content="" />
  <meta property="article:author" content="Mabior Agau" />
  <meta property="article:section" content="Cybersecurity" />`
    : "";
  return `<!doctype charset="utf-8" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(desc)}" />
<link rel="canonical" href="${escapeHtml(url)}" />
<meta property="og:type" content="${type}" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(desc)}" />
<meta property="og:url" content="${escapeHtml(url)}" />
<meta property="og:image" content="${escapeHtml(image)}" />
<meta property="og:image:secure_url" content="${escapeHtml(image)}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
<meta property="og:locale" content="en_US" />
${extra}
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(desc)}" />
<meta name="twitter:image" content="${escapeHtml(image)}" />
<meta name="twitter:site" content="@MabiorAgau" />
<meta name="twitter:creator" content="@MabiorAgau" />
<meta name="theme-color" content="#0a0e14" />`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const reqUrl = new URL(req.url);
    const slug = reqUrl.searchParams.get("slug");

    // ── Blog listing page ──
    if (!slug) {
      const html = `<html lang="en">
<head>
${pageHead(
  "Intelligence Feed — Mabior Agau",
  "Cybersecurity research, briefings, and threat intelligence by offensive security specialist Mabior Agau.",
  "https://mabioragau.com/blog",
  ogImageUrl()
)}
  <style>
    body{font-family:system-ui;background:#0a0e14;color:#c8d0d8;padding:3rem 2rem;max-width:720px;margin:0 auto;line-height:1.6}
    h1{color:#e2e8f0;font-size:2rem;font-weight:700}
    a{color:#2dd4bf}
  </style>
</head>
<body>
  <h1>Intelligence Feed</h1>
  <p style="color:#94a3b8;">Cybersecurity research and threat intelligence by Mabior Agau.</p>
  <p><a href="https://mabioragau.com/blog">Browse all articles →</a></p>
</body>
</html>`;
      return new Response(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    // ── Individual blog post ──
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
      const html = `<html lang="en">
<head>
${pageHead(
  "Blog — Mabior Agau",
  "Cybersecurity research and intelligence feed.",
  `https://mabioragau.com/blog/${slug}`,
  ogImageUrl()
)}
</head>
<body style="background:#0a0e14;color:#c8d0d8;font-family:system-ui;padding:2rem;">
  <h1 style="color:#e2e8f0;">Post not found</h1>
  <p><a href="https://mabioragau.com/blog" style="color:#2dd4bf;">Browse all articles →</a></p>
</body>
</html>`;
      return new Response(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    const title = post.title || "Blog Article — Mabior Agau";
    const description = getExcerpt(post.content || "", 160);
    const canonicalUrl = `https://mabioragau.com/blog/${post.slug}`;
    const imageUrl = ogImageUrl(post.slug);
    const readableDate = new Date(post.created_at).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });

    const html = `<html lang="en">
<head>
${pageHead(title, description, canonicalUrl, imageUrl, true)}
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:system-ui,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#c8d0d8;background:#0a0e14;max-width:720px;margin:0 auto;padding:3rem 2rem}
    a{color:#2dd4bf;text-decoration:none}
    a:hover{text-decoration:underline}
    h1{font-size:2rem;font-weight:700;line-height:1.2;color:#e2e8f0;margin-bottom:0.75rem}
    .meta{color:#94a3b8;font-size:0.85rem;margin-bottom:2rem;border-bottom:1px solid #1e293b;padding-bottom:1rem}
    img{max-width:100%;height:auto;border-radius:12px;margin:0 0 1.5rem 0;border:1px solid #1e293b}
    p{color:#94a3b8;margin-bottom:1.5rem;font-size:0.95rem}
    .cta{display:inline-block;padding:0.65rem 1.5rem;border-radius:8px;background:#2dd4bf;color:#0a0e14;font-weight:600;font-size:0.9rem}
    .cta:hover{background:#5eead4;text-decoration:none}
    .site-tag{font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1em;color:#475569;margin-bottom:1.5rem}
  </style>
</head>
<body>
  <div class="site-tag">${SITE_NAME}</div>
  <h1>${escapeHtml(title)}</h1>
  <div class="meta">${readableDate}</div>
  <p>${escapeHtml(description)}</p>
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
