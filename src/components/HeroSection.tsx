
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
      className="min-h-[90vh] flex items-center justify-center px-2 sm:px-4 relative matrix-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-4xl mx-auto w-full">
        <motion.div 
          className="space-y-4 sm:space-y-6 text-left bg-black/50 p-4 sm:p-8 rounded-lg cyber-border backdrop-blur-md"
          variants={terminalAnimation}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={terminalAnimation} className="font-mono space-y-2 sm:space-y-3">
            <motion.p className="text-green-400 text-xs sm:text-sm mb-2 sm:mb-4 opacity-80">
              [root@mabior-terminal]# cat profile.txt
            </motion.p>
            <motion.div 
              className="text-green-500 text-xl sm:text-2xl font-bold mb-4 sm:mb-6 glitch"
              variants={glitchAnimation}
            >
              [SYSTEM] Initializing secure connection...
            </motion.div>
            <motion.div className="text-green-400 text-xs sm:text-sm opacity-80 space-y-1.5 sm:space-y-2">
              <p className="flex items-center gap-2">
                <span className="text-green-600">&gt;</span> User: Mabior Agau
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-600">&gt;</span> Access Level: Administrator
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-600">&gt;</span> Location: Undisclosed
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-600">&gt;</span> Status: Active
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-600">&gt;</span> Specialization: Advanced Penetration Testing
              </p>
            </motion.div>
          </motion.div>

          <div className="text-base sm:text-xl text-green-400 font-medium">
            <span className="text-green-600 mr-2">[system]$</span>
            {text}
            {showCursor && (
              <motion.span 
                className="inline-block w-2 sm:w-3 h-4 sm:h-6 bg-green-500 ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </div>

          <motion.p 
            className="text-sm sm:text-lg text-green-300 max-w-2xl leading-relaxed"
            variants={terminalAnimation}
          >
            <span className="text-green-500">[INFO]</span> Specialized in advanced penetration testing, 
            zero-day research, and red team operations. Committed to strengthening cybersecurity 
            through ethical hacking and comprehensive security assessments.
          </motion.p>

          <motion.div 
            className="flex flex-col items-center gap-4 pt-2 sm:pt-4"
            variants={terminalAnimation}
          >
            <SocialLinks />
            <motion.div 
              className="w-full max-w-[300px] h-[70px] cyber-border p-2 bg-black/30 rounded-lg overflow-hidden"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <iframe 
                src="https://tryhackme.com/api/v2/badges/public-profile?userPublicId=501291" 
                className="w-full h-full"
                title="TryHackMe Badge"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
