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
    <nav className="fixed w-full bg-black/90 backdrop-blur-sm z-50 border-b border-green-500/30">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <motion.div 
            className="text-xl font-bold text-green-400 flex items-center gap-2"
            variants={glitchAnimation}
            initial="initial"
            animate="animate"
          >
            <img 
              src="/lovable-uploads/c03a3f36-4ec5-4eed-9142-f4bc651ea572.png" 
              alt="Mabior Agau Logo" 
              className="h-8 w-auto"
            />
            <span className="hidden sm:inline">~/mabior_agau</span>
          </motion.div>

          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 hover:bg-green-500/10 rounded-md transition-colors">
                  <Menu className="h-5 w-5 text-green-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-black/95 border border-green-500/30">
                <DropdownMenuGroup>
                  {navigationItems.map((item) => (
                    <DropdownMenuItem
                      key={item.label}
                      className={`px-3 py-1.5 cursor-pointer hover:bg-green-500/10 transition-colors ${
                        item.isActive ? 'text-green-400' : 'text-green-600'
                      }`}
                      onClick={item.onClick}
                    >
                      &gt;_{item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-4">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.label}
                  whileHover={{ scale: 1.05, color: "#00ff00" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={item.onClick}
                  className={`capitalize ${
                    item.isActive ? "text-green-400" : "text-green-600"
                  }`}
                >
                  &gt;_{item.label}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};