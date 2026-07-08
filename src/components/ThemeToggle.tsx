import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={isDark ? "🌙 Dark mode — switch to light" : "☀️ Light mode — switch to dark"}
      className={`relative h-9 px-3 rounded-xl bg-secondary border border-border hover:border-primary/50 hover:bg-secondary/80 transition-all duration-200 flex items-center gap-1.5 ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center gap-1.5"
          >
            <Moon className="w-4 h-4 text-primary" strokeWidth={2} />
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-primary font-semibold">
              DARK
            </span>
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center gap-1.5"
          >
            <Sun className="w-4 h-4 text-amber-500" strokeWidth={2} />
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-amber-600 font-semibold">
              LIGHT
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};
