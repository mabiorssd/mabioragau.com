// Lightweight CSS-only background effect - replaces heavy canvas animations
export const OptimizedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1]">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/5 to-black" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #00ff00 1px, transparent 1px),
            linear-gradient(to bottom, #00ff00 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Radial glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-3xl" />
    </div>
  );
};
