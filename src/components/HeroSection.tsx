
import { motion } from "framer-motion";
import { Terminal, Download, Eye } from "lucide-react";
import { SocialLinks } from "./SocialLinks";
import { Button } from "./ui/button";

interface HeroSectionProps {
  text: string;
  showCursor: boolean;
}

export const HeroSection = ({ text, showCursor }: HeroSectionProps) => {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Terminal Header */}
        <motion.div 
          className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-black/60 border border-green-500/30 rounded-lg backdrop-blur-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Terminal className="h-5 w-5 text-green-400" />
          <span className="text-green-400 text-sm font-mono">root@mabior-agau:~$</span>
          <span className="text-green-300 text-sm">whoami</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <span className="text-green-400 block mb-2">MABIOR</span>
          <span className="text-green-300 glitch" data-text="AGAU">AGAU</span>
        </motion.h1>

        {/* Typing Effect */}
        <motion.div 
          className="text-lg sm:text-xl md:text-2xl text-green-500 mb-8 h-16 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span className="font-mono border-r-2 border-green-400 pr-2">
            {text}
            {showCursor && <span className="animate-pulse">|</span>}
          </span>
        </motion.div>

        {/* Description */}
        <motion.p 
          className="text-green-300/80 text-lg sm:text-xl max-w-3xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Specializing in advanced penetration testing, zero-day research, and red team operations. 
          I help organizations strengthen their cyber defenses against sophisticated threats.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <Button 
            variant="cyber" 
            size="lg" 
            className="text-base px-8 py-6 min-w-[200px]"
          >
            <Eye className="h-5 w-5 mr-2" />
            View Portfolio
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-base px-8 py-6 min-w-[200px]"
          >
            <Download className="h-5 w-5 mr-2" />
            Download CV
          </Button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <SocialLinks />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-green-500/60 text-sm font-mono">scroll down</span>
            <div className="w-px h-12 bg-gradient-to-b from-green-500/60 to-transparent"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
