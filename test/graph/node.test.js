// import Graph from '../../app/graph/graph'
import Node from '../../app/graph/node'

describe('Node', function() {
  describe("Node.new", function() {
    it("sets id", function() {
      expect(Node.new().id).to.be.ok
    })
    it("merges in values", function() {
      let n = Node.new({display: { x: 1, y: 2}})
      expect(n.display.x).to.eql(1)
      expect(n.display.y).to.eql(2)
    })
  })
})
