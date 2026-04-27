import { useEffect, useRef, useState } from "react";

/**
 * Reactive Cyber-Topographic Map of South Sudan.
 * Hand-built SVG outline with glowing network nodes at major cities.
 * Nodes pulse and react to scroll-driven section changes.
 */

type Node = { id: string; name: string; x: number; y: number; section?: string };

// Approximate coordinates within a 1000x800 viewBox covering SS rough bounds.
const NODES: Node[] = [
  { id: "juba", name: "JUBA · NCA HQ", x: 540, y: 660, section: "about" },
  { id: "wau", name: "WAU NODE", x: 360, y: 470, section: "services" },
  { id: "malakal", name: "MALAKAL NODE", x: 620, y: 360, section: "skills" },
  { id: "bentiu", name: "BENTIU NODE", x: 470, y: 380, section: "projects" },
  { id: "yei", name: "YEI EDGE", x: 470, y: 720, section: "experience" },
  { id: "aweil", name: "AWEIL NODE", x: 290, y: 380, section: "news" },
  { id: "bor", name: "BOR RELAY", x: 600, y: 540, section: "blog" },
  { id: "kapoeta", name: "KAPOETA EDGE", x: 720, y: 670, section: "contact" },
];

// A simplified outline of South Sudan — stylized polygon, not geographically exact.
const SS_OUTLINE =
  "M 230 360 L 280 290 L 360 240 L 470 220 L 560 230 L 660 250 L 760 290 L 820 350 L 850 430 L 840 510 L 800 580 L 760 640 L 720 700 L 660 740 L 580 760 L 490 750 L 410 720 L 340 680 L 280 620 L 240 540 L 220 460 Z";

interface Props {
  activeSection?: string;
}

export const SouthSudanMap = ({ activeSection }: Props) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Subtle parallax
  const offsetY = (scrollY * 0.03) % 40;

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Faint grid backdrop */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.18]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="topo-grid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(0 ${offsetY})`}
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="hsl(var(--topo-line))"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#topo-grid)" />
      </svg>

      {/* Map */}
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full pointer-events-auto"
      >
        <defs>
          <radialGradient id="map-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.18)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0)" />
          </radialGradient>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Soft glow behind map */}
        <ellipse cx="540" cy="490" rx="380" ry="280" fill="url(#map-glow)" />

        {/* Topographic isolines — concentric distortions of outline */}
        {[1.0, 0.92, 0.84, 0.76].map((scale, i) => (
          <path
            key={i}
            d={SS_OUTLINE}
            transform={`translate(${540 * (1 - scale)} ${490 * (1 - scale)}) scale(${scale})`}
            fill="none"
            stroke="hsl(var(--topo-line))"
            strokeWidth={i === 0 ? 1.5 : 0.6}
            strokeOpacity={i === 0 ? 0.55 : 0.18}
            strokeDasharray={i === 0 ? "0" : "3 4"}
          />
        ))}

        {/* Connection lines between nodes */}
        {NODES.map((a, i) =>
          NODES.slice(i + 1).map((b) => {
            const isLit =
              activeSection === a.section || activeSection === b.section;
            return (
              <line
                key={`${a.id}-${b.id}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="hsl(var(--topo-line))"
                strokeWidth={isLit ? 0.8 : 0.3}
                strokeOpacity={isLit ? 0.4 : 0.08}
                strokeDasharray="2 6"
              />
            );
          })
        )}

        {/* Nodes */}
        {NODES.map((n) => {
          const active =
            hovered === n.id || activeSection === n.section;
          return (
            <g
              key={n.id}
              transform={`translate(${n.x} ${n.y})`}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "crosshair" }}
            >
              {active && (
                <>
                  <circle
                    r="18"
                    fill="hsl(var(--primary) / 0.12)"
                    className="animate-ping"
                  />
                  <circle
                    r="12"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="0.6"
                    strokeOpacity="0.6"
                  />
                </>
              )}
              <circle
                r={active ? 5 : 3}
                fill="hsl(var(--topo-node))"
                filter="url(#node-glow)"
                style={{ transition: "r 0.3s ease" }}
              />
              {active && (
                <text
                  x="10"
                  y="4"
                  fontSize="11"
                  fontFamily="var(--font-mono)"
                  fill="hsl(var(--primary))"
                  style={{ textShadow: "0 0 8px hsl(var(--primary))" }}
                >
                  {n.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
