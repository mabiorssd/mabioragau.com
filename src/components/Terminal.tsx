import { useState, useEffect, useRef } from "react";
import { Sparkles, User, Code, Briefcase, Mail, BookOpen, HelpCircle, RotateCcw } from "lucide-react";

interface TerminalLine {
  type: "command" | "output" | "prompt" | "welcome" | "hint";
  content: string;
  timestamp?: Date;
}

export const Terminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "welcome", content: "🚀 Welcome to Mabior Agau's Interactive Portfolio" },
    { type: "welcome", content: "✨ Discover my skills, projects, and expertise through simple commands" },
    { type: "hint", content: "💡 Try typing any command below to get started!" },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickCommands = [
    { cmd: "whoami", icon: User, desc: "About me" },
    { cmd: "skills", icon: Code, desc: "My skills" },
    { cmd: "projects", icon: Briefcase, desc: "My work" },
    { cmd: "contact", icon: Mail, desc: "Get in touch" },
    { cmd: "blog", icon: BookOpen, desc: "Read articles" },
    { cmd: "help", icon: HelpCircle, desc: "All commands" },
  ];

  const commands = {
    help: () => [
      "🎯 Available Commands:",
      "",
      "  👤 whoami     - Learn about Mabior Agau",
      "  💻 skills     - Explore technical expertise",
      "  🚀 projects   - View recent work and projects",
      "  📧 contact    - Get contact information",
      "  📚 blog       - Read technical articles",
      "  🗑️  clear      - Clear the screen",
      "  🔄 exit       - Refresh the page",
      "",
      "💡 Tip: Click on any command button below or type manually!",
    ],
    whoami: () => [
      "Mabior Agau - Software Engineer & Security Specialist",
      "",
      "Location: South Sudan",
      "Focus: Full-stack development, cybersecurity, and blockchain",
      "Experience: Building secure web applications and network solutions",
      "",
      "Passionate about creating innovative solutions and sharing knowledge",
      "through technical writing and community engagement.",
    ],
    skills: () => [
      "Technical Skills:",
      "",
      "Languages:",
      "  • JavaScript/TypeScript • Python • Solidity",
      "  • PHP • HTML/CSS • SQL",
      "",
      "Frameworks & Libraries:",
      "  • React • Next.js • Node.js • Express",
      "  • Laravel • Django • Web3.js",
      "",
      "Security & Infrastructure:",
      "  • Network Security • Penetration Testing",
      "  • Docker • Linux Administration",
      "  • Blockchain Development",
    ],
    projects: () => [
      "Recent Projects:",
      "",
      "1. Secure Web Application Framework",
      "   → Built with React, TypeScript, and Supabase",
      "   → Implements advanced security features",
      "",
      "2. Blockchain Voting System",
      "   → Smart contracts on Ethereum",
      "   → Transparent and tamper-proof elections",
      "",
      "3. Network Security Tool",
      "   → Automated vulnerability scanning",
      "   → Real-time threat detection",
      "",
      "Type 'blog' to read detailed case studies",
    ],
    contact: () => [
      "Contact Information:",
      "",
      "Email: mabior@example.com",
      "LinkedIn: linkedin.com/in/mabior-agau",
      "GitHub: github.com/mabioragau",
      "Twitter: @mabioragau",
      "",
      "Available for freelance projects and consulting",
      "Response time: Usually within 24 hours",
    ],
    blog: () => [
      "Technical Blog:",
      "",
      "Latest posts:",
      "  • Advanced React Security Patterns",
      "  • Building Scalable APIs with Node.js", 
      "  • Blockchain Security Best Practices",
      "",
      "Visit /blog for full articles and tutorials",
      "Topics: Web development, security, blockchain, tutorials",
    ],
    clear: () => {
      setLines([]);
      return [];
    },
    exit: () => {
      window.location.reload();
      return [];
    },
  };

  const processCommand = async (input: string) => {
    const trimmedInput = input.trim().toLowerCase();
    
    // Add the command to history
    setLines(prev => [...prev, { 
      type: "command", 
      content: `$ ${input}`,
      timestamp: new Date()
    }]);

    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (trimmedInput === "") {
      setIsProcessing(false);
      return;
    }

    const command = commands[trimmedInput as keyof typeof commands];
    
    if (command) {
      const output = command();
      if (Array.isArray(output)) {
        setLines(prev => [...prev, ...output.map(line => ({ 
          type: "output" as const, 
          content: line 
        }))]);
      }
    } else {
      setLines(prev => [...prev, { 
        type: "output", 
        content: `Command not found: ${trimmedInput}. Type 'help' for available commands.` 
      }]);
    }
    
    setIsProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim() && !isProcessing) {
      processCommand(currentInput);
      setCurrentInput("");
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input on mount and click
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleQuickCommand = (cmd: string) => {
    setCurrentInput(cmd);
    processCommand(cmd);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-green-400 p-4">
      <div className="max-w-6xl mx-auto min-h-screen">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center space-x-2 mb-4 bg-gray-800/50 rounded-lg px-4 py-2 border border-gray-700">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: "1s" }}></div>
            <Sparkles className="w-4 h-4 ml-2 text-blue-400" />
            <span className="text-white font-medium">Mabior Agau - Interactive Portfolio</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Terminal Window */}
          <div className="lg:col-span-2 bg-gray-900/50 rounded-lg border border-gray-700 backdrop-blur-sm">
            <div className="p-4 border-b border-gray-700 bg-gray-800/30">
              <div className="text-sm text-gray-400">Portfolio Terminal</div>
            </div>
            
            <div 
              ref={terminalRef}
              className="p-4 font-mono text-sm h-96 overflow-y-auto space-y-2 cursor-text"
              onClick={handleTerminalClick}
            >
              {lines.map((line, index) => (
                <div key={index} className={`
                  transition-opacity duration-300
                  ${line.type === "command" ? "text-cyan-300 bg-gray-800/30 px-2 py-1 rounded" : ""}
                  ${line.type === "output" ? "text-green-400 pl-4" : ""}
                  ${line.type === "welcome" ? "text-blue-300 font-semibold text-base" : ""}
                  ${line.type === "hint" ? "text-yellow-300 italic" : ""}
                `}>
                  {line.content}
                </div>
              ))}
              
              {isProcessing && (
                <div className="text-yellow-400 animate-pulse">⚡ Processing command...</div>
              )}

              {/* Input Line */}
              <form onSubmit={handleSubmit} className="flex items-center pt-2">
                <span className="text-blue-400 mr-2 font-bold">➜</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="Type a command or click a button..."
                  className="bg-transparent outline-none flex-1 text-white caret-green-400 placeholder-gray-500"
                  disabled={isProcessing}
                  autoComplete="off"
                  spellCheck="false"
                />
                <span className="animate-pulse text-green-400 ml-1">▋</span>
              </form>
            </div>
          </div>

          {/* Quick Commands Panel */}
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-lg border border-gray-700 backdrop-blur-sm p-4">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <HelpCircle className="w-4 h-4 mr-2 text-blue-400" />
                Quick Commands
              </h3>
              <div className="space-y-2">
                {quickCommands.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.cmd}
                      onClick={() => handleQuickCommand(cmd.cmd)}
                      disabled={isProcessing}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 border border-gray-700 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <Icon className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
                      <div className="text-left">
                        <div className="text-white font-mono text-sm">{cmd.cmd}</div>
                        <div className="text-gray-400 text-xs">{cmd.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg border border-gray-700 backdrop-blur-sm p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                How to Use
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span className="text-gray-300">Click any button to run a command</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span className="text-gray-300">Type commands manually in the terminal</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span className="text-gray-300">Start with 'help' to see all options</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-700/30 backdrop-blur-sm p-4">
              <h3 className="text-blue-300 font-semibold mb-2">💡 Pro Tip</h3>
              <p className="text-blue-200 text-sm">
                This is an interactive portfolio! Each command reveals different aspects of my work and expertise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};