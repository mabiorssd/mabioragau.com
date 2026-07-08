/**
 * Ambient floating gradient orbs — 100% CSS, zero JS overhead.
 * Three slow-moving blurred blobs create living depth behind content.
 * The orbs drift on independent sine-wave-like paths for an organic feel.
 */
export const AmbientBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
      {/* Primary orb — large teal, slow figure-8 */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.12] dark:opacity-[0.15]"
        style={{
          background:
            "radial-gradient(circle at center, hsl(172 68% 42% / 0.6), hsl(190 75% 50% / 0.2), transparent 70%)",
          animation: "orb-drift-1 25s ease-in-out infinite",
          top: "-10%",
          left: "-5%",
        }}
      />

      {/* Secondary orb — cyan, counter-rotates */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.08] dark:opacity-[0.10]"
        style={{
          background:
            "radial-gradient(circle at center, hsl(195 85% 52% / 0.5), hsl(170 75% 45% / 0.15), transparent 70%)",
          animation: "orb-drift-2 30s ease-in-out infinite",
          bottom: "-15%",
          right: "-10%",
        }}
      />

      {/* Tertiary orb — purple/teal hybrid, slow wander */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.06] dark:opacity-[0.08]"
        style={{
          background:
            "radial-gradient(circle at center, hsl(200 80% 55% / 0.4), hsl(160 70% 40% / 0.1), transparent 70%)",
          animation: "orb-drift-3 35s ease-in-out infinite",
          top: "40%",
          left: "50%",
        }}
      />

      <style>{`
        @keyframes orb-drift-1 {
          0%   { transform: translate(0, 0) scale(1); }
          25%  { transform: translate(8%, 12%) scale(1.1); }
          50%  { transform: translate(15%, 5%) scale(0.95); }
          75%  { transform: translate(5%, -8%) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes orb-drift-2 {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(-10%, -8%) scale(1.15); }
          66%  { transform: translate(5%, -15%) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes orb-drift-3 {
          0%   { transform: translate(0, 0) scale(1) rotate(0deg); }
          25%  { transform: translate(6%, -10%) scale(1.08) rotate(5deg); }
          50%  { transform: translate(-8%, 4%) scale(0.92) rotate(-3deg); }
          75%  { transform: translate(-4%, -6%) scale(1.05) rotate(2deg); }
          100% { transform: translate(0, 0) scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};
