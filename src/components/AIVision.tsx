import React from 'react';
import { motion } from 'motion/react';
import { Eye, Zap, Shield } from 'lucide-react';

export const AIVision: React.FC<{ profile?: any }> = ({ profile }) => {
  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 space-y-8">
          <div className="inline-block px-4 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] tracking-[0.3em] text-primary uppercase">
            L2 Engine: Computer Vision & AI
          </div>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter celestial-glow uppercase leading-none">
            THE AI <br /> VISION.
          </h2>
          <p className="text-lg text-white/60 leading-relaxed max-w-xl">
            Welcome, {profile?.name || 'Seeker'}. Upload your palm or face. Our neural networks analyze the micro-lines and facial geometry to predict your health and wealth trajectory.
          </p>
        </div>
        
        <div className="w-full md:w-96 aspect-square glass rounded-3xl flex items-center justify-center p-8 relative overflow-hidden group border-primary/20 shadow-[0_0_50px_var(--glow-color)]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
          
          {/* High-tech scan overlay */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40 m-4" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/40 m-4" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/40 m-4" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40 m-4" />
            
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-0.5 bg-primary/50 shadow-[0_0_15px_var(--glow-color)] z-30"
            />
            
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>

          <Eye className="w-full h-full text-primary/10 group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 border border-primary/5 rounded-full animate-pulse" />
            <div className="absolute w-1/2 h-1/2 border border-primary/10 rounded-full animate-spin-slow" />
          </div>
          <div className="relative z-10 text-center">
            <div className="text-4xl font-black text-primary mb-2 tracking-tighter celestial-glow">SCANNING</div>
            <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase font-mono">Neural Network Active</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-12 glass border-white/5 border-dashed rounded-3xl flex flex-col items-center justify-center text-center space-y-6 group hover:border-primary/30 transition-all">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Eye className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold tracking-widest uppercase">Palm Analysis</h3>
          <p className="text-sm text-white/40 uppercase tracking-widest">Upload a clear photo of your palm</p>
          <button className="px-8 py-4 glass hover:bg-primary hover:text-black transition-all font-bold tracking-widest uppercase text-sm">
            [ UPLOAD PALM ]
          </button>
        </div>
        <div className="p-12 glass border-white/5 border-dashed rounded-3xl flex flex-col items-center justify-center text-center space-y-6 group hover:border-primary/30 transition-all">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold tracking-widest uppercase">Face Reading</h3>
          <p className="text-sm text-white/40 uppercase tracking-widest">Upload a clear photo of your face</p>
          <button className="px-8 py-4 glass hover:bg-primary hover:text-black transition-all font-bold tracking-widest uppercase text-sm">
            [ UPLOAD FACE ]
          </button>
        </div>
      </div>

      <div className="p-8 glass border-primary/30 bg-primary/5 rounded-3xl">
        <h3 className="text-xl font-bold tracking-widest uppercase mb-6 flex items-center gap-3">
          <Zap className="w-5 h-5 text-primary" />
          AI Vision Insights
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <p className="text-sm text-white/70">Micro-Expression Analysis: Your facial geometry indicates a high level of stress in the current lunar cycle.</p>
          </div>
          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <p className="text-sm text-white/70">Palmistry Logic: The 'Life Line' neural scan suggests a major career pivot in the next 18 months.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
