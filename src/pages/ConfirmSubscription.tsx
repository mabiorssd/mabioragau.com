import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ConfirmSubscription = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isConfirming, setIsConfirming] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmSubscription = async () => {
      if (!token) {
        toast({
          variant: "destructive",
          title: "Invalid confirmation link",
          description: "Please check your email and try again.",
        });
        setIsConfirming(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("newsletter_subscriptions")
          .update({ confirmed: true })
          .eq("confirmation_token", token)
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Subscription confirmed!",
          description: "Thank you for subscribing to our newsletter.",
        });
      } catch (error) {
        console.error("Error confirming subscription:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to confirm your subscription. Please try again.",
        });
      } finally {
        setIsConfirming(false);
      }
    };

    confirmSubscription();
  }, [token, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-green-400">
      <div className="max-w-md w-full p-8 bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Newsletter Subscription</h1>
        {isConfirming ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p>Confirming your subscription...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <p>Your subscription has been processed.</p>
            <Button
              onClick={() => navigate("/")}
              className="border border-green-500 hover:bg-green-500/10"
            >
              Return to Homepage
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmSubscription;