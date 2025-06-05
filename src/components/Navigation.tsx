
import { motion } from "framer-motion";
import { Menu, Terminal, Command, Hexagon, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navigation = ({ activeSection, setActiveSection }: NavigationProps) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    setIsMenuOpen(false);
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const navigationItems = [
    { label: "about", displayName: "About" },
    { label: "services", displayName: "Services" },
    { label: "projects", displayName: "Projects" },
    { label: "blog", displayName: "Blog" },
    { label: "contact", displayName: "Contact" }
  ].map((item) => ({
    ...item,
    onClick: () => handleSectionClick(item.label),
    isActive: activeSection === item.label
  }));

  return (
    <motion.nav 
      className="fixed w-full backdrop-blur-xl z-50 border-b border-green-500/20 bg-black/80"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="group">
            <motion.div 
              className="text-xl font-bold text-green-400 flex items-center gap-3 hover:text-green-300 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <Hexagon className="h-8 w-8 text-green-500/80" />
                <Terminal className="h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black" />
              </div>
              <span className="hidden sm:inline font-mono">
                <span className="text-green-500">&gt;</span>
                <span className="text-green-400">_</span>
                <span className="text-green-300">mabior.agau</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile ? (
            <div className="flex items-center gap-8">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.label}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={item.onClick}
                  className={`relative font-mono text-sm transition-all duration-300 ${
                    item.isActive 
                      ? "text-green-400" 
                      : "text-green-600 hover:text-green-400"
                  }`}
                >
                  <span>&gt;_{item.displayName.toLowerCase()}</span>
                  {item.isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-400"
                      layoutId="activeTab"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          ) : (
            /* Mobile Navigation */
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <motion.button 
                  className="p-2 hover:bg-green-500/10 rounded-lg transition-all duration-300 border border-green-500/20 bg-black/50"
                  whileTap={{ scale: 0.95 }}
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5 text-green-400" />
                  ) : (
                    <Menu className="h-5 w-5 text-green-400" />
                  )}
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 bg-black/95 border border-green-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(0,255,0,0.15)]"
                align="end"
              >
                <DropdownMenuGroup>
                  {navigationItems.map((item) => (
                    <DropdownMenuItem
                      key={item.label}
                      className={`px-4 py-3 cursor-pointer hover:bg-green-500/10 transition-all duration-300 ${
                        item.isActive ? 'text-green-400 bg-green-900/20' : 'text-green-600'
                      }`}
                      onClick={item.onClick}
                    >
                      <Command className="h-4 w-4 mr-3" />
                      <span className="font-mono">&gt;_{item.displayName.toLowerCase()}</span>
                      {item.isActive && (
                        <span className="ml-auto text-green-500 text-xs">active</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </motion.nav>
  );
};
