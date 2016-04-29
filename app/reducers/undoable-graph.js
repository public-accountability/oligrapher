import graph from "./graph";
import undoable, { excludeAction, distinctState } from 'redux-undo';
import { LOAD_GRAPH, SHOW_GRAPH } from "../actions";

export default undoable(graph, { filter: function filterState(action, currentState, previousState) {
  // only add to history if not initializing graph and state changed
  return ([LOAD_GRAPH, SHOW_GRAPH].indexOf(action.type) === -1) && (currentState !== previousState);
} });