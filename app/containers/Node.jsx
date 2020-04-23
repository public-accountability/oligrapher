import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import noop from 'lodash/noop'
import pick from 'lodash/pick'
import { frozenArray } from '../util/helpers'

import DraggableComponent from './../components/graph/DraggableComponent'
import NodeHalo from './../components/graph/NodeHalo'
import NodeCircle from './../components/graph/NodeCircle'
import NodeImage from './../components/graph/NodeImage'
import NodeLabel from './../components/graph/NodeLabel'

const DEFAULT_RADIUS = 25
const DEFAULT_COLOR = "#ccc"

const HALO_PROPS = frozenArray('x', 'y', 'radius')
const CIRCLE_PROPS = frozenArray('x', 'y', 'radius', 'color')
const IMAGE_PROPS = frozenArray('id', 'x', 'y', 'radius', 'image')
const LABEL_PROPS = frozenArray('x', 'y', 'name', 'radius', 'status', 'url')

export function Node(props) {
  const showImage = Boolean(props.image)
  const showHalo = props.selected || props.isNewEdgeNode || props.isBeingEdited

  return (
    <DraggableComponent
      disabled={!props.editorMode}
      handle=".draggable-node-handle"
      actualZoom={props.actualZoom}
      onStop={props.moveNode}
      onDrag={props.dragNode}>
      <g id={"node-" + props.id} className="oligrapher-node" onClick={(props.clickNode)}>
        <NodeHalo {...pick(props, HALO_PROPS)} showHalo={showHalo} />
        <NodeCircle {...pick(props, CIRCLE_PROPS)} />
        { showImage && <NodeImage {...pick(props, IMAGE_PROPS)} /> }
        <NodeLabel {...pick(props, LABEL_PROPS)} />
      </g>
    </DraggableComponent>
  )
}

Node.propTypes = {
  // Node attributes
  id: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  name: PropTypes.string,
  url: PropTypes.string,
  image: PropTypes.string,
  color: PropTypes.string,
  status: PropTypes.string.isRequired,
  // scale: PropTypes.number.isRequired,
  // Virtual attributes
  radius: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  isNewEdgeNode: PropTypes.bool,
  isBeingEdited: PropTypes.bool,

  // Actions
  clickNode: PropTypes.func.isRequired,
  moveNode: PropTypes.func.isRequired,
  dragNode: PropTypes.func.isRequired,

  // UI helpers
  actualZoom: PropTypes.number,
  editorMode: PropTypes.bool.isRequired
}

Node.defaultProps = {
  color: DEFAULT_COLOR,
  selected: false,
  isNewEdgeNode: false,
  isBeingEdited: false,
  toggleEditNodeMenu: noop
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.id.toString()
  const node = state.graph.nodes[id]
  const { floatingMenu } = state.display
  const isBeingEdited = ['node', 'connections'].includes(floatingMenu.type) && floatingMenu.id === id

  return {
    ...node,
    radius: DEFAULT_RADIUS * node.scale,
    id: id,
    zoom: state.display.zoom,
    actualZoom: state.display.actualZoom,
    editorMode: state.display.modes.editor,
    selected: state.display.selectedNodes.has(id),
    isNewEdgeNode: state.edgeCreation.nodes.includes(id),
    isBeingEdited: isBeingEdited
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const id = ownProps.id.toString()

  return {
    moveNode: (deltas) => dispatch({ type: 'MOVE_NODE', id, deltas }),
    dragNode: (deltas) => dispatch({ type: 'DRAG_NODE', id, deltas }),
    dispatch
  }
}

const mergeProps = (stateProps, dispatchProps) => {
  let { id } = stateProps

  return {
    ...stateProps,
    ...dispatchProps,
    clickNode: () => dispatchProps.dispatch({ type: 'CLICK_NODE', id })
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Node)
