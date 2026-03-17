import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Scale, Plus, Send, Upload, FileDown, Sparkles } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import DoodleAnimals from "@/components/DoodleAnimals";
import { getMockResponse } from "@/data/mockResponses";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type Mode = "simple" | "professional";

const SUGGESTIONS = [
  "How do I file an FIR for online fraud?",
  "Where do I file a consumer complaint?",
  "What are my rights as a tenant?",
  "Draft a legal notice for non-payment",
];

const getMockResponse = (message: string, mode: Mode): string => {
  const isSimple = mode === "simple";
  if (message.toLowerCase().includes("fir") || message.toLowerCase().includes("fraud")) {
    return isSimple
      ? "Here's how to file an FIR for online fraud:\n\n**Step 1:** Collect all evidence — screenshots, transaction IDs, emails\n**Step 2:** Visit the National Cyber Crime Portal at cybercrime.gov.in\n**Step 3:** Register your complaint online\n**Step 4:** Visit your nearest police station with printed evidence\n**Step 5:** Request a copy of the FIR for your records\n\n📌 **Authority:** Cyber Crime Cell\n🔗 **Portal:** cybercrime.gov.in\n⏱ **Processing Time:** 24-72 hours for acknowledgment"
      : "**Filing an FIR for Cyber Fraud — Legal Procedure**\n\n**Applicable Law:** Information Technology Act, 2000 (§66C, §66D) read with IPC §420\n\n**Procedure:**\n1. **Evidence Preservation** — Document all digital evidence per §65B Indian Evidence Act\n2. **Online Complaint** — File at National Cyber Crime Reporting Portal (cybercrime.gov.in)\n3. **Jurisdictional FIR** — Section 154 CrPC mandates registration at nearest PS\n4. **Zero FIR** — If jurisdictional issues arise, invoke Zero FIR provision\n\n**Competent Authority:** Cyber Crime Investigation Cell\n**Statutory Timeline:** FIR must be registered without unreasonable delay (§154 CrPC)\n**Remedy if refused:** Approach SP/Magistrate under §156(3) CrPC";
  }
  if (message.toLowerCase().includes("consumer")) {
    return isSimple
      ? "To file a consumer complaint:\n\n**Step 1:** Gather purchase receipts and communication records\n**Step 2:** Send a legal notice to the company (30 days)\n**Step 3:** File complaint on consumerhelpline.gov.in\n**Step 4:** If unresolved, approach District Consumer Forum\n\n📌 **Authority:** Consumer Disputes Redressal Commission\n🔗 **Portal:** consumerhelpline.gov.in\n💰 **Claims up to ₹1 Crore:** District Forum\n💰 **₹1-10 Crore:** State Commission"
      : "**Consumer Complaint Filing — Legal Framework**\n\n**Governing Law:** Consumer Protection Act, 2019\n\n**Jurisdictional Hierarchy:**\n| Forum | Pecuniary Jurisdiction |\n|-------|----------------------|\n| District Commission | Up to ₹1 Crore |\n| State Commission | ₹1 Cr - ₹10 Cr |\n| National Commission | Above ₹10 Crore |\n\n**Procedure per §35:**\n1. Issue legal notice (recommended, not mandatory)\n2. File complaint with prescribed fee\n3. Attach documentary evidence\n4. Hearing within 21 days of admission\n\n**Limitation:** 2 years from cause of action (§69)";
  }
  if (message.toLowerCase().includes("tenant") || message.toLowerCase().includes("rent")) {
    return isSimple
      ? "As a tenant, you have these rights:\n\n✅ **Right to fair rent** — Landlord cannot charge unreasonable rent\n✅ **Right to essential services** — Water, electricity cannot be cut off\n✅ **Right to privacy** — Landlord must give notice before visiting\n✅ **Right against eviction** — Cannot be evicted without due process\n✅ **Right to receipt** — Must get rent receipts\n\n⚠️ **If harassed:** File complaint at local police station or approach Rent Controller"
      : "**Tenant Rights — Legal Analysis**\n\n**Governing Laws:** State-specific Rent Control Acts; Model Tenancy Act, 2021\n\n**Fundamental Rights:**\n1. **Protection from eviction** — §21 Model Tenancy Act\n2. **Fair rent determination** — §4 (Rent Authority)\n3. **Essential services** — §27 (criminal offense to withhold)\n4. **Written agreement** — §4(1) mandatory rent agreement\n\n**Remedies:**\n- Rent Authority for disputes\n- Civil Court for injunctive relief\n- Criminal complaint under §504/506 IPC for harassment\n\n**Limitation:** Varies by state legislation";
  }
  if (message.toLowerCase().includes("legal notice") || message.toLowerCase().includes("draft")) {
    return isSimple
      ? "I can help you draft a legal notice! Here's what I need:\n\n📝 **Required Information:**\n- Your full name and address\n- Recipient's name and address\n- Subject of the dispute\n- Facts of the case\n- Relief/action you're seeking\n- Time limit for response (usually 15-30 days)\n\n💡 **Tip:** A legal notice is typically sent via registered post/speed post for proof of delivery.\n\nWould you like me to generate a draft? Just tell me the details!"
      : "**Legal Notice Drafting — Requirements**\n\n**Legal Basis:** §80 CPC (mandatory for suits against Government); advisory for private disputes\n\n**Essential Components:**\n1. **Cause Title** — Sender & Recipient details\n2. **Statement of Facts** — Chronological narration\n3. **Legal Grounds** — Applicable provisions\n4. **Relief Sought** — Specific demands\n5. **Time for Compliance** — 15/30 days standard\n6. **Consequence Clause** — Legal proceedings warning\n\n**Service:** Registered AD Post / Speed Post\n\nPlease provide the factual matrix and I shall generate the appropriate notice.";
  }
  return isSimple
    ? "I understand your legal concern. Let me help you navigate this.\n\n**To give you the best guidance, please share:**\n1. What happened? (brief description)\n2. When did it happen?\n3. Where are you located? (state/city)\n\nThis will help me identify the correct authority, applicable laws, and step-by-step procedure for your situation."
    : "Your query has been noted. To provide comprehensive legal guidance, the following information is required:\n\n1. **Factual Matrix** — Detailed chronology of events\n2. **Jurisdiction** — State and district\n3. **Relief Sought** — Desired outcome\n4. **Documentation** — Available evidence\n\nUpon receipt of the above, I shall provide:\n- Applicable legal provisions\n- Competent authority/forum\n- Procedural workflow\n- Estimated timeline and costs";
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
          <span className="text-sm font-semibold text-foreground tracking-tight">LexGuide AI</span>
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
                Your digital legal consultant. Ask about laws, file complaints, or generate legal documents.
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
            LexGuide AI provides AI-generated legal information, not legal advice. Built by Monish Kumar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
