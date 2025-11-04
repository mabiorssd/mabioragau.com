import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    return "Read this cybersecurity article";
  }
}

function buildImageUrl(rawUrl: string | null, supabaseUrl: string): string | null {
  if (!rawUrl) return null;
  let url = rawUrl.trim();
  if (!url) return null;
  if (url.startsWith("http://")) url = url.replace(/^http:\/\//i, "https://");
  if (url.startsWith("https://")) return url;
  // Assume it's a path in blog-images bucket
  let cleanPath = url.replace(/^\/+/, "");
  if (cleanPath.includes("blog-images/")) {
    cleanPath = cleanPath.split("blog-images/")[1] || cleanPath;
  }
  return `${supabaseUrl}/storage/v1/object/public/blog-images/${cleanPath}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return new Response("Missing slug", { status: 400 });
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
      return new Response("Post not found", { status: 404 });
    }

    const title = post.title || "Blog Article";
    const description = getExcerpt(post.content || "", 160);
    const canonicalUrl = `${url.origin}/blog/${post.slug}`;
    const imageUrl = buildImageUrl(post.image_url, SUPABASE_URL) || `${url.origin}/og-image.png`;

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
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Mabior Blog" />
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />
  <!-- Basic styles just to avoid empty body -->
  <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu;line-height:1.5;padding:2rem;color:#0f0;background:#000}</style>
</head>
<body>
  <h1>${title}</h1>
  <p>Preview for social sharing. Visit <a href="${canonicalUrl}">${canonicalUrl}</a>.</p>
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