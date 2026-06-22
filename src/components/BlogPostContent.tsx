import DOMPurify from "dompurify";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Calendar, Eye, ArrowLeft, Twitter, Linkedin, Link2, Check, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useBlogPostUtils } from "@/hooks/useBlogPostUtils";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ReadingProgress } from "./soc/ReadingProgress";
import { ScrambleText } from "./soc/ScrambleText";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { toast } from "sonner";

interface BlogPostContentProps {
  post: any;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
}

export function BlogPostContent({ post, isDarkMode, setIsDarkMode }: BlogPostContentProps) {
  const { getImageUrl, processContent } = useBlogPostUtils();
  const [imageUrl, setImageUrl] = useState<string>("/placeholder.svg");
  const [processedContent, setProcessedContent] = useState<string>("");
  const articleRef = useRef<HTMLDivElement>(null);
  const { copy } = useCopyToClipboard();

  useEffect(() => {
    if (post?.image_url) getImageUrl(post.image_url).then(setImageUrl);
    if (post?.content) processContent(post.content).then(setProcessedContent);
  }, [post?.id, post?.image_url, post?.content, getImageUrl, processContent]);

  // Inject "Copy" buttons into <pre> blocks once content is processed
  useEffect(() => {
    if (!articleRef.current) return;
    const pres = articleRef.current.querySelectorAll("pre");
    pres.forEach((pre) => {
      if (pre.querySelector("[data-copy-btn]")) return;
      pre.classList.add("relative", "group/code");
      const btn = document.createElement("button");
      btn.setAttribute("data-copy-btn", "true");
      btn.className =
        "absolute top-2 right-2 px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-md border border-border bg-background/80 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors opacity-0 group-hover/code:opacity-100 z-10";
      btn.textContent = "COPY";
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        const text = pre.querySelector("code")?.textContent ?? pre.textContent ?? "";
        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = "✓ COPIED";
          btn.classList.add("text-primary", "border-primary/60");
          setTimeout(() => {
            btn.textContent = "COPY";
            btn.classList.remove("text-primary", "border-primary/60");
          }, 1600);
        } catch {
          toast.error("Copy failed");
        }
      });
      pre.appendChild(btn);
    });
  }, [processedContent]);

  return (
    <>
      <ReadingProgress />
      <motion.main
        className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 max-w-3xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-glow transition-colors min-h-[44px] font-mono text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>cd ../intel</span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-full"
            title={isDarkMode ? "Switch to overt mode" : "Switch to stealth mode"}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <Card className="overflow-hidden glass-panel border-border">
          <article className="p-6 sm:p-10 space-y-6">
            {post.image_url && (
              <div className="w-full aspect-[16/9] mb-2 overflow-hidden rounded-xl relative">
                <img
                  src={imageUrl}
                  alt={post.image_alt || post.title}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
              </div>
            )}

            <header className="space-y-5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/30">
                  [BRIEFING]
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  / classified · public
                </span>
              </div>

              <h1 className="font-display font-extrabold tracking-tight text-[clamp(1.875rem,5vw,3rem)] leading-[1.05] text-foreground">
                <ScrambleText text={post.title} duration={1100} />
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-y border-border py-3 font-mono">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(post.created_at), "MMM d, yyyy")}
                </span>
                {post.view_count !== undefined && (
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    {post.view_count} views
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-primary hover:text-primary-glow font-mono text-xs"
                  onClick={() => copy(window.location.href, "Link copied")}
                >
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  Copy link
                </Button>
              </div>
            </header>

            <div
              ref={articleRef}
              className="prose prose-neutral dark:prose-invert max-w-none
                prose-headings:font-display prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border prose-h2:pb-2
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:leading-relaxed prose-p:text-foreground/90
                prose-a:text-primary hover:prose-a:text-primary-glow prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground
                prose-img:rounded-xl prose-img:my-8
                prose-pre:bg-secondary/60 prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:p-4 prose-pre:font-mono prose-pre:text-[13px]
                prose-code:text-primary prose-code:bg-secondary/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-secondary/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest">// share_briefing</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline" size="sm"
                    className="min-h-[40px]"
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, "_blank")}
                  >
                    <Twitter className="h-3.5 w-3.5 mr-1.5" /> Twitter
                  </Button>
                  <Button
                    variant="outline" size="sm"
                    className="min-h-[40px]"
                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank")}
                  >
                    <Linkedin className="h-3.5 w-3.5 mr-1.5" /> LinkedIn
                  </Button>
                  <Button
                    variant="outline" size="sm"
                    className="min-h-[40px]"
                    onClick={() => copy(window.location.href, "Link copied")}
                  >
                    <Link2 className="h-3.5 w-3.5 mr-1.5" /> Link
                  </Button>
                </div>
              </div>
            </div>
          </article>
        </Card>
      </motion.main>
    </>
  );
}
