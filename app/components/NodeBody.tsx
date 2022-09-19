import React from 'react'
import { NodeAppearance } from '../util/NodeUIState'

interface NodeBodyProps extends React.SVGAttributes<SVGGElement> {
  children: React.ReactNode,
  nodeId: string,
  enableClick: boolean,
  appearance: NodeAppearance,
  url?: string | null,
  nodeRef: React.Ref<React.ReactSVGElement>
}

export default function NodeBody(props: NodeBodyProps) {
  const { children, nodeId, nodeRef, enableClick, appearance, url, ...gProps } = props
  gProps.id = `node-${nodeId}`
  gProps.className = "oligrapher-node"

  if (enableClick && url && !(appearance === 'faded')) {
    gProps.onClick = () => window.open(url, "_blank")
    gProps.style = { cursor: "pointer" }
  }

  return <g ref={nodeRef} {...gProps}>{children}</g>
}
