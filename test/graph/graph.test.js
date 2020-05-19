import curry from 'lodash/curry'
import values from 'lodash/values'
import Graph, {
  determineNodeNumber,
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
    specify("new()", function() {
      let g = Graph.new()
      expect(g.nodes).to.eql({})
      expect(g.edges).to.eql({})
      expect(Graph.new()).not.to.eq(Graph.new())
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

    specify("edgesOf", function() {
      let edgesOf = curry(Graph.edgesOf)(graph)
      expect(edgesOf(n1.id)).to.have.lengthOf(1)
      expect(edgesOf(n2.id)).to.have.lengthOf(2)
      expect(edgesOf(n3.id)).to.have.lengthOf(1)
      expect(edgesOf(n4.id)).to.have.lengthOf(0)
    })

    specify("nodesOf", function() {
      let nodesOf = curry(Graph.nodesOf)(graph)
      // we don't compare the full nodes because adding edges gives the nodes edgeIds
      expect(nodesOf(e1.id).map(node => node.id)).to.eql([n1.id, n2.id])
      expect(nodesOf(e2.id).map(node => node.id)).to.eql([n2.id, n3.id])
    })
  })

  describe("Stats", function() {
    let graph

    beforeEach(function() {
      let n1 = Node.new({ x: -10, y: 30 })
      let n2 = Node.new({ x: 0, y: -30 })
      let n3 = Node.new({ x: 10, y: 0 })
      let edge = Edge.newEdgeFromNodes(n1, n2)
      graph = Graph.new()
      Graph.addNodes(graph, [n1, n2, n3])
      Graph.addEdge(graph, edge)
    })

    specify("nodeCount", function() {
      expect(Graph.stats(graph).nodeCount).to.eql(3)
    })

    specify("edgeCount", function() {
      expect(Graph.stats(graph).edgeCount).to.eql(1)
    })

    specify("min and max node XY values", function() {
      let stats = Graph.stats(graph)
      expect(stats.minNodeX).to.eql(-10)
      expect(stats.minNodeY).to.eql(-30)
      expect(stats.maxNodeX).to.eql(10)
      expect(stats.maxNodeY).to.eql(30)
    })
  })

  describe("Nodes", function() {
    specify("addNode() - with values", function() {
      let g = Graph.new()
      let n = Node.new({ x: 1, y: 1 })
      expect(g.nodes).to.eql({})
      Graph.addNode(g, n)
      expect(g.nodes).to.eql({ [n.id]: n })
    })

    specify("addNode() - placed at center", function() {
      let g = Graph.new()
      let n = Node.new()
      expect(g.nodes).to.eql({})
      Graph.addNode(g, n, true)
      expect(g.nodes[n.id]).to.be.ok
      expect(xy(g.nodes[n.id])).to.eql({ x: 0, y: 0 })
    })

    specify("addNode() - placed away from center", function() {
      let g = Graph.new()
      let n1 = Node.new()
      let n2 = Node.new()
      Graph.addNode(g, n1, true)
      Graph.addNode(g, n2, true)
      expect(xy(g.nodes[n2.id])).not.to.eql({ x: 0, y: 0 })
    })

    specify("addNodes()", function() {
      let g = Graph.new()
      let n1 = Node.new()
      let n2 = Node.new()
      expect(values(g.nodes).length).to.eq(0)
      Graph.addNodes(g, [n1, n2])
      expect(values(g.nodes).length).to.eq(2)
    })

    specify("removeNode()", function() {
      let n = Node.new()
      let g = Graph.new()
      expect(g.nodes[n.id]).not.to.be.ok
      Graph.addNode(g, n)
      expect(g.nodes[n.id]).to.be.ok
      Graph.removeNode(g, n.id)
      expect(g.nodes[n.id]).not.to.be.ok
      Graph.addNode(g, n)
      expect(g.nodes[n.id]).to.be.ok
    })

    specify("updateNode", function() {
      let n = Node.new()
      let g = Graph.new()
      Graph.addNode(g, n)
      expect(g.nodes[n.id].scale).to.eql(1)
      Graph.updateNode(g, n.id, { scale: 2 })
      expect(g.nodes[n.id].scale).to.eql(2)
    })

    specify("removeNode", function() {
      let g = Graph.new()
      let n1 = Node.new()
      let n2 = Node.new()
      Graph.addNodes(g, [n1, n2])
      let e = Edge.new( { node1_id: n1.id, node2_id: n2.id })
      Graph.addEdge(g, e)
      Graph.removeNode(g, n2.id)
      expect(Object.keys(g.nodes)).to.eql([n1.id])
      expect(Object.values(g.edges)).to.have.lengthOf(0)
    })

    specify("moveNode", function() {
      let n = Node.new({x: 1, y: 2})
      let g = Graph.new()
      Graph.addNode(g, n)
      expect(xy(g.nodes[n.id])).to.eql({x: 1, y: 2})
      Graph.moveNode(g, n.id, {x: 2, y: 4})
      expect(xy(g.nodes[n.id])).to.eql({x: 3, y: 6})
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

    specify("addEdge", function() {
      expect(g.edges).to.eql({})
      Graph.addEdge(g, edge)
      expect(g.edges).to.eql({ [edge.id]: edge })
      // shouldn't be able to add edge where node1 = node2
      let weirdEdge = Edge.new({ node1_id: n1.id, node2_id: n1.id })
      Graph.addEdge(g, weirdEdge)
      expect(g.edges).to.eql({ [edge.id]: edge })
    })

    specify("addEdgeIfNodes", function() {
      expect(g.edges).to.eql({})
      let weirdEdge = Edge.new({ node1_id: n1.id, node2_id: n1.id })
      Graph.addEdgeIfNodes(g, weirdEdge)
      expect(g.edges).to.eql({})
    })

    specify("addSimilarEdges", function() {
      expect(g.edges).to.eql({})
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
      expect(distance({ x: x1, y: y1 }, { x: x2, y: y2 })).to.be.above(20)
      expect(distance({ x: x2, y: y2 }, { x: x3, y: y3 })).to.be.above(20)
      expect(distance({ x: x1, y: y1 }, { x: x3, y: y3 })).to.be.above(20)
    })

    specify("removeEdge", function() {
      Graph.addEdge(g, edge)
      expect(g.edges).to.eql({ [edge.id]: edge })
      Graph.removeEdge(g, edge.id)
      expect(g.edges).to.eql({})
    })

    specify("removeEdge by id", function() {
      Graph.addEdge(g, edge)
      expect(g.edges).to.eql({ [edge.id]: edge })
      Graph.removeEdge(g, edge.id)
      expect(g.edges).to.eql({})
    })

    specify("updateEdge", function() {
      Graph.addEdge(g, edge)
      expect(g.edges[edge.id].url).not.to.be.ok
      expect(g.edges[edge.id].label).to.eql("New Edge")
      Graph.updateEdge(g, edge.id, { url: 'http://example.com', label: 'example label' })
      expect(g.edges[edge.id].url).to.eql('http://example.com')
      expect(g.edges[edge.id].label).to.eql('example label')
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

    specify('moveNode', function() {
      let node = Node.new({x: 10, y: 20 })
      let graph = Graph.new()
      Graph.addNode(graph, node)
      expect(xy(graph.nodes[node.id])).to.eql({ x: 10, y: 20 })
      Graph.moveNode(graph, node.id, { x: -2,  y: -5 })
      expect(xy(graph.nodes[node.id])).to.eql({ x: 8, y: 15 })
    })
  })

  describe('calculateCenter()', function() {
    it("calculates for default graph", function() {
      let graph = Graph.new()
      expect(calculateCenter(graph)).to.eql({ x: 0, y: 0 })
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
      expect(Graph.connectedNodeIds(graph, n1.id)).to.have.members([n2.id, n3.id])
    })
  })

  describe('calculateViewBox', function() {
    let graph, n1, n2, n3, c

    it('returns padded viewbox', function() {
      graph = Graph.new()
      n1 = Node.new({ x: -100, y: 0 })
      n2 = Node.new({ x: 50, y: -100 })
      n3 = Node.new({ x: 100, y: -50 })
      c = Caption.new({ x: 50, y: 50, width: 100, height: 100 })
      Graph.addNodes(graph, [n1, n2, n3])
      Graph.addCaption(graph, c)
      expect(Graph.calculateViewBox(graph)).to.eql({ 
        minX: -100 - GRAPH_PADDING_X, 
        minY: -100 - GRAPH_PADDING_Y,
        w: 250 + 2 * GRAPH_PADDING_X,
        h: 250 + 2 * GRAPH_PADDING_Y
      })
    })
  })
})
