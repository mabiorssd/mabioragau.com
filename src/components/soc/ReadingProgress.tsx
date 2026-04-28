import { useEffect, useState } from "react";

export const ReadingProgress = () => {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setPct(total > 0 ? Math.min(100, Math.max(0, (h.scrollTop / total) * 100)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 h-1 z-[70] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-primary transition-[width] duration-150"
        style={{ width: `${pct}%`, boxShadow: "0 0 12px hsl(var(--primary) / 0.7)" }}
      />
    </div>
  );
};
