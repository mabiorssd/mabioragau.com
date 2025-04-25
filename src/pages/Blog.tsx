
import { BlogPosts } from "@/components/BlogPosts";
import { Navigation } from "@/components/Navigation";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

const Blog = () => {
  return (
    <div className="min-h-screen bg-black text-green-500 font-mono">
      <Navigation activeSection="blog" setActiveSection={() => {}} />
      
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="h-5 w-5 text-green-400" />
            <span className="text-green-400 text-sm font-mono">root@mabior:~/blog $</span>
          </div>
          
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold text-green-400 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            &gt;_Blog Posts
          </motion.h1>
          
          <motion.p 
            className="text-green-500/80 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Explore the latest articles on technology, programming, and cybersecurity
          </motion.p>
          
          <BlogPosts />
        </div>
      </motion.div>
    </div>
  );
};

export default Blog;
