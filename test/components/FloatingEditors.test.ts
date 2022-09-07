import { screen, waitFor } from '@testing-library/react'
import FloatingEditors from '../../app/components/FloatingEditors'
import { simpleGraph } from '../helpers'

test('renders nothing unless editing', async () => {
  const result = renderWithStore(FloatingEditors, null, { display: { modes: { editor: false } } } )
  expect(screen.queryByTestId("oligrapher-floating-editor")).toBeNull()
})

test('renders nothing when there is no open menu', async () => {
  const result = renderWithStore(FloatingEditors, null, { graph: simpleGraph, display: { modes: { editor: true } } } )
  expect(screen.queryByTestId("oligrapher-floating-editor")).toBeNull()
})

//   it("shows edit edge menu", function() {
//     let node1 = Node.new({ name: 'Person', url: 'https://example.com' })
//     let node2 = Node.new({ name: 'Corporation', url: 'https://exmaple.com' })
//     let edge = Edge.newEdgeFromNodes(node1, node2)
//     Graph.addNodes(state.graph, [node1, node2])
//     Graph.addEdge(state.graph, edge)
//     FloatingEditor.set(state.display, 'edge', edge.id, { x: 0, y: 0 })
//     store = createMockStore(state)
//     wrapper = mountWithStore(store, <FloatingEditors />)
//     expect(wrapper.find(EdgeEditor)).to.have.lengthOf(1)
//   })

//   it("hides edit edge menu after edge delete", function() {
//     let node1 = Node.new({ name: 'Person', url: 'https://example.com' })
//     let node2 = Node.new({ name: 'Corporation', url: 'https://exmaple.com' })
//     let edge = Edge.newEdgeFromNodes(node1, node2)
//     Graph.addNodes(state.graph, [node1, node2])
//     Graph.addEdge(state.graph, edge)
//     FloatingEditor.set(state.display, 'edge', edge.id)
//     store = createMockStore(state)
//     wrapper = mountWithStore(store, <FloatingEditors />)
//     expect(wrapper.find(EditorSubmitButtons)).to.have.lengthOf(1)
//     let button = wrapper.find("button[name='delete']")
//     button.simulate("click")
//     expect(wrapper.find(EdgeEditor)).to.have.lengthOf(0)
//   })
// })
