// import Graph from '../../app/models/Graph'
// import Node from '../../app/models/Node'
// import Edge from '../../app/models/Edge'

// describe("Graph (model)", function() {
//   it("sets default values", function(){
//     let graph = new Graph()
//     expect(graph.nodes).to.eql({})
//     expect(graph.edges).to.eql({})
//     expect(graph.captions).to.eql({})
//     expect(graph.annoations).to.eql([])
//     expect(graph.zoom).to.eql(1)
//     expect(graph.center).to.eql([0,0])
//   })

//   it("that's [object Graph] to you", function() {
//     expect(new Graph().toString()).to.eql('[object Graph]')
//   })

//   describe('updateNode()', function() {

//     it("throws error if node does not exist in the graph", function(){
//       let graph = new Graph()
//       expect(() => graph.updateNode('123', { foo: 'bar'}))
//         .to.throw()
//     })

//     it('Updates the node', function() {
//       let node = new Node({id: 123, scale: 1})
//       let graph = new Graph({ nodes: { '123': node } })
//       expect(graph.nodes['123'].scale).to.eq(1)
//       graph.updateNode('123', { scale: 2 })
//       expect(graph.nodes['123'].scale).to.eq(2)
//     })
//   })

//   describe.only('edgesOf', function() {
//     // n0 <--e0---> n1 <---e1--> n2
//     let nodes = {
//       'n0': new Node({id: 'n0', x: 0, y: 0}),
//       'n1': new Node({id: 'n1', x: 1, y: 1}),
//       'n2': new Node({id: 'n2', x: 2, y: 2}),
//       'n3': new Node({id: 'n3', x: 3, y: 3}),
//     }

//     let edges = {
//       'e0': new Edge({id: 'e0', node1: nodes['n0'], node2: nodes['n1'] }),
//       'e1': new Edge({id: 'e1', node1: nodes['n1'], node2: nodes['n2'] })
//     }

//     let graph

//     beforeEach(function(){
//       graph = new Graph({ nodes, edges })
//     })

//     it("returns arry of edges", function() {
//       let edges = graph.edgesOf('n0')
//       expect(edges).to.be.an('Array')
//       expect(edges[0]).to.be.an('Edge')
//     })

//     it("returns one edge for n0", function() {
//       expect(graph.edgesOf('n0')).to.have.lengthOf(1)
//     })

//     it("returns one edge for n2", function() {
//       expect(graph.edgesOf('n2')).to.have.lengthOf(1)
//     })

//     it("returns both edges for n1", function() {
//       expect(graph.edgesOf('n1')).to.have.lengthOf(2)
//     })

//     it("returns zero edges for n3", function() {
//       expect(graph.edgesOf('n3')).to.have.lengthOf(0)
//     })

//   })
// })
