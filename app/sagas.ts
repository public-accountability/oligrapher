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
} from "./datasources/littlesis3"
import { paramsForSaveSelector } from "./util/selectors"
import { forceLayout } from "./graph/graph"
import { downloadSvg } from "./util/imageExport"

const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time))
const RESET_DELAY = process.env.NODE_ENV === "test" ? 10 : 5000

export default function* rootSaga() {
  yield all([
    takeEvery("ADD_NODE", addNode),
    takeEvery(["SAVE_REQUESTED"], save),
    takeEvery(["CLONE_REQUESTED"], clone),
    takeEvery(["DELETE_REQUESTED"], deleteMap),
    takeEvery(["FORCE_LAYOUT_REQUESTED"], generateForceLayout),
    takeEvery(["ADD_EDITOR_REQUESTED"], doAddEditor),
    takeEvery(["REMOVE_EDITOR_REQUESTED"], doRemoveEditor),
    takeEvery(["INTERLOCKS_REQUESTED"], interlocks),
    takeEvery(["INTERLOCKS_REQUESTED_2"], interlocks2),
    takeLatest("EXPORT_IMAGE_REQUESTED", exportImage),
  ])
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

// Clone map
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

// Delete map
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

export function* interlocks2(): SagaIterator {
  const selectedNodes = yield select(state => state.display.selection.node.filter(isLittleSisId))

  const otherNodes = yield select(state =>
    without(Object.keys(state.graph.nodes).filter(isLittleSisId), selectedNodes)
  )

  try {
    const { nodes, edges } = yield call(getInterlocks2, selectedNodes, otherNodes)
    yield put({ type: "INTERLOCKS_SUCCESS_2", selectedNodes, nodes, edges })
  } catch (error) {
    yield put({ type: "INTERLOCKS_FAILED_2" })
  }

  yield call(delay, RESET_DELAY)
  yield put({ type: "INTERLOCKS_RESET_2" })
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
