import { call, put } from 'redux-saga/effects'
import { testSaga } from 'redux-saga-test-plan'
import { addNode, addEdges, setActualZoom } from '../app/sagas'
import { getEdges } from '../app/datasources/littlesis3'
import { applyZoomToViewBox, computeSvgZoom, computeSvgOffset } from '../app/util/dimensions'
import { expect } from 'chai'

describe('sagas', function() {
  describe ('addNode saga', function() {
    it('does nothing if automaticallyAddEdges setting is false', function() {
      const iterator = addNode({ type: 'ADD_NODE', node: { id: "1", name: "bob" } })
      const automaticallyAddEdges = false
      const allNodeIds = ["1", "2"]
      iterator.next()
      expect(iterator.next({ automaticallyAddEdges }))
      expect(iterator.next(allNodeIds).done).to.be.true
    })

    it('does nothing if new node is not from LittleSis', function() {
      const iterator = addNode({ type: 'ADD_NODE', node: { id: "abc", name: "bob" } })
      const automaticallyAddEdges = true
      const allNodeIds = ["1", "2"]
      iterator.next()
      expect(iterator.next({ automaticallyAddEdges }))
      expect(iterator.next(allNodeIds).done).to.be.true
    })

    it("does nothing if there aren't multiple nodes", function() {
      const iterator = addNode({ type: 'ADD_NODE', node: { id: "1", name: "bob" } })
      const automaticallyAddEdges = true
      const allNodeIds = ["1"]
      iterator.next()
      iterator.next({ automaticallyAddEdges })
      expect(iterator.next(allNodeIds).done).to.be.true
    })

    it('calls addEdges saga with node id', function() {
      const iterator = addNode({ type: 'ADD_NODE', node: { id: "1", name: "bob" } })
      const automaticallyAddEdges = true
      const allNodeIds = ["1", "2"]
      iterator.next()
      iterator.next({ automaticallyAddEdges })
      expect(iterator.next(allNodeIds).value).to.eql(call(addEdges, "1", allNodeIds))
    })
  })

  describe('addEdges saga', function() {
    it('fetches edges from LittleSis', function() {
      const iterator = addEdges("1", ["1", "2"])
      expect(iterator.next().value).to.eql(call(getEdges, "1", ["1", "2"]))
    })

    it('dispatches ADD_EDGES if edges are found', function() {
      const iterator = addEdges("1", ["1", "2"])
      const edges = [{ id: "101" }, { id: "102" }]
      iterator.next()
      expect(iterator.next(edges).value).to.eql(put({ type: 'ADD_EDGES', edges }))
    })

    it("doesn't dispatch ADD_EDGES if no edges are found", function() {
      const iterator = addEdges("1", ["1", "2"])
      const edges = []
      iterator.next()
      expect(iterator.next(edges).done).to.be.true
    })
  })

  describe('setActualZoom saga', function() {
    it('computes actual zoom using viewBox, zoom, and svgSize from state', function() {
      const saga = testSaga(setActualZoom)
      const viewBox = { minX: -500, minY: -500, w: 1000, h: 1000 }
      const zoom = 1
      const svgSize = { width: 2000, height: 2000 }

      // provide saga with selections from state and check that it applies zoom to viewbox
      saga.next().next({ viewBox, zoom, svgSize }).call(applyZoomToViewBox, viewBox, zoom)

      // provide saga with new viewbox and check that it computes svg zoom
      saga.next(viewBox).call(computeSvgZoom, viewBox, svgSize)

      // provide saga with svg zoom  and check that it computes svg offset
      saga.next(2).call(computeSvgOffset, viewBox)

      // provide saga with svg offset and check that it sets svg zoom
      saga.next({ x: 0, y: 0 }).put({ type: 'SET_SVG_ZOOM', svgZoom: 2 })

      // check that it sets svg offset
      saga.next().put({ type: 'SET_SVG_OFFSET', svgOffset: { x: 0, y: 0 } })

      // check that it sets actual zoom
      saga.next().put({ type: 'SET_ACTUAL_ZOOM', actualZoom: 2 })

      // all done
      saga.next().isDone()
    })
  })
})
