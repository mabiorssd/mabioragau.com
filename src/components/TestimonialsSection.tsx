import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { GlassCard } from "./soc/GlassCard";

const testimonials = [
  {
    name: "Peter Gatdet Yak",
    role: "IT Director",
    company: "Ministry of ICT, South Sudan",
    content: "Mabior's assessment of our government systems uncovered critical exposures we hadn't detected internally. His professionalism and depth of knowledge are exceptional.",
    rating: 5,
  },
  {
    name: "Rebecca Nyandeng Garang",
    role: "Chief Technology Officer",
    company: "Juba Commercial Bank",
    content: "Engaging Mabior for our banking penetration test was the right call. The findings were sharp, the reporting was clear, and remediation guidance was actionable.",
    rating: 5,
  },
  {
    name: "Dr. James Loro Lokuji",
    role: "Director of Cybersecurity",
    company: "University of Juba",
    content: "A comprehensive audit of our campus network and student data systems. Our digital infrastructure is materially more secure thanks to his work.",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="eyebrow">Testimonials</span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight">
            Trusted across <span className="bg-gradient-primary bg-clip-text text-transparent">East Africa</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-12 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="col-span-12 md:col-span-6 lg:col-span-4"
            >
              <GlassCard className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <Quote className="w-6 h-6 text-primary/60" />
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-sm text-foreground/90 leading-relaxed flex-1">
                  "{t.content}"
                </blockquote>
                <div className="mt-5 pt-4 border-t border-border">
                  <div className="font-semibold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                  <div className="text-[11px] text-primary font-mono mt-0.5">{t.company}</div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
