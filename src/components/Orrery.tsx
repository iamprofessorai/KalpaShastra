import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, CameraControls, Float, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Info, Zap, Shield, Star, Compass, Globe, Eye, MapPin, TrendingUp, Activity, ArrowRight } from 'lucide-react';
import { Body, HelioVector, Ecliptic, Observer } from 'astronomy-engine';
import { COSMIC_EVENTS } from '../lib/panchangUtils';

import { useCSSColor } from '../hooks/useCSSColor';

const VEDIC_SIGNS = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
  'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
];

const getVedicSign = (longitude: number) => {
  // Simple Sidereal adjustment (approximate Lahiri Ayanamsa)
  // 2026 Ayanamsa is roughly 24.2 degrees
  const ayanamsa = 24.2;
  let siderealLong = (longitude - ayanamsa + 360) % 360;
  const signIndex = Math.floor(siderealLong / 30);
  return VEDIC_SIGNS[signIndex];
};

interface PlanetInfo {
  name: string;
  sanskrit: string;
  description: string;
  secret: string;
  color: string;
  distance: number;
  size: number;
  body: Body;
  rulerOf: string[];
  element: string;
}

const PLANETS: Record<string, PlanetInfo> = {
  Mercury: {
    name: 'Mercury',
    sanskrit: 'Budha',
    description: 'The Messenger of the Gods. Ruler of intelligence, communication, and commerce.',
    secret: 'Mercury represents the analytical mind. Its position dictates how we process the cosmic signals of the universe.',
    color: '#A5A5A5',
    distance: 2,
    size: 0.12,
    body: Body.Mercury,
    rulerOf: ['Speech', 'Logic', 'Trade'],
    element: 'Earth'
  },
  Venus: {
    name: 'Venus',
    sanskrit: 'Shukra',
    description: 'The Preceptor of Demons. Ruler of love, beauty, arts, and luxury.',
    secret: 'Venus is the bridge between the material and the aesthetic. It governs the harmony of our biological rhythms.',
    color: '#E3BB76',
    distance: 3.5,
    size: 0.18,
    body: Body.Venus,
    rulerOf: ['Relationships', 'Art', 'Pleasure'],
    element: 'Water'
  },
  Earth: {
    name: 'Earth',
    sanskrit: 'Prithvi',
    description: 'The Sacred Ground. The center of our observation and the vessel of life.',
    secret: 'Earth is the anchor of the soul. It is where the celestial energies manifest into physical reality.',
    color: '#2233FF',
    distance: 5,
    size: 0.2,
    body: Body.Earth,
    rulerOf: ['Stability', 'Nurturing', 'Manifestation'],
    element: 'Earth'
  },
  Mars: {
    name: 'Mars',
    sanskrit: 'Mangala',
    description: 'The Commander-in-Chief. Ruler of energy, courage, and action.',
    secret: 'Mars is the spark of creation. Its heat drives the evolution of the spirit through challenge and triumph.',
    color: '#FF4422',
    distance: 7,
    size: 0.15,
    body: Body.Mars,
    rulerOf: ['Willpower', 'Strength', 'Conflict'],
    element: 'Fire'
  },
  Jupiter: {
    name: 'Jupiter',
    sanskrit: 'Guru',
    description: 'The Great Teacher. Ruler of wisdom, expansion, and spirituality.',
    secret: 'Jupiter is the light of knowledge. It expands whatever it touches, bringing the grace of the divine into the mundane.',
    color: '#D39C7E',
    distance: 10,
    size: 0.45,
    body: Body.Jupiter,
    rulerOf: ['Wisdom', 'Growth', 'Fortune'],
    element: 'Ether'
  },
  Saturn: {
    name: 'Saturn',
    sanskrit: 'Shani',
    description: 'The Lord of Karma. Ruler of discipline, time, and transformation.',
    secret: 'Saturn is the cosmic auditor. It enforces the laws of cause and effect, ensuring that every soul pays its karmic debts.',
    color: '#C5AB6E',
    distance: 13,
    size: 0.4,
    body: Body.Saturn,
    rulerOf: ['Karma', 'Structure', 'Time'],
    element: 'Air'
  },
};

