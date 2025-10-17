import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Globe, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const BlogPostStats = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<string>("");
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blog_posts'
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setStats(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching stats",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInsights = async () => {
    setIsGeneratingInsights(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-blog-insights', {
        body: { stats }
      });

      if (error) throw error;

      setInsights(data.insights);
      toast({
        title: "✨ Insights Generated",
        description: "AI has analyzed your blog statistics!",
      });
    } catch (error: any) {
      console.error('Error generating insights:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate insights.",
      });
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const getCountryStats = (views: any[]) => {
    if (!views) return {};
    const countryCount = views.reduce((acc: any, view: any) => {
      const country = view.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});
    return countryCount;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Blog Post Statistics</h2>
        <Button
          onClick={handleGenerateInsights}
          disabled={isGeneratingInsights || stats.length === 0}
          variant="outline"
        >
          {isGeneratingInsights ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate AI Insights
            </>
          )}
        </Button>
      </div>

      {insights && (
        <Alert className="mb-6 bg-primary/5 border-primary/20">
          <Sparkles className="h-4 w-4" />
          <AlertDescription className="whitespace-pre-wrap">
            {insights}
          </AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">
                  <Accordion type="single" collapsible>
                    <AccordionItem value={post.id}>
                      <AccordionTrigger>{post.title}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 p-4 bg-muted/50 rounded-md">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Views by Country
                          </h4>
                          {Object.entries(getCountryStats(post.views)).map(([country, count]) => (
                            <div key={country} className="flex justify-between text-sm">
                              <span>{country}:</span>
                              <span className="font-medium">{count as number}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TableCell>
                <TableCell>{post.view_count || 0}</TableCell>
                <TableCell>
                  {post.published ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-red-600">No</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(post.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(post.updated_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};