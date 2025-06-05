
import { motion } from "framer-motion";
import { Github, Mail, Linkedin, Twitter } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const socialLinks = [
  { 
    icon: <Github size={20} />, 
    link: "https://github.com/mabiorssd/", 
    label: "GitHub",
    color: "hover:text-gray-300 hover:border-gray-300/50"
  },
  { 
    icon: <Twitter size={20} />, 
    link: "https://x.com/_CyberMaster", 
    label: "X (Twitter)",
    color: "hover:text-blue-400 hover:border-blue-400/50"
  },
  { 
    icon: <Linkedin size={20} />, 
    link: "https://www.linkedin.com/in/mabior-agau-436825210/", 
    label: "LinkedIn",
    color: "hover:text-blue-500 hover:border-blue-500/50"
  },
  { 
    icon: <Mail size={20} />, 
    link: "mailto:info@mabioragau.com", 
    label: "Email",
    color: "hover:text-red-400 hover:border-red-400/50"
  }
];

export const SocialLinks = () => {
  return (
    <motion.div 
      className="flex gap-4 justify-center"
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
                className={`relative p-4 border border-green-500/30 rounded-xl bg-black/60 backdrop-blur-sm text-green-400 transition-all duration-300 group ${social.color}`}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Icon */}
                <div className="relative z-10">
                  {social.icon}
                </div>
                
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-transparent group-hover:border-current transition-colors duration-300 rounded-tl-xl"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-transparent group-hover:border-current transition-colors duration-300 rounded-br-xl"></div>
              </motion.a>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-black/90 border border-green-500/30 text-green-400">
              <p className="font-mono text-sm">{social.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </motion.div>
  );
};
