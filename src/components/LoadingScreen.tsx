import { Shield } from "lucide-react";

export const LoadingScreen = () => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
    {/* Animated pulse ring */}
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-[loading-ring_1.5s_ease-out_infinite]" />
      <div className="absolute inset-[-8px] rounded-full border border-primary/20 animate-[loading-ring_1.5s_ease-out_infinite_0.5s]" />
      <div className="absolute inset-[-16px] rounded-full border border-primary/10 animate-[loading-ring_1.5s_ease-out_infinite_1s]" />
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-secondary/50 backdrop-blur">
        <Shield className="h-7 w-7 text-primary" />
      </div>
    </div>

    {/* Loading text */}
    <p className="mt-6 text-sm font-mono text-muted-foreground animate-[loading-fade_1.5s_ease-in-out_infinite]">
      Loading...
    </p>

    <style>{`
      @keyframes loading-ring {
        0%   { transform: scale(0.8); opacity: 0.8; }
        100% { transform: scale(1.6); opacity: 0; }
      }
      @keyframes loading-fade {
        0%, 100% { opacity: 0.4; }
        50%      { opacity: 1; }
      }
    `}</style>
  </div>
);

export default LoadingScreen;
