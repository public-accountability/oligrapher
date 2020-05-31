import { put, select as sagaSelect, call, takeEvery, all } from 'redux-saga/effects'
import cloneDeep from 'lodash/cloneDeep'

import { isLittleSisId, convertSelectorForUndo } from './util/helpers'
import { oligrapher, editors, getEdges, getInterlocks } from './datasources/littlesis3'
import { applyZoomToViewBox, computeSvgZoom, computeSvgOffset } from './util/dimensions'
import { paramsForSaveSelector } from './util/selectors'
import { forceLayout } from './graph/graph'
import { Selector } from './util/selectors'

// redux-undo places present state at state.present, so we use our own
// select() to "transparently" make this change to all our saga selectors
const select = (selector: Selector) => sagaSelect(convertSelectorForUndo(selector))

const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time))
const RESET_DELAY = process.env.NODE_ENV === 'test' ? 10 : 5000

export default function* rootSaga() {
  yield all([
    watchAddNode(),
    watchZoom(),
    watchSave(),
    watchClone(),
    watchDelete(),
    watchForceLayout(),
    watchAddEditor(),
    watchRemoveEditor(),
    watchInterlocks()
  ])
} 

export function* watchAddNode() {
  yield takeEvery('ADD_NODE', addNode)
}

export function* watchZoom() {
  yield takeEvery(['ZOOM_IN', 'ZOOM_OUT', 'SET_SVG_SIZE'], setActualZoom)
}

export function* watchSave() {
  yield takeEvery(['SAVE_REQUESTED'], save)
}

export function* watchClone() {
  yield takeEvery(['CLONE_REQUESTED'], clone)
}

export function* watchDelete() {
  yield takeEvery(['DELETE_REQUESTED'], deleteMap)
}

export function* watchForceLayout() {
  yield takeEvery(['FORCE_LAYOUT_REQUESTED'], generateForceLayout)  
}

export function* watchAddEditor() {
  yield takeEvery(['ADD_EDITOR_REQUESTED'], addEditor)  
}

export function* watchRemoveEditor() {
  yield takeEvery(['REMOVE_EDITOR_REQUESTED'], removeEditor)  
}

export function* watchInterlocks() {
  yield takeEvery(['INTERLOCKS_REQUESTED'], interlocks)  
}

// Automatically fetches edges when a node is added from LittleSis
export function* addNode(action: any) {
  const { automaticallyAddEdges } = yield select(state => state.attributes.settings)
  const allNodeIds = yield select(state => Object.keys(state.graph.nodes))

  if (automaticallyAddEdges && isLittleSisId(action.node.id) && allNodeIds.length > 1) {
    yield call(addEdges, action.node.id, allNodeIds)
  }
}

// Fetch edges for a LittleSis node and add them to graph
export function* addEdges(newNodeId: string, allNodeIds: string[]) {
  try {
    const results = yield call(getEdges, newNodeId, allNodeIds)

    if (results.length > 0) {
      yield put({ type: 'ADD_EDGES', edges: results })
    }
  } catch(err) {
    console.error("Couldn't get edges for new node:", err)
  }
}

// Calculate actual zoom = user-set zoom (zoom) x automatic svg zoom.
// Triggered by initial render, user zoom changes, and svg resize.
export function* setActualZoom() {
  const { viewBox, zoom, svgSize } = yield select(state => state.display)
  const zoomedViewBox = yield call(applyZoomToViewBox, viewBox, zoom)
  const svgZoom = yield call(computeSvgZoom, zoomedViewBox, svgSize)
  const svgOffset = yield call(computeSvgOffset, zoomedViewBox)
  yield put({ type: 'SET_SVG_ZOOM', svgZoom })
  yield put({ type: 'SET_SVG_OFFSET', svgOffset })
  yield put({ type: 'SET_ACTUAL_ZOOM', actualZoom: zoom * svgZoom })
}

// Attempt to save map
export function* save() {
  const params = yield select(paramsForSaveSelector)
  const { id } = params
  const requestType = id ? 'update' : 'create'

  try {
    const results = yield call(oligrapher[requestType], params)
    yield put({ type: 'SAVE_SUCCESS' })

    if (!id) {
      yield call(delay, 500)
      window.location.replace(results.redirect_url)
    }
  } catch(error) {
    yield put({ type: 'SAVE_FAILED' })
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: 'SAVE_RESET' })
}

// Attempt to clone map
export function* clone() {
  const id = yield select(state => state.attributes.id)

  try {
    const results = yield call(oligrapher.clone, Number(id))
    yield put({ type: 'CLONE_SUCCESS' })
    window.open(results.redirect_url, '_blank')
  } catch(error) {
    yield put({ type: 'CLONE_FAILED' })
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: 'CLONE_RESET' })
}

// Attempt to delete map
export function* deleteMap() {
  const id = yield select(state => state.attributes.id)

  try {
    const results = yield call(oligrapher.delete, Number(id))
    yield put({ type: 'DELETE_SUCCESS' })
    window.location.replace(results.redirect_url)
  } catch(error) {
    yield put({ type: 'DELETE_FAILED' })
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: 'DELETE_RESET' })
}

export function* generateForceLayout() {
  const graph = yield select(state => state.graph.present)
  yield call(delay, 50)
  const newGraph = yield call(forceLayout, cloneDeep(graph))
  yield put({ type: 'APPLY_FORCE_LAYOUT', graph: newGraph })
}

export function* addEditor(action: any) {
  const { username } = action
  const id = yield select(state => state.attributes.id)
  
  try {
    const results = yield call(editors.add, id, username)
    yield put({ type: 'ADD_EDITOR_SUCCESS', editors: results.editors })
  } catch(error) {
    yield put({ type: 'ADD_EDITOR_FAILED' })    
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: 'ADD_EDITOR_RESET' })
}

export function* removeEditor(action: any) {
  const { username } = action
  const id = yield select(state => state.attributes.id)
  
  try {
    const results = yield call(editors.remove, id, username)
    yield put({ type: 'REMOVE_EDITOR_SUCCESS', editors: results.editors })
  } catch(error) {
    yield put({ type: 'REMOVE_EDITOR_FAILED' })    
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: 'REMOVE_EDITOR_RESET' })
}

export function* interlocks(action: any): any {
  const [node1Id, node2Id] = yield select(state => state.display.selection.node)
  const nodeIds = yield select(state => Object.keys(state.graph.nodes).filter(isLittleSisId))

  try {
    const { nodes, edges } = yield call(getInterlocks, node1Id, node2Id, nodeIds)
    yield put({ type: 'INTERLOCKS_SUCCESS', node1Id, node2Id, nodes, edges })
  } catch(error) {
    console.log(error)
    yield put({ type: 'INTERLOCKS_FAILED' })
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: 'INTERLOCKS_RESET' })
}