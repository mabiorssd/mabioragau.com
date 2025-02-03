import { motion } from "framer-motion";
import { Github, Mail, Linkedin, Twitter } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const socialLinks = [
  { icon: <Github size={18} />, link: "https://github.com/mabiorssd/", label: "GitHub" },
  { icon: <Twitter size={18} />, link: "https://x.com/_CyberMaster", label: "X (Twitter)" },
  { icon: <Linkedin size={18} />, link: "https://www.linkedin.com/in/mabior-agau-436825210/", label: "LinkedIn" },
  { icon: <Mail size={18} />, link: "mailto:info@mabioragau.com", label: "Email" }
];

export const SocialLinks = () => {
  return (
    <motion.div 
      className="flex gap-2 sm:gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TooltipProvider>
        {socialLinks.map((social, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <motion.a
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="p-2 sm:p-3 cyber-border rounded-lg hover:bg-green-500/10 transition-all duration-300 hover-glow"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {social.icon}
              </motion.a>
            </TooltipTrigger>
            <TooltipContent>
              <p>{social.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </motion.div>
  );
};