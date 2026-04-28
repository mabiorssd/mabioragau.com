import { useState, useEffect, useCallback, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { BlogSection } from "@/components/BlogSection";
import { SecurityNewsSection } from "@/components/SecurityNewsSection";
import { ContactForm } from "@/components/ContactForm";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SecurityFooter } from "@/components/SecurityFooter";
import { AIChatbot } from "@/components/AIChatbot";
import { GlassCard } from "@/components/soc/GlassCard";
import { CommandPalette } from "@/components/soc/CommandPalette";
import { CommandHistoryTimeline } from "@/components/soc/CommandHistoryTimeline";
import { ArsenalRadar } from "@/components/soc/ArsenalRadar";
import { MobileDock } from "@/components/soc/MobileDock";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

const fullText = "Security Researcher · Penetration Tester · Ethical Hacker";

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState("about");
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cursorRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useVisitorTracking();

  const handleScroll = useCallback(() => {
    const sections = ["about", "services", "skills", "experience", "projects", "testimonials", "news", "blog", "contact"];
    const current = sections.find((s) => {
      const el = document.getElementById(s);
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top <= 120 && r.bottom >= 120;
    });
    if (current) setActiveSection(current);
  }, []);

  useEffect(() => {
    let i = 0;
    typingRef.current = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length && typingRef.current) clearInterval(typingRef.current);
    }, 60);

    cursorRef.current = setInterval(() => setShowCursor((c) => !c), 500);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
      if (cursorRef.current) clearInterval(cursorRef.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="min-h-screen text-foreground relative pt-7 pb-20 md:pb-0">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <main>
      <main>
        <HeroSection text={text} showCursor={showCursor} />
        <ServicesSection />
        <ArsenalRadar />
        <CommandHistoryTimeline />
        <ProjectsSection />
        <TestimonialsSection />
        <SecurityNewsSection />
        <BlogSection />

        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <GlassCard className="p-8 sm:p-10 text-center">
              <span className="eyebrow">// signal_subscribe</span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
                Get the <span className="bg-gradient-primary bg-clip-text text-transparent">briefing</span>
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Occasional newsletter with practical security guidance and field notes. No noise.
              </p>
              <div className="mt-6 max-w-md mx-auto">
                <NewsletterForm />
              </div>
            </GlassCard>
          </div>
        </section>

        <ContactForm />
      </main>
      <SecurityFooter />
      <AIChatbot />
      <CommandPalette />
    </div>
  );
};

export default Portfolio;
