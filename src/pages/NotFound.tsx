import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-lg text-center"
      >
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 grid place-items-center mb-6 shadow-glow">
            <ShieldAlert className="w-8 h-8 text-primary" strokeWidth={1.8} />
          </div>
          <h1 className="text-7xl sm:text-8xl font-extrabold tracking-tight text-foreground leading-none">
            404
          </h1>
          <div className="mt-3 h-1 w-12 mx-auto rounded-full bg-primary/40" />
        </div>

        <h2 className="text-xl font-semibold text-foreground mt-6">
          Page not found
        </h2>
        <p className="mt-2 text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
          The resource you requested does not exist or has been moved. 
          Return to the homepage to navigate to the correct section.
        </p>

        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-glow"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
