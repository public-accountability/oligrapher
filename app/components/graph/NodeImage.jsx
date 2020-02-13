import React from 'react'
import PropTypes from 'prop-types'

const IMAGE_SCALE = 3
const IMAGE_OPAICTY = 1

// const IMAGE_OPACITY =  {
//   normal: 1,
//   highlighted: 1,
//   faded: 0.2
// }

export function NodeImage(props) {
  const clipPathId = `image-clip-${props.id}`
  const imageWidth = IMAGE_SCALE * props.radius

  return <>
           <clipPath id={clipPathId}>
             <circle r={props.radius}
                     cx={props.x}
                     cy={props.y}>
             </circle>
           </clipPath>

           {/* The x/y math centers the image inside the circle clippath*/}
           <image href={props.image}
                  className="node-image draggable-node-handle"
                  x={props.x - (imageWidth/2)}
                  y={props.y - (imageWidth/2)}
                  height={imageWidth}
                  width={imageWidth}
                  opacity={IMAGE_OPAICTY}
                  clipPath={`url(#${clipPathId})`} >
           </image>

         </>
}

NodeImage.propTypes = {
  id: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired
}

export default React.memo(NodeImage)
