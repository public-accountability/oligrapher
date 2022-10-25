import { screen, waitFor, act } from "@testing-library/react"
import { simpleGraph } from "../helpers"
import EdgeEditor from "../../app/components/EdgeEditor"

test("EdgeEditor", async () => {
  const result = renderWithStore(EdgeEditor, { id: "EW7LJH8ml" }, { graph: simpleGraph })

  act(() => {
    result.store.dispatch({ type: "CLICK_EDGE", id: "EW7LJH8ml" })
  })

  expect(screen.queryByTestId("oligrapher-edge-editor")).toBeInTheDocument()
  // Removing an edge
  // expect(Object.keys(result.store.getState().graph.edges).includes("EW7LJH8ml")).toBeTruthy()
  // act(() => {
  //   result.store.dispatch({ type: "REMOVE_EDGE", id: "EW7LJH8ml" })
  // })
  // expect(Object.keys(result.store.getState().graph.edges).includes("EW7LJH8ml")).toBeFalsy()
})
