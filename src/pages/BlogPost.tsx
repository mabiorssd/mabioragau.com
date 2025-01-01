import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const BlogPost = () => {
  const { short_code } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", short_code],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("short_code", short_code)
        .eq("published", true)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const incrementViewCount = async () => {
      if (post?.id) {
        await supabase
          .from("blog_posts")
          .update({ view_count: (post.view_count || 0) + 1 })
          .eq("id", post.id);
      }
    };
    incrementViewCount();
  }, [post?.id]);

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
      <motion.main 
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
          <article className="p-6 sm:p-8 md:p-10 space-y-6">
            <header className="space-y-4 mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
                {post.title}
              </h1>
            </header>
            <div 
              className="prose dark:prose-invert max-w-none 
                prose-headings:text-green-400 
                prose-p:text-green-300 
                prose-a:text-green-400 hover:prose-a:text-green-300
                prose-strong:text-green-400
                prose-img:rounded-lg prose-img:shadow-lg
                prose-pre:bg-black/50 prose-pre:text-green-300
                prose-blockquote:border-green-400 prose-blockquote:text-green-300
                prose-ul:text-green-300 prose-ol:text-green-300
                [&_img]:my-8 [&_img]:mx-auto [&_img]:max-h-[600px] [&_img]:object-contain"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </Card>
      </motion.main>
    </div>
  );
};

export default BlogPost;