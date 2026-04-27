import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Sparkles, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIOrb, AIWaveform } from "./soc/AIOrb";

type Message = { role: "user" | "assistant"; content: string };

const QUICK_COMMANDS = [
  { label: "VET", prompt: "__hotkey__:VET" },
  { label: "NCA", prompt: "__hotkey__:NCA" },
  { label: "SKILLS", prompt: "__hotkey__:SKILLS" },
  { label: "CONTACT", prompt: "__hotkey__:CONTACT" },
  { label: "/Check_Services", prompt: "What cybersecurity services do you offer?" },
  { label: "/View_Projects", prompt: "Tell me about your most impressive projects." },
];

const HOTKEY_RESPONSES: Record<string, string> = {
  VET:
    "**CREDENTIAL VERIFICATION — Mabior Agau**\n\n" +
    "▸ Role: Penetration Tester · CSIRT Operator\n" +
    "▸ Org: National Communication Authority (NCA), South Sudan\n" +
    "▸ Base: Juba, South Sudan\n" +
    "▸ Domain focus: telecom infrastructure, web app security, red team simulation\n" +
    "▸ Years operational: 6+\n" +
    "▸ Public channels: github.com/mabiorssd · linkedin/in/mabior-agau-436825210\n\n" +
    "Status: VERIFIED · Channel: SECURE",
  NCA:
    "**ROLE BRIEF — National Communication Authority**\n\n" +
    "Mabior serves as Penetration Tester within the NCA's CSIRT capacity, the regulatory body overseeing South Sudan's telecommunications sector.\n\n" +
    "Mandate (public-disclosable):\n" +
    "▸ Authorized red team simulations against licensed operators\n" +
    "▸ Vulnerability assessments on national communication backbones\n" +
    "▸ Incident response coordination & threat-intel handovers\n" +
    "▸ Regulatory hardening playbooks\n\n" +
    "[TOP SECRET: AUTHORIZED ACCESS ONLY] — operational details redacted.",
  SKILLS:
    "**TACTICAL PROFICIENCY — domain map**\n\n" +
    "▸ Web App Security · 95\n" +
    "▸ Network · 92\n" +
    "▸ Social Engineering · 88\n" +
    "▸ Cloud · 84\n" +
    "▸ Cryptography · 78\n" +
    "▸ Binary / Reversing · 70\n\n" +
    "Suites: Recon, Exploitation, Forensics, Cloud & DevSec.\n" +
    "See the Arsenal radar for the full readout.",
  CONTACT:
    "**SECURE CHANNEL — Engagement Request**\n\n" +
    "▸ Email: info@mabioragau.com\n" +
    "▸ Form: scroll to /contact\n" +
    "▸ Response SLA: under 24h\n" +
    "▸ Encrypted comms available on request (PGP)\n\n" +
    "Booking Q2 engagements. State scope, target environment, and authorization context.",
};

