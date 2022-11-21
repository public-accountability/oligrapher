import { call, put } from "redux-saga/effects"
import { addNode, addEdges } from "../app/sagas"
import { getEdges } from "../app/datasources/littlesis"

describe("sagas", function () {
  describe("addNode saga", function () {
    it("does nothing if automaticallyAddEdges setting is false", function () {
      const iterator = addNode({ type: "ADD_NODE", node: { id: "1", name: "bob" } })
      const automaticallyAddEdges = false
      const allNodeIds = ["1", "2"]
      iterator.next()
      expect(iterator.next({ automaticallyAddEdges }))
      expect(iterator.next(allNodeIds).done).toBe(true)
    })

    it("does nothing if new node is not from LittleSis", function () {
      const iterator = addNode({ type: "ADD_NODE", node: { id: "abc", name: "bob" } })
      const automaticallyAddEdges = true
      const allNodeIds = ["1", "2"]
      iterator.next()
      expect(iterator.next({ automaticallyAddEdges }))
      expect(iterator.next(allNodeIds).done).toBe(true)
    })

    it("does nothing if there aren't multiple nodes", function () {
      const iterator = addNode({ type: "ADD_NODE", node: { id: "1", name: "bob" } })
      const automaticallyAddEdges = true
      const allNodeIds = ["1"]
      iterator.next()
      iterator.next({ automaticallyAddEdges })
      expect(iterator.next(allNodeIds).done).toBe(true)
    })

    it("calls addEdges saga with node id", function () {
      const iterator = addNode({ type: "ADD_NODE", node: { id: "1", name: "bob" } })
      const automaticallyAddEdges = true
      const allNodeIds = ["1", "2"]
      iterator.next()
      iterator.next({ automaticallyAddEdges })
      expect(iterator.next(allNodeIds).value).toEqual(call(addEdges, "1", allNodeIds))
    })
  })

  describe("addEdges saga", function () {
    it("fetches edges from LittleSis", function () {
      const iterator = addEdges("1", ["1", "2"])
      expect(iterator.next().value).toEqual(call(getEdges, "1", ["1", "2"]))
    })

    it("dispatches ADD_EDGES if edges are found", function () {
      const iterator = addEdges("1", ["1", "2"])
      const edges = [{ id: "101" }, { id: "102" }]
      iterator.next()
      expect(iterator.next(edges).value).toEqual(put({ type: "ADD_EDGES", edges }))
    })

    it("doesn't dispatch ADD_EDGES if no edges are found", function () {
      const iterator = addEdges("1", ["1", "2"])
      const edges = []
      iterator.next()
      expect(iterator.next(edges).done).toBe(true)
    })
  })
})
