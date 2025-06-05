
import { motion } from "framer-motion";
import { Terminal, Download, Eye, ChevronDown } from "lucide-react";
import { SocialLinks } from "./SocialLinks";
import { Button } from "./ui/button";

interface HeroSectionProps {
  text: string;
  showCursor: boolean;
}

export const HeroSection = ({ text, showCursor }: HeroSectionProps) => {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-cyber-grid bg-cyber-grid opacity-10"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Terminal Header with enhanced styling */}
        <motion.div 
          className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-black/80 border border-green-500/40 rounded-xl backdrop-blur-sm shadow-lg shadow-green-500/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Terminal className="h-5 w-5 text-green-400 animate-pulse" />
          <span className="text-green-400 text-sm font-mono">root@mabior-agau:~$</span>
          <span className="text-green-300 text-sm font-mono">whoami</span>
          <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        </motion.div>

        {/* Enhanced Main Title */}
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <motion.span 
            className="text-green-400 block mb-4 drop-shadow-[0_0_20px_rgba(0,255,0,0.3)]"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            MABIOR
          </motion.span>
          <motion.span 
            className="text-green-300 glitch drop-shadow-[0_0_30px_rgba(0,255,0,0.4)]" 
            data-text="AGAU"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            AGAU
          </motion.span>
        </motion.h1>

        {/* Enhanced Typing Effect */}
        <motion.div 
          className="text-lg sm:text-xl md:text-2xl text-green-500 mb-12 min-h-[3rem] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="relative">
            <span className="font-mono border-r-2 border-green-400 pr-2 bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
              {text}
              {showCursor && <span className="animate-pulse text-green-400">|</span>}
            </span>
          </div>
        </motion.div>

        {/* Enhanced Description */}
        <motion.div 
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="bg-black/60 border border-green-500/20 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
            <p className="text-green-300/90 text-lg sm:text-xl leading-relaxed">
              Specializing in <span className="text-green-400 font-semibold">advanced penetration testing</span>, 
              <span className="text-green-400 font-semibold"> zero-day research</span>, and 
              <span className="text-green-400 font-semibold"> red team operations</span>. 
              I help organizations strengthen their cyber defenses against sophisticated threats.
            </p>
          </div>
        </motion.div>

        {/* Enhanced Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <Button 
            variant="cyber" 
            size="lg" 
            className="text-base px-10 py-6 min-w-[220px] font-semibold tracking-wide shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all duration-300"
          >
            <Eye className="h-5 w-5 mr-3" />
            View Portfolio
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-base px-10 py-6 min-w-[220px] font-semibold tracking-wide hover:bg-green-500/10 border-green-500/40 hover:border-green-400/60 transition-all duration-300"
          >
            <Download className="h-5 w-5 mr-3" />
            Download CV
          </Button>
        </motion.div>

        {/* Enhanced Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <SocialLinks />
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-3 cursor-pointer group">
            <span className="text-green-500/70 text-sm font-mono group-hover:text-green-400 transition-colors">
              scroll down
            </span>
            <motion.div 
              className="flex flex-col items-center"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="h-5 w-5 text-green-500/70 group-hover:text-green-400 transition-colors" />
              <div className="w-px h-8 bg-gradient-to-b from-green-500/60 to-transparent mt-1"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
