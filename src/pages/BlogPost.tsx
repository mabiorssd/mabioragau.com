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
  const [isDarkMode, setIsDarkMode] = useState(false);

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
      <div className="min-h-screen bg-black">
        <Navigation activeSection="blog" setActiveSection={() => {}} />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-pulse text-green-500">Loading post...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation activeSection="blog" setActiveSection={() => {}} />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-red-500">Post not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    }`}>
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
        <Card className={`border overflow-hidden ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
        }`}>
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
              <h1 className={`text-4xl font-bold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}>
                {post.title}
              </h1>
              <p className={`${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Posted {formatDistanceToNow(new Date(post.created_at))} ago
              </p>
            </div>
            <div 
              className={`prose max-w-none ${
                isDarkMode ? "prose-invert" : ""
              }`}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BlogPost;