
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
          className="space-y-4 sm:space-y-6 text-left bg-black/50 p-4 sm:p-8 rounded-lg cyber-border backdrop-blur-md relative"
          variants={terminalAnimation}
          initial="hidden"
          animate="visible"
        >
          {/* TryHackMe Badge - Floating Position */}
          <motion.div 
            className="absolute -top-4 sm:-right-4 right-2 w-[200px] sm:w-[300px] transform hover:scale-105 transition-transform duration-300 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="cyber-border bg-black/80 p-2 rounded-lg shadow-[0_0_15px_rgba(0,255,0,0.3)] hover:shadow-[0_0_25px_rgba(0,255,0,0.5)] transition-shadow duration-300">
              <iframe 
                src="https://tryhackme.com/api/v2/badges/public-profile?userPublicId=501291" 
                className="w-full h-[70px]"
                title="TryHackMe Badge"
                loading="lazy"
              />
            </div>
          </motion.div>

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
            className="flex justify-center pt-2 sm:pt-4"
            variants={terminalAnimation}
          >
            <SocialLinks />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
