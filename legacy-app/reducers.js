import { combineReducers } from 'redux';
import graph from './reducers/undoable-graph';
import selection from './reducers/selection';
import zoom from './reducers/zoom';
import editTools from './reducers/editTools';
import title from './reducers/title';
import annotations from './reducers/annotations';
import settings from './reducers/settings';
import showHelpScreen from './reducers/showHelpScreen';
import showSettings from './reducers/showSettings';

export default combineReducers({
  graph,
  selection,
  zoom,
  editTools,
  title,
  annotations,
  settings,
  showHelpScreen,
  showSettings
});