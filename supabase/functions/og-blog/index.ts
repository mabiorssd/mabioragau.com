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

function buildImageUrl(rawUrl: string | null, supabaseUrl: string, origin: string): string {
  // Return a default fallback image
  const defaultImage = `${origin}/og-image.png`;
  
  if (!rawUrl) return defaultImage;
  let url = rawUrl.trim();
  if (!url) return defaultImage;
  
  // Handle already absolute URLs
  if (url.startsWith("http://")) url = url.replace(/^http:\/\//i, "https://");
  if (url.startsWith("https://")) return url;
  
  // Handle Supabase storage paths
  if (url.includes("storage/v1/object/public/")) {
    return url.startsWith("https://") ? url : `https://${url}`;
  }
  
  // Handle blog-images bucket paths
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
    const imageUrl = buildImageUrl(post.image_url, SUPABASE_URL, url.origin);
    const siteName = "Mabior Agau - Cybersecurity Expert";

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
  <meta property="og:image:alt" content="${post.image_alt || title}" />
  <meta property="og:site_name" content="${siteName}" />
  <meta property="article:published_time" content="${post.created_at}" />
  <meta property="article:modified_time" content="${post.updated_at}" />
  <meta property="article:author" content="Mabior Agau" />
  <meta property="article:section" content="Cybersecurity" />
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />
  <meta name="twitter:image:alt" content="${post.image_alt || title}" />
  <meta name="twitter:site" content="@MabiorAgau" />
  <meta name="twitter:creator" content="@MabiorAgau" />
  <!-- Basic styles just to avoid empty body -->
  <meta name="theme-color" content="#000000" />
  <style>
    body{
      font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,sans-serif;
      line-height:1.6;
      margin:0;
      padding:2rem;
      color:#0f0;
      background:#000;
      max-width:800px;
      margin:0 auto;
    }
    h1{color:#00ff00;margin-bottom:1rem;}
    .meta{color:#0a0;font-size:0.9rem;margin:1rem 0;}
    a{color:#00ff00;text-decoration:none;}
    a:hover{text-decoration:underline;}
    img{max-width:100%;height:auto;border-radius:8px;margin:1rem 0;}
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="meta">Published on ${new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
  ${imageUrl && imageUrl !== `${url.origin}/og-image.png` ? `<img src="${imageUrl}" alt="${post.image_alt || title}" />` : ''}
  <p>${description}</p>
  <p><a href="${canonicalUrl}">Read the full article →</a></p>
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