import { useEffect, useRef } from "react";

/**
 * Performance-conscious animated cyber mesh.
 * Uses a single canvas, throttles to ~30fps, pauses when tab hidden.
 * Reacts subtly to mouse position.
 */
export const CyberMeshBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const scrollIntensityRef = useRef(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cols = 0;
    let rows = 0;
    const spacing = 60;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / spacing) + 1;
      rows = Math.ceil(height / spacing) + 1;
    };

    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const onLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const onScroll = () => {
      const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      scrollIntensityRef.current = Math.min(1, window.scrollY / max);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    let last = 0;
    let t = 0;
    const interval = 1000 / 30; // 30fps

    const draw = (now: number) => {
      rafRef.current = requestAnimationFrame(draw);
      if (now - last < interval) return;
      last = now;
      t += 0.01;

      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const radius = 220;

      // Dots
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const baseX = c * spacing;
          const baseY = r * spacing;
          // gentle wave
          const wave = Math.sin(t + (c + r) * 0.3) * 1.5;
          let x = baseX + wave;
          let y = baseY + Math.cos(t + c * 0.2) * 1.5;

          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let alpha = 0.18 + scrollIntensityRef.current * 0.12;
          let dotR = 0.9 + scrollIntensityRef.current * 0.3;
          if (dist < radius) {
            const pull = (1 - dist / radius) * 8;
            x -= (dx / dist) * pull;
            y -= (dy / dist) * pull;
            alpha = 0.18 + (1 - dist / radius) * 0.6;
            dotR = 1.6;
          }

          const isLight = !document.documentElement.classList.contains("dark");
          const dotColor = isLight
            ? `hsla(152, 76%, 32%, ${alpha * 0.55})`
            : `hsla(142, 71%, 55%, ${alpha})`;
          ctx.fillStyle = dotColor;
          ctx.beginPath();
          ctx.arc(x, y, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Light connecting lines near cursor
      if (mx > -500) {
        const cx = Math.floor(mx / spacing);
        const cy = Math.floor(my / spacing);
        for (let r = Math.max(0, cy - 3); r <= Math.min(rows - 1, cy + 3); r++) {
          for (let c = Math.max(0, cx - 3); c <= Math.min(cols - 1, cx + 3); c++) {
            const x = c * spacing;
            const y = r * spacing;
            const dx = x - mx;
            const dy = y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < radius) {
              ctx.strokeStyle = `hsla(142, 71%, 55%, ${(1 - dist / radius) * 0.25})`;
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(mx, my);
              ctx.lineTo(x, y);
              ctx.stroke();
            }
          }
        }
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    const onVisibility = () => {
      if (document.hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      } else {
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      {/* Base gradient mesh */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      <canvas ref={canvasRef} className="absolute inset-0 opacity-90" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background))_100%)]" />
    </div>
  );
};
