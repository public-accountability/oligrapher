import { put, select, call, takeEvery, all, takeLatest } from "redux-saga/effects"
import { SagaIterator } from "redux-saga"
import cloneDeep from "lodash/cloneDeep"
import without from "lodash/without"

import { isLittleSisId } from "./util/helpers"
import {
  oligrapher,
  addEditor,
  removeEditor,
  getEdges,
  getInterlocks,
  getInterlocks2,
  takeoverLock,
  releaseLock,
} from "./datasources/littlesis3"
import { paramsForSaveSelector } from "./util/selectors"
import { forceLayout, calculateViewBoxFromGraph } from "./graph/graph"
import { downloadSvg } from "./util/imageExport"

const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time))
const RESET_DELAY = process.env.NODE_ENV === "test" ? 10 : 5000
export const INTERLOCKS_V2 = false

export default function* rootSaga() {
  yield all([
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
  ])
}

export function* watchAddNode() {
  yield takeEvery("ADD_NODE", addNode)
}

export function* watchSave() {
  yield takeEvery(["SAVE_REQUESTED"], save)
}

export function* watchClone() {
  yield takeEvery(["CLONE_REQUESTED"], clone)
}

export function* watchDelete() {
  yield takeEvery(["DELETE_REQUESTED"], deleteMap)
}

export function* watchForceLayout() {
  yield takeEvery(["FORCE_LAYOUT_REQUESTED"], generateForceLayout)
}

export function* watchAddEditor() {
  yield takeEvery(["ADD_EDITOR_REQUESTED"], doAddEditor)
}

export function* watchRemoveEditor() {
  yield takeEvery(["REMOVE_EDITOR_REQUESTED"], doRemoveEditor)
}

export function* watchInterlocks() {
  yield takeEvery(["INTERLOCKS_REQUESTED"], interlocks)
}

export function* watchEditMode() {
  yield takeEvery(["SET_EDITOR_MODE"], calculateViewBox)
}

export function* watchLockTakeover() {
  yield takeEvery(["LOCK_TAKEOVER_REQUESTED"], doTakeoverLock)
}

export function* watchLockRelease() {
  yield takeEvery(["LOCK_RELEASE_REQUESTED"], doReleaseLock)
}

export function* watchExportImage() {
  yield takeLatest("EXPORT_IMAGE_REQUESTED", exportImage)
}

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
      yield put({ type: "ADD_EDGES", edges: results })
    }
  } catch (err) {
    console.error("Couldn't get edges for new node:", err)
  }
}

// Save map
export function* save(): SagaIterator {
  const params = yield select(paramsForSaveSelector)
  const { id } = params
  const requestType = id ? "update" : "create"

  try {
    const results = yield call(oligrapher[requestType], params)
    yield put({ type: "SAVE_SUCCESS" })

    if (requestType === "create") {
      yield call(delay, 500)
      window.location.replace(results.redirect_url)
    } else {
      yield put({ type: "SET_SAVED_DATA", data: params })
    }
  } catch (error) {
    yield put({ type: "SAVE_FAILED" })
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: "SAVE_RESET" })
}

// Attempt to clone map
export function* clone(): SagaIterator {
  const id = yield select(state => state.attributes.id)

  try {
    const results = yield call(oligrapher.clone, Number(id))
    yield put({ type: "CLONE_SUCCESS" })
    window.open(results.redirect_url, "_blank")
  } catch (error) {
    yield put({ type: "CLONE_FAILED" })
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: "CLONE_RESET" })
}

// Attempt to delete map
export function* deleteMap(): SagaIterator {
  const id = yield select(state => state.attributes.id)

  try {
    const results = yield call(oligrapher.delete, Number(id))
    yield put({ type: "DELETE_SUCCESS" })
    window.location.replace(results.redirect_url)
  } catch (error) {
    yield put({ type: "DELETE_FAILED" })
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: "DELETE_RESET" })
}

