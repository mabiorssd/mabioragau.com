
import { motion } from "framer-motion";
import { Shield, Award, ExternalLink, Lock } from "lucide-react";

const certifications = [
  { name: "CISSP", org: "ISC²", year: "2023" },
  { name: "CEH", org: "EC-Council", year: "2022" },
  { name: "OSCP", org: "Offensive Security", year: "2023" },
  { name: "GCIH", org: "GIAC", year: "2022" }
];

const securityBadges = [
  { name: "Bug Bounty Hunter", platform: "HackerOne", count: "50+ Reports" },
  { name: "CVE Researcher", platform: "MITRE", count: "15+ CVEs" },
  { name: "Security Advisor", platform: "Various Orgs", count: "100+ Clients" }
];

export const SecurityFooter = () => {
  return (
    <footer className="border-t border-green-500/20 bg-black/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Certifications Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center justify-center gap-2">
              <Award className="h-6 w-6" />
              Professional Certifications
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                className="text-center p-4 bg-black/60 border border-green-500/20 rounded-lg hover:border-green-400/40 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <div className="text-green-400 font-bold text-lg">{cert.name}</div>
                <div className="text-green-500/80 text-sm">{cert.org}</div>
                <div className="text-green-500/60 text-xs">{cert.year}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Security Achievements */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center justify-center gap-2">
              <Shield className="h-6 w-6" />
              Security Achievements
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {securityBadges.map((badge, index) => (
              <motion.div
                key={badge.name}
                className="text-center p-6 bg-gradient-to-br from-black/70 to-green-900/10 border border-green-500/30 rounded-xl hover:border-green-400/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
              >
                <div className="text-green-400 font-bold text-xl mb-2">{badge.name}</div>
                <div className="text-green-500/80 text-sm mb-1">{badge.platform}</div>
                <div className="text-green-400/80 font-mono text-lg">{badge.count}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer Bottom */}
        <motion.div
          className="border-t border-green-500/20 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-green-400">
              <Lock className="h-4 w-4" />
              <span className="font-mono text-sm">© 2024 Mabior Agau - Ethical Hacker & Security Researcher</span>
            </div>
            
            <div className="flex items-center gap-4 text-green-500/80 text-sm">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Responsible Disclosure
              </span>
              <span>•</span>
              <span>Security Consulting</span>
              <span>•</span>
              <span>Vulnerability Research</span>
            </div>
          </div>
          
          <div className="text-center mt-4 text-green-500/60 text-xs font-mono">
            {'>'} All security testing performed with explicit authorization
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
