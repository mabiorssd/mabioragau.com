
import { motion } from "framer-motion";
import { Quote, Star, Shield } from "lucide-react";
import { ModernCard } from "./ModernCard";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CISO, TechCorp Inc.",
    company: "Fortune 500 Company",
    content: "Mabior's penetration testing revealed critical vulnerabilities we never knew existed. His detailed reporting and remediation guidance helped us strengthen our security posture significantly.",
    rating: 5
  },
  {
    name: "Marcus Rodriguez",
    role: "Security Director",
    company: "Financial Services",
    content: "Outstanding red team engagement. The attack scenarios were realistic and eye-opening. Mabior's expertise in social engineering and physical security is unparalleled.",
    rating: 5
  },
  {
    name: "Dr. Emily Watson",
    role: "CTO",
    company: "Healthcare Systems",
    content: "Professional, thorough, and incredibly knowledgeable. The vulnerability assessment was comprehensive and the follow-up support was exceptional. Highly recommended.",
    rating: 5
  }
];

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 relative">
      <div className="absolute inset-0 bg-cyber-grid opacity-5"></div>
      
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-black/80 border border-green-500/40 rounded-full backdrop-blur-sm shadow-lg">
            <Quote className="h-5 w-5 text-green-400 animate-pulse" />
            <span className="text-green-400 text-sm font-mono">grep -i "testimonials" /var/log/clients.log</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping ml-2"></div>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-400 mb-8">
            Client <span className="text-green-300">Testimonials</span>
          </h2>
          
          <p className="text-green-300/90 text-xl leading-relaxed max-w-4xl mx-auto">
            Trusted by organizations worldwide to secure their most critical assets
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <ModernCard variant="premium" className="h-full">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Quote className="h-8 w-8 text-green-400/60" />
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-green-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <blockquote className="text-green-300/90 leading-relaxed italic">
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div className="border-t border-green-500/20 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                        <Shield className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-green-400">{testimonial.name}</div>
                        <div className="text-green-500/80 text-sm">{testimonial.role}</div>
                        <div className="text-green-500/60 text-xs">{testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </ModernCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
