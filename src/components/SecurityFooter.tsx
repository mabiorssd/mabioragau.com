
import { motion } from "framer-motion";
import { Shield, Lock, Github, Linkedin, Mail } from "lucide-react";

export const SecurityFooter = () => {
  return (
    <footer className="border-t border-green-500/20 bg-black/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-green-400">
              <Lock className="h-4 w-4" />
              <span className="font-mono text-sm">© 2024 Mabior Chol - Ethical Hacker & Security Researcher</span>
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
