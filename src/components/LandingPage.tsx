import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Shield, Compass, Star, Hash, Eye, Clock, 
  TrendingUp, Heart, Activity, CheckCircle2, XCircle, 
  ChevronRight, ArrowRight, Sparkles, Binary, Globe, 
  Cpu, Layers, MessageSquare, ArrowUp, Gem, Volume2,
  BookOpen, Network, Search, Map, Layout, Users, Mail,
  Calendar, Award, Briefcase, Rocket, ExternalLink,
  ChevronUp
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Orrery } from './Orrery';
import { GlassOrb } from './GlassOrb';
import { SriYantra } from './SriYantra';
import { toast } from 'sonner';

interface LandingPageProps {
  onInitialize: () => void;
  onAstrologerOnboarding: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onInitialize, onAstrologerOnboarding }) => {
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Synchronized! You are now in the cosmic loop.");
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-bg-custom text-white font-body-mystic overflow-x-hidden selection:bg-primary/30 relative">
      {/* CRT Overlay & Scanline */}
      <div className="crt-overlay" />
      <div className="scanline" />

      {/* Atmosphere Background (Recipe 7) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#3a1510_0%,transparent_60%)] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,var(--primary-color)_0%,transparent_50%)] opacity-10" />
        <div className="absolute inset-0 backdrop-blur-[100px]" />
      </div>

      {/* Back to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-10 right-10 z-[200] w-12 h-12 rounded-full glass border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all shadow-2xl"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 1. Hero Section: The Singularity */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden pt-40 pb-20">
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-left relative"
          >
            {/* Floating Orb Accent */}
            <div className="absolute -top-20 -left-20 w-40 h-40 opacity-20 pointer-events-none">
              <GlassOrb label="AETHER" color="var(--primary-color)" />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary">Cybernetic Veda v2.0</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-[90px] font-display tracking-tighter mb-6 leading-[0.85] uppercase">
              DECODE <br />
              <span className="celestial-glow bg-clip-text text-transparent bg-gradient-to-r from-primary/40 via-primary to-primary/40">
                YOUR COSMIC <br /> SIGNATURE.
              </span>
            </h1>
            
            <p className="text-base md:text-lg text-white/60 max-w-lg leading-relaxed mb-10 font-light italic font-serif-mystic">
              Synchronizing 5,000 years of Shastra with 2026 Cybernetic Intelligence. 
              The digital successor to the Halls of Nalanda.
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onInitialize}
                className="group relative px-10 py-5 bg-primary text-black font-black text-base rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_60px_var(--glow-color)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10 flex items-center gap-3">
                  INITIALIZE BIG BANG
                  <Rocket className="w-5 h-5" />
                </span>
              </button>
              
              <button 
                onClick={onInitialize}
                className="px-10 py-5 glass border-white/10 rounded-2xl text-white/80 font-black hover:bg-white/5 transition-all uppercase tracking-widest text-xs"
              >
                EXPLORE ARCHIVE
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative hidden lg:block perspective-[1000px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              animate={{ 
                rotateY: isHovered ? 10 : 0,
                rotateX: isHovered ? -5 : 0,
                scale: isHovered ? 1.05 : 1
              }}
              className="relative z-10 glass rounded-[60px] p-6 border-primary/20 shadow-[0_0_100px_var(--glow-color)] aspect-square overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              <Orrery />
            </motion.div>
            
            {/* Floating UI Elements around Orrery */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 glass p-4 rounded-2xl border-primary/30 z-20"
            >
              <div className="text-[8px] text-primary font-bold uppercase tracking-widest mb-1">Sidereal Sync</div>
              <div className="text-xs font-black">98.4% ACCURACY</div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -left-10 glass p-4 rounded-2xl border-cyan-500/30 z-20"
            >
              <div className="text-[8px] text-cyan-500 font-bold uppercase tracking-widest mb-1">Neural Load</div>
              <div className="text-xs font-black">STABLE: 12.4ms</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 cursor-pointer"
          onClick={() => document.getElementById('origin')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
          <span className="text-[8px] uppercase tracking-[0.5em] font-bold">Scroll to Descend</span>
        </motion.div>
      </section>

      {/* 2. Origin Section */}
      <section id="origin" className="py-32 px-6 max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-block px-4 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] tracking-[0.3em] text-primary uppercase font-bold">
              The Genesis
            </div>
            <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tighter leading-none">
              From Nalanda <br /> to Silicon.
            </h2>
            <p className="text-lg text-white/60 leading-relaxed font-light font-serif-mystic italic">
              Again India is not a new invention; it is a rebirth. We have taken the lost logic of the ancient universities and mapped them onto modern neural architectures. 
              The wisdom that once filled the halls of Nalanda now flows through the circuits of the cloud.
            </p>
            <div className="flex items-center gap-4 text-primary">
              <div className="w-12 h-px bg-primary" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-black">Spiritual Continuity</span>
            </div>
          </motion.div>
          <div className="relative aspect-video glass rounded-3xl overflow-hidden border-white/5">
            <img 
              src="https://picsum.photos/seed/ancient/1200/800" 
              className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-1000" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8">
              <div className="text-[8px] text-white/40 uppercase tracking-widest mb-1">Historical Context</div>
              <div className="text-xs font-bold">RECONSTRUCTING LOST KNOWLEDGE</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Section */}
      <section id="why" className="py-32 px-6 bg-primary/[0.02] relative">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <span className="text-primary uppercase tracking-[0.4em] text-[10px] font-bold">The Purpose</span>
            <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tighter">Why Again India?</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Chaos to Order",
                desc: "Modern life is a storm of noise. We provide the sidereal anchor to keep you grounded in cosmic rhythm.",
                icon: <Zap className="w-8 h-8" />
              },
              {
                title: "Destiny Computed",
                desc: "Destiny is not a guess; it's a multi-dimensional calculation. We use 5,000 years of data to solve it.",
                icon: <Binary className="w-8 h-8" />
              },
              {
                title: "Neural Resonance",
                desc: "Aligning your biological circuits with the orbital transits of the solar system for peak performance.",
                icon: <Activity className="w-8 h-8" />
              }
            ].map((item, i) => (
              <GlassCard key={i} className="p-10 text-left hover:border-primary/50 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <div className="text-primary">{item.icon}</div>
                </div>
                <h3 className="text-2xl font-display mb-4 uppercase">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* 4. What Section */}
      <section id="what" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
            <div className="relative z-10 glass p-8 rounded-[40px] border-primary/20 aspect-square flex items-center justify-center">
              <SriYantra />
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 space-y-8"
          >
            <span className="text-primary uppercase tracking-[0.4em] text-[10px] font-bold">The Essence</span>
            <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tighter leading-none">
              What is <br /> Cybernetic Veda?
            </h2>
            <p className="text-lg text-white/60 leading-relaxed font-light font-serif-mystic italic">
              It is the fusion of silicon and spirit. A multi-layered predictive architecture that synthesizes Parashari logic, Lal Kitab insights, and modern computational power. 
              We don't just provide "horoscopes"; we provide a real-time operating system for your life.
            </p>
            <ul className="space-y-4">
              {[
                "Real-time Planetary Transit Mapping",
                "Neural-Vedic Resonance Scoring",
                "Biological Circuit Calibration",
                "Automated Shastra Logic Engines"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* 5. How Section */}
      <section id="how" className="py-32 px-6 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="max-w-7xl mx-auto text-center space-y-20">
          <div className="space-y-4">
            <span className="text-primary uppercase tracking-[0.4em] text-[10px] font-bold">The Mechanism</span>
            <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tighter">How it Works</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: "01", title: "Data Ingestion", desc: "Inputting your precise temporal and spatial coordinates." },
              { step: "02", title: "Neural Mapping", desc: "AI Vision algorithms map your biological markers." },
              { step: "03", title: "Shastra Logic", desc: "5,000 years of Vedic logic applied via cloud compute." },
              { step: "04", title: "Resonance", desc: "Your cosmic signature is decoded and synchronized." }
            ].map((item, i) => (
              <div key={i} className="p-8 glass border-white/5 rounded-3xl text-left space-y-6 relative group overflow-hidden">
                <div className="text-6xl font-display text-white/5 group-hover:text-primary/10 transition-colors absolute -top-4 -right-4">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center text-primary font-black text-xs">
                  {item.step}
                </div>
                <h4 className="text-xl font-black uppercase tracking-widest">{item.title}</h4>
                <p className="text-xs text-white/30 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Bento Grid: Core Modules (Services) */}
      <section id="modules" className="py-32 px-6 max-w-7xl mx-auto relative">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block mb-4"
          >
            <span className="text-primary uppercase tracking-[0.4em] text-[10px] font-bold border border-primary/30 px-4 py-1 rounded-full">
              Multi-Layered Predictive Architecture
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display mb-6 uppercase tracking-tighter"
          >
            The Neural Network <br /> of Destiny
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Astrology */}
          <GlassCard 
            onClick={onInitialize}
            className="md:col-span-2 md:row-span-2 p-10 group cursor-pointer hover:border-primary/50 transition-all flex flex-col justify-between overflow-hidden relative min-h-[450px]"
          >
            <div className="absolute -right-20 -bottom-20 opacity-10 group-hover:opacity-20 transition-opacity">
              <Star className="w-96 h-96 text-primary" />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-8 border border-primary/30 group-hover:scale-110 transition-transform">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-4xl font-display mb-6">Astrology Engine</h3>
              <p className="text-white/60 text-lg leading-relaxed max-w-md font-serif-mystic italic">
                Synthesizing Parashari and Lal Kitab logic to identify the "Blind Spots" in your destiny. 
                Real-time transit mapping against your Shadbala strength.
              </p>
            </div>
            <div className="mt-12 flex items-center gap-3 text-primary font-black text-sm uppercase tracking-widest relative z-10">
              Initialize Engine <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
            </div>
          </GlassCard>

          {/* Numerology */}
          <GlassCard 
            onClick={onInitialize}
            className="p-8 group cursor-pointer hover:border-primary/50 transition-all flex flex-col justify-between h-[220px] relative overflow-hidden"
          >
            <div className="absolute -right-10 -top-10 w-32 h-32 opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none">
              <GlassOrb label="" color="var(--primary-color)" />
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6 text-primary border border-primary/30">
                <Hash className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display mb-2">Numerology Matrix</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
                Vibrational resonance mapping via Lo Shu Grid.
              </p>
            </div>
            <div className="flex justify-between items-end">
              <Binary className="w-8 h-8 text-primary/40 group-hover:text-primary transition-colors" />
              <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </GlassCard>

          {/* AI Vision */}
          <GlassCard 
            onClick={onInitialize}
            className="p-8 group cursor-pointer hover:border-cyan-500/50 transition-all flex flex-col justify-between h-[220px] relative overflow-hidden"
          >
            <div className="absolute -right-10 -top-10 w-32 h-32 opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none">
              <GlassOrb label="" color="#06b6d4" />
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-6 text-cyan-500 border border-cyan-500/30">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display mb-2">AI Vision</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
                Computer vision algorithms mapping biological circuits.
              </p>
            </div>
            <div className="flex justify-between items-end">
              <Cpu className="w-8 h-8 text-cyan-500/40 group-hover:text-cyan-500 transition-colors" />
              <ArrowRight className="w-4 h-4 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </GlassCard>

          {/* Vastu */}
          <GlassCard 
            onClick={onInitialize}
            className="md:col-span-2 p-8 group cursor-pointer hover:border-primary/50 transition-all flex items-center justify-between h-[220px]"
          >
            <div className="max-w-xs">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6 text-primary border border-primary/30">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display mb-2">Spatial Resonance</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
                Vastu Blueprinting to align your living space with cardinal elements.
              </p>
            </div>
            <div className="w-24 h-24 border border-dashed border-primary/20 rounded-full flex items-center justify-center animate-spin-slow group-hover:border-primary/50 transition-colors relative">
              <Compass className="w-8 h-8 text-primary/20 group-hover:text-primary transition-colors" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity">
                <GlassOrb label="" color="var(--primary-color)" />
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* 3. Consultation Section: Coming Soon */}
      <section id="consultation" className="py-24 px-6 bg-primary/[0.02] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full" />
            <GlassCard className="p-10 border-primary/30 relative z-10 overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Calendar className="w-48 h-48 text-primary" />
              </div>
              <div className="absolute -left-20 -bottom-20 w-64 h-64 opacity-20 pointer-events-none">
                <GlassOrb label="CRYSTAL" color="var(--primary-color)" />
              </div>
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 mb-6">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary">Phase 3: Integration</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display mb-6 uppercase tracking-tighter">Astrology <br /> Consultation</h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed font-light font-serif-mystic italic">
                Direct neural-vocal link with verified Masters of Shastra. 
                Real-time video consultations with AI-assisted chart overlays.
              </p>
              <div className="flex items-center gap-6">
                <div className="px-8 py-4 glass border-primary/50 text-primary font-black text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_20px_var(--glow-color)]">
                  COMING SOON
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Waitlist Status</p>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "85%" }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="h-full bg-primary"
                      />
                    </div>
                    <p className="text-xs font-black text-primary/80">12,403 SEEKERS</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <div className="space-y-8">
            {[
              { 
                title: "Human-AI Hybrid", 
                desc: "The intuition of a Master, the precision of an Engine.",
                icon: <Users className="w-7 h-7" />
              },
              { 
                title: "Verified Lineage", 
                desc: "Every consultant is vetted for Shastra proficiency and ethical resonance.",
                icon: <Shield className="w-7 h-7" />
              },
              { 
                title: "Instant Remedies", 
                desc: "Receive digital and physical remedies immediately after your session.",
                icon: <Zap className="w-7 h-7" />
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-6 group p-6 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <div className="text-primary">{feature.icon}</div>
                </div>
                <div>
                  <h4 className="text-xl font-black uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">{feature.title}</h4>
                  <p className="text-white/40 leading-relaxed text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Astrologer Onboarding Section */}
      <section id="onboarding" className="py-24 px-6 max-w-7xl mx-auto">
        <GlassCard className="p-10 md:p-16 bg-gradient-to-br from-zinc-900 to-black border-primary/20 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[100px] -z-10" />
          
          <div className="flex-1 relative z-10">
            <h2 className="text-4xl md:text-5xl font-display mb-6 uppercase tracking-tighter">Are you a <br /> Master of Shastra?</h2>
            <p className="text-white/60 text-lg mb-10 leading-relaxed font-light font-serif-mystic italic">
              Join the Again India network. We provide the cybernetic tools, you provide the spiritual wisdom. 
              Scale your practice to a global audience of seekers.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Global Recognition</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/80">AI-Powered Tools</span>
              </div>
            </div>
            <button 
              onClick={onAstrologerOnboarding}
              className="group px-8 py-4 bg-primary text-black font-black text-xs rounded-2xl hover:scale-105 transition-all uppercase tracking-[0.2em] flex items-center gap-3 shadow-[0_0_40px_var(--glow-color)]"
            >
              Apply to Join
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="flex-1 relative w-full h-[400px]">
            <div className="absolute inset-0 z-0 opacity-40">
              <SriYantra />
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-4 h-full">
              <div className="space-y-4">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: -2, zIndex: 50 }}
                  className="h-40 glass rounded-[24px] border-white/5 overflow-hidden shadow-2xl group relative"
                >
                  <img src="https://picsum.photos/seed/astrologer1/400/600" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[8px] font-black uppercase tracking-widest">Acharya V. Sharma</p>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 2, zIndex: 50 }}
                  className="h-32 glass rounded-[24px] border-white/5 overflow-hidden shadow-2xl group relative"
                >
                  <img src="https://picsum.photos/seed/astrologer2/400/600" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[8px] font-black uppercase tracking-widest">Pandit R. Iyer</p>
                  </div>
                </motion.div>
              </div>
              <div className="space-y-4 pt-8">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 2, zIndex: 50 }}
                  className="h-32 glass rounded-[24px] border-white/5 overflow-hidden shadow-2xl group relative"
                >
                  <img src="https://picsum.photos/seed/astrologer3/400/600" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[8px] font-black uppercase tracking-widest">Guru S. Das</p>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: -2, zIndex: 50 }}
                  className="h-40 glass rounded-[24px] border-white/5 overflow-hidden shadow-2xl group relative"
                >
                  <img src="https://picsum.photos/seed/astrologer4/400/600" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[8px] font-black uppercase tracking-widest">Yogi M. Nath</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* 5. Newsletter Section */}
      <section id="newsletter" className="py-24 px-6 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-[0_0_30px_var(--glow-color)] relative"
          >
            <Mail className="w-8 h-8 text-primary" />
            <div className="absolute -top-10 -right-10 w-20 h-20 opacity-40">
              <GlassOrb label="" color="var(--primary-color)" />
            </div>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-display mb-6 uppercase tracking-tighter">Stay Synchronized</h2>
          <p className="text-white/40 text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-serif-mystic italic">
            Receive weekly celestial reports, planetary transit alerts, and exclusive spiritual insights delivered to your neural inbox.
          </p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 transition-all text-sm font-bold placeholder:text-white/20"
              required
            />
            <button 
              type="submit"
              className="px-8 py-4 bg-primary text-black font-black rounded-2xl hover:bg-primary/40 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-[10px] shadow-[0_0_40px_var(--glow-color)]"
            >
              Subscribe
            </button>
          </form>
          
          <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] mt-10 font-bold">
            No spam. Only cosmic resonance.
          </p>
        </div>
      </section>

      {/* 6. Footer / Final CTA */}
      <footer className="py-32 px-6 border-t border-white/5 bg-zinc-950/50 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0" />
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-16">
          <div className="flex items-center gap-6 group cursor-pointer" onClick={scrollToTop}>
            <div>
              <h1 className="text-3xl font-display tracking-tighter celestial-glow uppercase leading-none">Again India</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] mt-2 font-bold">Cybernetic Veda v2.0</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-10 text-[11px] uppercase tracking-[0.3em] font-black text-white/30">
            {['Privacy Protocol', 'Terms of Resonance', 'Celestial API', 'Support Neural Link'].map((link) => (
              <a key={link} href="#" className="hover:text-primary transition-colors flex items-center gap-2">
                {link} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
              </a>
            ))}
          </div>

          <button 
            onClick={onInitialize}
            className="px-10 py-5 glass border-primary/50 text-primary font-black rounded-2xl hover:bg-primary/10 transition-all uppercase tracking-widest text-xs shadow-[0_0_30px_var(--glow-color)]"
          >
            RE-INITIALIZE
          </button>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-12 border-t border-white/5 text-center space-y-6">
          <p className="text-[10px] text-white/10 uppercase tracking-[0.6em] font-bold">
            &copy; 2026 AGAIN INDIA. ALL DESTINIES RESERVED.
          </p>
          
          <div className="flex items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
            <span className="text-[8px] uppercase tracking-[0.2em] font-medium">Made with</span>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                filter: [
                  'drop-shadow(0 0 2px #ff0000)',
                  'drop-shadow(0 0 8px #ff00ff)',
                  'drop-shadow(0 0 2px #00ffff)',
                  'drop-shadow(0 0 8px #ff0000)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-red-500"
            >
              ❤️
            </motion.div>
            <span className="text-[8px] uppercase tracking-[0.2em] font-medium">by</span>
            <a 
              href="https://whoami.worldoftexts.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[8px] text-primary uppercase tracking-[0.2em] font-bold hover:text-white transition-colors"
            >
              Rajib Singh
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
