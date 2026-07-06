import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calendar, Building2, Briefcase } from "lucide-react";
import { GlassCard } from "./GlassCard";

type Role = {
  id: string;
  org: string;
  title: string;
  period: string;
  bullets: string[];
};

const ROLES: Role[] = [
  {
    id: "nca",
    org: "National Communication Authority (NCA), South Sudan",
    title: "Penetration Tester — CSIRT Operator",
    period: "2024 — Present",
    bullets: [
      "Lead authorized red team simulations against national telecom and ISP infrastructure.",
      "Run vulnerability assessments on critical communication backbones and licensed operators.",
      "Coordinate incident response and threat-intel handovers with the CSIRT shift.",
      "Author internal hardening playbooks aligned with NCA regulatory mandates.",
    ],
  },
  {
    id: "consult",
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
    id: "research",
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

const ROLE_ICONS: Record<string, React.ReactNode> = {
  nca: <Building2 className="w-3.5 h-3.5" />,
  consult: <Briefcase className="w-3.5 h-3.5" />,
  research: <Calendar className="w-3.5 h-3.5" />,
};

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
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
            Professional{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Cybersecurity roles across government, consulting, and independent research.
            Each position opened for details and key accomplishments.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden sm:block" />

          <div className="space-y-4">
            {ROLES.map((r, i) => {
              const expanded = open === i;
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative pl-0 sm:pl-14"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 top-6 w-3 h-3 rounded-full bg-primary border-2 border-background hidden sm:block" />

                  <GlassCard className={`overflow-hidden transition-shadow duration-300 ${expanded ? "shadow-lg shadow-primary/5" : ""}`}>
                    <button
                      onClick={() => setOpen(expanded ? null : i)}
                      className="w-full flex items-center gap-4 px-6 py-5 hover:bg-secondary/30 transition-colors text-left"
                    >
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center flex-shrink-0">
                        {ROLE_ICONS[r.id]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="font-semibold text-foreground text-sm sm:text-base">
                            {r.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            @ {r.org}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground/70 mt-0.5 font-medium">
                          {r.period}
                        </div>
                      </div>

                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                          expanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2 border-t border-border">
                            <ul className="space-y-2.5 mt-3">
                              {r.bullets.map((b, j) => (
                                <li key={j} className="flex gap-3 text-sm text-muted-foreground">
                                  <span className="text-primary/60 mt-0.5 flex-shrink-0">•</span>
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
