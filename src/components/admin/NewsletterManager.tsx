import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  const { toast } = useToast();

  const { data: subscribers } = useQuery({
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

      const response = await fetch(
        'https://zrvzcsdxbhzwfabvndbo.supabase.co/functions/v1/send-newsletter',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ 
            subject,
            content: emailTemplate
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send newsletter');
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
        description: "Failed to send newsletter. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Newsletter Manager</h2>
        <p className="text-sm text-muted-foreground">
          {subscriberCount ?? 0} active subscribers
        </p>
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
        >
          {isSending ? "Sending..." : "Send Newsletter"}
        </Button>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Subscriber List</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Subscription Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers?.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell>{subscriber.email}</TableCell>
                <TableCell>{new Date(subscriber.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    subscriber.confirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {subscriber.confirmed ? 'Confirmed' : 'Pending'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};