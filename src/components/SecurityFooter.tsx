import { Shield, Copy, Check, ArrowUp } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { socialLinks } from "@/lib/social-links";

export const SecurityFooter = () => {
  const { copied, copy } = useCopyToClipboard();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-16 sm:mt-20">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow shrink-0">
              <Shield className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground tracking-tight">Mabior Agau</div>
              <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.15em]">Security Operations</div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {socialLinks.map(({ Icon, href, label, value }) => (
              <div key={label} className="flex items-center gap-1">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 grid place-items-center rounded-xl bg-secondary/50 border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
                <button
                  onClick={() => copy(value, label)}
                  aria-label={`Copy ${label}`}
                  className="w-8 h-8 grid place-items-center rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-colors"
                >
                  {copied === value ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 text-[11px] font-mono text-muted-foreground">
          <span>© {new Date().getFullYear()} Mabior Agau. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="/trust" className="hover:text-primary transition-colors">Trust &amp; Security</a>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/40 border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all text-[11px]"
            >
              <ArrowUp className="w-3 h-3" /> Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
