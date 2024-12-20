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

interface HeroSectionProps {
  text: string;
  showCursor: boolean;
}

export const HeroSection = ({ text, showCursor }: HeroSectionProps) => {
  return (
    <motion.section 
      id="about"
      className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <motion.div className="space-y-3">
          <motion.p 
            className="text-green-400 text-sm sm:text-base"
            variants={glitchAnimation}
            initial="initial"
            animate="animate"
          >
            &gt; Initializing secure connection...
          </motion.p>
          <motion.h2 
            className="text-3xl sm:text-5xl font-bold text-green-500 tracking-tight"
            variants={glitchAnimation}
            initial="initial"
            animate="animate"
          >
            Mabior Agau
          </motion.h2>
          <div className="text-base sm:text-xl text-green-400 font-medium">
            {text}{showCursor ? "_" : " "}
          </div>
          <p className="text-sm sm:text-base text-green-600 max-w-2xl leading-relaxed">
            Specialized in advanced penetration testing, zero-day research, and red team operations. 
            Committed to strengthening cybersecurity through ethical hacking and comprehensive security assessments.
          </p>
        </motion.div>
        <SocialLinks />
      </div>
    </motion.section>
  );
};