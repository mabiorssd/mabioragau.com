import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(1, "Message is required").max(5000, "Message must be less than 5000 characters")
});

type ContactFormData = z.infer<typeof contactSchema>;

const glitchAnimation = {
  initial: { x: 0 },
  animate: {
    x: [-2, 2, -2, 0],
    transition: {
      duration: 0.2,
      repeat: Infinity,
      repeatType: "loop" as const
    }
  }
};

export const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate input using Zod schema
      const validatedData: ContactFormData = contactSchema.parse(formData);
      
      // Save to database
      const { error: supabaseError } = await supabase
        .from('contact_submissions')
        .insert([{
          name: validatedData.name,
          email: validatedData.email,
          message: validatedData.message
        }]);

      if (supabaseError) throw supabaseError;

      // Send email notification to admin
      await supabase.functions.invoke('send-contact-notification', {
        body: {
          name: validatedData.name,
          email: validatedData.email,
          message: validatedData.message
        }
      });

      toast({
        title: "Message sent successfully!",
        description: "You'll receive a confirmation email shortly. I'll respond within 24 hours.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again later.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.section id="contact" className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="bg-black/50 p-6 rounded-lg border border-green-500/20">
          <motion.p className="text-green-400 text-sm mb-4">
            [root@mabior-terminal]# ./send_encrypted_message.sh
          </motion.p>
          <motion.h3 
            className="text-2xl md:text-3xl font-bold text-green-400 mb-8"
            variants={glitchAnimation}
            initial="initial"
            animate="animate"
          >
            &gt;_Establish Connection
          </motion.h3>
          <motion.form 
            className="space-y-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <label htmlFor="name" className="block text-green-400">_identifier:</label>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">[input]$</span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black border border-green-500/30 rounded-lg focus:border-green-400 outline-none text-green-400"
                  placeholder="Enter your name"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-green-400">_encryption_key:</label>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">[input]$</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black border border-green-500/30 rounded-lg focus:border-green-400 outline-none text-green-400"
                  placeholder="Enter your email"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="block text-green-400">_payload:</label>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">[input]$</span>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black border border-green-500/30 rounded-lg focus:border-green-400 outline-none text-green-400 h-32"
                  placeholder="Enter your message"
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>
            </div>
            <motion.button
              type="submit"
              className="px-6 py-3 border-2 border-green-500 text-green-400 rounded-lg hover:bg-green-500/10 transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02, borderColor: "#00ff00" }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Encrypting..." : "$ ./send_encrypted_message.sh"}
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </motion.section>
  );
};