
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Calendar, Eye, Share2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useBlogPostUtils } from "@/hooks/useBlogPostUtils";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <Link 
          to="/blog" 
          className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to blog</span>
        </Link>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="rounded-full cyber-border"
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      
      <Card className="overflow-hidden border-green-500/30 bg-black/80 backdrop-blur-md shadow-[0_0_15px_rgba(0,255,0,0.2)]">
        <article className="p-6 sm:p-8 md:p-10 space-y-6">
          {post.image_url && (
            <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] mb-8 overflow-hidden rounded-lg relative group">
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-t-green-500 border-r-green-500/30 border-b-green-500/30 border-l-green-500/30 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-green-500 text-xs animate-pulse">Loading</span>
                    </div>
                  </div>
                </div>
              )}
              <img
                src={getImageUrl(post.image_url)}
                alt={post.image_alt || post.title}
                className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                  imageLoaded && !imageError ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  console.log("Image error:", post.image_url);
                  setImageError(true);
                  e.currentTarget.src = "/placeholder.svg";
                  e.currentTarget.onerror = null; // Fixed: using lowercase "onerror" for DOM property
                  setImageLoaded(true); // Show the placeholder
                }}
              />
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <img
                    src="/placeholder.svg" 
                    alt="Placeholder" 
                    className="w-32 h-32 opacity-50"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}
          
          <header className="space-y-6 mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-400 leading-tight glitch">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-green-500/80 border-y border-green-500/20 py-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(post.created_at), "MMMM d, yyyy")}
              </div>
              
              {post.view_count !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {post.view_count} {post.view_count === 1 ? "view" : "views"}
                </div>
              )}
              
              <div className="ml-auto">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </header>
          
          <div
            className="prose dark:prose-invert max-w-none 
              prose-headings:text-green-400 prose-headings:font-mono
              prose-p:text-green-300 prose-p:leading-relaxed
              prose-a:text-green-400 hover:prose-a:text-green-300 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-green-400
              prose-img:rounded-lg prose-img:shadow-[0_0_20px_rgba(0,255,0,0.3)]
              prose-pre:bg-black/70 prose-pre:text-green-300 prose-pre:border prose-pre:border-green-500/20
              prose-blockquote:border-l-4 prose-blockquote:border-green-400 prose-blockquote:text-green-300 prose-blockquote:bg-black/50 prose-blockquote:py-1 prose-blockquote:px-4
              prose-ul:text-green-300 prose-ol:text-green-300
              [&_img]:my-8 [&_img]:mx-auto [&_img]:max-h-[600px] [&_img]:object-contain
              [&_img]:transition-all [&_img:hover]:shadow-green-400/30 [&_img:hover]:shadow-lg
              [&_code]:text-green-300 [&_code]:bg-black/50 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded
              [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:font-mono [&_h2]:border-b [&_h2]:border-green-500/30 [&_h2]:pb-2
              [&_h3]:text-xl [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:font-mono"
            dangerouslySetInnerHTML={{ __html: processContent(post.content) }}
          />
          
          <div className="mt-8 pt-6 border-t border-green-500/20 text-center">
            <p className="text-green-400/70 text-sm">
              Share this article if you found it useful
            </p>
            <div className="flex justify-center gap-3 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-green-500/30 bg-black/50 hover:bg-green-900/20 text-green-400"
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank');
                }}
              >
                Twitter
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-green-500/30 bg-black/50 hover:bg-green-900/20 text-green-400"
                onClick={() => {
                  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                }}
              >
                LinkedIn
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-green-500/30 bg-black/50 hover:bg-green-900/20 text-green-400"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
              >
                Copy Link
              </Button>
            </div>
          </div>
        </article>
      </Card>
    </motion.main>
  );
}
