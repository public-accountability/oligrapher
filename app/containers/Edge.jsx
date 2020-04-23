import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { DraggableCore } from 'react-draggable'
import { connect } from 'react-redux'
import pick from 'lodash/pick'

import { calculateDeltas } from '../util/deltas'
import { stringOrNumber, stringOrBool } from '../util/types'
import Curve from '../graph/curve'

import EdgeLine from '../components/graph/EdgeLine'
import EdgeHighlight from '../components/graph/EdgeHighlight'
import EdgeHandle from '../components/graph/EdgeHandle'
import EdgeLabel from '../components/graph/EdgeLabel'

import FloatingMenu from '../util/floatingMenu'

const HIGHLIGHT_COLOR = '#50a3ff'

const calculateEdgeWidth = scale => 1 + (scale - 1) * 5

export function Edge(props) {
  const [isHovering, setHovering] = useState(false)
  const [isDragging, setDragging] = useState(false)
  const [startDrag, setStartDrag] = useState()
  const [geometry, setGeometry] = useState(Curve.calculateGeometry(props))
  const curve = Curve.from.geometry(geometry)

  const { cx, cy, x1, x2, y1, y2, s1, s2 } = props

  // This resets the curve based on new props when they are passed to an already rendered component
  // This happens after the DRAG_NODE action occurs.
  useEffect(() => {
    setGeometry(Curve.calculateGeometry({ cx, cy, x1, x2, y1, y2, s1, s2 }))
  }, [cx, cy, x1, x2, y1, y2, s1, s2]) // eslint-disable-line react-hooks/exhaustive-deps

  const pickProps = (...propNames) => pick(props, propNames)

  const width = calculateEdgeWidth(props.scale)
  const startPosition = { x: props.cx, y: props.cy }

  const onStart = (evt, data) => {
    setStartDrag(data)
  }

  const onDrag = (evt, data) => {
    setDragging(true)
    const deltas = calculateDeltas(data, startPosition, startDrag, props.actualZoom)
    setGeometry(
      Curve.calculateGeometry({...props, cx: deltas.x, cy: deltas.y })
    )
  }

  const onStop = (evt, data) => {
    if (isDragging) {
      const deltas = calculateDeltas(data, startPosition, startDrag, props.actualZoom)
      props.updateEdge({ cx: deltas.x, cy: deltas.y })
      setDragging(false)
    }
  }

  const onClick = evt => {
    evt.preventDefault()
    props.clickEdge()
  }

  // Children Props
  const edgeLineProps = { curve, width, isReverse: geometry.is_reverse, ...pickProps('id', 'scale', 'dash', 'status', 'arrow') }
  const edgeLabelProps = { curve, width, ...pickProps('id', 'scale', 'status', 'label') }
  const edgeHandleProps = { 
    curve, width, onClick,
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false) 
  }

  // Display helpers
  const showHighlight = false && !isDragging && (props.isBeingEdited || isHovering)
  const showLabel = Boolean(props.label)
  edgeLineProps.status = showHighlight ? "highlighted" : edgeLineProps.status

  return (  
    <DraggableCore
      hanlde=".edge-handle"
      disabled={!props.editorMode}
      onStart={onStart}
      onDrag={onDrag}
      onStop={onStop}>
      <g className="edge-group" id={`edge-${props.id}`}>
        { showHighlight && <EdgeHighlight color={HIGHLIGHT_COLOR} curve={curve} scale={props.scale} /> }
        <EdgeLine {...edgeLineProps} />
        { showLabel && <EdgeLabel {...edgeLabelProps} /> }
        <EdgeHandle {...edgeHandleProps} />
      </g>
    </DraggableCore>
  )
}

Edge.propTypes = {
  id: stringOrNumber.isRequired,
  node1_id: stringOrNumber.isRequired,
  node2_id: stringOrNumber.isRequired,
  // display
  scale: PropTypes.number.isRequired,
  arrow: stringOrBool.isRequired,
  label: PropTypes.string,
  dash: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  url: PropTypes.string,
  status: PropTypes.string.isRequired,
  // geometry
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,
  cx: PropTypes.number,
  cy: PropTypes.number,
  s1: PropTypes.number.isRequired,
  s2: PropTypes.number.isRequired,
  actualZoom: PropTypes.number,

  // Actions
  updateEdge: PropTypes.func.isRequired,
  clickEdge: PropTypes.func.isRequired,

  // Helpers
  isBeingEdited: PropTypes.bool,
  editorMode: PropTypes.bool
}

Edge.defaultProps = {
  dash: false,
  editorOpen: false,
  editorMode: false
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.id.toString()
  const edge = state.graph.edges[id]

  return {
    ...edge,
    actualZoom: state.display.actualZoom,
    isBeingEdited: id == FloatingMenu.getId(state, 'edge'),
    edgeToolEnabled: state.display.editor.tool === 'edge',
    editorMode: state.display.modes.editor
  }
}

// dispatch helpers

const updateEdge = (dispatch, id) => attributes => dispatch({
  type: 'UPDATE_EDGE',
  id: id,
  attributes: attributes
})

const mapDispatchToProps = (dispatch, ownProps) => {
  const id = ownProps.id.toString()

  return {
    updateEdge: updateEdge(dispatch, id),
    clickEdge: () => dispatch({ type: 'CLICK_EDGE', id })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Edge)
