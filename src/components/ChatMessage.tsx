import { useState } from "react";
import { motion } from "framer-motion";
import { Scale, User, Copy, Check } from "lucide-react";

type Props = {
  message: {
    id: string;
    role: "user" | "assistant";
    content: string;
  };
};

const ChatMessage = ({ message }: Props) => {
  const isAI = message.role === "assistant";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={`flex gap-3 mb-6 ${isAI ? "" : "justify-end"}`}
    >
      {isAI && (
        <div className="w-8 h-8 rounded-xl glass-card flex items-center justify-center shrink-0 mt-1">
          <Scale className="w-3.5 h-3.5 text-foreground/70" />
        </div>
      )}

      <div className="max-w-[80%] group relative">
        <div
          className={`rounded-2xl px-5 py-4 text-sm leading-relaxed ${
            isAI
              ? "glass-card text-foreground"
              : "bg-foreground text-background"
          }`}
        >
          {isAI ? (
            <div
              className="[&_strong]:text-foreground [&_strong]:font-semibold
                [&_ul]:space-y-1 [&_ol]:space-y-1
                [&_li]:text-foreground/80
                [&_p]:text-foreground/80
                [&_em]:text-muted-foreground [&_em]:text-xs
                [&_code]:text-foreground/90 [&_code]:bg-foreground/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded"
              dangerouslySetInnerHTML={{
                __html: message.content
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\*(.*?)\*/g, "<em>$1</em>")
                  .replace(/`(.*?)`/g, "<code>$1</code>")
                  .replace(/\n/g, "<br/>"),
              }}
            />
          ) : (
            <p>{message.content}</p>
          )}
        </div>

        {isAI && (
          <button
            onClick={handleCopy}
            className="absolute -bottom-6 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-muted-foreground hover:text-foreground p-1"
            title="Copy response"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {!isAI && (
        <div className="w-8 h-8 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0 mt-1">
          <User className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
