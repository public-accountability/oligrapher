import merge from 'lodash/merge'
import defaultState from './defaultState.js'





// const blankGraph = {
//   id: null,
//   nodes: {},
//   edges: {},
//   captions: {}
// }

// const defaultAttributes = {
//   "title": "",
//   "subtitle": "",
//   "date": null,
//   "links": [],
//   "user": {
//     "name": null,
//     "url": null
//   },
//   "settings": {
//     "private": false,
//     "cloneable": true
//   }
// }

// const defaultHooks = {
//   "onSave": function(data) {
//     console.error("No onSave hook defined")
//   },
//   "onNav": function(index) {}
// }

// const defaultDisplay = {
//   "draggableNodes": true,
//   "draggableEdges": true
// }

// const defaults = {
//   "mode": "view",
//   "dataSource": "littlesis",
//   "domId": "oligrapher",
//   "hooks": defaultHooks,
//   "attributes": defaultAttributes,
//   "display": defaultDisplay,
//   "annotations": [],
//   "graph": blankGraph
// }


// const validateMode = mode => {
//   const modes = ['view', 'edit', 'embedded']

//   if (!modes.includes(mode)) {
//     throw new Error(`invalid mode: ${mode}`)
//   }
// }


/*
  This function takes a configuration object provided by the user,
  merges it with the default value and validates it.

  Right now there is only one simple validation function,
  but it would be nice to do validation for other elements.

  This configuration becomes the initial redux store state.
*/
export default function(userConfig) {
  let configuration = merge({}, defaultState, userConfig)
  return configuration
}
