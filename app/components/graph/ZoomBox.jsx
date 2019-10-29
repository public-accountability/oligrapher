import React from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'

/*
  This is our outermost SVG element. It manages our
  zoom state, rendering the graph as a child element.
*/
export default function ZoomBox(props) {
  return <Draggable handle='.zoom-handle'>
           <g>
             <rect className="zoom-handle" x="-5000" y="-5000" width="10000" height="10000" fill="#fff" />
             {props.children}
           </g>
         </Draggable>
}

ZoomBox.propTypes = {
  children: PropTypes.node.isRequired
}
