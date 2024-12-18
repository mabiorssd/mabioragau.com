import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";

const BlogPost = () => {
  const { slug } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(true); // Set dark mode as default

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation activeSection="blog" setActiveSection={() => {}} />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-pulse text-primary">Loading post...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation activeSection="blog" setActiveSection={() => {}} />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-destructive">Post not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? "dark" : ""}`}>
      <Navigation activeSection="blog" setActiveSection={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-full"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
        <Card className="overflow-hidden border-border">
          {post.image_url && (
            <div className="w-full h-[400px] relative">
              <img 
                src={post.image_url} 
                alt={post.image_alt || post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">
                {post.title}
              </h1>
              <p className="text-muted-foreground">
                Posted {formatDistanceToNow(new Date(post.created_at))} ago
              </p>
            </div>
            <div 
              className="prose dark:prose-invert max-w-none prose-pre:bg-muted prose-pre:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BlogPost;