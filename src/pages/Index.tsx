import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
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
// AIChatbot is mounted globally in App.tsx
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
    // Smooth typing using requestAnimationFrame (cleaner, no setInterval)
    let charIndex = 0;
    let lastFrame = 0;
    const TYPING_SPEED = 60;
    let animFrameId: number;

    const animate = (timestamp: number) => {
      if (timestamp - lastFrame >= TYPING_SPEED) {
        lastFrame = timestamp;
        if (charIndex <= fullText.length) {
          setText(fullText.slice(0, charIndex));
          charIndex++;
        }
      }
      if (charIndex <= fullText.length) {
        animFrameId = requestAnimationFrame(animate);
      }
    };
    animFrameId = requestAnimationFrame(animate);

    // Cursor blink via CSS animation — state kept at true
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="min-h-screen text-foreground relative pt-7 pb-20 md:pb-0">
      <Helmet>
        <title>Mabior Agau — Cybersecurity Expert & Penetration Tester</title>
        <meta name="description" content="Mabior Agau is an offensive security specialist offering penetration testing, red team simulation, and security engineering services from South Sudan." />
        <link rel="canonical" href="https://mabioragau.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Mabior Agau — Cybersecurity Expert & Penetration Tester" />
        <meta property="og:description" content="Offensive security, penetration testing, and red team simulation by Mabior Agau." />
        <meta property="og:url" content="https://mabioragau.com/" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200&h=630" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Helmet>
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
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
              <h2 className="mt-4 font-display font-extrabold tracking-tight text-[clamp(1.75rem,3vw,2.5rem)]">
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
      <CommandPalette />
      <MobileDock activeSection={activeSection} />
    </div>
  );
};

export default Portfolio;
