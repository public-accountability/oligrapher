// Polyfill "window.fetch"
import 'whatwg-fetch'
import '@testing-library/jest-dom'

import { rest } from 'msw'
import  { setupServer } from 'msw/node'

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
