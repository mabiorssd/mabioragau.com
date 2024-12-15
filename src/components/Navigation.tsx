import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

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
  return (
    <nav className="fixed w-full bg-black/90 backdrop-blur-sm z-50 border-b border-green-500/30">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.div 
            className="text-2xl font-bold text-green-400"
            variants={glitchAnimation}
            initial="initial"
            animate="animate"
          >
            <Terminal className="inline-block mr-2" size={24} />
            ~/mabior_agau
          </motion.div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {["about", "services", "projects", "contact"].map((item) => (
              <motion.a
                key={item}
                href={`#${item}`}
                whileHover={{ scale: 1.05, color: "#00ff00" }}
                whileTap={{ scale: 0.95 }}
                className={`capitalize ${
                  activeSection === item ? "text-green-400" : "text-green-600"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection(item);
                  const element = document.getElementById(item);
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                &gt;_{item}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};