import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const NewsletterEditor = () => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendNewsletter = async () => {
    if (!subject.trim() || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide both subject and content.",
      });
      return;
    }

    setIsSending(true);
    console.log('Sending newsletter with:', { subject, content });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await supabase.functions.invoke('send-newsletter', {
        body: {
          subject,
          content,
          from: 'news@newsletter.mabioragau.com'
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to send newsletter');
      }

      toast({
        title: "Success",
        description: "Newsletter has been sent successfully!",
      });

      setSubject("");
      setContent("");
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send newsletter. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-1">
          Subject
        </label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Newsletter subject"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Content
        </label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <Button
        onClick={handleSendNewsletter}
        disabled={isSending || !subject.trim() || !content.trim()}
        className="w-full"
      >
        {isSending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Newsletter"
        )}
      </Button>
    </div>
  );
};