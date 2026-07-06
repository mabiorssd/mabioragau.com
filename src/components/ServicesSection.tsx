import { motion } from "framer-motion";
import { Shield, Bug, Lock, Server, Code, Search, ArrowRight } from "lucide-react";
import { GlassCard } from "./soc/GlassCard";

const services = [
  {
    icon: Shield,
    title: "Penetration Testing",
    description: "Black, grey, and white-box assessments against web applications, APIs, network infrastructure, and cloud environments. Methodical testing aligned with industry standards.",
    tools: ["Burp Suite", "Nmap", "Metasploit"],
  },
  {
    icon: Bug,
    title: "Vulnerability Assessment",
    description: "Continuous scanning, triage, and prioritized remediation roadmaps mapped to your organization's risk profile and regulatory requirements.",
    tools: ["Nessus", "OpenVAS", "Nuclei"],
  },
  {
    icon: Lock,
    title: "Web Application Security",
    description: "Deep manual testing for OWASP Top 10 vulnerabilities, business logic flaws, authentication weaknesses, and authorization bypasses.",
    tools: ["Burp Suite", "ZAP", "ffuf"],
  },
  {
    icon: Server,
    title: "Network Security Review",
    description: "Architecture review, segmentation testing, and lateral-movement simulation across hybrid and multi-cloud network environments.",
    tools: ["Wireshark", "tcpdump", "Responder"],
  },
  {
    icon: Code,
    title: "Security Training",
    description: "Hands-on workshops for engineering and IT teams covering secure SDLC practices, threat modeling, and incident response drills.",
    tools: ["Workshops", "Labs", "Simulations"],
  },
  {
    icon: Search,
    title: "Security Consulting",
    description: "Strategic advisory, compliance alignment, and security program development tailored to organizational maturity and threat landscape.",
    tools: ["Risk Assessment", "Policy", "GRC"],
  },
];

const iconBgColors = [
  "bg-blue-500/10 border-blue-500/20",
  "bg-emerald-500/10 border-emerald-500/20",
  "bg-amber-500/10 border-amber-500/20",
  "bg-violet-500/10 border-violet-500/20",
  "bg-rose-500/10 border-rose-500/20",
  "bg-cyan-500/10 border-cyan-500/20",
];

const iconColors = [
  "text-blue-500",
  "text-emerald-500",
  "text-amber-500",
  "text-violet-500",
  "text-rose-500",
  "text-cyan-500",
];

export const ServicesSection = () => {
  return (
    <section id="services" className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
            Services &amp;{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Capabilities
            </span>
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Modular security engagements designed to integrate with your existing program —
            from single-target assessments to ongoing offensive operations.
          </p>
        </motion.div>

        <div className="grid grid-cols-12 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="col-span-12 sm:col-span-6 lg:col-span-4"
            >
              <GlassCard className="h-full flex flex-col group">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-xl ${iconBgColors[i]} grid place-items-center`}>
                    <s.icon className={`w-5 h-5 ${iconColors[i]}`} />
                  </div>
                  <ArrowRight className={`w-4 h-4 ${iconColors[i]} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-1`} />
                </div>
                <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground flex-1 leading-relaxed">
                  {s.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {s.tools.map((t) => (
                    <span key={t} className="tech-pill">{t}</span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
