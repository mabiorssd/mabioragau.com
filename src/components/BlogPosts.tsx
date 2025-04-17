
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

interface BlogPostsProps {
  limit?: number;
}

export const BlogPosts = ({ limit }: BlogPostsProps) => {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[150px]">
        <div className="animate-pulse text-green-500">Loading posts...</div>
      </div>
    );
  }

  const getExcerpt = (content: string) => {
    const div = document.createElement('div');
    div.innerHTML = content;
    const text = div.textContent || div.innerText;
    return text.slice(0, 200) + (text.length > 200 ? '...' : '');
  };

  const getImageUrl = (url: string | null) => {
    if (!url) return null;
    
    // Check if the URL is already a full URL (starts with http:// or https://)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Use Supabase storage to get the public URL
    try {
      const { data } = supabase.storage.from('blog-images').getPublicUrl(url);
      return data.publicUrl;
    } catch (error) {
      console.error('Error generating public URL:', error);
      return '/placeholder.svg'; // Return placeholder as fallback
    }
  };

  return (
    <div className="grid gap-8">
      {posts?.map((post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to={`/blog/${post.slug}`}>
            <Card className="group hover:border-green-400/50 transition-all duration-300 overflow-hidden">
              <div className="grid md:grid-cols-12 gap-6">
                {post.image_url && (
                  <div className="md:col-span-4 h-[200px] md:h-full relative overflow-hidden">
                    <img
                      src={getImageUrl(post.image_url)}
                      alt={post.image_alt || post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        console.log('Image error:', post.image_url);
                        e.currentTarget.src = "/placeholder.svg";
                        e.currentTarget.onerror = null; // Prevent infinite loop
                      }}
                    />
                  </div>
                )}
                <div className={`p-6 ${post.image_url ? 'md:col-span-8' : 'md:col-span-12'}`}>
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-xl md:text-2xl text-green-400 group-hover:text-green-300 transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-green-600 mt-2">
                      Posted {formatDistanceToNow(new Date(post.created_at))} ago
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-green-500/90 line-clamp-3">{getExcerpt(post.content)}</p>
                    <div className="mt-4 text-green-400 text-sm font-medium group-hover:text-green-300 transition-colors">
                      Read more →
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
      {limit && posts && posts.length > 0 && (
        <div className="text-center mt-4">
          <Link 
            to="/blog" 
            className="inline-block px-6 py-3 border-2 border-green-500 text-green-400 rounded-lg hover:bg-green-500/10 transition-all text-sm"
          >
            View All Posts
          </Link>
        </div>
      )}
    </div>
  );
};
