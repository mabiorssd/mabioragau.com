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
    <motion.section id="services" className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div className="bg-black/50 p-6 rounded-lg border border-green-500/20">
          <motion.p className="text-green-400 text-sm mb-4">
            [root@mabior-terminal]# ls -la /services/
          </motion.p>
          <motion.h3 
            className="text-2xl md:text-3xl font-bold text-green-400 mb-6"
            variants={glitchAnimation}
            initial="initial"
            animate="animate"
          >
            &gt;_Security Operations
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="border border-green-500/30 rounded-lg p-4 space-y-2 hover:border-green-400 transition-all bg-black/50"
                whileHover={{ y: -2, borderColor: "#00ff00" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-green-600">[service]$</span>
                  <div className="text-green-400">{service.icon}</div>
                </div>
                <h4 className="text-lg font-semibold text-green-400">{service.title}</h4>
                <p className="text-sm text-green-600">{service.description}</p>
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
        </motion.div>
      </div>
    </motion.section>
  );
};