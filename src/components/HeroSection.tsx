import { motion } from "framer-motion";
import { SocialLinks } from "./SocialLinks";

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

const terminalAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

interface HeroSectionProps {
  text: string;
  showCursor: boolean;
}

export const HeroSection = ({ text, showCursor }: HeroSectionProps) => {
  return (
    <motion.section 
      id="about"
      className="min-h-[80vh] flex items-center justify-center px-4 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-3xl mx-auto w-full">
        <motion.div 
          className="space-y-4 text-left bg-black/50 p-6 rounded-lg border border-green-500/20"
          variants={terminalAnimation}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={terminalAnimation} className="font-mono">
            <motion.p className="text-green-400 text-sm mb-2">[root@mabior-terminal]# cat profile.txt</motion.p>
            <motion.div className="text-green-500 text-xl font-bold">
              [SYSTEM] Loading profile data...
            </motion.div>
            <motion.div className="text-green-400 text-sm opacity-80 mt-2 space-y-1">
              <p>&gt; User: Mabior Agau</p>
              <p>&gt; Access Level: Administrator</p>
              <p>&gt; Location: Undisclosed</p>
              <p>&gt; Status: Active</p>
              <p>&gt; Specialization: Advanced Penetration Testing</p>
            </motion.div>
          </motion.div>

          <div className="text-base md:text-lg text-green-400 font-medium">
            <span className="text-green-600 mr-2">[system]$</span>
            {text}{showCursor && <span className="inline-block w-3 h-5 bg-green-500 ml-1 animate-pulse"/>}
          </div>

          <p className="text-sm md:text-base text-green-600 max-w-2xl mx-auto leading-relaxed">
            <span className="text-green-500">[INFO]</span> Specialized in advanced penetration testing, zero-day research, and red team operations. 
            Committed to strengthening cybersecurity through ethical hacking and comprehensive security assessments.
          </p>

          <div className="flex justify-center pt-2">
            <SocialLinks />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};