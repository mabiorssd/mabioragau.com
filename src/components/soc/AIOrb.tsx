import { motion } from "framer-motion";

/** Animated wireframe orb representing the AI co-pilot. */
export const AIOrb = ({ size = 36, active = true }: { size?: number; active?: boolean }) => {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full border border-primary/60"
        animate={active ? { rotate: 360 } : {}}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ boxShadow: "0 0 18px hsl(var(--primary) / 0.45)" }}
      />
      <motion.div
        className="absolute inset-1 rounded-full border border-primary/40"
        animate={active ? { rotate: -360 } : {}}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{ transform: "rotateX(70deg)" }}
      />
      <motion.div
        className="absolute inset-1 rounded-full border border-accent/30"
        animate={active ? { rotate: 360 } : {}}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        style={{ transform: "rotateY(70deg)" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 rounded-full bg-primary"
        style={{ width: size * 0.18, height: size * 0.18, x: -size * 0.09, y: -size * 0.09 }}
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.25, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

/** Compact animated waveform visualization. */
export const AIWaveform = ({ bars = 14, active = true }: { bars?: number; active?: boolean }) => {
  return (
    <div className="flex items-center gap-[3px] h-5">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full bg-primary"
          animate={active ? { height: ["20%", "100%", "30%", "80%", "20%"] } : { height: "20%" }}
          transition={{
            duration: 1 + (i % 4) * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.05,
          }}
          style={{ height: "20%", filter: "drop-shadow(0 0 3px hsl(var(--primary) / 0.8))" }}
        />
      ))}
    </div>
  );
};
