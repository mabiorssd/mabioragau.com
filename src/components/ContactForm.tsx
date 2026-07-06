import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { Send, Mail, User, MessageSquare, Copy as CopyIcon } from "lucide-react";
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
      const data = contactSchema.parse(formData) as ContactFormData;
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
    <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-12 lg:col-span-5"
          >
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Get in{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">touch</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-base leading-relaxed">
              For security engagements, vulnerability disclosures, or research collaboration.
              All messages are reviewed personally and responded to promptly.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 grid place-items-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Email</div>
                  <a href="mailto:info@mabioragau.com" className="text-sm text-foreground font-medium hover:text-primary transition-colors">info@mabioragau.com</a>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText("info@mabioragau.com");
                      toast({ title: "Copied!", description: "info@mabioragau.com" });
                    } catch {
                      toast({ title: "Copy failed", variant: "destructive" });
                    }
                  }}
                  aria-label="Copy email"
                  className="w-8 h-8 grid place-items-center rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors flex-shrink-0"
                >
                  <CopyIcon className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-4">
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 ml-1.5" />
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Response time</div>
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
            <GlassCard className="p-8 sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                      Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        id="name" name="name" type="text" required disabled={isSubmitting}
                        value={formData.name} onChange={onChange}
                        placeholder="Your name"
                        className="w-full bg-secondary/40 border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        id="email" name="email" type="email" required disabled={isSubmitting}
                        value={formData.email} onChange={onChange}
                        placeholder="you@company.com"
                        className="w-full bg-secondary/40 border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                    Message
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                    <textarea
                      id="message" name="message" required disabled={isSubmitting}
                      value={formData.message} onChange={onChange}
                      rows={5}
                      placeholder="Describe the engagement, scope, or topic you'd like to discuss."
                      className="w-full bg-secondary/40 border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all duration-200 disabled:opacity-50"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.97 }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all duration-200 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </motion.button>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