const initialMessage = (): Message => ({
  role: "assistant",
  content:
    "System initialized. Authorized visitor detected.\n\nAccessing Mabior's operational logs…\n\n" +
    "I'm the Cyber Co-Pilot. Type a hotkey for instant intel:\n" +
    "▸ **VET** — credentials\n" +
    "▸ **NCA** — role details\n" +
    "▸ **SKILLS** — proficiency map\n" +
    "▸ **CONTACT** — secure channel\n\n" +
    "Or ask anything in natural language.",
});

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage()]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Listen for the command palette trigger
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener("copilot:open", open);
    return () => window.removeEventListener("copilot:open", open);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const streamChat = async (userMessage: string) => {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-contact-chat`;
    abortRef.current = new AbortController();
    setIsTyping(true);

    const recent = messages.slice(-20);
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: [...recent, { role: "user", content: userMessage }] }),
      signal: abortRef.current.signal,
    });

    if (!resp.ok) {
      if (resp.status === 429) throw new Error("Rate limit reached. Please try again shortly.");
      if (resp.status === 402) throw new Error("AI credits exhausted. Please contact admin.");
      throw new Error("Connection to Co-Pilot failed.");
    }
    if (!resp.body) throw new Error("Empty response stream.");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let assistant = "";
    let buf = "";
    setMessages((p) => [...p, { role: "assistant", content: "" }]);
    setIsTyping(false);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      let nl: number;
      while ((nl = buf.indexOf("\n")) !== -1) {
        let line = buf.slice(0, nl);
        buf = buf.slice(nl + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") { buf = ""; break; }
        try {
          const parsed = JSON.parse(json);
          const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (delta) {
            assistant += delta;
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = { role: "assistant", content: assistant };
              return next;
            });
          }
        } catch {
          buf = line + "\n" + buf;
          break;
        }
      }
    }
  };

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isLoading) return;
    setInput("");

    // Hotkey shortcut path — instant canned reply, no network call
    if (msg.startsWith("__hotkey__:")) {
      const key = msg.slice("__hotkey__:".length);
      setMessages((p) => [
        ...p,
        { role: "user", content: key },
        { role: "assistant", content: HOTKEY_RESPONSES[key] ?? "Unknown hotkey." },
      ]);
      return;
    }
    const upperKey = msg.toUpperCase().trim();
    if (HOTKEY_RESPONSES[upperKey]) {
      setMessages((p) => [
        ...p,
        { role: "user", content: msg },
        { role: "assistant", content: HOTKEY_RESPONSES[upperKey] },
      ]);
      return;
    }

    setMessages((p) => [...p, { role: "user", content: msg }]);
    setIsLoading(true);
    try {
      await streamChat(msg);
    } catch (e: any) {
      if (e.name === "AbortError") return;
      setMessages((p) => [...p, { role: "assistant", content: `⚠️ ${e.message ?? "Unexpected error."}` }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Open Cyber Co-Pilot"
        className="fixed bottom-6 right-6 z-50 glass-panel rounded-2xl px-4 py-3 flex items-center gap-3 hover:border-primary/50 transition-colors"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{ boxShadow: "var(--shadow-glow)" }}
      >
        <AIOrb size={32} />
        <div className="text-left hidden sm:block">
          <div className="text-[10px] font-mono uppercase tracking-widest text-primary">Cyber Co-Pilot</div>
          <div className="text-[11px] text-muted-foreground">Press ⌘K or click</div>
        </div>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/40 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Slide-out panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[440px] z-50 flex flex-col glass-panel border-l border-primary/20 rounded-none"
            style={{ boxShadow: "-20px 0 60px hsl(var(--background) / 0.6)" }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-border flex items-center gap-3">
              <AIOrb size={36} />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-widest text-primary flex items-center gap-2">
                  <Terminal className="w-3 h-3" /> SYSTEM COMMAND / AI ASSISTANT
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="status-dot" />
                  <span className="text-xs font-semibold text-foreground">Online · Cyber Co-Pilot</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => { setIsOpen(false); abortRef.current?.abort(); }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1" ref={scrollRef as any}>
              <div className="p-5 space-y-4">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/60 border border-border text-foreground"
                      }`}
                    >
                      {m.content || (m.role === "assistant" && <AIWaveform />)}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <AIWaveform bars={10} />
                    <span>analyzing…</span>
                  </div>
                )}
                {isLoading && !isTyping && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <Loader2 className="w-3 h-3 animate-spin" /> processing…
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick commands */}
            <div className="px-5 pt-3 pb-2 border-t border-border">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                Quick Commands
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_COMMANDS.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => send(q.prompt)}
                    disabled={isLoading}
                    className="tech-pill hover:bg-primary/15 hover:border-primary/50 transition-colors disabled:opacity-50"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="p-4 border-t border-border flex items-center gap-2"
            >
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono text-xs">$</span>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a command or question…"
                  disabled={isLoading}
                  className="w-full bg-secondary/50 border border-border rounded-xl pl-7 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                />
              </div>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary-glow rounded-xl h-10 w-10"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <div className="px-4 pb-3 flex items-center justify-center gap-2 text-[10px] font-mono text-muted-foreground">
              <Sparkles className="w-3 h-3 text-primary" />
              AI-assisted · Responses are advisory only
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
