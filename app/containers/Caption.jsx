import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { captionShape } from '../graph/caption'

import CaptionTextbox from '../components/graph/CaptionTextbox'


// <div contenteditable="true">
//     <svg>
//         <circle cx="10" cy="10" r="5" fill="green" />
//         <text y="2em">Hello world</text>
//     </svg>
// </div>

export function Caption(props) {
  const captionGroupRef = useRef(null)
  const handleTextChange = event => props.updateCaption({text: event.target.value})


  return <g className="caption" id={`caption-${props.id}`}>
           <CaptionTextbox x={props.x} y={props.y} text={props.text} handleTextChange={handleTextChange} />
         </g>
}

Caption.propTypes = {
  ...captionShape,
  updateCaption:  PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => state.graph.captions[ownProps.id]

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateCaption: attributes => dispatch({
    type: 'UPDATE_CAPTION',
    attributes: attributes,
    id: ownProps.id
  })
})

export default connect(mapStateToProps, mapDispatchToProps)(Caption)

//   return <g className="caption" id={`caption-${props.id}`}>
//            <text x={props.x} y={props.y}>
//              {props.text}
//            </text>
//          </g>
