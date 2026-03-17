import { useState } from "react";
import { motion } from "framer-motion";
import { Scale, User, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";

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

      <div className="max-w-[85%] group relative">
        <div
          className={`rounded-2xl px-5 py-4 text-sm leading-relaxed ${
            isAI
              ? "glass-card text-foreground"
              : "bg-foreground text-background"
          }`}
        >
          {isAI ? (
            <div className="prose prose-sm prose-invert max-w-none
              prose-headings:text-foreground prose-headings:font-semibold prose-headings:tracking-tight
              prose-h2:text-base prose-h2:mt-5 prose-h2:mb-2 prose-h2:first:mt-0
              prose-h3:text-sm prose-h3:mt-3 prose-h3:mb-1
              prose-p:text-foreground/80 prose-p:text-sm prose-p:leading-relaxed prose-p:my-1.5
              prose-strong:text-foreground prose-strong:font-semibold
              prose-em:text-muted-foreground prose-em:text-xs
              prose-a:text-foreground prose-a:underline prose-a:underline-offset-2 prose-a:decoration-foreground/30 hover:prose-a:decoration-foreground/60
              prose-ul:my-1.5 prose-ol:my-1.5 prose-li:text-foreground/80 prose-li:text-sm prose-li:my-0.5
              prose-code:text-foreground/90 prose-code:bg-foreground/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
              prose-table:my-3
              prose-th:text-foreground/90 prose-th:text-xs prose-th:font-medium prose-th:px-3 prose-th:py-1.5 prose-th:border-b prose-th:border-border/50 prose-th:text-left
              prose-td:text-foreground/70 prose-td:text-xs prose-td:px-3 prose-td:py-1.5 prose-td:border-b prose-td:border-border/20
              prose-blockquote:border-l-2 prose-blockquote:border-foreground/20 prose-blockquote:pl-4 prose-blockquote:my-2 prose-blockquote:text-foreground/70
              prose-hr:border-border/30 prose-hr:my-4
            ">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
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
