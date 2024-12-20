import { motion } from "framer-motion";
import { Github, Mail, Linkedin, Twitter } from "lucide-react";

const socialLinks = [
  { icon: <Github size={20} />, link: "https://github.com/mabiorssd/", label: "GitHub" },
  { icon: <Twitter size={20} />, link: "https://x.com/_CyberMaster", label: "X (Twitter)" },
  { icon: <Linkedin size={20} />, link: "https://www.linkedin.com/in/mabior-agau-436825210/", label: "LinkedIn" },
  { icon: <Mail size={20} />, link: "mailto:info@mabioragau.com", label: "Email" }
];

export const SocialLinks = () => {
  return (
    <motion.div className="flex gap-3">
      {socialLinks.map((social, index) => (
        <motion.a
          key={index}
          href={social.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="p-2 border border-green-500/30 rounded-lg hover:border-green-400 hover:text-green-400 transition-all"
          whileHover={{ scale: 1.05, borderColor: "#00ff00" }}
          whileTap={{ scale: 0.95 }}
        >
          {social.icon}
        </motion.a>
      ))}
    </motion.div>
  );
};