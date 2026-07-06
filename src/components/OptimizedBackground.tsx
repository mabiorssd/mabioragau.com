// Subtle static gradient background — lightweight, no canvas, no animation overhead
export const OptimizedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1]">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      {/* Subtle radial glow */}
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06] dark:opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, hsl(170 75% 45%) 0%, transparent 70%)",
        }}
      />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.04] dark:opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, hsl(195 85% 52%) 0%, transparent 70%)",
        }}
      />
    </div>
  );
};
