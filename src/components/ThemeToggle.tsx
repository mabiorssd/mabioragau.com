import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative w-10 h-10 rounded-xl glass-panel grid place-items-center text-foreground hover:border-primary/50 transition-colors ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 grid place-items-center"
          >
            <Moon className="w-4.5 h-4.5 text-primary" strokeWidth={2} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 grid place-items-center"
          >
            <Sun className="w-5 h-5 text-primary" strokeWidth={2} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};
