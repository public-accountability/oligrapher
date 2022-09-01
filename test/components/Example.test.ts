import { screen, waitFor } from '@testing-library/react'
import Example from '../../app/components/Example'

const server = setupServer(
  rest.get('/hello', (req, res, ctx) => {
    return res(
      ctx.delay(),
      ctx.text("world")
    )
  })
)

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
