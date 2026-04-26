import { motion } from "framer-motion";
import { Lock, Eye, Shield, Code, ArrowUpRight } from "lucide-react";
import { GlassCard } from "./soc/GlassCard";

const projects = [
  {
    title: "Advanced Vulnerability Scanner",
    description: "ML-assisted vulnerability assessment platform with zero-day discovery heuristics and prioritized triage.",
    tech: ["Python", "TensorFlow", "Nmap", "Custom Exploits"],
    status: "Active",
    icon: Shield,
  },
  {
    title: "Red Team C2 Framework",
    description: "Modular C2 with encrypted comms, stealthy beacons, and pluggable post-exploitation modules.",
    tech: ["Rust", "Assembly", "AES-GCM", "TLS"],
    status: "Private",
    icon: Lock,
  },
  {
    title: "Zero-Day Research Platform",
    description: "Hybrid fuzzing + symbolic execution pipeline for enterprise binary analysis at scale.",
    tech: ["Go", "AFL++", "angr"],
    status: "Restricted",
    icon: Code,
  },
  {
    title: "APT Detection System",
    description: "Behavioral threat detection using deep learning over EDR telemetry and YARA correlation.",
    tech: ["Python", "PyTorch", "YARA"],
    status: "Confidential",
    icon: Eye,
  },
];

const statusStyle: Record<string, string> = {
  Active: "bg-primary/15 text-primary border-primary/30",
  Private: "bg-accent/15 text-accent border-accent/30",
  Restricted: "bg-warning/15 text-warning border-warning/30",
  Confidential: "bg-destructive/15 text-destructive border-destructive/30",
};

export const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="eyebrow">// active_operations</span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight">
            Selected <span className="bg-gradient-primary bg-clip-text text-transparent">operations</span>
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            A redacted look at research, tooling, and platforms developed across offensive
            security engagements.
          </p>
        </motion.div>

        <div className="grid grid-cols-12 gap-4">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="col-span-12 md:col-span-6"
            >
              <GlassCard className="h-full group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/30 grid place-items-center">
                      <p.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground leading-tight">{p.title}</h3>
                      <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">project // {String(i + 1).padStart(3, "0")}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-md border ${statusStyle[p.status]}`}>
                    {p.status}
                  </span>
                </div>

                <p className="mt-4 text-sm text-muted-foreground">{p.description}</p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span key={t} className="tech-pill">{t}</span>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] font-mono text-muted-foreground">Authorized inquiries only</span>
                  <ArrowUpRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
