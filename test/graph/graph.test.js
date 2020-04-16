import curry from 'lodash/curry'
import values from 'lodash/values'
import Graph, {
  getId,
  determineNodeNumber,
  calculateCenter,
  GRAPH_PADDING
} from '../../app/graph/graph'
import Node from '../../app/graph/node'
import Edge from '../../app/graph/edge'
import { xy } from '../../app/util/helpers'

describe('Graph', function() {
  describe("Helpers", function() {
    specify('getId', function() {
      expect(getId('one')).to.eql('one')
      expect(getId(123)).to.eql('123')
      expect(() => getId({ foo: 'bar' })).to.throw()
      expect(() => getId(()=>{})).to.throw()
      expect(getId({id: 123})).to.eql('123')
    })

    specify("new()", function() {
      let g = Graph.new()
      expect(g.nodes).to.eql({})
      expect(g.edges).to.eql({})
      expect(Graph.new()).not.to.eq(Graph.new())
    })

    specify('determineNodeNumber', function() {
      let n1 = Node.new()
      let n2 = Node.new()
      let edge = Edge.newEdgeFromNodes(n1, n2)
      expect(determineNodeNumber({edge, node: n1})).to.eql(1)
      expect(determineNodeNumber({edge, node: n2})).to.eql(2)
      expect(() => determineNodeNumber({edge, node: Node.new()})).to.throw(/Edge is not connected/)
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
      Graph.addEdges(graph, [e1, e2])
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
      expect(nodesOf(e1)).to.eql([n1, n2])
      expect(nodesOf(e2.id)).to.eql([n2, n3])
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
      Graph.addNode(g, n)
      expect(g.nodes[n.id]).to.be.ok
      expect(xy(g.nodes[n.id])).to.eql({ x: 0, y: 0 })
    })

    specify("addNode() - placed away from center", function() {
      let g = Graph.new()
      let n1 = Node.new()
      let n2 = Node.new()
      Graph.addNode(g, n1)
      Graph.addNode(g, n2)
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
      Graph.removeNode(g, n)
      expect(g.nodes[n.id]).not.to.be.ok
      Graph.addNode(g, n)
      expect(g.nodes[n.id]).to.be.ok
      Graph.removeNode(g, n.id)
      expect(g.nodes[n.id]).not.to.be.ok
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
      Graph.removeNode(g, n2)
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
    })

    specify("addEdges", function() {
      expect(g.edges).to.eql({})
      let edges = [Edge.new(), Edge.new()]
      Graph.addEdges(g, edges)
      expect(values(g.edges)).to.have.lengthOf(2)
    })

    specify("removeEdge", function() {
      Graph.addEdge(g, edge)
      expect(g.edges).to.eql({ [edge.id]: edge })
      Graph.removeEdge(g, edge)
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
      expect(g.edges[edge.id].url).to.eql(null)
      expect(g.edges[edge.id].label).to.eql(null)
      Graph.updateEdge(g, edge.id, { url: 'http://example.com', label: 'example label'})
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
      Graph.addEdges(graph, [edge1, edge2])
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

  describe('addConnection()', function() {
    let graph, node, newNode, newEdge

    beforeEach(function() {
      graph = Graph.new()
      node = Node.new()
      newNode = Node.new()
      newEdge = Edge.newEdgeFromNodes(node, newNode, { id: "someid" })
      Graph.addNode(graph, node)
    })

    it("creates a new node", function() {
      expect(values(graph.nodes)).to.have.lengthOf(1)

      Graph.addConnection(graph, { 
        existingNodeId: node.id,
        newNode,
        newEdge 
      })

      expect(values(graph.nodes)).to.have.lengthOf(2)
    })

    it("creates a new edge", function() {
      expect(values(graph.edges)).to.have.lengthOf(0)

      Graph.addConnection(graph, { 
        existingNodeId: node.id,
        newNode,
        newEdge
      })

      expect(values(graph.edges)).to.have.lengthOf(1)
    })

    it("sets the edge id to be the same as the relationship id", function() {
      Graph.addConnection(graph, { 
        existingNodeId: node.id,
        newNode,
        newEdge
      })

      expect(graph.edges[newEdge.id]).to.be.ok
    })

    it("doesn't add existing node or edge", function() {
      let node2 = Node.new()
      Graph.addNode(graph, node2)
      let edge = Edge.newEdgeFromNodes(node, node2, { id: "someid" })
      Graph.addEdge(graph, edge)
      newNode.id = node2.id
      newEdge.id = edge.id

      Graph.addConnection(graph, { 
        existingNodeId: node.id,
        newNode,
        newEdge
      })
      
      expect(values(graph.nodes)).to.have.lengthOf(2)
      expect(values(graph.edges)).to.have.lengthOf(1)
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
      Graph.addEdges(graph, [e1, e2])
      expect(Graph.connectedNodeIds(graph, n1)).to.have.members([n2.id, n3.id])
    })
  })

  describe('calculateViewBox', function() {
    let graph, n1, n2, n3

    it('returns padded viewbox', function() {
      graph = Graph.new()
      n1 = Node.new({ x: -100, y: 0 })
      n2 = Node.new({ x: 50, y: -100 })
      n3 = Node.new({ x: 100, y: -50 })
      Graph.addNodes(graph, [n1, n2, n3])
      expect(Graph.calculateViewBox(graph)).to.eql({ 
        minX: -100 - GRAPH_PADDING, 
        minY: -100 - GRAPH_PADDING,
        w: 200 + 2 * GRAPH_PADDING,
        h: 100 + 2 * GRAPH_PADDING
      })
    })
  })
})
