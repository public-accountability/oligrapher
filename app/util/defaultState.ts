import { Graph, Viewbox } from "../graph/graph"
import { Annotation } from "./annotations"
import type { LsMap, LsNode, LsEdge } from "../datasources/littlesis"

export interface GraphState extends Graph {
  present: Graph
  past: Graph[]
  future: Graph[]
}

export interface User {
  id: number
  name: string
  url: string
}

export interface Editor {
  name: string
  url: string
  id: number
  pending: boolean
}

export interface Lock {
  locked: boolean
  user_id: number | null
}

export interface UserSettings {
  private: boolean
  clone: boolean
  list_sources: boolean
  defaultStoryMode: boolean
  defaultExploreMode: boolean
  allowPanning: boolean
  edgeDraggingWhenPresenting: boolean
  nodeDraggingWhenPresenting: boolean
  storyModeOnly: boolean
  exploreModeOnly: boolean
  automaticallyAddEdges: boolean
  scrollToZoom: boolean
  useClassicAddConnections: boolean
  debug: boolean
  showControlpoint: boolean
}

export interface AttributesState {
  id: number | null
  title: string | null
  subtitle: string | null
  created_date: string | null
  modified_date: string | null
  version: number | null
  user: User | null
  owner: User | null
  settings: UserSettings
  editors: Editor[]
  shareUrl: string | null
}

export type FloatingEditorTypeType = "node" | "connections" | "edge" | "caption"

export type FloatingEditorType = {
  type: FloatingEditorTypeType | null
  id: string | null
}

export type AsyncStatus = "REQUESTED" | "SUCCESS" | "FAILED" | null

export type SelectionType = "node" | "edge" | "caption"

export type SvgSizeType = { width: number; height: number }

export interface Selection {
  node: string[]
  edge: string[]
  caption: string[]
  isSelecting: boolean
}

export interface AnnotationsState {
  list: Annotation[]
  currentIndex: number
  sources: Annotation | null
  isHighlighting: boolean
}

export type DisplayModesState = { editor: boolean; story: boolean }

export type InterlocksState = {
  status: AsyncStatus
  selectedNodes: string[] | null
  previousNodes: string[] | null
  nodes: LsNode[] | null
  edges: LsEdge[] | null
}

export interface DisplayState {
  zoom: number // transform = `scale(${zoom})`
  viewBox: Viewbox
  svgScale: number
  svgHeight: number // Height of SVG element
  showHeader: boolean
  showZoomControl: boolean
  headerIsCollapsed: boolean
  modes: DisplayModesState
  floatingEditor: FloatingEditorType
  draggedNode: string | null
  dragMultiple: boolean | null
  overNode: string | null
  overCaption: string | null
  tool: "node" | "text" | "organize" | "settings" | "editors" | "help" | null
  openCaption: string | null
  saveMapStatus: AsyncStatus
  cloneMapStatus: AsyncStatus
  deleteMapStatus: AsyncStatus
  userMessage: string | null
  selection: Selection
  lock: Lock
  interlocks: InterlocksState
}

export interface SettingsState {
  domId: string
  embed: boolean
  noEditing: boolean
  logActions: boolean
  bugReportUrl: string | null
  helpUrl: string | null
  startInEditMode: boolean
}

export interface StateWithoutHistory {
  graph: Graph
  annotations: AnnotationsState
  attributes: AttributesState
  display: DisplayState
  settings: SettingsState
  lastSavedData: LsMap | null
}

type StateHistory = {
  past: Graph[]
  future: Graph[]
}

export interface State extends StateWithoutHistory {
  history: StateHistory
}

const defaultState: State = {
  // Core graph components
  // See app/models for the schema of each component
  graph: {
    nodes: {},
    edges: {},
    captions: {},
  },

  annotations: {
    list: [],
    currentIndex: 0,
    sources: null,
    isHighlighting: false,
  },

  // Graph attributes and metadata
  // Stored in NetworkMap in Rails
  // Some attributes are editable in the graph header
  attributes: {
    id: null,
    title: null,
    subtitle: null,
    created_date: null,
    modified_date: null,
    version: 3,
    user: null,
    owner: null,
    settings: {
      private: false,
      clone: true,
      list_sources: false,
      defaultStoryMode: true,
      defaultExploreMode: false,
      allowPanning: true,
      edgeDraggingWhenPresenting: false,
      nodeDraggingWhenPresenting: false,
      storyModeOnly: false,
      exploreModeOnly: false,
      automaticallyAddEdges: true,
      scrollToZoom: false,
      useClassicAddConnections: false,
      debug: false,
      showControlpoint: false,
    },
    editors: [],
    shareUrl: null,
  },

  // This section of the state is not sync'd with the server;
  // it mostly used internally to implement the editor UI.
  // Many actions trigger a reconfiguration of these menus
  display: {
    zoom: 1,
    viewBox: { minX: 0, minY: 0, h: 1200, w: 800 },
    svgScale: 1,
    svgHeight: 400,
    showHeader: true,
    showZoomControl: true,
    headerIsCollapsed: false,
    modes: {
      editor: false,
      story: false,
    },
    floatingEditor: {
      type: null,
      id: null,
    },
    draggedNode: null,
    dragMultiple: null,
    overNode: null,
    overCaption: null,
    tool: null,
    openCaption: null,
    saveMapStatus: null,
    cloneMapStatus: null,
    deleteMapStatus: null,
    userMessage: null,
    selection: {
      node: [],
      edge: [],
      caption: [],
      isSelecting: false,
    },
    // Sync'd with OligrapherLockService using action cable
    lock: {
      locked: false,
      user_id: null,
    },

    interlocks: {
      status: null,
      selectedNodes: null,
      nodes: null,
      edges: null,
    },
  },

  // Global settings
  // These settings are NOT changable via the settings interface
  // those are located at above under attributes.settings
  settings: {
    domId: "oligrapher",
    embed: false,
    noEditing: false,
    logActions: false,
    bugReportUrl: "https://littlesis.org/bug_report",
    helpUrl: "https://littlesis.org/help/oligrapher",
    startInEditMode: false,
  },

  // for Undo/Redo
  history: {
    past: [],
    future: [],
  },

  lastSavedData: null,
}

export default Object.freeze(defaultState)
