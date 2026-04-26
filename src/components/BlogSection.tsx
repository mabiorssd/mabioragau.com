import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { BlogPosts } from "./BlogPosts";

export const BlogSection = () => {
  return (
    <section id="blog" className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-end justify-between gap-6 flex-wrap"
        >
          <div>
            <span className="eyebrow">// field_briefings</span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight">
              Latest <span className="bg-gradient-primary bg-clip-text text-transparent">briefings</span>
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Research notes, technical deep-dives, and practical defensive guidance from active engagements.
            </p>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground font-medium text-sm hover:bg-secondary/70 hover:border-primary/40 transition-colors"
          >
            <FileText className="w-4 h-4" />
            All articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <BlogPosts limit={6} />
      </div>
    </section>
  );
};
