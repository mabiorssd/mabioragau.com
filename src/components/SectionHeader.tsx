import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
  align?: "left" | "center";
}

export const SectionHeader = ({
  title,
  subtitle,
  description,
  icon,
  className,
  align = "center"
}: SectionHeaderProps) => {
  const alignment = align === "center" ? "text-center" : "text-left";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn("mb-16", alignment, className)}
    >
      {subtitle && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-2 text-sm font-medium text-primary/80 mb-4"
          style={{ justifyContent: align === "center" ? "center" : "flex-start" }}
        >
          {icon}
          <span className="uppercase tracking-wider">{subtitle}</span>
        </motion.div>
      )}
      
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight"
      >
        {title}
      </motion.h2>
      
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={cn(
            "text-lg text-muted-foreground leading-relaxed max-w-3xl",
            align === "center" ? "mx-auto" : ""
          )}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
};