import React from 'react';
import { Sun, Moon, AlertTriangle, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const LiveTicker = () => {
  const items = [
    { icon: <Sun className="w-4 h-4 text-primary" />, text: "SUN in ♈ (16°)" },
    { icon: <Moon className="w-4 h-4 text-slate-300" />, text: "MOON in ♌" },
    { icon: <AlertTriangle className="w-4 h-4 text-secondary-color" />, text: "MERCURY RETROGRADE" },
    { icon: <Zap className="w-4 h-4 text-primary" />, text: "RAHU KAAL: 07:14 - 08:46" },
  ];

  return (
    <div className="w-full bg-black border-b border-white/10 h-10 flex items-center overflow-hidden">
      <motion.div 
        className="flex gap-12 whitespace-nowrap px-4"
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-white/70">
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
