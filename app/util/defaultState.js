const defaultState = {
  // Core graph components
  // See app/models for the schema of each component
  graph: {
    nodes: {},
    edges: {},
    captions: {}
  },

  // Graph attributes and metadata
  // Some attributes are editable in the graph header.
  attributes: {
    id: null,
    title: null,
    subtitle: null,
    date: null,
    oligrapher_version: 3,
    user: {
      name: null,
      url: null
    },
    // These are rendered in the Header Menu
    links: [],
    // will be displayed in editor mode. It is used by LittleSis.org
    // to create additional buttons that set various map privacy settings.
    settings:{
      "private": false,
      clone: true,
      defaultStoryMode: false,
      defaultExploreMode: true,
      storyModeOnly: false,
      exploreModeOnly: false
    },
    editors: [],
    lock: { locked: false }
  },

  // This section of the state is not sync'd with the server;
  // it mostly used internally to implement the editor UI.
  // Many actions trigger a reconfiguration of these menus
  display: {
    zoom: 1,
    actualZoom: 1,
    modes: {
      editor: false,
      story: false
    },
    selectedNodes: new Set(),
    floatingMenu: {
      type: null, // node, connections, edge, caption, connections, settings
      id: null
    },
    editor: {
      tool: null // node, edge, caption, settings
    },
    saveMap: null // states: null, 'IN_PROGRESS', 'SUCCESS', 'FAILED'
  },

  // Global settings
  // These settings are NOT changable via the settings interface;
  // those are located at above under attributes.settings
  settings: {
    dataSource: 'littlesis',
    debug: false,
    domId: 'oligrapher',
    embedded: false,
    editable: true,
    saveable: true,
    storyable: true,
    draggableNodes: true,
    draggableEdges: true
  }

  // Hooks available to trigger code external to Oligrapher.
  // `onSave` is used by LittleSis.org to sync the graph with the LittleSis server
  // hooks: {
  //   onSave: null, // function(state) { null },
  //   onNav:  null // function(state, index) { null }
  // }
}

export default Object.freeze(defaultState)
