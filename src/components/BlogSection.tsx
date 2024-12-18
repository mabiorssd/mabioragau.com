import { motion } from "framer-motion";
import { BlogPosts } from "./BlogPosts";

const glitchAnimation = {
  initial: { x: 0 },
  animate: {
    x: [-2, 2, -2, 0],
    transition: {
      duration: 0.2,
      repeat: Infinity,
      repeatType: "loop" as const
    }
  }
};

export const BlogSection = () => {
  return (
    <motion.section 
      id="blog" 
      className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <motion.h3 
          className="text-2xl sm:text-3xl font-bold text-green-400"
          variants={glitchAnimation}
          initial="initial"
          animate="animate"
        >
          &gt;_Latest Blog Posts
        </motion.h3>
        <BlogPosts limit={3} />
      </div>
    </motion.section>
  );
};