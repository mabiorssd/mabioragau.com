
import { motion } from "framer-motion";
import { Menu, Terminal, Command, Hexagon, X, Wifi } from "lucide-react";
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
    { label: "about", displayName: "About", icon: "🏠" },
    { label: "services", displayName: "Services", icon: "🛡️" },
    { label: "projects", displayName: "Projects", icon: "🔒" },
    { label: "news", displayName: "News", icon: "📰" },
    { label: "blog", displayName: "Blog", icon: "📝" },
    { label: "contact", displayName: "Contact", icon: "📡" }
  ].map((item) => ({
    ...item,
    onClick: () => handleSectionClick(item.label),
    isActive: activeSection === item.label
  }));

  return (
    <motion.nav 
      className="fixed w-full backdrop-blur-xl z-50 border-b border-green-500/30 bg-black/90 shadow-lg shadow-green-500/5"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Enhanced Logo */}
          <Link to="/" className="group">
            <motion.div 
              className="text-xl font-bold text-green-400 flex items-center gap-3 hover:text-green-300 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <Hexagon className="h-8 w-8 text-green-500/80 group-hover:text-green-400 transition-colors" />
                <Terminal className="h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black group-hover:animate-pulse" />
              </div>
              <span className="hidden sm:inline font-mono">
                <span className="text-green-500">&gt;</span>
                <span className="text-green-400">_</span>
                <span className="text-green-300">mabior.agau</span>
              </span>
              {/* Connection indicator */}
              <div className="hidden lg:flex items-center gap-2 ml-4 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                <Wifi className="h-3 w-3 text-green-400" />
                <span className="text-green-400 text-xs font-mono">online</span>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile ? (
            <div className="flex items-center gap-2">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.label}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={item.onClick}
                  className={`relative font-mono text-sm px-4 py-2 rounded-lg transition-all duration-300 ${
                    item.isActive 
                      ? "text-green-400 bg-green-500/10 border border-green-500/30" 
                      : "text-green-600 hover:text-green-400 hover:bg-green-500/5"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs">{item.icon}</span>
                    &gt;_{item.displayName.toLowerCase()}
                  </span>
                  {item.isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-400 rounded-full"
                      layoutId="activeTab"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          ) : (
            /* Enhanced Mobile Navigation */
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <motion.button 
                  className="p-3 hover:bg-green-500/10 rounded-xl transition-all duration-300 border border-green-500/30 bg-black/70 backdrop-blur-sm shadow-lg"
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
                className="w-64 bg-black/95 border border-green-500/40 backdrop-blur-xl shadow-2xl shadow-green-500/20 rounded-xl"
                align="end"
              >
                <DropdownMenuGroup>
                  {navigationItems.map((item) => (
                    <DropdownMenuItem
                      key={item.label}
                      className={`px-4 py-4 cursor-pointer hover:bg-green-500/10 transition-all duration-300 rounded-lg m-1 ${
                        item.isActive ? 'text-green-400 bg-green-900/30 border border-green-500/20' : 'text-green-600'
                      }`}
                      onClick={item.onClick}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <span className="text-lg">{item.icon}</span>
                        <Command className="h-4 w-4" />
                        <span className="font-mono flex-1">&gt;_{item.displayName.toLowerCase()}</span>
                        {item.isActive && (
                          <div className="flex items-center gap-1">
                            <span className="text-green-500 text-xs">active</span>
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                          </div>
                        )}
                      </div>
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
