import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Github, Mail, Linkedin, Terminal, Shield, Bug, Lock, Server, Cpu, Code, Webhook, Database } from "lucide-react";

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState("about");
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Security Researcher | Penetration Tester | Ethical Hacker";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(interval);
    }, 100);

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, []);

  const matrixRainEffect = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 0.3 },
    transition: { duration: 1.5, repeat: Infinity }
  };

  const glitchAnimation = {
    initial: { x: 0 },
    animate: {
      x: [-2, 2, -2, 0],
      transition: {
        duration: 0.2,
        repeat: Infinity,
        repeatType: "reverse"
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

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono relative overflow-hidden">
      {/* Matrix Rain Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xs"
            style={{ left: `${i * 5}%` }}
            {...matrixRainEffect}
          >
            {Array.from({ length: 20 }).map((_, j) => (
              <div key={j} className="my-2">
                {Math.random().toString(36).charAt(2)}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed w-full bg-black/90 backdrop-blur-sm z-50 border-b border-green-500/30">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              className="text-2xl font-bold text-green-400"
              variants={glitchAnimation}
              initial="initial"
              animate="animate"
            >
              <Terminal className="inline-block mr-2" size={24} />
              ~/mabior_agau
            </motion.div>
            <div className="flex gap-6">
              {["about", "services", "projects", "contact"].map((item) => (
                <motion.button
                  key={item}
                  whileHover={{ scale: 1.05, color: "#00ff00" }}
                  whileTap={{ scale: 0.95 }}
                  className={`capitalize ${
                    activeSection === item ? "text-green-400" : "text-green-600"
                  }`}
                  onClick={() => setActiveSection(item)}
                >
                  &gt;_{item}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        className="min-h-screen flex items-center justify-center px-6 pt-20 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl w-full space-y-8">
          <motion.div className="space-y-4">
            <motion.p 
              className="text-green-400"
              variants={glitchAnimation}
              initial="initial"
              animate="animate"
            >
              &gt; Initializing secure connection...
            </motion.p>
            <motion.h2 
              className="text-6xl font-bold text-green-500"
              variants={glitchAnimation}
              initial="initial"
              animate="animate"
            >
              Mabior Agau
            </motion.h2>
            <div className="text-xl text-green-400">
              {text}{showCursor ? "_" : " "}
            </div>
            <p className="text-lg text-green-600 max-w-2xl leading-relaxed">
              Specialized in advanced penetration testing, zero-day research, and red team operations. 
              Committed to strengthening cybersecurity through ethical hacking and comprehensive security assessments.
            </p>
          </motion.div>

          <motion.div className="flex gap-4">
            <motion.div className="flex gap-4">
              {[
                { icon: <Github size={24} />, link: "#" },
                { icon: <Linkedin size={24} />, link: "#" },
                { icon: <Mail size={24} />, link: "#" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  className="p-2 border border-green-500/30 rounded-lg hover:border-green-400 hover:text-green-400 transition-all"
                  whileHover={{ scale: 1.1, borderColor: "#00ff00" }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section className="min-h-screen px-6 py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <motion.h3 
            className="text-3xl font-bold text-green-400"
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

      {/* Projects Section */}
      <motion.section className="min-h-screen px-6 py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <motion.h3 
            className="text-3xl font-bold text-green-400"
            variants={glitchAnimation}
            initial="initial"
            animate="animate"
          >
            &gt;_Classified Projects
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                className="border border-green-500/30 rounded-xl p-6 space-y-4 hover:border-green-400 transition-all bg-black/50"
                whileHover={{ y: -5, borderColor: "#00ff00" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h4 className="text-xl font-semibold text-green-400">{project.title}</h4>
                <p className="text-green-600">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="text-red-500 font-bold">
                  Status: {project.status}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section className="min-h-screen px-6 py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <motion.h3 
            className="text-3xl font-bold text-green-400"
            variants={glitchAnimation}
            initial="initial"
            animate="animate"
          >
            &gt;_Establish Connection
          </motion.h3>
          <motion.form 
            className="space-y-6 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-2">
              <label className="block text-green-400">_identifier:</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-black border border-green-500/30 rounded-lg focus:border-green-400 outline-none text-green-400"
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-green-400">_encryption_key:</label>
              <input
                type="email"
                className="w-full px-4 py-2 bg-black border border-green-500/30 rounded-lg focus:border-green-400 outline-none text-green-400"
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-green-400">_payload:</label>
              <textarea
                className="w-full px-4 py-2 bg-black border border-green-500/30 rounded-lg focus:border-green-400 outline-none text-green-400 h-32"
                placeholder="Enter your message"
              ></textarea>
            </div>
            <motion.button
              className="px-6 py-3 border-2 border-green-500 text-green-400 rounded-lg hover:bg-green-500/10 transition-all w-full"
              whileHover={{ scale: 1.02, borderColor: "#00ff00" }}
              whileTap={{ scale: 0.98 }}
            >
              $ ./send_encrypted_message.sh
            </motion.button>
          </motion.form>
        </div>
      </motion.section>
    </div>
  );
}

export default Portfolio;

