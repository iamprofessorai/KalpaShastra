import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Hash, Zap, Star } from 'lucide-react';
import { calculateNumerology } from '../lib/numerologyUtils';

interface NumerologyMatrixProps {
  profile: any;
}

export const NumerologyMatrix: React.FC<NumerologyMatrixProps> = ({ profile }) => {
  const data = useMemo(() => {
    if (!profile?.dob) return null;
    return calculateNumerology(profile.dob);
  }, [profile]);

  if (!data) return null;

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="flex-1 space-y-8">
          <div className="inline-block px-4 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] tracking-[0.3em] text-primary uppercase">
            L2 Engine: Lo Shu Matrix
          </div>
          <h2 className="text-5xl md:text-8xl font-display tracking-tighter celestial-glow uppercase leading-[0.85] mb-4">
            VIBRATIONAL <br />
            <span className="text-primary/80">RESONANCE.</span>
          </h2>
          <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-xl font-light italic">
            A name is a frequency. A birth date is a fixed number. If they clash, your effort is halved. We map your 3x3 Lo Shu Matrix to find the missing resonance.
          </p>
        </div>
        
        <div className="w-full md:w-96 aspect-square glass rounded-3xl flex items-center justify-center p-8 relative overflow-hidden group border-primary/20 shadow-[0_0_50px_var(--glow-color)]">
          <div className="grid grid-cols-3 gap-2 w-full h-full opacity-10 group-hover:opacity-30 transition-opacity">
            {[4, 9, 2, 3, 5, 7, 8, 1, 6].map(n => (
              <div key={n} className={`border border-white/5 flex items-center justify-center text-5xl font-display ${data.matrix.includes(n) ? 'text-primary font-black' : ''}`}>
                {n}
              </div>
            ))}
          </div>
          <Hash className="absolute w-40 h-40 text-primary/10 group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10 text-center">
            <div className="text-6xl font-display text-primary mb-2 tracking-tighter celestial-glow">{data.completion}</div>
            <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase font-mono">Matrix Completion</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Driver Number', value: data.driver, desc: data.driverDesc },
          { label: 'Conductor Number', value: data.conductor, desc: data.conductorDesc },
          { label: 'Kua Number', value: data.kua, desc: data.kuaDesc },
        ].map((num, i) => (
          <motion.div 
            key={num.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 glass border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Hash className="w-12 h-12 text-primary" />
            </div>
            <div className="text-primary font-bold tracking-[0.2em] uppercase text-[10px] font-mono mb-6">{num.label}</div>
            <div className="text-6xl font-display mb-4 text-white">{num.value}</div>
            <div className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold leading-relaxed">{num.desc}</div>
          </motion.div>
        ))}
      </div>

      <div className="p-8 glass border-primary/30 bg-primary/5 rounded-3xl">
        <h3 className="text-xl font-bold tracking-widest uppercase mb-6 flex items-center gap-3">
          <Zap className="w-5 h-5 text-primary" />
          Pytha-Vedic Hybrid Insights
        </h3>
        <div className="space-y-4">
          {data.insights.map((insight, i) => (
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
