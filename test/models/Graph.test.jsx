import Graph from '../../app/models/Graph'
import Node from '../../app/models/Node'

describe.only("Graph (model)", function() {
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

  describe('updateNode()', function() {

    it("throws error if node does not exist in the graph", function(){
      let graph = new Graph()
      expect(() => graph.updateNode('123', { foo: 'bar'}))
        .to.throw()
    })

    it('Updates the node', function() {
      let node = new Node({id: 123, scale: 1})
      let graph = new Graph({ nodes: { '123': node } })
      expect(graph.nodes['123'].scale).to.eq(1)
      graph.updateNode('123', { scale: 2 })
      expect(graph.nodes['123'].scale).to.eq(2)
    })
  })
})
