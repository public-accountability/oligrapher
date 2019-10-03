export default {
  // Core graph components
  // See app/models for the schema of each component
  graph: {
    nodes: {},
    edges: {},
    captions: {},
    annotations: []
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
    links: [],
    // attributes.settings are optional checkboxes that
    // will be displayed in editor mode. It is used by LittleSis.org
    // to create additional buttons that set various map privacy settings.
    settings:{}
  },

  // How the map looks. Display information for individual nodes and edges
  // are on the `.display` attribute of those objects.
  display: {
    zoom: 1,
    story: false,
    embedded: false,
    editor: false,
    highlight: {
      nodes: [],
      edges: [],
      captions: []
    },
    selected: {
      nodes: [],
      edges: [],
      captions: []
    }
  },

  // Menu layout
  // This section of the state is not sync'd with the server;
  // it mostly used internally to implement the editor UI.
  // Many actions trigger a reconfiguration of these meneus
  layout: {
    annotations: null,
    editor: null,
    header: true,
    map: true,
    modeToggle: null,
    nodeMenu: null,
    popup: null,
    settings: null
  },
  // Global settings
  // Unlike attributes and display settings, there are no actions available
  // to change these. They are designed to be set once when the Oligrapher object
  // is initialized.
  settings: {
    dataSource: 'littlesis',
    debug: false,
    domId: 'oligrapher',
    editable: true,
    saveable: true,
    draggableNodes: true,
    draggableEdges: true
  },
  // Hook avaiable to trigger code external to Oligrapher.
  // `onSave` is used by LittleSis.org to sync the graph with the LittleSis server
  hooks: {
    onSave: function(state)  { null },
    onNav:  function(state, index) { null }
  }
}
