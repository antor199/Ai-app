"use client";

import { useState, useRef, useEffect } from "react";
import { User, Mail, Lock, Sparkles, ArrowRight, RefreshCw, LogIn, UserPlus, ShieldCheck } from "lucide-react";
import { insforge } from "../lib/insforge";

type AuthMode = "signin" | "signup" | "verify" | "loading" | "authorized";

export default function AuthFlow({ onAuthorized }: { onAuthorized: (user: { name: string, email: string }) => void }) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleVerifyChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const startVerification = async () => {
    setMode("loading");
    setStatusMsg("");
    try {
      if (mode === "signup") {
        const { data, error } = await insforge.auth.signUp({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          redirectTo: typeof window !== "undefined" ? `${window.location.origin}/verify` : undefined
        });
        if (error) throw error;

        if (data?.requireEmailVerification) {
          setMode("verify");
          setStatusMsg("Verification email sent");
        } else if (data?.accessToken) {
          onAuthorized({ name: formData.name || "Replicant", email: formData.email });
        }
      } else {
        const { data, error } = await insforge.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (error) {
          if (error.statusCode === 403) setStatusMsg("Please verify your email first");
          else throw error;
          setMode("signin");
        } else if (data?.user) {
          onAuthorized({ name: data.user.name || "Replicant", email: data.user.email });
        }
      }
    } catch (err: any) {
      setStatusMsg(err.message || "Authentication failed");
      setMode(mode);
    }
  };

  const confirmVerification = async () => {
    setMode("loading");
    setStatusMsg("");
    try {
      const { data, error } = await insforge.auth.verifyEmail({
        email: formData.email,
        otp: verificationCode.join("")
      });
      if (error) throw error;
      if (data?.user) {
        setStatusMsg("Email verified successfully");
        onAuthorized({ name: formData.name || "Replicant", email: formData.email });
      }
    } catch (err: any) {
      setStatusMsg(err.message || "Invalid verification code");
      setMode("verify");
    }
  };

  const resendCode = async () => {
    setIsResending(true);
    setStatusMsg("");
    try {
      const { error } = await insforge.auth.resendVerificationEmail({
        email: formData.email,
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/verify` : undefined
      });
      if (error) throw error;
      setStatusMsg("Verification email resent");
    } catch (err: any) {
      setStatusMsg(err.message || "Failed to resend");
    } finally {
      setIsResending(false);
    }
  };

  if (mode === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-cosmic">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-primary-glow/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-primary-glow rounded-full animate-spin"></div>
          <Sparkles className="absolute inset-0 m-auto text-primary-glow w-8 h-8 animate-pulse" />
        </div>
        <h2 className="font-orbitron text-xl tracking-[0.3em] text-primary-glow animate-pulse-neural">
          SYNCHRONIZING NEURAL IDENTITY...
        </h2>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-cosmic px-4">
      <div className="glass-panel w-full max-w-md p-8 relative overflow-hidden group">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-glow/10 rounded-full blur-3xl group-hover:bg-primary-glow/20 transition-all duration-700"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-secondary-glow/10 rounded-full blur-3xl group-hover:bg-secondary-glow/20 transition-all duration-700"></div>

        {mode === "verify" ? (
          <div className="space-y-8 text-center">
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl bg-primary-glow/10 border border-primary-glow/20 box-glow-blue">
                <ShieldCheck className="w-10 h-10 text-primary-glow" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-orbitron font-bold text-2xl text-white tracking-wider">Ai VERIFICATION</h2>
              <p className="text-white/60 text-sm">
                A verification code has been sent to <br />
                <span className="text-secondary-glow font-medium">{formData.email || "user@ai-copilot.com"}</span>
              </p>
              {statusMsg && (
                <div className={`text-sm mt-4 text-center font-orbitron p-3 rounded-lg bg-black/40 border ${statusMsg.includes('failed') || statusMsg.includes('Invalid') ? 'border-red-500/50 text-red-400' : 'border-primary-glow/50 text-primary-glow'}`}>
                  {statusMsg}
                </div>
              )}
            </div>

            <div className="flex justify-between gap-2">
              {verificationCode.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  value={digit}
                  onChange={(e) => handleVerifyChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`digital-box ${digit ? 'digital-box-active' : ''} bg-black/40 focus:outline-none text-center`}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <div className="space-y-4">
              <button
                onClick={confirmVerification}
                className="w-full py-4 bg-neon-gradient rounded-xl font-orbitron font-bold text-white tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all box-glow-blue flex items-center justify-center gap-2"
              >
                AUTHORIZE UPLINK
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex justify-between items-center text-xs">
                <button
                  onClick={resendCode}
                  disabled={isResending}
                  className="text-white/40 hover:text-white transition-colors flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                  {isResending ? "RE-TRANSMITTING..." : "RESEND CODE"}
                </button>
                <button
                  onClick={() => setMode("signin")}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  WRONG EMAIL?
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neon-gradient box-glow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="font-orbitron font-bold text-2xl text-white tracking-widest text-glow">
                {mode === "signin" ? "LOGIN" : "CREATE ACCOUNT"}
              </h1>
            </div>

            <div className="space-y-6">
              {statusMsg && (
                <div className={`text-sm text-center font-orbitron p-3 rounded-lg bg-black/40 border ${statusMsg.includes('failed') || statusMsg.includes('Invalid') || statusMsg.includes('first') ? 'border-red-500/50 text-red-400' : 'border-primary-glow/50 text-primary-glow'}`}>
                  {statusMsg}
                </div>
              )}
              {mode === "signup" && (
                <div className="space-y-2">
                  <label className="text-xs font-orbitron text-white/40 uppercase tracking-widest">Enter Name</label>
                  <div className="relative group/input">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-primary-glow transition-colors" />
                    <input
                      type="text"
                      placeholder="Ai copilot"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary-glow/50 focus:bg-primary-glow/5 transition-all font-light tracking-wider"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-orbitron text-white/40 uppercase tracking-widest">Enter Email</label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-primary-glow transition-colors" />
                  <input
                    type="email"
                    placeholder="user@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary-glow/50 focus:bg-primary-glow/5 transition-all font-light tracking-wider"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-orbitron text-white/40 uppercase tracking-widest">Enter Password</label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-primary-glow transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary-glow/50 focus:bg-primary-glow/5 transition-all font-light tracking-wider"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <button
                onClick={startVerification}
                className="w-full py-4 bg-neon-gradient rounded-xl font-orbitron font-bold text-white tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all box-glow flex items-center justify-center gap-2 group/btn"
              >
                {mode === "signin" ? (
                  <>
                    LOGIN ACCOUNT
                    <LogIn className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    CREATE NOW
                    <UserPlus className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                  className="text-sm text-white/40 hover:text-primary-glow transition-colors font-orbitron tracking-widest"
                >
                  {mode === "signin" ? ">> CREATE_NEW_ACCOUNT" : ">> LOGIN_MY_ACCOUNT"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
