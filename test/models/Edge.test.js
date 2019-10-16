import Edge from '../../app/models/Edge'
import Node from '../../app/models/Node'


describe("Edge", function() {
  let edge

  before(function() {
    edge = new Edge({
      node1: new Node({ x: 0, y: 0 }),
      node2: new Node({ x: 10, y: 10 })
    })
  })


  it("Generates an id", function() {
    expect(edge.id).to.be.a('string')
  })

  it("has object tag ", function() {
    expect(edge.toString()).to.eql('[object Edge]')
  })
})
