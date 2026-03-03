import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Scale, ArrowRight, Shield, Zap, FileText } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-radial-glow opacity-60" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Scale className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Legal AI Nexus
          </span>
        </div>
        <button
          onClick={() => navigate("/chat")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          Launch App →
        </button>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-88px)] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-8"
          >
            <Zap className="w-3.5 h-3.5 text-primary" />
            Your Intelligent Legal Copilot
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6">
            <span className="text-gradient">AI-Powered</span>
            <br />
            <span className="text-foreground">Legal Intelligence</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Ask, analyze, interpret, and understand legal documents in seconds.
            Built for legal professionals who demand precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center"
          >
            <button
              onClick={() => navigate("/chat")}
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base transition-all duration-400 glow-hover hover:scale-[1.02] active:scale-[0.98]"
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
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-20"
        >
          {[
            { icon: FileText, label: "Document Analysis" },
            { icon: Shield, label: "Contract Review" },
            { icon: Scale, label: "Case Research" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl glass text-sm text-muted-foreground"
            >
              <item.icon className="w-4 h-4 text-primary/70" />
              {item.label}
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer credit */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-10">
        <p className="text-xs text-muted-foreground/50">
          Built by Monish Kumar
        </p>
      </div>
    </div>
  );
};

export default Landing;
