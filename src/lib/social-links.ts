import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export interface SocialLink {
  Icon: typeof Github;
  href: string;
  label: string;
  value: string;
}

export const socialLinks: SocialLink[] = [
  { Icon: Github, href: "https://github.com/mabiorssd/", label: "GitHub", value: "github.com/mabiorssd" },
  { Icon: Twitter, href: "https://x.com/_CyberMaster", label: "X", value: "@_CyberMaster" },
  { Icon: Linkedin, href: "https://www.linkedin.com/in/mabior-agau-436825210/", label: "LinkedIn", value: "linkedin.com/in/mabior-agau" },
  { Icon: Mail, href: "mailto:info@mabioragau.com", label: "Email", value: "info@mabioragau.com" },
];
