import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Subscriber = {
  id: string;
  email: string;
  created_at: string;
  confirmed: boolean;
};

export const NewsletterManager = () => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiTone, setAiTone] = useState("professional");
  const [aiLength, setAiLength] = useState("medium");
  const { toast } = useToast();

  const { data: subscribers, refetch: refetchSubscribers } = useQuery({
    queryKey: ["subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Subscriber[];
    },
  });

  const { data: subscriberCount } = useQuery({
    queryKey: ["subscriber-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from('newsletter_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('confirmed', true)
        .eq('subscribed', true);
      return count;
    },
  });

  const handleGenerateNewsletter = async () => {
    if (!aiTopic.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a topic for the newsletter.",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-newsletter', {
        body: { topic: aiTopic, tone: aiTone, length: aiLength }
      });

      if (error) throw error;

      setSubject(data.subject);
      setContent(data.content);

      toast({
        title: "✨ Newsletter Generated",
        description: "AI has created your newsletter content!",
      });
    } catch (error: any) {
      console.error('Error generating newsletter:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate newsletter.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

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

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const emailTemplate = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; padding: 20px 0; }
              .content { padding: 20px 0; }
              .footer { text-align: center; padding: 20px 0; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${subject}</h1>
            </div>
            <div class="content">
              ${content}
            </div>
            <div class="footer">
              <p>You're receiving this email because you subscribed to our newsletter.</p>
              <p>© ${new Date().getFullYear()} Mabior Agau. All rights reserved.</p>
            </div>
          </body>
        </html>
      `;

      const response = await supabase.functions.invoke('send-newsletter', {
        body: { 
          subject,
          html: emailTemplate
        },
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: "Newsletter has been sent successfully!",
      });

      setSubject("");
      setContent("");
    } catch (error: any) {
      console.error('Error sending newsletter:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send newsletter. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const confirmedSubscribers = subscribers?.filter(sub => sub.confirmed) || [];
  const pendingSubscribers = subscribers?.filter(sub => !sub.confirmed) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Newsletter Manager</h2>
        <p className="text-sm text-muted-foreground">
          {subscriberCount ?? 0} active subscribers
        </p>
      </div>

      <Tabs defaultValue="compose" className="space-y-4">
        <TabsList>
          <TabsTrigger value="compose">Compose Newsletter</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <div className="p-6 rounded-lg border-2 border-primary/20 bg-primary/5 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">AI Newsletter Generator</h3>
            </div>

            <div>
              <label htmlFor="aiTopic" className="block text-sm font-medium mb-1">
                Newsletter Topic
              </label>
              <Textarea
                id="aiTopic"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="E.g., 'Latest ransomware trends' or 'Best practices for cloud security'"
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tone</label>
                <Select value={aiTone} onValueChange={setAiTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Length</label>
                <Select value={aiLength} onValueChange={setAiLength}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGenerateNewsletter}
              disabled={isGenerating || !aiTopic.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Newsletter with AI
                </>
              )}
            </Button>
          </div>

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
        </TabsContent>

        <TabsContent value="subscribers">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Confirmed Subscribers ({confirmedSubscribers.length})</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Subscription Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {confirmedSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>{subscriber.email}</TableCell>
                      <TableCell>{new Date(subscriber.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                          Confirmed
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Pending Confirmations ({pendingSubscribers.length})</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Subscription Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>{subscriber.email}</TableCell>
                      <TableCell>{new Date(subscriber.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">
                          Pending
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};