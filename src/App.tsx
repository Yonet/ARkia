import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';

interface BoxProps {
  position: [number, number, number];
}

function Box(props: BoxProps) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef<THREE.Mesh>(null!);

  // Rotate mesh every frame, this is outside of React's render cycle
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh {...props} ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'orange'} />
    </mesh>
  );
}

export default function App() {
  const createRenderer = () => {
    const renderer = new WebGPURenderer({ antialias: true });
    // Configure renderer settings if needed
    return renderer;
  };

  return (
    <Canvas
      style={{ height: '100vh', width: '100vw' }}
      gl={createRenderer}
    >
      <Suspense fallback={null}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
}
