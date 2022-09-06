import { screen, waitFor } from '@testing-library/react'
import NodeTool from '../../app/components/NodeTool'

const data = [
  {
    "id": "13173",
    "name": "Bob Casey",
    "description": "US Senator from Pennsylvania (2007-present)",
    "image": "https://littlesis.org/images/profile/8e/8e7f36e2a8a4952c17de0e1c53417c37ae675285_1226033390.png",
    "url": "https://littlesis.org/person/13173-Bob_Casey"
  },
  {
    "id": "14002",
    "name": "Bob Dole",
    "description": "former US Representative and Senator from Kansas | lobbyist",
    "image": "https://littlesis.org/images/profile/d6/d6c0f0ef9296da7f8c6d476a1c40260210ce8873_1226042056.png",
    "url": "https://littlesis.org/person/14002-Bob_Dole"
  }
]

const server = setupServer(jsonHandler('/oligrapher/find_nodes', data))
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('NodeTool layout', async function() {
  const result = renderWithStore(NodeTool)
  expect(result.container.querySelectorAll(".oligrapher-toolbox").length).toEqual(1)
  expect(screen.getByText("Add Node")).toBeInTheDocument()
  expect(result.container.querySelectorAll("input").length).toEqual(1)
  expect(result.container.querySelector("input")['placeholder']).toBeTruthy()
})

test("Finding and adding nodes with NodeTool", async function() {
  const result = renderWithStore(NodeTool)
  expect(result.container.querySelectorAll("a").length).toEqual(0)

  await result.user.click(screen.queryByTestId("add-node-input"))
  await result.user.keyboard("bo")
  expect(result.container.querySelectorAll(".entity-search-results").length).toEqual(0)
  await result.user.keyboard("bob")
  await waitFor(() => expect(screen.getAllByTestId('entity-search-result').length).toEqual(2))
  expect(result.container.querySelectorAll(".entity-search-results a").length).toEqual(4)
  expect(Object.keys(result.store.getState().graph.nodes).length).toEqual(0)
  await result.user.click(screen.queryAllByTestId("entity-search-result-addnode")[0])

  let nodes = Object.values(result.store.getState().graph.nodes)
  expect(nodes.length).toEqual(1)
  expect(nodes[0].name).toEqual("Bob Casey")
})
