/**
 * Subtle animated gradient background mesh.
 * Lightweight CSS-only effect — no canvas, no mouse tracking, no complex animation.
 * A gentle ambient gradient that adds depth without distraction.
 */
export const CyberMeshBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      {/* Base gradient mesh */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      {/* Slow animated gradient overlay */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 30% 20%, hsl(170 75% 45% / 0.12), transparent 60%), " +
            "radial-gradient(ellipse 60% 50% at 80% 70%, hsl(195 85% 52% / 0.08), transparent 60%)",
          animation: "gradient-shift 12s ease-in-out infinite alternate",
        }}
      />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background))_100%)]" />
      <style>{`
        @keyframes gradient-shift {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(2%, -1%) scale(1.05); }
          66% { transform: translate(-1%, 2%) scale(0.98); }
          100% { transform: translate(1%, -1.5%) scale(1.03); }
        }
      `}</style>
    </div>
  );
};
