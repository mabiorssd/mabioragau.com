import { motion } from "framer-motion";

export const MatrixBackground = () => {
  const matrixRainEffect = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 0.3 },
    transition: { duration: 1.5, repeat: Infinity }
  };

  return (
    <div className="fixed inset-0 opacity-10 pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xs"
          style={{ left: `${i * 5}%` }}
          {...matrixRainEffect}
        >
          {Array.from({ length: 20 }).map((_, j) => (
            <div key={j} className="my-2">
              {Math.random().toString(36).charAt(2)}
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};