import type { State } from './defaultState'
import { annotationHasHighlightsSelector } from './selectors'

export type NodeAppearance = "normal" | "highlighted" | "faded"

export interface NodeUIState {
  dragged: boolean,
  edited: boolean,
  selected: boolean,
  highlighted: boolean,
  appearance: NodeAppearance,
  disabled: boolean
}

export const calculateAppearance = (id: string, state: State): NodeAppearance => {
  // when in story mode and there are higlights
  if (state.display.modes.story && annotationHasHighlightsSelector(state)) {
    if (state.annotations.list[state.annotations.currentIndex]?.nodeIds?.includes(id)) {
      return "highlighted"
    } else {
      return "faded"
    }
  } else {
    return "normal"
  }
}

export function getNodeUIState(id: string, state: State): NodeUIState {
  return {
    dragged: Boolean(state.display.draggedNode === id),
    edited: Boolean(state.display.floatingEditor.type === 'node' && state.display.floatingEditor.id  === id),
    selected: state.display.selection.node.includes(id),
    highlighted: Boolean(state.display.modes.story && state.annotations.list[state.annotations.currentIndex]?.nodeIds?.includes(id)),
    appearance: calculateAppearance(id, state),
    // disable dragging if not editing and while another node is being dragged
    disabled: !state.display.modes.editor || Boolean(state.display.modes.editor && state.display.draggedNode && state.display.draggedNode !== id)
  }
}
