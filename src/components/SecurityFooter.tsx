import { Github, Linkedin, Mail, Twitter, Shield, Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { NetworkStatusBar } from "./soc/NetworkStatusBar";

const social = [
  { Icon: Github, href: "https://github.com/mabiorssd/", label: "GitHub", value: "github.com/mabiorssd" },
  { Icon: Linkedin, href: "https://www.linkedin.com/in/mabior-agau-436825210/", label: "LinkedIn", value: "linkedin.com/in/mabior-agau" },
  { Icon: Twitter, href: "https://x.com/_CyberMaster", label: "X", value: "@_CyberMaster" },
  { Icon: Mail, href: "mailto:info@mabioragau.com", label: "Email", value: "info@mabioragau.com" },
];

export const SecurityFooter = () => {
  const { copied, copy } = useCopyToClipboard();

  return (
    <footer className="border-t border-border mt-12">
      <NetworkStatusBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 md:col-span-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
              <Shield className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">Mabior Agau</div>
              <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">Security Operations</div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7 flex md:justify-end items-center gap-2 flex-wrap">
            {social.map(({ Icon, href, label, value }) => (
              <div key={label} className="flex items-center gap-1">
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
                  className="w-8 h-8 grid place-items-center rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                >
                  {copied === value ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-3 text-[11px] font-mono text-muted-foreground">
          <span>© {new Date().getFullYear()} Mabior Agau · All systems operational</span>
          <span className="flex items-center gap-2">
            <span className="status-dot" /> All testing performed with explicit authorization
          </span>
        </div>
      </div>
    </footer>
  );
};
