import { motion } from "framer-motion";

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

const projects = [
  {
    title: "Advanced Vulnerability Scanner",
    description: "Custom-built scanner utilizing machine learning for intelligent vulnerability detection and zero-day discovery.",
    tech: ["Python", "TensorFlow", "Nmap API", "Custom Exploits"],
    status: "Classified"
  },
  {
    title: "Red Team C2 Framework",
    description: "Sophisticated command and control framework with advanced evasion capabilities and encrypted communications.",
    tech: ["Rust", "Assembly", "Encryption", "Network Protocols"],
    status: "Private"
  },
  {
    title: "Zero-Day Research Platform",
    description: "Automated system for discovering and analyzing potential zero-day vulnerabilities in enterprise software.",
    tech: ["Go", "Machine Learning", "Binary Analysis"],
    status: "Restricted"
  },
  {
    title: "APT Detection System",
    description: "AI-powered system for detecting and analyzing Advanced Persistent Threat (APT) activities.",
    tech: ["Python", "Deep Learning", "YARA Rules"],
    status: "Confidential"
  }
];

export const ProjectsSection = () => {
  return (
    <motion.section id="projects" className="py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.h3 
          className="text-2xl sm:text-3xl font-bold text-green-400 mb-6"
          variants={glitchAnimation}
          initial="initial"
          animate="animate"
        >
          &gt;_Classified Projects
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="border border-green-500/30 rounded-xl p-4 sm:p-5 space-y-3 hover:border-green-400 transition-all bg-black/50"
              whileHover={{ y: -3, borderColor: "#00ff00" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="text-lg sm:text-xl font-semibold text-green-400">{project.title}</h4>
              <p className="text-sm sm:text-base text-green-600">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, i) => (
                  <span key={i} className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="text-red-500 text-sm font-bold">
                Status: {project.status}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};