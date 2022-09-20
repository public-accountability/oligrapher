import { Point } from './geometry'
import { Graph, Viewbox } from '../graph/graph'
import { Node } from '../graph/node'
import { Annotation } from './annotations'
import { LockState, defaultLockState } from './lock'
import { LsMap } from '../datasources/littlesis3'

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
  url: string,
  id: number,
  pending?: boolean,
}

export interface UserSettings {
  private: boolean,
  clone: boolean,
  list_sources: boolean,
  defaultStoryMode: boolean,
  defaultExploreMode: boolean,
  storyModeOnly: boolean,
  exploreModeOnly: boolean,
  automaticallyAddEdges: boolean,
  scrollToZoom: boolean,
  useClassicAddConnections: boolean
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
  shareUrl: string | null,
  bugReportUrl: string | null,
  helpUrl: string | null
}

export type FloatingEditorType = "node" | "connections" | "edge" | "caption"

export type AsyncStatus = "REQUESTED" | "SUCCESS" | "FAILED" | null

export type SelectionType = "node" | "edge" | "caption"

export type SvgSizeType = { width: number, height: number }

export interface Selection {
  node: string[],
  edge: string[],
  caption: string[],
  isSelecting: boolean
}

export interface AnnotationsState {
  list: Annotation[],
  currentIndex: number,
  sources: Annotation | null,
  isHighlighting: boolean
}

export interface DisplayState {
  zoom: number,
  svgZoom: number,
  actualZoom: number,
  viewBox: Viewbox | null,
  svgTop: number,
  svgBottom: number | null,
  svgSize: SvgSizeType,
  svgOffset: Point,
  offset: Point,
  showHeader: boolean,
  showZoomControl: boolean,
  headerIsCollapsed: boolean,
  modes: { editor: boolean, story: boolean },
  floatingEditor: {
    type: FloatingEditorType | null,
    id: string | null
  },
  draggedNode: String | null,
  overNode: String | null,
  tool: "node" | "text" | "organize" | "settings" | "editors" | "help" | null,
  saveMapStatus: AsyncStatus,
  cloneMapStatus: AsyncStatus,
  deleteMapStatus: AsyncStatus,
  userMessage: string | null,
  selection: Selection
}

export interface SettingsState {
  debug: boolean,
  domId: string,
  embed: boolean,
  noEditing: boolean
}

export interface State {
  graph: Graph,
  annotations: AnnotationsState,
  attributes: AttributesState,
  display: DisplayState,
  settings: SettingsState,
  lastSavedData: LsMap | null
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

  annotations: {
    list: [],
    currentIndex: 0,
    sources: null,
    isHighlighting: false
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
      private: false,
      clone: true,
      list_sources: false,
      defaultStoryMode: true,
      defaultExploreMode: false,
      storyModeOnly: false,
      exploreModeOnly: false,
      automaticallyAddEdges: true,
      scrollToZoom: false,
      useClassicAddConnections: false
    },
    editors: [],
    lock: defaultLockState,
    shareUrl: null,
    bugReportUrl: 'https://littlesis.org/bug_report',
    helpUrl: 'https://littlesis.org/help/oligrapher'
  },

  // This section of the state is not sync'd with the server;
  // it mostly used internally to implement the editor UI.
  // Many actions trigger a reconfiguration of these menus
  display: {
    zoom: 1,
    svgZoom: 1,
    actualZoom: 1,
    viewBox: null,
    svgTop: 0,
    svgBottom: null,
    svgSize: { width: 0, height: 0 },
    svgOffset: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    showHeader: true,
    showZoomControl: true,
    headerIsCollapsed: false,
    modes: {
      editor: false,
      story: false
    },
    floatingEditor: {
      type: null,
      id: null
    },
    draggedNode: null,
    overNode: null,
    tool: null,
    saveMapStatus: null,
    cloneMapStatus: null,
    deleteMapStatus: null,
    userMessage: null,
    selection: {
      node: [],
      edge: [],
      caption: [],
      isSelecting: false
    }
  },

  // Global settings
  // These settings are NOT changable via the settings interface;
  // those are located at above under attributes.settings
  settings: {
    debug: false,
    domId: 'oligrapher',
    embed: false,
    noEditing: false
  },

  lastSavedData: null
}

export default Object.freeze(defaultState)
