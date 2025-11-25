import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  type: 'ai' | 'user' | 'options';
  content: string;
  options?: NavigationOption[];
  timestamp: Date;
}

interface NavigationOption {
  label: string;
  section: string;
  description: string;
}

const navigationOptions: NavigationOption[] = [
  { label: "INIT_PROFILE", section: "about", description: "Initialize user profile scan" },
  { label: "LIST_CAPABILITIES", section: "services", description: "Display available services" },
  { label: "SHOW_SKILLSET", section: "skills", description: "Enumerate technical stack" },
  { label: "VIEW_OPERATIONS", section: "projects", description: "Access operation archives" },
  { label: "INTEL_FEED", section: "news", description: "Security intelligence stream" },
  { label: "BLOG_ACCESS", section: "blog", description: "Knowledge base entries" },
  { label: "ESTABLISH_COMMS", section: "contact", description: "Open secure channel" },
];

const hackerResponses = {
  greeting: `> System initialized. Welcome to the mainframe, operative.
> I'm your tactical advisor for navigating this network.
> All systems armed and ready. What's your objective?`,
  
  about: `> Running profile initialization sequence...
> Target acquired. Scrolling to intel dossier...`,
  
  services: `> Accessing capability matrix...
> Enumeration complete. Displaying offensive and defensive protocols...`,
  
  skills: `> Compiling technical arsenal...
> Decrypting skill tree. Stand by for full disclosure...`,
  
  projects: `> Breaching operation archives...
> Mission logs unlocked. Loading classified operations...`,
  
  news: `> Tapping into global security intelligence...
> Real-time threat feed incoming...`,
  
  blog: `> Accessing knowledge repository...
> Decoding tactical briefings and field reports...`,
  
  contact: `> Establishing secure communication channel...
> Encryption protocols active. Ready for transmission...`,
  
  followUp: [
    `> Solid choice, operative. Need anything else from the network?`,
    `> Intel delivered. What's your next move?`,
    `> Command executed. Standing by for further instructions.`,
    `> Data retrieved. Ready for your next query.`,
  ]
};

export const ConversationalInterface = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // Initial greeting
    setTimeout(() => {
      typeMessage('ai', hackerResponses.greeting, true);
    }, 500);

    // Cursor blink
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const typeMessage = (type: 'ai' | 'user', content: string, showOptions: boolean = false) => {
    setIsTyping(true);
    
    // Simulate typing delay
    setTimeout(() => {
      const newMessage: Message = {
        type,
        content,
        timestamp: new Date(),
        ...(showOptions && { options: navigationOptions })
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 300);
  };

  const handleOptionClick = (option: NavigationOption) => {
    // Add user selection
    setMessages(prev => [...prev, {
      type: 'user',
      content: `> ${option.label}`,
      timestamp: new Date()
    }]);

    // AI response
    const response = hackerResponses[option.section as keyof typeof hackerResponses] as string;
    typeMessage('ai', response, false);

    // Smooth scroll to section after brief delay
    setTimeout(() => {
      const element = document.getElementById(option.section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      // Show follow-up after scroll
      setTimeout(() => {
        const followUp = hackerResponses.followUp[Math.floor(Math.random() * hackerResponses.followUp.length)];
        typeMessage('ai', followUp, true);
      }, 1500);
    }, 800);
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-green-500/20 border-2 border-green-500 text-green-400 hover:bg-green-500/30 hover:text-green-300 shadow-lg shadow-green-500/50"
          size="lg"
        >
          <Terminal className="w-5 h-5 mr-2" />
          Open Terminal
          <Maximize2 className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black flex flex-col"
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/90 border-b-2 border-green-500/50">
        <div className="flex items-center gap-3">
          <Terminal className="w-6 h-6 text-green-400 animate-pulse" />
          <div className="font-mono">
            <div className="text-green-400 text-sm font-bold tracking-wider">
              TACTICAL_TERMINAL_v2.1.0
            </div>
            <div className="text-green-600 text-xs">
              {new Date().toISOString().split('T')[0]} | CONN_STATUS: SECURE
            </div>
          </div>
        </div>
        
        <Button
          onClick={() => setIsMinimized(true)}
          variant="ghost"
          size="sm"
          className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
        >
          <Minimize2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Terminal Content */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-6 font-mono">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {message.type === 'ai' ? (
                  <div className="text-green-400">
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                    
                    {message.options && (
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {message.options.map((option, idx) => (
                          <motion.button
                            key={idx}
                            onClick={() => handleOptionClick(option)}
                            className="text-left p-4 bg-black/50 border border-green-500/30 hover:border-green-400 hover:bg-green-500/10 transition-all rounded group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="text-green-400 font-bold mb-1 group-hover:text-green-300">
                              {option.label}
                            </div>
                            <div className="text-green-600 text-sm">
                              {option.description}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-cyan-400 ml-8">
                    {message.content}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-400 flex items-center gap-2"
            >
              <span>Calculating</span>
              <span className="animate-pulse">...</span>
            </motion.div>
          )}

          {/* Blinking cursor when at rest */}
          {!isTyping && messages.length > 0 && (
            <div className="text-green-400 flex items-center">
              <span className="mr-2">{'>'}</span>
              <span className={`inline-block w-2 h-4 bg-green-400 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Scanlines effect */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent opacity-30 animate-pulse" />
      
      {/* Grid background */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, .05) 25%, rgba(0, 255, 0, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .05) 75%, rgba(0, 255, 0, .05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, .05) 25%, rgba(0, 255, 0, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .05) 75%, rgba(0, 255, 0, .05) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </motion.div>
  );
};
