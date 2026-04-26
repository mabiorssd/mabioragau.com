import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { Send, Mail, User, MessageSquare } from "lucide-react";
import { GlassCard } from "./soc/GlassCard";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data: ContactFormData = contactSchema.parse(formData);
      const { error } = await supabase.from("contact_submissions").insert([data]);
      if (error) throw error;
      await supabase.functions.invoke("send-contact-notification", { body: data });
      toast({ title: "Message sent", description: "I'll respond within 24 hours." });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ title: "Validation error", description: error.errors[0].message, variant: "destructive" });
      } else {
        toast({ title: "Error", description: "Failed to send message. Try again later.", variant: "destructive" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-12 lg:col-span-5"
          >
            <span className="eyebrow">// secure_channel</span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight">
              Open a <span className="bg-gradient-primary bg-clip-text text-transparent">secure channel</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              For engagements, vulnerability disclosures, or research collaboration.
              All messages are reviewed personally.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 grid place-items-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-mono">Email</div>
                  <a href="mailto:info@mabioragau.com" className="text-sm text-foreground font-medium">info@mabioragau.com</a>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3">
                <span className="status-dot ml-2 mr-2" />
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-mono">Response window</div>
                  <div className="text-sm text-foreground font-medium">Within 24 hours</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-12 lg:col-span-7"
          >
            <GlassCard className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                      Identifier
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        id="name" name="name" type="text" required disabled={isSubmitting}
                        value={formData.name} onChange={onChange}
                        placeholder="Your name"
                        className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        id="email" name="email" type="email" required disabled={isSubmitting}
                        value={formData.email} onChange={onChange}
                        placeholder="you@domain.com"
                        className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                    Payload
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <textarea
                      id="message" name="message" required disabled={isSubmitting}
                      value={formData.message} onChange={onChange}
                      rows={6}
                      placeholder="Briefly describe the engagement, scope, and timeline."
                      className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-colors"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.98 }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-glow transition-colors shadow-glow disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Transmitting..." : "Transmit message"}
                </motion.button>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
