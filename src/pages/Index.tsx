import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { MatrixRain } from "@/components/MatrixRain";

const Index = () => {
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Security Researcher | Penetration Tester | Ethical Hacker";

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(typingInterval);
      }
    }, 100);

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [fullText]);

  return (
    <div className="relative min-h-screen bg-black">
      {/* Matrix Rain Effect */}
      <MatrixRain />
      
      {/* CRT and Scanline Effects */}
      <div className="scanline" />
      <div className="crt-effect" />
      
      {/* Content */}
      <div className="relative z-10">
        <HeroSection text={text} showCursor={showCursor} />
        <ServicesSection />
        <ProjectsSection />
      </div>
    </div>
  );
};

export default Index;