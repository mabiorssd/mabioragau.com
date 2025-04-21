
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { BlogPostContent } from "@/components/BlogPostContent";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useBlogPostUtils } from "@/hooks/useBlogPostUtils";

const BlogPost = () => {
  const { slug } = useParams();
  const { isDarkMode, setIsDarkMode } = useDarkMode(true);
  const { getImageUrl, getExcerpt } = useBlogPostUtils();
  const currentUrl = window.location.href;

  const { data: post, isLoading } = useQuery({
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
          <div className="animate-pulse text-primary">Loading post...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation activeSection="blog" setActiveSection={() => {}} />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-destructive">Post not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? "dark" : ""}`}>
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={getExcerpt(post.content)} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={getExcerpt(post.content)} />
        <meta property="og:url" content={currentUrl} />
        {post.image_url && (
          <>
            <meta property="og:image" content={getImageUrl(post.image_url)} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
          </>
        )}
        <meta
          name="twitter:card"
          content={post.image_url ? "summary_large_image" : "summary"}
        />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={getExcerpt(post.content)} />
        {post.image_url && (
          <meta name="twitter:image" content={getImageUrl(post.image_url)} />
        )}
        <meta property="og:site_name" content="Mabior Blog" />
        <meta property="og:locale" content="en_US" />
      </Helmet>
      <Navigation activeSection="blog" setActiveSection={() => {}} />
      <BlogPostContent
        post={post}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
    </div>
  );
};

export default BlogPost;
