import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Helmet } from "react-helmet";
import { useEffect, useState, useRef } from "react";
import { BlogPostContent } from "@/components/BlogPostContent";
import { useTheme } from "@/components/ThemeProvider";
import { useBlogPostUtils } from "@/hooks/useBlogPostUtils";
import { toast } from "sonner";
import { setCopilotContext } from "@/lib/copilotContext";
import { motion } from "framer-motion";

const BlogPost = () => {
  const { slug } = useParams();
  const { theme, setTheme } = useTheme();
  const { getImageUrl, getExcerpt } = useBlogPostUtils();
  const currentUrl = window.location.href;
  const [ogImageUrl, setOgImageUrl] = useState<string>("");

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to load blog post", {
        description: "Please try again later or check the URL"
      });
    }
  }, [error]);

  // Load OG image asynchronously
  useEffect(() => {
    const loadOgImage = async () => {
      if (post?.image_url) {
        const url = await getImageUrl(post.image_url);
        setOgImageUrl(url);
      }
    };
    loadOgImage();
  }, [post?.image_url, getImageUrl]);


  // Publish current blog post to AI Co-Pilot for context-aware summaries
  useEffect(() => {
    if (post) {
      const plain = (post.content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      setCopilotContext({
        kind: "blog",
        title: post.title,
        body: plain.slice(0, 4000),
        url: typeof window !== "undefined" ? window.location.href : undefined,
      });
    }
    return () => setCopilotContext(null);
  }, [post]);

  // Track this view — 24h IP dedup handled server-side
  const tracked = useRef(false);
  useEffect(() => {
    if (!post || tracked.current) return;
    tracked.current = true;

    supabase.functions.invoke("track-view", {
      body: { slug: post.slug },
    }).then(({ error }) => {
      if (error) console.warn("View track error:", error);
    });
  }, [post]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation activeSection="blog" setActiveSection={() => {}} />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            <span className="text-sm text-muted-foreground">Loading post...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation activeSection="blog" setActiveSection={() => {}} />
        <div className="flex justify-center items-center min-h-[50vh] flex-col gap-4">
          <h1 className="text-xl text-destructive font-bold">Post not found</h1>
          <a href="/blog" className="text-primary hover:text-primary/80 transition-colors text-sm font-medium">
            ← Return to blog
          </a>
        </div>
      </div>
    );
  }

  // Prepare meta tags with proper sanitization
  const title = post.title || "Blog Post - Mabior Agau";
  const description = post.content ? getExcerpt(post.content) : "Read this cybersecurity blog post";
  const imageUrl = ogImageUrl || ""; // Use the async loaded image URL

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": imageUrl || undefined,
    "author": { "@type": "Person", "name": "Mabior Agau" },
    "publisher": { "@type": "Person", "name": "Mabior Agau" },
    "datePublished": post.created_at,
    "dateModified": post.updated_at || post.created_at,
    "mainEntityOfPage": currentUrl,
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={currentUrl} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        {imageUrl && <meta property="og:image:secure_url" content={imageUrl} />}
        {imageUrl && <meta property="og:image:width" content="1200" />}
        {imageUrl && <meta property="og:image:height" content="630" />}
        <meta
          name="twitter:card"
          content={imageUrl ? "summary_large_image" : "summary"}
        />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {imageUrl && (
          <meta name="twitter:image" content={imageUrl} />
        )}
        <meta property="og:site_name" content="Mabior Blog" />
        <meta property="og:locale" content="en_US" />
        <link rel="canonical" href={currentUrl} />
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
      </Helmet>
      <Navigation activeSection="blog" setActiveSection={() => {}} />
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <BlogPostContent
          post={post}
          theme={theme}
          setTheme={setTheme}
        />
      </motion.main>
    </div>
  );
}

export default BlogPost;
