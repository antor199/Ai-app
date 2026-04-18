"use client";

import { ShieldCheck, Sparkles } from "lucide-react";

export default function EmailTemplatePreview() {
  return (
    <div className="p-8 bg-black/90 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-[#050014] border border-white/10 rounded-3xl overflow-hidden shadow-2xl font-sans">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00d2ff] to-[#9d50bb] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <div className="relative z-10">
            <h1 className="text-white font-bold text-2xl tracking-[0.2em] font-orbitron">Ai app</h1>
            <p className="text-white/80 text-xs mt-2 tracking-widest uppercase">Neural Uplink Authorization</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-10 space-y-8">
          <div className="space-y-4">
            <p className="text-white/90 text-sm leading-relaxed">
              Init_Login detected. To complete your entry into the <span className="text-primary-glow font-bold">Ai app</span> neural workspace, please enter the following authorization code:
            </p>
          </div>

          {/* Verification Code */}
          <div className="py-8 bg-white/5 border border-white/10 rounded-2xl text-center box-glow">
            <span className="text-4xl font-bold tracking-[0.5em] text-white font-orbitron text-glow">
              749281
            </span>
          </div>

          <div className="space-y-6 pt-4">
            <div className="flex items-start gap-4 p-4 bg-primary-glow/5 border border-primary-glow/20 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-primary-glow shrink-0 mt-0.5" />
              <p className="text-[11px] text-white/60 leading-relaxed italic">
                SESS_ENCRYPTION: This code is valid for 10 minutes. Do not share your encryption keys with other neural entities.
              </p>
            </div>

            <hr className="border-white/5" />

            <div className="text-center space-y-4">
              <p className="text-[10px] text-white/30 uppercase tracking-widest leading-loose">
                If you didn't create an account or request this uplink, <br />
                you can safely ignore this neural transmission.
              </p>

              <div className="pt-4">
                <p className="text-[9px] font-orbitron font-black text-white/20 tracking-[0.3em]">
                  Ai app // GLOBAL_EDGENET // VER_2.4.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
