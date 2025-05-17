
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Calendar, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useBlogPostUtils } from "@/hooks/useBlogPostUtils";
import { useEffect, useState } from "react";

interface BlogPostContentProps {
  post: any;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
}

export function BlogPostContent({ post, isDarkMode, setIsDarkMode }: BlogPostContentProps) {
  const { getImageUrl, processContent } = useBlogPostUtils();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Reset image state when post changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [post?.id]);

  return (
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
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      
      <Card className="overflow-hidden border-border">
        <article className="p-6 sm:p-8 md:p-10 space-y-6">
          {post.image_url && (
            <div className="w-full h-[300px] md:h-[400px] mb-8 overflow-hidden rounded-lg relative group">
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="animate-pulse">
                    <div className="h-16 w-16 rounded-full border-4 border-t-green-500 border-r-green-500/30 border-b-green-500/30 border-l-green-500/30 animate-spin"></div>
                  </div>
                </div>
              )}
              <img
                src={getImageUrl(post.image_url)}
                alt={post.image_alt || post.title}
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                  imageLoaded && !imageError ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  console.log("Image error:", post.image_url);
                  setImageError(true);
                  e.currentTarget.src = "/placeholder.svg";
                  e.currentTarget.onError = null;
                  setImageLoaded(true); // Show the placeholder
                }}
              />
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <img
                    src="/placeholder.svg" 
                    alt="Placeholder" 
                    className="w-32 h-32 opacity-50"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}
          
          <header className="space-y-4 mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(post.created_at), "MMMM d, yyyy")}
              </div>
              
              {post.view_count !== undefined && (
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {post.view_count} {post.view_count === 1 ? "view" : "views"}
                </div>
              )}
            </div>
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
              [&_img]:my-8 [&_img]:mx-auto [&_img]:max-h-[600px] [&_img]:object-contain
              [&_img]:transition-all [&_img:hover]:shadow-green-400/20 [&_img:hover]:shadow-lg"
            dangerouslySetInnerHTML={{ __html: processContent(post.content) }}
          />
        </article>
      </Card>
    </motion.main>
  );
}
