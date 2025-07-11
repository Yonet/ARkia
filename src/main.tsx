import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Canvas } from '@react-three/fiber';

createRoot( document.getElementById( 'root' )! ).render(
  <StrictMode>
    <Canvas>
      <ambientLight intensity={ Math.PI / 2 } />
      <spotLight position={ [10, 10, 10] } angle={ 0.15 } penumbra={ 1 } decay={ 0 } intensity={ Math.PI } />
      <pointLight position={ [-10, -10, -10] } decay={ 0 } intensity={ Math.PI } />
      <App position={ [-1.2, 0, 0] } />
      <App position={ [1.2, 0, 0] } />
    </Canvas>
  </StrictMode>,
);
