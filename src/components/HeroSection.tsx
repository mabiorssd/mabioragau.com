import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Twitter, BadgeCheck, MapPin, Activity, ShieldCheck, Radar } from "lucide-react";
import { GlassCard } from "./soc/GlassCard";

interface HeroSectionProps {
  text: string;
  showCursor: boolean;
}

const stats = [
  { label: "Engagements", value: "120+", icon: ShieldCheck },
  { label: "CVEs disclosed", value: "14", icon: Radar },
  { label: "Years in field", value: "6", icon: Activity },
];

export const HeroSection = ({ text, showCursor }: HeroSectionProps) => {
  return (
    <section id="about" className="relative pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-4">
          {/* Hero identity */}
          <GlassCard className="col-span-12 lg:col-span-8 p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary">
              <span className="status-dot" />
              SECURE CHANNEL
            </div>

            <span className="eyebrow mb-6">// security_operator.profile</span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
              <span className="text-foreground">MABIOR</span>{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">AGAU</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-muted-foreground font-mono">
              {text}
              {showCursor && <span className="text-primary">▌</span>}
            </p>

            <p className="mt-6 max-w-2xl text-muted-foreground text-base sm:text-lg leading-relaxed">
              Offensive security specialist building real-world resilience for organizations
              under modern threat. Penetration testing, red team simulation, and security
              engineering — executed with precision.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-glow transition-colors shadow-glow"
              >
                Engage Now
              </a>
              <a
                href="#projects"
                onClick={(e) => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-foreground font-semibold text-sm hover:bg-secondary/70 transition-colors border border-border"
              >
                View Operations
              </a>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-secondary/40 p-3">
                  <s.icon className="w-4 h-4 text-primary mb-2" />
                  <div className="text-xl font-bold text-foreground">{s.value}</div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Verified profile */}
          <GlassCard className="col-span-12 lg:col-span-4 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="eyebrow">verified_profile</span>
              <BadgeCheck className="w-5 h-5 text-accent" />
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary grid place-items-center text-2xl font-extrabold text-primary-foreground shadow-glow">
                  M
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background grid place-items-center">
                  <BadgeCheck className="w-4 h-4 text-accent" />
                </div>
              </div>
              <div>
                <div className="font-bold text-foreground">Mabior Agau</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Juba, South Sudan
                </div>
              </div>
            </div>

            {/* Available for hire */}
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5">
              <span className="status-dot" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground">Available for hire</div>
                <div className="text-[11px] text-muted-foreground">Booking Q2 engagements</div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="rounded-lg bg-secondary/50 border border-border p-2.5">
                <div className="text-muted-foreground">Clearance</div>
                <div className="text-foreground font-semibold mt-0.5">TIER‑3</div>
              </div>
              <div className="rounded-lg bg-secondary/50 border border-border p-2.5">
                <div className="text-muted-foreground">Response</div>
                <div className="text-foreground font-semibold mt-0.5">&lt; 24h</div>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-mono">/connect</span>
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
                    className="w-8 h-8 grid place-items-center rounded-lg bg-secondary border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};
