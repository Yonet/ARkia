import {
  Bounds,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas, extend } from "@react-three/fiber";
import {
  createXRStore,
  DefaultXRController,
  DefaultXRHand,
  IfInSessionMode,
  useXRInputSourceStateContext,
  XR,
  XRDomOverlay,
  XRHitTest,
  XRSpace,
} from '@react-three/xr';

import { Matrix4, MeshBasicNodeMaterial, MeshStandardNodeMaterial, WebGPURenderer } from "three/webgpu";

import { Model } from "../models/helmet";
import { HitTestHandheld } from "../ui/hit-test-handheld";

extend( { MeshBasicNodeMaterial, MeshStandardNodeMaterial } );

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      meshBasicNodeMaterial: MeshBasicNodeMaterial;
      meshStandardNodeMaterial: MeshStandardNodeMaterial;
    }
  }
}

export let hitTestMatrices: Partial<Record<XRHandedness, Matrix4 | undefined>> = {};

export function onResults (
  handedness: XRHandedness,
  results: Array<XRHitTestResult>,
  getWorldMatrix: ( target: Matrix4, hit: XRHitTestResult ) => void,
) {
  if ( results && results.length > 0 && results[0] ) {
    hitTestMatrices[handedness] ??= new Matrix4();
    getWorldMatrix( hitTestMatrices[handedness], results[0] );
  }
}

const xr_store = createXRStore( {
  domOverlay: true,
  hitTest: true,
  anchors: true,
  layers: false,
  meshDetection: false,
  planeDetection: false,

  hand: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const state = useXRInputSourceStateContext();

    return (
      <>
        <DefaultXRHand />
        <XRSpace space={ state.inputSource.targetRaySpace }>
          <XRHitTest onResults={ onResults.bind( null, state.inputSource.handedness ) } />
        </XRSpace>
      </>
    );
  },

  controller: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const state = useXRInputSourceStateContext();

    return (
      <>
        <DefaultXRController />
        <XRSpace space={ state.inputSource.targetRaySpace }>
          <XRHitTest onResults={ onResults.bind( null, state.inputSource.handedness ) } />
        </XRSpace>
      </>
    );
  },
} );

const store = createXRStore( { bounded: false } );

function Thing () {
  return <Model />;
}

export default function App () {
  return (
    <>
      <button id="ARButton" onClick={ () => xr_store.enterAR() }>Enter AR</button>
      <Canvas
        gl={ async ( props ) => {
          const renderer = new WebGPURenderer( props as any );
          await renderer.init();
          return renderer;
        } }
        onCreated={ ( state ) => {
          state.setSize( window.innerWidth, window.innerHeight );
        } }
      >
        <XR store={ store }>
          <OrbitControls makeDefault autoRotate />
          <PerspectiveCamera position={ [2, 1, 2] } fov={ 50 } makeDefault />

          <Environment
            background
            preset='sunset'
            blur={ 0.4 }
          />
          <ambientLight intensity={ 0.5 } />
          <directionalLight position={ [1, 2, 1] } />


          <IfInSessionMode allow={ 'immersive-ar' }>
            <Thing />

            <XRDomOverlay>
              <button onClick={ () => xr_store.getState().session?.end() }>Exit AR</button>
            </XRDomOverlay>
          </IfInSessionMode>

          <Bounds fit clip observe margin={ 1.3 }>
            <Thing />
          </Bounds>
        </XR>
      </Canvas>

    </>
  );
}
