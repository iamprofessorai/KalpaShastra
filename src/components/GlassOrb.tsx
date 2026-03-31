import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

import { useCSSColor } from '../hooks/useCSSColor';

const Orb = ({ color }: { color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Sphere args={[1, 64, 64]} ref={meshRef}>
        <MeshDistortMaterial
          color={color}
          speed={3}
          distort={0.4}
          radius={1}
          transparent
          opacity={0.6}
          roughness={0}
          metalness={1}
        />
      </Sphere>
    </Float>
  );
};

export const GlassOrb = ({ color = "--primary-color", label }: { color?: string; label: string }) => {
  const resolvedColor = useCSSColor(color.startsWith('--') ? color : '--primary-color', '#f59e0b');
  const finalColor = color.startsWith('var') || color.startsWith('--') ? resolvedColor : color;

  return (
    <div className="w-full aspect-square relative group cursor-pointer">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 3] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color={finalColor} />
          <Orb color={finalColor} />
        </Canvas>
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <p className="text-[10px] tracking-[0.4em] font-mono text-white/40 uppercase group-hover:text-primary transition-colors">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};
