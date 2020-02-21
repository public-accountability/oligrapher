export default {
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
    }
  },

  // This section of the state is not sync'd with the server;
  // it mostly used internally to implement the editor UI.
  // Many actions trigger a reconfiguration of these menus
  display: {
    zoom: 1,
    actualZoom: 1,
    highlight: {
      nodes: [],
      edges: [],
      captions: []
    },
    selected: {
      nodes: [],
      edges: [],
      captions: []
    },
    modes: {
      editor: false,
      story: false
    },
    floatingMenu: {
      type: null, // node, connections, edge, caption, connections, settings
      id: null
    },
    editor: {
      tool: null // node, edge, caption, settings
    }
  },

  // {
  //     header: null,
  //     map: null,
  //     annotations: null,
  //     editor: null,
  //     modeToggle: null,
  //     nodeMenu: null,
  //     popup: null,
  //     settings: null
  //   }

  // Global settings
  // These settings are NOT changable via the settings interface
  // those are located at attributes.settings
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
  },

  // Hooks available to trigger code external to Oligrapher.
  // `onSave` is used by LittleSis.org to sync the graph with the LittleSis server
  hooks: {
    onSave: function(state)  { null },
    onNav:  function(state, index) { null }
  }
}
