import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'

function Model(props) {

  const ref = useRef()

  useFrame(() => {
    if (ref.current) {
      // ref.current.rotation.x = ref.current.rotation.y += 0.001
    }
  })

  function handleClick(e) {
    e.stopPropagation()
    if (e.object) {
      // console.log('props', props)
      props.contextDispatch({ type: 'selectInViewer', id: e.object.uuid })
    }
  }

  return props.model ? <primitive
    ref={ref}
    object={props.model.scene}
    position={[-75,-25,40]}
    onClick={handleClick}
  /> : null

}

export default Model