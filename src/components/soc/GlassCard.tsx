import { forwardRef, HTMLAttributes, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  glow?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, interactive = true, glow = false, onMouseMove, children, ...props }, ref) => {
    const handleMove = (e: MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
      onMouseMove?.(e);
    };

    return (
      <div
        ref={ref}
        onMouseMove={interactive ? handleMove : onMouseMove}
        className={cn(
          "glass-panel rounded-2xl p-6",
          interactive && "glass-panel-hover cursor-glow",
          glow && "shadow-glow",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";
