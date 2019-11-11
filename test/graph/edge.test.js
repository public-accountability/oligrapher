// import Graph from '../../app/graph/graph'
import Node from '../../app/graph/node'
import Edge from '../../app/graph/edge'

describe('Edge', function() {
  describe("Edge.new", function() {
    it("sets id", function() {
      expect(Edge.new().id).to.be.ok
    })

    it("merges in values", function() {
      let e = Edge.new({node1_id: 'a', node2_id: 'b'})
      expect(e.node1_id).to.eql('a')
      expect(e.node2_id).to.eql('b')
    })
  })

  specify('newEdgeFromNodes', function() {
    let n1 = Node.new()
    let n2 = Node.new()
    let edge = Edge.newEdgeFromNodes(n1, n2)
    expect(edge.node1_id).to.eql(n1.id)
    expect(edge.node2_id).to.eql(n2.id)
  })
})
