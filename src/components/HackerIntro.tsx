import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const typewriterVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const characterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0
  }
};

export const HackerIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [showCommand, setShowCommand] = useState(true);
  const [showResponse, setShowResponse] = useState(false);
  const command = "whoami";
  const response = [
    "> Welcome to the Cybersecurity Terminal...",
    "> Initializing system...",
    "> Running security protocols...",
    "> Accessing encrypted database...",
    "> Identity confirmed: Mabior Agau",
    "> Security clearance: Level 5",
    "> Status: Active",
    "> Loading secure environment..."
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setShowResponse(true), 1000);
    const timer2 = setTimeout(() => {
      setShowCommand(false);
      setShowResponse(false);
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {(showCommand || showResponse) && (
        <motion.div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full max-w-2xl p-8 font-mono text-green-500">
            {showCommand && (
              <motion.div
                variants={typewriterVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.span className="text-2xl">
                  {command.split("").map((char, index) => (
                    <motion.span
                      key={index}
                      variants={characterVariants}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 0.7 }}
                    className="inline-block ml-1"
                  >
                    _
                  </motion.span>
                </motion.span>
              </motion.div>
            )}
            
            {showResponse && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 space-y-2"
              >
                {response.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-green-400"
                  >
                    {line}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};