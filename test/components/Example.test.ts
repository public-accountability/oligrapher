import React from 'react'
import { Provider } from 'react-redux'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import Example from '../../app/components/Example'
import createOligrapherStore from '../../app/util/store'

const server = setupServer(
  rest.get('/hello', (req, res, ctx) => {
    return res(
      ctx.delay(),
      ctx.text("world")
    )
  })
)

const renderWithStore = (Element, props = null, configuration = {}) => {
  const store = createOligrapherStore(configuration)
  const app = React.createElement(Provider, { store: store }, React.createElement(Element, props))
  return { store, ...render(app) }
}

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('Example Component', async () => {
  const result = renderWithStore(Example, null, { attributes: { id: 123 }})
  // console.log(result.debug())
  expect(screen.queryByTestId('example-loading')).toBeTruthy()
  expect(screen.queryByTestId('example-results')).toBeNull()

  await waitFor(() => {
    expect(screen.getByTestId('example-results')).toBeInTheDocument()
  })

  expect(screen.queryByTestId('example-results').textContent).toEqual('world')
})
