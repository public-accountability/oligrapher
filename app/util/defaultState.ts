import { Point } from './geometry'
import { Graph, Viewbox } from '../graph/graph'
import { Node } from '../graph/node'

export interface GraphState extends Graph {
  present: Graph
  past: Graph[]
  future: Graph[]
}

export interface User {
  id: number,
  name: string,
  url: string
}

export interface Editor {
  name: string,
  pending?: boolean,
  url: string
}

export interface UserSettings {
  private: boolean,
  clone: boolean,
  defaultStoryMode: boolean,
  defaultExploreMode: boolean,
  storyModeOnly: boolean,
  exploreModeOnly: boolean,
  automaticallyAddEdges: boolean
}

export interface LockState {
  locked: boolean,
  userHasLock: boolean,
  name: string | null
}

export interface AttributesState {
  id: number | null,
  title: string | null,
  subtitle: string | null,
  date: string | null,
  version: number | null,
  user: User | null,
  owner: User | null,
  settings: UserSettings
  editors: Editor[],
  lock: LockState,
  shareUrl: string | null
}

export type FloatingEditorType = "node" | "connections" | "edge" | "caption"

export type AsyncStatus = "REQUESTED" | "SUCCESS" | "FAILED" | null

export interface DisplayState {
  zoom: number,
  svgZoom: number,
  actualZoom: number,
  viewBox: Viewbox | null,
  svgSize: { width: number, height: number },
  svgOffset: Point,
  offset: Point,
  headerIsCollapsed: boolean,
  modes: { editor: boolean },
  floatingEditor: {
    type: FloatingEditorType | null,
    id: string | null
  },
  draggedNode: Node | null,
  tool: "node" | "text" | "organize" | "settings" | "editors" | "help" | null,
  saveMapStatus: AsyncStatus,
  cloneMapStatus: AsyncStatus,
  deleteMapStatus: AsyncStatus,
  userMessage: string | null
}

export interface SettingsState {
  debug: boolean,
  domId: string
}

export interface State {
  graph: Graph,
  attributes: AttributesState,
  display: DisplayState,
  settings: SettingsState
}

export interface StateWithHistory extends State {
  graph: GraphState
}

const defaultState: State = {
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
    version: 3,
    user: null,
    owner: null,
    // will be displayed in editor mode. It is used by LittleSis.org
    // to create additional buttons that set various map privacy settings.
    settings: {
      "private": false,
      clone: true,
      defaultStoryMode: false,
      defaultExploreMode: true,
      storyModeOnly: false,
      exploreModeOnly: false,
      automaticallyAddEdges: true
    },
    editors: [],
    lock: { 
      locked: false, 
      userHasLock: true,
      name: null
    },
    shareUrl: null
  },

  // This section of the state is not sync'd with the server;
  // it mostly used internally to implement the editor UI.
  // Many actions trigger a reconfiguration of these menus
  display: {
    zoom: 1,
    svgZoom: 1,
    actualZoom: 1,
    viewBox: null,
    svgSize: { width: 0, height: 0 },
    svgOffset: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    headerIsCollapsed: false,
    modes: {
      editor: false
    },
    floatingEditor: {
      type: null,
      id: null
    },
    draggedNode: null,
    tool: null,
    saveMapStatus: null,
    cloneMapStatus: null,
    deleteMapStatus: null,
    userMessage: null
  },

  // Global settings
  // These settings are NOT changable via the settings interface;
  // those are located at above under attributes.settings
  settings: {
    debug: false,
    domId: 'oligrapher'
  }
}

export default Object.freeze(defaultState)
