import { BlogPosts } from "@/components/BlogPosts";
import { Navigation } from "@/components/Navigation";
import { motion } from "framer-motion";

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
          <h1 className="text-3xl sm:text-4xl font-bold text-green-400 mb-12">&gt;_Blog Posts</h1>
          <BlogPosts limit={undefined} />
        </div>
      </motion.div>
    </div>
  );
};

export default Blog;