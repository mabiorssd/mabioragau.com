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
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border-radius:10px;overflow:hidden;">
              <tr>
                <td style="padding:32px 28px 16px;text-align:center;background:linear-gradient(160deg,#0d1b2a,#0f172a);">
                  <img src="https://www.mabioragau.com/portrait-mabior.jpg" alt="Mabior Agau" width="80" height="80" style="display:block;width:80px;height:80px;border-radius:50%;border:2px solid #0d9488;object-fit:cover;margin:0 auto 12px;" />
                  <div style="font-size:20px;font-weight:700;color:#f1f5f9;letter-spacing:-0.3px;">Confirm Your Subscription</div>
                  <div style="font-size:11px;color:#0d9488;text-transform:uppercase;letter-spacing:2px;font-weight:500;margin-top:4px;">Mabior Agau &bull; Cybersecurity</div>
                </td>
              </tr>
              <tr><td style="height:3px;background:linear-gradient(90deg,#0f172a,#0d9488,#00ff88,#0f172a);"></td></tr>
              <tr>
                <td style="padding:28px;">
                  <p style="margin:0 0 16px;font-size:14px;line-height:1.75;color:#cbd5e1;">
                    Thanks for subscribing! You'll receive occasional cybersecurity briefings, field notes from South Sudan, and practical security guidance.
                  </p>
                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px auto;">
                    <tr>
                      <td style="border-radius:8px;padding:0;">
                        <a href="${confirmUrl}"
                           style="display:inline-block;padding:13px 32px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;background:linear-gradient(135deg,#0d9488,#0891b2);">
                          Confirm Subscription
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:18px 0 0;font-size:12px;color:#64748b;line-height:1.5;">
                    If you didn't request this, ignore this email. No further emails will be sent.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 28px;text-align:center;background:#080c14;border-top:1px solid #1e293b;">
                  <div style="font-size:11px;color:#475569;">
                    Mabior Agau &mdash; Offensive Security &bull; South Sudan<br/>
                    <a href="https://mabioragau.com" style="color:#0d9488;text-decoration:none;">mabioragau.com</a>
                    &nbsp;&bull;&nbsp;
                    <a href="mailto:info@mabioragau.com" style="color:#0d9488;text-decoration:none;">info@mabioragau.com</a>
                  </div>
                  <div style="font-size:10px;color:#1e293b;margin-top:8px;">&copy; ${new Date().getFullYear()} Mabior Agau</div>
                </td>
              </tr>
            </table>
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
