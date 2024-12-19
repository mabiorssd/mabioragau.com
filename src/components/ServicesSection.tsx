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
    icon: <Shield size={20} />, 
    title: "Advanced Penetration Testing", 
    description: "Conducting sophisticated security assessments using cutting-edge exploitation techniques and custom-built tools.",
    tools: ["Metasploit", "Burp Suite", "Nmap", "Custom Scripts"]
  },
  { 
    icon: <Bug size={20} />, 
    title: "Zero-Day Research", 
    description: "Identifying and responsibly disclosing previously unknown security vulnerabilities in systems and applications.",
    tools: ["Fuzzing Tools", "Reverse Engineering", "Exploit Development"]
  },
  { 
    icon: <Lock size={20} />, 
    title: "Red Team Operations", 
    description: "Simulating real-world cyber attacks to test organization's detection and response capabilities.",
    tools: ["C2 Frameworks", "Social Engineering", "Custom Malware"]
  },
  { 
    icon: <Server size={20} />, 
    title: "Infrastructure Security", 
    description: "Hardening network infrastructure against sophisticated cyber threats and APT groups.",
    tools: ["Network Analysis", "IDS/IPS", "Firewall Configuration"]
  }
];

export const ServicesSection = () => {
  return (
    <motion.section id="services" className="py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.h3 
          className="text-2xl sm:text-3xl font-bold text-green-400 mb-6"
          variants={glitchAnimation}
          initial="initial"
          animate="animate"
        >
          &gt;_Security Operations
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="border border-green-500/30 rounded-xl p-4 sm:p-5 space-y-3 hover:border-green-400 transition-all bg-black/50"
              whileHover={{ y: -3, borderColor: "#00ff00" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-green-400">{service.icon}</div>
              <h4 className="text-lg sm:text-xl font-semibold text-green-400">{service.title}</h4>
              <p className="text-sm sm:text-base text-green-600">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.tools.map((tool, i) => (
                  <span key={i} className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
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