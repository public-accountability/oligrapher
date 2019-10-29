import React from 'react'
import PropTypes from 'prop-types'
import noop from 'lodash/noop'
import Draggable from 'react-draggable'
import Node from '../components/graph/Node'

export function DraggableNode(props) {
  return <Draggable onDrag={props.onDrag}
                    onStart={props.onStart}
                    onStop={props.onStop} >
           <Node node={props.node} />
         </Draggable>
}

DraggableNode.propTypes = {
  node: PropTypes.object.isRequired,
  onStart: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}

DraggableNode.defaultProps = {
  onStart: noop,
  onDrag: noop,
  onStop: noop
}


function mapStateToProps(state, ownProps) {
  return {
    node: ownProps.node
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(DraggableNode)
