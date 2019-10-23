import values from 'lodash/values'
import Graph from '../../app/graph/graph'
import Node from '../../app/graph/node'
import Edge from '../../app/graph/edge'


describe('Graph', function() {

  it("Graph.new", function() {
    let g = Graph.new()
    expect(g.nodes).to.eql({})
    expect(g.edges).to.eql({})
    expect(Graph.new()).not.to.eq(Graph.new())
  })

  it("Adds node", function() {
    let g = Graph.new()
    let n = Node.new({ display: { x: 1, y: 1 } })
    expect(g.nodes).to.eql({})
    let updatedGraph = Graph.addNode(g, n)
    expect(updatedGraph.nodes).to.eql({ [n.id]: n })
    expect(g.nodes).to.eql({}) // original should not change
  })

  it("Removes Node", function() {
    let n = Node.new()
    let g = Graph.addNode(Graph.new(), n)
    expect(g.nodes[n.id]).to.be.ok
    let updatedGraph = Graph.removeNode(g, n)
    expect(g.nodes[n.id]).to.be.ok
    expect(updatedGraph.nodes).to.eql({})
  })


  describe("Graph.api()", function() {
    let n1, n2

    beforeEach(function() {
      n1 = Node.new()
      n2 = Node.new()
    })

    it("returns new graph by default", function() {
      expect(Graph.api().graph()).to.eql(Graph.new())
    })

    it("can add nodes in a chain", function() {
      let g = Graph.api().addNode(n1).addNode(n2).graph()
      expect(values(g.nodes)).to.have.lengthOf(2)
    })
  })


  describe("edgesOf", function() {
    let n1, n2, n3, n4, edge1, edge2, graph

    beforeEach(function() {
      n1 = Node.new()
      n2 = Node.new()
      n3 = Node.new()
      n4 = Node.new()

      edge1 = Edge.new({node1_id: n1.id, node2_id: n2.id})
      edge2 = Edge.new({node1_id: n2.id, node2_id: n3.id})

      graph = Graph.api()
                   .addNode(n1)
                   .addNode(n2)
                   .addNode(n3)
                   .addNode(n4)
                   .addEdge(edge1)
                   .addEdge(edge2)
                   .graph()
    })

    it("returns array of edges", function() {
      let edgesForN1 = Graph.edgesOf(graph, n1.id)
      let edgesForN2 = Graph.edgesOf(graph, n2.id)
      let edgesForN3 = Graph.edgesOf(graph, n3.id)
      let edgesForN4 = Graph.edgesOf(graph, n4.id)
      expect(edgesForN1).to.be.an('Array')
      expect(edgesForN1).to.have.lengthOf(1)
      expect(edgesForN2).to.have.lengthOf(2)
      expect(edgesForN3).to.have.lengthOf(1)
      expect(edgesForN4).to.have.lengthOf(0)
    })
  })

  describe("Edge functions", function() {
    let n1, n2, n3, edge

    beforeEach(function() {
      n1 = Node.new()
      n2 = Node.new()
      n3 = Node.new()
      edge = Edge.new({node1_id: n1.id, node2_id: n2.id})
    })

    it("Adds Edge", function() {
      let g = Graph.new()
      expect(g.edges).to.eql({})
      let updatedGraph = Graph.addEdge(g, edge)
      expect(updatedGraph.edges).to.eql({ [edge.id]: edge })
    })

    it("Removes Edges", function() {
      let g = Graph.addEdge(Graph.new(), edge)
      expect(g.edges).to.eql({ [edge.id]: edge })
      let updatedGraph = Graph.removeEdge(g, edge)
      expect(updatedGraph.edges).to.eql({})
    })


  })
})
