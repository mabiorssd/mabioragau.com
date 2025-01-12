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
      className="py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div className="bg-black/50 p-6 rounded-lg border border-green-500/20">
          <motion.p className="text-green-400 text-sm mb-4">
            [root@mabior-terminal]# cat /var/log/blog/latest.log
          </motion.p>
          <motion.h3 
            className="text-2xl md:text-3xl font-bold text-green-400 mb-6 text-center"
            variants={glitchAnimation}
            initial="initial"
            animate="animate"
          >
            &gt;_Latest Blog Posts
          </motion.h3>
          <BlogPosts limit={3} />
        </motion.div>
      </div>
    </motion.section>
  );
};