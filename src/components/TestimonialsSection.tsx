
import { motion } from "framer-motion";
import { Quote, Star, Shield } from "lucide-react";
import { ModernCard } from "./ModernCard";

const testimonials = [
  {
    name: "Peter Gatdet Yak",
    role: "IT Director",
    company: "Ministry of ICT, South Sudan",
    content: "Mabior's security assessment of our government systems was exceptional. He identified critical vulnerabilities that could have compromised sensitive data. His professionalism and deep knowledge of cybersecurity saved us from potential threats.",
    rating: 5
  },
  {
    name: "Rebecca Nyandeng Garang",
    role: "Chief Technology Officer",
    company: "Juba Commercial Bank",
    content: "We hired Mabior to conduct penetration testing on our banking infrastructure. His thorough analysis and detailed reports helped us strengthen our security posture significantly. Highly professional and trustworthy.",
    rating: 5
  },
  {
    name: "Dr. James Loro Lokuji",
    role: "Director of Cybersecurity",
    company: "University of Juba",
    content: "Mabior conducted a comprehensive security audit of our campus network and student data systems. His expertise in identifying and mitigating security risks is unmatched. The university's digital infrastructure is now much more secure thanks to his work.",
    rating: 5
  }
];

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 relative">
      <div className="absolute inset-0 bg-cyber-grid opacity-5"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-green-400 mb-4">
            Client Testimonials
          </h2>
          
          <p className="text-green-300/80 text-lg max-w-2xl mx-auto">
            Trusted by organizations across South Sudan to secure their critical systems
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name}>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
