import { calculateViewBox } from '../graph/graph'
import { currentAnnotationSelector } from './selectors'
import { State } from './defaultState'
import { Viewbox } from '../graph/graph'

const padding = {
  left: 80,
  right: 80,
  top: 50,
  bottom: 100
}

export default function calculateAnnotationViewBox(state: State): Viewbox {
  // show normal viewbox if editing or annotations hidden
  if (state.display.modes.editor || !state.display.modes.story) {
    return state.display.viewBox
  }

  const annotation = currentAnnotationSelector(state)
  // show normal viewbox if there is no current annotation
  if (!annotation) {
    return state.display.viewBox
  }

  // show normal viewbox if there are no highlights
  if (annotation.nodeIds.length + annotation.edgeIds.length + annotation.captionIds.length === 0) {
    return state.display.viewBox
  }

  let nodes = Object.values(state.graph.nodes).filter(node => annotation.nodeIds.includes(node.id))
  let edges = Object.values(state.graph.edges).filter(edge => annotation.edgeIds.includes(edge.id))
  let captions = Object.values(state.graph.captions).filter(caption => annotation.captionIds.includes(caption.id))

  return calculateViewBox(nodes, edges, captions, padding)
}
