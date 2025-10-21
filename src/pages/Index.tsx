
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizedBackground } from "@/components/OptimizedBackground";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { SkillsShowcase } from "@/components/SkillsShowcase";
import { ProjectsSection } from "@/components/ProjectsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { BlogSection } from "@/components/BlogSection";
import { SecurityNewsSection } from "@/components/SecurityNewsSection";
import { ContactForm } from "@/components/ContactForm";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SecurityFooter } from "@/components/SecurityFooter";
import { HackerIntro } from "@/components/HackerIntro";
import { AIChatbot } from "@/components/AIChatbot";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState("about");
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const fullText = "Security Researcher | Penetration Tester | Ethical Hacker";

  // Track visitors with AI analytics
  useVisitorTracking();

  const handleScroll = useCallback(() => {
    const sections = ["about", "services", "skills", "projects", "testimonials", "news", "blog", "contact"];
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

    if (showContent) {
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
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fullText, handleScroll, showContent]);

  return (
    <>
      <HackerIntro onComplete={() => setShowContent(true)} />
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-black text-green-500 font-mono relative overflow-hidden"
          >
            <OptimizedBackground />
            <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
            <HeroSection text={text} showCursor={showCursor} />
            <ServicesSection />
            <SkillsShowcase />
            <ProjectsSection />
            <TestimonialsSection />
            <SecurityNewsSection />
            <BlogSection />
            <div className="py-12 px-6">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-green-400 mb-8 text-center">
                  Subscribe to My Newsletter
                </h2>
                <NewsletterForm />
              </div>
            </div>
            <ContactForm />
            <SecurityFooter />
            <AIChatbot />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Portfolio;
