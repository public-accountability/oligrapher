import React from "react"
import { NodeUIState } from "../util/NodeUIState"

interface NodeBodyProps extends React.SVGAttributes<SVGGElement> {
  children: React.ReactNode
  nodeId: string
  enableClick: boolean
  ui: NodeUIState
  url?: string | null
  nodeRef: React.Ref<React.ReactSVGElement>
}

const NodeBody = React.forwardRef((props: NodeBodyProps, ref: React.Ref<SVGGElement>) => {
  const { children, nodeId, nodeRef, enableClick, ui, url, ...gProps } = props
  gProps.id = `node-${nodeId}`
  gProps.className = "oligrapher-node"

  if (enableClick && url && !(ui.appearance === "faded")) {
    gProps.onClick = () => window.open(url, "_blank")
    gProps.style = { cursor: "pointer" }
  }

  if (ui.dragged) {
    gProps.style = { cursor: "grabbing" }
  }

  return (
    <g ref={ref} {...gProps}>
      {children}
    </g>
  )
})

export default NodeBody
