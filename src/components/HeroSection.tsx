import { motion } from "framer-motion";
import { Github, Mail, Linkedin, Twitter } from "lucide-react";

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
      className="min-h-screen flex items-center justify-center px-6 pt-20 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-6xl w-full space-y-8">
        <motion.div className="space-y-4">
          <motion.p 
            className="text-green-400"
            variants={glitchAnimation}
            initial="initial"
            animate="animate"
          >
            &gt; Initializing secure connection...
          </motion.p>
          <motion.h2 
            className="text-4xl md:text-6xl font-bold text-green-500"
            variants={glitchAnimation}
            initial="initial"
            animate="animate"
          >
            Mabior Agau
          </motion.h2>
          <div className="text-lg md:text-xl text-green-400">
            {text}{showCursor ? "_" : " "}
          </div>
          <p className="text-base md:text-lg text-green-600 max-w-2xl leading-relaxed">
            Specialized in advanced penetration testing, zero-day research, and red team operations. 
            Committed to strengthening cybersecurity through ethical hacking and comprehensive security assessments.
          </p>
        </motion.div>

        <motion.div className="flex gap-4">
          <motion.div className="flex flex-wrap gap-4">
            {[
              { icon: <Github size={24} />, link: "https://github.com/mabiorssd/", label: "GitHub" },
              { icon: <Twitter size={24} />, link: "https://x.com/_CyberMaster", label: "X (Twitter)" },
              { icon: <Linkedin size={24} />, link: "https://www.linkedin.com/in/mabior-agau-436825210/", label: "LinkedIn" },
              { icon: <Mail size={24} />, link: "mailto:info@mabioragau.com", label: "Email" }
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="p-2 border border-green-500/30 rounded-lg hover:border-green-400 hover:text-green-400 transition-all"
                whileHover={{ scale: 1.1, borderColor: "#00ff00" }}
                whileTap={{ scale: 0.9 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};