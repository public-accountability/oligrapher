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
  })

  describe("Edge functions", function(){
    let n1, n2, edge

    beforeEach(function(){
      n1 = Node.new()
      n2 = Node.new()
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
