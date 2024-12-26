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

    const binary = '01';
    const hex = '0123456789ABCDEF';
    const symbols = '⚡☢☣⚠⚙✳❇';
    const characters = binary + hex + symbols;
    
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    
    const rainDrops: number[] = Array(Math.floor(columns)).fill(1);
    const speeds: number[] = Array(Math.floor(columns)).fill(0).map(() => Math.random() * 2 + 1);
    const glowIntensity: number[] = Array(Math.floor(columns)).fill(0).map(() => Math.random());
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < rainDrops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = i * fontSize;
        const y = rainDrops[i] * fontSize;

        // Create dynamic glow effect
        const glow = Math.sin(Date.now() * 0.001 + i) * 0.5 + 0.5;
        const hue = (Date.now() * 0.05 + i * 5) % 360;
        
        ctx.shadowBlur = 15 * glow;
        ctx.shadowColor = `hsla(${hue}, 100%, 50%, ${glowIntensity[i]})`;
        
        // Main character color with gradient
        const gradient = ctx.createLinearGradient(x, y - fontSize, x, y);
        gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0)`);
        gradient.addColorStop(0.5, `hsla(${hue}, 100%, 50%, 0.5)`);
        gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0.8)`);

        ctx.fillStyle = gradient;
        ctx.font = `bold ${fontSize}px monospace`;
        ctx.fillText(text, x, y);

        // Reset drops when they reach bottom
        if (y > canvas.height && Math.random() > 0.95) {
          rainDrops[i] = 0;
          speeds[i] = Math.random() * 2 + 1;
          glowIntensity[i] = Math.random();
        }
        rainDrops[i] += speeds[i];
      }
    };

    const interval = setInterval(draw, 30);

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
      style={{
        opacity: 0.3,
        filter: 'blur(0.5px)',
        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.98), rgba(0, 20, 20, 0.98))',
      }}
    />
  );
};