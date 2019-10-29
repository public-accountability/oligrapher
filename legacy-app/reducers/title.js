import { SET_TITLE } from '../actions';

export default function title(state = null, action) {
  switch (action.type) {

  case SET_TITLE:
    return action.title;

  default:
    return state;
  }
};