import { Github, Mail, Linkedin, Twitter, Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

const socialLinks = [
  { Icon: Github, href: "https://github.com/mabiorssd/", label: "GitHub", value: "github.com/mabiorssd" },
  { Icon: Twitter, href: "https://x.com/_CyberMaster", label: "X", value: "@_CyberMaster" },
  { Icon: Linkedin, href: "https://www.linkedin.com/in/mabior-agau-436825210/", label: "LinkedIn", value: "linkedin.com/in/mabior-agau" },
  { Icon: Mail, href: "mailto:info@mabioragau.com", label: "Email", value: "info@mabioragau.com" },
];

export const SocialLinks = () => {
  const { copied, copy } = useCopyToClipboard();
  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {socialLinks.map(({ Icon, href, label, value }) => (
        <div key={label} className="flex items-center gap-0.5">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-10 h-10 grid place-items-center rounded-xl bg-secondary border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
          >
            <Icon className="w-4 h-4" />
          </a>
          <button
            onClick={() => copy(value, label)}
            aria-label={`Copy ${label}`}
            className="w-7 h-7 grid place-items-center rounded-lg text-muted-foreground hover:text-primary transition-colors"
          >
            {copied === value ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      ))}
    </div>
  );
};
