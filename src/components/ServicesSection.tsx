import { motion } from "framer-motion";
import { Shield, Bug, Lock, Server, Code, Search } from "lucide-react";
import { GlassCard } from "./soc/GlassCard";

const services = [
  { icon: Shield, title: "Penetration Testing", description: "Black, grey, and white-box assessments against web apps, APIs, networks, and cloud workloads.", tools: ["Burp", "Nmap", "Metasploit"] },
  { icon: Bug, title: "Vulnerability Assessment", description: "Continuous scanning, triage, and prioritized remediation roadmaps mapped to your risk profile.", tools: ["Nessus", "OpenVAS", "Nuclei"] },
  { icon: Lock, title: "Web App Security", description: "Deep manual testing for OWASP Top 10, business logic flaws, and authentication weaknesses.", tools: ["Burp", "ZAP", "ffuf"] },
  { icon: Server, title: "Network Security", description: "Architecture review, segmentation testing, and lateral-movement simulation across hybrid environments.", tools: ["Wireshark", "tcpdump", "Responder"] },
  { icon: Code, title: "Security Training", description: "Hands-on labs and workshops for engineers and IT teams. Secure SDLC, threat modeling, IR drills.", tools: ["Workshops", "Labs", "CTF"] },
  { icon: Search, title: "Security Consulting", description: "Strategy, compliance alignment, and control implementation tailored to organizational maturity.", tools: ["Risk", "Policy", "GRC"] },
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
          <span className="eyebrow">// service_catalog</span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight">
            Security <span className="bg-gradient-primary bg-clip-text text-transparent">operations</span> on demand
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Modular engagements designed to slot into your existing security program — from
            single-target assessments to ongoing offensive operations.
          </p>
        </motion.div>

        <div className="grid grid-cols-12 gap-4">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="col-span-12 sm:col-span-6 lg:col-span-4"
            >
              <GlassCard className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/30 grid place-items-center">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="status-dot" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground flex-1">{s.description}</p>
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
