import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

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
    console.log('Submitting subscription for:', email);

    try {
      // First, check if the email is already subscribed
      const { data: existingSubscription } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .eq('email', email)
        .single();

      if (existingSubscription?.confirmed) {
        toast({
          title: "Already subscribed",
          description: "This email is already subscribed to our newsletter.",
        });
        setEmail("");
        return;
      }

      // Create or update subscription
      const { data: subscription, error } = await supabase
        .from('newsletter_subscriptions')
        .upsert({
          email,
          confirmed: false,
          confirmation_token: crypto.randomUUID(),
          subscribed: true
        }, {
          onConflict: 'email'
        })
        .select()
        .single();

      if (error) throw error;

      // Send confirmation email
      const response = await supabase.functions.invoke('send-newsletter', {
        body: {
          to: [email],
          subject: "Confirm your newsletter subscription",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #333; text-align: center;">Confirm Your Subscription</h1>
              <p style="color: #666; line-height: 1.6;">
                Thank you for subscribing to our newsletter! Please click the button below to confirm your subscription:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${window.location.origin}/confirm-subscription?token=${subscription.confirmation_token}"
                   style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                  Confirm Subscription
                </a>
              </div>
              <p style="color: #666; font-size: 14px; text-align: center;">
                If you didn't request this subscription, you can safely ignore this email.
              </p>
            </div>
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
      console.error('Newsletter subscription error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to subscribe. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-green-400">
          Join our community of {subscriberCount ?? 0} active subscribers
        </p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <div className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="bg-black border border-green-500/30 text-green-400 placeholder:text-green-600"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="border-2 border-green-500 text-green-400 hover:bg-green-500/10"
          >
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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