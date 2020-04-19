import React from 'react'
import PropTypes from 'prop-types'



export default function EdgeHighlight(props) {
  const width = 10 + (props.scale - 1) * 5

  return (
    <path d={props.curve}
          stroke={props.color}
          strokeWidth={width}
          fill="none">
    </path>
  )
}


EdgeHighlight.propTypes = {
  curve:     PropTypes.string.isRequired,
  color:     PropTypes.string.isRequired,
  scale:     PropTypes.number.isRequired
}

// export default React.memo(EdgeLine)
// id:        stringOrNumber.isRequired,

//   scale:     PropTypes.number.isRequired,
//   dash:      PropTypes.bool.isRequired,
//   status:    PropTypes.string.isRequired,
//   width:     PropTypes.number.isRequired,
//   arrow:     PropTypes.string,
//   isReverse: PropTypes.bool.isRequired
