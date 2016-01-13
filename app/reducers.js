import { combineReducers } from 'redux';
import graphs from './reducers/graphs';
import position from './reducers/position';
import selection from './reducers/selection';
import zoom from './reducers/zoom';
import editTools from './reducers/editTools';
import title from './reducers/title';
import annotations from './reducers/annotations';
import settings from './reducers/settings';
import showHelpScreen from './reducers/showHelpScreen';
import showSettings from './reducers/showSettings';

export default combineReducers({
  graphs,
  position,
  selection,
  zoom,
  editTools,
  // from annotations
  title,
  annotations,
  settings,
  showHelpScreen,
  showSettings
});