const OrbitSpark = ({ distance, color, speed = 0.5, offset = 0 }: { distance: number; color: string; speed?: number; offset?: number }) => {
  const sparkRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (sparkRef.current) {
      const t = (performance.now() / 1000 * speed) + offset;
      sparkRef.current.position.x = Math.cos(t) * distance;
      sparkRef.current.position.z = Math.sin(t) * distance;
      
      // Pulsate the spark size and intensity
      const pulse = 1 + Math.sin(performance.now() / 1000 * 5) * 0.2;
      sparkRef.current.scale.set(pulse, pulse, pulse);
    }
  });
  return (
    <mesh ref={sparkRef}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={15} 
        transparent
        opacity={0.8}
      />
      <pointLight color={color} intensity={2} distance={2} />
    </mesh>
  );
};

const OrbitPath = ({ distance, color, isSelected, isHighlighted, secondaryColor }: { distance: number; color: string; isSelected: boolean; isHighlighted?: boolean; secondaryColor: string }) => {
  const points = useMemo(() => {
    const p = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      p.push(new THREE.Vector3(Math.cos(angle) * distance, 0, Math.sin(angle) * distance));
    }
    return p;
  }, [distance]);

  const lineRef = useRef<any>(null);
  const glowRef = useRef<any>(null);

  useFrame((state) => {
    if (isSelected || isHighlighted) {
      if (lineRef.current) {
        lineRef.current.dashOffset = -performance.now() / 1000 * 0.4;
      }
      if (glowRef.current) {
        glowRef.current.dashOffset = -performance.now() / 1000 * 0.4;
        const pulse = 0.4 + Math.sin(performance.now() / 1000 * 2) * 0.2;
        glowRef.current.material.opacity = pulse;
      }
    }
  });

  return (
    <group>
      {/* Base Orbit Line */}
      <Line
        ref={lineRef}
        points={points}
        color={(isSelected || isHighlighted) ? color : secondaryColor}
        lineWidth={(isSelected || isHighlighted) ? 1.5 : 0.5}
        dashed={isSelected || isHighlighted}
        dashScale={(isSelected || isHighlighted) ? 10 : 0}
        dashSize={1}
        gapSize={0.5}
        transparent
        opacity={(isSelected || isHighlighted) ? 0.6 : 0.15}
      />

      {/* Outer Glow Line (only when selected or highlighted) */}
      {(isSelected || isHighlighted) && (
        <Line
          ref={glowRef}
          points={points}
          color={color}
          lineWidth={4}
          dashed
          dashScale={10}
          dashSize={1}
          gapSize={0.5}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      )}
    </group>
  );
};

const EventMarker = ({ 
  event, 
  distance, 
  color, 
  onSelect,
  isHovered,
  setHovered
}: { 
  event: any; 
  distance: number; 
  color: string; 
  onSelect: (event: any) => void;
  isHovered: boolean;
  setHovered: (hovered: boolean) => void;
}) => {
  const position = useMemo(() => {
    const date = new Date(event.date);
    const vector = HelioVector(Body.Earth, date);
    const r = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
    const scale = distance / r;
    return new THREE.Vector3(vector.x * scale, vector.y * scale, vector.z * scale);
  }, [event.date, distance]);

  return (
    <group position={position}>
      <mesh 
        onClick={(e) => {
          e.stopPropagation();
          onSelect(event);
        }}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={isHovered ? 10 : 4} 
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {isHovered && (
        <Html distanceFactor={10} position={[0, 0.3, 0]}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="pointer-events-none whitespace-nowrap bg-primary/90 backdrop-blur-xl border border-white/20 p-2 rounded-lg shadow-[0_0_20px_var(--glow-color)]"
          >
            <p className="text-black font-bold text-[10px] uppercase tracking-widest">{event.name}</p>
            <p className="text-black/60 text-[8px] font-mono">{event.date}</p>
          </motion.div>
        </Html>
      )}
      
      <pointLight color={color} intensity={isHovered ? 4 : 1} distance={2} />
    </group>
  );
};

