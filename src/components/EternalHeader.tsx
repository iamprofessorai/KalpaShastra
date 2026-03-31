import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, AlertTriangle, LogOut, ChevronLeft, User } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface EternalHeaderProps {
  view: 'landing' | 'onboarding' | 'dashboard' | 'astrologer-onboarding';
  profile: any;
  selectedModule: string | null;
  onBackToOrbit: () => void;
  onCloseConnection: () => void;
  onInitialize?: () => void;
}

const LiveTicker = () => (
  <div className="w-full bg-bg-custom border-y border-primary/10 py-2 overflow-hidden whitespace-nowrap relative z-50">
    <div className="flex animate-marquee gap-12 items-center">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-12 items-center">
          <span className="flex items-center gap-2 text-[10px] font-mono text-primary/60 uppercase tracking-[0.2em]">
            <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
            [ LIVE ] SUN in ♈ (16°)
          </span>
          <span className="flex items-center gap-2 text-[10px] font-mono text-primary/60 uppercase tracking-[0.2em]">
            <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
            MOON in ♌ (Magha)
          </span>
          <span className="flex items-center gap-2 text-[10px] font-mono text-primary/60 uppercase tracking-[0.2em]">
            <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
            MERCURY RETROGRADE: 2 DAYS REMAINING
          </span>
          <span className="flex items-center gap-2 text-[10px] font-mono text-primary/60 uppercase tracking-[0.2em]">
            <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
            CURRENT VIBE: 88% RESONANCE
          </span>
        </div>
      ))}
    </div>
  </div>
);

const LetterByLetterLogo = ({ text }: { text: string }) => {
  return (
    <div className="flex">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.5,
            delay: i * 0.1,
            ease: "easeOut"
          }}
          className="text-sm lg:text-xl font-display tracking-tighter celestial-glow uppercase leading-none"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
};

const WavingFlag = () => {
  return (
    <motion.div
      animate={{
        skewY: [0, 2, 0, -2, 0],
        y: [0, -1, 0, 1, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="relative w-6 h-4 lg:w-8 lg:h-5 flex flex-col overflow-hidden rounded-[1px] shadow-[0_0_15px_rgba(255,153,51,0.2)] border border-white/10"
    >
      {/* Saffron */}
      <div className="h-1/3 bg-[#FF9933]" />
      {/* White */}
      <div className="h-1/3 bg-white flex items-center justify-center relative">
        {/* Ashoka Chakra */}
        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full border-[0.5px] border-[#000080] flex items-center justify-center relative">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-[0.2px] h-full bg-[#000080]" 
              style={{ transform: `rotate(${i * 30}deg)` }} 
            />
          ))}
        </div>
      </div>
      {/* Green */}
      <div className="h-1/3 bg-[#128807]" />
      
      {/* Wave Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
    </motion.div>
  );
};

export const EternalHeader: React.FC<EternalHeaderProps> = ({ 
  view, 
  profile, 
  selectedModule, 
  onBackToOrbit,
  onCloseConnection,
  onInitialize
}) => {
  const isDashboard = view === 'dashboard';
  const isInnerModule = !!selectedModule;

  return (
    <div className="fixed top-0 left-0 w-full z-[100] h-[104px]">
      <LiveTicker />
      
      <header className="h-[72px] px-4 lg:px-8 flex items-center justify-between border-b border-white/5 bg-bg-custom transition-all duration-500">
        <div className="flex items-center gap-4 lg:gap-8">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <LetterByLetterLogo text="Again India" />
                <WavingFlag />
              </div>
              <p className="text-[6px] lg:text-[8px] text-white/40 uppercase tracking-[0.3em] mt-1">
                Ancient Wisdom • Cybernetic Intelligence
              </p>
            </div>
          </div>

          <AnimatePresence>
            {view === 'landing' && (
              <motion.nav 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="hidden lg:flex items-center gap-4 xl:gap-6 pl-6 xl:pl-8 border-l border-white/10"
              >
                {[
                  { name: 'Origin', id: 'origin' },
                  { name: 'Why', id: 'why' },
                  { name: 'What', id: 'what' },
                  { name: 'How', id: 'how' },
                  { name: 'Modules', id: 'modules' },
                  { name: 'Consult', id: 'consultation' },
                  { name: 'Onboard', id: 'onboarding' },
                  { name: 'News', id: 'newsletter' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-[8px] xl:text-[9px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-colors whitespace-nowrap"
                  >
                    {item.name}
                  </button>
                ))}
              </motion.nav>
            )}

            {isDashboard && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="hidden md:flex items-center gap-6 pl-8 border-l border-white/10"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                  <Shield className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-mono text-primary uppercase tracking-widest">System: Synchronized</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20 animate-pulse">
                  <AlertTriangle className="w-3 h-3 text-secondary" />
                  <span className="text-[10px] font-mono text-secondary uppercase tracking-widest">Rahu Kaal: Active</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4">
          <AnimatePresence>
            {isInnerModule && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={onBackToOrbit}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-white/10 transition-colors text-primary"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Back to Orbit</span>
              </motion.button>
            )}
          </AnimatePresence>

          {view === 'landing' && (
            <button 
              onClick={onInitialize}
              className="px-6 py-2.5 glass border-primary/50 text-primary font-black rounded-xl hover:bg-primary/10 transition-all uppercase tracking-widest text-[10px] shadow-[0_0_20px_var(--glow-color)]"
            >
              Initialize
            </button>
          )}

          {isDashboard ? (
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl glass border-primary/20">
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10">
                  <img 
                    src={auth.currentUser?.photoURL || `https://picsum.photos/seed/${auth.currentUser?.uid}/200`} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest">{profile?.name || 'User'}</p>
                  <p className="text-[8px] text-primary uppercase tracking-widest">{profile?.signature?.path || 'Seeker'}</p>
                </div>
              </div>
              
              <button 
                onClick={onCloseConnection}
                className="px-3 lg:px-4 py-2 rounded-xl glass border-secondary/20 text-secondary hover:bg-secondary/10 transition-colors text-[8px] lg:text-[10px] uppercase tracking-widest font-bold"
              >
                <span className="hidden sm:inline">Close Connection</span>
                <span className="sm:hidden">Close</span>
              </button>

              <button 
                onClick={() => signOut(auth)}
                className="p-2 lg:p-3 rounded-xl glass hover:bg-secondary/10 group transition-colors"
              >
                <LogOut className="w-4 h-4 lg:w-5 lg:h-5 text-white/40 group-hover:text-secondary" />
              </button>
            </div>
          ) : view === 'onboarding' && (
            <button 
              onClick={onCloseConnection}
              className="px-4 py-2 rounded-xl glass border-secondary/20 text-secondary hover:bg-secondary/10 transition-colors text-[10px] uppercase tracking-widest font-bold"
            >
              Return to Source
            </button>
          )}
        </div>
      </header>
    </div>
  );
};
