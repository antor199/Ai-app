"use client";

import { useState, useCallback, useEffect, Suspense, useRef } from "react";
import { Send, Cpu, User, Loader2, ShieldCheck, Activity, Terminal, Sparkles } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { insforge } from "../lib/insforge";

export default function ChatDashboard() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center bg-[#050505]"><Loader2 className="w-8 h-8 text-primary-glow animate-spin" /></div>}>
      <ChatDashboardParamsWrapper />
    </Suspense>
  );
}

function ChatDashboardParamsWrapper() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  return <ChatDashboardContent conversationId={id} />;
}

function ChatDashboardContent({ conversationId }: { conversationId: string | null }) {
  const router = useRouter();
  const prevIdRef = useRef<string | null>(conversationId);

  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<{ id: string, role: string, content: string, timestamp?: string }[]>([]);
  const convColumn = "conversation_id"; // Fixed database column name

  const defaultGreeting = {
    id: "welcome",
    role: "assistant",
    content: "System online. Neural pathways established. How may I assist you in your workspace today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  useEffect(() => {
    setMounted(true);
    const checkUser = async () => {
      const { data } = await insforge.auth.getCurrentUser();
      if (data?.user) setUser(data.user);
    };
    checkUser();
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const loadConversation = async () => {
      if (!conversationId || !user) {
        if (!conversationId) setMessages([defaultGreeting]);
        return;
      }

      // 1. Handle thread transition
      if (conversationId !== prevIdRef.current) {
        // If switching between existing threads, clear state
        // If moving from 'new' (null) to an ID, keep state (first message)
        if (prevIdRef.current !== null) {
          setMessages([]);
        }
        prevIdRef.current = conversationId;
      }

      // 2. Fetch messages using conversation_id
      // Skip fetching if we already have these messages in state from handleSend
      if (messages.length > 1 && messages[1].role === "user" && !messages[0].id.includes("welcome")) {
        return;
      }

      const { data, error } = await insforge.database
        .from("messages")
        .select("id, role, content, created_at")
        .eq(convColumn, conversationId)
        .order("created_at", { ascending: true });

      if (isCancelled) return;

      if (error) {
        console.error("Database Retrieval Failed:", error);
        setMessages([{
          id: "error",
          role: "assistant",
          content: `[SYSTEM_ERROR]: Neural record retrieval failed. ${error.message || 'Unknown network interference.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        return;
      }

      if (data) {
        setMessages(data.length > 0 ? data.map((m: any) => ({
          id: m.id,
          role: m.role || "assistant",
          content: m.content || "[EMPTY_SIGNAL]",
          timestamp: m.created_at
            ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })) : [defaultGreeting]);
      }
    };

    if (mounted) {
      loadConversation();
    }

    return () => {
      isCancelled = true;
    };
  }, [conversationId, mounted, user]);
  const [activeModel, setActiveModel] = useState("openai/gpt-4o-mini");

  const handleSend = useCallback(async () => {
    if (!input.trim() || !user) return;

    const currentInput = input;
    let activeConvId = conversationId;
    const timestamp = new Date().toISOString();
    const displayTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message to state immediately for UI responsiveness
    const tempUserMsg = {
      id: Date.now().toString(),
      role: "user",
      content: currentInput,
      timestamp: displayTime
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // 1. Create conversation if new
      if (!activeConvId) {
        const title = currentInput.split(" ").slice(0, 5).join(" ") + (currentInput.split(" ").length > 5 ? "..." : "");
        const { data: conv, error: convErr } = await insforge.database
          .from("conversations")
          .insert([{ user_id: user.id, title }])
          .select()
          .single();

        if (convErr) throw convErr;
        activeConvId = conv.id;
        router.push(`/app?id=${activeConvId}`);
      }

      // 2. Save user message to DB
      const { error: userMsgErr } = await insforge.database.from("messages").insert([{
        conversation_id: activeConvId,
        user_id: user.id,
        role: "user",
        content: currentInput,
        created_at: timestamp
      }]);

      if (userMsgErr) throw userMsgErr;

      // 3. Get AI Completion
      const history = messages
        .filter(m => m.id !== "welcome")
        .map(m => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content
        }));
      history.push({ role: "user", content: currentInput });

      const completion = await insforge.ai.chat.completions.create({
        model: activeModel,
        messages: history
      });

      const assistantContent = completion?.choices?.[0]?.message?.content || "Neural uplink empty response.";
      const assistantTimestamp = new Date().toISOString();
      const assistantDisplayTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // 4. Save Assistant response to DB
      const { data: savedAssistantMsg, error: assistantMsgErr } = await insforge.database.from("messages").insert([{
        conversation_id: activeConvId,
        user_id: user.id,
        role: "assistant",
        content: assistantContent,
        created_at: assistantTimestamp
      }]).select().single();

      if (assistantMsgErr) throw assistantMsgErr;

      setMessages(prev => [...prev, {
        id: savedAssistantMsg?.id || (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantContent,
        timestamp: assistantDisplayTime
      }]);
    } catch (err: any) {
      console.warn("Neural Uplink Error:", err instanceof Error ? err.message : err);

      const isAuthError = err.status === 401 ||
        err.code === "PGRST301" ||
        (typeof err.message === 'string' && err.message.toLowerCase().includes("unauthorized"));

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: isAuthError
          ? "[ERROR_AUTH_FAILURE]: Neural session expired or unauthorized. Please re-authenticate your connection."
          : (err?.message?.includes('429') || err?.status === 429)
            ? "[WARNING_RATE_LIMIT]: Neural bandwidth exhausted. The selected AI model is experiencing high traffic. Please try switching to a different active engine."
            : `[ERROR_UPLINK_FAILED]: ${err?.message || err?.code || 'Neural pathway fragmented (Unknown Error)'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, messages, user, conversationId, activeModel, router]);

  return (
    <div className="flex-1 glass-panel flex flex-col relative overflow-hidden h-full border border-white/5 md:border-white/10">
      {/* Top Bar showing active model */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5 bg-black/20 backdrop-blur-md z-10 gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-primary-glow animate-pulse shrink-0" />
          <span className="font-orbitron text-[10px] sm:text-xs font-bold tracking-widest text-white/60 flex items-center gap-2">
            ENGINE:
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value)}
              className="bg-primary-glow/10 border border-primary-glow/30 text-primary-glow rounded-md px-2 py-1 outline-none focus:border-primary-glow/60 transition-colors cursor-pointer ml-1 font-orbitron text-[10px] sm:text-xs"
            >
              <option value="openai/gpt-4o-mini" className="bg-black text-primary-glow">GPT-4O-MINI</option>
              <option value="google/gemini-2.5-flash-lite" className="bg-black text-primary-glow">GEMINI-2.5-FLASH-LITE</option>
              <option value="google/gemini-2.0-flash-001" className="bg-black text-primary-glow">GEMINI-2.0-FLASH</option>
              <option value="anthropic/claude-sonnet-4.5" className="bg-black text-primary-glow">CLAUDE-SONNET-4.5</option>
              <option value="deepseek/deepseek-v3.2" className="bg-black text-primary-glow">DEEPSEEK-V3.2</option>
            </select>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-orbitron font-black text-white/40 tracking-[0.2em]">UPLINK_STABLE</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-6 sm:space-y-8 scrollbar-hide">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start gap-2 sm:gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl border shrink-0 ${message.role === "user"
              ? "bg-primary-glow/10 border-primary-glow/20 box-glow-blue"
              : "bg-white/5 border-white/10"
              }`}>
              {message.role === "user" ? <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-glow" /> : <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-glow" />}
            </div>
            <div className={`max-w-[90%] sm:max-w-[75%] p-3 sm:p-4 rounded-xl sm:rounded-xl glass-panel relative group ${message.role === "user" ? "bg-primary-glow/5" : "bg-white/5"
              }`}>
              <p className="text-sm sm:text-base leading-relaxed text-white/90 font-light tracking-wide">{message.content}</p>
              <div className={`absolute -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity ${message.role === "user" ? "right-1" : "left-1"}`}>
                <span className="text-[8px] font-orbitron text-white/20 tracking-widest uppercase">
                  {message.role} | {message.timestamp || (mounted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--")}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-2 sm:gap-4">
            <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/5 border border-white/10">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-glow animate-pulse" />
            </div>
            <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl glass-panel bg-white/5 min-w-[60px] sm:min-w-[80px] flex items-center justify-center">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-glow animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary-glow animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary-glow animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Neural Queries Input */}
      <div className="p-3 sm:p-6 bg-gradient-to-t from-black/60 to-transparent border-t border-white/5">
        <div className="relative group max-w-5xl mx-auto">
          <div className="absolute -inset-1 bg-neon-gradient rounded-2xl blur opacity-10 group-focus-within:opacity-30 transition-opacity"></div>
          <div className="relative glass-panel bg-black/60 flex items-end p-1 sm:p-2 border-white/10 group-focus-within:border-primary-glow/30 transition-all shadow-2xl">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="NEURAL_QUERY_INPUT..."
              rows={1}
              className="flex-1 bg-transparent focus:border-none focus:outline-none focus:ring-0 text-white placeholder:text-white/20 p-3 sm:p-4 resize-none font-orbitron text-xs sm:text-sm tracking-widest min-h-[48px] sm:min-h-[56px] scrollbar-hide"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-3 sm:p-3.5 mb-1 mr-1 rounded-lg sm:rounded-xl bg-neon-gradient text-white hover:scale-105 active:scale-95 transition-all box-glow disabled:opacity-50 disabled:grayscale disabled:scale-100 shadow-[0_0_20px_rgba(0,210,255,0.3)] shrink-0"
            >
              {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap items-center justify-between mt-4 sm:mt-6 px-2 sm:px-4 max-w-5xl mx-auto gap-3">
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2 group cursor-help">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-glow group-hover:scale-110 transition-transform" />
              <span className="text-[8px] sm:text-[10px] font-orbitron font-black text-primary-glow/60 tracking-[0.2em] group-hover:text-primary-glow transition-colors">ENCRYPTED</span>
            </div>
            <div className="hidden xs:flex items-center gap-2 group cursor-help">
              <Activity className="w-3.5 h-3.5 text-secondary-glow group-hover:scale-110 transition-transform" />
              <span className="text-[8px] sm:text-[10px] font-orbitron font-black text-secondary-glow/60 tracking-[0.2em] group-hover:text-secondary-glow transition-colors">4.8 TBPS</span>
            </div>
          </div>
          <div className="flex items-center gap-2 py-1 px-3 rounded-full bg-white/5 border border-white/10">
            <Terminal className="w-3 h-3 text-white/30" />
            <span className="text-[8px] sm:text-[10px] font-orbitron font-bold text-white/40 tracking-[0.1em] uppercase">
              ID: <span className="text-white/60">{conversationId ? conversationId.slice(0, 8).toUpperCase() : "SINGLE"}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
