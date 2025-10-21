import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2 } from "lucide-react";

export const SeoAnalyzer = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [suggestions, setSuggestions] = useState("");

  const analyzeSeo = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please provide both title and content",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-generator', {
        body: { 
          type: 'seo',
          topic: title,
          context: content
        }
      });

      if (error) throw error;

      setSuggestions(data.content || "No suggestions generated");
      toast({
        title: "Success",
        description: "SEO analysis complete"
      });
    } catch (error: any) {
      console.error('Error analyzing SEO:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze SEO",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-green-500" />
          AI SEO Analyzer
        </CardTitle>
        <CardDescription>
          Get AI-powered SEO recommendations for your content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-green-400 mb-2 block">
            Content Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog post or page title"
            className="bg-black/50 border-green-500/30 text-green-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-green-400 mb-2 block">
            Content Preview (first 500 chars)
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste a preview of your content here..."
            className="min-h-[120px] bg-black/50 border-green-500/30 text-green-400"
          />
        </div>

        <Button
          onClick={analyzeSeo}
          disabled={isAnalyzing}
          className="w-full bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze SEO"
          )}
        </Button>

        {suggestions && (
          <div className="mt-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <h4 className="font-semibold text-green-400 mb-2">SEO Recommendations:</h4>
            <div className="text-green-300/90 whitespace-pre-wrap">{suggestions}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
