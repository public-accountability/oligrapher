import React from 'react'

interface NodeBodyProps extends React.SVGAttributes<SVGGElement> {
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
    gProps.style = { cursor: "pointer" }
  }

  return React.createElement('g', gProps, children)
}
