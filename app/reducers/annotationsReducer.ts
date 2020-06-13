import produce from 'immer'

import { AnnotationsState } from '../util/defaultState'

import { 
  createAnnotation, moveAnnotation, showAnnotation, updateAnnotation, removeAnnotation,
  swapHighlight
} from '../util/annotations'

const ZOOM_INTERVAL = 1.2

export default produce((annotations: AnnotationsState, action: any): void => {
  switch(action.type) {
  case 'CREATE_ANNOTATION':
    createAnnotation(annotations)
    return
  case 'MOVE_ANNOTATION':
    moveAnnotation(annotations, action.from, action.to)
    return
  case 'SHOW_ANNOTATION':
    showAnnotation(annotations, action.index)
    return
  case 'UPDATE_ANNOTATION':
    updateAnnotation(annotations, action.id, action.attributes)
    return
  case 'REMOVE_ANNOTATION':
    removeAnnotation(annotations, action.id)
    return
  case 'SET_HIGHLIGHTING':
    annotations.isHighlighting = action.isHighlighting
    return
  case 'SWAP_NODE_HIGHLIGHT':
    swapHighlight(annotations, 'node', action.id)
    return
  case 'SWAP_EDGE_HIGHLIGHT':
    swapHighlight(annotations, 'edge', action.id)
    return
  case 'SWAP_CAPTION_HIGHLIGHT':
    swapHighlight(annotations, 'caption', action.id)
    return
  case 'SET_EDITOR_MODE':
    annotations.currentIndex = 0
    return
  default:
    return
  }
}, null)