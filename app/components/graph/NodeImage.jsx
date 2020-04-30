import React from 'react'
import PropTypes from 'prop-types'

const IMAGE_SCALE = 3
const IMAGE_OPAICTY = 1

export function NodeImage({ node, radius }) {
  const { id, x, y, image } = node
  const clipPathId = `image-clip-${id}`
  const imageWidth = IMAGE_SCALE * radius

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
  node: PropTypes.object.isRequired,
  radius: PropTypes.number.isRequired
}

export default React.memo(NodeImage)
