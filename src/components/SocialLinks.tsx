import { Github, Mail, Linkedin, Twitter } from "lucide-react";

const socialLinks = [
  { Icon: Github, href: "https://github.com/mabiorssd/", label: "GitHub" },
  { Icon: Twitter, href: "https://x.com/_CyberMaster", label: "X" },
  { Icon: Linkedin, href: "https://www.linkedin.com/in/mabior-agau-436825210/", label: "LinkedIn" },
  { Icon: Mail, href: "mailto:info@mabioragau.com", label: "Email" },
];

export const SocialLinks = () => {
  return (
    <div className="flex gap-2 justify-center">
      {socialLinks.map(({ Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="w-10 h-10 grid place-items-center rounded-xl bg-secondary border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
    </div>
  );
};
