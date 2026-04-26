import { Github, Linkedin, Mail, Twitter, Shield } from "lucide-react";

const social = [
  { Icon: Github, href: "https://github.com/mabiorssd/", label: "GitHub" },
  { Icon: Linkedin, href: "https://www.linkedin.com/in/mabior-agau-436825210/", label: "LinkedIn" },
  { Icon: Twitter, href: "https://x.com/_CyberMaster", label: "X" },
  { Icon: Mail, href: "mailto:info@mabioragau.com", label: "Email" },
];

export const SecurityFooter = () => {
  return (
    <footer className="border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 md:col-span-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
              <Shield className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">Mabior Agau</div>
              <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">Security Operations</div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 flex md:justify-end items-center gap-2">
            {social.map(({ Icon, href, label }) => (
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
