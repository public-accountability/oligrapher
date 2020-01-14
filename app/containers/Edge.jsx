import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { DraggableCore } from 'react-draggable'
import { connect } from 'react-redux'
import merge from 'lodash/merge'
import pick from 'lodash/pick'
import noop from 'lodash/noop'

import { calculateDeltas } from '../util/deltas'
import Curve from '../graph/curve'

import EdgeLine from '../components/graph/EdgeLine'
import EdgeHandle from '../components/graph/EdgeHandle'

const DRAGGABLE_HANDLE = '.edge-handle'

const calculateEdgeWidth = scale => 1 + (scale - 1) * 5

export function Edge(props) {
  const [curve, setCurve] = useState(Curve.from.edge(props))

  // This resets the curve based on new props when they are passed to an already rendered component
  // This happens after the DRAG_NODE action occurs.
  useEffect(() => setCurve(Curve.from.edge(props)),
            [props.cx, props.cy, props.x1, props.x2, props.y1, props.y2, props.s1, props.s2])

  const [startDrag, setStartDrag] = useState()

  const width = calculateEdgeWidth(props.scale)
  const startPosition = { x: props.cx, y: props.cy }

  const onStart = (evt, data) =>  setStartDrag(data)

  const onDrag = (evt, data) => {
    const deltas = calculateDeltas(data, startPosition, startDrag, props.actualZoom)
    setCurve(
      Curve.from.edge({...props, cx: deltas.x, cy: deltas.y })
    )
  }

  const onStop = (evt, data) => {
    const deltas = calculateDeltas(data, startPosition, startDrag, props.actualZoom)
    props.updateEdge({cx: deltas.x, cy: deltas.y })
  }

  const onClick = (evt, data) => {
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

  actualZoom: PropTypes.number,

  // Actions
  updateEdge: PropTypes.func.isRequired,
  openEdgeMenu: PropTypes.func.isRequired
}

Edge.defaultProps = {
  dash: false
}


const mapStateToProps = (state, ownProps) => {
  const id = ownProps.id.toString()

  return { ...state.graph.edges[id],
           actualZoom: state.graph.actualZoom }
}

// dispatch helpers

const openEdgeMenu = (dispatch, id) => () => dispatch({
  type: 'OPEN_EDIT_EDGE_MENU',
  id: id
})

const updateEdge = (dispatch, id) => attributes => dispatch({
  type: 'UPDATE_EDGE',
  id: id,
  attributes: attributes
})


const mapDispatchToProps = (dispatch, ownProps) => {
  const id = ownProps.id.toString()

  return {
    updateEdge: updateEdge(dispatch, id),
    openEdgeMenu: openEdgeMenu(dispatch, id)
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Edge)
