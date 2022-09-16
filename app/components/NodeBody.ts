import React from 'react'
import { noop } from 'lodash'

type NodeBodyProps = {
  children: React.ReactNode,
  nodeId: string,
  enableClick: boolean,
  url?: string | null,
}

export default function NodeBody(props: NodeBodyProps) {
  const { children, nodeId, enableClick, url, ...gProps } = props
  gProps.id = `node-${nodeId}`
  gProps.className = "oligrapher-node"

  if (enableClick && url) {
    gProps.onClick = () => window.open(url, "_blank")
  }

  return React.createElement('g', gProps, children)
}
