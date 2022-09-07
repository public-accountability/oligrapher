import { screen, waitFor } from '@testing-library/react'
import { simpleGraph } from '../helpers'
import EdgeEditor from '../../app/components/EdgeEditor'

test('EdgeEditor', async () => {
  const result = renderWithStore(EdgeEditor, { id: "EW7LJH8ml" }, { graph: simpleGraph } )
  // result.store.dispatch({ type: 'CLICK_EDGE', id: "EW7LJH8ml" })
  expect(screen.queryByTestId("edge-editor-mainpage")).toBeInTheDocument()
  expect(screen.queryByTestId("edge-editor-submit-buttons")).toBeInTheDocument()
  // Removing an edge
  // expect(Object.keys(result.store.getState().graph.edges).includes("EW7LJH8ml")).toBeTruthy()
  // await result.user.click(screen.getByTestId("edge-editor-delete-button"))
  // expect(Object.keys(result.store.getState().graph.edges).includes("EW7LJH8ml")).toBeFalsy()
})
