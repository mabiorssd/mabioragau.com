
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Eye, Calendar, ChevronRight } from "lucide-react";
import { useBlogPostUtils } from "@/hooks/useBlogPostUtils";

interface BlogPostsProps {
  limit?: number;
}

export const BlogPosts = ({ limit }: BlogPostsProps) => {
  const { getImageUrl, getExcerpt } = useBlogPostUtils();
  const [isLoaded, setIsLoaded] = useState(false);

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

  useEffect(() => {
    // Add a small delay to allow for smooth animations
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-pulse text-green-500">
          <div className="h-6 w-32 bg-green-500/20 rounded mb-4"></div>
          <div className="h-4 w-48 bg-green-500/10 rounded"></div>
        </div>
      </div>
    );
  }

  // Animation variants for staggered child animations
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
      className="grid gap-8"
      variants={container}
      initial="hidden"
      animate={isLoaded ? "show" : "hidden"}
    >
      {posts?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-green-400">No posts available yet.</p>
        </div>
      )}
      
      {posts?.map((post) => (
        <motion.div
          key={post.id}
          variants={item}
          transition={{ duration: 0.5 }}
        >
          <Link to={`/blog/${post.slug}`} className="block">
            <Card className="group hover:border-green-400/50 transition-all duration-300 overflow-hidden bg-black/40 backdrop-blur-sm">
              <div className="grid md:grid-cols-12 gap-6">
                {post.image_url && (
                  <div className="md:col-span-4 h-[200px] md:h-full relative overflow-hidden">
                    <img
                      src={getImageUrl(post.image_url)}
                      alt={post.image_alt || post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        console.log('Image error:', post.image_url);
                        e.currentTarget.src = "/placeholder.svg";
                        e.currentTarget.onerror = null;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}
                <div className={`p-6 ${post.image_url ? 'md:col-span-8' : 'md:col-span-12'}`}>
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-xl md:text-2xl text-green-400 group-hover:text-green-300 transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="mt-2 flex flex-wrap gap-4 text-green-600">
                      <span className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {format(new Date(post.created_at), "MMM d, yyyy")}
                      </span>
                      {post.view_count !== undefined && (
                        <span className="flex items-center">
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          {post.view_count} {post.view_count === 1 ? "view" : "views"}
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-green-500/90 line-clamp-3 mb-4">
                      {getExcerpt(post.content)}
                    </p>
                    <div className="text-green-400 text-sm font-medium group-hover:text-green-300 transition-colors flex items-center">
                      Read more <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
      
      {limit && posts && posts.length > 0 && (
        <motion.div 
          className="text-center mt-4"
          variants={item}
        >
          <Link 
            to="/blog" 
            className="inline-block px-6 py-3 border-2 border-green-500 text-green-400 rounded-lg hover:bg-green-500/10 transition-all text-sm group"
          >
            <span className="flex items-center">
              View All Posts 
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};
