import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, signIn } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, limit, serverTimestamp } from 'firebase/firestore';
import { EternalHeader } from './components/EternalHeader';
import { LandingPage } from './components/LandingPage';
import { OnboardingFlow } from './components/OnboardingFlow';
import { AstrologerOnboarding } from './components/AstrologerOnboarding';
import { DashboardContainer } from './components/DashboardContainer';
import { AstrologyEngine } from './components/AstrologyEngine';
import { NumerologyMatrix } from './components/NumerologyMatrix';
import { AIVision } from './components/AIVision';
import { Panjika } from './components/Panjika';
import { getCosmicSignature, getDailyPredictions, getDailyCosmicInsight } from './services/geminiService';
import { COSMIC_EVENTS } from './lib/panchangUtils';
import { Toaster } from 'sonner';
import { Volume2, VolumeX } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [predictions, setPredictions] = useState<any>(null);
  const [cosmicInsight, setCosmicInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'landing' | 'onboarding' | 'dashboard' | 'astrologer-onboarding'>('landing');
  const [formData, setFormData] = useState({ name: '', dob: '', tob: '', pob: '' });
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [isAmbientOn, setIsAmbientOn] = useState(false);
  const ambientAudioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const themes = ['theme-saffron', 'theme-emerald', 'theme-gold'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    document.documentElement.classList.add(randomTheme);
    
    return () => {
      themes.forEach(t => document.documentElement.classList.remove(t));
    };
  }, []);

  useEffect(() => {
    if (isAmbientOn) {
      ambientAudioRef.current?.play().catch(() => setIsAmbientOn(false));
    } else {
      ambientAudioRef.current?.pause();
    }
  }, [isAmbientOn]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, 'users', u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const profileData = docSnap.data();
          setProfile(profileData);
          if (profileData.signature) {
            setView('dashboard');
            fetchPredictions(u.uid, profileData);
            fetchCosmicInsight(profileData);
          } else {
            setView('onboarding');
          }
        } else {
          setView('onboarding');
        }
      } else {
        setView('landing');
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const fetchPredictions = async (uid: string, userProfile: any) => {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, 'predictions'),
      where('uid', '==', uid),
      where('date', '==', today),
      limit(1)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      setPredictions(snap.docs[0].data());
    } else {
      try {
        const pred = await getDailyPredictions(userProfile);
        const newPred = { ...pred, uid, date: today, createdAt: serverTimestamp() };
        await setDoc(doc(collection(db, 'predictions')), newPred);
        setPredictions(newPred);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
    }
  };

  const fetchCosmicInsight = async (userProfile: any) => {
    try {
      const insight = await getDailyCosmicInsight(userProfile, COSMIC_EVENTS);
      setCosmicInsight(insight);
    } catch (error) {
      console.error("Error fetching cosmic insight:", error);
    }
  };

  const handleInitialize = async () => {
    if (!user) {
      try {
        await signIn();
      } catch (error) {
        console.error("Sign in error:", error);
        return;
      }
    }
    setView('onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAstrologerOnboarding = () => {
    setView('astrologer-onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSyncing(true);
    try {
      const signature = await getCosmicSignature(formData);
      const newProfile = {
        ...formData,
        uid: user.uid,
        signature,
        createdAt: serverTimestamp()
      };
      await setDoc(doc(db, 'users', user.uid), newProfile);
      setProfile(newProfile);
      setView('dashboard');
      fetchPredictions(user.uid, newProfile);
      fetchCosmicInsight(newProfile);
    } catch (error) {
      console.error("Calibration error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCloseConnection = () => {
    setView('landing');
    setSelectedModule(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="h-screen w-screen bg-bg-custom flex items-center justify-center">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-16 h-16 rounded-full border-2 border-primary border-t-transparent animate-spin"
      />
    </div>
  );

  const renderModule = () => {
    switch (selectedModule) {
      case 'astro': return <AstrologyEngine profile={profile} />;
      case 'numero': return <NumerologyMatrix profile={profile} />;
      case 'vision': return <AIVision profile={profile} />;
      case 'panchang': return <Panjika profile={profile} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg-custom relative overflow-x-hidden text-white font-sans">
      <div className="starfield" />
      
      <audio 
        ref={ambientAudioRef} 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
        loop 
        className="hidden" 
      />

      <div className="fixed bottom-6 right-6 z-[200]">
        <button 
          onClick={() => setIsAmbientOn(!isAmbientOn)}
          className="w-10 h-10 rounded-full glass flex items-center justify-center text-primary hover:scale-110 transition-transform"
        >
          {isAmbientOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      <EternalHeader 
        view={view} 
        profile={profile} 
        selectedModule={selectedModule}
        onBackToOrbit={() => setSelectedModule(null)}
        onCloseConnection={handleCloseConnection}
        onInitialize={handleInitialize}
      />

      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ scale: 0, filter: 'brightness(3) blur(40px)', opacity: 0 }}
            transition={{ duration: 1.2, ease: "circIn" }}
          >
            <LandingPage 
              onInitialize={handleInitialize} 
              onAstrologerOnboarding={handleAstrologerOnboarding}
            />
          </motion.div>
        )}

        {view === 'astrologer-onboarding' && (
          <motion.div 
            key="astrologer-onboarding"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6 }}
          >
            <AstrologerOnboarding 
              onComplete={() => setView('landing')}
              onCancel={() => setView('landing')}
            />
          </motion.div>
        )}

        {view === 'onboarding' && (
          <motion.div 
            key="onboarding"
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
            transition={{ duration: 0.8 }}
          >
            <OnboardingFlow 
              onboardingData={formData}
              setOnboardingData={setFormData}
              onSubmit={handleOnboardingSubmit}
              isSyncing={isSyncing}
            />
          </motion.div>
        )}

        {view === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ scale: 3, opacity: 0, filter: 'blur(30px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          >
            <DashboardContainer 
              user={user}
              profile={profile}
              predictions={predictions}
              cosmicInsight={cosmicInsight}
              selectedModule={selectedModule}
              setSelectedModule={setSelectedModule}
              renderModule={renderModule}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster position="top-center" theme="dark" richColors />

      {/* Footer Credit */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="flex items-center gap-2 px-6 py-2 rounded-full glass border-white/5 backdrop-blur-md pointer-events-auto"
        >
          <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium">Made with</span>
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
          <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium">by</span>
          <a 
            href="https://whoami.worldoftexts.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold hover:text-white transition-colors"
          >
            Rajib Singh
          </a>
        </motion.div>
      </footer>
    </div>
  );
}
