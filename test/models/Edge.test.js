import Edge from '../../app/models/Edge'


describe("Edge", function() {
  it("Generates an id", function() {
    let edge = new Edge()
    expect(edge.id).to.be.a('string')
  })

  it("has object tag ", function() {
    expect(new Edge().toString()).to.eql('[object Edge]')
  })
})