export function* generateForceLayout(): SagaIterator {
  const graph = yield select(state => state.graph.present)
  yield call(delay, 50)
  const newGraph = yield call(forceLayout, cloneDeep(graph))
  yield put({ type: "APPLY_FORCE_LAYOUT", graph: newGraph })
}

export function* doAddEditor(action: any): SagaIterator {
  const { username } = action
  const id = yield select(state => state.attributes.id)

  try {
    const results = yield call(addEditor, id, username)
    yield put({ type: "ADD_EDITOR_SUCCESS", editors: results.editors })
  } catch (error) {
    yield put({ type: "ADD_EDITOR_FAILED" })
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: "ADD_EDITOR_RESET" })
}

export function* doRemoveEditor(action: any): SagaIterator {
  const { username } = action
  const id = yield select(state => state.attributes.id)

  try {
    const results = yield call(removeEditor, id, username)
    yield put({ type: "REMOVE_EDITOR_SUCCESS", editors: results.editors })
  } catch (error) {
    yield put({ type: "REMOVE_EDITOR_FAILED" })
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: "REMOVE_EDITOR_RESET" })
}

export function* interlocks(action: any): SagaIterator {
  const selectedNodes = yield select(state => state.display.selection.node.filter(isLittleSisId))

  const otherNodes = yield select(state =>
    without(Object.keys(state.graph.nodes).filter(isLittleSisId), selectedNodes)
  )

  try {
    if (INTERLOCKS_V2) {
      const { nodes, edges } = yield call(getInterlocks2, selectedNodes, otherNodes)
      yield put({ type: "INTERLOCKS_SUCCESS_2", selectedNodes, nodes, edges })
    } else {
      const { nodes, edges } = yield call(
        getInterlocks,
        selectedNodes[0],
        selectedNodes[1],
        otherNodes
      )
      yield put({ type: "INTERLOCKS_SUCCESS", selectedNodes, nodes, edges })
    }
  } catch (error) {
    yield put({ type: "INTERLOCKS_FAILED" })
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: "INTERLOCKS_RESET" })
}

export function* calculateViewBox(action: any): SagaIterator {
  // recalculate only if switching out of editor mode
  if (action.enabled === false) {
    const graph = yield select(state => state.graph)
    const viewBox = calculateViewBoxFromGraph(graph)
    yield put({ type: "SET_VIEWBOX", viewBox })
  }
}

export function* doTakeoverLock(action: any): SagaIterator {
  const id = yield select(state => state.attributes.id)

  try {
    const lock = yield call(takeoverLock, id)

    if (!lock.user_has_lock) {
      throw "Unexpected lock takeover response"
    }

    // if we fire this action, the RefreshModal will appear superfluously
    // yield put({ type: 'LOCK_TAKEOVER_SUCCESS', lock })
    window.location.reload()
  } catch (error) {
    yield put({ type: "LOCK_TAKEOVER_FAILED" })
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: "LOCK_TAKEOVER_RESET" })
}

export function* doReleaseLock(action: any): SagaIterator {
  const id = yield select(state => state.attributes.id)

  try {
    const lock = yield call(releaseLock, id)

    if (!lock.lock_released) {
      throw "Unexpected lock release response"
    }

    yield put({ type: "LOCK_RELEASE_SUCCESS" })
    yield put({ type: "SET_EDITOR_MODE", enabled: false })
  } catch (error) {
    yield put({ type: "LOCK_RELEASE_FAILED" })
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: "LOCK_RELEASE_RESET" })
}

export function* exportImage(action: any): SagaIterator {
  const title = yield select(state => state.attributes.title)

  try {
    yield call(downloadSvg, title)
    yield put({ type: "EXPORT_IMAGE_SUCCESS" })
  } catch (error) {
    yield put({ type: "EXPORT_IMAGE_FAILED", error })
  } finally {
    yield call(delay, RESET_DELAY)
    yield put({ type: "EXPORT_IMAGE_RESET" })
  }
}
