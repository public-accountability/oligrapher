import React from 'react'
import PropTypes from 'prop-types'

import { NODE_RADIUS } from '../graph/node'

const IMAGE_SCALE = 3
const IMAGE_OPAICTY = 1

export function NodeImage({ node }) {
  const { id, x, y, image, scale } = node
  const radius = NODE_RADIUS * scale
  const imageWidth = IMAGE_SCALE * radius
  const clipPathId = `image-clip-${id}`

  if (!node.image) {
    return null
  }

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
        opacity={IMAGE_OPAICTY}
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
