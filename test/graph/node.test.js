import Node from '../../app/graph/node'

describe('Node', function() {
  describe("Node.new", function() {
    it("sets id", function() {
      expect(Node.new().id).to.be.ok
    })

    it("merges in values", function() {
      let n = Node.new({ x: 1, y: 2})
      expect(n.x).to.eql(1)
      expect(n.y).to.eql(2)
    })
  })
})
