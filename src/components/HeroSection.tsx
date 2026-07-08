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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const HeroSection = ({ text, showCursor }: HeroSectionProps) => {
  return (
    <section id="about" className="relative pt-20 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          className="grid grid-cols-12 gap-5 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main hero identity */}
          <motion.div variants={itemVariants} className="col-span-12 lg:col-span-8">
            <GlassCard className="p-6 sm:p-10 lg:p-12 relative overflow-hidden">
              {/* Subtle accent gradient bar at top */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/40 via-primary-glow to-primary/20" />

              <div className="relative">
                <motion.p
                  className="text-[11px] font-mono tracking-[0.2em] uppercase text-primary mb-3"
                  variants={itemVariants}
                >
                  Offensive Security Professional
                </motion.p>

                <motion.h1
                  className="text-5xl sm:text-7xl lg:text-8xl font-extrabold leading-[1.02] tracking-tight font-display"
                  variants={itemVariants}
                >
                  <span className="text-foreground text-glow">MABIOR</span>{" "}
                  <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent text-glow-strong">
                    AGAU
                  </span>
                </motion.h1>

                <motion.p
                  className="mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed"
                  variants={itemVariants}
                >
                  Offensive security professional — penetration testing, red team operations, and vulnerability research.
                </motion.p>

                {/* Typing subtitle */}
                <motion.p
                  className="mt-6 text-sm text-muted-foreground/80 font-mono border-l-2 border-primary/40 pl-4"
                  variants={itemVariants}
                >
                  <span className="text-primary/60">$</span> {text}
                  {showCursor && (
                    <span className="text-primary inline-block w-[2px] h-4 ml-0.5 align-middle animate-pulse">|</span>
                  )}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4"
                  variants={itemVariants}
                >
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40"
                  >
                    <span className="btn-content">Start an Engagement →</span>
                  </a>
                  <a
                    href="#projects"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary/80 text-foreground font-semibold text-sm hover:bg-secondary/60 transition-all duration-300 border border-border hover:border-primary/40 backdrop-blur-sm"
                  >
                    <span>View Projects</span>
                  </a>
                </motion.div>

                {/* Stats */}
                <motion.div
                  className="mt-8 sm:mt-12 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg"
                  variants={itemVariants}
                >
                  {stats.map((s, i) => (
                    <div key={s.label} className="relative">
                      <div className="text-2xl sm:text-3xl font-bold text-foreground font-display tabular-nums">
                        {s.value}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <s.icon className="w-3 h-3 text-primary/70" />
                        <span className="text-xs text-muted-foreground tracking-wide">{s.label}</span>
                      </div>
                      {i < stats.length - 1 && (
                        <div className="hidden sm:block absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
                      )}
                    </div>
                  ))}
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Profile sidebar — portrait card */}
          <motion.div variants={itemVariants} className="col-span-12 lg:col-span-4">
            <GlassCard className="p-6 sm:p-8 flex flex-col justify-between h-full">
              {/* Subtle accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/20 via-primary-glow to-primary/40 rounded-t-2xl" />

              <div className="relative">
                {/* Portrait + name */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-2 ring-primary/30 shadow-glow mb-4 group relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none z-10" />
                    <img
                      src={portraitImg}
                      alt="Mabior Agau"
                      loading="eager"
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="font-bold text-foreground text-xl tracking-tight">Mabior Agau</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1.5">
                    <MapPin className="w-3 h-3 shrink-0 text-primary/60" /> Juba, South Sudan
                  </div>
                </div>

                {/* Contact info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-lg bg-secondary/40 border border-border/60 px-3 py-2.5 backdrop-blur-sm">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                    </span>
                    <div>
                      <div className="text-xs font-medium text-foreground">Available for engagements</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">Booking Q4 2026</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="mt-6 pt-5 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-medium font-mono tracking-wider">CONNECT</span>
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
                        className="w-9 h-9 grid place-items-center rounded-lg bg-secondary/50 border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
