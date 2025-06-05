
import { motion } from "framer-motion";
import { Terminal, FileText, ArrowRight } from "lucide-react";
import { ModernCard } from "./ModernCard";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { BlogPosts } from "./BlogPosts";

export const BlogSection = () => {
  return (
    <section id="blog" className="py-24 px-4 sm:px-6 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-cyber-grid bg-cyber-grid opacity-5"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-black/80 border border-green-500/40 rounded-full backdrop-blur-sm shadow-lg">
            <FileText className="h-5 w-5 text-green-400 animate-pulse" />
            <span className="text-green-400 text-sm font-mono">cat /blog/latest.md</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping ml-2"></div>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-400 mb-8 drop-shadow-[0_0_20px_rgba(0,255,0,0.3)]">
            Latest <span className="text-green-300">Articles</span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-green-300/90 text-xl leading-relaxed">
              Insights, research findings, and technical deep-dives into the latest cybersecurity trends, 
              vulnerabilities, and defensive strategies.
            </p>
          </div>
        </motion.div>

        {/* Dynamic Blog Posts */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-16"
        >
          <BlogPosts limit={6} />
        </motion.div>

        {/* Enhanced View All Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link to="/blog">
            <Button 
              variant="outline" 
              size="lg" 
              className="px-10 py-6 text-base font-semibold hover:bg-green-500/10 border-green-500/40 hover:border-green-400/60 shadow-lg hover:shadow-green-500/20 transition-all duration-300"
            >
              <FileText className="h-5 w-5 mr-3" />
              View All Articles
              <ArrowRight className="h-5 w-5 ml-3" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
