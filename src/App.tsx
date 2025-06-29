import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh } from 'three';
interface BoxProps {
  position: [number, number, number];
}

function Box ( props: BoxProps ) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef<Mesh>( null! );
  const [hovered, setHover] = useState( false );
  const [active, setActive] = useState( false );

  // Rotate mesh every frame, this is outside of React's render cycle
  useFrame( ( state, delta ) => ( meshRef.current.rotation.x += delta ) );
  return (
    <mesh
      { ...props }
      ref={ meshRef }
      scale={ active ? 1.5 : 1 }
      onClick={ ( event ) => setActive( !active ) }
      onPointerOver={ ( event ) => setHover( true ) }
      onPointerOut={ ( event ) => setHover( false ) }>
      <boxGeometry args={ [1, 1, 1] } />
      <meshStandardMaterial color={ hovered ? 'hotpink' : '#2f74c0' } />
    </mesh>
  );
}

export default function App () {

  return (
    <Canvas
      style={ { height: '100vh', width: '100vw' } }>
      <ambientLight intensity={ Math.PI / 2 } />
      <spotLight position={ [10, 10, 10] } angle={ 0.15 } penumbra={ 1 } decay={ 0 } intensity={ Math.PI } />
      <pointLight position={ [-10, -10, -10] } decay={ 0 } intensity={ Math.PI } />
      <Box position={ [-1.2, 0, 0] } />
      <Box position={ [1.2, 0, 0] } />
      <OrbitControls />
    </Canvas>
  );
}
