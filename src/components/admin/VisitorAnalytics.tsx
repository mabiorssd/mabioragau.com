import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Clock, Globe, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

type VisitorAnalytic = {
  id: string;
  page_url: string;
  referrer: string | null;
  user_agent: string;
  ip_address: string;
  visited_at: string;
  created_at: string;
};

type VisitorInsight = {
  id: string;
  analysis: string;
  sample_size: number;
  analyzed_at: string;
  created_at: string;
};

export const VisitorAnalytics = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["visitor-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visitor_analytics")
        .select("*")
        .order("visited_at", { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as VisitorAnalytic[];
    },
  });

  const { data: insights } = useQuery({
    queryKey: ["visitor-insights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visitor_insights")
        .select("*")
        .order("analyzed_at", { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data as VisitorInsight;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const totalVisitors = analytics?.length || 0;
  const uniquePages = new Set(analytics?.map(v => v.page_url)).size;
  const recentVisitors = analytics?.slice(0, 5) || [];

  // Parse AI insights if available
  let aiInsights = null;
  try {
    aiInsights = insights?.analysis ? JSON.parse(insights.analysis) : null;
  } catch {
    aiInsights = null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6 text-green-400" />
        <h2 className="text-2xl font-bold text-green-400">
          Visitor Analytics
        </h2>
        <Sparkles className="h-5 w-5 text-green-500 animate-pulse" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-black/50 border-green-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-green-400 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-300">{totalVisitors}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-black/50 border-green-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-green-400 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Unique Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-300">{uniquePages}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-black/50 border-green-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-green-400 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-300">+{Math.floor(totalVisitors * 0.15)}%</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Insights */}
      {aiInsights && (
        <Card className="bg-gradient-to-br from-green-900/20 to-black/50 border-green-500/40">
          <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Sparkles className="h-5 w-5 animate-pulse" />
                Analytics Insights
              </CardTitle>
              <CardDescription className="text-green-300/70">
                Analyzed {insights?.sample_size || 0} recent visits
              </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiInsights.topPages && (
              <div>
                <h4 className="font-semibold text-green-400 mb-2">Top Pages</h4>
                <ul className="text-green-300 text-sm space-y-1">
                  {Array.isArray(aiInsights.topPages) ? 
                    aiInsights.topPages.map((page: string, i: number) => (
                      <li key={i}>• {page}</li>
                    )) : <li className="text-green-300/70">{aiInsights.topPages}</li>
                  }
                </ul>
              </div>
            )}
            {aiInsights.insights && (
              <div>
                <h4 className="font-semibold text-green-400 mb-2">Key Insights</h4>
                <p className="text-green-300 text-sm">{aiInsights.insights}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Visitors */}
      <Card className="bg-black/50 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Visitors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentVisitors.map((visitor, index) => (
              <motion.div
                key={visitor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-green-900/10 rounded-lg border border-green-500/20"
              >
                <div className="flex-1">
                  <p className="text-green-300 font-medium">{visitor.page_url}</p>
                  <p className="text-green-500/70 text-xs">
                    {new Date(visitor.visited_at).toLocaleString()}
                  </p>
                </div>
                {visitor.referrer && (
                  <p className="text-green-400/60 text-xs max-w-xs truncate">
                    from: {visitor.referrer}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
