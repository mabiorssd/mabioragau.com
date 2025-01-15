import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DONATION_AMOUNTS = [1000, 3000, 5000];

export const DonationSection = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleDonation = async (amount: number) => {
    setIsProcessing(true);
    try {
      const reference = `DONATION_${amount}_${Date.now()}`;
      
      // Create donation record in Supabase
      const { error: dbError } = await supabase
        .from('donations')
        .insert([{ amount, reference }]);

      if (dbError) throw dbError;

      // Call MTN MoMo API via Edge Function
      const { data, error } = await supabase.functions.invoke('process-donation', {
        body: { amount, reference }
      });

      if (error) throw error;

      // Initialize MTN Widget with the returned data
      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error('No redirect URL received');
      }

    } catch (error) {
      console.error('Donation error:', error);
      toast({
        title: "Error",
        description: "Failed to process donation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.section 
      id="donate" 
      className="py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div className="bg-black/50 p-6 rounded-lg border border-green-500/20">
          <motion.p className="text-green-400 text-sm mb-4">
            [root@mabior-terminal]# ./support_cybersecurity.sh
          </motion.p>
          <motion.h3 
            className="text-2xl md:text-3xl font-bold text-green-400 mb-6 text-center"
          >
            &gt;_Support My Work
          </motion.h3>
          <p className="text-green-300 text-center mb-8">
            Your support helps me continue researching and developing cybersecurity solutions.
            Donate using MTN Mobile Money.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {DONATION_AMOUNTS.map((amount) => (
              <Button
                key={amount}
                onClick={() => handleDonation(amount)}
                disabled={isProcessing}
                className="border-2 border-green-500 text-green-400 hover:bg-green-500/10 h-16"
              >
                {isProcessing ? (
                  "Processing..."
                ) : (
                  `Donate ${amount.toLocaleString()} SSP`
                )}
              </Button>
            ))}
          </div>
          <p className="text-green-300/70 text-center mt-6 text-sm">
            Powered by MTN Mobile Money
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};