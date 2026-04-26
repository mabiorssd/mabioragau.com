import { useEffect, useState } from "react";
import { Activity, Wifi, ShieldAlert, Globe2 } from "lucide-react";

type ThreatLevel = "LOW" | "GUARDED" | "ELEVATED" | "HIGH";

const pickThreat = (): ThreatLevel => {
  const r = Math.random();
  if (r < 0.55) return "LOW";
  if (r < 0.85) return "GUARDED";
  if (r < 0.97) return "ELEVATED";
  return "HIGH";
};

const threatColor: Record<ThreatLevel, string> = {
  LOW: "text-primary border-primary/30 bg-primary/10",
  GUARDED: "text-accent border-accent/30 bg-accent/10",
  ELEVATED: "text-warning border-warning/30 bg-warning/10",
  HIGH: "text-destructive border-destructive/30 bg-destructive/10",
};

export const NetworkStatusBar = () => {
  const [latency, setLatency] = useState(28);
  const [threat, setThreat] = useState<ThreatLevel>("LOW");
  const [packets, setPackets] = useState(1287);
  const [nodes, setNodes] = useState(42);

  useEffect(() => {
    const id = setInterval(() => {
      setLatency(18 + Math.floor(Math.random() * 28));
      setPackets((p) => p + Math.floor(Math.random() * 60));
      setNodes(36 + Math.floor(Math.random() * 18));
      if (Math.random() < 0.25) setThreat(pickThreat());
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const Item = ({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: string }) => (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-secondary/40">
      <Icon className="w-3.5 h-3.5 text-primary" />
      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-[11px] font-mono font-semibold text-foreground tabular-nums">{value}</span>
    </div>
  );

  return (
    <div className="w-full border-t border-border bg-background/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10">
            <span className="status-dot" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">Live Network Status</span>
          </span>
          <Item icon={Activity} label="Latency" value={`${latency}ms`} />
          <Item icon={Wifi} label="Packets" value={packets.toLocaleString()} />
          <Item icon={Globe2} label="Nodes" value={`${nodes}`} />
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${threatColor[threat]}`}>
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono uppercase tracking-widest">Threat Level</span>
          <span className="text-[11px] font-mono font-bold">{threat}</span>
        </div>
      </div>
    </div>
  );
};
