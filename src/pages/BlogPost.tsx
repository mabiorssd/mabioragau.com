import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

const BlogPost = () => {
  const { slug } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(true);
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
          const response = await fetch('https://ipapi.co/json/');
          const locationData = await response.json();
          const countryCode = locationData.country_code || 'UNKNOWN';

          const { error } = await supabase.rpc('increment_view_count', {
            post_id: post.id,
            country_code: countryCode
          });

          if (error) {
            console.error('Error tracking view:', error);
          }
        } catch (error) {
          console.error('Error getting location:', error);
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

  const getExcerpt = (content: string | null | undefined) => {
    if (!content) return '';
    const div = document.createElement('div');
    div.innerHTML = content;
    const text = div.textContent || div.innerText || '';
    return text.slice(0, 160) + (text.length > 160 ? '...' : '');
  };

  // Prepare meta tags with proper type handling
  const metaDescription = getExcerpt(post.content);
  const pageTitle = post.title?.toString() || 'Blog Post';
  const imageUrl = post.image_url?.toString();

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? "dark" : ""}`}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={currentUrl} />
        {imageUrl && (
          <>
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
          </>
        )}
        
        <meta name="twitter:card" content={imageUrl ? "summary_large_image" : "summary"} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {imageUrl && <meta name="twitter:image" content={imageUrl} />}
        
        <meta property="og:site_name" content="Your Site Name" />
        <meta property="og:locale" content="en_US" />
      </Helmet>

      <Navigation activeSection="blog" setActiveSection={() => {}} />
      <motion.main 
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-full"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
        <Card className="overflow-hidden border-border">
          <article className="p-6 sm:p-8 md:p-10 space-y-6">
            <header className="space-y-4 mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
                {post.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                Posted {formatDistanceToNow(new Date(post.created_at))} ago
              </p>
            </header>
            <div 
              className="prose dark:prose-invert max-w-none 
                prose-headings:text-green-400 
                prose-p:text-green-300 
                prose-a:text-green-400 hover:prose-a:text-green-300
                prose-strong:text-green-400
                prose-img:rounded-lg prose-img:shadow-lg
                prose-pre:bg-black/50 prose-pre:text-green-300
                prose-blockquote:border-green-400 prose-blockquote:text-green-300
                prose-ul:text-green-300 prose-ol:text-green-300
                [&_img]:my-8 [&_img]:mx-auto [&_img]:max-h-[600px] [&_img]:object-contain"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </Card>
      </motion.main>
    </div>
  );
};

export default BlogPost;