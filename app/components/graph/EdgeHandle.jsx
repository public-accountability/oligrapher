import React from 'react'
import PropTypes from 'prop-types'
import noop from 'lodash/noop'

const EXTRA_WIDTH = 20

export default function EdgeHandle(props) {
  return <path className="edge-handle"
               d={props.curve}
               width={props.width + EXTRA_WIDTH}
               onClick={props.onClick}
               onMouseEnter={props.onMouseEnter}
               onMouseLeave={props.onMouseLeave}>
         </path>
}

EdgeHandle.propTypes = {
  curve:         PropTypes.string.isRequired,
  width:         PropTypes.number.isRequired,
  onClick:       PropTypes.func.isRequired,
  onMouseEnter:  PropTypes.func,
  onMouseLeave:  PropTypes.func
}

EdgeHandle.defaultProps = {
  onMouseEnter:  noop,
  onMouseLeave:  noop
}
