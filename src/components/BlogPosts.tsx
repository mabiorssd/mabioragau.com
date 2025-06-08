
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Eye, Calendar, ChevronRight, Clock, FileText } from "lucide-react";
import { useBlogPostUtils } from "@/hooks/useBlogPostUtils";
import { ModernCard } from "./ModernCard";

interface BlogPostsProps {
  limit?: number;
}

export const BlogPosts = ({ limit }: BlogPostsProps) => {
  const { getImageUrl, getExcerpt } = useBlogPostUtils();
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts", limit],
    queryFn: async () => {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Pre-process image URLs when posts are loaded
  useEffect(() => {
    const processImageUrls = async () => {
      if (posts) {
        const urlPromises = posts.map(async (post) => {
          if (post.image_url) {
            const processedUrl = await getImageUrl(post.image_url);
            return [post.id, processedUrl];
          }
          return [post.id, "/placeholder.svg"];
        });
        
        const urlResults = await Promise.all(urlPromises);
        const urlMap = Object.fromEntries(urlResults);
        setImageUrls(urlMap);
      }
    };

    processImageUrls();
  }, [posts, getImageUrl]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-t-green-500 border-r-green-500/30 border-b-green-500/30 border-l-green-500/30 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-green-500 text-xs animate-pulse">Loading</span>
          </div>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate={isLoaded ? "show" : "hidden"}
    >
      {posts?.length === 0 && (
        <div className="text-center py-12">
          <ModernCard variant="minimal" className="max-w-md mx-auto">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-green-400">No Posts Yet</h3>
              <p className="text-green-300/70">Blog posts will appear here once they're published.</p>
            </div>
          </ModernCard>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts?.map((post, index) => (
          <motion.div
            key={post.id}
            variants={item}
            transition={{ duration: 0.5 }}
          >
            <Link to={`/blog/${post.slug}`} className="block h-full">
              <ModernCard variant="premium" glow className="h-full group cursor-pointer">
                <div className="space-y-6 h-full flex flex-col">
                  {/* Image */}
                  {post.image_url && (
                    <div className="aspect-video w-full overflow-hidden rounded-lg relative">
                      <img
                        src={imageUrls[post.id] || "/placeholder.svg"}
                        alt={post.image_alt || post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          console.log('Image error:', post.image_url);
                          e.currentTarget.src = "/placeholder.svg";
                          e.currentTarget.onerror = null;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-green-400 leading-tight group-hover:text-green-300 transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>
                    </div>

                    <p className="text-green-300/80 leading-relaxed line-clamp-3 flex-1">
                      {getExcerpt(post.content)}
                    </p>

                    {/* Meta info */}
                    <div className="space-y-3 pt-4 border-t border-green-500/20">
                      <div className="flex items-center justify-between text-xs text-green-500/70 font-mono">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(post.created_at), "MMM d, yyyy")}
                        </div>
                        {post.view_count !== undefined && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.view_count} views
                          </div>
                        )}
                      </div>
                      
                      {/* Read more */}
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 text-sm font-mono group-hover:text-green-300 transition-colors">
                          Read article
                        </span>
                        <div className="flex items-center gap-1 text-green-400 group-hover:gap-2 transition-all duration-300">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ModernCard>
            </Link>
          </motion.div>
        ))}
      </div>
      
      {limit && posts && posts.length > 0 && (
        <motion.div 
          className="text-center mt-12"
          variants={item}
        >
          <Link 
            to="/blog" 
            className="inline-flex items-center px-8 py-4 border-2 border-green-500/40 text-green-400 rounded-xl hover:bg-green-500/10 hover:border-green-400/60 transition-all duration-300 font-mono text-sm group shadow-lg hover:shadow-green-500/20"
          >
            <span className="flex items-center gap-3">
              <FileText className="h-4 w-4" />
              View All Posts 
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};
