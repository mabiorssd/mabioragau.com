import { useState, useEffect, useCallback } from "react";
import { MatrixBackground } from "@/components/MatrixBackground";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { BlogSection } from "@/components/BlogSection";
import { ContactForm } from "@/components/ContactForm";
import { NewsletterForm } from "@/components/NewsletterForm";

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
    <div className="min-h-screen bg-black text-green-500 font-mono relative overflow-hidden">
      <MatrixBackground />
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <HeroSection text={text} showCursor={showCursor} />
      <ServicesSection />
      <ProjectsSection />
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
    </div>
  );
};

export default Portfolio;