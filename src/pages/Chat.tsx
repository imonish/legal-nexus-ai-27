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

// Simple mock responses for demo
const getMockResponse = (message: string, mode: Mode): string => {
  const isSimple = mode === "simple";
  if (message.toLowerCase().includes("nda")) {
    return isSimple
      ? "An NDA (Non-Disclosure Agreement) is basically a promise to keep secrets. It says: \"I won't share your private information with anyone.\" If you break this promise, there can be legal consequences like fines or lawsuits.\n\n**Key things to look for:**\n- How long does the secrecy last?\n- What counts as \"confidential\"?\n- What happens if you accidentally share something?"
      : "A Non-Disclosure Agreement (NDA) constitutes a legally binding contract establishing a confidential relationship between parties. The disclosing party shares proprietary information under the condition that the receiving party maintains strict confidentiality.\n\n**Material Terms to Evaluate:**\n1. **Scope of Confidential Information** — Ensure precise definition under §2\n2. **Duration of Obligation** — Typical range: 2-5 years post-termination\n3. **Permitted Disclosures** — Carve-outs for legal compliance (subpoena, regulatory)\n4. **Remedies** — Injunctive relief provisions and liquidated damages\n\n*Citation: Uniform Trade Secrets Act (UTSA) §1(4)*";
  }
  if (message.toLowerCase().includes("contract") || message.toLowerCase().includes("employment")) {
    return isSimple
      ? "When reviewing an employment contract, watch out for these common traps:\n\n🔴 **Non-compete clauses** — Could stop you from working in your field\n🔴 **IP assignment** — Your employer might own everything you create\n🔴 **At-will termination** — They can let you go anytime\n\nAlways negotiate before signing!"
      : "Employment contract risk assessment requires analysis across multiple dimensions:\n\n**High-Priority Risk Vectors:**\n\n1. **Restrictive Covenants (§7-9)**\n   - Non-compete geographic/temporal scope\n   - Non-solicitation of clients and employees\n   - Enforceability varies by jurisdiction (*see: Cal. Bus. & Prof. Code §16600*)\n\n2. **Intellectual Property Assignment (§12)**\n   - Work-for-hire doctrine applicability\n   - Pre-existing IP carve-outs\n   - Invention disclosure obligations\n\n3. **Termination Provisions (§15)**\n   - Severance triggers and calculations\n   - Change-of-control provisions\n   - Clawback mechanisms";
  }
  if (message.toLowerCase().includes("gdpr")) {
    return isSimple
      ? "GDPR is Europe's big privacy law. Here's what matters:\n\n✅ People own their data\n✅ Companies must ask permission to use it\n✅ People can ask to have their data deleted\n✅ Data breaches must be reported within 72 hours\n\nIf a company breaks the rules, they can be fined up to 4% of their global revenue. That's a LOT of money!"
      : "The General Data Protection Regulation (EU 2016/679) establishes comprehensive data protection requirements:\n\n**Core Compliance Framework:**\n\n| Principle | Article | Requirement |\n|-----------|---------|-------------|\n| Lawfulness | Art. 6 | Valid legal basis for processing |\n| Purpose Limitation | Art. 5(1)(b) | Specified, explicit purposes |\n| Data Minimization | Art. 5(1)(c) | Adequate, relevant, limited |\n| Accuracy | Art. 5(1)(d) | Kept up to date |\n\n**Enforcement:**\n- Tier 1: Up to €10M or 2% global turnover\n- Tier 2: Up to €20M or 4% global turnover\n\n*Reference: EDPB Guidelines 07/2020*";
  }
  return isSimple
    ? "I've analyzed your query. Here's a straightforward breakdown:\n\nThis is a common legal question. The key principle is that contracts require **offer, acceptance, and consideration** to be valid. Each party must receive something of value.\n\nWould you like me to go deeper into any specific aspect?"
    : "Upon analysis of your legal inquiry, the following assessment applies:\n\n**Legal Framework:**\nThe matter falls under general contract law principles, specifically the requirements of mutual assent (*Restatement (Second) of Contracts §17*) and adequate consideration (*Hamer v. Sidway, 124 N.Y. 538 (1891)*).\n\n**Recommendation:**\nFurther particularization of your query would enable more precise legal analysis. Please provide:\n1. Relevant jurisdiction\n2. Specific contractual provisions at issue\n3. Factual circumstances giving rise to the inquiry";
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

    // Simulate AI response delay
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
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-radial-glow opacity-40" />

      {/* Top nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/50">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
            <Scale className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">Legal AI Nexus</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Mode toggle */}
          <div className="flex items-center glass rounded-xl p-1 text-xs">
            <button
              onClick={() => setMode("simple")}
              className={`px-3 py-1.5 rounded-lg transition-all duration-300 ${
                mode === "simple"
                  ? "bg-primary/20 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Simple
            </button>
            <button
              onClick={() => setMode("professional")}
              className={`px-3 py-1.5 rounded-lg transition-all duration-300 ${
                mode === "professional"
                  ? "bg-primary/20 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Professional
            </button>
          </div>

          {messages.length > 0 && (
            <button
              onClick={handleExport}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300"
              title="Export conversation"
            >
              <FileDown className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-3 py-2 rounded-xl glass text-sm text-muted-foreground hover:text-foreground transition-all duration-300 glow-hover"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-6">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Legal AI Nexus
              </h2>
              <p className="text-muted-foreground mb-10 max-w-md">
                Ask any legal question, analyze contracts, or get case research insights.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                    onClick={() => handleSend(s)}
                    className="text-left p-4 rounded-xl glass text-sm text-muted-foreground hover:text-foreground transition-all duration-300 glow-hover leading-relaxed"
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

      {/* Input area */}
      <div className="relative z-10 border-t border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="glass rounded-2xl p-3 flex items-end gap-3 glow-hover transition-all duration-400">
            <button
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300 shrink-0"
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
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/60 text-sm resize-none outline-none py-2.5 max-h-32 leading-relaxed"
              style={{ minHeight: "24px" }}
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="p-2.5 rounded-xl bg-primary text-primary-foreground disabled:opacity-30 hover:opacity-90 transition-all duration-300 shrink-0 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <p className="text-[11px] text-muted-foreground/40 text-center mt-3">
            Legal AI Nexus provides AI-generated legal information, not legal advice. Built by Monish Kumar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
