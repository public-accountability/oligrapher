import Node from '../../app/models/Node'

xdescribe("Node", function() {

  it("default values for x, y, and scale", function() {
    let node = new Node()
    expect(node.x).to.be.null
    expect(node.y).to.be.null
    expect(node.scale).to.eql(1)
  })

  it("get circle return attributes for <NodeCircle>", function(){
    let node = new Node({x: 1, y: 2, scale: 1.5})
    expect(node.circle).to.eql({
      cx: 1,
      cy: 2,
      r: 37.5,
      fill: '#ccc'
    })
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
