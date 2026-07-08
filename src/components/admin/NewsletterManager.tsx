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
      
      const emailTemplate = `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border-radius:10px;overflow:hidden;">
          <tr>
            <td style="padding:32px 28px 16px;text-align:center;background:linear-gradient(160deg,#0d1b2a,#0f172a);">
              <img src="https://www.mabioragau.com/portrait-mabior.jpg" alt="Mabior Agau" width="80" height="80" style="display:block;width:80px;height:80px;border-radius:50%;border:2px solid #0d9488;object-fit:cover;margin:0 auto 12px;" />
              <div style="font-size:22px;font-weight:700;color:#f1f5f9;letter-spacing:-0.3px;">${subject}</div>
              <div style="font-size:11px;color:#0d9488;text-transform:uppercase;letter-spacing:2px;font-weight:500;margin-top:4px;">Mabior Agau &bull; Cybersecurity Briefing</div>
            </td>
          </tr>
          <tr><td style="height:3px;background:linear-gradient(90deg,#0f172a,#0d9488,#00ff88,#0f172a);"></td></tr>
          <tr>
            <td style="padding:32px;font-size:14px;line-height:1.8;color:#e2e8f0;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px;text-align:center;background:#080c14;border-top:1px solid #1e293b;">
              <div style="font-size:12px;color:#64748b;margin-bottom:2px;">
                Mabior Agau &mdash; Offensive Security &bull; South Sudan
              </div>
              <div style="font-size:11px;color:#475569;">
                <a href="https://mabioragau.com" style="color:#0d9488;text-decoration:none;">mabioragau.com</a>
                &nbsp;&bull;&nbsp;
                <a href="mailto:info@mabioragau.com" style="color:#0d9488;text-decoration:none;">info@mabioragau.com</a>
              </div>
              <div style="margin-top:10px;font-size:10px;color:#1e293b;">
                You received this because you subscribed. &copy; ${new Date().getFullYear()} Mabior Agau.
              </div>
            </td>
          </tr>
        </table>
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