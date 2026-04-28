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
      className="fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-3 mb-3 glass-panel rounded-2xl border border-border flex items-center justify-around px-1 py-1.5">
        {items.map(({ id, label, Icon }) => {
          const active = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => go(id)}
              aria-label={label}
              className={`flex flex-col items-center gap-0.5 min-w-[56px] min-h-[44px] px-2 py-1.5 rounded-xl transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-mono uppercase tracking-wide">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
