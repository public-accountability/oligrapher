import Node from '../../app/graph/node'

describe('Node', function() {
  describe("Node.new", function() {
    it("sets id", function() {
      expect(Node.new().id).toBeTruthy()
    })

    it("merges in values", function() {
      let n = Node.new({ x: 1, y: 2})
      expect(n.x).toEqual(1)
      expect(n.y).toEqual(2)
    })
  })
})
