
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  variant?: 'default' | 'premium' | 'minimal';
}

export const ModernCard = ({ 
  children, 
  className, 
  hover = true, 
  glow = false,
  variant = 'default'
}: ModernCardProps) => {
  const variants = {
    default: "border-green-500/20 bg-black/60",
    premium: "border-green-400/30 bg-gradient-to-br from-black/70 to-green-900/10",
    minimal: "border-green-500/15 bg-black/40"
  };

  return (
    <motion.div
      className={cn(
        "relative group overflow-hidden rounded-2xl backdrop-blur-sm p-8 transition-all duration-500",
        variants[variant],
        hover && "hover:border-green-400/50 hover:shadow-2xl hover:shadow-green-500/10",
        glow && "shadow-[0_0_30px_rgba(0,255,0,0.15)]",
        className
      )}
      whileHover={hover ? { 
        y: -8, 
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      } : undefined}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Enhanced animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Animated border effect */}
      <div className="absolute inset-0 rounded-2xl border border-green-500/0 group-hover:border-green-400/30 transition-all duration-500" />
      
      {/* Enhanced corner accents with animation */}
      <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-green-500/0 group-hover:border-green-400/60 transition-all duration-500 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-green-500/0 group-hover:border-green-400/60 transition-all duration-500 rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-green-500/0 group-hover:border-green-400/60 transition-all duration-500 rounded-bl-2xl" />
      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-green-500/0 group-hover:border-green-400/60 transition-all duration-500 rounded-br-2xl" />
      
      {/* Scanning line effect */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400/60 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Content with enhanced spacing */}
      <div className="relative z-10 space-y-6">
        {children}
      </div>
    </motion.div>
  );
};
