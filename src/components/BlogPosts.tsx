
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Eye, Calendar, ChevronRight, Clock, FileText } from "lucide-react";
import { useBlogPostUtils } from "@/hooks/useBlogPostUtils";

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

  const enrichedPosts = useMemo(() => {
    return (posts ?? []).map((p) => ({
      ...p,
      _excerpt: getExcerpt(p.content),
    }));
  }, [posts, getExcerpt]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
      {enrichedPosts.length === 0 && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">No Posts Yet</h3>
            <p className="text-muted-foreground text-sm">Blog posts will appear here once they're published.</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrichedPosts.map((post, index) => (
          <motion.div
            key={post.id}
            variants={item}
            transition={{ duration: 0.5 }}
          >
            <Link to={`/blog/${post.slug}`} className="block h-full group">
              <Card className="h-full overflow-hidden hover:border-primary/30 transition-colors duration-300">
                {post.image_url && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={imageUrls[post.id] || "/placeholder.svg"}
                      alt={post.image_alt || post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </div>
                )}
                <CardContent className="p-5 space-y-3">
                  <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post._excerpt}
                  </p>
                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(post.created_at), "MMM d, yyyy")}
                      </span>
                      {post.view_count !== undefined && (
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.view_count}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                      Read <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
      
      {limit && enrichedPosts.length > 0 && (
        <motion.div className="text-center" variants={item}>
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all min-h-[44px]"
          >
            <FileText className="h-4 w-4" />
            View All Posts
            <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};
