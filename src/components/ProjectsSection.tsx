import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Lock, Eye, Shield, Code, ArrowUpRight, Github, ExternalLink, X } from "lucide-react";
import { GlassCard } from "./soc/GlassCard";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { ScrambleText } from "./soc/ScrambleText";
import { setCopilotContext } from "@/lib/copilotContext";

type Project = {
  title: string;
  description: string;
  tech: string[];
  status: "Active" | "Private" | "Restricted" | "Confidential";
  icon: typeof Shield;
  problem: string;
  solution: string;
  outcome: string;
  github?: string;
};

const projects: Project[] = [
  {
    title: "Advanced Vulnerability Scanner",
    description: "ML-assisted vulnerability assessment platform with zero-day discovery heuristics and prioritized triage.",
    tech: ["Python", "TensorFlow", "Nmap", "Custom Exploits"],
    status: "Active",
    icon: Shield,
    problem: "Enterprise asset inventories outpace human triage. Existing scanners produce noisy reports with low signal-to-noise, causing critical findings to be missed.",
    solution: "Built a hybrid scanner that fuses Nmap fingerprinting with a TensorFlow classifier trained on labeled CVE patterns, then ranks findings by exploitability and business impact.",
    outcome: "Reduced false positives by ~62% in pilot deployments and surfaced 3 previously-unreported issues during authorized engagements.",
    github: "https://github.com/mabiorssd/",
  },
  {
    title: "Red Team C2 Framework",
    description: "Modular C2 with encrypted comms, stealthy beacons, and pluggable post-exploitation modules.",
    tech: ["Rust", "Assembly", "AES-GCM", "TLS"],
    status: "Private",
    icon: Lock,
    problem: "Off-the-shelf C2 frameworks are heavily fingerprinted by EDRs, blunting realistic adversary simulation.",
    solution: "Engineered a Rust-based modular C2 with AES-GCM transport, jittered beaconing, and hot-loadable post-exploitation modules.",
    outcome: "Sustained operator dwell time across multiple authorized red team exercises against mature blue teams.",
  },
  {
    title: "Zero-Day Research Platform",
    description: "Hybrid fuzzing + symbolic execution pipeline for enterprise binary analysis at scale.",
    tech: ["Go", "AFL++", "angr"],
    status: "Restricted",
    icon: Code,
    problem: "Manual binary analysis does not scale across the dozens of binaries shipping inside a single enterprise stack.",
    solution: "Designed a Go-based orchestration layer that schedules AFL++ fuzzing jobs and pivots to angr-driven symbolic execution on interesting paths.",
    outcome: "Discovered and responsibly disclosed multiple memory-safety issues, contributing to upstream patches.",
  },
  {
    title: "APT Detection System",
    description: "Behavioral threat detection using deep learning over EDR telemetry and YARA correlation.",
    tech: ["Python", "PyTorch", "YARA"],
    status: "Confidential",
    icon: Eye,
    problem: "Signature-based detection misses living-off-the-land techniques used by advanced persistent threats.",
    solution: "Trained a sequence model on EDR process-tree telemetry, correlated with YARA matches and network anomalies for high-confidence alerts.",
    outcome: "Detected simulated APT chains earlier in the kill chain during purple team validation.",
  },
];

const statusStyle: Record<Project["status"], string> = {
  Active: "bg-primary/15 text-primary border-primary/30",
  Private: "bg-accent/15 text-accent border-accent/30",
  Restricted: "bg-warning/15 text-warning border-warning/30",
  Confidential: "bg-destructive/15 text-destructive border-destructive/30",
};

export const ProjectsSection = () => {
  const [active, setActive] = useState<Project | null>(null);

  useEffect(() => {
    if (active) {
      setCopilotContext({
        kind: "project",
        title: active.title,
        body: `${active.description}\n\nProblem: ${active.problem}\n\nSolution: ${active.solution}\n\nOutcome: ${active.outcome}\n\nTech: ${active.tech.join(", ")}`,
      });
    } else {
      setCopilotContext(null);
    }
  }, [active]);

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
          <span className="eyebrow">// deployment_history</span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight">
            Deployment <span className="bg-gradient-primary bg-clip-text text-transparent">history</span>
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            A redacted look at research, tooling, and platforms developed across offensive security engagements.
            Click a card for the full case study.
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
              <button
                type="button"
                onClick={() => setActive(p)}
                className="text-left w-full h-full"
                aria-label={`Open case study: ${p.title}`}
              >
                <GlassCard className="h-full group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/30 grid place-items-center">
                        <p.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground leading-tight">{p.title}</h3>
                        <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                          deployment // {String(i + 1).padStart(3, "0")}
                        </span>
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
                    <span className="text-[11px] font-mono text-muted-foreground">View case study</span>
                    <ArrowUpRight className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                  </div>
                </GlassCard>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Case study side-drawer */}
      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl glass-panel border-l border-primary/20 p-0 overflow-y-auto"
        >
          {active && (
            <div className="p-6 sm:p-8">
              <SheetHeader className="text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-md border ${statusStyle[active.status]}`}>
                    {active.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 grid place-items-center">
                    <active.icon className="w-6 h-6 text-primary" />
                  </div>
                  <SheetTitle className="text-2xl font-extrabold text-foreground">{active.title}</SheetTitle>
                </div>
                <SheetDescription className="text-muted-foreground mt-2">
                  {active.description}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {active.tech.map((t) => (
                  <span key={t} className="tech-pill">{t}</span>
                ))}
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <div className="eyebrow">// problem</div>
                  <p className="mt-2 text-sm text-foreground/90 leading-relaxed">{active.problem}</p>
                </div>
                <div>
                  <div className="eyebrow">// solution</div>
                  <p className="mt-2 text-sm text-foreground/90 leading-relaxed">{active.solution}</p>
                </div>
                <div>
                  <div className="eyebrow">// outcome</div>
                  <p className="mt-2 text-sm text-foreground/90 leading-relaxed">{active.outcome}</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-3">
                {active.github && (
                  <a
                    href={active.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-glow transition-colors shadow-glow"
                  >
                    <Github className="w-4 h-4" /> View on GitHub
                  </a>
                )}
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); setActive(null); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border text-foreground font-semibold text-sm hover:border-primary/40 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" /> Discuss Engagement
                </a>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
};
