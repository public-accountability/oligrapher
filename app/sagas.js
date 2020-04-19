import { put, select, call, takeEvery, all } from 'redux-saga/effects'
import { isLittleSisId } from './util/helpers'
import { getEdges } from './datasources/littlesis3'

// When a node is added from LittleSis this saga automatically fetches edges 
// for that node from LittleSis and adds them to graph
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

export function* addNode(action) {
  const automaticallyAddEdges = yield select(state => state.settings.automaticallyAddEdges)
  const allNodeIds = yield select(state => Object.keys(state.graph.nodes))

  if (automaticallyAddEdges && isLittleSisId(action.node.id) && allNodeIds.length > 1) {
    yield call(addEdges, action.node.id, allNodeIds)
  }
}

export function* watchAddNode() {
  yield takeEvery('ADD_NODE', addNode)
}

export default function* rootSaga() {
  yield all([
    watchAddNode()
  ])
}