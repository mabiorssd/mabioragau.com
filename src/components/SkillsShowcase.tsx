
import { motion } from "framer-motion";
import { Shield, Lock, Search, Bug, Eye, Zap, Terminal, Network } from "lucide-react";
import { ModernCard } from "./ModernCard";

const skills = [
  {
    icon: Shield,
    title: "Penetration Testing",
    description: "Comprehensive security assessments to identify vulnerabilities",
    level: 95
  },
  {
    icon: Bug,
    title: "Vulnerability Research",
    description: "Zero-day discovery and exploit development",
    level: 90
  },
  {
    icon: Lock,
    title: "Cryptography",
    description: "Implementation and analysis of cryptographic systems",
    level: 85
  },
  {
    icon: Network,
    title: "Network Security",
    description: "Securing infrastructure and network communications",
    level: 92
  },
  {
    icon: Eye,
    title: "Digital Forensics",
    description: "Investigation and analysis of digital evidence",
    level: 88
  },
  {
    icon: Terminal,
    title: "Red Team Operations",
    description: "Advanced persistent threat simulation",
    level: 87
  },
  {
    icon: Search,
    title: "Threat Hunting",
    description: "Proactive identification of advanced threats",
    level: 90
  },
  {
    icon: Zap,
    title: "Incident Response",
    description: "Rapid containment and remediation of security incidents",
    level: 93
  }
];

export const SkillsShowcase = () => {
  return (
    <section id="skills" className="py-24 px-4 sm:px-6 relative">
      <div className="absolute inset-0 bg-cyber-grid opacity-5"></div>
      
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-black/80 border border-green-500/40 rounded-full backdrop-blur-sm shadow-lg">
            <Shield className="h-5 w-5 text-green-400 animate-pulse" />
            <span className="text-green-400 text-sm font-mono">cat /proc/skills</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping ml-2"></div>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-400 mb-8">
            Core <span className="text-green-300">Expertise</span>
          </h2>
          
          <p className="text-green-300/90 text-xl leading-relaxed max-w-4xl mx-auto">
            Specialized in offensive security, threat analysis, and building robust defense mechanisms 
            against sophisticated cyber attacks.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <ModernCard variant="premium" glow className="h-full text-center">
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 bg-green-500/10 rounded-full border border-green-500/30">
                      <skill.icon className="h-8 w-8 text-green-400" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-green-400 mb-3">
                      {skill.title}
                    </h3>
                    <p className="text-green-300/80 text-sm leading-relaxed">
                      {skill.description}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-green-500 text-sm font-mono">Proficiency</span>
                      <span className="text-green-400 text-sm font-mono">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-black/50 rounded-full h-2 border border-green-500/20">
                      <motion.div
                        className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                      />
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
