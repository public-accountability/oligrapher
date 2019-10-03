import merge from 'lodash/merge'

const blankGraph = {
  id: null,
  nodes: {},
  edges: {},
  captions: {}
}

const defaultAttributes = {
  "title": "",
  "subtitle": "",
  "date": null,
  "links": [],
  "user": {
    "name": null,
    "url": null
  },
  "settings": {
    "private": false,
    "cloneable": true
  }
}

const defaultHooks = {
  "onSave": function(data) {
    console.error("No onSave hook defined")
  },
  "onNav": function(index) {}
}

const defaultDisplay = {
  "draggableNodes": true,
  "draggableEdges": true
}

const defaults = {
  "mode": "view",
  "dataSource": "littlesis",
  "domId": "oligrapher",
  "hooks": defaultHooks,
  "attributes": defaultAttributes,
  "display": defaultDisplay,
  "annotations": [],
  "graph": blankGraph
}


const validateMode = mode => {
  const modes = ['view', 'edit', 'embedded']

  if (!modes.includes(mode)) {
    throw new Error(`invalid mode: ${mode}`)
  }
}


/*
  The job of this function is to take a configuration object
  provided by the user, validate it, and fill in default values
*/
export default function(userConfig) {
  let configuration = merge({}, defaults, userConfig)
  validateMode(configuration.mode)
  return configuration
}
