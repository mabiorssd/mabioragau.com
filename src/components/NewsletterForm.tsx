import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";

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
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter!",
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
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="border-2 border-green-500 text-green-400 hover:bg-green-500/10"
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </div>
      </form>
    </div>
  );
};