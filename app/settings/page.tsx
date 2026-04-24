"use client";

import { useState } from "react";
import AppLayout from "../app/layout";
import { User, Bell, Shield, PaintBucket } from "lucide-react";

export default function SettingsPage() {
  const [streamEnabled, setStreamEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  return (
    <AppLayout>
      <div className="flex-1 glass-panel relative overflow-y-auto h-full p-8 md:p-12">
        <div className="max-w-3xl mx-auto">

          <div className="mb-10 lg:mb-16 animate-in fade-in slide-in-from-bottom-4">
            <h1 className="font-orbitron font-bold text-3xl text-white mb-2">System Parameters</h1>
            <p className="text-white/60">Manage your workspace configuration and sensory settings.</p>
          </div>

          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 delay-150">

            {/* Account Settings */}
            <SettingSection title="Operator Identity" icon={<User className="w-5 h-5 text-primary-glow" />}>
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                <div>
                  <p className="text-white font-medium">Logged in as</p>
                  <p className="text-white/60 text-sm">operator@Ai copilot.ai</p>
                </div>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium">
                  Manage Connection
                </button>
              </div>
            </SettingSection>

            {/* Neural Stream Settings */}
            <SettingSection title="Sensory Parameters" icon={<PaintBucket className="w-5 h-5 text-primary-glow" />}>
              <div className="space-y-2">
                <ToggleRow
                  title="Streaming Neural Responses"
                  description="See AI thought processes in real-time as they generate."
                  enabled={streamEnabled}
                  onToggle={() => setStreamEnabled(!streamEnabled)}
                />
                <div className="w-full h-px bg-white/5" />
                <ToggleRow
                  title="Auditory Feedback"
                  description="Play subtle synth notes on message receive/send."
                  enabled={soundEnabled}
                  onToggle={() => setSoundEnabled(!soundEnabled)}
                />
              </div>
            </SettingSection>

            {/* Security */}
            <SettingSection title="Security & Data" icon={<Shield className="w-5 h-5 text-primary-glow" />}>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-white/80 text-sm mb-4 leading-relaxed">
                  Your neural chats and absorbed knowledge are permanently secured by InsForge Row-Level Security. Data is isolated per operator ID.
                </p>
                <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                  Purge Local Cache
                </button>
              </div>
            </SettingSection>

          </div>

        </div>
      </div>
    </AppLayout>
  );
}

function SettingSection({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="font-orbitron font-semibold text-lg text-white">{title}</h3>
      </div>
      <div className="pl-8">
        {children}
      </div>
    </div>
  );
}

function ToggleRow({ title, description, enabled, onToggle }: { title: string, description: string, enabled: boolean, onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl transition-all hover:bg-white/10">
      <div>
        <p className="text-white font-medium">{title}</p>
        <p className="text-white/50 text-sm mt-1">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-primary-glow/60 box-glow' : 'bg-black/50 border border-white/20'}`}
      >
        <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-all ${enabled ? 'bg-white left-7' : 'bg-white/50 left-1'}`} />
      </button>
    </div>
  );
}
