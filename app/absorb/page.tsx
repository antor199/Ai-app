"use client";

import { useState } from "react";
import { UploadCloud, Link as LinkIcon, FileText, CheckCircle2 } from "lucide-react";
import AppLayout from "../app/layout";

export default function AbsorbPage() {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAbsorb = () => {
    if (!url) return;
    setIsProcessing(true);
    // Mock processing
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setUrl("");
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="flex-1 glass-panel flex flex-col items-center justify-center relative overflow-hidden h-full p-8 md:p-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-4">
          <h1 className="font-orbitron font-bold text-4xl text-white mb-4">Knowledge Absorption</h1>
          <p className="text-white/60 text-lg">
            Feed URLs or upload documents to expand the system's neural pathways. Absorbed data becomes part of your active context.
          </p>
        </div>

        {/* Input Areas */}
        <div className="w-full max-w-xl space-y-8 animate-in fade-in slide-in-from-bottom-8 delay-150">
          
          {/* Drag & Drop Area */}
          <div className="w-full h-48 border-2 border-dashed border-white/20 rounded-3xl bg-black/20 flex flex-col items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/5 hover:border-primary-glow/50 transition-all cursor-pointer box-glow group">
            <UploadCloud className="w-12 h-12 mb-4 group-hover:text-primary-glow transition-colors" />
            <p className="font-medium text-lg">Drag & Drop Documents Here</p>
            <p className="text-sm mt-1">Supports PDF, TXT, MD, CSV</p>
          </div>

          <div className="flex items-center gap-4 w-full text-white/30">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="font-orbitron text-xs">OR</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          {/* URL Input */}
          <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-white/40 group-focus-within:text-primary-glow transition-colors" />
             </div>
            <input 
              type="text" 
              className="w-full bg-black/40 border border-white/10 text-white rounded-2xl pl-12 pr-32 py-4 focus:ring-2 focus:ring-primary-glow/50 focus:border-primary-glow/50 transition-all box-glow backdrop-blur-md"
              placeholder="Paste a URL to absorb..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button 
              onClick={handleAbsorb}
              disabled={!url || isProcessing}
              className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-primary-glow to-secondary-glow text-[#050014] px-6 rounded-xl font-bold transition-all hover:opacity-90 disabled:opacity-50"
            >
              {isProcessing ? "Absorbing..." : "Absorb"}
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {success && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 glass-panel border-[#B6E5ED]/30 px-6 py-3 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-8">
            <CheckCircle2 className="w-5 h-5 text-primary-glow" />
            <span className="text-white font-medium">Knowledge sequence absorbed successfully.</span>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
