import { ZOOM_IN, ZOOM_OUT, RESET_ZOOM, SHOW_GRAPH } from '../actions';

export default function zoom(state = 1, action) {
  switch (action.type) {

  case ZOOM_IN:
  case ZOOM_OUT:
    return state * action.factor;

  case RESET_ZOOM:
  case SHOW_GRAPH:
    return 1;

  default:
    return state;
  }
};