import { SET_SETTINGS } from '../actions';
import merge from 'lodash/merge';

export default function title(state = {}, action) {
  switch (action.type) {

  case SET_SETTINGS:
    return merge({}, state, action.settings);

  default:
    return state;
  }
};
