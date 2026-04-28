import { useEffect, useRef, useState } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#01_$%&@";

/**
 * Scramble/decryption text effect. Animates from random symbols
 * to the target text over ~`duration` ms. Triggers on first reveal.
 */
export const useScramble = (text: string, opts?: { duration?: number; trigger?: boolean }) => {
  const { duration = 900, trigger = true } = opts ?? {};
  const [output, setOutput] = useState(text);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!trigger || startedRef.current) return;
    startedRef.current = true;

    const start = performance.now();
    const len = text.length;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      let out = "";
      for (let i = 0; i < len; i++) {
        const reveal = i / len;
        if (t > reveal + 0.15) out += text[i];
        else if (text[i] === " ") out += " ";
        else out += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setOutput(out);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else setOutput(text);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [text, duration, trigger]);

  return output;
};
