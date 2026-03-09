import { motion } from "framer-motion";
import { Scale } from "lucide-react";

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    className="flex gap-3 mb-6"
  >
    <div className="w-8 h-8 rounded-xl glass-card flex items-center justify-center shrink-0 mt-1">
      <Scale className="w-3.5 h-3.5 text-foreground/70 animate-pulse" />
    </div>
    <div className="glass-card rounded-2xl px-5 py-4 flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-foreground/40"
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.1, 0.8] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  </motion.div>
);

export default TypingIndicator;
