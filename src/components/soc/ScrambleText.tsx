import { useEffect, useRef, useState } from "react";
import { useScramble } from "@/hooks/useScramble";

interface Props {
  text: string;
  className?: string;
  duration?: number;
  as?: keyof JSX.IntrinsicElements;
}

/** Animates text on scroll into view using IntersectionObserver. */
export const ScrambleText = ({ text, className, duration = 900, as: Tag = "span" }: Props) => {
  const ref = useRef<HTMLElement | null>(null);
  const [trigger, setTrigger] = useState(false);
  const out = useScramble(text, { duration, trigger });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setTrigger(true)),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className} aria-label={text}>
      {out}
    </Tag>
  );
};
