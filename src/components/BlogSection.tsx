
import { motion } from "framer-motion";
import { Terminal, Clock, ArrowRight, FileText, Eye, Calendar } from "lucide-react";
import { ModernCard } from "./ModernCard";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    title: "Advanced Persistent Threats: Detection and Mitigation",
    excerpt: "Deep dive into APT tactics, techniques, and procedures used by nation-state actors and comprehensive strategies for defending against sophisticated threats.",
    date: "2024-05-15",
    readTime: "8 min read",
    category: "Threat Intelligence",
    slug: "apt-detection-mitigation",
    views: 1247
  },
  {
    title: "Zero-Day Exploitation in Modern Web Applications",
    excerpt: "Comprehensive analysis of recent zero-day vulnerabilities and advanced exploitation techniques targeting contemporary web frameworks and applications.",
    date: "2024-05-10", 
    readTime: "12 min read",
    category: "Web Security",
    slug: "zero-day-web-exploitation",
    views: 892
  },
  {
    title: "Building Resilient Red Team Infrastructure",
    excerpt: "Best practices and advanced methodologies for setting up and maintaining covert command and control infrastructure for red team operations.",
    date: "2024-05-05",
    readTime: "15 min read", 
    category: "Red Teaming",
    slug: "red-team-infrastructure",
    views: 1534
  }
];

const categoryColors = {
  "Threat Intelligence": "bg-red-500/20 text-red-400 border-red-500/30",
  "Web Security": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Red Teaming": "bg-purple-500/20 text-purple-400 border-purple-500/30"
};

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

        {/* Enhanced Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.8 }}
            >
              <ModernCard variant="premium" glow className="h-full cursor-pointer group">
                <Link to={`/blog/${post.slug}`} className="block h-full">
                  <div className="space-y-6 h-full flex flex-col">
                    {/* Enhanced Header */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-3 py-1.5 rounded-full border font-mono ${categoryColors[post.category as keyof typeof categoryColors]}`}>
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1 text-green-500 text-xs font-mono">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-green-400 leading-tight group-hover:text-green-300 transition-colors duration-300">
                        {post.title}
                      </h3>
                    </div>

                    {/* Enhanced Content */}
                    <div className="flex-1">
                      <p className="text-green-300/80 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Enhanced Footer */}
                    <div className="space-y-4">
                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-green-500/70 font-mono">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views.toLocaleString()} views
                        </div>
                      </div>
                      
                      {/* Read more indicator */}
                      <div className="pt-4 border-t border-green-500/20">
                        <div className="flex items-center justify-between">
                          <span className="text-green-400 text-sm font-mono group-hover:text-green-300 transition-colors">
                            Read article
                          </span>
                          <div className="flex items-center gap-1 text-green-400 group-hover:gap-2 transition-all duration-300">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </ModernCard>
            </motion.div>
          ))}
        </div>

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
