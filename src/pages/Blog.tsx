import { Navigation } from "@/components/Navigation";
import { IntelligenceFeed } from "@/components/IntelligenceFeed";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { ScrambleText } from "@/components/soc/ScrambleText";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { setCopilotContext } from "@/lib/copilotContext";

const Blog = () => {
  const url = "https://mabioragau.com/blog";
  const title = "Intelligence Feed — Cybersecurity Research by Mabior Agau";
  const description = "Briefings, post-mortems, exploit research, and defensive guidance from offensive security specialist Mabior Agau.";

  useEffect(() => {
    setCopilotContext({
      kind: "section",
      title: "Intelligence Feed",
      body: "Blog listing page — cybersecurity briefings, post-mortems, exploit research, and defensive guidance. Browse all published articles here.",
    });
    return () => setCopilotContext(null);
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200&h=630" />
        <meta property="og:image:secure_url" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200&h=630" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Mabior Agau — Cybersecurity" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200&h=630" />
        <meta name="twitter:site" content="@MabiorAgau" />
      </Helmet>
      <Navigation activeSection="blog" setActiveSection={() => {}} />

      <motion.main
        className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-3 mb-4 text-primary font-mono text-[10px] sm:text-xs"
          >
            <Terminal className="h-4 w-4" />
            <span>~/intelligence-feed</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="font-display font-extrabold tracking-tight text-[clamp(2rem,5vw,3.5rem)] mb-3"
          >
            <ScrambleText text="Intelligence Feed" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground mb-10 max-w-2xl"
          >
            Briefings, post-mortems, exploit research, and defensive guidance — declassified for public review.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <IntelligenceFeed showControls />
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default Blog;
