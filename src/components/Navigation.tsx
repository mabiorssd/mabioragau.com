
import { motion } from "framer-motion";
import { Menu, Terminal, Command, Hexagon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const glitchAnimation = {
  initial: { x: 0 },
  animate: {
    x: [-2, 2, -2, 0],
    transition: {
      duration: 0.2,
      repeat: Infinity,
      repeatType: "loop" as const
    }
  }
};

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navigation = ({ activeSection, setActiveSection }: NavigationProps) => {
  const isMobile = useIsMobile();

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const navigationItems = ["about", "services", "projects", "blog", "contact"].map((item) => ({
    label: item,
    onClick: () => handleSectionClick(item),
    isActive: activeSection === item
  }));

  return (
    <motion.nav 
      className="fixed w-full backdrop-blur-lg z-50 border-b border-green-500/30 bg-black/60 scanlines"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="group">
            <motion.div 
              className="text-lg sm:text-xl font-bold text-green-400 flex items-center gap-2 sm:gap-3 cyber-glow"
              variants={glitchAnimation}
              initial="initial"
              animate="animate"
            >
              <div className="relative">
                <Hexagon className="h-6 sm:h-8 w-auto text-green-500/80" />
                <Terminal className="h-3 sm:h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black" />
              </div>
              <span className="hidden sm:inline font-mono relative overflow-hidden group-hover:animate-neon-pulse">
                <span className="relative z-10">&gt; ~/mabior_agau</span>
                <span className="absolute top-0 left-0 w-full h-0.5 bg-green-500/40 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                <span className="absolute bottom-0 right-0 w-full h-0.5 bg-green-500/40 transform origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
              </span>
            </motion.div>
          </Link>

          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 sm:p-2.5 hover:bg-green-500/10 rounded-md transition-all duration-300 border border-green-500/20 bg-black/50 animate-border-pulse">
                  <Menu className="h-5 w-5 text-green-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-black/95 border border-green-500/30 backdrop-blur-xl shadow-[0_0_15px_rgba(0,255,0,0.15)]">
                <DropdownMenuGroup>
                  {navigationItems.map((item) => (
                    <DropdownMenuItem
                      key={item.label}
                      className={`px-3 py-2.5 cursor-pointer hover:bg-green-500/10 transition-all duration-300 ${
                        item.isActive ? 'text-green-400 bg-green-900/10' : 'text-green-600'
                      }`}
                      onClick={item.onClick}
                    >
                      <Command className="h-4 w-4 mr-2" />
                      <span className="font-mono">&gt;_{item.label}</span>
                      {item.isActive && (
                        <span className="ml-auto text-green-500 text-xs">active</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-6">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.label}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={item.onClick}
                  className={`capitalize font-mono hover-glow group relative px-3 py-1 ${
                    item.isActive 
                      ? "text-green-400" 
                      : "text-green-600 hover:text-green-500"
                  }`}
                >
                  <span>&gt;_{item.label}</span>
                  <span 
                    className={`absolute -bottom-1 left-0 w-full h-0.5 bg-green-500/50 transform origin-left transition-transform duration-300 ${
                      item.isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  ></span>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};
