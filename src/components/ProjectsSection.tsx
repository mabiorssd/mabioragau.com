
import { motion } from "framer-motion";
import { Terminal, Lock, Eye, Shield, Code, Zap, AlertTriangle } from "lucide-react";
import { ModernCard } from "./ModernCard";
import { Badge } from "./ui/badge";

const projects = [
  {
    title: "Advanced Vulnerability Scanner",
    description: "Advanced vulnerability assessment platform utilizing machine learning algorithms for intelligent threat detection and zero-day discovery capabilities.",
    tech: ["Python", "TensorFlow", "Nmap API", "Custom Exploits"],
    status: "Classified",
    icon: <Shield size={24} />,
    type: "Research Project",
    priority: "Critical"
  },
  {
    title: "Red Team C2 Framework",
    description: "Next-generation command and control infrastructure with advanced evasion techniques, encrypted communications, and modular payload delivery.",
    tech: ["Rust", "Assembly", "Encryption", "Network Protocols"],
    status: "Private",
    icon: <Lock size={24} />,
    type: "Operational Tool",
    priority: "High"
  },
  {
    title: "Zero-Day Research Platform",
    description: "Automated vulnerability discovery system combining fuzzing, static analysis, and dynamic testing for enterprise software assessment.",
    tech: ["Go", "Machine Learning", "Binary Analysis"],
    status: "Restricted",
    icon: <Code size={24} />,
    type: "Research Platform",
    priority: "Critical"
  },
  {
    title: "APT Detection System",
    description: "Machine learning-powered threat detection system for identifying and analyzing Advanced Persistent Threat activities in real-time.",
    tech: ["Python", "Deep Learning", "YARA Rules"],
    status: "Confidential",
    icon: <Eye size={24} />,
    type: "Defense System",
    priority: "High"
  }
];

const statusColors = {
  "Classified": "destructive",
  "Private": "secondary", 
  "Restricted": "outline",
  "Confidential": "cyber"
} as const;

const priorityColors = {
  "Critical": "text-red-400",
  "High": "text-orange-400",
  "Medium": "text-yellow-400",
  "Low": "text-green-400"
};

export const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 px-4 sm:px-6 relative">
      {/* Background warning pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-repeat bg-[length:40px_40px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDEwTDMwIDMwSDEwTDIwIDEwWiIgc3Ryb2tlPSIjRkY2NjY2IiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-black/90 border border-red-500/40 rounded-full backdrop-blur-sm shadow-lg shadow-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-400 animate-pulse" />
            <span className="text-red-400 text-sm font-mono">ls -la /projects/classified/</span>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-ping ml-2"></div>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-400 mb-8 drop-shadow-[0_0_20px_rgba(0,255,0,0.3)]">
            Classified <span className="text-red-400 drop-shadow-[0_0_20px_rgba(255,0,0,0.3)]">Projects</span>
          </h2>
          
          <div className="max-w-4xl mx-auto bg-red-900/10 border border-red-500/20 rounded-xl p-6 backdrop-blur-sm">
            <p className="text-green-300/90 text-xl leading-relaxed">
              Advanced security research and development projects. 
              <span className="text-red-400 font-semibold"> Access restricted to authorized personnel only.</span>
            </p>
          </div>
        </motion.div>

        {/* Enhanced Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.8 }}
            >
              <ModernCard variant="premium" glow>
                <div className="space-y-6">
                  {/* Enhanced Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 shadow-lg">
                        <div className="text-red-400">
                          {project.icon}
                        </div>
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 text-red-500 text-xs font-mono">
                          <span>[{project.type.toLowerCase().replace(' ', '_')}]$</span>
                          <span className="text-red-400">classified</span>
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                        </div>
                        <h3 className="text-xl font-bold text-green-400 leading-tight">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-mono">Priority:</span>
                          <span className={`text-xs font-bold ${priorityColors[project.priority as keyof typeof priorityColors]}`}>
                            {project.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={statusColors[project.status as keyof typeof statusColors]} className="shrink-0 shadow-lg">
                      {project.status}
                    </Badge>
                  </div>

                  {/* Enhanced Description */}
                  <p className="text-green-300/85 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Enhanced Tech Stack */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-500" />
                      <span className="text-green-500 text-sm font-mono">Tech Stack:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, i) => (
                        <span 
                          key={i} 
                          className="text-xs text-green-400 bg-green-500/15 border border-green-500/30 px-3 py-1.5 rounded-full font-mono hover:bg-green-500/25 transition-colors duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Access Level */}
                  <div className="pt-4 border-t border-red-500/20 bg-red-900/5 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-red-400 text-sm font-mono">
                        Access Level: {project.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-red-500 text-sm font-bold">RESTRICTED</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ModernCard>
            </motion.div>
          ))}
        </div>

        {/* Security Notice */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-900/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
            <Lock className="h-5 w-5 text-red-400" />
            <span className="text-red-400 text-sm font-mono">
              Unauthorized access is monitored and prosecuted
            </span>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
