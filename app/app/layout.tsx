"use client";

import Link from 'next/link';
import { useState, useCallback, useEffect, memo, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Home, MessageSquare, Database, Settings, Sparkles, User, Trash2, Clock, Plus, Loader2, BrainCircuit, Menu, X } from 'lucide-react';
import { insforge } from '../lib/insforge';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AppLayoutContent>{children}</AppLayoutContent>
    </Suspense>
  );
}

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentChatId = searchParams.get('id');

  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchConversations = useCallback(async (userId: string) => {
    setLoading(true);
    const { data, error } = await insforge.database
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setConversations(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data } = await insforge.auth.getCurrentUser();
      if (data?.user) {
        setUser(data.user);
        fetchConversations(data.user.id);
      }
    };
    init();
  }, [fetchConversations, user?.id]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentChatId === id) {
      router.push('/app');
    }

    const { error } = await insforge.database
      .from('conversations')
      .delete()
      .match({ id });

    if (error) {
      console.error('Delete failed:', error);
      if (user) fetchConversations(user.id);
    }
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-deep-gradient relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] md:hidden transition-all duration-500 animate-in fade-in"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Desktop and Mobile Drawer */}
      <aside className={`
        fixed md:relative top-0 right-0 md:right-auto h-full w-[300px] md:w-20 lg:w-64 flex-shrink-0 
        glass-panel md:m-4 flex flex-col items-stretch p-5 sm:p-6 border-l md:border border-white/10 
        transition-all duration-500 ease-in-out z-[110] md:z-20
        ${isSidebarOpen ? "translate-x-0 opacity-100" : "translate-x-full md:translate-x-0 opacity-0 md:opacity-100"}
      `}>
        {/* Mobile Close Button (Inside) */}
        <button 
          onClick={closeSidebar}
          className="md:hidden absolute top-5 right-5 p-2 bg-white/5 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <Link href="/" onClick={closeSidebar} className="flex items-center justify-center lg:justify-start lg:px-2 mb-8 gap-3">
          <BrainCircuit className="text-primary-glow w-6 h-6 shrink-0" />
          <span className="font-orbitron font-bold text-lg hidden lg:block text-glow truncate">Ai copilot</span>
        </Link>

        {/* Action Button: New Chat */}
        <button
          onClick={() => { router.push('/app'); closeSidebar(); }}
          className="w-full mb-6 py-3.5 bg-neon-gradient rounded-xl font-orbitron font-bold text-xs text-white tracking-[0.2em] box-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          NEW CHAT
        </button>

        <nav className="w-full space-y-3 lg:space-y-2">
          <NavItem href="/app" icon={<MessageSquare className="w-5 h-5" />} label="Neural Chat" active={pathname === '/app' && !currentChatId} onClick={closeSidebar} />
          <NavItem href="/absorb" icon={<Database className="w-5 h-5" />} label="Absorb Data" active={pathname === '/absorb'} onClick={closeSidebar} />
          <NavItem href="/models" icon={<Sparkles className="w-5 h-5" />} label="AI Models" active={pathname === '/models'} onClick={closeSidebar} />
          <NavItem href="/settings" icon={<Settings className="w-5 h-5" />} label="Settings" active={pathname === '/settings'} onClick={closeSidebar} />
        </nav>

        {/* History Section */}
        <div className="flex-1 w-full mt-10 overflow-hidden flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-orbitron font-black text-white/30 tracking-[0.2em] uppercase">UPLINK_HISTORY</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
            {loading && conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 opacity-20">
                <Loader2 className="w-5 h-5 animate-spin mb-3" />
                <span className="text-[9px] font-orbitron tracking-widest">SYNCING...</span>
              </div>
            ) : conversations.length === 0 ? (
              <div className="py-10 text-center opacity-20">
                <span className="text-[9px] font-orbitron italic tracking-widest">NO_RECORDS</span>
              </div>
            ) : (
              conversations.map((conv) => (
                <div key={conv.id} className="group relative">
                  <Link
                    href={`/app?id=${conv.id}`}
                    onClick={closeSidebar}
                    className={`flex flex-col gap-1.5 p-4 rounded-xl transition-all border ${currentChatId === conv.id
                      ? "bg-white/10 border-white/20 text-primary-glow box-glow-active"
                      : "text-white/40 border-white/5 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    <span className="text-xs font-medium truncate pr-8">{conv.title || "Untitled Neural Session"}</span>
                    <div className="flex items-center gap-2 opacity-40">
                      <Clock className="w-3 h-3" />
                      <span className="text-[9px] font-orbitron">
                        {conv.created_at
                          ? new Date(conv.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : "TIME_NULL"}
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => { e.preventDefault(); handleDelete(conv.id); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-white/0 group-hover:text-white/30 hover:text-red-500 hover:bg-red-500/10 transition-all z-10"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Info Mobile */}
        <div className="mt-auto pt-6 md:hidden">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-neon-gradient flex items-center justify-center p-[1px] box-glow">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-glow" />
                  </div>
                </div>
                <div className="overflow-hidden">
                   <p className="text-xs font-orbitron font-bold text-white truncate uppercase tracking-tight">{user?.user_metadata?.name || "NEURAL_ENTITY"}</p>
                   <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-glow animate-pulse"></div>
                      <p className="text-[9px] font-orbitron text-primary-glow/60 tracking-widest uppercase">ACTIVE</p>
                   </div>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative p-2 sm:p-4 md:pb-4 md:pr-4 md:pt-4 z-10 flex flex-col overflow-hidden">
        {/* Mobile Header Toolbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 mb-2 glass-panel border border-white/5">
          <div className="flex items-center gap-2">
             <BrainCircuit className="text-primary-glow w-5 h-5" />
             <span className="font-orbitron font-bold text-sm text-glow tracking-widest">AI COPILOT</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-white/5 rounded-lg border border-white/10 text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}

const NavItem = memo(({ href, icon, label, active = false, onClick }: { href: string, icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center justify-start gap-3 p-3 rounded-xl transition-all ${active
        ? "bg-white/10 text-primary-glow box-glow-active border border-white/10"
        : "text-white/60 hover:bg-white/5 hover:text-white"
        }`}
    >
      <div className={`${active ? "text-primary-glow" : ""}`}>
        {icon}
      </div>
      <span className={`md:hidden lg:block font-medium ${active ? "text-glow font-bold" : ""}`}>{label}</span>
      {active && <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-primary-glow box-glow" />}
    </Link>
  );
});

NavItem.displayName = "NavItem";
