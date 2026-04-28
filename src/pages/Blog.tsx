import { Navigation } from "@/components/Navigation";
import { IntelligenceFeed } from "@/components/IntelligenceFeed";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { ScrambleText } from "@/components/soc/ScrambleText";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation activeSection="blog" setActiveSection={() => {}} />

      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4 text-primary font-mono text-xs">
            <Terminal className="h-4 w-4" />
            <span>root@nca:~/intel $ cat ./feed --all</span>
          </div>

          <h1 className="font-display font-extrabold tracking-tight text-[clamp(2rem,5vw,3.5rem)] mb-3">
            <ScrambleText text="Intelligence Feed" />
          </h1>

          <p className="text-muted-foreground mb-10 max-w-2xl">
            Briefings, post-mortems, exploit research, and defensive guidance — declassified for public review.
          </p>

          <IntelligenceFeed showControls />
        </div>
      </motion.div>
    </div>
  );
};

export default Blog;
