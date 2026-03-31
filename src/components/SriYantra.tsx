import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

import { useCSSColor } from '../hooks/useCSSColor';

const YantraGeometry = ({ color }: { color: string }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Central Point (Bindu) */}
      <mesh>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>

      {/* Triangles (Simplified Sri Yantra representation) */}
      {[...Array(9)].map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 4.5]}>
          <coneGeometry args={[1 + i * 0.2, 0.1, 3]} />
          <meshStandardMaterial 
            color={color} 
            wireframe 
            transparent 
            opacity={0.5 - i * 0.04} 
          />
        </mesh>
      ))}

      {/* Outer Circles */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.02, 16, 100]} />
        <meshStandardMaterial color={color} transparent opacity={0.3} />
      </mesh>
      
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.5, 0.01, 16, 100]} />
        <meshStandardMaterial color={color} transparent opacity={0.1} />
      </mesh>
    </group>
  );
};

export const SriYantra = () => {
  const primaryColor = useCSSColor('--primary-color', '#f59e0b');

  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color={primaryColor} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <YantraGeometry color={primaryColor} />
        </Float>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};
