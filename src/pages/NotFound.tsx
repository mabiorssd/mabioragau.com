import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();
  const [showCursor, setShowCursor] = useState(true);
  const [text, setText] = useState("");
  const [countdown, setCountdown] = useState(5);
  const errorMessage = `> SYSTEM_ERROR 0x404
> ACCESS_DENIED: location_not_found
> INTRUSION_DETECTED — TRACING ORIGIN...
> REROUTING THROUGH SECURE TUNNEL...
> ATTEMPTING SYSTEM_RECOVERY...
> REDIRECTING TO HOME_NODE in ${countdown}s...`;

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setText(errorMessage.slice(0, index));
      index++;
      if (index > errorMessage.length) {
        clearInterval(timer);
        const cd = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(cd);
              navigate("/");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }, 30);

    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 450);

    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, [navigate, errorMessage]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black p-4 overflow-hidden">
      {/* Scanline overlay */}
      <div className="scanline-overlay" />

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-2xl"
      >
        <div className="relative border border-green-500/40 rounded-2xl bg-black/60 backdrop-blur-xl shadow-[0_0_60px_rgba(0,255,0,0.08),inset_0_1px_0_rgba(0,255,0,0.1)] p-6 sm:p-10">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500/50 rounded-tl" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500/50 rounded-tr" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500/50 rounded-bl" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500/50 rounded-br" />

          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-green-500/20">
            <span className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(255,0,0,0.4)]" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(255,200,0,0.4)]" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(0,255,0,0.4)]" />
            <span className="ml-auto text-[10px] font-mono text-green-500/60 uppercase tracking-[0.2em]">
              nca://emergency_protocol
            </span>
          </div>

          {/* Glitch title */}
          <div
            className="glitch text-5xl sm:text-7xl font-mono font-black text-green-500 mb-6 text-center tracking-tighter"
            data-text="ACCESS_DENIED"
          >
            ACCESS_DENIED
          </div>

          {/* Terminal output */}
          <pre className="font-mono text-green-400/90 whitespace-pre-wrap break-all text-sm sm:text-base leading-relaxed">
            {text}
            {showCursor && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.45, repeat: Infinity }}
                className="text-green-500"
              >
                _
              </motion.span>
            )}
          </pre>

          {/* Action */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-green-500/40 text-green-400 hover:text-green-300 hover:bg-green-500/10 hover:border-green-500/60 transition-all duration-300 font-mono text-sm shadow-[0_0_20px_rgba(0,255,0,0.05)] hover:shadow-[0_0_30px_rgba(0,255,0,0.15)]"
            >
              <span className="text-green-500/60">&gt;</span>
              [ABORT] Return to Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;