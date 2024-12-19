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
      <div className="flex justify-center items-center min-h-[150px]">
        <div className="animate-pulse text-green-500">Loading posts...</div>
      </div>
    );
  }

  const getExcerpt = (content: string) => {
    const div = document.createElement('div');
    div.innerHTML = content;
    const text = div.textContent || div.innerText;
    return text.slice(0, 150) + (text.length > 150 ? '...' : '');
  };

  return (
    <div className="grid gap-4 sm:gap-6">
      {posts?.map((post) => (
        <Link to={`/blog/${post.slug}`} key={post.id}>
          <Card className="border border-green-500/30 hover:border-green-400 transition-colors">
            <CardHeader className="space-y-1 p-4 sm:p-5">
              <CardTitle className="text-lg sm:text-xl text-green-400">{post.title}</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-green-600">
                Posted {formatDistanceToNow(new Date(post.created_at))} ago
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0">
              <p className="text-sm text-green-500 line-clamp-2">{getExcerpt(post.content)}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
      {limit && posts && posts.length > 0 && (
        <div className="text-center mt-4">
          <Link 
            to="/blog" 
            className="inline-block px-4 py-2 border-2 border-green-500 text-green-400 rounded-lg hover:bg-green-500/10 transition-all text-sm"
          >
            View All Posts
          </Link>
        </div>
      )}
    </div>
  );
};