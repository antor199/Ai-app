"use client";

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, Lightbulb, Zap, UserPlus, LogIn, LogOut, Loader2, Sparkles } from 'lucide-react';
import AuthFlow from './components/AuthFlow';
import { insforge } from './lib/insforge';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<{ name: string, email: string } | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await insforge.auth.getCurrentUser();
      if (data?.user) {
        setUser({
          name: data.user.user_metadata?.name || "Replicant",
          email: data.user.email || ""
        });
        setIsLoggedIn(true);
      }
    };
    checkSession();
  }, []);

  const handleAuthorized = useCallback((authorizedUser: { name: string, email: string }) => {
    setUser(authorizedUser);
    setIsLoggedIn(true);
    setShowAuth(false);
    // In a real app, we'd redirect or change state here
  }, []);

  if (showAuth && !isLoggedIn) {
    return <AuthFlow onAuthorized={handleAuthorized} />;
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-cosmic">
      {/* Floating Header */}
      <header className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 glass-panel px-6 py-4 flex items-center">
        {/* Left: Logo */}
        <div className="flex-1 flex items-center gap-2">
          <BrainCircuit className="text-primary-glow w-6 h-6" />
          <span className="font-orbitron font-bold text-xl tracking-wider text-white text-glow">
            Ai app
          </span>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href={isLoggedIn ? "/app" : "#"} onClick={() => !isLoggedIn && setShowAuth(true)} className="text-white/70 font-orbitron hover:text-white transition-colors">DASHBOARD</Link>
          <Link href={isLoggedIn ? "/absorb" : "#"} onClick={() => !isLoggedIn && setShowAuth(true)} className="text-white/70 font-orbitron hover:text-white transition-colors">ABSORB</Link>
          <Link href="#models" className="text-white/70 font-orbitron hover:text-white transition-colors">MODELS</Link>
        </nav>

        {/* Right: Auth Buttons */}
        <div className="flex-1 flex justify-end items-center gap-4">
          {!isLoggedIn ? (
            <button
              onClick={() => setShowAuth(true)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2 rounded-full font-medium transition-all backdrop-blur-md hover:box-glow flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-orbitron font-bold text-white tracking-widest uppercase">{user?.name}</span>
                <span className="text-[9px] font-orbitron text-primary-glow tracking-[0.2em]">ACTIVE</span>
              </div>
              <button
                onClick={async () => {
                  await insforge.auth.signOut();
                  setIsLoggedIn(false);
                  setUser(null);
                }}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-5 py-2 rounded-full font-medium transition-all backdrop-blur-md flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center mt-32 px-4 max-w-4xl">
        <h1 className="font-orbitron text-5xl md:text-7xl font-black text-white leading-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          The <span className="text-gradient-primary text-glow">Next Evolution</span> of AI Interaction
        </h1>
        <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          A cinematic, multi-model AI workspace designed for deep focus, knowledge absorption, and limitless creation.
        </p>

        <button
          onClick={() => setShowAuth(true)}
          style={{ transform: 'translate(-2%, -3%)' }}
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#B6E5ED]/20 to-[#9ebaff]/20 border border-[#B6E5ED]/50 rounded-full text-white font-semibold text-lg overflow-hidden transition-all hover:scale-105 box-glow hover:box-glow-active focus:ring-2 focus:ring-[#B6E5ED]/50 focus:outline-none animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#B6E5ED] to-[#9ebaff] opacity-0 group-hover:opacity-20 transition-opacity" />
          <span className='font-orbitron'>Launch Ai</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Feature Grids */}
      <div id="features" className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-[90%] max-w-6xl mt-32 pb-20">
        <FeatureCard
          icon={<BrainCircuit className="w-8 h-8 text-primary-glow" />}
          title="Multi-Model Intel"
          description="Seamlessly switch between top-tier AI models including Gemini, Claude, and DeepSeek in real-time."
          delay="delay-500"
        />
        <FeatureCard
          icon={<Lightbulb className="w-8 h-8 text-[#9ebaff]" />}
          title="Knowledge Absorption"
          description="Drag and drop raw data, PDFs, and URLs. The system ingests and structures complex information instantly."
          delay="delay-700"
        />
        <FeatureCard
          icon={<Zap className="w-8 h-8 text-white" />}
          title="Lightning Speed"
          description="Powered by InsForge's ultra-low latency infrastructure and Vercel's global edge network."
          delay="delay-1000"
        />
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: string }) {
  return (
    <div className={`glass-panel p-8 flex flex-col items-start gap-4 transition-all hover:-translate-y-2 hover:bg-white/[0.08] animate-in fade-in slide-in-from-bottom-8 duration-1000 ${delay}`}>
      <div className="p-3 rounded-xl bg-white/5 border border-white/10 box-glow">
        {icon}
      </div>
      <h3 className="font-orbitron font-bold text-xl text-white mt-2">{title}</h3>
      <p className="text-white/60 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}
