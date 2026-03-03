import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Scale, Plus, Send, Upload, FileDown, Sparkles } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type Mode = "simple" | "professional";

const SUGGESTIONS = [
  "Explain this NDA clause in simple terms",
  "What are the risks in this employment contract?",
  "Summarize the key points of GDPR compliance",
  "Draft a cease and desist letter template",
];

const getMockResponse = (message: string, mode: Mode): string => {
  const isSimple = mode === "simple";
  if (message.toLowerCase().includes("nda")) {
    return isSimple
      ? "An NDA (Non-Disclosure Agreement) is basically a promise to keep secrets. It says: \"I won't share your private information with anyone.\" If you break this promise, there can be legal consequences like fines or lawsuits.\n\n**Key things to look for:**\n- How long does the secrecy last?\n- What counts as \"confidential\"?\n- What happens if you accidentally share something?"
      : "A Non-Disclosure Agreement (NDA) constitutes a legally binding contract establishing a confidential relationship between parties.\n\n**Material Terms to Evaluate:**\n1. **Scope of Confidential Information** — Ensure precise definition under §2\n2. **Duration of Obligation** — Typical range: 2-5 years post-termination\n3. **Permitted Disclosures** — Carve-outs for legal compliance\n4. **Remedies** — Injunctive relief provisions and liquidated damages\n\n*Citation: Uniform Trade Secrets Act (UTSA) §1(4)*";
  }
  if (message.toLowerCase().includes("contract") || message.toLowerCase().includes("employment")) {
    return isSimple
      ? "When reviewing an employment contract, watch out for:\n\n🔴 **Non-compete clauses** — Could stop you from working in your field\n🔴 **IP assignment** — Your employer might own everything you create\n🔴 **At-will termination** — They can let you go anytime\n\nAlways negotiate before signing!"
      : "Employment contract risk assessment requires analysis across multiple dimensions:\n\n**High-Priority Risk Vectors:**\n\n1. **Restrictive Covenants (§7-9)**\n   - Non-compete geographic/temporal scope\n   - Non-solicitation provisions\n   - Enforceability varies by jurisdiction\n\n2. **Intellectual Property Assignment (§12)**\n   - Work-for-hire doctrine applicability\n   - Pre-existing IP carve-outs\n\n3. **Termination Provisions (§15)**\n   - Severance triggers and calculations\n   - Change-of-control provisions";
  }
  if (message.toLowerCase().includes("gdpr")) {
    return isSimple
      ? "GDPR is Europe's big privacy law:\n\n✅ People own their data\n✅ Companies must ask permission to use it\n✅ People can ask to have their data deleted\n✅ Data breaches must be reported within 72 hours\n\nFines can reach up to 4% of global revenue."
      : "The General Data Protection Regulation (EU 2016/679) establishes comprehensive data protection requirements:\n\n**Core Compliance Framework:**\n\n| Principle | Article | Requirement |\n|-----------|---------|-------------|\n| Lawfulness | Art. 6 | Valid legal basis |\n| Purpose Limitation | Art. 5(1)(b) | Specified purposes |\n| Data Minimization | Art. 5(1)(c) | Adequate, relevant, limited |\n\n**Enforcement:**\n- Tier 1: Up to €10M or 2% global turnover\n- Tier 2: Up to €20M or 4% global turnover\n\n*Reference: EDPB Guidelines 07/2020*";
  }
  return isSimple
    ? "I've analyzed your query. The key principle is that contracts require **offer, acceptance, and consideration** to be valid.\n\nWould you like me to go deeper into any specific aspect?"
    : "Upon analysis, the matter falls under general contract law principles, specifically mutual assent (*Restatement (Second) of Contracts §17*) and adequate consideration.\n\n**Recommendation:** Please provide:\n1. Relevant jurisdiction\n2. Specific contractual provisions\n3. Factual circumstances";
};

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<Mode>("simple");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

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

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const aiMsg: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: getMockResponse(content, mode),
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
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
  };

  const handleExport = () => {
    const text = messages
      .map((m) => `[${m.role.toUpperCase()}]\n${m.content}\n`)
      .join("\n---\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "legal-ai-conversation.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden bg-noise">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-radial-glow" />

      {/* Top nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/30">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 hover:opacity-70 transition-opacity duration-500"
        >
          <div className="w-8 h-8 rounded-xl glass-card flex items-center justify-center">
            <Scale className="w-3.5 h-3.5 text-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground tracking-tight">Legal AI Nexus</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Mode toggle */}
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
              <div className="w-16 h-16 rounded-3xl glass-card flex items-center justify-center mb-7 animate-glow-pulse">
                <Sparkles className="w-7 h-7 text-foreground/80" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">
                Legal AI Nexus
              </h2>
              <p className="text-muted-foreground mb-12 max-w-md text-sm font-light leading-relaxed">
                Ask any legal question, analyze contracts, or get case research insights.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
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
      <div className="relative z-10 border-t border-border/30 bg-background/60 backdrop-blur-2xl">
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
              placeholder="Ask a legal question..."
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

          <p className="text-[10px] text-muted-foreground/25 text-center mt-3 tracking-wide">
            Legal AI Nexus provides AI-generated legal information, not legal advice. Built by Monish Kumar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
