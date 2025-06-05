
import { motion } from "framer-motion";
import { Shield, Bug, Lock, Server, Terminal, Code, Search, Zap } from "lucide-react";
import { ModernCard } from "./ModernCard";

const services = [
  { 
    icon: <Shield size={28} />, 
    title: "Advanced Penetration Testing", 
    description: "Comprehensive security assessments using cutting-edge exploitation techniques and custom-built tools to identify vulnerabilities before attackers do.",
    tools: ["Metasploit", "Burp Suite", "Nmap", "Custom Scripts"],
    color: "from-green-400 to-emerald-500",
    highlight: "Advanced"
  },
  { 
    icon: <Bug size={28} />, 
    title: "Zero-Day Research", 
    description: "Discovery and responsible disclosure of previously unknown security vulnerabilities through advanced research methodologies and reverse engineering.",
    tools: ["Fuzzing Tools", "Reverse Engineering", "Exploit Development"],
    color: "from-emerald-400 to-teal-500",
    highlight: "Research"
  },
  { 
    icon: <Lock size={28} />, 
    title: "Red Team Operations", 
    description: "Sophisticated adversarial simulations to test organizational security posture and incident response capabilities against real-world attacks.",
    tools: ["C2 Frameworks", "Social Engineering", "Custom Malware"],
    color: "from-teal-400 to-cyan-500",
    highlight: "Operations"
  },
  { 
    icon: <Server size={28} />, 
    title: "Infrastructure Security", 
    description: "Comprehensive network security assessments and hardening strategies against advanced persistent threats and nation-state level attacks.",
    tools: ["Network Analysis", "IDS/IPS", "Firewall Configuration"],
    color: "from-cyan-400 to-blue-500",
    highlight: "Infrastructure"
  },
  { 
    icon: <Code size={28} />, 
    title: "Secure Code Review", 
    description: "In-depth analysis of application source code to identify security flaws, implementation vulnerabilities, and design weaknesses.",
    tools: ["Static Analysis", "Dynamic Testing", "Code Auditing"],
    color: "from-blue-400 to-indigo-500",
    highlight: "Code"
  },
  { 
    icon: <Search size={28} />, 
    title: "Threat Intelligence", 
    description: "Advanced threat hunting and intelligence gathering to identify emerging attack vectors, threat actors, and indicators of compromise.",
    tools: ["OSINT", "Dark Web Monitoring", "IOC Analysis"],
    color: "from-indigo-400 to-purple-500",
    highlight: "Intelligence"
  }
];

export const ServicesSection = () => {
  return (
    <section id="services" className="py-24 px-4 sm:px-6 relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-cyber-grid bg-cyber-grid opacity-5"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-black/80 border border-green-500/40 rounded-full backdrop-blur-sm shadow-lg">
            <Terminal className="h-5 w-5 text-green-400 animate-pulse" />
            <span className="text-green-400 text-sm font-mono">ls -la /services/</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping ml-2"></div>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-400 mb-8 drop-shadow-[0_0_20px_rgba(0,255,0,0.3)]">
            Security <span className="text-green-300">Operations</span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-green-300/90 text-xl leading-relaxed">
              Comprehensive cybersecurity services designed to protect against advanced threats 
              and strengthen your organization's security posture through cutting-edge methodologies.
            </p>
          </div>
        </motion.div>

        {/* Enhanced Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.8 }}
            >
              <ModernCard variant="premium" glow>
                <div className="space-y-6">
                  {/* Enhanced Icon and Header */}
                  <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${service.color} bg-opacity-20 border border-green-500/30 shadow-lg`}>
                      <div className="text-green-400">
                        {service.icon}
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 text-green-500 text-xs font-mono">
                        <span>[{service.highlight.toLowerCase()}]$</span>
                        <span className="text-green-400">active</span>
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                      <h3 className="text-xl font-bold text-green-400 leading-tight">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* Enhanced Description */}
                  <p className="text-green-300/85 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Enhanced Tools Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-500" />
                      <span className="text-green-500 text-sm font-mono">Technologies:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {service.tools.map((tool, i) => (
                        <span 
                          key={i} 
                          className="text-xs text-green-400 bg-green-500/15 border border-green-500/30 px-3 py-1.5 rounded-full font-mono hover:bg-green-500/25 transition-colors duration-300"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className="pt-4 border-t border-green-500/20">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-500/70 font-mono">Status: Operational</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-green-400 font-mono">24/7</span>
                      </div>
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
