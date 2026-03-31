import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Shield, Compass, Star, Hash, Eye, Clock, 
  TrendingUp, Heart, Activity, CheckCircle2, XCircle, 
  ChevronRight, ArrowRight, Sparkles, Binary, Globe, 
  Cpu, Layers, MessageSquare, ArrowUp, Gem, Volume2,
  X, Calendar, Music, Play, Pause, Loader2, Mic
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Orrery } from './Orrery';
import { ChatBot } from './ChatBot';
import { LiveOracleSession } from './LiveOracleSession';
import { generateCosmicMusic, speakCosmicGuidance } from '../services/geminiService';
import { toast } from 'sonner';

interface DashboardContainerProps {
  user: any;
  profile: any;
  predictions: any;
  cosmicInsight: string | null;
  selectedModule: string | null;
  setSelectedModule: (module: string | null) => void;
  renderModule: () => React.ReactNode;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({
  user,
  profile,
  predictions,
  cosmicInsight,
  selectedModule,
  setSelectedModule,
  renderModule
}) => {
  const [musicPrompt, setMusicPrompt] = React.useState("");
  const [isGeneratingMusic, setIsGeneratingMusic] = React.useState(false);
  const [musicUrl, setMusicUrl] = React.useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [oracleAudioUrl, setOracleAudioUrl] = React.useState<string | null>(null);
  const [showLiveSession, setShowLiveSession] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile?.name || 'Seeker';
    if (hour < 12) return `Auspicious Morning, ${name}. The Sun rises in your favor.`;
    if (hour < 18) return `Radiant Afternoon, ${name}. Your cosmic alignment is strong.`;
    return `Mystical Evening, ${name}. The stars are watching over your path.`;
  };

