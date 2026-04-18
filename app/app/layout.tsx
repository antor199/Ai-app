"use client";

import Link from 'next/link';
import { useState, useCallback, useEffect, memo, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Home, MessageSquare, Database, Settings, Sparkles, User, Trash2, Clock, Plus, Loader2 } from 'lucide-react';
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
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
  return (
    <div className="flex h-screen overflow-hidden bg-deep-gradient">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 flex-shrink-0 glass-panel m-4 flex flex-col items-center md:items-stretch py-6 border-r border-white/5 relative z-20">
        <Link href="/" className="flex items-center justify-center md:justify-start md:px-6 mb-10 gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary-glow/20 to-secondary-glow/20 box-glow">
            <Sparkles className="w-6 h-6 text-primary-glow" />
          </div>
          <span className="font-orbitron font-bold text-lg hidden md:block text-glow">Ai app</span>
        </Link>

        <nav className="w-full space-y-2 px-2 md:px-4">
          <NavItem href="/app" icon={<MessageSquare className="w-5 h-5" />} label="Neural Chat" active={pathname === '/app' && !currentChatId} />
          <NavItem href="/absorb" icon={<Database className="w-5 h-5" />} label="Absorb Data" active={pathname === '/absorb'} />
          <NavItem href="/models" icon={<Sparkles className="w-5 h-5" />} label="AI Models" active={pathname === '/models'} />
          <NavItem href="/settings" icon={<Settings className="w-5 h-5" />} label="Settings" active={pathname === '/settings'} />
        </nav>

        {/* History Section */}
        <div className="flex-1 w-full mt-4 overflow-hidden flex flex-col">
          <div className="px-6 mb-4 flex items-center justify-between group/history">
            <h3 className="text-[10px] font-orbitron font-black text-white/30 tracking-[0.2em] uppercase">NEURAL_HISTORY</h3>
            <Link href="/app" className="p-1 px-2 rounded-md bg-white/5 border border-white/10 text-[9px] font-orbitron text-white/40 hover:text-primary-glow hover:border-primary-glow/30 transition-all flex items-center gap-1 opacity-0 group-hover/history:opacity-100">
              <Plus className="w-3 h-3" />
              NEW
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto px-2 md:px-4 space-y-1 scrollbar-hide">
            {loading && conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 opacity-20">
                <Loader2 className="w-4 h-4 animate-spin mb-2" />
                <span className="text-[8px] font-orbitron">SYNCING...</span>
              </div>
            ) : conversations.length === 0 ? (
              <div className="py-8 text-center opacity-20">
                <span className="text-[9px] font-orbitron italic">NO_RECORDS_FOUND</span>
              </div>
            ) : (
              conversations.map((conv) => (
                <div key={conv.id} className="group relative">
                  <Link
                    href={`/app?id=${conv.id}`}
                    className={`flex flex-col gap-1 p-3 rounded-xl transition-all border ${currentChatId === conv.id
                      ? "bg-white/10 border-white/10 text-primary-glow box-glow-active"
                      : "text-white/50 border-transparent hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    <span className="text-[11px] font-medium truncate pr-6">{conv.title || "Untitled Conversation"}</span>
                    <div className="flex items-center gap-1.5 opacity-40">
                      <Clock className="w-2.5 h-2.5" />
                      <span className="text-[8px] font-orbitron">
                        {conv.created_at 
                          ? new Date(conv.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : "RECORDED_TIME_NULL"}
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => { e.preventDefault(); handleDelete(conv.id); }}
                    className="absolute right-3 top-4 p-1 rounded-md text-white/0 group-hover:text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all z-10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-auto space-y-4 px-2 md:px-4">
          {/* User Profile Section */}
          {/* <div className="p-3 rounded-2xl bg-white/5 border border-white/10 glass-panel">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neon-gradient flex items-center justify-center p-[2px]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-glow" />
                </div>
              </div>
              <div className="hidden md:block overflow-hidden">
                <p className="text-sm font-orbitron font-bold text-white truncate tracking-tighter">{user?.user_metadata?.name || "NEURAL_ENTITY"}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${user ? 'bg-primary-glow' : 'bg-white/20'}`}></span>
                  <p className="text-[10px] font-orbitron font-black text-primary-glow/80 tracking-widest">{user ? 'NODE_ACTIVE' : 'NODE_OFFLINE'}</p>
                </div>
              </div>
            </div>
          </div> */}

        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative pb-4 pr-4 pt-4 z-10 flex flex-col">
        {children}
      </main>
    </div>
  );
}

const NavItem = memo(({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) => {
  return (
    <Link
      href={href}
      className={`flex items-center justify-center md:justify-start gap-3 p-3 rounded-xl transition-all ${active
        ? "bg-white/10 text-primary-glow box-glow-active border border-white/10"
        : "text-white/60 hover:bg-white/5 hover:text-white"
        }`}
    >
      {icon}
      <span className={`hidden md:block font-medium ${active ? "text-glow" : ""}`}>{label}</span>
      {active && <div className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-primary-glow box-glow" />}
    </Link>
  );
});

NavItem.displayName = "NavItem";
