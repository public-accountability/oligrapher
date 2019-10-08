export default {
  // Core graph components
  // See app/models for the schema of each component
  graph: {
    nodes: {},
    edges: {},
    captions: {},
    annotations: [],
    zoom: 1,
    center: [0, 0]
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
    // attributes.settings are optional checkboxes that
    // will be displayed in editor mode. It is used by LittleSis.org
    // to create additional buttons that set various map privacy settings.
    settings:{}
  },

  // Display information for individual nodes and edges
  // are on the `.display` attribute of those objects.
  // This section of the state is not sync'd with the server;
  // it mostly used internally to implement the editor UI.
  // Many actions trigger a reconfiguration of these meneus
  display: {
    zoom: 1,
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
    components: {
      header: null,
      map: null,
      annotations: null,
      editor: null,
      modeToggle: null,
      nodeMenu: null,
      popup: null,
      settings: null
    }
  },

  // Global settings
  // Unlike attributes and display settings, there are no actions available
  // to change these.
  // They are designed to be set once when the Oligrapher object
  // is initialized.
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
