import Link from 'next/link';
import { Home, MessageSquare, Database, Settings, Sparkles } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-deep-gradient">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 flex-shrink-0 glass-panel m-4 flex flex-col items-center md:items-stretch py-6 border-r border-white/5 relative z-20">
        <div className="flex items-center justify-center md:justify-start md:px-6 mb-10 gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary-glow/20 to-secondary-glow/20 box-glow">
            <Sparkles className="w-6 h-6 text-primary-glow" />
          </div>
          <span className="font-orbitron font-bold text-lg hidden md:block text-glow">SINGULARITY</span>
        </div>

        <nav className="flex-1 w-full space-y-2 px-2 md:px-4">
          <NavItem href="/app" icon={<MessageSquare className="w-5 h-5" />} label="Neural Chat" active />
          <NavItem href="/absorb" icon={<Database className="w-5 h-5" />} label="Absorb Data" />
          <NavItem href="/models" icon={<Sparkles className="w-5 h-5" />} label="AI Models" />
          <NavItem href="/settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
        </nav>

        <div className="mt-auto px-2 md:px-4">
          <Link href="/" className="flex items-center justify-center md:justify-start gap-3 p-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all">
            <Home className="w-5 h-5" />
            <span className="hidden md:block font-medium">Exit</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative pb-4 pr-4 pt-4 z-10 flex flex-col">
        {children}
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center justify-center md:justify-start gap-3 p-3 rounded-xl transition-all ${
        active 
          ? "bg-white/10 text-primary-glow box-glow-active border border-white/10" 
          : "text-white/60 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      <span className={`hidden md:block font-medium ${active ? "text-glow" : ""}`}>{label}</span>
      {active && <div className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-primary-glow box-glow" />}
    </Link>
  );
}
