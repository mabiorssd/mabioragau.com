import { motion } from "framer-motion";
import { Menu, X, Shield } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const items = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "news", label: "Intel" },
  { id: "blog", label: "Briefings" },
  { id: "contact", label: "Contact" },
];

export const Navigation = ({ activeSection, setActiveSection }: NavigationProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (id: string) => {
    setActiveSection(id);
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-2xl bg-background/60 border-b border-border/60 shadow-lg shadow-black/5"
          : "bg-transparent"
      }`}
    >
      {/* Thin accent line when scrolled */}
      {scrolled && (
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow transition-transform duration-300 group-hover:scale-105">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-xs sm:text-sm text-foreground tracking-tight">MABIOR AGAU</span>
          </div>
        </Link>

        {!isMobile ? (
          <div className="flex items-center">
            <nav className={`flex items-center gap-1 rounded-full px-1.5 sm:px-2 py-1 sm:py-1.5 transition-all duration-500 ${
              scrolled
                ? "glass-panel shadow-sm"
                : "backdrop-blur-md bg-background/10 border border-border/20"
            }`}>
              {items.map((it) => {
                const active = activeSection === it.id;
                return (
                  <button
                    key={it.id}
                    onClick={() => handleClick(it.id)}
                    className={`relative px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-sm font-medium transition-colors ${
                      active ? "text-primary-foreground" : "text-muted-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-primary shadow-glow"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{it.label}</span>
                  </button>
                );
              })}
              <span className="w-px h-5 bg-border/40 mx-1" />
              <ThemeToggle />
            </nav>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen((o) => !o)}
              className={`w-10 h-10 rounded-xl grid place-items-center text-foreground transition-all duration-300 ${
                scrolled ? "glass-panel" : "backdrop-blur-md bg-background/10 border border-border/20"
              }`}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>

      {isMobile && open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/40 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-50 px-4 pb-4"
            onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
          >
          <div className="glass-panel rounded-2xl p-2 shadow-xl">
            {items.map((it) => {
              const active = activeSection === it.id;
              return (
                <button
                  key={it.id}
                  onClick={() => handleClick(it.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {it.label}
                </button>
              );
            })}
          </div>
        </motion.div>
        </>
        )}
    </motion.header>
  );
};
