import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
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
      className="fixed w-full backdrop-blur-md z-50 cyber-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
    >
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-3">
        <div className="flex justify-between items-center">
          <motion.div 
            className="text-lg sm:text-xl font-bold text-green-400 flex items-center gap-2 sm:gap-3 hover-glow"
            variants={glitchAnimation}
            initial="initial"
            animate="animate"
          >
            <img 
              src="/lovable-uploads/c03a3f36-4ec5-4eed-9142-f4bc651ea572.png" 
              alt="Mabior Agau Logo" 
              className="h-6 sm:h-8 w-auto rounded-full border border-green-500/30"
            />
            <span className="hidden sm:inline font-mono">&gt; ~/mabior_agau</span>
          </motion.div>

          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 sm:p-2 hover:bg-green-500/10 rounded-md transition-all duration-300 cyber-border">
                  <Menu className="h-5 w-5 text-green-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-black/95 border border-green-500/30 backdrop-blur-lg">
                <DropdownMenuGroup>
                  {navigationItems.map((item) => (
                    <DropdownMenuItem
                      key={item.label}
                      className={`px-3 py-2 cursor-pointer hover:bg-green-500/10 transition-all duration-300 ${
                        item.isActive ? 'text-green-400' : 'text-green-600'
                      }`}
                      onClick={item.onClick}
                    >
                      <span className="font-mono">&gt;_{item.label}</span>
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
                  className={`capitalize font-mono hover-glow ${
                    item.isActive 
                      ? "text-green-400 border-b-2 border-green-500" 
                      : "text-green-600"
                  }`}
                >
                  &gt;_{item.label}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};