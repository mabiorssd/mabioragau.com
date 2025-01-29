import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const ConfirmSubscription = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isConfirming, setIsConfirming] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
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

        setIsSuccess(true);
        toast({
          title: "Subscription confirmed!",
          description: "Thank you for subscribing to our newsletter.",
        });
      } catch (error) {
        console.error("Error confirming subscription:", error);
        setIsSuccess(false);
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
            {isSuccess ? (
              <>
                <CheckCircle2 className="w-16 h-16 text-green-500 animate-pulse" />
                <p className="text-center">Your subscription has been confirmed successfully!</p>
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 text-red-500 animate-pulse" />
                <p className="text-center text-red-400">Failed to confirm your subscription.</p>
              </>
            )}
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