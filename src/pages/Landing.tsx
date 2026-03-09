import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Scale, ArrowRight, Shield, MessageSquare, FileText, Search, MapPin, AlertTriangle } from "lucide-react";
import DoodleAnimals from "@/components/DoodleAnimals";

const features = [
  {
    icon: MessageSquare,
    title: "AI Legal Chat",
    desc: "Ask any legal question and get step-by-step guidance instantly.",
  },
  {
    icon: FileText,
    title: "Document Generator",
    desc: "Generate FIR drafts, legal notices, RTI requests, and more.",
  },
  {
    icon: Search,
    title: "Complaint Routing",
    desc: "Find the right authority and portal for your legal issue.",
  },
  {
    icon: Shield,
    title: "Legal Risk Detector",
    desc: "AI analyzes your situation and warns about potential risks.",
  },
  {
    icon: MapPin,
    title: "Location-Aware Help",
    desc: "Find nearby courts, police stations, and legal authorities.",
  },
  {
    icon: AlertTriangle,
    title: "Smart Analyzer",
    desc: "Describe your issue and get case type, category, and actions.",
  },
];

const steps = [
  { num: "01", title: "Describe Your Issue", desc: "Tell the AI about your legal problem in simple language." },
  { num: "02", title: "Get AI Analysis", desc: "Our AI identifies the case type, relevant laws, and authorities." },
  { num: "03", title: "Follow the Steps", desc: "Receive a clear step-by-step workflow to resolve your issue." },
];

const ease = [0.23, 1, 0.32, 1] as const;

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <DoodleAnimals />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl glass-card flex items-center justify-center">
            <Scale className="w-4 h-4 text-foreground" />
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">
            LexGuide AI
          </span>
        </div>
        <button
          onClick={() => navigate("/chat")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-500"
        >
          Launch App →
        </button>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease }}
          className="max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs text-muted-foreground mb-10 tracking-wide uppercase"
          >
            <Scale className="w-3 h-3 text-foreground/70" />
            Your Digital Legal Consultant
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.04em] leading-[1.02] mb-7">
            <span className="text-gradient">AI-Powered</span>
            <br />
            <span className="text-foreground">Legal Guidance</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-14 leading-relaxed font-light"
          >
            Ask questions, file complaints, generate legal documents, and find the right authorities — all with AI guidance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate("/chat")}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-foreground text-background font-semibold text-sm transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] hover:shadow-[0_0_40px_-8px_hsl(0_0%_0%/0.2)]"
            >
              Start AI Chat
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl glass-card text-sm text-foreground font-medium transition-all duration-500 hover:scale-[1.02] glow-hover"
            >
              <FileText className="w-4 h-4" />
              Generate Document
            </button>
          </motion.div>
        </motion.div>
      </main>

      {/* How It Works */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">How It Works</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">Three simple steps to get expert legal guidance.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease }}
              className="glass-card rounded-3xl p-8 glow-hover"
            >
              <span className="text-4xl font-black text-foreground/10 block mb-4">{step.num}</span>
              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">Everything You Need</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">Comprehensive legal assistance powered by AI.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease }}
              className="glass-card rounded-3xl p-7 glow-hover group"
            >
              <div className="w-10 h-10 rounded-2xl bg-foreground/5 flex items-center justify-center mb-5 group-hover:bg-foreground/10 transition-colors duration-500">
                <f.icon className="w-5 h-5 text-foreground/60" />
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
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-foreground text-background font-semibold text-sm transition-all duration-500 hover:scale-[1.03] active:scale-[0.97]"
          >
            Start Free Consultation
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </section>

      <footer className="relative z-10 text-center py-8">
        <p className="text-[11px] text-muted-foreground/50 tracking-wide">
          Built by Monish Kumar · LexGuide AI provides AI-generated legal information, not legal advice.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
