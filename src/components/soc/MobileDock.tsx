import { Home, Crosshair, Clock, FileText, MessageSquare } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const items = [
  { id: "about", label: "Home", Icon: Home },
  { id: "skills", label: "Arsenal", Icon: Crosshair },
  { id: "experience", label: "Timeline", Icon: Clock },
  { id: "blog", label: "Blog", Icon: FileText },
  { id: "copilot", label: "Chat", Icon: MessageSquare },
];

export const MobileDock = ({ activeSection }: { activeSection: string }) => {
  const isMobile = useIsMobile();
  if (!isMobile) return null;

  const go = (id: string) => {
    if (id === "copilot") {
      window.dispatchEvent(new Event("copilot:open"));
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed bottom-0 inset-x-0 z-40 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]"
    >
      <div className="mx-3 mb-4 glass-panel rounded-2xl border border-border flex items-center justify-around gap-1 px-2 py-2 shadow-glow/20">
        {items.map(({ id, label, Icon }) => {
          const active = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => go(id)}
              aria-label={label}
              className={`relative flex flex-col items-center gap-1 min-w-[56px] min-h-[48px] px-3 py-2 rounded-xl transition-all duration-300 ${
                active
                  ? "text-primary bg-primary/10 shadow-[inset_0_1px_0_hsl(var(--primary)/0.3)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {active && (
                <span className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
              )}
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.75} />
              <span className="text-[10px] font-mono uppercase tracking-wide leading-none">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
