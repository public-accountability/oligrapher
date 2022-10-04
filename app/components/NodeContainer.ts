import React from 'react'
import { useDispatch } from 'react-redux'

type NodeContainerProps = {
  children: React.ReactNode,
  id: string,
  name: string
}

export default function NodeContainer(props: NodeContainerProps):  React.ReactElement {
  const dispatch = useDispatch()
  const onMouseEnter = () => dispatch({ type: 'MOUSE_ENTERED_NODE', name: props.name })
  const onMouseLeave = () => dispatch({ type: 'MOUSE_LEFT_NODE' })

  const gProps = { id: `node-${props.id}`,
                   className: "oligrapher-node",
                   onMouseEnter: onMouseEnter,
                   onMouseLeave: onMouseLeave,
                   onDragOver: onMouseEnter,
                   onDragLeave: onMouseLeave }

  return React.createElement('g', gProps, props.children)
}
