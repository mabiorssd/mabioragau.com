import { useState, useEffect, useRef } from "react";

interface TerminalLine {
  type: "command" | "output" | "prompt";
  content: string;
  timestamp?: Date;
}

export const Terminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: "Welcome to Mabior Agau's Portfolio Terminal" },
    { type: "output", content: "Type 'help' to see available commands" },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = {
    help: () => [
      "Available commands:",
      "  whoami     - Display information about Mabior Agau",
      "  skills     - Show technical skills and expertise",
      "  projects   - List recent projects and work",
      "  contact    - Get contact information",
      "  blog       - Access blog posts",
      "  clear      - Clear the terminal",
      "  exit       - Close terminal (refresh page)",
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

  return (
    <div 
      className="min-h-screen bg-black text-green-400 font-mono text-sm p-4 cursor-text"
      onClick={handleTerminalClick}
    >
      <div 
        ref={terminalRef}
        className="max-w-4xl mx-auto min-h-screen overflow-y-auto"
      >
        {/* Terminal Header */}
        <div className="mb-4 text-gray-500">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-xs">Terminal - Mabior Agau Portfolio</span>
          </div>
          <div className="border-t border-gray-800 pt-2"></div>
        </div>

        {/* Terminal Output */}
        <div className="space-y-1">
          {lines.map((line, index) => (
            <div key={index} className={`
              ${line.type === "command" ? "text-white" : ""}
              ${line.type === "output" ? "text-green-400" : ""}
              ${line.type === "prompt" ? "text-blue-400" : ""}
            `}>
              {line.content}
            </div>
          ))}
          
          {isProcessing && (
            <div className="text-yellow-400">Processing...</div>
          )}

          {/* Current Input Line */}
          <form onSubmit={handleSubmit} className="flex items-center">
            <span className="text-blue-400 mr-2">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              className="bg-transparent outline-none flex-1 text-white caret-green-400"
              disabled={isProcessing}
              autoComplete="off"
              spellCheck="false"
            />
            <span className="animate-pulse text-green-400 ml-1">▋</span>
          </form>
        </div>
      </div>
    </div>
  );
};