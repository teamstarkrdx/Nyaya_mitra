import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, X, Mic, Copy, Star, Trash2, Languages, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  feedback?: { rating: number; comment?: string };
}

const ChatBot = forwardRef<{ openChat: () => void }>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    openChat: () => {
      setIsOpen(true);
    }
  }));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
    const lang = languages.find(l => l.code === code);
    setMessages([{
      id: Date.now().toString(),
      role: "assistant",
      content: `Hello! I'm your AI legal assistant. I'll help you with legal queries in ${lang?.name}. How can I assist you today?`,
      timestamp: new Date(),
    }]);
  };

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsSending(true);

    try {
      const res = await apiRequest("POST", "/api/legal-chat", { 
        message: currentInput,
        language: selectedLanguage || "en"
      });
      const data = await res.json() as { response: string };

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting to provide legal advice right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (messageId: string, rating: number, comment?: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, feedback: { rating, comment } } : msg
    ));
    setShowFeedback(null);
  };

  const handleMicClick = () => {
    setIsListening(!isListening);
    // Voice-to-text functionality - works with browser's built-in speech recognition
    if (!isListening && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.start();
    }
  };

  const clearChat = () => {
    setMessages(messages.slice(0, 1)); // Keep welcome message
  };

  const changeLanguage = () => {
    setSelectedLanguage(null);
    setMessages([]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50"
        data-testid="button-open-chat"
      >
        <Bot className="h-8 w-8 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-[540px] h-[720px] max-h-[calc(100vh-80px)] z-50 flex flex-col">
      <Card className="flex-1 flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-purple-500">
          <div className="flex items-center gap-3">
            <Bot className="h-6 w-6 text-white" />
            <div>
              <h3 className="font-semibold text-white">AI Legal Assistant</h3>
              {selectedLanguage && (
                <p className="text-xs text-white/90">
                  {languages.find(l => l.code === selectedLanguage)?.native}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {selectedLanguage && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={changeLanguage}
                  data-testid="button-change-language"
                >
                  <Languages className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={clearChat}
                  data-testid="button-clear-chat"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
              data-testid="button-close-chat"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {!selectedLanguage ? (
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
              Select Your Language
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {languages.map((lang) => (
                <Card
                  key={lang.code}
                  className="p-4 cursor-pointer hover-elevate active-elevate-2 transition-all text-center"
                  onClick={() => handleLanguageSelect(lang.code)}
                  data-testid={`language-${lang.code}`}
                >
                  <p className="font-semibold text-foreground">{lang.native}</p>
                  <p className="text-sm text-muted-foreground">{lang.name}</p>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                        : "bg-card border"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    {message.role === "assistant" && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => handleCopy(message.content, message.id)}
                          data-testid={`button-copy-${message.id}`}
                        >
                          {copiedId === message.id ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <Copy className="h-3 w-3 mr-1" />
                          )}
                          {copiedId === message.id ? "Copied!" : "Copy"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => setShowFeedback(message.id)}
                          data-testid={`button-feedback-${message.id}`}
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Feedback
                        </Button>
                      </div>
                    )}
                    {showFeedback === message.id && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => handleFeedback(message.id, rating)}
                              data-testid={`rating-${rating}`}
                            >
                              <Star className="h-5 w-5 text-yellow-500 hover:fill-yellow-500" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className={isListening ? "bg-destructive text-white" : ""}
                  onClick={handleMicClick}
                  data-testid="button-voice-input"
                >
                  <Mic className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Ask your legal question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  data-testid="input-chat-message"
                />
                <Button onClick={handleSend} disabled={isSending} data-testid="button-send-message">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
});

ChatBot.displayName = "ChatBot";

export default ChatBot;
