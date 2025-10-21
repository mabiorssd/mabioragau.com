import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Lightbulb, Loader2 } from "lucide-react";

export const BlogInsights = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [blogStats, setBlogStats] = useState("");
  const [insights, setInsights] = useState("");

  const generateInsights = async () => {
    if (!blogStats.trim()) {
      toast({
        title: "Error",
        description: "Please provide blog statistics or metrics",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-blog-insights', {
        body: { blogStats }
      });

      if (error) throw error;

      setInsights(data.insights || "No insights generated");
      toast({
        title: "Success",
        description: "Blog insights generated successfully"
      });
    } catch (error: any) {
      console.error('Error generating insights:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate insights",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-green-500" />
          AI Blog Performance Insights
        </CardTitle>
        <CardDescription>
          Get AI-powered insights on your blog performance and recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-green-400 mb-2 block">
            Blog Statistics (views, engagement, top posts, etc.)
          </label>
          <Textarea
            value={blogStats}
            onChange={(e) => setBlogStats(e.target.value)}
            placeholder="E.g., Total views: 5000, Top post: Security Best Practices (1200 views), Average time on page: 3:45..."
            className="min-h-[100px] bg-black/50 border-green-500/30 text-green-400"
          />
        </div>

        <Button
          onClick={generateInsights}
          disabled={isGenerating}
          className="w-full bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Generate Insights"
          )}
        </Button>

        {insights && (
          <div className="mt-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <h4 className="font-semibold text-green-400 mb-2">AI Insights:</h4>
            <div className="text-green-300/90 whitespace-pre-wrap">{insights}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
