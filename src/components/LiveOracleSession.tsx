import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, X, Sparkles, Zap, Loader2 } from 'lucide-react';
import { getLiveSession } from '../services/geminiService';
import { GlassCard } from './GlassCard';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

interface LiveOracleSessionProps {
  onClose: () => void;
}

export const LiveOracleSession: React.FC<LiveOracleSessionProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isInterrupted, setIsInterrupted] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [modelTranscription, setModelTranscription] = useState("");
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioQueue = useRef<Int16Array[]>([]);
  const isPlaying = useRef(false);

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      
      sessionRef.current = await getLiveSession({
        onopen: () => {
          setIsConnecting(false);
          setIsActive(true);
          toast.success("Connection established with the Oracle.");
          
          // Start streaming audio
          sourceRef.current = audioContextRef.current!.createMediaStreamSource(stream);
          processorRef.current = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
          
          processorRef.current.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmData = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
            }
            
            const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
            sessionRef.current.sendRealtimeInput({
              audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
            });
          };
          
          sourceRef.current.connect(processorRef.current);
          processorRef.current.connect(audioContextRef.current!.destination);
        },
        onmessage: async (message: any) => {
          if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
            const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
            const binary = atob(base64Audio);
            const pcmData = new Int16Array(new Uint8Array(Array.from(binary, c => c.charCodeAt(0))).buffer);
            audioQueue.current.push(pcmData);
            if (!isPlaying.current) playNextInQueue();
          }
          
          if (message.serverContent?.interrupted) {
            setIsInterrupted(true);
            audioQueue.current = [];
            isPlaying.current = false;
            setTimeout(() => setIsInterrupted(false), 1000);
          }

          if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
            setModelTranscription(prev => prev + " " + message.serverContent.modelTurn.parts[0].text);
          }
        },
        onerror: (err: any) => {
          console.error("Live session error:", err);
          toast.error("The cosmic connection was lost. Please try again.");
          stopSession();
        },
        onclose: () => {
          setIsActive(false);
          toast.info("Connection closed.");
        }
      });
    } catch (error) {
      console.error("Failed to start live session:", error);
      toast.error("Could not access microphone. Ensure permissions are granted.");
      setIsConnecting(false);
    }
  };

  const playNextInQueue = () => {
    if (audioQueue.current.length === 0 || !audioContextRef.current) {
      isPlaying.current = false;
      return;
    }

    isPlaying.current = true;
    const pcmData = audioQueue.current.shift()!;
    const buffer = audioContextRef.current.createBuffer(1, pcmData.length, 24000); // Live output is usually 24kHz
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < pcmData.length; i++) {
      channelData[i] = pcmData[i] / 0x7FFF;
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.onended = playNextInQueue;
    source.start();
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    if (processorRef.current) processorRef.current.disconnect();
    if (sourceRef.current) sourceRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();
    
    setIsActive(false);
    setIsConnecting(false);
    onClose();
  };

  return (
    <div className="cyber-modal-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="cyber-modal-container max-w-4xl h-[80vh] flex flex-col relative overflow-hidden"
      >
        <div className="cyber-border-animate" />
        <div className="cyber-corner cyber-corner-tl" />
        <div className="cyber-corner cyber-corner-tr" />
        <div className="cyber-corner cyber-corner-bl" />
        <div className="cyber-corner cyber-corner-br" />

        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
        
        <button 
          onClick={stopSession}
          className="absolute top-8 right-8 w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-6 h-6 text-white/40 hover:text-white" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-10 relative z-10">
          <div className="relative">
            <motion.div 
              animate={isActive ? { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-40 h-40 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30 shadow-[0_0_60px_rgba(245,158,11,0.2)]"
            >
              {isConnecting ? (
                <Loader2 className="w-16 h-16 text-amber-500 animate-spin" />
              ) : isActive ? (
                <Mic className="w-16 h-16 text-amber-500" />
              ) : (
                <MicOff className="w-16 h-16 text-white/20" />
              )}
            </motion.div>
            
            {isActive && (
              <div className="absolute -inset-6 border border-amber-500/20 rounded-full animate-ping" />
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-display celestial-glow tracking-[0.2em] uppercase">
              {isConnecting ? "Establishing Link..." : isActive ? "Oracle is Listening" : "Voice Connection"}
            </h2>
            <p className="text-white/40 text-base max-w-lg mx-auto leading-relaxed uppercase tracking-widest">
              {isActive 
                ? "Speak freely. The Oracle will respond in real-time with cosmic wisdom." 
                : "Initialize a direct neural-vocal link with the Again India Oracle."}
            </p>
          </div>

          {!isActive && !isConnecting && (
            <button
              onClick={startSession}
              className="px-10 py-5 bg-amber-500 text-black font-bold rounded-full flex items-center gap-4 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(245,158,11,0.4)]"
            >
              <Zap className="w-6 h-6 fill-current" />
              INITIALIZE LINK
            </button>
          )}

          {isActive && (
            <div className="w-full max-w-xl p-8 glass bg-white/5 rounded-3xl min-h-[150px] flex flex-col justify-center border border-white/10">
              <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] mb-4">Oracle Transcription</p>
              <p className="text-lg text-amber-200/80 italic leading-relaxed font-serif-mystic">
                {modelTranscription || "Waiting for cosmic resonance..."}
              </p>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-white/5 flex justify-between items-center bg-zinc-900/50 relative z-10">
          <div className="flex items-center gap-3">
            <div className={cn("w-3 h-3 rounded-full animate-pulse", isActive ? "bg-green-500 shadow-[0_0_10px_#22c55e]" : "bg-red-500 shadow-[0_0_10px_#ef4444]")} />
            <span className="text-xs text-white/40 uppercase tracking-[0.2em] font-bold">
              {isActive ? "Link Stable" : "Link Offline"}
            </span>
          </div>
          <div className="flex items-center gap-6 text-white/20">
            <Volume2 className={cn("w-5 h-5 transition-colors", isPlaying.current && "text-amber-500")} />
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
