import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, X, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { GlassCard } from './GlassCard';
import { cn } from '../lib/utils';
import Markdown from 'react-markdown';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export const ChatBot = ({ userProfile }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chat = useRef(ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: {
      systemInstruction: `You are the Again India Oracle. You provide deep astrological and spiritual guidance. 
      User Profile: ${JSON.stringify(userProfile)}
      
      RESPONSE GUIDELINES:
      - Always be mystical, insightful, and supportive.
      - Use ancient Shastra wisdom combined with modern psychological insights.
      - STRUCTURE your responses using Markdown:
        - Use **bold** for key cosmic terms or important advice.
        - Use bullet points for lists of remedies or insights.
        - Use emojis to enhance the mystical vibe (e.g., ✨, 🪐, 🕉️, 🔮).
        - Keep paragraphs concise and impactful.
      - Format your response to be visually beautiful and easy to read.`,
    },
  }));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await chat.current.sendMessage({ message: input });
      const botMsg = { role: 'model', text: response.text };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 lg:bottom-8 right-6 lg:right-8 w-14 h-14 rounded-full glass-gold flex items-center justify-center z-50 celestial-glow shadow-[0_0_20px_var(--glow-color)]"
      >
        <Bot className="w-6 h-6 text-primary" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-0 lg:bottom-24 right-0 lg:right-8 w-full lg:w-[450px] h-full lg:h-[650px] z-[200]"
          >
            <GlassCard className="h-full flex flex-col p-0 overflow-hidden border-primary/30 shadow-2xl shadow-primary/10">
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-primary/20 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-display celestial-glow tracking-widest uppercase">Again India Oracle</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Resonance Synchronized</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                  <X className="w-5 h-5 text-white/40" />
                </button>
              </div>

              {/* Messages Area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <div className="w-16 h-16 rounded-full border border-dashed border-primary/50 flex items-center justify-center">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-sm italic font-display tracking-widest">
                      "Speak your truth, and the stars shall answer..."
                    </p>
                  </div>
                )}
                
                {messages.map((msg, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex flex-col",
                      msg.role === 'user' ? "items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[90%] p-4 rounded-2xl text-sm relative group",
                      msg.role === 'user' 
                        ? "bg-primary/40 text-white rounded-tr-none border border-primary/40" 
                        : "bg-white/10 text-white/90 rounded-tl-none border border-white/20"
                    )}>
                      {msg.role === 'model' && (
                        <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-black border border-primary/30 flex items-center justify-center">
                          <Bot className="w-3 h-3 text-primary" />
                        </div>
                      )}
                      
                      <div className="markdown-body prose prose-invert prose-sm max-w-none">
                        <Markdown
                          components={{
                            p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="space-y-2 mb-3 list-none p-0">{children}</ul>,
                            li: ({ children }) => (
                              <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">✦</span>
                                <span>{children}</span>
                              </li>
                            ),
                            strong: ({ children }) => <strong className="text-primary font-bold">{children}</strong>,
                          }}
                        >
                          {msg.text}
                        </Markdown>
                      </div>
                    </div>
                    <span className="text-[9px] text-white/20 uppercase tracking-widest mt-1 px-1">
                      {msg.role === 'user' ? 'Transmission' : 'Oracle Insight'}
                    </span>
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none border border-white/20 flex gap-1.5 items-center">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0s]" />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[10px] text-white/40 uppercase tracking-widest ml-2">Consulting Akasha...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10 bg-black backdrop-blur-md">
                <div className="flex gap-3 items-center">
                  <div className="flex-1 relative">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Inquire of the infinite..."
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <div className="w-1 h-1 rounded-full bg-primary/50 animate-ping" />
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="w-12 h-12 rounded-2xl bg-primary text-black flex items-center justify-center hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:grayscale"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


