import { put, select, call, takeEvery, all } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import cloneDeep from 'lodash/cloneDeep'

import { isLittleSisId  } from './util/helpers'
import { oligrapher, addEditor, removeEditor, getEdges, getInterlocks, takeoverLock, releaseLock } from './datasources/littlesis3'
import { applyZoomToViewBox, computeSvgZoom, computeSvgOffset } from './util/dimensions'
import { paramsForSaveSelector } from './util/selectors'
import { forceLayout, calculateViewBoxFromGraph } from './graph/graph'
import { findIntersectingNodeFromDrag } from './graph/node'
import { newEdgeFromNodes } from './graph/edge'
// import { Selector } from './util/selectors'
import { getGraphMarkup, downloadRasteredSvg, padViewbox } from './util/imageExport'

// redux-undo places present state at state.present, so we use our own
// select() to "transparently" make this change to all our saga selectors
//const select = (selector: Selector<any>) => sagaSelect(convertSelectorForUndo(selector))

const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time))
const RESET_DELAY = process.env.NODE_ENV === 'test' ? 10 : 5000

export default function* rootSaga() {
  yield all([
    // watchSvgHeight(),
    // watchZoom(),
    watchAddNode(),
    watchSave(),
    watchClone(),
    watchDelete(),
    watchForceLayout(),
    watchAddEditor(),
    watchRemoveEditor(),
    watchInterlocks(),
    watchExportImage(),
    watchEditMode(),
    watchLockTakeover(),
    watchLockRelease(),
    // watchGraphChanges()
    // watchReleaseNode()
  ])
}

// export function* watchSvgHeight() {
//   yield takeEvery(['SET_SVG_TOP', 'SET_SVG_BOTTOM'], setSvgHeight)
// }

// export function* watchZoom() {
//   yield takeEvery(['ZOOM_IN', 'ZOOM_OUT', 'SET_ZOOM', 'SET_SVG_HEIGHT', 'SET_SVG_WIDTH', 'RESET_VIEW'], setActualZoom)
// }

export function* watchAddNode() {
  yield takeEvery('ADD_NODE', addNode)
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
  yield takeEvery(['ADD_EDITOR_REQUESTED'], doAddEditor)
}

export function* watchRemoveEditor() {
  yield takeEvery(['REMOVE_EDITOR_REQUESTED'], doRemoveEditor)
}

export function* watchInterlocks() {
  yield takeEvery(['INTERLOCKS_REQUESTED'], interlocks)
}

export function* watchEditMode() {
  yield takeEvery(['SET_EDITOR_MODE'], calculateViewBox)
}

export function* watchLockTakeover() {
  yield takeEvery(['LOCK_TAKEOVER_REQUESTED'], doTakeoverLock)
}

export function* watchLockRelease() {
  yield takeEvery(['LOCK_RELEASE_REQUESTED'], doReleaseLock)
}

export function* watchExportImage() {
  yield takeEvery(['EXPORT_IMAGE_REQUESTED'], exportImage)
}

// export function* watchReleaseNode() {
//   yield takeEvery(['RELEASE_NODE'], moveNodeOrCreateEdge)
// }

// export function* setSvgHeight(action: any): SagaIterator {
//   const { svgTop, svgBottom, svgWidth } = yield select(state => state.display)
//   const height = (svgBottom || window.innerHeight) - svgTop
//   yield put({ type: 'SET_SVG_HEIGHT', height })
// }

// Calculate actual zoom = user-set zoom (zoom) x automatic svg zoom.
// Triggered by initial render, user zoom changes, and svg resize.
// export function* setActualZoom(): SagaIterator {
//   const { viewBox, zoom, svgSize } = yield select(state => state.display)
//   const zoomedViewBox = yield call(applyZoomToViewBox, viewBox, zoom)
//   const svgZoom = yield call(computeSvgZoom, zoomedViewBox, svgSize)
//   const svgOffset = yield call(computeSvgOffset, zoomedViewBox)
//   yield put({ type: 'SET_SVG_ZOOM', svgZoom })
//   yield put({ type: 'SET_SVG_OFFSET', svgOffset })
//   yield put({ type: 'SET_ACTUAL_ZOOM', actualZoom: zoom * svgZoom })
// }

// automatically fetches edges when a node is added from LittleSis
export function* addNode(action: any): SagaIterator {
  const { automaticallyAddEdges } = yield select(state => state.attributes.settings)
  const allNodeIds = yield select(state => Object.keys(state.graph.nodes))

  if (automaticallyAddEdges && isLittleSisId(action.node.id) && allNodeIds.length > 1) {
    yield call(addEdges, action.node.id, allNodeIds)
  }
}

// Fetch edges for a LittleSis node and add them to graph
export function* addEdges(newNodeId: string, allNodeIds: string[]): SagaIterator {
  try {
    const results = yield call(getEdges, newNodeId, allNodeIds)

    if (results.length > 0) {
      yield put({ type: 'ADD_EDGES', edges: results })
    }
  } catch(err) {
    console.error("Couldn't get edges for new node:", err)
  }
}

