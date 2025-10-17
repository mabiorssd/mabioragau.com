import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Shield, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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
  
  const INITIAL_DISPLAY_COUNT = 6;

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('fetch-security-news');
      
      if (error) throw error;
      
      setNews(data.news || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Error",
        description: "Failed to load security news",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      'ThreatPost': 'bg-red-500/20 text-red-400 border-red-500/30',
      'BleepingComputer': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'The Hacker News': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Krebs on Security': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return colors[source] || 'bg-green-500/20 text-green-400 border-green-500/30';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <section id="news" className="py-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-green-400" />
            <h2 className="text-3xl md:text-4xl font-bold text-green-400">
              Latest Cybersecurity News
            </h2>
          </div>
          <p className="text-green-500/80 max-w-2xl mx-auto">
            Stay updated with the latest security threats, vulnerabilities, and news from trusted sources
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.slice(0, showAll ? news.length : INITIAL_DISPLAY_COUNT).map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-[0_0_30px_rgba(0,255,0,0.3)] transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge className={getSourceColor(item.source)}>
                        {item.source}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-green-500/60">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.pubDate)}
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-green-300 transition-colors line-clamp-2">
                      {item.title}
                    </CardTitle>
                    {item.description && (
                      <CardDescription className="line-clamp-3 text-green-500/70">
                        {item.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors text-sm font-medium"
                    >
                      Read More
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
              ))}
            </div>
            
            {news.length > INITIAL_DISPLAY_COUNT && (
              <motion.div 
                className="flex justify-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-6 py-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/20 hover:text-green-300 transition-all duration-300 font-mono"
                >
                  {showAll ? '← Show Less' : `View All ${news.length} Articles →`}
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
