import { useState, useEffect } from "react";
import { MatrixBackground } from "@/components/MatrixBackground";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import BlogPosts from "@/components/BlogPosts";
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

    // Update active section based on scroll position
    const handleScroll = () => {
      const sections = ["about", "services", "projects", "contact"];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fullText]);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono relative overflow-hidden">
      <MatrixBackground />
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <HeroSection text={text} showCursor={showCursor} />
      <ServicesSection />

      {/* Blog Posts Section */}
      <motion.section 
        id="blog" 
        className="min-h-screen px-6 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <motion.h3 
            className="text-2xl md:text-3xl font-bold text-green-400"
            variants={glitchAnimation}
            initial="initial"
            animate="animate"
          >
            &gt;_Latest Blog Posts
          </motion.h3>
          <BlogPosts />
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section id="projects" className="min-h-screen px-6 py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <motion.h3 
            className="text-2xl md:text-3xl font-bold text-green-400"
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
      <motion.section id="contact" className="min-h-screen px-6 py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <motion.h3 
            className="text-2xl md:text-3xl font-bold text-green-400"
            variants={glitchAnimation}
            initial="initial"
            animate="animate"
          >
            &gt;_Establish Connection
          </motion.h3>
          <motion.form 
            className="space-y-6 max-w-2xl mx-auto"
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
              type="submit"
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
};

export default Portfolio;