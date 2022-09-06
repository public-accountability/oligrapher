import { screen } from '@testing-library/react'
import Header from '../../app/components/Header'
import { wrapInThemeProvider } from '../helpers'

const attributes =  {
  title: "Example Title",
  subtitle: "Example Subtitle",
  user: { id: "1", "name": "Bob", "url": "https://example.com/bob" },
  owner: { id: "1", "name": "Bob", "url": "https://example.com/bob" }
}


test('Shows title in Header', async () => {
  const result  = renderWithStore(wrapInThemeProvider(createElement(Header)), null, { attributes, settings: { noEditing: true} })
  expect(result.container.querySelector("#oligrapher-header")).toBeTruthy()
  expect(result.container.querySelector("h1#oligrapher-title").textContent).toEqual("Example Title")
  expect(screen.queryByTestId("oligrapher-header-toggler")).not.toBeInTheDocument()
  expect(screen.queryByTestId("oligrapher-title-input")).not.toBeInTheDocument()
})


test('Shows toggler and input when editor', async () => {
  const result  = renderWithStore(wrapInThemeProvider(createElement(Header)), null, { attributes })
  expect(result.container.querySelector("#oligrapher-header")).toBeTruthy()
  expect(screen.queryByTestId("oligrapher-header-toggler")).toBeInTheDocument()
  expect(screen.queryByTestId("oligrapher-title-input")).toBeInTheDocument()
})
