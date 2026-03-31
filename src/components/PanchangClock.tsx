import React from 'react';
import { motion } from 'motion/react';
import { Clock, Zap, Sun, Moon, Star } from 'lucide-react';

export const PanchangClock: React.FC = () => {
  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="flex-1 space-y-8">
          <div className="inline-block px-4 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] tracking-[0.3em] text-primary uppercase">
            L2 Engine: Hindu Panchang
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter celestial-glow uppercase leading-none">
            THE PANCHANG <br /> CLOCK.
          </h2>
          <p className="text-xl text-white/60 leading-relaxed max-w-xl">
            The universe is a clock. We track the Tithi, Nakshatra, Yoga, and Karana in real-time to find your 'Abhijit Muhurat'—the window where failure is impossible.
          </p>
        </div>
        
        <div className="w-full md:w-96 aspect-square glass rounded-full flex items-center justify-center p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
          <Clock className="w-full h-full text-primary/20 group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 border border-white/5 rounded-full animate-spin-slow" />
          </div>
          <div className="relative z-10 text-center">
            <div className="text-4xl font-black text-primary mb-2">11:06</div>
            <div className="text-[10px] tracking-widest text-white/40 uppercase">Current Muhurat</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Tithi', value: 'Shukla Navami', icon: Moon },
          { label: 'Nakshatra', value: 'Magha', icon: Star },
          { label: 'Yoga', value: 'Siddha', icon: Zap },
          { label: 'Karana', value: 'Kaulava', icon: Sun },
        ].map((item, i) => (
          <motion.div 
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 glass border-white/5 hover:border-primary/30 transition-colors group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-primary font-bold tracking-widest uppercase text-sm">{item.label}</div>
              <item.icon className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
            </div>
            <div className="text-xl font-black">{item.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="p-8 glass border-secondary-color/30 bg-secondary-color/5 rounded-3xl">
        <h3 className="text-xl font-bold tracking-widest uppercase mb-6 flex items-center gap-3 text-secondary-color">
          <Zap className="w-5 h-5" />
          Rahu Kaal Alert
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-secondary-color mt-2" />
            <p className="text-sm text-white/70">Rahu Kaal starts in 45 minutes (12:00 - 13:30). Avoid starting new projects or financial transactions during this window.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
