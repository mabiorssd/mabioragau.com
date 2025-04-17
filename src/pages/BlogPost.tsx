
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

  // Get the correct image URL from Supabase storage if needed
  const getImageUrl = (url: string | null) => {
    if (!url) return null;
    
    // Check if the URL is already a full URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a storage path, get the public URL
    try {
      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(url);
      return data.publicUrl;
    } catch (error) {
      console.error('Error generating public URL:', error);
      return '/placeholder.svg'; // Return placeholder as fallback
    }
  };

  // Process content to fix image links if they exist
  const processContent = (content: string) => {
    // Create a temporary div to work with the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Find all images in the content
    const images = tempDiv.querySelectorAll('img');
    
    // Process each image
    images.forEach(img => {
      const originalSrc = img.getAttribute('src') || '';
      
      // If the source is not a full URL and doesn't start with /
      if (!originalSrc.startsWith('http') && !originalSrc.startsWith('/')) {
        // Generate the public URL
        try {
          const { data } = supabase.storage
            .from('blog-images')
            .getPublicUrl(originalSrc);
          
          if (data && data.publicUrl) {
            img.setAttribute('src', data.publicUrl);
          }
        } catch (error) {
          console.error('Error processing image URL:', error);
          // Set to placeholder on error
          img.setAttribute('src', '/placeholder.svg');
        }
      }
      
      // Add fallback for broken images
      img.setAttribute('onerror', "this.onerror=null; this.src='/placeholder.svg';");
    });
    
    return tempDiv.innerHTML;
  };

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

  const getExcerpt = (content: string) => {
    const div = document.createElement('div');
    div.innerHTML = content;
    const text = div.textContent || div.innerText || '';
    return text.slice(0, 160) + (text.length > 160 ? '...' : '');
  };

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
            {post.image_url && (
              <div className="w-full h-[300px] md:h-[400px] mb-8 overflow-hidden rounded-lg">
                <img 
                  src={getImageUrl(post.image_url)} 
                  alt={post.image_alt || post.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('Featured image error:', post.image_url);
                    e.currentTarget.src = "/placeholder.svg";
                    e.currentTarget.onerror = null;
                  }}
                />
              </div>
            )}
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
              dangerouslySetInnerHTML={{ __html: processContent(post.content) }}
            />
          </article>
        </Card>
      </motion.main>
    </div>
  );
};

export default BlogPost;
