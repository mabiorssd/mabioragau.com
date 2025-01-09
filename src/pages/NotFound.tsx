import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  const [showCursor, setShowCursor] = useState(true);
  const [text, setText] = useState("");
  const errorMessage = `
> SYSTEM ERROR 404
> ACCESS DENIED
> LOCATION NOT FOUND
> ATTEMPTING SYSTEM RECOVERY...
> INITIATING EMERGENCY PROTOCOL...
> REDIRECTING TO SECURE LOCATION IN 5 SECONDS...`;

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setText(errorMessage.slice(0, index));
      index++;
      if (index > errorMessage.length) {
        clearInterval(timer);
        setTimeout(() => {
          navigate("/");
        }, 5000);
      }
    }, 50);

    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-2xl bg-black/50 p-8 rounded-lg border border-green-500/30 shadow-lg backdrop-blur-sm">
        <pre className="font-mono text-green-500 whitespace-pre-wrap break-all">
          {text}
          {showCursor && <span className="animate-pulse">_</span>}
        </pre>
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-green-500 hover:text-green-400 transition-colors font-mono"
          >
            [ABORT] Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;