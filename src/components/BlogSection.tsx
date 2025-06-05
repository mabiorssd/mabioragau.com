
import { motion } from "framer-motion";
import { Terminal, Clock, ArrowRight, FileText } from "lucide-react";
import { ModernCard } from "./ModernCard";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    title: "Advanced Persistent Threats: Detection and Mitigation",
    excerpt: "Deep dive into APT tactics, techniques, and procedures used by nation-state actors and how to defend against them.",
    date: "2024-05-15",
    readTime: "8 min read",
    category: "Threat Intelligence",
    slug: "apt-detection-mitigation"
  },
  {
    title: "Zero-Day Exploitation in Modern Web Applications",
    excerpt: "Analysis of recent zero-day vulnerabilities and exploitation techniques targeting contemporary web frameworks.",
    date: "2024-05-10", 
    readTime: "12 min read",
    category: "Web Security",
    slug: "zero-day-web-exploitation"
  },
  {
    title: "Building Resilient Red Team Infrastructure",
    excerpt: "Best practices for setting up and maintaining covert command and control infrastructure for red team operations.",
    date: "2024-05-05",
    readTime: "15 min read", 
    category: "Red Teaming",
    slug: "red-team-infrastructure"
  }
];

export const BlogSection = () => {
  return (
    <section id="blog" className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-black/60 border border-green-500/30 rounded-full backdrop-blur-sm">
            <FileText className="h-4 w-4 text-green-400" />
            <span className="text-green-400 text-sm font-mono">cat /blog/latest.md</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-400 mb-6">
            Latest <span className="text-green-300">Articles</span>
          </h2>
          <p className="text-green-300/80 text-lg max-w-3xl mx-auto leading-relaxed">
            Insights, research findings, and technical deep-dives into the latest cybersecurity trends and threats.
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <ModernCard className="h-full cursor-pointer" glow>
                <Link to={`/blog/${post.slug}`} className="block h-full">
                  <div className="space-y-4 h-full flex flex-col">
                    {/* Header */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="cyber" className="text-xs">
                          {post.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-green-500 text-xs">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-green-400 leading-tight group-hover:text-green-300 transition-colors">
                        {post.title}
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <p className="text-green-300/80 text-sm leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-green-500/20">
                      <div className="flex items-center justify-between">
                        <span className="text-green-500 text-xs font-mono">
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-1 text-green-400 text-xs group-hover:gap-2 transition-all">
                          <span>Read more</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </ModernCard>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link to="/blog">
            <Button variant="outline" size="lg" className="px-8">
              <FileText className="h-4 w-4 mr-2" />
              View All Articles
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
