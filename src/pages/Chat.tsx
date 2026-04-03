import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Scale, Plus, Send, Upload, FileDown, Sparkles } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import DoodleAnimals from "@/components/DoodleAnimals";

type Source = {
  act: string;
  section: string;
  title: string;
  file: string;
  similarity: number;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: Source[];
  expandedQuery?: string;
};

type Mode = "simple" | "professional";

const SUGGESTIONS = [
  "I was scammed online, how do I file an FIR?",
  "I bought a defective product, where do I file a consumer complaint?",
  "What are my rights as a tenant in India?",
  "I need to draft a legal notice for non-payment",
  "Find me a cyber crime lawyer",
];

const Chat = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem("lexguide-messages");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<Mode>("simple");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    try {
      localStorage.setItem("lexguide-messages", JSON.stringify(messages));
    } catch {
      // storage full or unavailable — fail silently
    }
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = text || input.trim();
    if (!content) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`http://${window.location.hostname}:8000/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: content,
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date(),
        sources: data.sources || [],
        expandedQuery: data.expanded_query || "",
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Sorry, I couldn't reach the legal database. Please make sure the backend server is running.",
        timestamp: new Date(),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    localStorage.removeItem("lexguide-messages");
  };

  const handleExport = () => {
    const text = messages
      .map((m) => `[${m.role.toUpperCase()}]\n${m.content}\n`)
      .join("\n---\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lexguide-conversation.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      <DoodleAnimals />

      {/* Top nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/50">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 hover:opacity-70 transition-opacity duration-500"
        >
          <div className="w-8 h-8 rounded-xl glass-card flex items-center justify-center">
            <Scale className="w-3.5 h-3.5 text-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground tracking-tight">
            LexGuide AI
          </span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center glass-card rounded-2xl p-1 text-xs">
            <button
              onClick={() => setMode("simple")}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-500 ${
                mode === "simple"
                  ? "bg-foreground/10 text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Simple
            </button>
            <button
              onClick={() => setMode("professional")}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-500 ${
                mode === "professional"
                  ? "bg-foreground/10 text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Professional
            </button>
          </div>

          {messages.length > 0 && (
            <button
              onClick={handleExport}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all duration-500"
              title="Export conversation"
            >
              <FileDown className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-card text-xs text-muted-foreground hover:text-foreground transition-all duration-500 glow-hover"
          >
            <Plus className="w-3.5 h-3.5" />
            New Chat
          </button>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="w-16 h-16 rounded-3xl glass-card flex items-center justify-center mb-7">
                <Sparkles className="w-7 h-7 text-foreground/60" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">
                LexGuide AI
              </h2>
              <p className="text-muted-foreground mb-12 max-w-md text-sm font-light leading-relaxed">
                Your digital legal consultant. Ask about laws, file complaints,
                or generate legal documents.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.4 + i * 0.1,
                      duration: 0.5,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                    onClick={() => handleSend(s)}
                    className="text-left p-4 rounded-2xl glass-card text-xs text-muted-foreground hover:text-foreground transition-all duration-500 glow-hover leading-relaxed"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </AnimatePresence>
          )}

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="relative z-10 border-t border-border/50 bg-background/80 backdrop-blur-2xl">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="glass-card rounded-2xl p-3 flex items-end gap-3 glow-hover">
            <button
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all duration-500 shrink-0"
              title="Upload document"
            >
              <Upload className="w-5 h-5" />
            </button>

            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your legal issue..."
              rows={1}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/40 text-sm resize-none outline-none py-2.5 max-h-32 leading-relaxed"
              style={{ minHeight: "24px" }}
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="p-2.5 rounded-xl bg-foreground text-background disabled:opacity-20 hover:opacity-80 transition-all duration-500 shrink-0 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <p className="text-[10px] text-muted-foreground/30 text-center mt-3 tracking-wide">
            LexGuide AI provides AI-generated legal information, not legal
            advice. Built by Monish Kumar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;