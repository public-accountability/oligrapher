import React from 'react'
import { connect } from 'react-redux'
import { captionShape } from '../graph/caption'

export function Caption(props) {
  return <g className="caption" id={`caption-${props.id}`}>
           <text x={props.x} y={props.y}>
             {props.text}
           </text>
         </g>
}

Caption.propTypes = captionShape

const mapStateToProps = (state, ownProps) => {
  return state.graph.captions[ownProps.id]
}

export default connect(mapStateToProps)(Caption)
