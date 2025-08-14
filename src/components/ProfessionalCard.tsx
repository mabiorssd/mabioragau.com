import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProfessionalCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "premium" | "minimal" | "glow";
  hover?: boolean;
  delay?: number;
}

export const ProfessionalCard = ({ 
  children, 
  className, 
  variant = "default", 
  hover = true,
  delay = 0
}: ProfessionalCardProps) => {
  const variants = {
    default: "bg-gradient-to-br from-card to-card/80 border border-border/50 backdrop-blur-sm",
    premium: "bg-gradient-to-br from-card via-card/90 to-secondary/10 border border-primary/30 shadow-lg shadow-primary/10",
    minimal: "bg-card/60 border border-border/30 backdrop-blur-md",
    glow: "bg-gradient-to-br from-card to-secondary/5 border border-primary/40 shadow-2xl shadow-primary/20"
  };

  const hoverEffects = {
    default: "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10",
    premium: "hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1",
    minimal: "hover:border-border/50 hover:bg-card/80",
    glow: "hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-2"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={cn(
        "relative rounded-xl p-6 transition-all duration-300",
        variants[variant],
        hover && hoverEffects[variant],
        "group overflow-hidden",
        className
      )}
    >
      {/* Subtle animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full transform" 
           style={{ animationDuration: "1.5s" }} />
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary/30 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary/30 rounded-br-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};