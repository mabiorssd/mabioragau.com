import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Eye, Calendar, Clock, AlertTriangle, Search, FileText, ArrowUpRight } from "lucide-react";
import { useBlogPostUtils } from "@/hooks/useBlogPostUtils";
import { ScrambleText } from "./soc/ScrambleText";
import circuit from "@/assets/intel-circuit.webp";
import network from "@/assets/intel-network.webp";
import matrix from "@/assets/intel-matrix.webp";
import redteam from "@/assets/intel-redteam.webp";

interface IntelligenceFeedProps {
  limit?: number;
  showControls?: boolean;
}

const FALLBACK_THUMBS = [circuit, network, matrix, redteam];

const CATEGORIES = ["ALL", "RED_TEAMING", "NCA_PROTOCOL", "RESEARCH", "DEFENSE", "INTEL"] as const;
type Cat = typeof CATEGORIES[number];

// Hash → deterministic pick so each post stays consistent across renders
const pick = <T,>(arr: readonly T[], seed: string): T => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return arr[Math.abs(h) % arr.length];
};

const THREATS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
const threatStyle: Record<typeof THREATS[number], string> = {
  LOW: "bg-primary/15 text-primary border-primary/40",
  MEDIUM: "bg-warning/15 text-warning border-warning/40",
  HIGH: "bg-warning/20 text-warning border-warning/50",
  CRITICAL: "bg-destructive/15 text-destructive border-destructive/40",
};

const DERIVED_CATS: Cat[] = ["RED_TEAMING", "NCA_PROTOCOL", "RESEARCH", "DEFENSE", "INTEL"];

const readingTime = (content: string) => {
  const words = (content || "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
};

export const IntelligenceFeed = ({ limit, showControls = true }: IntelligenceFeedProps) => {
  const { getImageUrl, getExcerpt } = useBlogPostUtils();
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [cat, setCat] = useState<Cat>("ALL");
  const [q, setQ] = useState("");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["intel-feed", limit],
    queryFn: async () => {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!posts) return;
    (async () => {
      const entries = await Promise.all(
        posts.map(async (p) => [p.id, p.image_url ? await getImageUrl(p.image_url) : ""] as const)
      );
      setImageUrls(Object.fromEntries(entries));
    })();
  }, [posts, getImageUrl]);

  const enriched = useMemo(() => {
    return (posts ?? []).map((p, i) => ({
      ...p,
      _category: pick(DERIVED_CATS, p.id),
      _threat: pick(THREATS, p.id + "t"),
      _featured: i === 0 || (i > 0 && i % 5 === 0),
      _read: readingTime(p.content),
      _excerpt: getExcerpt(p.content),
      _thumb: imageUrls[p.id] || pick(FALLBACK_THUMBS, p.id),
    }));
  }, [posts, imageUrls, getExcerpt]);

  const filtered = useMemo(() => {
    return enriched.filter((p) => {
      if (cat !== "ALL" && p._category !== cat) return false;
      if (q && !`${p.title} ${p.content}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [enriched, cat, q]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-12 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="col-span-12 md:col-span-6 lg:col-span-4 h-72 rounded-2xl glass-panel animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showControls && (
        <div className="glass-panel rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="[SEARCH_DATABASE_]"
              className="w-full bg-secondary/50 border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground placeholder:font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono min-h-[44px]"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 md:justify-end overflow-x-auto -mx-1 px-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-3 min-h-[36px] py-1.5 rounded-md text-[11px] font-mono uppercase tracking-widest border transition-colors whitespace-nowrap ${
                  cat === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/40 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                [{c}]
              </button>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground font-mono text-sm">No intel matches the current filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4 sm:gap-5">
          {filtered.map((p, i) => {
            const span = p._featured ? "col-span-12 lg:col-span-8" : "col-span-12 sm:col-span-6 lg:col-span-4";
            return (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.3) }}
                className={span}
              >
                <Link
                  to={`/blog/${p.slug}`}
                  className="group glass-panel glass-panel-hover rounded-2xl overflow-hidden h-full flex flex-col cursor-glow"
                >
                  <div className={`relative overflow-hidden ${p._featured ? "aspect-[16/8]" : "aspect-[16/9]"}`}>
                    <img
                      src={p._thumb}
                      alt={p.image_alt || p.title}
                      loading="lazy"
                      width={1024}
                      height={576}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-md bg-background/80 backdrop-blur border border-primary/30 text-primary">
                        [{p._category}]
                      </span>
                      <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-md border backdrop-blur flex items-center gap-1 ${threatStyle[p._threat]}`}>
                        <AlertTriangle className="w-2.5 h-2.5" />
                        {p._threat}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col p-5 sm:p-6">
                    <h3 className={`font-display font-bold text-foreground leading-tight tracking-tight ${p._featured ? "text-2xl sm:text-3xl" : "text-lg"}`}>
                      <ScrambleText text={p.title} duration={700} />
                    </h3>

                    <p className={`mt-3 text-sm text-muted-foreground ${p._featured ? "line-clamp-3" : "line-clamp-2"}`}>
                      {p._excerpt}
                    </p>

                    <div className="mt-auto pt-4 flex items-center justify-between text-[11px] font-mono text-muted-foreground border-t border-border">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(p.created_at), "MMM d")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {p._read} min
                        </span>
                        {p.view_count !== undefined && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {p.view_count}
                          </span>
                        )}
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
};
