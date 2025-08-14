
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MatrixBackground } from "@/components/MatrixBackground";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { SkillsShowcase } from "@/components/SkillsShowcase";
import { ProjectsSection } from "@/components/ProjectsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { BlogSection } from "@/components/BlogSection";
import { ContactForm } from "@/components/ContactForm";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SecurityFooter } from "@/components/SecurityFooter";
import { HackerIntro } from "@/components/HackerIntro";

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState("about");
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const fullText = "Security Researcher | Penetration Tester | Ethical Hacker";

  const handleScroll = useCallback(() => {
    const sections = ["about", "services", "skills", "projects", "testimonials", "blog", "contact"];
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
            <MatrixBackground />
            <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
            <HeroSection text={text} showCursor={showCursor} />
            {/* Main Content Sections */}
            <main className="relative z-10">
              <ServicesSection />
              <SkillsShowcase />
              <ProjectsSection />
              <TestimonialsSection />
              <BlogSection />
              
              {/* Newsletter Section */}
              <section className="py-24 px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                      Stay Updated
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                      Get the latest insights on cybersecurity, vulnerability research, and ethical hacking directly to your inbox.
                    </p>
                    <NewsletterForm />
                  </motion.div>
                </div>
              </section>
              
              <ContactForm />
            </main>
            
            <SecurityFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Portfolio;
