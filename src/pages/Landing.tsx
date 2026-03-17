import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Scale, ArrowRight, Shield, MessageSquare, FileText, Search, MapPin, AlertTriangle, ChevronDown } from "lucide-react";
import DoodleAnimals from "@/components/DoodleAnimals";
import { useState } from "react";

const features = [
  { icon: MessageSquare, title: "AI Legal Chat", desc: "Ask any legal question and get step-by-step guidance instantly." },
  { icon: FileText, title: "Document Generator", desc: "Generate FIR drafts, legal notices, RTI requests, and more." },
  { icon: Search, title: "Complaint Routing", desc: "Find the right authority and portal for your legal issue." },
  { icon: Shield, title: "Legal Risk Detector", desc: "AI analyzes your situation and warns about potential risks." },
  { icon: MapPin, title: "Location-Aware Help", desc: "Find nearby courts, police stations, and legal authorities." },
  { icon: AlertTriangle, title: "Smart Analyzer", desc: "Describe your issue and get case type, category, and actions." },
];

const steps = [
  { num: "01", title: "Describe Your Issue", desc: "Tell the AI about your legal problem in plain language." },
  { num: "02", title: "Get AI Analysis", desc: "AI identifies the legal category, relevant laws, and responsible authority." },
  { num: "03", title: "Follow the Guide", desc: "Receive a step-by-step action plan with documents and portal links." },
  { num: "04", title: "Generate Documents", desc: "Auto-create legal drafts ready for submission." },
];

const navLinks = [
  { label: "Chat", path: "/chat" },
  { label: "Analyzer", path: "/chat" },
  { label: "Documents", path: "/chat" },
];

const toolsDropdown = [
  { label: "Timeline Builder", path: "/chat" },
  { label: "Case Strength", path: "/chat" },
  { label: "Gov Portals", path: "/chat" },
];

const ease = [0.23, 1, 0.32, 1] as const;

const Landing = () => {
  const navigate = useNavigate();
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <DoodleAnimals />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl glass-card flex items-center justify-center">
            <Scale className="w-4 h-4 text-foreground" />
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">
            LexGuide AI
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              {link.label}
            </button>
          ))}
          <div className="relative">
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              onBlur={() => setTimeout(() => setToolsOpen(false), 150)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-1"
            >
              Tools <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${toolsOpen ? 'rotate-180' : ''}`} />
            </button>
            {toolsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full mt-2 right-0 glass-card rounded-xl py-2 min-w-[160px]"
              >
                {toolsDropdown.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors duration-200"
                  >
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          <button
            onClick={() => navigate("/chat")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Knowledge
          </button>
        </div>

        <button
          onClick={() => navigate("/chat")}
          className="px-5 py-2.5 rounded-full border border-border text-sm font-medium text-foreground hover:bg-foreground/5 transition-all duration-300"
        >
          Start Free
        </button>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease }}
          className="max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs text-muted-foreground mb-10 tracking-wide"
          >
            <Scale className="w-3 h-3 text-foreground/60" />
            Your AI Legal Copilot
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] leading-[1.02] mb-7">
            <span className="text-gradient">AI Legal Guidance</span>
            <br />
            <span className="text-gradient">for Everyone</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-14 leading-relaxed font-light"
          >
            Understand legal procedures, file complaints, generate documents,
            and find the right authority — all powered by AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate("/chat")}
              className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-border bg-transparent text-foreground font-medium text-sm transition-all duration-300 hover:bg-foreground/5"
            >
              Start Chat
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full glass-card text-sm text-muted-foreground font-medium transition-all duration-300 glow-hover"
            >
              File Complaint
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full glass-card text-sm text-muted-foreground font-medium transition-all duration-300 glow-hover"
            >
              Generate Document
            </button>
          </motion.div>
        </motion.div>
      </main>

      {/* Divider */}
      <div className="relative z-10 max-w-6xl mx-auto px-8">
        <div className="border-t border-border/40" />
      </div>

      {/* How It Works */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">How It Works</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease }}
              className="glass-card rounded-3xl p-8 glow-hover"
            >
              <span className="text-4xl font-black text-foreground/10 block mb-4">{step.num}</span>
              <h3 className="text-base font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 max-w-6xl mx-auto px-8">
        <div className="border-t border-border/40" />
      </div>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">Powerful Legal Tools</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">Comprehensive AI-powered legal assistance.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease }}
              className="glass-card rounded-3xl p-7 glow-hover group"
            >
              <div className="w-10 h-10 rounded-2xl bg-foreground/5 flex items-center justify-center mb-5 group-hover:bg-foreground/10 transition-colors duration-500">
                <f.icon className="w-5 h-5 text-foreground/50" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="glass-card rounded-[2rem] p-12 glow-hover"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
            Ready to Get Legal Help?
          </h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
            Start a conversation with our AI legal assistant and get guidance within seconds.
          </p>
          <button
            onClick={() => navigate("/chat")}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-border text-foreground font-medium text-sm transition-all duration-300 hover:bg-foreground/5"
          >
            Start Free Consultation
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </section>

      <footer className="relative z-10 text-center py-8">
        <p className="text-[11px] text-muted-foreground/40 tracking-wide">
          Built by Monish Kumar · LexGuide AI provides AI-generated legal information, not legal advice.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
