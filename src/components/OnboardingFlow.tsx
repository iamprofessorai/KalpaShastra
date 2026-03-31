import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface OnboardingFlowProps {
  onboardingData: any;
  setOnboardingData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSyncing: boolean;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onboardingData,
  setOnboardingData,
  onSubmit,
  isSyncing
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-32">
      <GlassCard className="max-w-xl w-full p-6 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Sparkles className="w-32 h-32" />
        </div>
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display mb-4 tracking-tight">The Initiation.</h2>
          <p className="text-white/40 text-sm uppercase tracking-[0.2em]">Synchronizing your biological signature with the cosmic clock.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <label className="text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Full Name</label>
              <input 
                type="text"
                required
                value={onboardingData.name}
                onChange={(e) => setOnboardingData({...onboardingData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all text-white placeholder:text-white/10 font-mono"
                placeholder="Enter your name"
              />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <label className="text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Birth Date</label>
                <input 
                  type="date"
                  required
                  value={onboardingData.dob}
                  onChange={(e) => setOnboardingData({...onboardingData, dob: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all text-white font-mono"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <label className="text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Birth Time</label>
                <input 
                  type="time"
                  required
                  value={onboardingData.tob}
                  onChange={(e) => setOnboardingData({...onboardingData, tob: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all text-white font-mono"
                />
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <label className="text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Birth Location</label>
              <input 
                type="text"
                required
                value={onboardingData.pob}
                onChange={(e) => setOnboardingData({...onboardingData, pob: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all text-white placeholder:text-white/10 font-mono"
                placeholder="City, Country"
              />
            </motion.div>
          </div>

          <motion.button 
            type="submit"
            disabled={isSyncing}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full group relative px-8 py-6 bg-primary text-black font-bold rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-[0_0_40px_var(--glow-color)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative z-10 flex items-center justify-center gap-4 text-lg">
              {isSyncing ? 'SYNCHRONIZING...' : 'INITIALIZE SYNC'}
              <ArrowRight className="w-6 h-6" />
            </span>
          </motion.button>
        </form>
      </GlassCard>
    </div>
  );
};
