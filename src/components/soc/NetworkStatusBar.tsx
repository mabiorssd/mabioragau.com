import { CheckCircle } from "lucide-react";

export const NetworkStatusBar = () => {
  return (
    <div className="w-full border-t border-border bg-background/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10">
            <span className="status-dot" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">System Status</span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10">
            <CheckCircle className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-mono font-semibold text-primary">All Clear</span>
          </span>
        </div>
      </div>
    </div>
  );
};
