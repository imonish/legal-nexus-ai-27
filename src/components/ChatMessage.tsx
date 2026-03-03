import { motion } from "framer-motion";
import { Scale, User } from "lucide-react";

type Props = {
  message: {
    id: string;
    role: "user" | "assistant";
    content: string;
  };
};

const ChatMessage = ({ message }: Props) => {
  const isAI = message.role === "assistant";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex gap-3 mb-6 ${isAI ? "" : "justify-end"}`}
    >
      {isAI && (
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 mt-1">
          <Scale className="w-4 h-4 text-primary" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
          isAI
            ? "glass text-foreground"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {isAI ? (
          <div
            className="prose prose-invert prose-sm max-w-none 
              [&_strong]:text-foreground [&_strong]:font-semibold
              [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2
              [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1
              [&_ul]:space-y-1 [&_ol]:space-y-1
              [&_li]:text-foreground/90
              [&_p]:text-foreground/90
              [&_code]:text-primary [&_code]:bg-primary/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
              [&_table]:w-full [&_th]:text-left [&_th]:pb-2 [&_th]:text-muted-foreground [&_td]:py-1 [&_td]:text-foreground/80"
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

      {!isAI && (
        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-1">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
