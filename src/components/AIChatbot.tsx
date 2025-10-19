import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Loader2, Shield, Lock, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const suggestedPrompts = [
  { icon: Shield, text: "Security Assessment", prompt: "Tell me about your penetration testing services" },
  { icon: Lock, text: "Best Practices", prompt: "What are the top cybersecurity best practices?" },
  { icon: Search, text: "Threat Analysis", prompt: "How can I protect against modern cyber threats?" },
  { icon: Sparkles, text: "Get Started", prompt: "I need help with my organization's security" },
];

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: `${getGreeting()}! 👋 I'm Mabior's AI Security Assistant.\n\n🛡️ I'm here to help you with:\n\n• Penetration Testing & Vulnerability Assessment\n• Security Auditing & Compliance\n• Incident Response & Forensics\n• Security Training & Awareness\n• Web & Network Security\n\n💡 Click a suggestion below or ask me anything about cybersecurity!` 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const MAX_MESSAGES = 50; // Prevent memory issues

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    setIsTyping(true);
    setConnectionError(false);
    
    try {
      // Limit conversation history to prevent memory issues
      const recentMessages = messages.slice(-20);
      
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: [...recentMessages, { role: "user", content: userMessage }] 
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        if (response.status === 429 || response.status === 402) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Service limit reached");
        }
        throw new Error("Failed to connect to AI");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let textBuffer = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);
      setIsTyping(false);

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
          } catch (e) {
            console.warn("Failed to parse SSE chunk:", e);
            continue;
          }
        }
      }
    } catch (error: any) {
      setIsTyping(false);
      if (error.name === 'AbortError') {
        console.log('Request aborted');
        return;
      }
      setConnectionError(true);
      throw error;
    }
  };

  const handleSend = async (messageText?: string) => {
    const messageToSend = messageText || input.trim();
    if (!messageToSend || isLoading) return;

    // Check message limit
    if (messages.length >= MAX_MESSAGES) {
      setMessages(prev => [...prev.slice(-40), { 
        role: "assistant", 
        content: "⚠️ Conversation limit reached. Starting fresh for better performance!" 
      }]);
    }

    setInput("");
    setShowSuggestions(false);
    setMessages(prev => [...prev, { role: "user", content: messageToSend }]);
    setIsLoading(true);

    try {
      await streamChat(messageToSend);
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: connectionError 
          ? "🔌 Connection lost. Please check your internet and try again."
          : "⚠️ " + (error.message || "Sorry, I encountered an error. Please try again.")
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([{
      role: "assistant", 
      content: `${getGreeting()}! 👋 I'm Mabior's AI Security Assistant.\n\n🛡️ I'm here to help you with:\n\n• Penetration Testing & Vulnerability Assessment\n• Security Auditing & Compliance\n• Incident Response & Forensics\n• Security Training & Awareness\n• Web & Network Security\n\n💡 Click a suggestion below or ask me anything about cybersecurity!` 
    }]);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (prompt: string) => {
    handleSend(prompt);
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
              <div className="flex items-center gap-2">
                {messages.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearChat}
                    className="text-green-400/70 hover:text-green-300 hover:bg-green-500/20 text-xs"
                  >
                    Clear
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-green-400 hover:text-green-300 hover:bg-green-500/20 transition-all duration-300"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
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
                
                {/* Suggested Prompts */}
                {showSuggestions && messages.length === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="grid grid-cols-2 gap-3 mt-6"
                  >
                    {suggestedPrompts.map((suggestion, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion.prompt)}
                        className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 hover:from-green-500/20 hover:to-green-600/10 border border-green-500/30 hover:border-green-400/50 rounded-xl transition-all duration-300 group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="flex items-center gap-3">
                          <suggestion.icon className="h-5 w-5 text-green-400 group-hover:text-green-300 transition-colors" />
                          <span className="text-sm text-green-400 group-hover:text-green-300 font-medium transition-colors">
                            {suggestion.text}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
                
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gradient-to-br from-green-900/30 to-black/50 p-4 rounded-2xl border border-green-500/20 flex items-center gap-3">
                      <div className="flex gap-1">
                        <motion.div 
                          className="w-2 h-2 bg-green-400 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div 
                          className="w-2 h-2 bg-green-400 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div 
                          className="w-2 h-2 bg-green-400 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                      <span className="text-green-400 text-sm">AI is thinking...</span>
                    </div>
                  </motion.div>
                )}
                
                {isLoading && !isTyping && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gradient-to-br from-green-900/30 to-black/50 p-4 rounded-2xl border border-green-500/20 flex items-center gap-3">
                      <Loader2 className="h-4 w-4 animate-spin text-green-400" />
                      <span className="text-green-400 text-sm">Processing...</span>
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
                  placeholder="Ask me anything about cybersecurity..."
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
              <div className="flex items-center justify-center gap-2 mt-3">
                <Sparkles className="h-3 w-3 text-green-500 animate-pulse" />
                <p className="text-green-600 text-xs text-center">
                  Powered by Advanced AI • 24/7 Security Insights
                </p>
                <Sparkles className="h-3 w-3 text-green-500 animate-pulse" />
              </div>
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
