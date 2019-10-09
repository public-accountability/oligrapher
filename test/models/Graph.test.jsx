import Graph from '../../app/models/Graph'

describe("Graph (model)", function() {
  it("sets default values", function(){
    let graph = new Graph()
    expect(graph.nodes).to.eql({})
    expect(graph.edges).to.eql({})
    expect(graph.captions).to.eql({})
    expect(graph.annoations).to.eql([])
    expect(graph.zoom).to.eql(1)
    expect(graph.center).to.eql([0,0])
  })

  it("that's [object Graph] to you", function() {
    expect(new Graph().toString()).to.eql('[object Graph]')
  })
})
