
import { motion } from "framer-motion";
import { Terminal, Lock, Eye, Shield, Code, Zap } from "lucide-react";
import { ModernCard } from "./ModernCard";
import { Badge } from "./ui/badge";

const projects = [
  {
    title: "Advanced Vulnerability Scanner",
    description: "AI-powered vulnerability assessment platform utilizing machine learning algorithms for intelligent threat detection and zero-day discovery capabilities.",
    tech: ["Python", "TensorFlow", "Nmap API", "Custom Exploits"],
    status: "Classified",
    icon: <Shield size={20} />,
    type: "Research Project"
  },
  {
    title: "Red Team C2 Framework",
    description: "Next-generation command and control infrastructure with advanced evasion techniques, encrypted communications, and modular payload delivery.",
    tech: ["Rust", "Assembly", "Encryption", "Network Protocols"],
    status: "Private",
    icon: <Lock size={20} />,
    type: "Operational Tool"
  },
  {
    title: "Zero-Day Research Platform",
    description: "Automated vulnerability discovery system combining fuzzing, static analysis, and dynamic testing for enterprise software assessment.",
    tech: ["Go", "Machine Learning", "Binary Analysis"],
    status: "Restricted",
    icon: <Code size={20} />,
    type: "Research Platform"
  },
  {
    title: "APT Detection System",
    description: "Machine learning-powered threat detection system for identifying and analyzing Advanced Persistent Threat activities in real-time.",
    tech: ["Python", "Deep Learning", "YARA Rules"],
    status: "Confidential",
    icon: <Eye size={20} />,
    type: "Defense System"
  }
];

const statusColors = {
  "Classified": "destructive",
  "Private": "secondary", 
  "Restricted": "outline",
  "Confidential": "cyber"
} as const;

export const ProjectsSection = () => {
  return (
    <section id="projects" className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-black/60 border border-red-500/30 rounded-full backdrop-blur-sm">
            <Lock className="h-4 w-4 text-red-400" />
            <span className="text-red-400 text-sm font-mono">ls -la /projects/classified/</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-400 mb-6">
            Classified <span className="text-red-400">Projects</span>
          </h2>
          <p className="text-green-300/80 text-lg max-w-3xl mx-auto leading-relaxed">
            Advanced security research and development projects. Access restricted to authorized personnel only.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <ModernCard className="h-full" glow>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                        <div className="text-red-400">
                          {project.icon}
                        </div>
                      </div>
                      <div>
                        <div className="text-green-600 text-xs font-mono mb-1">
                          [project]$ {project.type.toLowerCase().replace(' ', '_')}
                        </div>
                        <h3 className="text-lg font-semibold text-green-400">
                          {project.title}
                        </h3>
                      </div>
                    </div>
                    <Badge variant={statusColors[project.status as keyof typeof statusColors]} className="shrink-0">
                      {project.status}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-green-300/80 text-sm leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="space-y-2">
                    <div className="text-green-500 text-xs font-mono">Tech Stack:</div>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, i) => (
                        <span 
                          key={i} 
                          className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Access Level */}
                  <div className="pt-2 border-t border-red-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-red-400 text-xs font-mono">
                        Access Level: {project.status}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-red-500 text-xs">Restricted</span>
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
