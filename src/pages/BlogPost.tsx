
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import React from "react";
import { BlogPostContent } from "@/components/BlogPostContent";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useBlogPostUtils } from "@/hooks/useBlogPostUtils";
import { toast } from "sonner";

const BlogPost = () => {
  const { slug } = useParams();
  const { isDarkMode, setIsDarkMode } = useDarkMode(true);
  const { getImageUrl, getExcerpt } = useBlogPostUtils();
  const currentUrl = window.location.href;

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

  useEffect(() => {
    const trackPageView = async () => {
      if (post?.id) {
        try {
          const response = await fetch("https://ipapi.co/json/");
          const locationData = await response.json();
          const countryCode = locationData.country_code || "UNKNOWN";
          const { error } = await supabase.rpc("increment_view_count", {
            post_id: post.id,
            country_code: countryCode,
          });
          if (error) {
            console.error("Error tracking view:", error);
          }
        } catch (error) {
          console.error("Error getting location:", error);
        }
      }
    };
    trackPageView();
  }, [post?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation activeSection="blog" setActiveSection={() => {}} />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-pulse text-green-500">
            <div className="h-6 w-64 bg-green-500/20 rounded mb-4"></div>
            <div className="h-4 w-32 bg-green-500/10 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation activeSection="blog" setActiveSection={() => {}} />
        <div className="flex justify-center items-center min-h-[50vh] flex-col">
          <div className="text-destructive text-xl">Post not found</div>
          <a href="/blog" className="mt-4 text-green-400 hover:text-green-300 transition-colors">
            Return to blog
          </a>
        </div>
      </div>
    );
  }

  // Safely extract and convert values for meta tags with extra sanitization
  const safeTitle = post.title ? String(post.title).replace(/[^\w\s-]/g, '').trim() : "Blog Post";
  const safeContent = post.content ? String(post.content).replace(/[^\w\s.,!?-]/g, ' ') : "";
  const safeDescription = safeContent ? getExcerpt(safeContent) : "Read this blog post";
  
  // Get the absolute URL for the image to ensure it works on social media
  const getAbsoluteImageUrl = async () => {
    if (!post.image_url) return "";
    const url = await getImageUrl(post.image_url);
    // Make sure it's an absolute URL
    if (url && !url.startsWith('http')) {
      return window.location.origin + url;
    }
    return url;
  };
  
  const [imageUrl, setImageUrl] = React.useState("");
  
  useEffect(() => {
    getAbsoluteImageUrl().then(setImageUrl);
  }, [post.image_url]);

  // Extra validation to ensure we're not passing any Symbols or objects
  const title = typeof safeTitle === 'string' ? safeTitle : "Blog Post";
  const description = typeof safeDescription === 'string' ? safeDescription : "Read this blog post";

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? "dark" : ""}`}>
      <Helmet>
        <title>{title} | Mabior Agau</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="Mabior Agau - Cybersecurity Expert" />
        <meta property="og:locale" content="en_US" />
        {imageUrl && (
          <>
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:secure_url" content={imageUrl} />
            <meta property="og:image:type" content="image/jpeg" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={post.image_alt || title} />
          </>
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {imageUrl && (
          <>
            <meta name="twitter:image" content={imageUrl} />
            <meta name="twitter:image:alt" content={post.image_alt || title} />
          </>
        )}
      </Helmet>
      <Navigation activeSection="blog" setActiveSection={() => {}} />
      <BlogPostContent
        post={post}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
    </div>
  );
}

export default BlogPost;