  const handleGenerateMusic = async () => {
    if (!musicPrompt.trim()) return;
    setIsGeneratingMusic(true);
    try {
      const url = await generateCosmicMusic(musicPrompt);
      setMusicUrl(url);
      toast.success("Cosmic melody synthesized.");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate music.");
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  const handleSpeakGuidance = async (text: string) => {
    if (!text || isSpeaking) return;
    setIsSpeaking(true);
    try {
      const url = await speakCosmicGuidance(text);
      if (url) {
        setOracleAudioUrl(url);
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play();
        }
      }
    } catch (error) {
      toast.error("The Oracle's voice is currently faint. Please try again.");
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="pt-[104px] pb-[80px] lg:pb-6 min-h-screen flex flex-col font-body-mystic bg-black relative z-10">
      <audio ref={audioRef} onEnded={() => setIsSpeaking(false)} className="hidden" />
      
      <main id="dashboard-main" className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row p-4 lg:p-6 gap-6">
        {/* Pillar 1: The Archive */}
        <aside id="pillar-archive" className="w-full lg:w-1/5 flex flex-col gap-6 shrink-0 lg:overflow-y-auto lg:pr-2 hidden lg:flex">
          <GlassCard id="user-profile-card" className="p-0 overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-amber-500/20 to-cosmic-indigo" />
            <div className="px-6 pb-6 -mt-12 text-center">
              <div className="w-20 h-20 rounded-2xl glass mx-auto mb-4 p-1">
                <img 
                  src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/200`} 
                  className="w-full h-full rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-serif-mystic text-xl mb-1">{profile?.name}</h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="px-2 py-1 bg-amber-500/10 rounded text-[10px] text-amber-500 font-mono tracking-widest uppercase">
                  Vibe Score: {profile?.signature?.vibeScore}%
                </div>
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
                {profile?.signature?.path}
              </p>
            </div>
          </GlassCard>

          <div className="space-y-4">
            <h4 className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Quick Tools</h4>
            {[
              { label: 'Gemstone', value: 'Saffron Sapphire', icon: <Gem /> },
              { label: 'Mantra', value: 'Om Suryaya Namaha', icon: <Volume2 /> },
              { label: 'Lucky Color', value: 'Saffron', icon: <div className="w-4 h-4 rounded-full bg-amber-600" /> },
            ].map((tool) => (
              <GlassCard key={tool.label} className="p-4 flex items-center gap-4 group cursor-pointer hover:border-amber-500/30 transition-all">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-amber-500 group-hover:bg-amber-500/20 transition-colors">
                  {tool.icon}
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">{tool.label}</p>
                  <p className="text-xs font-bold">{tool.value}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          <GlassCard 
            variant="gold" 
            className="p-6 border-amber-500/40 cursor-pointer hover:scale-105 transition-all animate-pulse-celestial"
            onClick={() => setShowLiveSession(true)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                <Mic className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">Live Oracle</p>
                <p className="text-xs text-white/80">Voice Guidance</p>
              </div>
            </div>
          </GlassCard>
        </aside>

        {/* Pillar 2: The Engine (Bento Grid) */}
        <section id="pillar-engine" className="w-full lg:flex-1 flex flex-col gap-6 shrink-0 lg:overflow-y-auto lg:px-2">
          <div className="flex flex-col gap-2 mb-2">
            <h2 className="text-lg font-serif-mystic celestial-glow">{getGreeting()}</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.4em]">Sidereal Time: {new Date().toLocaleTimeString()}</p>
          </div>

          {cosmicInsight && (
            <GlassCard id="cosmic-insight-card" className="bg-gradient-to-r from-amber-500/10 to-cosmic-indigo border-amber-500/20 p-6 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles className="w-32 h-32 text-amber-500" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-xs uppercase tracking-[0.4em] font-bold text-amber-500">Daily Cosmic Insight</h3>
              </div>
              <p className="text-sm md:text-lg text-white/90 leading-relaxed italic font-serif-mystic tracking-wide">
                "{cosmicInsight}"
              </p>
              <button 
                onClick={() => handleSpeakGuidance(cosmicInsight)}
                disabled={isSpeaking}
                className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-500 hover:text-amber-400 disabled:opacity-50"
              >
                {isSpeaking ? <Loader2 className="w-3 h-3 animate-spin" /> : <Volume2 className="w-3 h-3" />}
                Listen to the Oracle
              </button>
            </GlassCard>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Orrery Card */}
            <div className="lg:col-span-2 glass rounded-3xl overflow-hidden border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)] h-[400px] lg:h-[500px]">
              <Orrery />
            </div>

            {/* Astrology Engine Card */}
            <GlassCard 
              variant="gold" 
              className="relative overflow-hidden group cursor-pointer hover:border-amber-500/50 h-full"
              onClick={() => setSelectedModule('astro')}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Star className="w-24 h-24" />
              </div>
              <h3 className="text-xl mb-6 celestial-glow font-serif-mystic">Astrology Engine</h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-1 p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Current Mahadasha</span>
                  <span className="text-lg font-bold text-amber-500 tracking-widest">JUPITER</span>
                </div>
                <div className="flex flex-col gap-1 p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Active Transit</span>
                  <span className="text-lg font-bold text-amber-500 tracking-widest">Mars in 4th</span>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-[0.2em]">Analyze your complex planetary alignments with AI precision.</p>
                </div>
              </div>
            </GlassCard>

            {/* Numerology Matrix Card */}
            <GlassCard 
              className="relative overflow-hidden group cursor-pointer hover:border-amber-500/50"
              onClick={() => setSelectedModule('numero')}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Hash className="w-24 h-24" />
              </div>
              <h3 className="text-xl mb-4 celestial-glow font-serif-mystic">Numerology Matrix</h3>
              <div className="grid grid-cols-3 gap-2 aspect-square max-w-[150px] mx-auto">
                {[4, 9, 2, 3, 5, 7, 8, 1, 6].map((num) => (
                  <div key={num} className="aspect-square glass flex items-center justify-center text-lg font-mono text-amber-500/50 group-hover:text-amber-500 transition-colors">
                    {num}
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* AI Vision Card */}
            <GlassCard 
              className="relative overflow-hidden group cursor-pointer hover:border-cyan-500/50"
              onClick={() => setSelectedModule('vision')}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Eye className="w-24 h-24" />
              </div>
              <h3 className="text-xl mb-4 celestial-glow font-serif-mystic">AI Vision</h3>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30 animate-pulse">
                  <Compass className="w-8 h-8 text-cyan-500" />
                </div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-4">Initialize Spatial Scan</p>
              </div>
            </GlassCard>

            {/* Cosmic Panjika Card */}
            <GlassCard 
              className="relative overflow-hidden group cursor-pointer hover:border-amber-500/50"
              onClick={() => setSelectedModule('panchang')}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Clock className="w-24 h-24" />
              </div>
              <h3 className="text-xl mb-4 celestial-glow font-serif-mystic">Cosmic Panjika</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Sidereal Sync Active</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/10">
                  <Calendar className="w-4 h-4 text-white/40" />
                  <span className="text-[10px] text-white/60 uppercase tracking-widest">Yearly Hindu Calendar</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Pillar 3: The Pulse */}
        <aside id="pillar-pulse" className="w-full lg:w-1/4 flex flex-col gap-6 shrink-0 lg:overflow-y-auto lg:pl-2">
          <GlassCard id="daily-predictions-card" className="bg-amber-500/5 border-amber-500/20">
            <h3 className="text-sm uppercase tracking-[0.3em] mb-6 flex items-center gap-2 font-serif-mystic">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              Daily Predictions
            </h3>
            
            <div className="space-y-6">
              {[
                { label: 'Career', value: predictions?.career || 'Loading...', icon: <TrendingUp />, color: 'text-blue-400' },
                { label: 'Love', value: predictions?.love || 'Loading...', icon: <Heart />, color: 'text-pink-400' },
                { label: 'Health', value: predictions?.health || 'Loading...', icon: <Activity />, color: 'text-green-400' },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-white/40">{item.label}</span>
                    <div className={item.color}>{item.icon}</div>
                  </div>
                  <p className="text-xs leading-relaxed text-white/80">{item.value}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm uppercase tracking-[0.3em] flex items-center gap-2 font-serif-mystic">
                <Music className="w-4 h-4 text-amber-500" />
                Cosmic Music
              </h3>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="text"
                  value={musicPrompt}
                  onChange={(e) => setMusicPrompt(e.target.value)}
                  placeholder="Describe your vibe..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500/50 transition-all"
                />
                <button 
                  onClick={handleGenerateMusic}
                  disabled={isGeneratingMusic || !musicPrompt.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-500 disabled:opacity-50"
                >
                  {isGeneratingMusic ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
              {musicUrl && (
                <div className="flex items-center gap-3 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                  <Volume2 className="w-4 h-4 text-amber-500" />
                  <audio src={musicUrl} controls className="h-6 w-full opacity-60" />
                </div>
              )}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-xs uppercase tracking-[0.3em] mb-4 font-serif-mystic">The Path</h3>
            <div className="space-y-3">
              {predictions?.do?.map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-3 text-[11px] text-green-400/80">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
              {predictions?.dont?.map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-3 text-[11px] text-red-400/80">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard variant="gold" className="border-amber-500/40">
            <h3 className="text-[10px] uppercase tracking-[0.3em] mb-2 text-amber-500 font-serif-mystic">Lal Kitab Remedy</h3>
            <p className="text-xs italic leading-relaxed text-amber-100/80 mb-4">
              "{predictions?.lalKitabRemedy || 'Consulting the ancient scrolls...'}"
            </p>
            {predictions?.lalKitabRemedy && (
              <button 
                onClick={() => handleSpeakGuidance(predictions.lalKitabRemedy)}
                disabled={isSpeaking}
                className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-500 hover:text-amber-400 disabled:opacity-50"
              >
                {isSpeaking ? <Loader2 className="w-3 h-3 animate-spin" /> : <Volume2 className="w-3 h-3" />}
                Speak Remedy
              </button>
            )}
          </GlassCard>

          {oracleAudioUrl && (
            <GlassCard className="border-amber-500/30 bg-amber-500/5">
              <h3 className="text-[10px] uppercase tracking-[0.3em] mb-4 flex items-center gap-2 font-serif-mystic">
                <Volume2 className="w-4 h-4 text-amber-500" />
                Oracle Voice
              </h3>
              <audio 
                src={oracleAudioUrl} 
                controls 
                autoPlay
                className="w-full h-8 opacity-70"
                onPlay={() => setIsSpeaking(true)}
                onEnded={() => setIsSpeaking(false)}
              />
            </GlassCard>
          )}
        </aside>
      </main>

      {/* Mobile Navigation Rail */}
      <div id="mobile-nav-rail" className="lg:hidden fixed bottom-0 left-0 right-0 z-[150] bg-zinc-900/95 backdrop-blur-xl border-t border-amber-500/20 px-6 h-[80px] flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <button 
          onClick={() => setSelectedModule(selectedModule === 'astro' ? null : 'astro')} 
          className={`flex flex-col items-center gap-1 transition-colors ${selectedModule === 'astro' ? 'text-amber-500' : 'text-white/40'}`}
        >
          <Star className="w-6 h-6" />
          <span className="text-[8px] uppercase tracking-widest font-bold">Astro</span>
        </button>
        <button 
          onClick={() => setSelectedModule(selectedModule === 'vision' ? null : 'vision')} 
          className={`flex flex-col items-center gap-1 transition-colors ${selectedModule === 'vision' ? 'text-cyan-500' : 'text-white/40'}`}
        >
          <Eye className="w-6 h-6" />
          <span className="text-[8px] uppercase tracking-widest font-bold">Vision</span>
        </button>
        <button 
          onClick={() => setShowLiveSession(true)}
          className="w-14 h-14 -mt-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)] border-4 border-black active:scale-95 transition-transform"
        >
          <Mic className="w-7 h-7 text-black" />
        </button>
        <button 
          onClick={() => setSelectedModule(selectedModule === 'panchang' ? null : 'panchang')} 
          className={`flex flex-col items-center gap-1 transition-colors ${selectedModule === 'panchang' ? 'text-amber-500' : 'text-white/40'}`}
        >
          <Clock className="w-6 h-6" />
          <span className="text-[8px] uppercase tracking-widest font-bold">Panjika</span>
        </button>
        <button 
          onClick={() => setSelectedModule(selectedModule === 'numero' ? null : 'numero')} 
          className={`flex flex-col items-center gap-1 transition-colors ${selectedModule === 'numero' ? 'text-amber-500' : 'text-white/40'}`}
        >
          <Hash className="w-6 h-6" />
          <span className="text-[8px] uppercase tracking-widest font-bold">Numero</span>
        </button>
      </div>

      <ChatBot userProfile={profile} />

      {/* Live Oracle Session Modal */}
      <AnimatePresence>
        {showLiveSession && (
          <LiveOracleSession onClose={() => setShowLiveSession(false)} />
        )}
      </AnimatePresence>

      {/* Inner Module Modal */}
      <AnimatePresence>
        {selectedModule && (
          <div className="cyber-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="cyber-modal-container max-w-5xl h-[85vh] flex flex-col"
            >
              <div className="cyber-border-animate" />
              <div className="cyber-corner cyber-corner-tl" />
              <div className="cyber-corner cyber-corner-tr" />
              <div className="cyber-corner cyber-corner-bl" />
              <div className="cyber-corner cyber-corner-br" />

              <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 bg-zinc-900/50 relative z-10">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="text-xs uppercase tracking-[0.4em] font-bold text-amber-500">
                    {selectedModule === 'astro' ? 'Astrology Engine' : 
                     selectedModule === 'vision' ? 'AI Vision' : 
                     selectedModule === 'panchang' ? 'Cosmic Panjika' : 'Numerology Matrix'}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedModule(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white/40 hover:text-white" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6 lg:p-10 relative z-10 custom-scrollbar">
                {renderModule()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Moon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);
