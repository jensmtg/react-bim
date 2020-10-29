// import logo from './logo.svg';

import * as THREE from 'three';
import './App.css';
import Box from './Box';
import Model from './Model';
import Tree from './Tree';
import React, { useReducer, useRef, useEffect, useState } from 'react'
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import AppContext from './AppContext';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import GLBFile from './ussnew.glb'
// import { xml } from './xml'

import xml2js from 'xml2js'

extend({ OrbitControls })

const testMaterial = new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } )
// const testMaterial = new THREE.MeshBasicMaterial( { color: 0xffaa00, transparent: false } )

function App() {

  const contextReducer = (state, action) => {
    
    if (action.type === 'init') {
      return {
        ...state,
        gltf: action.gltf
      }
    }
    if (action.type === 'visibility') {
      // Avoid crashing viewer if scene not completely loaded yet
      if (!(state.gltf && state.gltf.scene && state.gltf.scene.getObjectByProperty)) {
        return state
      } else {
        const target = state.gltf.scene.getObjectByProperty("uuid", action.id)
        console.log('target', target)

        if (state.selectedUuid) {
          const prev = state.gltf.scene.getObjectByProperty("uuid", state.selectedUuid)
          prev.material = prev._mat
        }

        if (target) {
          state._selectedName = target.title
          target.material = testMaterial
        }
        return {
          ...state,
          selectedUuid: target.uuid,
          selectedName: target.title
        }
      }
    
    }
    else {
      throw new Error();
    }
  }

  // function parseXmlToJson() {
  //   var parser = new xml2js.Parser();
  //   parser.parseString(xml, function (err, result) {
  //     console.log("XML: ", result);
  //   });
  // }

  // parseXmlToJson()


  const initialContext = {
    gltf: {},
    _mat: null,
    selectedUuid: null,
    _selectedName: null
  }
  const [context, contextDispatch] = useReducer(contextReducer, initialContext);

  const [model, setModel] = useState(null)
  useEffect(() => {
    if (!model) {
      const gltfLoader = new GLTFLoader();
      console.log('Load model!')
      gltfLoader.load(GLBFile, (gltf) => {

        function addSelfAndChildren(node) {
          node.children.map(d => addSelfAndChildren(d))
          node.key = node.uuid
          node.title = node.name
          node._mat = node.material
        }
        addSelfAndChildren(gltf.scene)

        contextDispatch({ type: 'init', gltf: gltf })

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

  return <div className="App" style={{ height: '100vh' }}>
    <AppContext.Provider value={{ context, contextDispatch }} >
      {/* <Tree model={model} setModel={setModel} /> */}
      <div style={{position: "absolute", left: 0, top: 0}}>
        {context._selectedName ? <small>IFC GUID: {context._selectedName}</small> : null}
      </div>
      <Canvas camera={{
       position: [40, 10, 10]
        // fov: 90
      }}>
        <CameraControls />
        {/* {cube} */}

        <Model model={context.gltf} contextDispatch={contextDispatch} />

        <ambientLight intensity={0.5} />
        <spotLight position={[200, 10, 10]} angle={0.15} penumbra={0.8} distance={500} decay={0}/>
        <spotLight position={[-100, 10, -10]} angle={0.3} penumbra={0.8} distance={500} decay={0} />
         {/*
        <pointLight position={[-0, -10, -10]} />
        <Box position={[-1.2, 0, 0]} /> */}
        <Box position={[0, 0, 0]} />
      </Canvas>
    </AppContext.Provider>
  </div>


}

export default App;
