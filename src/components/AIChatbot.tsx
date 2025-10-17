import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "👋 Welcome! I'm Mabior's AI Security Assistant.\n\n💬 I can help you with:\n• Cybersecurity consulting\n• Penetration testing services\n• Security best practices\n• Threat analysis\n• And any security-related questions!\n\nHow can I assist you today?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
    
    const response = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        messages: [...messages, { role: "user", content: userMessage }] 
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error("Failed to start stream");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let assistantMessage = "";
    let textBuffer = "";

    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            assistantMessage += content;
            setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = { role: "assistant", content: assistantMessage };
              return newMessages;
            });
          }
        } catch {
          continue;
        }
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      await streamChat(userMessage);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-gradient-to-b from-black/98 to-green-950/10 border-2 border-green-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,255,0,0.3)] flex flex-col z-50 backdrop-blur-xl overflow-hidden"
          >
            {/* Animated header background */}
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-green-500/10 via-green-400/5 to-green-500/10 animate-pulse"></div>
            
            <div className="flex items-center justify-between p-5 border-b border-green-500/40 backdrop-blur-sm relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <h3 className="text-green-400 font-bold text-lg tracking-wide">AI Security Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-green-400 hover:text-green-300 hover:bg-green-500/20 transition-all duration-300"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-5" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl shadow-lg whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-green-500/30 to-green-600/20 text-green-50 border border-green-400/30"
                          : "bg-gradient-to-br from-green-900/30 to-black/50 text-green-300 border border-green-500/20"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gradient-to-br from-green-900/30 to-black/50 p-4 rounded-2xl border border-green-500/20 flex items-center gap-3">
                      <Loader2 className="h-4 w-4 animate-spin text-green-400" />
                      <span className="text-green-400 text-sm">Thinking...</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            <div className="p-5 border-t border-green-500/40 backdrop-blur-sm bg-black/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-3"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your security question..."
                  className="bg-black/70 border-green-500/40 text-green-300 placeholder:text-green-600 focus:border-green-400 focus:ring-2 focus:ring-green-500/30 rounded-xl h-12 transition-all"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-br from-green-500/30 to-green-600/20 hover:from-green-500/40 hover:to-green-600/30 text-green-400 border border-green-500/30 hover:border-green-400/50 h-12 w-12 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/30 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
              <p className="text-green-600 text-xs mt-2 text-center">Powered by AI • Ask anything about cybersecurity</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-black p-5 rounded-full shadow-[0_0_30px_rgba(0,255,0,0.4)] hover:shadow-[0_0_50px_rgba(0,255,0,0.6)] z-50 border-2 border-green-400/50 transition-all duration-300"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          boxShadow: [
            "0 0 30px rgba(0,255,0,0.4)",
            "0 0 50px rgba(0,255,0,0.6)",
            "0 0 30px rgba(0,255,0,0.4)"
          ]
        }}
        transition={{ 
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <MessageSquare className="h-7 w-7" />
      </motion.button>
    </>
  );
};
