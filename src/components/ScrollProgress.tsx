import { useEffect, useState } from "react";

/**
 * Thin teal progress bar at the very top of the page.
 * Uses CSS var(--scroll) updated on scroll — 100% CSS visual.
 */
export const ScrollProgress = () => {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setScroll(height > 0 ? (winScroll / height) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="scroll-progress"
      style={{ "--scroll": `${scroll}%` } as React.CSSProperties}
      aria-hidden="true"
    />
  );
};
