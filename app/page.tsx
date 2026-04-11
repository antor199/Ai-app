import Link from 'next/link';
import { ArrowRight, BrainCircuit, Lightbulb, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-60 mix-blend-screen"
        >
          <source src="/videos/blackhole.mp4" type="video/mp4" />
        </video>
        {/* Fallback deep gradient overlay */}
        <div className="absolute inset-0 bg-deep-gradient opacity-80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Floating Header */}
      <header className="absolute top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 glass-panel px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-primary-glow w-6 h-6" />
          <span className="font-orbitron font-bold text-xl tracking-wider text-white text-glow">
            SINGULARITY
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#features" className="text-white/70 hover:text-white transition-colors">Features</Link>
          <Link href="#models" className="text-white/70 hover:text-white transition-colors">Models</Link>
        </nav>
        <Link 
          href="/app" 
          className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2 rounded-full font-medium transition-all backdrop-blur-md hover:box-glow"
        >
          Enter Workspace
        </Link>
      </header>

      {/* Main Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center mt-32 px-4 max-w-4xl">
        <h1 className="font-orbitron text-5xl md:text-7xl font-black text-white leading-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          The <span className="text-gradient-primary text-glow">Next Evolution</span> of AI Interaction
        </h1>
        <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          A cinematic, multi-model AI workspace designed for deep focus, knowledge absorption, and limitless creation.
        </p>

        <Link 
          href="/app"
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#B6E5ED]/20 to-[#9ebaff]/20 border border-[#B6E5ED]/50 rounded-full text-white font-semibold text-lg overflow-hidden transition-all hover:scale-105 box-glow hover:box-glow-active focus:ring-2 focus:ring-[#B6E5ED]/50 focus:outline-none animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#B6E5ED] to-[#9ebaff] opacity-0 group-hover:opacity-20 transition-opacity" />
          <span>Launch Singularity</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
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
