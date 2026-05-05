import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 mb-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      role="article"
      aria-label={isUser ? "Your message" : "Bot message"}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser ? "bg-primary" : "bg-secondary"
        }`}
        aria-hidden="true"
      >
        {isUser ? <User className="w-5 h-5 text-primary-foreground" /> : <Bot className="w-5 h-5 text-secondary-foreground" />}
      </div>
      
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[75%]`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-none"
              : "bg-card text-card-foreground border border-border rounded-tl-none"
          }`}
        >
          <p className="text-sm md:text-base leading-relaxed">{message}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-muted-foreground mt-1 px-2">{timestamp}</span>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
