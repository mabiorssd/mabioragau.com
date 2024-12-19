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
      className="py-16 px-4 sm:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.h3 
          className="text-2xl sm:text-3xl font-bold text-green-400 mb-6"
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