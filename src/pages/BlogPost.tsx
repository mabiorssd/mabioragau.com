
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { BlogPostContent } from "@/components/BlogPostContent";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useBlogPostUtils } from "@/hooks/useBlogPostUtils";
import { toast } from "sonner";

const BlogPost = () => {
  const { slug } = useParams();
  const { isDarkMode, setIsDarkMode } = useDarkMode(true);
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

  // Prepare meta tags with proper sanitization
  const title = post.title || "Blog Post - Mabior Agau";
  const description = post.content ? getExcerpt(post.content) : "Read this cybersecurity blog post";
  const imageUrl = ogImageUrl || ""; // Use the async loaded image URL

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? "dark" : ""}`}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={currentUrl} />
        {imageUrl && (
          <>
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
          </>
        )}
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
