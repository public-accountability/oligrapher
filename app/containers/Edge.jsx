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

const HIGHLIGHT_COLOR = { edit:  '#eaff00',
                          hover: '#d9d9d9' }

const calculateEdgeWidth = scale => 1 + (scale - 1) * 5

export function Edge(props) {
  const [isHovering, setHovering] = useState(false)
  const [isDragging, setDragging] = useState(false)
  const [startDrag, setStartDrag] = useState()
  const [geometry, setGeometry] = useState(Curve.calculateGeometry(props))
  const curve = Curve.from.geometry(geometry)

  const pickProps = (...propNames) => pick(props, propNames)

  // This resets the curve based on new props when they are passed to an already rendered component
  // This happens after the DRAG_NODE action occurs.
  useEffect(() => void setGeometry(Curve.calculateGeometry(props)),
    [props.cx, props.cy, props.x1, props.x2, props.y1, props.y2, props.s1, props.s2]
  )

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
    if (isDragging) {
      const deltas = calculateDeltas(data, startPosition, startDrag, props.actualZoom)
      props.updateEdge({cx: deltas.x, cy: deltas.y })
      setDragging(false)
    }
  }

  const onClick = evt => {
    evt.preventDefault()
    props.openEdgeMenu()
  }

  // Children Props
  const draggableProps = { onStart, onDrag, onStop, handle: '.edge-handle', disabled: !props.editorMode }
  const edgeGroupProps = { className: "edge-group", id: `edge-${props.id}` }
  const edgeLineProps = { curve, width, isReverse: geometry.is_reverse, ...pickProps('id', 'scale', 'dash', 'status', 'arrow') }
  const edgeLabelProps = { curve, width, ...pickProps('id', 'scale', 'status', 'label') }
  const edgeHandleProps = { 
    curve, width, onClick,
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false) 
  }

  // Display helpers
  const showEditHighlight = props.editorOpen
  const showHoverHighlight = isHovering && !showEditHighlight && !isDragging
  const showLabel = Boolean(props.label)

  return (  
    <DraggableCore {...draggableProps}>
      <g {...edgeGroupProps}>
        { showEditHighlight  && <EdgeHighlight color={HIGHLIGHT_COLOR.edit} curve={curve} scale={props.scale} /> }
        { showHoverHighlight && <EdgeHighlight color={HIGHLIGHT_COLOR.hover} curve={curve} scale={props.scale} /> }
        { true               && <EdgeLine {...edgeLineProps} /> }
        { showLabel          && <EdgeLabel {...edgeLabelProps} /> }
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
  openEdgeMenu: PropTypes.func.isRequired,

  // Helpers
  editorOpen: PropTypes.bool,
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
    editorOpen: id == FloatingMenu.getId(state, 'edge'),
    edgeToolEnabled: state.display.editor.tool === 'edge',
    editorMode: state.display.modes.editor
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
