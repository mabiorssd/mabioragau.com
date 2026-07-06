import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters")
});

export const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate input using Zod schema
      const validatedData = newsletterSchema.parse({ email: email.trim().toLowerCase() });
      const validatedEmail = validatedData.email;

      // Upsert subscription (RLS prevents anonymous SELECT, so we don't pre-check existence —
      // this also avoids leaking which emails are subscribed).
      const { data: subscription, error } = await supabase
        .from('newsletter_subscriptions')
        .upsert({
          email: validatedEmail,
          confirmed: false,
          confirmation_token: crypto.randomUUID(),
          subscribed: true
        }, {
          onConflict: 'email'
        })
        .select()
        .single();

      if (error) throw error;

      // Send confirmation email using the dedicated send-email edge function
      const confirmUrl = `${window.location.origin}/confirm-subscription?token=${subscription.confirmation_token}`;
      
      const response = await supabase.functions.invoke('send-email', {
        body: {
          to: [validatedEmail],
          subject: "Confirm your newsletter subscription",
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #0d9488, #0891b2); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">Confirm Your Subscription</h1>
                </div>
                <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
                  <p style="color: #374151; line-height: 1.6; font-size: 16px;">
                    Thank you for subscribing to my newsletter! You'll receive occasional cybersecurity briefings, 
                    field notes, and practical security guidance.
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${confirmUrl}"
                       style="background: #0d9488; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: 600;">
                      Confirm Subscription
                    </a>
                  </div>
                  <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
                    If you didn't request this subscription, you can safely ignore this email.
                    No further emails will be sent.
                  </p>
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                  <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                    Mabior Agau — Cybersecurity Professional<br/>
                    <a href="https://mabioragau.com" style="color: #0d9488;">mabioragau.com</a>
                  </p>
                </div>
              </body>
            </html>
          `
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Success!",
        description: "Please check your email to confirm your subscription.",
      });
      setEmail("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.errors[0].message,
        });
      } else {
        console.error("Newsletter subscribe error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to subscribe. Please try again later.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          Join {subscriberCount ?? 0} other subscribers
        </p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 min-h-[44px]"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="min-h-[44px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Subscribing...
              </div>
            ) : (
              "Subscribe"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
