import { motion } from "framer-motion";
import { Shield, Bug, Lock, Server } from "lucide-react";

const glitchAnimation = {
  initial: { x: 0 },
  animate: {
    x: [-2, 2, -2, 0],
    transition: {
      duration: 0.2,
      repeat: Infinity,
      repeatType: "loop" as const
    }
  }
};

const services = [
  { 
    icon: <Shield size={24} />, 
    title: "Advanced Penetration Testing", 
    description: "Conducting sophisticated security assessments using cutting-edge exploitation techniques and custom-built tools.",
    tools: ["Metasploit", "Burp Suite", "Nmap", "Custom Scripts"]
  },
  { 
    icon: <Bug size={24} />, 
    title: "Zero-Day Research", 
    description: "Identifying and responsibly disclosing previously unknown security vulnerabilities in systems and applications.",
    tools: ["Fuzzing Tools", "Reverse Engineering", "Exploit Development"]
  },
  { 
    icon: <Lock size={24} />, 
    title: "Red Team Operations", 
    description: "Simulating real-world cyber attacks to test organization's detection and response capabilities.",
    tools: ["C2 Frameworks", "Social Engineering", "Custom Malware"]
  },
  { 
    icon: <Server size={24} />, 
    title: "Infrastructure Security", 
    description: "Hardening network infrastructure against sophisticated cyber threats and APT groups.",
    tools: ["Network Analysis", "IDS/IPS", "Firewall Configuration"]
  }
];

export const ServicesSection = () => {
  return (
    <motion.section id="services" className="min-h-screen px-6 py-20">
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.h3 
          className="text-2xl md:text-3xl font-bold text-green-400"
          variants={glitchAnimation}
          initial="initial"
          animate="animate"
        >
          &gt;_Security Operations
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="border border-green-500/30 rounded-xl p-6 space-y-4 hover:border-green-400 transition-all bg-black/50"
              whileHover={{ y: -5, borderColor: "#00ff00" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-green-400">{service.icon}</div>
              <h4 className="text-xl font-semibold text-green-400">{service.title}</h4>
              <p className="text-green-600">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.tools.map((tool, i) => (
                  <span key={i} className="text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
