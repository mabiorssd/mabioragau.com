import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

const BlogPosts = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      
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
          <CardContent>
            <p className="text-green-500 whitespace-pre-wrap">{post.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BlogPosts;