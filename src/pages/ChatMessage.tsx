import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, User, Copy, Check, ChevronDown, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Source = {
  act: string;
  section: string;
  title: string;
  file: string;
  similarity: number;
};

type Props = {
  message: {
    id: string;
    role: "user" | "assistant";
    content: string;
    sources?: Source[];
  };
};

const ChatMessage = ({ message }: Props) => {
  const isAI = message.role === "assistant";
  const [copied, setCopied] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const hasSources = isAI && message.sources && message.sources.length > 0;

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

        {/* Sources toggle */}
        {hasSources && (
          <div className="mt-2">
            <button
              onClick={() => setSourcesOpen(!sourcesOpen)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-300 px-1"
            >
              <BookOpen className="w-3 h-3" />
              <span>{message.sources!.length} sources</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-300 ${sourcesOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {sourcesOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-1.5">
                    {message.sources!.map((src, i) => (
                      <div
                        key={i}
                        className="glass-card rounded-xl px-3 py-2.5 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground/90 font-medium truncate">
                              {src.act}
                            </p>
                            <p className="text-muted-foreground mt-0.5">
                              § {src.section} — {src.title}
                            </p>
                          </div>
                          <span className="text-muted-foreground/60 shrink-0 tabular-nums">
                            {(src.similarity * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Copy button */}
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