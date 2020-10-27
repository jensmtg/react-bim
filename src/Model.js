import React, { useRef, useContext } from 'react'
import { useFrame } from 'react-three-fiber'
import AppContext from './AppContext';

function Model(props) {

  const x = useContext(AppContext)
  // console.log('x3', x)

  const ref = useRef()

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x = ref.current.rotation.y += 0.001
    }
  })

  function handleClick(e) {
    e.stopPropagation()
    if (e.object) {
      console.log('e', e.object)
      // console.log('dccc', contextDispatch)
      // contextDispatch({ type: 'visibility', id: e.object.uuid })
      // e.object.visible = false
    }
  }

  return props.model ? <primitive
    ref={ref}
    object={props.model}
    position={[0, 0, 0]}
    onClick={handleClick}
  /> : null

}

export default Model