import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can add your form submission logic
    toast({
      title: "Message sent",
      description: "Thank you for your message. I'll get back to you soon!",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.section id="contact" className="min-h-screen px-6 py-20">
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.h3 
          className="text-2xl md:text-3xl font-bold text-green-400"
          variants={glitchAnimation}
          initial="initial"
          animate="animate"
        >
          &gt;_Establish Connection
        </motion.h3>
        <motion.form 
          className="space-y-6 max-w-2xl mx-auto"
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
            ></textarea>
          </div>
          <motion.button
            type="submit"
            className="px-6 py-3 border-2 border-green-500 text-green-400 rounded-lg hover:bg-green-500/10 transition-all w-full"
            whileHover={{ scale: 1.02, borderColor: "#00ff00" }}
            whileTap={{ scale: 0.98 }}
          >
            $ ./send_encrypted_message.sh
          </motion.button>
        </motion.form>
      </div>
    </motion.section>
  );
};