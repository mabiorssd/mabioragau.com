
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useBlogPostUtils } from "@/hooks/useBlogPostUtils";

interface BlogPostContentProps {
  post: any;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
}

export function BlogPostContent({ post, isDarkMode, setIsDarkMode }: BlogPostContentProps) {
  const { getImageUrl, processContent } = useBlogPostUtils();

  return (
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
          {post.image_url && (
            <div className="w-full h-[300px] md:h-[400px] mb-8 overflow-hidden rounded-lg">
              <img
                src={getImageUrl(post.image_url)}
                alt={post.image_alt || post.title}
                className="w-full h-full object-cover"
                onError={e => {
                  e.currentTarget.src = "/placeholder.svg";
                  e.currentTarget.onerror = null;
                }}
              />
            </div>
          )}
          <header className="space-y-4 mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {post.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              Posted {formatDistanceToNow(new Date(post.created_at))} ago
            </p>
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
            dangerouslySetInnerHTML={{ __html: processContent(post.content) }}
          />
        </article>
      </Card>
    </motion.main>
  );
}
