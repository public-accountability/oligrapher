import produce from 'immer'

import { AnnotationsState } from '../util/defaultState'

import { 
  createAnnotation, moveAnnotation, showAnnotation, updateAnnotation, removeAnnotation
} from '../util/annotations'

const ZOOM_INTERVAL = 1.2

export default produce((annotations: AnnotationsState, action: any): void => {
  switch(action.type) {
  case 'TOGGLE_ANNOTATIONS':
    annotations.show = !annotations.show
    return
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
  default:
    return
  }
}, null)