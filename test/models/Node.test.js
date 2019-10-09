import Node from '../../app/models/Node'

describe("Node", function() {

  it("default values for x, y, and scale", function() {
    let node = new Node()
    expect(node.x).to.be.null
    expect(node.y).to.be.null
    expect(node.scale).to.eql(1)
  })

  it("Generates shortId", function() {
    let node = new Node()
    expect(node.id).to.be.a('string')
  })

  it("accepts provided ID", function(){
    let node = new Node({id: 'CUSTOM_ID'})
    expect(node.id).to.eql('CUSTOM_ID')
  })

})
