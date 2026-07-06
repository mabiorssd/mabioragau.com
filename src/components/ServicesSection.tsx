import { motion } from "framer-motion";
import { Shield, Bug, Lock, Server, Code, Search } from "lucide-react";
import { GlassCard } from "./soc/GlassCard";

const services = [
  {
    icon: Shield,
    title: "Penetration Testing",
    description: "Black, grey, and white-box assessments for web apps, APIs, network infrastructure, and cloud environments.",
    tools: ["Burp Suite", "Nmap", "Metasploit"],
  },
  {
    icon: Bug,
    title: "Vulnerability Assessment",
    description: "Continuous scanning, triage, and prioritized remediation aligned to your risk profile.",
    tools: ["Nessus", "OpenVAS", "Nuclei"],
  },
  {
    icon: Lock,
    title: "Web Application Security",
    description: "Manual testing for OWASP Top 10, business logic flaws, and authentication weaknesses.",
    tools: ["Burp Suite", "ZAP", "ffuf"],
  },
  {
    icon: Server,
    title: "Network Security Review",
    description: "Architecture review, segmentation testing, and lateral-movement simulation across hybrid environments.",
    tools: ["Wireshark", "tcpdump", "Responder"],
  },
  {
    icon: Code,
    title: "Security Training",
    description: "Hands-on workshops covering secure SDLC practices, threat modeling, and incident response.",
    tools: ["Workshops", "Labs", "Simulations"],
  },
  {
    icon: Search,
    title: "Security Consulting",
    description: "Strategic advisory, compliance alignment, and program development tailored to your organization.",
    tools: ["Risk Assessment", "Policy", "GRC"],
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="py-16 sm:py-24 px-4 sm:px-6">
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
          <p className="mt-2 max-w-2xl text-muted-foreground text-sm">
            Modular engagements — from single-target assessments to ongoing operations.
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
              <GlassCard className="h-full flex flex-col p-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center mb-3">
                  <s.icon className="w-5 h-5 text-primary" />
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
