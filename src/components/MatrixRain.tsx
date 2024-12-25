import { useEffect, useRef } from 'react';

export const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    const glowIntensity: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
      glowIntensity[i] = Math.random();
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Create glowing effect
        const alpha = glowIntensity[i];
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#0F0';
        
        // Main character
        ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(text, x, y);

        // Reset shadow for next iteration
        ctx.shadowBlur = 0;

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          glowIntensity[i] = Math.random();
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]"
      style={{ opacity: 0.3 }} // Increased opacity from 0.15 to 0.3
    />
  );
};