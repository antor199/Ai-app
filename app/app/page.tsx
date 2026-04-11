"use client";

import { useState } from "react";
import { Send, Cpu, User, Loader2 } from "lucide-react";

export default function ChatDashboard() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{ id: string, role: string, content: string }[]>([
    {
      id: "1",
      role: "assistant",
      content: "System online. Neural pathways established. How may I assist you in your workspace today?"
    }
  ]);

  const activeModel = "google/gemini-3-pro";

  const handleSend = () => {
    if (!input.trim()) return;

    // Optimistic UI updates
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content: input }]);
    setInput("");
    setIsTyping(true);

    // Mock response logic (Next step: Connect to InsForge SDK for real AI stream)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        content: "I am currently running in offline mock-mode. Connect me to the InsForge backend via `@insforge/sdk` using the `ai.chat.completions.create` function for real inference." 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex-1 glass-panel flex flex-col relative overflow-hidden h-full">
      {/* Top Bar showing active model */}
      <div className="w-full flex justify-between items-center px-6 py-4 border-b border-white/5 bg-black/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary-glow animate-pulse" />
          <span className="font-orbitron text-sm font-medium text-white/80">Active Engine: <span className="text-glow text-white">{activeModel}</span></span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 max-w-4xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gradient-to-br from-[#9ebaff]/40 to-indigo-600/40 border border-[#9ebaff]' : 'bg-gradient-to-br from-[#B6E5ED]/40 to-teal-600/40 border border-[#B6E5ED] box-glow'}`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <SparklesIcon />}
            </div>
            <div className={`p-4 rounded-2xl backdrop-blur-md border ${msg.role === 'user' ? 'bg-white/5 border-white/10 rounded-tr-sm' : 'bg-black/20 border-[#B6E5ED]/20 rounded-tl-sm box-glow'}`}>
              <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className={`flex gap-4 max-w-4xl`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#B6E5ED]/40 to-teal-600/40 border border-[#B6E5ED] box-glow`}>
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
            <div className={`p-4 rounded-2xl backdrop-blur-md border bg-black/20 border-[#B6E5ED]/20 rounded-tl-sm box-glow flex items-center`}>
              <span className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-primary-glow animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-primary-glow animate-bounce delay-75" />
                <span className="w-2 h-2 rounded-full bg-primary-glow animate-bounce delay-150" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 pb-6 mt-auto">
        <div className="relative max-w-5xl mx-auto flex items-end gap-2 bg-black/40 backdrop-blur-xl border border-white/10 p-2 text-white placeholder-white/30 rounded-3xl focus-within:ring-2 focus-within:ring-[#B6E5ED]/50 focus-within:border-[#B6E5ED]/50 transition-all box-glow">
          <textarea 
            className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] px-4 py-3 text-white placeholder-white/40"
            placeholder="Initialize query..."
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3 rounded-full bg-primary-glow text-[#050014] hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed m-1"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-xs text-white/30 mt-3">Singularity may produce unexpected results. Always verify neural outputs.</p>
      </div>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}
