import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizonal, Bot, User, LoaderCircle, Video, VideoOff, Smile, Frown, Meh } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import CameraFeed, { Emotion } from "@/components/CameraFeed";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWebcamOn, setIsWebcamOn] = useState(true);

  // --- A) Add new states ---
  const [hasSentEmotionMessage, setHasSentEmotionMessage] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [currentEmotionDisplay, setCurrentEmotionDisplay] = useState<string>("Neutral"); // For Badge UI

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const BACKEND_URL = "http://127.0.0.1:5000";

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Handle emotion from CameraFeed
  const handleEmotionDetected = (detected: string) => {
    setCurrentEmotionDisplay(detected); // Always update UI badge

    // --- B) When webcam detects emotion, set it ---
    if (detected && !hasSentEmotionMessage) {
      setDetectedEmotion(detected);
    }
  };

  // --- C) Map emotions to messages ---
  const getEmotionMessage = (emo: string) => {
    switch (emo.toLowerCase()) {
      case "happy":
        return "Great energy! Ready for exam tips?";
      case "sad":
        return "Hey, I’m here for you. Want to talk about what’s stressing you?";
      case "angry":
        return "You seem frustrated. Want me to help calm you down?";
      case "neutral":
        return "Hi! How can I help you today?";
      default:
        return "Hi! How can I help you today?";
    }
  };

  // --- D) Auto-send the message when detection happens ---
  useEffect(() => {
    if (detectedEmotion && !hasSentEmotionMessage) {
      const msg = getEmotionMessage(detectedEmotion);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: msg,
          sender: "bot",
        }
      ]);

      setHasSentEmotionMessage(true);
    }
  }, [detectedEmotion, hasSentEmotionMessage]);


  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;

    const userMessage: Message = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/chat`, {
        message: input,
        currentEmotion: currentEmotionDisplay
      });

      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting. Please try again.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSend();
  };

  const EmotionBadge = () => {
    let color = "bg-gray-100 text-gray-600 border-gray-200";
    let Icon = Meh;

    switch (currentEmotionDisplay.toLowerCase()) {
      case "happy":
        color = "bg-green-100 text-green-700 border-green-200";
        Icon = Smile;
        break;
      case "sad":
        color = "bg-blue-100 text-blue-700 border-blue-200";
        Icon = Frown;
        break;
      case "angry":
      case "stressed":
        color = "bg-red-100 text-red-700 border-red-200";
        Icon = Frown;
        break;
      default:
        break;
    }

    return (
      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium uppercase tracking-wide transition-colors ${color}`}>
        <Icon size={14} />
        <span>{currentEmotionDisplay}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans">
      <header className="flex-none border-b p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between bg-card z-10 gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Exam Ease Chat</h1>
          <p className="text-xs text-muted-foreground">AI Stress Assistant</p>
        </div>

        <div className="flex items-center gap-3">
          <EmotionBadge />
          <Button
            onClick={() => setIsWebcamOn(!isWebcamOn)}
            variant={isWebcamOn ? "default" : "outline"}
            size="icon"
            className="h-9 w-9"
            title="Toggle Camera"
          >
            {isWebcamOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      <div className={`flex-none bg-black transition-all duration-300 ease-in-out overflow-hidden ${isWebcamOn ? 'py-4' : 'h-0 py-0'}`}>
        <div className="max-w-xs mx-auto px-4">
          <CameraFeed
            isWebcamOn={isWebcamOn}
            backendUrl={BACKEND_URL}
            onEmotionDetected={handleEmotionDetected}
          />
        </div>
      </div>

      <main className="flex-1 min-h-0 relative">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="max-w-2xl mx-auto space-y-6 pb-4">
            <AnimatePresence mode="popLayout">
              {/* --- E) Default greeting conditionally hidden if auto-message sent --- 
                 The user requested: {!hasSentEmotionMessage && <BotMessage...>} 
                 Since we set messages state, we don't need a hardcoded default message in the rendered list 
                 if the auto-message takes over.
                 However, if waiting for detection, we might show nothing?
                 Or should we show a generic "Connecting..."? 
                 User request implied replacing default greeting. 
                 The simplest way to "override" is to NOT initialize messages with a default, 
                 and let the auto-message be the first one. */}

              {messages.length === 0 && !hasSentEmotionMessage && (
                // Optional: Placeholder waiting for emotion...
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start text-xs text-muted-foreground pl-4"
                >
                  ...
                </motion.div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  {message.sender === "bot" && (
                    <Avatar className="w-8 h-8 flex-none border shadow-sm mt-1">
                      <AvatarFallback className="bg-primary/10 text-primary"><Bot size={16} /></AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`relative max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border text-card-foreground rounded-bl-sm"
                      }`}
                  >
                    {message.text}
                  </div>

                  {message.sender === "user" && (
                    <Avatar className="w-8 h-8 flex-none border shadow-sm mt-1">
                      <AvatarFallback className="bg-secondary text-secondary-foreground"><User size={16} /></AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-muted-foreground ml-12"
              >
                <LoaderCircle className="animate-spin w-4 h-4" />
                <span className="text-xs">Typing...</span>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </main>

      <footer className="flex-none border-t p-4 bg-background">
        <div className="max-w-2xl mx-auto relative w-full group">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="pr-14 py-6 rounded-full shadow-sm bg-muted/30 focus:bg-background transition-all"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full h-10 w-10 shadow-sm opacity-90 hover:opacity-100 transition-opacity"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            <SendHorizonal size={20} />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Chat;