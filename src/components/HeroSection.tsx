
import { SocialLinks } from "./SocialLinks";

interface HeroSectionProps {
  text: string;
  showCursor: boolean;
}

export const HeroSection = ({ text, showCursor }: HeroSectionProps) => {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto text-center">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm mb-4">
            AI-Powered Security
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-green-400">
          MABIOR AGAU
        </h1>

        <div className="text-xl sm:text-2xl text-green-300 mb-8">
          {text}
          {showCursor && <span className="text-green-400">|</span>}
        </div>

        <div className="max-w-3xl mx-auto mb-10">
          <p className="text-green-300/80 text-lg leading-relaxed">
            Specializing in penetration testing, security auditing, and helping organizations 
            strengthen their cyber defenses against modern threats.
          </p>
        </div>

        <div className="flex justify-center">
          <SocialLinks />
        </div>
      </div>
    </section>
  );
};
