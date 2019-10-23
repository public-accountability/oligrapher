import Graph from '../../app/graph/graph'
import Node from '../../app/graph/node'

describe.only('Graph', function() {
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
})
