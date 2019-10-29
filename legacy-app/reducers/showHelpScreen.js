import { TOGGLE_HELP_SCREEN } from '../actions';

export default function showHelpScreen(state = false, action) {
  switch (action.type) {

  case TOGGLE_HELP_SCREEN:
    return typeof action.value == "undefined" ? !state : action.value;

  default:
    return state;
  }
};