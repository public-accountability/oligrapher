// import Graph from '../../app/graph/graph'
import Node from '../../app/graph/node'
import Edge, { edgeCoordinates } from '../../app/graph/edge'

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
    let n1 = Node.new({x: 1, y: 1})
    let n2 = Node.new({x: 2, y: 2})
    let edge = Edge.newEdgeFromNodes(n1, n2)
    expect(edge.node1_id).to.eql(n1.id)
    expect(edge.node2_id).to.eql(n2.id)
    expect(edge.x1).to.eql(1)
    expect(edge.y1).to.eql(1)
    expect(edge.s1).to.eql(1)
    expect(edge.x2).to.eql(2)
    expect(edge.y2).to.eql(2)
    expect(edge.s2).to.eql(1)
  })

  describe('edgeCoordinates', function() {
    const newNodeCoords = {x: 100, y: 200}

    it('returns node 1 position', function() {
      expect(edgeCoordinates(1, newNodeCoords)).to.eql({x1: 100, y1: 200})
    })

    it('updates node 2 position', function() {
      expect(edgeCoordinates(2, newNodeCoords)).to.eql({x2: 100, y2: 200})
    })
  })
})
