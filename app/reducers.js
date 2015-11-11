import { combineReducers } from 'redux';
import graphs from './reducers/graphs';
import position from './reducers/position';
import selection from './reducers/selection';
import zoom from './reducers/zoom';

export default combineReducers({
  graphs,
  position,
  selection,
  zoom
});