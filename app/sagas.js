import { put, select as sagaSelect, call, takeEvery, all } from 'redux-saga/effects'
import { isLittleSisId, convertSelectorForUndo } from './util/helpers'
import { getEdges } from './datasources/littlesis3'
import { applyZoomToViewBox, computeSvgZoom } from './util/dimensions'

// redux-undo places present state at state.present, so we use our own
// select() to "transparently" make this change to all our saga selectors
const select = selector => sagaSelect(convertSelectorForUndo(selector))

// Fetch edges for a LittleSis node and add them to graph
export function* addEdges(newNodeId, allNodeIds) {
  try {
    const results = yield call(getEdges, newNodeId, allNodeIds)

    if (results.length > 0) {
      yield put({ type: 'ADD_EDGES', edges: results })
    }
  } catch(err) {
    console.error("Couldn't get edges for new node:", err)
  }
}

// Automatically fetches edges when a node is added from LittleSis
export function* addNode(action) {
  const { automaticallyAddEdges } = yield select(state => state.attributes.settings)
  const allNodeIds = yield select(state => Object.keys(state.graph.nodes))

  if (automaticallyAddEdges && isLittleSisId(action.node.id) && allNodeIds.length > 1) {
    yield call(addEdges, action.node.id, allNodeIds)
  }
}

// Calculate actual zoom = user-set zoom (zoom) x automatic svg zoom.
// Triggered by initial render, user zoom changes, and svg resize.
export function* setActualZoom() {
  const { viewBox, zoom, svgSize } = yield select(state => state.display)
  const zoomedViewBox = yield call(applyZoomToViewBox, viewBox, zoom)
  const svgZoom = yield call(computeSvgZoom, zoomedViewBox, svgSize)
  yield put({ type: 'SET_SVG_ZOOM', svgZoom })
  yield put({ type: 'SET_ACTUAL_ZOOM', actualZoom: zoom * svgZoom })
}

export function* watchAddNode() {
  yield takeEvery('ADD_NODE', addNode)
}

export function* watchZoom() {
  yield takeEvery(['ZOOM_IN', 'ZOOM_OUT', 'SET_SVG_SIZE'], setActualZoom)
}

export default function* rootSaga() {
  yield all([
    watchAddNode(),
    watchZoom()
  ])
} 