const Planet = ({ 
  info, 
  onSelect, 
  isSelected, 
  highlightedEvent,
  onSelectEvent,
  primaryColor,
  secondaryColor
}: { 
  info: PlanetInfo; 
  onSelect: (name: string) => void; 
  isSelected: boolean;
  highlightedEvent: any | null;
  onSelectEvent: (event: any) => void;
  primaryColor: string;
  secondaryColor: string;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [vedicSign, setVedicSign] = useState('');

  const isHighlighted = highlightedEvent && info.name === 'Earth';

  // Real-time position calculation using astronomy-engine
  useFrame((state) => {
    const now = new Date();
    const vector = HelioVector(info.body, now);
    
    if (ref.current) {
      const r = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
      const scale = info.distance / r;
      ref.current.position.x = vector.x * scale;
      ref.current.position.y = vector.y * scale;
      ref.current.position.z = vector.z * scale;
      ref.current.rotation.y += 0.01;

      // Calculate Vedic Sign (using ecliptic longitude)
      const ecliptic = Ecliptic(vector);
      setVedicSign(getVedicSign(ecliptic.elon));
    }
  });

  return (
    <group>
      {/* Enhanced Orbit Path */}
      <OrbitPath 
        distance={info.distance} 
        color={info.color} 
        isSelected={isSelected} 
        isHighlighted={isHighlighted}
        secondaryColor={secondaryColor}
      />

      {/* Celestial Event Markers (for Earth) */}
      {info.name === 'Earth' && COSMIC_EVENTS.map((event) => (
        <EventMarker 
          key={event.name}
          event={event}
          distance={info.distance}
          color={primaryColor}
          onSelect={onSelectEvent}
          isHovered={hoveredEvent === event.name}
          setHovered={(h) => setHoveredEvent(h ? event.name : null)}
        />
      ))}

      {/* Multiple Traveling Sparks for Selected Planet */}
      {isSelected && (
        <>
          <OrbitSpark distance={info.distance} color={info.color} speed={0.4} offset={0} />
          <OrbitSpark distance={info.distance} color={info.color} speed={0.4} offset={Math.PI} />
          <OrbitSpark distance={info.distance} color={info.color} speed={0.4} offset={Math.PI / 2} />
          <OrbitSpark distance={info.distance} color={info.color} speed={0.4} offset={Math.PI * 1.5} />
        </>
      )}
      
      {/* Planet Body */}
      <mesh 
        ref={ref} 
        name={info.name}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(info.name);
        }}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[info.size, 32, 32]} />
        <meshStandardMaterial 
          color={info.color} 
          emissive={info.color} 
          emissiveIntensity={isSelected ? 2 : 0.8} 
        />
        {isSelected && (
          <pointLight color={info.color} intensity={3} distance={3} />
        )}

        <AnimatePresence>
          {hovered && (
            <Html distanceFactor={10} position={[0, info.size + 0.2, 0]}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className="pointer-events-none whitespace-nowrap bg-black/90 backdrop-blur-xl border border-primary/50 p-3 rounded-xl shadow-[0_0_30px_var(--glow-color)] min-w-[120px]"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-primary font-bold text-[10px] uppercase tracking-widest">{info.sanskrit}</p>
                  <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                </div>
                <h4 className="text-white font-display text-sm mb-2">{info.name}</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Compass className="w-2.5 h-2.5 text-primary/60" />
                    <p className="text-white/80 text-[9px] font-mono uppercase tracking-tighter">{vedicSign}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-2.5 h-2.5 text-primary/60" />
                    <p className="text-white/40 text-[8px] font-mono uppercase">Sync: 99.9%</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-white/10">
                  <p className="text-[7px] text-primary/40 uppercase tracking-[0.2em] font-bold">Celestial Coordinate</p>
                </div>
              </motion.div>
            </Html>
          )}
        </AnimatePresence>
      </mesh>
    </group>
  );
};

const CameraFocus = ({ selectedPlanet }: { selectedPlanet: string | null }) => {
  const controlsRef = useRef<CameraControls>(null);
  const { scene } = useThree();

  useEffect(() => {
    if (selectedPlanet && controlsRef.current) {
      // Find the planet mesh in the scene by name
      const planetMesh = scene.getObjectByName(selectedPlanet);
      
      if (planetMesh) {
        const targetPosition = new THREE.Vector3();
        planetMesh.getWorldPosition(targetPosition);

        // Calculate a good camera position relative to the planet
        // We want to be close but not inside. 
        // The planet size is info.size, so let's be at a distance proportional to it.
        const distance = 2; 
        
        controlsRef.current.setLookAt(
          targetPosition.x + distance, targetPosition.y + distance, targetPosition.z + distance,
          targetPosition.x, targetPosition.y, targetPosition.z,
          true
        );
      }
    } else if (!selectedPlanet && controlsRef.current) {
      // Reset to overview
      controlsRef.current.setLookAt(15, 15, 15, 0, 0, 0, true);
    }
  }, [selectedPlanet, scene]);

  return <CameraControls ref={controlsRef} makeDefault maxDistance={40} minDistance={0.5} />;
};

