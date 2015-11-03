import { SHOW_GRAPH, LOAD_GRAPH } from '../actions';

export default function position(state = { prevId: null, currentId: null }, action) {
  switch (action.type) {
  case LOAD_GRAPH:
  case SHOW_GRAPH:
    return { prevId: state.currentId, currentId: action.id };
  default:
    // anything other than SHOW_GRAPH should clear the prevId 
    // (so that e.g. transition animation doesn't fire from a zoom click)
    return { currentId: state.currentId, prevId: null };
  }
};