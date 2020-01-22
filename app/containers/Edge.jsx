import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { DraggableCore } from 'react-draggable'
import { connect } from 'react-redux'
import pick from 'lodash/pick'

import { calculateDeltas } from '../util/deltas'
import { stringOrNumber, stringOrBool } from '../util/types'
import Curve from '../graph/curve'

import EdgeLine from '../components/graph/EdgeLine'
import EdgeHandle from '../components/graph/EdgeHandle'
import EdgeLabel from '../components/graph/EdgeLabel'

const calculateEdgeWidth = scale => 1 + (scale - 1) * 5

export function Edge(props) {
  const pickProps = (...propNames) => pick(props, propNames)
  const [geometry, setGeometry] = useState(Curve.calculateGeometry(props))
  const curve = Curve.from.geometry(geometry)

  // This resets the curve based on new props when they are passed to an already rendered component
  // This happens after the DRAG_NODE action occurs.
  useEffect(() => setGeometry(Curve.calculateGeometry(props)),
            [props.cx, props.cy, props.x1, props.x2, props.y1, props.y2, props.s1, props.s2])

  const [startDrag, setStartDrag] = useState()
  const [dragging, setDragging] = useState(false)

  const width = calculateEdgeWidth(props.scale)
  const startPosition = { x: props.cx, y: props.cy }

  const onStart = (evt, data) => {
    setDragging(true)
    setStartDrag(data)
  }

  const onDrag = (evt, data) => {
    const deltas = calculateDeltas(data, startPosition, startDrag, props.actualZoom)
    setGeometry(
      Curve.calculateGeometry({...props, cx: deltas.x, cy: deltas.y })
    )
  }

  const onStop = (evt, data) => {
    if (dragging) {
      const deltas = calculateDeltas(data, startPosition, startDrag, props.actualZoom)
      props.updateEdge({cx: deltas.x, cy: deltas.y })
      setDragging(false)
    }
  }

  const onClick = evt => {
    evt.preventDefault()
    props.openEdgeMenu()
  }

  const draggableProps = {
    handle: '.edge-handle',
    onStart: onStart,
    onDrag: onDrag,
    onStop: onStop
  }

  const edgeGroupProps = {
    className: "edge-group",
    id: `edge-${props.id}`
  }

  const edgeLineProps = { curve, width, isReverse: geometry.is_reverse, ...pickProps('id', 'scale', 'dash', 'status', 'arrow') }
  const edgeLabelProps = { curve, width, ...pickProps('id', 'scale', 'status', 'label') }
  const edgeHandleProps = { curve, width, onClick }

  return  <DraggableCore {...draggableProps} >
            <g {...edgeGroupProps} >
              <EdgeLine {...edgeLineProps} />
              { props.showLabel && <EdgeLabel {...edgeLabelProps} /> }
              <EdgeHandle {...edgeHandleProps} />
            </g>
          </DraggableCore>
}

Edge.propTypes = {
  id:         stringOrNumber.isRequired,
  node1_id:   stringOrNumber.isRequired,
  node2_id:   stringOrNumber.isRequired,
  // display
  scale:      PropTypes.number.isRequired,
  arrow:      stringOrBool.isRequired,
  label:      PropTypes.string,
  dash:       PropTypes.bool.isRequired,
  url:        PropTypes.string,
  status:     PropTypes.string.isRequired,
  // geometry
  x1:         PropTypes.number.isRequired,
  y1:         PropTypes.number.isRequired,
  x2:         PropTypes.number.isRequired,
  y2:         PropTypes.number.isRequired,
  cx:         PropTypes.number,
  cy:         PropTypes.number,
  s1:         PropTypes.number.isRequired,
  s2:         PropTypes.number.isRequired,

  actualZoom: PropTypes.number,

  // Actions
  updateEdge: PropTypes.func.isRequired,
  openEdgeMenu: PropTypes.func.isRequired,

  // Helpers
  showLabel: PropTypes.bool.isRequired
}

Edge.defaultProps = {
  dash: false
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.id.toString()
  const edge = state.graph.edges[id]

  return {
    ...edge,
    actualZoom: state.graph.actualZoom,
    showLabel: Boolean(edge.label)
  }
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
