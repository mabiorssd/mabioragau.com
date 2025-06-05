
import { motion } from "framer-motion";
import { Shield, Bug, Lock, Server, Terminal, Code, Search, Zap } from "lucide-react";
import { ModernCard } from "./ModernCard";

const services = [
  { 
    icon: <Shield size={24} />, 
    title: "Advanced Penetration Testing", 
    description: "Comprehensive security assessments using cutting-edge exploitation techniques and custom-built tools to identify vulnerabilities.",
    tools: ["Metasploit", "Burp Suite", "Nmap", "Custom Scripts"],
    color: "from-green-400 to-emerald-500"
  },
  { 
    icon: <Bug size={24} />, 
    title: "Zero-Day Research", 
    description: "Discovery and responsible disclosure of previously unknown security vulnerabilities through advanced research methodologies.",
    tools: ["Fuzzing Tools", "Reverse Engineering", "Exploit Development"],
    color: "from-emerald-400 to-teal-500"
  },
  { 
    icon: <Lock size={24} />, 
    title: "Red Team Operations", 
    description: "Sophisticated adversarial simulations to test organizational security posture and incident response capabilities.",
    tools: ["C2 Frameworks", "Social Engineering", "Custom Malware"],
    color: "from-teal-400 to-cyan-500"
  },
  { 
    icon: <Server size={24} />, 
    title: "Infrastructure Security", 
    description: "Comprehensive network security assessments and hardening against advanced persistent threats and nation-state actors.",
    tools: ["Network Analysis", "IDS/IPS", "Firewall Configuration"],
    color: "from-cyan-400 to-blue-500"
  },
  { 
    icon: <Code size={24} />, 
    title: "Secure Code Review", 
    description: "In-depth analysis of application source code to identify security flaws and implementation vulnerabilities.",
    tools: ["Static Analysis", "Dynamic Testing", "Code Auditing"],
    color: "from-blue-400 to-indigo-500"
  },
  { 
    icon: <Search size={24} />, 
    title: "Threat Intelligence", 
    description: "Advanced threat hunting and intelligence gathering to identify emerging attack vectors and threat actors.",
    tools: ["OSINT", "Dark Web Monitoring", "IOC Analysis"],
    color: "from-indigo-400 to-purple-500"
  }
];

export const ServicesSection = () => {
  return (
    <section id="services" className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-black/60 border border-green-500/30 rounded-full backdrop-blur-sm">
            <Terminal className="h-4 w-4 text-green-400" />
            <span className="text-green-400 text-sm font-mono">ls -la /services/</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-400 mb-6">
            Security <span className="text-green-300">Operations</span>
          </h2>
          <p className="text-green-300/80 text-lg max-w-3xl mx-auto leading-relaxed">
            Comprehensive cybersecurity services designed to protect against advanced threats 
            and strengthen your organization's security posture.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <ModernCard className="h-full" glow>
                <div className="space-y-4">
                  {/* Icon and Header */}
                  <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${service.color} bg-opacity-20 border border-green-500/30`}>
                      <div className="text-green-400">
                        {service.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-green-400 mb-2">
                        {service.title}
                      </h3>
                      <div className="flex items-center gap-2 text-green-600 text-sm font-mono">
                        <span>[service]$</span>
                        <span className="text-green-500">active</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-green-300/80 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  {/* Tools */}
                  <div className="space-y-2">
                    <div className="text-green-500 text-xs font-mono">Technologies:</div>
                    <div className="flex flex-wrap gap-2">
                      {service.tools.map((tool, i) => (
                        <span 
                          key={i} 
                          className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full font-mono"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ModernCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
