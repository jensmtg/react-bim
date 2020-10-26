import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'

function Model(props) {

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
    }
  }

  return props.model ? <primitive
    ref={ref}
    object={props.model.scene}
    position={[0, 0, 0]}
    onClick={handleClick}
  /> : null

}

export default Model