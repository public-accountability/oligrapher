import curry from 'lodash/curry'
import values from 'lodash/values'
import Graph, { getId } from '../../app/graph/graph'
import Node from '../../app/graph/node'
import Edge from '../../app/graph/edge'

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
  })

  describe("Getters", function() {
    let n1, n2, n3, n4, graph, e1, e2

    beforeEach(function() {
      n1 = Node.new({ display: { x: -10, y: 30 } })
      n2 = Node.new({ display: { x: 0, y: -30 } })
      n3 = Node.new({ display: { x: 10, y: 0 } })
      n4 = Node.new({ display: { x: 0, y: 0 } })
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
      let n1 = Node.new({ display: { x: -10, y: 30 } })
      let n2 = Node.new({ display: { x: 0, y: -30 } })
      let n3 = Node.new({ display: { x: 10, y: 0 } })
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
    specify("addNode()", function() {
      let g = Graph.new()
      let n = Node.new({ display: { x: 1, y: 1 } })
      expect(g.nodes).to.eql({})
      Graph.addNode(g, n)
      expect(g.nodes).to.eql({ [n.id]: n })
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
      expect(g.nodes[n.id].display.scale).to.eql(1)
      Graph.updateNode(g, n.id, { scale: 2 })
      expect(g.nodes[n.id].display.scale).to.eql(2)
    })

    specify("moveNode")
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

    specify("updateEdge", function() {
      Graph.addEdge(g, edge)
      expect(g.edges[edge.id].display.url).to.eql(null)
      expect(g.edges[edge.id].display.label).to.eql(null)
      Graph.updateEdge(g, edge.id, { url: 'http://example.com', label: 'example label'})
      expect(g.edges[edge.id].display.url).to.eql('http://example.com')
      expect(g.edges[edge.id].display.label).to.eql('example label')
    })

    specify("moveEdgeNode")
  })

  describe("Dragging", function() {
    specify("dragNode")
    specify("dragEdge")
  })
})



  // describe("Graph.api()", function() {
  //   let n1, n2

  //   beforeEach(function() {
  //     n1 = Node.new()
  //     n2 = Node.new()
  //   })

  //   it("returns new graph by default", function() {
  //     expect(Graph.api().graph()).to.eql(Graph.new())
  //   })

  //   it("can add nodes in a chain", function() {
  //     let g = Graph.api().addNode(n1).addNode(n2).graph()
  //     expect(values(g.nodes)).to.have.lengthOf(2)
  //   })
  // })


  // describe("edgesOf", function() {
  //   let n1, n2, n3, n4, edge1, edge2, graph

  //   beforeEach(function() {
  //     n1 = Node.new()
  //     n2 = Node.new()
  //     n3 = Node.new()
  //     n4 = Node.new()

  //     edge1 = Edge.new({node1_id: n1.id, node2_id: n2.id})
  //     edge2 = Edge.new({node1_id: n2.id, node2_id: n3.id})

  //     graph = Graph.api()
  //                  .addNode(n1)
  //                  .addNode(n2)
  //                  .addNode(n3)
  //                  .addNode(n4)
  //                  .addEdge(edge1)
  //                  .addEdge(edge2)
  //                  .graph()
  //   })

  //   it("returns array of edges", function() {
  //     let edgesForN1 = Graph.edgesOf(graph, n1.id)
  //     let edgesForN2 = Graph.edgesOf(graph, n2.id)
  //     let edgesForN3 = Graph.edgesOf(graph, n3.id)
  //     let edgesForN4 = Graph.edgesOf(graph, n4.id)
  //     expect(edgesForN1).to.be.an('Array')
  //     expect(edgesForN1).to.have.lengthOf(1)
  //     expect(edgesForN2).to.have.lengthOf(2)
  //     expect(edgesForN3).to.have.lengthOf(1)
  //     expect(edgesForN4).to.have.lengthOf(0)
  //   })
  // })

  // describe("Edge functions", function() {
  //   let n1, n2, n3, edge

  //   beforeEach(function() {
  //     n1 = Node.new()
  //     n2 = Node.new()
  //     n3 = Node.new()
  //     edge = Edge.new({node1_id: n1.id, node2_id: n2.id})
  //   })

  //   it("Adds Edge", function() {
  //     let g = Graph.new()
  //     expect(g.edges).to.eql({})
  //     let updatedGraph = Graph.addEdge(g, edge)
  //     expect(updatedGraph.edges).to.eql({ [edge.id]: edge })
  //   })

  //   it("Removes Edges", function() {
  //     let g = Graph.addEdge(Graph.new(), edge)
  //     expect(g.edges).to.eql({ [edge.id]: edge })
  //     let updatedGraph = Graph.removeEdge(g, edge)
  //     expect(updatedGraph.edges).to.eql({})
  //   })


  // })
