import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { motion } from 'motion/react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-sans relative overflow-hidden">
      <div className="starfield" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full glass p-12 rounded-3xl border-red-500/30 text-center relative z-10"
      >
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h2 className="text-3xl font-display mb-4 tracking-tighter uppercase">Cosmic Interference.</h2>
        <p className="text-white/60 text-sm mb-8 leading-relaxed">
          The celestial alignment has been disrupted. Our neural link encountered an unexpected anomaly.
        </p>
        
        <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 mb-8 text-left">
          <p className="text-[10px] text-red-500 uppercase tracking-widest font-bold mb-2">Error Signature</p>
          <p className="text-xs font-mono text-white/40 break-all">{error.message}</p>
        </div>
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={resetErrorBoundary}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-amber-500 text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)]"
          >
            <RefreshCw className="w-5 h-5" />
            RE-SYNCHRONIZE
          </button>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 glass border-white/10 text-white/60 font-bold rounded-xl hover:bg-white/5 transition-all"
          >
            <Home className="w-5 h-5" />
            RETURN TO ORBIT
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReactErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app so the error doesn't happen again
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};
