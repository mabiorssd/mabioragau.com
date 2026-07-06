import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Clock, Loader2, Radio } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GlassCard } from "./soc/GlassCard";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description?: string;
}

export const SecurityNewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { toast } = useToast();
  const INITIAL = 6;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke("fetch-security-news");
        if (error) throw error;
        setNews(data?.news || []);
      } catch (e) {
        console.error(e);
        toast({ title: "Error", description: "Failed to load security news", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const sourceTone = (source: string) => {
    const map: Record<string, string> = {
      ThreatPost: "text-destructive border-destructive/30 bg-destructive/10",
      BleepingComputer: "text-accent border-accent/30 bg-accent/10",
      "The Hacker News": "text-primary border-primary/30 bg-primary/10",
      "Krebs on Security": "text-warning border-warning/30 bg-warning/10",
    };
    return map[source] || "text-primary border-primary/30 bg-primary/10";
  };

  const fmt = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(d).toLocaleDateString();
  };

  return (
    <section id="news" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-end justify-between gap-6 flex-wrap"
        >
          <div>
            <span className="eyebrow"><Radio className="w-3 h-3" /> // threat_feed</span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight">
              Live <span className="bg-gradient-primary bg-clip-text text-transparent">intel feed</span>
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Curated stream of breaking vulnerabilities, breaches, and advisories from trusted security desks.
            </p>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-4">
              {news.slice(0, showAll ? news.length : INITIAL).map((item, i) => (
                <motion.a
                  key={item.title}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="col-span-12 md:col-span-6 lg:col-span-4 group"
                >
                  <GlassCard className="h-full flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-md border ${sourceTone(item.source)}`}>
                        {item.source}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                        <Clock className="w-3 h-3" />
                        {fmt(item.pubDate)}
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{item.description}</p>
                    )}
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-[11px] font-mono text-primary">
                      <span>read briefing</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </GlassCard>
                </motion.a>
              ))}
            </div>

            {news.length > INITIAL && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => setShowAll((s) => !s)}
                  className="px-5 py-2.5 rounded-xl bg-secondary border border-border text-foreground hover:border-primary/40 transition-colors text-sm font-medium"
                >
                  {showAll ? "Show less" : `Show all ${news.length} items`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
