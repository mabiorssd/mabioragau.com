import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { Crosshair, Shield, Code2, Network, Lock, Bug, Cloud } from "lucide-react";

const DOMAINS = [
  { name: "NETWORK", value: 92 },
  { name: "WEB APP", value: 95 },
  { name: "CRYPTO", value: 78 },
  { name: "CLOUD", value: 84 },
  { name: "BINARY", value: 70 },
  { name: "SOCIAL", value: 88 },
];

const SUITES = [
  {
    name: "Recon Suite",
    icon: Network,
    tools: ["Nmap", "Amass", "Subfinder", "theHarvester", "Shodan"],
  },
  {
    name: "Exploitation Suite",
    icon: Bug,
    tools: ["Metasploit", "Burp Suite Pro", "sqlmap", "Hydra", "Responder"],
  },
  {
    name: "Forensics Suite",
    icon: Shield,
    tools: ["Wireshark", "Volatility", "YARA", "Ghidra", "tcpdump"],
  },
  {
    name: "Cloud & DevSec Suite",
    icon: Cloud,
    tools: ["Prowler", "Trivy", "AWS IAM", "Terraform", "Docker"],
  },
];

const Radar = () => {
  const cx = 200;
  const cy = 200;
  const radius = 150;
  const points = DOMAINS.map((d, i) => {
    const angle = (Math.PI * 2 * i) / DOMAINS.length - Math.PI / 2;
    const r = (d.value / 100) * radius;
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      lx: cx + Math.cos(angle) * (radius + 20),
      ly: cy + Math.sin(angle) * (radius + 20),
      angle,
      name: d.name,
      value: d.value,
    };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-sm mx-auto">
      <defs>
        <radialGradient id="radar-fill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary) / 0.4)" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.05)" />
        </radialGradient>
      </defs>

      {/* Concentric rings */}
      {[0.25, 0.5, 0.75, 1].map((s, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={radius * s}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="0.5"
          strokeDasharray={i === 3 ? "0" : "2 4"}
        />
      ))}

      {/* Spokes */}
      {DOMAINS.map((_, i) => {
        const angle = (Math.PI * 2 * i) / DOMAINS.length - Math.PI / 2;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(angle) * radius}
            y2={cy + Math.sin(angle) * radius}
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />
        );
      })}

      {/* Polygon */}
      <motion.path
        d={path}
        fill="url(#radar-fill)"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transformOrigin: `${cx}px ${cy}px`, filter: "drop-shadow(0 0 8px hsl(var(--primary) / 0.6))" }}
      />

      {/* Vertex dots */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="3"
          fill="hsl(var(--primary))"
          style={{ filter: "drop-shadow(0 0 4px hsl(var(--primary)))" }}
        />
      ))}

      {/* Labels */}
      {points.map((p, i) => (
        <text
          key={i}
          x={p.lx}
          y={p.ly}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fontFamily="var(--font-mono)"
          fill="hsl(var(--muted-foreground))"
          letterSpacing="0.1em"
        >
          {p.name} · {p.value}
        </text>
      ))}

      {/* Center crosshair */}
      <g transform={`translate(${cx} ${cy})`}>
        <circle r="20" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="1" />
        <circle r="4" fill="hsl(var(--primary))" />
        <text y="36" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="hsl(var(--primary))">
          NCA CSIRT
        </text>
        <text y="46" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="hsl(var(--muted-foreground))">
          core
        </text>
      </g>
    </svg>
  );
};

export const ArsenalRadar = () => {
  return (
    <section id="skills" className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="eyebrow">// the_arsenal</span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
            The{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Arsenal
            </span>
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Proficiency mapped across operational domains with the CSIRT core as origin.
            Tactical suites grouped by mission phase.
          </p>
        </motion.div>

        <div className="grid grid-cols-12 gap-4">
          <GlassCard className="col-span-12 lg:col-span-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                Proficiency Radar
              </h3>
              <Crosshair className="w-4 h-4 text-primary" />
            </div>
            <Radar />
          </GlassCard>

          <GlassCard className="col-span-12 lg:col-span-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                Tactical Suites
              </h3>
              <Code2 className="w-4 h-4 text-primary" />
            </div>
            <div className="space-y-4">
              {SUITES.map((s) => (
                <div key={s.name} className="rounded-lg border border-border bg-background/30 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon className="w-3.5 h-3.5 text-primary" />
                    <span className="font-mono text-[11px] uppercase tracking-widest text-primary">
                      {s.name}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.tools.map((t) => (
                      <span key={t} className="tech-pill">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};