export const Orrery = () => {
  const primaryColor = useCSSColor('--primary-color', '#f59e0b');
  const secondaryColor = useCSSColor('--secondary-color', '#6366f1');
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [revealSecret, setRevealSecret] = useState(false);
  const [showTransactory, setShowTransactory] = useState(false);
  const planetList = useMemo(() => Object.values(PLANETS), []);

  useEffect(() => {
    setRevealSecret(false);
  }, [selectedPlanet]);

  return (
    <div className="w-full h-full glass rounded-3xl overflow-hidden relative">
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h3 className="text-primary text-xs tracking-[0.3em] uppercase font-mono flex items-center gap-2">
          <Globe className="w-3 h-3 animate-pulse" />
          Real-Time Ephemeris
        </h3>
        <p className="text-white/40 text-[10px] mt-1">Synchronizing with Celestial Coordinates</p>
      </div>

      <div className="absolute bottom-6 left-6 z-30 flex gap-3">
        <button 
          onClick={() => setShowTransactory(!showTransactory)}
          className="flex items-center gap-2 px-4 py-2 glass border-primary/30 rounded-xl hover:bg-primary/10 transition-all group"
        >
          <TrendingUp className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform" />
          <span className="text-[10px] text-primary uppercase tracking-widest font-bold">Orbital Transactory</span>
        </button>
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <div className="cyber-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="cyber-modal-container max-w-md"
            >
              <div className="cyber-border-animate" />
              <div className="cyber-corner cyber-corner-tl" />
              <div className="cyber-corner cyber-corner-tr" />
              <div className="cyber-corner cyber-corner-bl" />
              <div className="cyber-corner cyber-corner-br" />

              <div className="p-8 space-y-6 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 text-primary">
                    <Star className="w-5 h-5 animate-pulse" />
                    <h4 className="text-xs uppercase tracking-[0.3em] font-bold">Celestial Event</h4>
                  </div>
                  <button 
                    onClick={() => setSelectedEvent(null)} 
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-white/40 hover:text-white" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h2 className="text-2xl font-display text-white mb-1">{selectedEvent.name}</h2>
                    <p className="text-primary font-mono text-xs uppercase tracking-widest mb-4">{selectedEvent.date}</p>
                    <p className="text-sm text-white/60 leading-relaxed font-serif-mystic italic">
                      "{selectedEvent.description}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Impact</p>
                      <p className="text-xs font-bold text-primary uppercase">High Resonance</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Type</p>
                      <p className="text-xs font-bold text-primary uppercase">Celestial Alignment</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="w-full py-4 bg-primary/10 border border-primary/20 rounded-2xl text-xs text-primary uppercase tracking-widest font-bold hover:bg-primary/20 transition-all"
                >
                  Close Transmission
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTransactory && (
          <div className="cyber-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="cyber-modal-container max-w-lg"
            >
              <div className="cyber-border-animate" />
              <div className="cyber-corner cyber-corner-tl" />
              <div className="cyber-corner cyber-corner-tr" />
              <div className="cyber-corner cyber-corner-bl" />
              <div className="cyber-corner cyber-corner-br" />

              <div className="p-8 space-y-6 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 text-primary">
                    <Activity className="w-5 h-5" />
                    <h4 className="text-xs uppercase tracking-[0.3em] font-bold">Orbital Transactory</h4>
                  </div>
                  <button 
                    onClick={() => setShowTransactory(false)} 
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-white/40 hover:text-white" />
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { planet: 'Jupiter', sign: 'Vrishabha', status: 'Direct', power: '88%' },
                    { planet: 'Saturn', sign: 'Kumbha', status: 'Retrograde', power: '42%' },
                    { planet: 'Mars', sign: 'Mithuna', status: 'Direct', power: '75%' },
                  ].map((tx) => (
                    <div key={tx.planet} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-primary/30 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-1.5 h-10 bg-primary rounded-full shadow-[0_0_10px_var(--glow-color)]" />
                        <div>
                          <div className="text-xs font-bold text-white/90 uppercase tracking-widest">{tx.planet}</div>
                          <div className="text-[10px] text-white/40 uppercase tracking-tighter mt-0.5">In {tx.sign}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-mono font-bold ${tx.status === 'Retrograde' ? 'text-red-400' : 'text-green-400'}`}>{tx.status}</div>
                        <div className="text-[10px] text-white/20 uppercase tracking-widest mt-0.5">Power: {tx.power}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full py-4 bg-primary/10 border border-primary/20 rounded-2xl text-xs text-primary uppercase tracking-widest font-bold hover:bg-primary/20 transition-all flex items-center justify-center gap-3 group">
                  View Full Trajectory 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPlanet && (
          <div className="cyber-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 50 }}
              className="cyber-modal-container"
            >
              <div className="cyber-border-animate" />
              <div className="cyber-corner cyber-corner-tl" />
              <div className="cyber-corner cyber-corner-tr" />
              <div className="cyber-corner cyber-corner-bl" />
              <div className="cyber-corner cyber-corner-br" />

              <div className="h-full p-8 flex flex-col overflow-y-auto custom-scrollbar relative z-10">
                <button 
                  onClick={() => setSelectedPlanet(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors z-30"
                >
                  <X className="w-5 h-5 text-white/40 hover:text-white" />
                </button>

                <div className="mb-8 relative">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-6 -left-6 w-16 h-16 bg-primary/20 rounded-full blur-2xl"
                  />
                  <h4 className="text-primary text-xs uppercase tracking-[0.4em] font-bold mb-2">
                    {PLANETS[selectedPlanet].sanskrit}
                  </h4>
                  <h2 className="text-4xl font-display celestial-glow tracking-tighter">{PLANETS[selectedPlanet].name}</h2>
                </div>

                <div className="space-y-8 flex-1">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Sparkles className="w-16 h-16" />
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed italic relative z-10 font-serif-mystic tracking-wide">
                      "{PLANETS[selectedPlanet].description}"
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <h5 className="text-xs text-white/40 uppercase tracking-[0.3em] font-bold flex items-center gap-3">
                      <Zap className="w-4 h-4 text-primary" />
                      Celestial Secret
                    </h5>
                    
                    <div className="relative">
                      {!revealSecret ? (
                        <button 
                          onClick={() => setRevealSecret(true)}
                          className="w-full p-6 bg-primary/10 rounded-2xl border border-dashed border-primary/30 flex flex-col items-center justify-center gap-3 group hover:bg-primary/20 transition-all"
                        >
                          <Eye className="w-6 h-6 text-primary animate-pulse" />
                          <span className="text-xs text-primary uppercase tracking-widest font-bold">Reveal Secret</span>
                        </button>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                          className="p-6 bg-primary/10 rounded-2xl border border-primary/40 relative group shadow-[0_0_40px_var(--glow-color)]"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50 rounded-2xl" />
                          <p className="text-sm text-primary-color leading-relaxed relative z-10 font-medium">
                            {PLANETS[selectedPlanet].secret}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Element</p>
                      <p className="text-sm font-bold text-cyan-400 uppercase tracking-widest">{PLANETS[selectedPlanet].element}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Ruler</p>
                      <p className="text-sm font-bold text-primary uppercase tracking-widest">{PLANETS[selectedPlanet].rulerOf[0]}</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3"
                  >
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Domains of Influence</p>
                    <div className="flex flex-wrap gap-2">
                      {PLANETS[selectedPlanet].rulerOf.map((item, i) => (
                        <motion.span 
                          key={item} 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + (i * 0.1) }}
                          className="px-3 py-1.5 bg-primary/10 rounded-lg text-[10px] text-primary border border-primary/20 font-bold uppercase tracking-widest"
                        >
                          {item}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-primary/60">
                      <Compass className="w-4 h-4 animate-spin-slow" />
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold">Live Sync Active</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Real-Time</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <Canvas camera={{ position: [15, 15, 15], fov: 45 }}>
        <color attach="background" args={['#000']} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={2.5} color={primaryColor} />
        
        {/* Celestial Grid */}
        <gridHelper 
          args={[40, 40, primaryColor, primaryColor]} 
          rotation={[Math.PI / 2, 0, 0]} 
          position={[0, 0, 0]} 
          onUpdate={(self) => {
            if (self.material instanceof THREE.Material) {
              self.material.transparent = true;
              self.material.opacity = 0.05;
            }
          }}
        />
        
        {/* Sun */}
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={primaryColor} emissive={primaryColor} emissiveIntensity={2} />
          <pointLight color={primaryColor} intensity={3} distance={50} />
        </mesh>

        {planetList.map((p) => (
          <Planet 
            key={p.name} 
            info={p} 
            onSelect={setSelectedPlanet} 
            isSelected={selectedPlanet === p.name}
            highlightedEvent={selectedEvent}
            onSelectEvent={setSelectedEvent}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        ))}

        <CameraFocus selectedPlanet={selectedPlanet} />
      </Canvas>
    </div>
  );
};
