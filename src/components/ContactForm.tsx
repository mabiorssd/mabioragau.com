import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      // Store in Supabase
      const { error: supabaseError } = await supabase
        .from('contact_submissions')
        .insert([formData]);

      if (supabaseError) throw supabaseError;

      // Also send to email service as backup
      const response = await fetch('https://formsubmit.co/ajax/info@mabioragau.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          _template: "table",
          _subject: `New contact from ${formData.name}`
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Message sent",
          description: "Thank you for your message. I'll get back to you soon!",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive"
      });
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
          <div className="space-y-2">
            <label htmlFor="email" className="block text-green-400">_encryption_key:</label>
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
          <div className="space-y-2">
            <label htmlFor="message" className="block text-green-400">_payload:</label>
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
          <motion.button
            type="submit"
            className="px-6 py-3 border-2 border-green-500 text-green-400 rounded-lg hover:bg-green-500/10 transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02, borderColor: "#00ff00" }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "$ ./send_encrypted_message.sh"}
          </motion.button>
        </motion.form>
      </div>
    </motion.section>
  );
};