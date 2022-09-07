import curry from 'lodash/curry'
import values from 'lodash/values'
import Graph, {
  calculateCenter,
  GRAPH_PADDING_X,
  GRAPH_PADDING_Y
} from '../../app/graph/graph'
import Node from '../../app/graph/node'
import Edge from '../../app/graph/edge'
import Caption from '../../app/graph/caption'
import { xy, distance } from '../../app/util/geometry'

describe('Graph', function() {
  describe("Helpers", function() {
    test("new()", function() {
      let g = Graph.new()
      expect(g.nodes).toEqual({})
      expect(g.edges).toEqual({})
      expect(Graph.new()).toEqual(Graph.new())
      expect(Graph.new()).not.toBe(Graph.new())
    })
  })

  describe("Getters", function() {
    let n1, n2, n3, n4, graph, e1, e2

    beforeEach(function() {
      n1 = Node.new({ x: -10, y: 30})
      n2 = Node.new({ x: 0, y: -30 })
      n3 = Node.new({ x: 10, y: 0 })
      n4 = Node.new({ x: 0, y: 0 })
      e1 = Edge.newEdgeFromNodes(n1, n2)
      e2 = Edge.newEdgeFromNodes(n2, n3)
      graph = Graph.new()
      Graph.addNodes(graph, [n1, n2, n3, n4])
      Graph.addEdgesIfNodes(graph, [e1, e2])
    })

    test("edgesOf", function() {
      let edgesOf = curry(Graph.edgesOf)(graph)
      expect(edgesOf(n1.id).length).toEqual(1)
      expect(edgesOf(n2.id).length).toEqual(2)
      expect(edgesOf(n3.id).length).toEqual(1)
      expect(edgesOf(n4.id).length).toEqual(0)
    })

    test("nodesOf", function() {
      let nodesOf = curry(Graph.nodesOf)(graph)
      // we don't compare the full nodes because adding edges gives the nodes edgeIds
      expect(nodesOf(e1.id).map(node => node.id)).toEqual([n1.id, n2.id])
      expect(nodesOf(e2.id).map(node => node.id)).toEqual([n2.id, n3.id])
    })
  })

  describe("Stats", function() {
    let nodes, edges, captions

    beforeEach(function() {
      let n1 = Node.new({ x: -10, y: 30 })
      let n2 = Node.new({ x: 0, y: -30 })
      let n3 = Node.new({ x: 10, y: 0 })
      let edge = Edge.newEdgeFromNodes(n1, n2)
      nodes = [n1, n2, n3]
      edges = [edge]
      captions =[]
    })

    test("nodeCount", function() {
      expect(Graph.stats(nodes, edges, captions).nodeCount).toEqual(3)
    })

    test("edgeCount", function() {
      expect(Graph.stats(nodes, edges, captions).edgeCount).toEqual(1)
    })

    test("min and max node XY values", function() {
      let stats = Graph.stats(nodes, edges, captions)
      expect(stats.minNodeX).toEqual(-10)
      expect(stats.minNodeY).toEqual(-30)
      expect(stats.maxNodeX).toEqual(10)
      expect(stats.maxNodeY).toEqual(30)
    })
  })

  describe("Nodes", function() {
    test("addNode() - with values", function() {
      let g = Graph.new()
      let n = Node.new({ x: 1, y: 1 })
      expect(g.nodes).toEqual({})
      Graph.addNode(g, n)
      expect(g.nodes).toEqual({ [n.id]: n })
    })

    test("addNode() - placed at center", function() {
      let g = Graph.new()
      let n = Node.new()
      expect(g.nodes).toEqual({})
      Graph.addNode(g, n, true)
      expect(g.nodes[n.id]).toBeTruthy()
      expect(xy(g.nodes[n.id])).toEqual({ x: 0, y: 0 })
    })

    test("addNode() - placed away from center", function() {
      let g = Graph.new()
      let n1 = Node.new()
      let n2 = Node.new()
      Graph.addNode(g, n1, true)
      Graph.addNode(g, n2, true)
      expect(xy(g.nodes[n2.id])).not.toEqual({ x: 0, y: 0 })
    })

    test("addNodes()", function() {
      let g = Graph.new()
      let n1 = Node.new()
      let n2 = Node.new()
      expect(values(g.nodes).length).toEqual(0)
      Graph.addNodes(g, [n1, n2])
      expect(values(g.nodes).length).toEqual(2)
    })

    test("removeNode()", function() {
      let n = Node.new()
      let g = Graph.new()
      expect(g.nodes[n.id]).toBeFalsy()
      Graph.addNode(g, n)
      expect(g.nodes[n.id]).toBeTruthy()
      Graph.removeNode(g, n.id)
      expect(g.nodes[n.id]).toBeFalsy()
      Graph.addNode(g, n)
      expect(g.nodes[n.id]).toBeTruthy()
    })

    test("updateNode", function() {
      let n = Node.new()
      let g = Graph.new()
      Graph.addNode(g, n)
      expect(g.nodes[n.id].scale).toEqual(1)
      Graph.updateNode(g, n.id, { scale: 2 })
      expect(g.nodes[n.id].scale).toEqual(2)
    })

    test("removeNode", function() {
      let g = Graph.new()
      let n1 = Node.new()
      let n2 = Node.new()
      Graph.addNodes(g, [n1, n2])
      let e = Edge.new( { node1_id: n1.id, node2_id: n2.id })
      Graph.addEdge(g, e)
      Graph.removeNode(g, n2.id)
      expect(Object.keys(g.nodes)).toEqual([n1.id])
      expect(Object.values(g.edges).length).toEqual(0)
    })

    test("moveNode", function() {
      let n = Node.new({x: 1, y: 2})
      let g = Graph.new()
      Graph.addNode(g, n)
      expect(xy(g.nodes[n.id])).toEqual({x: 1, y: 2})
      Graph.moveNode(g, n.id, {x: 2, y: 4})
      expect(xy(g.nodes[n.id])).toEqual({x: 3, y: 6})
    })
  })

  describe("Edges", function() {
    let n1, n2, n3, g, edge

    beforeEach(function() {
      n1 = Node.new()
      n2 = Node.new()
      n3 = Node.new()
      g = Graph.new()
      Graph.addNodes(g, [n1, n2, n3])
      edge = Edge.new({ node1_id: n1.id, node2_id: n2.id })
    })

    test("addEdge", function() {
      expect(g.edges).toEqual({})
      Graph.addEdge(g, edge)
      expect(g.edges).toEqual({ [edge.id]: edge })
      // shouldn't be able to add edge where node1 = node2
      let weirdEdge = Edge.new({ node1_id: n1.id, node2_id: n1.id })
      Graph.addEdge(g, weirdEdge)
      expect(g.edges).toEqual({ [edge.id]: edge })
    })

    test("addEdgeIfNodes", function() {
      expect(g.edges).toEqual({})
      let weirdEdge = Edge.new({ node1_id: n1.id, node2_id: n1.id })
      Graph.addEdgeIfNodes(g, weirdEdge)
      expect(g.edges).toEqual({})
    })

    test("addSimilarEdges", function() {
      expect(g.edges).toEqual({})
      let node1 = Node.new({ x: -100, y: -100 })
      let node2 = Node.new({ x: 100, y: 100 })
      let edges = [1, 2, 3].map(() => Edge.newEdgeFromNodes(node1, node2))
      Graph.addNodes(g, [node1, node2])
      Graph.addSimilarEdges(g, edges)
      edges = values(g.edges)
      // control points for these edges should be reasonably far apart
      let { cx: x1, cy: y1 } = edges[0]
      let { cx: x2, cy: y2 } = edges[1]
      let { cx: x3, cy: y3 } = edges[2]
      expect(distance({ x: x1, y: y1 }, { x: x2, y: y2 })).toBeGreaterThan(20)
      expect(distance({ x: x2, y: y2 }, { x: x3, y: y3 })).toBeGreaterThan(20)
      expect(distance({ x: x1, y: y1 }, { x: x3, y: y3 })).toBeGreaterThan(20)
    })

    test("removeEdge", function() {
      Graph.addEdge(g, edge)
      expect(g.edges).toEqual({ [edge.id]: edge })
      Graph.removeEdge(g, edge.id)
      expect(g.edges).toEqual({})
    })

    test("removeEdge by id", function() {
      Graph.addEdge(g, edge)
      expect(g.edges).toEqual({ [edge.id]: edge })
      Graph.removeEdge(g, edge.id)
      expect(g.edges).toEqual({})
    })

    test("updateEdge", function() {
      Graph.addEdge(g, edge)
      expect(g.edges[edge.id].url).toBeFalsy()
      expect(g.edges[edge.id].label).toEqual("New Edge")
      Graph.updateEdge(g, edge.id, { url: 'http://example.com', label: 'example label' })
      expect(g.edges[edge.id].url).toEqual('http://example.com')
      expect(g.edges[edge.id].label).toEqual('example label')
    })
  })

  describe('dragging', function() {
    let node1, node2, node3, edge1, edge2, graph

    beforeEach(function() {
      node1 = Node.new({x: 5, y: 10})
      node2 = Node.new({x: 10, y: 20})
      node3 = Node.new({x: 20, y: 40})
      edge1 = Edge.newEdgeFromNodes(node1, node2)
      edge2 = Edge.newEdgeFromNodes(node2, node3)
      graph = Graph.new()
      Graph.addNodes(graph, [node1, node2, node3])
      Graph.addEdgesIfNodes(graph, [edge1, edge2])
    })

    test('moveNode', function() {
      let node = Node.new({x: 10, y: 20 })
      let graph = Graph.new()
      Graph.addNode(graph, node)
      expect(xy(graph.nodes[node.id])).toEqual({ x: 10, y: 20 })
      Graph.moveNode(graph, node.id, { x: -2,  y: -5 })
      expect(xy(graph.nodes[node.id])).toEqual({ x: 8, y: 15 })
    })
  })

  describe('calculateCenter()', function() {
    it("calculates for default graph", function() {
      let graph = Graph.new()
      expect(calculateCenter(graph)).toEqual({ x: 0, y: 0 })
    })
  })

  describe('connectedNodeIds', function() {
    let graph, n1, n2, n3, n4, e1, e2

    it('returns connected node ids', function() {
      graph = Graph.new()
      n1 = Node.new()
      n2 = Node.new()
      n3 = Node.new()
      n4 = Node.new()
      e1 = Edge.newEdgeFromNodes(n1, n2)
      e2 = Edge.newEdgeFromNodes(n1, n3)
      Graph.addNodes(graph, [n1, n2, n3, n4])
      Graph.addEdgesIfNodes(graph, [e1, e2])
      let connectedNodeIds = Graph.connectedNodeIds(graph, n1.id)
      expect(connectedNodeIds).toContain(n2.id)
      expect(connectedNodeIds).toContain(n3.id)
    })
  })

  describe('littleSisNodes', function() {
    it('returns only the LittleSis connected nodes', function() {
      let graph = Graph.new()
      Graph.addNodes(graph, [Node.new({id: '100'}),
                             Node.new({id: '200'}),
                             Node.new({id: 'abc'})])
      expect(Graph.littleSisNodes(graph).length).toEqual(2)
    })
  })

  describe('calculateViewBox', function() {
    let n1, n2, n3, c, nodes, edges, captions

    it('returns padded viewbox', function() {
      n1 = Node.new({ x: -100, y: 0 })
      n2 = Node.new({ x: 50, y: -100 })
      n3 = Node.new({ x: 100, y: -50 })
      c = Caption.new({ x: 50, y: 50, width: 100, height: 100 })
      nodes = [n1, n2, n3]
      edges = []
      captions = [c]
      expect(Graph.calculateViewBox(nodes, edges, captions)).toEqual({
        minX: -100 - GRAPH_PADDING_X,
        minY: -100 - GRAPH_PADDING_Y,
        w: 250 + 2 * GRAPH_PADDING_X,
        h: 250 + 2 * GRAPH_PADDING_Y
      })
    })
  })
})
