"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ArrowRight, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function VerifyContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying neural link...");
  
  useEffect(() => {
    const token = searchParams.get('token');
    const insforgeStatus = searchParams.get('insforge_status');
    const insforgeError = searchParams.get('insforge_error');
    
    if (insforgeStatus === 'success' || token) {
      setStatus('success');
      setMessage('Email verified successfully');
    } else if (insforgeStatus === 'error' || insforgeError) {
      setStatus('error');
      setMessage(insforgeError || 'Invalid or expired link');
    } else {
      setStatus('error');
      setMessage('Invalid or expired link');
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cosmic px-4">
      <div className="glass-panel w-full max-w-md p-8 relative overflow-hidden group text-center space-y-6">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-glow/10 rounded-full blur-3xl group-hover:bg-primary-glow/20 transition-all duration-700"></div>
        
        <div className="flex justify-center">
          <div className="p-4 rounded-2xl bg-primary-glow/10 border border-primary-glow/20 box-glow">
            {status === 'loading' ? (
              <Loader2 className="w-10 h-10 text-primary-glow animate-spin" />
            ) : status === 'success' ? (
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            ) : (
              <XCircle className="w-10 h-10 text-red-500" />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="font-orbitron font-bold text-2xl text-white tracking-widest text-glow uppercase">
            {status === 'loading' ? 'SYNCHRONIZING...' : status === 'success' ? 'LINK CONFIRMED' : 'LINK FAILED'}
          </h1>
          <p className={`text-sm font-orbitron p-3 rounded-lg bg-black/40 border ${status === 'error' ? 'border-red-500/50 text-red-400' : 'border-primary-glow/50 text-primary-glow'}`}>
            {message}
          </p>
        </div>

        {status !== 'loading' && (
          <Link 
            href="/" 
            className="w-full py-4 bg-neon-gradient rounded-xl font-orbitron font-bold text-white tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all box-glow flex items-center justify-center gap-2 mt-6 inline-flex"
          >
            RETURN TO TERMINAL
            <ArrowRight className="w-5 h-5" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cosmic flex items-center justify-center"><Loader2 className="w-10 h-10 text-primary-glow animate-spin" /></div>}>
      <VerifyContent />
    </Suspense>
  );
}
