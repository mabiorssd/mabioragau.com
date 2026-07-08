import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Twitter, MapPin, Shield, Activity, Target } from "lucide-react";
import { GlassCard } from "./soc/GlassCard";
import portraitImg from "@/assets/portrait-mabior.jpg";

interface HeroSectionProps {
  text: string;
  showCursor: boolean;
}

const stats = [
  { label: "Engagements", value: "120+", icon: Shield },
  { label: "CVEs Disclosed", value: "14", icon: Target },
  { label: "Years in Field", value: "6", icon: Activity },
];

export const HeroSection = ({ text, showCursor }: HeroSectionProps) => {
  return (
    <section id="about" className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-12 gap-6">
          {/* Main hero identity */}
          <GlassCard className="col-span-12 lg:col-span-8 p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-extrabold leading-[1.02] tracking-tight font-display">
              <span className="text-foreground">MABIOR</span>{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">AGAU</span>
            </h1>

            <p className="mt-3 sm:mt-4 max-w-2xl text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Offensive security professional — penetration testing, red team operations, and vulnerability research.
            </p>

            {/* Subtle typing subtitle */}
            <p className="mt-6 text-sm text-muted-foreground/70 font-mono border-l-2 border-primary/30 pl-4">
              {text}
              {showCursor && <span className="text-primary animate-pulse">|</span>}
            </p>

            {/* CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/20"
              >
                Start an Engagement →
              </a>
              <a
                href="#projects"
                onClick={(e) => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-foreground font-semibold text-sm hover:bg-secondary/80 transition-all duration-300 border border-border"
              >
                View Projects
              </a>
            </div>

            {/* Stats */}
            <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg">
              {stats.map((s, i) => (
                <div key={s.label} className="relative">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground font-display">{s.value}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <s.icon className="w-3 h-3 text-primary/70" />
                    <span className="text-xs text-muted-foreground tracking-wide">{s.label}</span>
                  </div>
                  {i < stats.length - 1 && (
                    <div className="hidden sm:block absolute right-0 top-0 h-full w-px bg-border last:hidden" />
                  )}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Profile sidebar — portrait card */}
          <GlassCard className="col-span-12 lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Portrait + name */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-2 ring-primary/20 shadow-glow mb-4 group">
                  <img
                    src={portraitImg}
                    alt="Mabior Agau"
                    loading="eager"
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="font-bold text-foreground text-xl">Mabior Agau</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1.5">
                  <MapPin className="w-3 h-3 shrink-0" /> Juba, South Sudan
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-lg bg-secondary/40 border border-border px-3 py-2.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div>
                    <div className="text-xs font-medium text-foreground">Available for engagements</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Booking Q4 2026</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-6 pt-5 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Connect</span>
                <div className="flex items-center gap-2">
                  {[
                    { Icon: Github, href: "https://github.com/mabiorssd/", label: "GitHub" },
                    { Icon: Linkedin, href: "https://www.linkedin.com/in/mabior-agau-436825210/", label: "LinkedIn" },
                    { Icon: Twitter, href: "https://x.com/_CyberMaster", label: "X" },
                    { Icon: Mail, href: "mailto:info@mabioragau.com", label: "Email" },
                  ].map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-9 h-9 grid place-items-center rounded-lg bg-secondary border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};