// Save map
export function* save(): SagaIterator {
  const params = yield select(paramsForSaveSelector)
  const { id } = params
  const requestType = id ? 'update' : 'create'

  try {
    const results = yield call(oligrapher[requestType], params)
    yield put({ type: 'SAVE_SUCCESS' })

    if (requestType === 'create') {
      yield call(delay, 500)
      window.location.replace(results.redirect_url)
    } else {
      yield put({ type: 'SET_SAVED_DATA', data: params })
    }
  } catch(error) {
    yield put({ type: 'SAVE_FAILED' })
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: 'SAVE_RESET' })
}

// Attempt to clone map
export function* clone(): SagaIterator {
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
export function* deleteMap(): SagaIterator {
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

export function* generateForceLayout(): SagaIterator {
  const graph = yield select(state => state.graph.present)
  yield call(delay, 50)
  const newGraph = yield call(forceLayout, cloneDeep(graph))
  yield put({ type: 'APPLY_FORCE_LAYOUT', graph: newGraph })
}

export function* doAddEditor(action: any): SagaIterator {
  const { username } = action
  const id = yield select(state => state.attributes.id)

  try {
    const results = yield call(addEditor, id, username)
    yield put({ type: 'ADD_EDITOR_SUCCESS', editors: results.editors })
  } catch(error) {
    yield put({ type: 'ADD_EDITOR_FAILED' })
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: 'ADD_EDITOR_RESET' })
}

export function* doRemoveEditor(action: any): SagaIterator {
  const { username } = action
  const id = yield select(state => state.attributes.id)

  try {
    const results = yield call(removeEditor, id, username)
    yield put({ type: 'REMOVE_EDITOR_SUCCESS', editors: results.editors })
  } catch(error) {
    yield put({ type: 'REMOVE_EDITOR_FAILED' })
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: 'REMOVE_EDITOR_RESET' })
}

export function* interlocks(action: any): SagaIterator {
  const [node1Id, node2Id] = yield select(state => state.display.selection.node)
  const nodeIds = yield select(state => Object.keys(state.graph.nodes).filter(isLittleSisId))

  try {
    const { nodes, edges } = yield call(getInterlocks, node1Id, node2Id, nodeIds)
    yield put({ type: 'INTERLOCKS_SUCCESS', node1Id, node2Id, nodes, edges })
  } catch(error) {
    yield put({ type: 'INTERLOCKS_FAILED' })
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: 'INTERLOCKS_RESET' })
}

export function* calculateViewBox(action: any): SagaIterator {
  // recalculate only if switching out of editor mode
  if (action.enabled === false) {
    const graph = yield select(state => state.graph)
    const viewBox = calculateViewBoxFromGraph(graph)
    yield put({ type: 'SET_VIEWBOX', viewBox })
  }
}

export function* doTakeoverLock(action: any): SagaIterator {
  const id = yield select(state => state.attributes.id)

  try {
    const lock = yield call(takeoverLock, id)

    if (!lock.user_has_lock) {
      throw 'Unexpected lock takeover response'
    }

    // if we fire this action, the RefreshModal will appear superfluously
    // yield put({ type: 'LOCK_TAKEOVER_SUCCESS', lock })
    window.location.reload()
  } catch(error) {
    yield put({ type: 'LOCK_TAKEOVER_FAILED' })
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: 'LOCK_TAKEOVER_RESET' })
}

export function* doReleaseLock(action: any): SagaIterator {
  const id = yield select(state => state.attributes.id)

  try {
    const lock = yield call(releaseLock, id)

    if (!lock.lock_released) {
      throw 'Unexpected lock release response'
    }

    yield put({ type: 'LOCK_RELEASE_SUCCESS'})
    yield put({ type: 'SET_EDITOR_MODE', enabled: false })
  } catch(error) {
    yield put({ type: 'LOCK_RELEASE_FAILED' })
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: 'LOCK_RELEASE_RESET' })
}

export function* exportImage(action: any): SagaIterator {
  const title = yield select(state => state.attributes.title)
  const viewbox = yield select(state => state.display.viewBox)
  const paddedViewbox = padViewbox(viewbox)

  try {
    yield downloadRasteredSvg(
      getGraphMarkup(paddedViewbox),
      title,
      paddedViewbox.w * 2,
      paddedViewbox.h * 2
    )

    yield put({ type: 'EXPORT_IMAGE_SUCCESS' })
  } catch (error) {
    yield put({ type: 'EXPORT_IMAGE_FAILED', error })
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: 'EXPORT_IMAGE_RESET' })
}

// this logic is in a saga and not part of graphReducer because
// we need edge creation to be triggered by a new action in order
// for displayReducer to open the edge editor
// export function* moveNodeOrCreateEdge(action: any): SagaIterator {
//   const nodes = yield select(state => state.graph.nodes)
//   const draggedNode = nodes[action.id]
//   const draggedOverNode = findIntersectingNodeFromDrag(
//     Object.values(nodes),
//     draggedNode,
//     action.deltas
//   )

//   if (draggedOverNode) {
//     const edge = newEdgeFromNodes(draggedNode, draggedOverNode)
//     yield put({ type: 'ADD_EDGE', edge, id: action.id })
//   } else {
//     yield put({ type: 'MOVE_NODE', id: action.id, deltas: action.deltas })
//   }
// }
