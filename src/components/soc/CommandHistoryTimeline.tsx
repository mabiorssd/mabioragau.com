import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Lock } from "lucide-react";
import { GlassCard } from "./GlassCard";

type Role = {
  cmd: string;
  org: string;
  title: string;
  period: string;
  classified?: boolean;
  bullets: string[];
};

const ROLES: Role[] = [
  {
    cmd: "./role_nca.sh --current",
    org: "National Communication Authority (NCA), South Sudan",
    title: "Penetration Tester · CSIRT Operator",
    period: "2024 — Present",
    classified: true,
    bullets: [
      "Lead authorized red team simulations against national telecom and ISP infrastructure.",
      "Run vulnerability assessments on critical communication backbones and licensed operators.",
      "Coordinate incident response and threat-intel handovers with the CSIRT shift.",
      "Author internal hardening playbooks aligned with NCA regulatory mandates.",
    ],
  },
  {
    cmd: "./role_consult.sh --freelance",
    org: "Independent Engagements",
    title: "Offensive Security Consultant",
    period: "2021 — Present",
    bullets: [
      "Web application and API penetration testing for fintech, NGO and SaaS clients.",
      "Red team adversary emulation against MSP and managed identity environments.",
      "Source-code review and CI/CD pipeline hardening for high-risk repos.",
    ],
  },
  {
    cmd: "./role_research.sh",
    org: "Independent Vulnerability Research",
    title: "Security Researcher",
    period: "2019 — Present",
    bullets: [
      "Coordinated disclosure of memory-safety issues across open-source tooling.",
      "Published technical write-ups on exploitation primitives and defense bypasses.",
      "Contributor to community fuzzing harnesses and detection rule sets.",
    ],
  },
];

export const CommandHistoryTimeline = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="experience" className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="eyebrow">// command_history.buffer</span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
            Command{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              History
            </span>
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Reverse-chronological execution log. Each role is an executed command — expand
            for operational details.
          </p>
        </motion.div>

        <GlassCard className="p-0 overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/40">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-warning/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-primary/70" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              ~/mabior/career — zsh
            </span>
            <span className="font-mono text-[10px] text-primary">history</span>
          </div>

          <div className="p-4 sm:p-6 space-y-2 font-mono text-sm">
            {ROLES.map((r, i) => {
              const expanded = open === i;
              return (
                <div
                  key={r.cmd}
                  className="border border-border rounded-lg overflow-hidden bg-background/40"
                >
                  <button
                    onClick={() => setOpen(expanded ? null : i)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-primary/5 transition-colors text-left"
                  >
                    <span className="text-primary">$</span>
                    <span className="text-foreground font-semibold flex-1 truncate">
                      {r.cmd}
                    </span>
                    {r.classified && (
                      <span className="top-secret-badge hidden sm:inline-flex">
                        <Lock className="w-2.5 h-2.5" /> NCA · CLASSIFIED
                      </span>
                    )}
                    <ChevronRight
                      className={`w-4 h-4 text-muted-foreground transition-transform ${
                        expanded ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-border"
                      >
                        <div className="px-4 py-4 space-y-3 bg-secondary/20">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span className="text-foreground font-display text-base font-semibold">
                              {r.title}
                            </span>
                            <span className="text-primary text-xs">
                              @ {r.org}
                            </span>
                            <span className="ml-auto text-muted-foreground text-[11px]">
                              {r.period}
                            </span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-muted-foreground">
                            {r.bullets.map((b, j) => (
                              <li key={j} className="flex gap-2">
                                <span className="text-primary mt-0.5">▸</span>
                                <span className={r.classified && j < 2 ? "" : ""}>
                                  {b}
                                </span>
                              </li>
                            ))}
                          </ul>
                          {r.classified && (
                            <div className="mt-2 text-[10px] text-destructive font-mono uppercase tracking-widest">
                              [TOP SECRET: AUTHORIZED ACCESS ONLY] · further detail redacted
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            <div className="flex items-center gap-2 px-3 pt-2 text-muted-foreground text-xs">
              <span className="text-primary">$</span>
              <span className="opacity-70">_</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};
