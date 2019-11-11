import values from 'lodash/values'
import Graph, { getId } from '../../app/graph/graph'
import Node from '../../app/graph/node'
import Edge from '../../app/graph/edge'

describe.only('Graph', function() {
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
    specify("edgesOf")
    specify("nodesOf")
  })

  describe("Stats", function() {
    let graph

    beforeEach(function() {
      let n1 = Node.new({ display: { x: -10, y: 30 } })
      let n2 = Node.new({ display: { x: 0, y: -30 } })
      let n3 = Node.new({ display: { x: 10, y: 0 } })
      graph = Graph.new()
      Graph.addNodes(graph, [n1, n2, n3])
    })

    specify("nodeCount", function() {
      expect(Graph.stats(graph).nodeCount).to.eql(3)
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

    specify("updateNode")
    specify("moveNode")
  })

  describe("Edges", function() {
    specify("addEdge")
    specify("removeEdge")
    specify("updateEdge")
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
