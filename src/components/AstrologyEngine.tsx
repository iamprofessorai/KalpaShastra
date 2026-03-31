import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Star, Moon, Sun, Zap } from 'lucide-react';
import { calculatePlanetaryPositions } from '../lib/panchangUtils';

interface AstrologyEngineProps {
  profile: any;
}

export const AstrologyEngine: React.FC<AstrologyEngineProps> = ({ profile }) => {
  const planets = useMemo(() => {
    if (!profile?.dob) return [];
    const birthDate = new Date(`${profile.dob}T${profile.tob || '12:00'}`);
    return calculatePlanetaryPositions(birthDate);
  }, [profile]);

  const insights = useMemo(() => {
    if (planets.length === 0) return [];
    const sun = planets.find(p => p.name === 'Sun');
    const moon = planets.find(p => p.name === 'Moon');
    const saturn = planets.find(p => p.name === 'Saturn');

    const res = [];
    if (saturn?.signName === 'Karka' || saturn?.signName === 'Simha') {
      res.push("Saturn Influence: Domestic sectors require disciplined attention.");
    } else {
      res.push(`Saturn in ${saturn?.signName}: Focus on long-term structure in your career.`);
    }

    if (sun?.signName === moon?.signName) {
      res.push("New Moon Birth: High intuitive potential and internal focus.");
    } else {
      res.push(`Sun in ${sun?.signName} & Moon in ${moon?.signName}: A balance of external drive and internal emotion.`);
    }

    return res;
  }, [planets]);

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="flex-1 space-y-8">
          <div className="inline-block px-4 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] tracking-[0.3em] text-primary uppercase">
            L2 Engine: Vedic & Lal Kitab
          </div>
          <h2 className="text-5xl md:text-8xl font-display tracking-tighter celestial-glow uppercase leading-[0.85] mb-4">
            THE KARMIC <br />
            <span className="text-primary/80">ARCHIVE.</span>
          </h2>
          <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-xl font-light italic">
            Your birth chart is the source code of your past-life debts. We decode the 'Blind Teva' and identify 'Artificial Planets' that traditional apps miss.
          </p>
        </div>
        
        <div className="w-full md:w-96 aspect-square glass rounded-full flex items-center justify-center p-8 relative overflow-hidden group border-primary/20 shadow-[0_0_50px_var(--glow-color)]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
          <Star className="w-full h-full text-primary/10 group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 border border-primary/5 rounded-full animate-spin-slow" />
            <div className="absolute w-1/2 h-1/2 border border-primary/10 rounded-full animate-reverse-spin" />
          </div>
          <div className="relative z-10 text-center">
            <div className="text-5xl font-display text-primary mb-2 tracking-tighter celestial-glow">94%</div>
            <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase font-mono">Shadbala Strength</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planets.slice(0, 6).map((planet, i) => (
          <motion.div 
            key={planet.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 glass border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Star className="w-12 h-12 text-primary" />
            </div>
            <div className="flex justify-between items-start mb-6">
              <div className="text-primary font-bold tracking-[0.2em] uppercase text-[10px] font-mono">{planet.name}</div>
              <div className="text-3xl font-display text-white/80">{planet.sign}</div>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-3xl font-mono tracking-tighter text-white">{planet.degree}</div>
              <div className="text-[9px] tracking-[0.2em] text-white/30 uppercase font-bold bg-white/5 px-2 py-1 rounded">{planet.strength}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-8 glass border-primary/30 bg-primary/5 rounded-3xl">
        <h3 className="text-xl font-bold tracking-widest uppercase mb-6 flex items-center gap-3">
          <Zap className="w-5 h-5 text-primary" />
          Lal Kitab Insights
        </h3>
        <div className="space-y-4">
          {insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <p className="text-sm text-white/70">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
