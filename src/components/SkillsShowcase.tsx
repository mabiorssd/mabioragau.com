import { motion } from "framer-motion";
import { Shield, Lock, Search, Terminal, Network } from "lucide-react";
import { GlassCard } from "./soc/GlassCard";

const expertise = [
  { icon: Shield, title: "Penetration Testing", level: 92 },
  { icon: Lock, title: "Web App Security", level: 90 },
  { icon: Search, title: "OSINT & Recon", level: 88 },
  { icon: Network, title: "Network Security", level: 85 },
];

const toolCategories = [
  {
    name: "Recon",
    tools: ["Nmap", "Amass", "Subfinder", "theHarvester", "Shodan"],
  },
  {
    name: "Exploitation",
    tools: ["Metasploit", "Burp Suite", "sqlmap", "Hydra", "Responder"],
  },
  {
    name: "Analysis",
    tools: ["Wireshark", "Ghidra", "Volatility", "YARA", "tcpdump"],
  },
  {
    name: "Cloud & DevSec",
    tools: ["AWS IAM", "Prowler", "Trivy", "Terraform", "Docker"],
  },
];

const Gauge = ({ value, label, Icon }: { value: number; label: string; Icon: typeof Shield }) => {
  const r = 38;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-20 h-20 sm:w-24 sm:h-24">
        <svg className="w-20 h-20 sm:w-24 sm:h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} stroke="hsl(var(--secondary))" strokeWidth="6" fill="none" />
          <motion.circle
            cx="50" cy="50" r={r}
            stroke="hsl(var(--primary))"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 6px hsl(var(--primary) / 0.6))" }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center flex-col">
          <Icon className="w-4 h-4 text-primary mb-0.5" />
          <span className="text-lg font-bold text-foreground leading-none">{value}</span>
        </div>
      </div>
      <div className="mt-2 text-xs font-medium text-foreground">{label}</div>
    </div>
  );
};

export const SkillsShowcase = () => {
  return (
    <section id="skills" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="eyebrow">// tactical_proficiency</span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight">
            Tactical <span className="bg-gradient-primary bg-clip-text text-transparent">proficiency</span>
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Core proficiencies measured against industry baselines, plus the operational tooling
            stack used in active engagements.
          </p>
        </motion.div>

        <div className="grid grid-cols-12 gap-4">
          {/* Gauges */}
          <GlassCard className="col-span-12 lg:col-span-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Core Expertise</h3>
              <span className="text-[10px] font-mono text-primary">live</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-6">
              {expertise.map((e) => (
                <Gauge key={e.title} value={e.level} label={e.title} Icon={e.icon} />
              ))}
            </div>
          </GlassCard>

          {/* Categorized tool cloud */}
          <GlassCard className="col-span-12 lg:col-span-7">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Tooling Inventory</h3>
              <Terminal className="w-4 h-4 text-primary" />
            </div>
            <div className="space-y-5">
              {toolCategories.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[11px] text-primary uppercase tracking-widest">{cat.name}</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.tools.map((t) => (
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
