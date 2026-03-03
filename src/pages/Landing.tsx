import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Scale, ArrowRight, Shield, Zap, FileText } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden bg-noise">
      {/* Grid + glow */}
      <div className="absolute inset-0 bg-grid opacity-100" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-radial-glow" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl glass-card flex items-center justify-center">
            <Scale className="w-4 h-4 text-foreground" />
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">
            Legal AI Nexus
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
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          className="max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs text-muted-foreground mb-10 tracking-wide uppercase"
          >
            <Zap className="w-3 h-3 text-foreground/70" />
            Your Intelligent Legal Copilot
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.04em] leading-[1.02] mb-7">
            <span className="text-gradient">AI-Powered</span>
            <br />
            <span className="text-foreground">Legal Intelligence</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-14 leading-relaxed font-light"
          >
            Ask, analyze, interpret, and understand legal documents in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <button
              onClick={() => navigate("/chat")}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-foreground text-background font-semibold text-sm transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] hover:shadow-[0_0_40px_-8px_hsl(0_0%_100%/0.3)]"
            >
              Start Legal Analysis
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-24"
        >
          {[
            { icon: FileText, label: "Document Analysis" },
            { icon: Shield, label: "Contract Review" },
            { icon: Scale, label: "Case Research" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl glass-card text-xs text-muted-foreground tracking-wide"
            >
              <item.icon className="w-3.5 h-3.5 text-foreground/50" />
              {item.label}
            </div>
          ))}
        </motion.div>
      </main>

      <div className="absolute bottom-6 left-0 right-0 text-center z-10">
        <p className="text-[11px] text-muted-foreground/30 tracking-wide">
          Built by Monish Kumar
        </p>
      </div>
    </div>
  );
};

export default Landing;
