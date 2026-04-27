import { useMemo } from "react";

const LOG_ENTRIES = [
  "exploit_mod.py: SUCCESS",
  "CVE-2025-31242: PATCHED",
  "CSIRT: ALERT HANDLED",
  "nmap -sV 10.20.30.0/24: 412 hosts",
  "burp.scan(api.target): 7 highs queued",
  "subdomain enum: 1,284 records",
  "phishing campaign: contained",
  "C2 beacon: dwell 00:42:11",
  "XSS chain → admin: confirmed",
  "kerberoasting: 3 hashes captured",
  "wireshark.pcap: anomaly @192.168.1.7",
  "zero-day triage: queued",
  "WAF bypass: vector verified",
  "endpoint quarantine: 11 nodes",
  "TLS audit: HSTS enforced",
  "NCA CSIRT: shift handover",
];

export const HackerLogTicker = () => {
  const items = useMemo(() => [...LOG_ENTRIES, ...LOG_ENTRIES], []);
  return (
    <div className="fixed top-0 inset-x-0 z-[55] h-7 border-b border-border bg-background/85 backdrop-blur-md overflow-hidden flex items-center">
      <div className="flex-shrink-0 h-full px-3 flex items-center gap-2 border-r border-border bg-primary/10">
        <span className="status-dot" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-semibold">
          RED-TEAM LOG · LIVE
        </span>
      </div>
      <div className="flex-1 overflow-hidden whitespace-nowrap">
        <div className="ticker-track">
          {items.map((t, i) => (
            <span
              key={i}
              className="text-[11px] font-mono text-muted-foreground inline-flex items-center gap-2"
            >
              <span className="text-primary">▸</span>
              <span>[{String(((Date.now() / 1000) | 0) % 99999).padStart(5, "0")}]</span>
              <span className="text-foreground/80">{t}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
