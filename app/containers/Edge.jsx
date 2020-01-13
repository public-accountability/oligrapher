import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { DraggableCore } from 'react-draggable'
import { connect } from 'react-redux'
import merge from 'lodash/merge'
import pick from 'lodash/pick'
import noop from 'lodash/noop'

import { calculateDeltas } from '../util/deltas'
import Curve from '../graph/curve'

// import DraggableEdge from '../components/graph/DraggableEdge'
import EdgeLine from '../components/graph/EdgeLine'
import EdgeHandle from '../components/graph/EdgeHandle'

const DRAGGABLE_HANDLE = '.edge-handle'

const logger = msg => () => console.log(msg)

export function Edge(props) {
  const [curve, setCurve] = useState(Curve.from.edge(props))
  const [startDrag, setStartDrag] = useState()
  const width = 1 + (props.scale - 1) * 5
  const startPosition = { x: props.cx, y: props.cy }

  const curveFromDragData = data => {
    const deltas = calculateDeltas(data, startPosition, startDrag, props.actualZoom)
    return Curve.from.edge({...props, cx: deltas.x, cy: deltas.y })
  }

  const onStart = (_, data) => {
    setStartDrag(data)
  }

  const onDrag = (_, data) => {
    const deltas = calculateDeltas(data, startPosition, startDrag, props.actualZoom)
    setCurve(
      Curve.from.edge({...props, cx: deltas.x, cy: deltas.y })
    )
  }

  const onStop = (_, data) => {
    const deltas = calculateDeltas(data, startPosition, startDrag, props.actualZoom)
    props.updateEdge({cx: deltas.x, cy: deltas.y })
  }

  const draggableProps = {
    handle: DRAGGABLE_HANDLE,
    onStart: onStart,
    onDrag: onDrag,
    onStop: onStop
  }

  const edgeGroupProps = {
    className: "edge-group",
    id: `edge-${props.id}`
  }

  const edgeHandleProps = { curve, width, onClick: noop }

  const edgeLineProps = merge({ curve, width },
                              pick(props, ['id', 'scale', 'dash', 'status']))

  return  <DraggableCore {...draggableProps} >
            <g {...edgeGroupProps} >
              <EdgeLine {...edgeLineProps} />
              <EdgeHandle {...edgeHandleProps} />
            </g>
          </DraggableCore>
}

Edge.propTypes = {
  id:         PropTypes.string.isRequired,
  node1_id:   PropTypes.string.isRequired,
  node2_id:   PropTypes.string.isRequired,
  // display
  scale:      PropTypes.number.isRequired,
  arrow:      PropTypes.string,
  label:      PropTypes.string,
  dash:       PropTypes.bool.isRequired,
  url:        PropTypes.string,
  status:     PropTypes.string.isRequired,
  // geometry
  x1:         PropTypes.number.isRequired,
  y1:         PropTypes.number.isRequired,
  x2:         PropTypes.number.isRequired,
  y2:         PropTypes.number.isRequired,
  cx:         PropTypes.number.isRequired,
  cy:         PropTypes.number.isRequired,
  s1:         PropTypes.number.isRequired,
  s2:         PropTypes.number.isRequired,
  //
  actualZoom: PropTypes.number,
  updateEdge: PropTypes.func.isRequired
}

Edge.defaultProps = {
  dash: false
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.id.toString()
  return { ...state.graph.edges[id],
           actualZoom: state.graph.actualZoom }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const id = ownProps.id.toString()

  return {
    updateEdge: attributes => dispatch({type: 'UPDATE_EDGE',
                                        id: id,
                                        attributes: attributes })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Edge)
