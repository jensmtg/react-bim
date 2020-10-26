// import logo from './logo.svg';
import './App.css';
import Box from './Box';
import Model from './Model';
import React, { useRef, useEffect, useState } from 'react'
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Ambu from './ambulance.glb'

extend({ OrbitControls })

function App() {

  const [model, setModel] = useState(null)
  useEffect(() => {
    if (!model) {
      const gltfLoader = new GLTFLoader();
      console.log('Load model!')
      gltfLoader.load(Ambu, (gltf) => {
        setModel(gltf)
      });
    }

  }, [model])


  const CameraControls = () => {
    // Get a reference to the Three.js Camera, and the canvas html element.  
    // We need these to setup the OrbitControls component.  
    // https://threejs.org/docs/#examples/en/controls/OrbitControls  
    const {
      camera,
      gl: { domElement },
    } = useThree();
    // Ref to the controls, so that we can update them on every frame using useFrame  
    const controls = useRef();
    
    useFrame(() => controls.current && controls.current.update());
    return <orbitControls ref={controls} args={[camera, domElement]} />;
  };

  return (
    <div className="App" style={{ height: '100vh' }}>
      <Canvas camera={{
        fov: 100
      }}>
           <CameraControls />
        {/* {cube} */}
        <Model model={model} />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </div>
  );
}

export default App;
