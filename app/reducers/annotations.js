import Annotation from '../models/Annotation';
import { LOAD_ANNOTATIONS, UPDATE_ANNOTATION, DELETE_ANNOTATION, 
         CREATE_ANNOTATION, MOVE_ANNOTATION, TOGGLE_ANNOTATIONS } from '../actions';
import merge from 'lodash/object/merge'; 
import assign from 'lodash/object/assign'; 
import keys from 'lodash/object/keys';
import cloneDeep from 'lodash/lang/cloneDeep';

const initState = { list: [], visible: true };

export default function annotations(state = initState, action) {
  switch (action.type) {

  case LOAD_ANNOTATIONS:
    return merge({}, state, { list: action.annotations.map(a => Annotation.setDefaults(a)) });

  case UPDATE_ANNOTATION:
    return merge({}, state, { list: [
      ...state.list.slice(0, action.id),
      assign({}, state.list[action.id], action.data),
      ...state.list.slice(action.id + 1)
    ] });

  case DELETE_ANNOTATION:
    return assign({}, state, { list: [
      ...state.list.slice(0, action.id),
      ...state.list.slice(action.id + 1)
    ] });

  case CREATE_ANNOTATION:
    return merge({}, state, { list: [...state.list, Annotation.defaults()] });

  case MOVE_ANNOTATION:
    let annotations = cloneDeep(state.list);
    annotations.splice(action.toIndex, 0, annotations.splice(action.fromIndex, 1)[0]);
    return merge({}, state, { list: annotations });

  case TOGGLE_ANNOTATIONS:
    let visible = typeof action.value == "undefined" ? !state.visible : action.value;
    return merge({}, state, { visible });

  default:
    return state;
  }
};