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

  const getExcerpt = (content: string) => {
    const div = document.createElement('div');
    div.innerHTML = content;
    const text = div.textContent || div.innerText;
    return text.slice(0, 150) + (text.length > 150 ? '...' : '');
  };

  return (
    <div className="space-y-6">
      {posts?.map((post) => (
        <Link to={`/blog/${post.slug}`} key={post.id}>
          <Card className="border border-green-500/30 hover:border-green-400 transition-colors">
            <CardHeader>
              <CardTitle className="text-xl text-green-400">{post.title}</CardTitle>
              <CardDescription className="text-green-600">
                Posted {formatDistanceToNow(new Date(post.created_at))} ago
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-green-500">{getExcerpt(post.content)}</p>
            </CardContent>
          </Card>
        </Link>
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