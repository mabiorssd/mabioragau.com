import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { useTheme } from "./ThemeProvider";

/**
 * Secure / Compromised mode toggle.
 * Dark = SECURE (emerald). Light = COMPROMISED (red).
 */
export const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { theme, toggle } = useTheme();
  const isSecure = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isSecure ? "compromised" : "secure"} mode`}
      title={isSecure ? "SECURE MODE — switch to COMPROMISED" : "COMPROMISED MODE — switch to SECURE"}
      className={`relative h-9 px-2.5 rounded-xl glass-panel flex items-center gap-2 hover:border-primary/50 transition-colors ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isSecure ? (
          <motion.span
            key="secure"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-primary" strokeWidth={2.2} />
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-primary font-semibold">
              SECURE
            </span>
          </motion.span>
        ) : (
          <motion.span
            key="compromised"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4 text-primary" strokeWidth={2.2} />
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-primary font-semibold">
              COMPROMISED
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};
