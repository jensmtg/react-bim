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

import GLBFile from './fileModel.glb'
import XMLFile from './fileXml'

import xml2js from 'xml2js'

extend({ OrbitControls })

const testMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: true })
// const testMaterial = new THREE.MeshBasicMaterial( { color: 0xffaa00, transparent: false } )

function App() {

  const contextReducer = (state, action) => {

    if (action.type === 'initializeGltf') {
      return {
        ...state,
        gltf: action.gltf
      }
    }
    else if (action.type === 'initializeXml') {
      return {
        ...state,
        xml: action.xml
      }
    }
    else if (action.type === 'initializeTree') {
      return {
        ...state,
        tree: action.tree
      }
    }
    else if (action.type === 'check') {
      const newChecked = action.checkedKeys.filter(key => !state._prevChecked.includes(key))
      const newUnchecked = state._prevChecked.filter(key => !action.checkedKeys.includes(key))

      if (state.gltf && state.gltf.scene && state.gltf.scene.getObjectByProperty) {

        newChecked.map(key => {
          const target = state.gltf.scene.getObjectByProperty("title", key)
          if (target && target.material) {
            target.material = testMaterial
          }
        })
        newUnchecked.map(key => {
          const target = state.gltf.scene.getObjectByProperty("title", key)
          if (target && target.material) {
            target.material = target._mat
          }
        })
      }
      return {
        ...state,
        _prevChecked: action.checkedKeys
      }
    }
    else if (action.type === 'selectInViewer') {
      // Avoid crashing viewer if scene not completely loaded yet
      if (!(state.gltf && state.gltf.scene && state.gltf.scene.getObjectByProperty)) {
        return state
      } else {
        const target = state.gltf.scene.getObjectByProperty("uuid", action.id)
        console.log('target', target)
        return state
      }

    }
    else {
      throw new Error();
    }
  }

  const initialContext = {
    gltf: {},
    xml: {},
    tree: [],
    _prevChecked: [],
  }
  const [context, contextDispatch] = useReducer(contextReducer, initialContext);

  const [gltfLoaded, setGltfLoaded] = useState(false)
  useEffect(() => {
    if (!gltfLoaded) {
      const gltfLoader = new GLTFLoader();
      console.log('Load gltfLoaded!')
      gltfLoader.load(GLBFile, (gltf) => {
        function addSelfAndChildren(node) {
          node.children.map(d => addSelfAndChildren(d))
          node.key = node.uuid
          node.title = node.name
          node._mat = node.material
        }
        addSelfAndChildren(gltf.scene)
        contextDispatch({ type: 'initializeGltf', gltf: gltf })
        setGltfLoaded(true)
      });
    }
  }, [gltfLoaded])

  const [xmlLoaded, setXmlLoaded] = useState(false)
  useEffect(() => {
    if (!xmlLoaded) {
      const parser = new xml2js.Parser();
      parser.parseString(XMLFile, function (err, result) {
        console.log("XML: ", result);
        contextDispatch({ type: 'initializeXml', xml: result })
        contextDispatch({ type: 'initializeTree', tree: buildTree(result) })

        setXmlLoaded(true)
      });
    }
  }, [xmlLoaded])


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

  const childNodeTypes = ['IfcSite', 'IfcBuilding', 'IfcBuildingStorey', 'IfcRoof',
    'IfcWallStandardCase', 'IfcSlab', 'IfcRailing', 'IfcCurtainWall', 'IfcStair', 'IfcOpeningElement']
  const recurseGenerate = (node, ifcType) => {
    let ret = {
      ...node.$,
      key: node.$.id,
      title: node.$.LongName || node.$.Name || ifcType,
      type: ifcType,
      children: []
    }
    childNodeTypes.map(_ifcType => {
      if (node[_ifcType] && Array.isArray(node[_ifcType])) {
        ret.children = [...ret.children, ...node[_ifcType].map(_node => recurseGenerate(_node, _ifcType))]
      }
    })
    return ret
  }

  const buildTree = (xml) => {
    const safe = (node, attr) => {
      return (node[attr] || [])[0]
    }
    const projNode = safe(safe(xml.ifc, 'decomposition'), 'IfcProject')
    return [recurseGenerate(projNode, 'IfcProject')]

  }

  console.log('context', context)

  return <div className="App" style={{
    height: '100vh',
    display: 'flex',
    flexFlow: 'columns',
  }}>
    <AppContext.Provider value={{ context, contextDispatch }} >
      <div style={{
        // border: '1px solid pink', 
        overflow: 'hidden',
        flex: '0 0 40%',
        height: '100%'
      }}>
        <Tree tree={context.tree} />
      </div>
      <div style={{
        //border: '1px solid pink', 
        flex: '0 0 60%',
        height: '100%'
      }}>
        <Canvas camera={{
          position: [40, 10, 10]
          // fov: 90
        }}>
          <CameraControls />
          {/* {cube} */}

          <Model model={context.gltf} contextDispatch={contextDispatch} />

          <ambientLight intensity={0.5} />
          <spotLight position={[200, 10, 10]} angle={0.15} penumbra={0.8} distance={500} decay={0} />
          <spotLight position={[-100, 10, -10]} angle={0.3} penumbra={0.8} distance={500} decay={0} />
          {/*
        <pointLight position={[-0, -10, -10]} />
        <Box position={[-1.2, 0, 0]} /> */}
          <Box position={[0, 0, 0]} />
        </Canvas>
      </div>
    </AppContext.Provider>
  </div>


}

export default App;
