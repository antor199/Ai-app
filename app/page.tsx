"use client";

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, Lightbulb, Zap, UserPlus, LogOut, Menu, X } from 'lucide-react';
import AuthFlow from './components/AuthFlow';
import { insforge } from './lib/insforge';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<{ name: string, email: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        if (error) throw error;
        if (data?.user) {
          setUser({
            name: data.user.user_metadata?.name || "Replicant",
            email: data.user.email || ""
          });
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Session check failed:", err);
      }
    };
    checkSession();
  }, []);

  const handleAuthorized = useCallback((authorizedUser: { name: string, email: string }) => {
    setUser(authorizedUser);
    setIsLoggedIn(true);
    setShowAuth(false);
  }, []);

  if (showAuth && !isLoggedIn) {
    return <AuthFlow onAuthorized={handleAuthorized} />;
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-cosmic overflow-x-hidden">
      {/* Floating Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-[60] glass-panel px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 min-w-max">
          <BrainCircuit className="text-primary-glow w-5 h-5 sm:w-6 sm:h-6" />
          <span className="font-orbitron font-bold text-lg sm:text-xl tracking-wider text-white text-glow whitespace-nowrap">
            AI COPILOT
          </span>
        </div>

        {/* Center: Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href={isLoggedIn ? "/app" : "#"} onClick={() => !isLoggedIn && setShowAuth(true)} className="text-white/70 font-orbitron hover:text-white transition-colors tracking-widest">DASHBOARD</Link>
          <Link href={isLoggedIn ? "/absorb" : "#"} onClick={() => !isLoggedIn && setShowAuth(true)} className="text-white/70 font-orbitron hover:text-white transition-colors tracking-widest">ABSORB</Link>
          <Link href="#features" className="text-white/70 font-orbitron hover:text-white transition-colors tracking-widest">FEATURES</Link>
        </nav>

        {/* Right: Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoggedIn ? (
            <button
              onClick={() => setShowAuth(true)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2 rounded-full font-medium transition-all backdrop-blur-md hover:box-glow flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span className="font-orbitron text-xs tracking-widest">SIGN UP</span>
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-orbitron font-bold text-white tracking-widest uppercase">{user?.name}</span>
                <span className="text-[8px] font-orbitron text-primary-glow tracking-[0.2em]">NODE_ACTIVE</span>
              </div>
              <button
                onClick={async () => {
                  await insforge.auth.signOut();
                  setIsLoggedIn(false);
                  setUser(null);
                }}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 p-2 rounded-full transition-all backdrop-blur-md"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Action Area */}
        <div className="md:hidden flex items-center">
          {!isLoggedIn ? (
            <button
              onClick={() => setShowAuth(true)}
              className="bg-neon-gradient text-white px-4 py-2 rounded-lg font-orbitron text-[10px] font-bold tracking-widest box-glow"
            >
              SIGN IN
            </button>
          ) : (
            <button 
              className="p-2 text-white/70 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && isLoggedIn && (
        <div className="fixed inset-0 z-[55] bg-black/95 backdrop-blur-2xl md:hidden flex flex-col items-center justify-center gap-10 animate-in fade-in zoom-in-95 duration-300">
          <button 
            className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="flex flex-col items-center gap-8">
            <Link href="/app" onClick={() => setIsMenuOpen(false)} className="text-2xl font-orbitron font-bold text-white tracking-[0.3em] hover:text-primary-glow transition-colors">DASHBOARD</Link>
            <Link href="/absorb" onClick={() => setIsMenuOpen(false)} className="text-2xl font-orbitron font-bold text-white tracking-[0.3em] hover:text-primary-glow transition-colors">ABSORB</Link>
            <Link href="#features" onClick={() => setIsMenuOpen(false)} className="text-2xl font-orbitron font-bold text-white tracking-[0.3em] hover:text-primary-glow transition-colors">FEATURES</Link>
          </div>

          <button
            onClick={async () => {
              await insforge.auth.signOut();
              setIsLoggedIn(false);
              setUser(null);
              setIsMenuOpen(false);
            }}
            className="mt-10 border border-red-500/30 bg-red-500/10 text-red-400 px-10 py-4 rounded-xl font-orbitron font-bold tracking-[0.2em] hover:bg-red-500/20 transition-all"
          >
            TERMINATE SESSION
          </button>
        </div>
      )}

      {/* Main Hero Content */}
      <section className="relative z-10 flex flex-col items-center text-center mt-32 md:mt-40 px-6 sm:px-10 max-w-5xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="w-2 h-2 rounded-full bg-primary-glow animate-pulse"></span>
          <span className="text-[10px] font-orbitron font-bold text-white/50 tracking-[0.2em] uppercase">System v2.4.0 Online</span>
        </div>
        
        <h1 className="font-orbitron text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          THE <span className="text-gradient-primary text-glow">NEURAL</span> <br className="hidden sm:block" /> EVOLUTION
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-white/70 mb-10 max-w-2xl font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 px-2 sm:px-0">
          A cinematic, multi-model AI workspace designed for deep focus, knowledge absorption, and limitless creation. Powered by the next generation of neural engines.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <button
            onClick={() => setShowAuth(true)}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-neon-gradient rounded-xl text-white font-bold text-lg transition-all hover:scale-105 box-glow hover:box-glow-active focus:ring-2 focus:ring-primary-glow/50 font-orbitron tracking-widest w-full sm:w-auto"
          >
            LAUNCH AI
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <Link
            href="#features"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-lg transition-all hover:bg-white/10 font-orbitron tracking-widest w-full sm:w-auto backdrop-blur-md"
          >
            EXPLORE
          </Link>
        </div>
      </section>

      {/* Feature Grids */}
      <section id="features" className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-[95%] max-w-6xl mt-24 md:mt-40 pb-20 px-4 sm:px-6">
        <FeatureCard
          icon={<BrainCircuit className="w-8 h-8 text-primary-glow" />}
          title="Multi-Model Intel"
          description="Seamlessly switch between top-tier AI models including Gemini, Claude, and GPT-4o in real-time with zero latency."
          delay="delay-500"
        />
        <FeatureCard
          icon={<Lightbulb className="w-8 h-8 text-secondary-glow" />}
          title="Knowledge Synthesis"
          description="Drag and drop raw data, PDFs, and URLs. The system ingests and structures complex information into your neural network."
          delay="delay-700"
        />
        <FeatureCard
          icon={<Zap className="w-8 h-8 text-white" />}
          title="Edge Acceleration"
          description="Powered by InsForge's ultra-low latency infrastructure and Vercel's global edge network for instant responses."
          delay="delay-1000"
        />
      </section>

      {/* Decorative Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-glow/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-glow/5 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
    </main>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: string }) {
  return (
    <div className={`glass-panel p-6 sm:p-8 flex flex-col items-start gap-4 transition-all hover:-translate-y-2 hover:bg-white/[0.08] animate-in fade-in slide-in-from-bottom-8 duration-1000 ${delay}`}>
      <div className="p-3 rounded-xl bg-white/5 border border-white/10 box-glow">
        {icon}
      </div>
      <h3 className="font-orbitron font-bold text-xl text-white mt-2 tracking-wider uppercase">{title}</h3>
      <p className="text-white/60 leading-relaxed text-sm font-light">
        {description}
      </p>
    </div>
  );
}

