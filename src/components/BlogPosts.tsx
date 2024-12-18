import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

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
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-pulse text-green-500">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts?.map((post) => (
        <Card key={post.id} className="border border-green-500/30 hover:border-green-400 transition-colors">
          <CardHeader>
            <CardTitle className="text-xl text-green-400">{post.title}</CardTitle>
            <CardDescription className="text-green-600">
              Posted {formatDistanceToNow(new Date(post.created_at))} ago
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {post.image_url && (
              <img 
                src={post.image_url} 
                alt={post.image_alt || post.title} 
                className="w-full h-48 object-cover rounded-md"
              />
            )}
            <div 
              className="text-green-500 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>
      ))}
      {limit && posts && posts.length > 0 && (
        <div className="text-center">
          <Link 
            to="/blog" 
            className="inline-block px-6 py-3 border-2 border-green-500 text-green-400 rounded-lg hover:bg-green-500/10 transition-all"
          >
            View All Posts
          </Link>
        </div>
      )}
    </div>
  );
};