import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Sparkles, Terminal, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIOrb, AIWaveform } from "./soc/AIOrb";
import { getCopilotContext, subscribeCopilotContext } from "@/lib/copilotContext";

type Message = { role: "user" | "assistant"; content: string; id?: string };

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

const MAX_MESSAGES = 50;
const MAX_CHARS = 10_000;
/** If no SSE data arrives within this many ms, abort the stream */
const STREAM_IDLE_TIMEOUT = 15_000;

const initialMessage = (): Message => ({
  role: "assistant",
  content:
    "Hi, I'm Mabior's AI assistant. I can help you understand my services, answer questions about my work, or guide you to the right contact.\n\nTry asking about:\n▸ **Services** — what I offer\n▸ **Experience** — background and skills\n▸ **Contact** — how to reach me\n\nOr just ask anything.",
});

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage()]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [ctxTitle, setCtxTitle] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<Message[]>(messages);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamIdleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { messagesRef.current = messages; }, [messages]);

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener("copilot:open", open);
    return () => window.removeEventListener("copilot:open", open);
  }, []);

  useEffect(() => { const u = subscribeCopilotContext((c) => setCtxTitle(c?.title ?? null)); return () => { u(); }; }, []);

  // Backdrop — no body scroll lock (fixes mobile freeze)
  const toggleOpen = () => {
    setIsOpen((o) => !o);
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Auto-focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  /** Reset the stream-idle watchdog — call on every data chunk */
  const resetStreamWatchdog = () => {
    if (streamIdleRef.current) clearTimeout(streamIdleRef.current);
    streamIdleRef.current = setTimeout(() => {
      console.warn("[Chatbot] Stream idle timeout — aborting");
      abortRef.current?.abort();
      // Show a message so the user knows what happened
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === "assistant" && !last.content) {
          next[next.length - 1] = { role: "assistant", content: "⚠️ Stream timed out. Please try again." };
        }
        return next;
      });
    }, STREAM_IDLE_TIMEOUT);
  };

  const streamChat = async (userMessage: string) => {
    const supabaseUrl = "https://zrvzcsdxbhzwfabvndbo.supabase.co";
    const url = `${supabaseUrl}/functions/v1/ai-contact-chat`;
    abortRef.current = new AbortController();
    setIsTyping(true);

    // Guard: max messages (fix #3)
    if (messagesRef.current.length >= MAX_MESSAGES) {
      throw new Error("Message limit reached. Please start a new conversation.");
    }

    // Use messagesRef (ref, not stale closure) instead of closure messages (fix #1)
    const recent = messagesRef.current.slice(-19);

    // Build page context — tell the AI what the user is currently viewing
    const ctx = getCopilotContext();
    const pageContext = [
      `URL: ${window.location.pathname}`,
      `Page Title: ${document.title}`,
      ctx ? `Viewing: ${ctx.kind} — "${ctx.title}"` : "",
    ].filter(Boolean).join("\n");
    const copilotContext = ctx ? `${ctx.kind}: "${ctx.title}"\n\nContent preview:\n${ctx.body.slice(0, 1500)}` : "";

    // Request-level timeout (30s)
    const requestTimeoutId = setTimeout(() => abortRef.current?.abort(), 30000);

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyenZjc2R4Ymh6d2ZhYnZuZGJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3Mzk3NzgsImV4cCI6MjA1ODMxNTc3OH0.cRXvyVW6q5A0TdFPpzNt7J0npFJ8tRUUYrXmM8m07BU`,
      },
      body: JSON.stringify({
        messages: [...recent, { role: "user", content: userMessage }],
        pageContext,
        copilotContext,
      }),
      signal: abortRef.current.signal,
    });
    clearTimeout(requestTimeoutId); // request arrived — clear the request timeout

    // --- Handle non-streaming (JSON) error responses ---
    const contentType = resp.headers.get("content-type") || "";
    if (!resp.ok || contentType.includes("json")) {
      let errMsg = "Connection to Co-Pilot failed.";
      try {
        const body = await resp.json();
        errMsg = body.error || errMsg;
      } catch { /* use default */ }
      if (resp.status === 429) errMsg = "Rate limit reached. Please try again shortly.";
      if (resp.status === 402) errMsg = "AI credits exhausted. Please contact admin.";
      throw new Error(errMsg);
    }
    if (!resp.body) throw new Error("Empty response stream.");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let assistant = "";
    let buf = "";
    setMessages((p) => [...p, { role: "assistant", content: "" }]);
    setIsTyping(false);

    // Start the stream-level watchdog now
    resetStreamWatchdog();

    // (fix #4) try/catch around streaming loop
    try {
      readLoop: while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Data arrived — reset watchdog
        resetStreamWatchdog();

        buf += decoder.decode(value, { stream: true });

        // (fix #6) simpler line-by-line SSE parser — split-based, can't infinite loop
        const lines = buf.split("\n");
        buf = lines.pop() || "";

        for (const rawLine of lines) {
          let line = rawLine;
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") break readLoop;
          try {
            const parsed = JSON.parse(payload);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              assistant += delta;
              // (fix #5) MAX_CHARS guard
              if (assistant.length > MAX_CHARS) break readLoop;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { role: "assistant", content: assistant };
                return next;
              });
            }
          } catch {
            // skip malformed lines — can't hang anymore
          }
        }
      }
    } catch (e: any) {
      // AbortError is expected when we time out — show what we have
      if (e.name === "AbortError") {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === "assistant" && !last.content) {
            next[next.length - 1] = { role: "assistant", content: assistant || "⚠️ Request cancelled." };
          } else if (assistant && last?.role === "assistant") {
            next[next.length - 1] = { role: "assistant", content: assistant };
          }
          return next;
        });
        return; // don't set error for AbortError
      }
      console.error("Stream parse error:", e);
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: assistant || "⚠️ Stream interrupted.",
        };
        return next;
      });
    } finally {
      if (streamIdleRef.current) clearTimeout(streamIdleRef.current);
      streamIdleRef.current = null;
    }
  };

  const summarizeContext = () => {
    const ctx = getCopilotContext();
    if (!ctx) return;
    const synthetic =
      `Summarize the following ${ctx.kind} for a busy reader in 4-6 bullet points, ` +
      `then close with a one-line "key takeaway".\n\n` +
      `TITLE: ${ctx.title}\n\nCONTENT:\n${ctx.body}`;
    setMessages((p) => [
      ...p,
      { role: "user", content: `Summarize "${ctx.title}"` },
    ]);
    setIsLoading(true);
    streamChat(synthetic)
      .catch((e: any) => {
        if (e.name === "AbortError") return;
        setMessages((p) => [...p, { role: "assistant", content: `⚠️ ${e.message ?? "Error."}` }]);
      })
      .finally(() => { setIsLoading(false); setIsTyping(false); });
  };

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isLoading) return;
    setInput("");

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
      {/* Floating launcher — smaller on mobile */}
      <motion.button
        onClick={toggleOpen}
        aria-label="Open Cyber Co-Pilot"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 glass-panel rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 hover:border-primary/50 transition-colors"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{ boxShadow: "var(--shadow-glow)" }}
      >
        <AIOrb size={28} />
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

      {/* Slide-out panel — fullscreen mobile, 440px sidebar desktop */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed inset-0 sm:top-0 sm:right-0 sm:bottom-0 sm:left-auto sm:w-[440px] z-50 flex flex-col glass-panel sm:border-l sm:border-primary/20 rounded-none overflow-hidden"
            style={{ boxShadow: "-20px 0 60px hsl(var(--background) / 0.6)" }}
            onKeyDown={(e) => { if (e.key === "Escape") { setIsOpen(false); abortRef.current?.abort(); } }}
          >
            {/* Header */}
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-border flex items-center gap-3 pt-[max(env(safe-area-inset-top),0.75rem)]">
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
                aria-label="Close Cyber Co-Pilot"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 overflow-y-auto" ref={scrollRef as any}>
              <div className="p-5 space-y-4">
                {messages.map((m, index) => (
                  <motion.div
                    key={m.id || index}
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

            {ctxTitle && (
              <div className="px-4 sm:px-5 pt-3 border-t border-border">
                <button
                  onClick={summarizeContext}
                  disabled={isLoading}
                  className="w-full flex items-center gap-2 px-3 py-2.5 min-h-[44px] rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/15 hover:border-primary/50 transition-colors text-xs font-mono disabled:opacity-50"
                >
                  <FileSearch className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate text-left flex-1">Summarize: {ctxTitle}</span>
                </button>
              </div>
            )}

            {/* Quick commands */}
            <div className="px-4 sm:px-5 pt-3 pb-2 border-t border-border">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                Quick Commands
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_COMMANDS.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => send(q.prompt)}
                    disabled={isLoading}
                    className="tech-pill hover:bg-primary/15 hover:border-primary/50 transition-colors disabled:opacity-50 min-h-[36px]"
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
                  ref={inputRef}
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
