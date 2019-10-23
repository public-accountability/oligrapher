// import Graph from '../../app/graph/graph'
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
})
