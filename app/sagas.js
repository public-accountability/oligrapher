import { put, select, call, takeEvery, all } from 'redux-saga/effects'
import { isLittleSisId } from './util/helpers'
import { getEdges } from './datasources/littlesis3'
import { applyZoomToViewBox, computeSvgZoom } from './util/dimensions'

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
  const automaticallyAddEdges = yield select(state => state.settings.automaticallyAddEdges)
  const allNodeIds = yield select(state => Object.keys(state.graph.nodes))

  if (automaticallyAddEdges && isLittleSisId(action.node.id) && allNodeIds.length > 1) {
    yield call(addEdges, action.node.id, allNodeIds)
  }
}

// actual zoom = user-set zoom (zoom) x automatic svg zoom
//
// only triggered by initial render, user zoom changes, and svg resize
export function* setActualZoom() {
  const { viewBox, zoom, svgSize } = yield select(state => state.display)
  const zoomedViewBox = applyZoomToViewBox(viewBox, zoom)
  const svgZoom = computeSvgZoom(zoomedViewBox, svgSize)
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
    watchZoom(),
  ])
} 