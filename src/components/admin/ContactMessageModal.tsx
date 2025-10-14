import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ContactMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: {
    name: string;
    email: string;
    message: string;
    created_at: string;
  } | null;
}

interface AnalysisResult {
  category: string;
  priority: number;
  reason: string;
}

const getPriorityColor = (priority: number) => {
  if (priority >= 5) return "destructive";
  if (priority >= 4) return "default";
  if (priority >= 3) return "secondary";
  return "outline";
};

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    penetration_testing: "Penetration Testing",
    security_audit: "Security Audit",
    incident_response: "Incident Response",
    training: "Training",
    consultation: "Consultation",
    other: "Other"
  };
  return labels[category] || category;
};

export const ContactMessageModal = ({ isOpen, onClose, message }: ContactMessageModalProps) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  if (!message) return null;

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-contact', {
        body: { message: message.message, name: message.name }
      });

      if (error) throw error;

      setAnalysis(data);
      toast({
        title: "✨ Analysis Complete",
        description: `Category: ${getCategoryLabel(data.category)} | Priority: ${data.priority}/5`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze message",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Message from {message.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">From:</p>
            <p>{message.name} ({message.email})</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sent at:</p>
            <p>{new Date(message.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Message:</p>
            <p className="whitespace-pre-wrap">{message.message}</p>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold">AI Analysis</h4>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                variant="outline"
                size="sm"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze with AI
                  </>
                )}
              </Button>
            </div>

            {analysis && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Badge variant="outline">{getCategoryLabel(analysis.category)}</Badge>
                      <Badge variant={getPriorityColor(analysis.priority)}>
                        Priority: {analysis.priority}/5
                      </Badge>
                    </div>
                    <p className="text-sm mt-2">{analysis.reason}</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};