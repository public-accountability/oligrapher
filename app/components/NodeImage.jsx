import React from 'react'

import { NODE_RADIUS, Node as NodeType } from '../graph/node'
import { NodeUIState } from '../util/NodeUIState'

const IMAGE_SCALE = 3

export function NodeImage({ node, uiState }: { node: NodeType, uiState: NodeUIState }) {
  const { id, x, y, image, scale } = node
  const radius = NODE_RADIUS * scale
  const imageWidth = IMAGE_SCALE * radius
  const clipPathId = `image-clip-${id}`

  const opacity = {
    normal: "1",
    highlighted: "1",
    faded: "0.2"
  }[uiState.appearance]

  return (
    <>
      <clipPath id={clipPathId}>
        <circle r={radius}
                cx={x}
                cy={y}>
        </circle>
      </clipPath>

      {/* The x/y math centers the image inside the circle clippath */}
      <image
        href={image}
        className="node-image draggable-node-handle"
        x={x - (imageWidth/2)}
        y={y - (imageWidth/2)}
        height={imageWidth}
        width={imageWidth}
        opacity={opacity}
        clipPath={`url(#${clipPathId})`}
        onDragStart={(e) => e.preventDefault()} // to prevent HTML5 drag-n-drop (draggable="false" used to work)
      />
    </>
  )
}

NodeImage.propTypes = {
  node: PropTypes.object.isRequired
}

export default React.memo(NodeImage)
