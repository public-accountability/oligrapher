import { combineReducers } from 'redux';
import graphs from './reducers/graphs';
import position from './reducers/position';
import zoom from './reducers/zoom';

export default combineReducers({
  graphs,
  position,
  zoom
});