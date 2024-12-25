import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { BlogSection } from "@/components/BlogSection";
import { ContactForm } from "@/components/ContactForm";
import { motion, AnimatePresence } from "framer-motion";

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState("about");
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Security Researcher | Penetration Tester | Ethical Hacker";

  const handleScroll = useCallback(() => {
    const sections = ["about", "services", "projects", "blog", "contact"];
    const currentSection = sections.find(section => {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      }
      return false;
    });
    if (currentSection) {
      setActiveSection(currentSection);
    }
  }, []);

  useEffect(() => {
    let index = 0;
    let typingInterval: NodeJS.Timeout;
    let cursorInterval: NodeJS.Timeout;

    const startTyping = () => {
      typingInterval = setInterval(() => {
        setText(fullText.slice(0, index));
        index++;
        if (index > fullText.length) {
          clearInterval(typingInterval);
        }
      }, 100);
    };

    startTyping();

    cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fullText, handleScroll]);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-black text-green-500 font-mono relative overflow-hidden"
      >
        <div className="relative z-10">
          <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
          <HeroSection text={text} showCursor={showCursor} />
          <ServicesSection />
          <ProjectsSection />
          <BlogSection />
          <ContactForm />
        </div>

        {/* Decorative Elements */}
        <motion.div 
          className="fixed top-0 left-0 w-full h-full pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 2 }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-500/20 via-transparent to-transparent" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Portfolio;