import { motion } from "framer-motion";
import { Menu, X, Shield } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const items = [
  { id: "about", label: "Overview" },
  { id: "services", label: "Services" },
  { id: "skills", label: "Tactical Proficiency" },
  { id: "projects", label: "Deployment History" },
  { id: "news", label: "Threat Intel" },
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
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-background/70 border-b border-border"
          : "backdrop-blur-md bg-background/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
            <Shield className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-sm text-foreground">MABIOR AGAU</span>
            <span className="font-mono text-[10px] text-primary uppercase tracking-widest">SOC // Live</span>
          </div>
        </Link>

        {!isMobile ? (
          <nav className="flex items-center gap-1 glass-panel rounded-full px-2 py-1.5">
            {items.map((it) => {
              const active = activeSection === it.id;
              return (
                <button
                  key={it.id}
                  onClick={() => handleClick(it.id)}
                  className={`relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{it.label}</span>
                </button>
              );
            })}
          </nav>
        ) : (
          <button
            onClick={() => setOpen((o) => !o)}
            className="glass-panel w-10 h-10 rounded-xl grid place-items-center text-foreground"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}
      </div>

      {isMobile && open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pb-4"
        >
          <div className="glass-panel rounded-2xl p-2">
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
      )}
    </motion.header>
  );
};
